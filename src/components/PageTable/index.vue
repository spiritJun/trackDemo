<template>
    <el-container class="el-container" v-loading="tableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
        <!-- 动态列 -->
        <div v-if="dynamicColumnSetting" class="rightFixedSet">
            <i class="el-icon-s-grid columnSettingBtn" @click="() => (showSetContainer = !showSetContainer)"></i>
        </div>
        <el-dialog v-el-drag-dialog="showSetContainer" title="动态列设置" :modal-append-to-body="false" :close-on-click-modal="true" v-if="columnInfos && columnInfos.length > 0"
            :visible.sync="showSetContainer" width="600px">
            <el-checkbox-group v-model="visibleIndexs" :min="1" class="col-setting-group">
                <!-- :min最少得有一个-->
                <el-checkbox v-for="colInfo in columnInfos" :label="colInfo.index" :key="colInfo.index" :disabled="colInfo.disabled" v-show="!colInfo.disabled || showAlwaysShowColumnInCheckbox">
                    {{ colInfo.label }}
                </el-checkbox>
            </el-checkbox-group>
        </el-dialog>
        <slot name="table"></slot>
        <ComTable ref="pageTable" :table-data="tableData" :columns="columns" :table-option="tableOption" :has-select="hasSelect" :hasNumber="hasNumber" :listQuery="listQuery"
            :columnVisibles="columnVisibles"></ComTable>

        <!-- 底部分页 -->
        <el-footer v-if="paging" class="footer">
            <div class="pagination-wrap">
                <pagination :total="totalSize" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" :params="listQuery" @pagination="getList" />
            </div>
        </el-footer>
    </el-container>
</template>

<script>
import ComTable from "./ComTable";
/*
动态列实现思路：
1、将表格、分页、动态列的设置整合在一个组件里
2、表格中将公共的empty占位及序号抽离在公共组件里，使用插槽占位允许插入更多列的内容
3、分页组件引用已经封装好的pagination，并将分页参数及分页方法传递过去：
  3.1、设置后端分页查询的方法：设置getList事件属性。（组件会通过$emit来触发调用该方法，传递参数：listQuery分页参数对象）
  3.2、通过$refs调用组件的callback方法，传递分页信息给组件。（用于组件渲染表格）
4、通过表格字段定制功能动态设置展示列：
  4.1、开启动态列功能：设置dynamicColumnSetting属性为true。
  4.2、设置列可见性：设置columnVisibles属性（初始为全true），并在每个列标签中使用v-if引用对应column-key的值，从0开始。
  4.3、设置初始隐藏的列的下标数组：设置hidenColumnIndexs属性，列下标从0开始。
  4.4、设置不允许隐藏的列的下标数组：设置alwaysShowColumnIndexs属性，列下标从0开始。
  4.5、设置是否在checkbox显示不允许隐藏的列信息：设置showAlwaysShowColumnInCheckbox属性。
5、存储数据：
  5.1、初始化，没有操作过动态列设置的，visibleIndexs和columnInfos里的值相同
  5.2、key相同，在同一个页面操作
*/

import Pagination from "@/components/Pagination";
import elDragDialog from "@/directive/el-dragDialog";
// import {mapState} from 'vuex'
// import { getColumSetting } from "@/utils/auth";
export default {
    name: "page-table",
    components: { Pagination, ComTable },
    directives: { elDragDialog },
    props: {
        // 1、表格
        data: {
            type: Array,
            require: true,
            default: () => [],
        },
        columns: {
            // table表头数据
            type: Array,
            default: () => [],
        },
        tableOption: {
            // 操作功能按钮数据
            type: Object,
            default: () => { },
        },
        hasSelect: {
            // 是否有选择框
            type: Boolean,
            default: false,
        },
        hasNumber: {
            // 是否有序号
            type: Boolean,
            default: true,
        },

        // 2、分页
        paging: {
            //是否分页，默认为true，即分页。
            type: Boolean,
            default: true,
        },
        listQuery: {
            //分页的额外参数
            type: Object,
            default: () => { },
        },

        //3、动态列
        dynamicColumnSetting: {
            //是否开启动态列设置
            type: Boolean,
            default: false,
        },
        hidenColumnIndexs: {
            //初始隐藏的列的下标。列下标从0开始
            type: Array,
            default: () => [],
        },
        alwaysShowColumnIndexs: {
            //总是显示的列的下标（不可隐藏的列）。列下标从0开始
            type: Array,
            default: () => [],
        },
        showAlwaysShowColumnInCheckbox: {
            //总是显示的列是否在checkbox中显示，默认显示
            type: Boolean,
            default: true,
        },
    },
    data () {
        return {
            tableData: [], // 表格展示数据
            totalSize: 0, //
            columnInfos: [], // 所有列的信息
            visibleIndexs: [], // 可见列的下标集合
            tableLoading: false, // 后端分页的loading
            showSetContainer: false,
            columnVisibles: [], //列可见性，初始需要设置全true。列下标从0开始
            keyArry: [], //初始所有列的index,做缓存时用
            columSettingResult: [],//从缓存中设置列的数组
        };
    },
    computed: {
        // ...mapState({
        //   columSettingResult: state => state.permission.columSettingResult,
        // })
    },
    watch: {
        visibleIndexs (newValue, oldValue) {
            let willHideIndexs = [],
                willShowIndexs = [];

            willShowIndexs = newValue.filter((index) => {
                return oldValue.indexOf(index) === -1;
            });

            willHideIndexs = oldValue.filter((index) => {
                return newValue.indexOf(index) === -1;
            });
            this.oprColumns(willShowIndexs, true);
            this.oprColumns(willHideIndexs, false);
            // const name = this.$route.name;
            // let settionArry = new Object();
            // settionArry={key:name,value:newValue}
            // this.$store.commit('COLUM_SETTING_RESULT',settionArry)
            // this.columSettingResult = JSON.parse(getColumSetting('columSettingResult'));
        },
    },
    created () {
        // console.log(this.columns,"comein")
        this.getList();
    },
    mounted () {
        // this.columSettingResult = JSON.parse(getColumSetting('columSettingResult'));
        console.log(this.columSettingResult);
        let self = this;
        if (self.columns.length > 0 && self.dynamicColumnSetting) {
            self.columns.forEach((columnIns, index) => {
                self.columnInfos.push({
                    label: columnIns.label,
                    index: index,
                    disabled: columnIns.disabled,
                });
                self.visibleIndexs.push(index);
            });
            // console.log(self.visibleIndexs, " self.visibleIndexs444");
            // 处理总是显示的列（不可隐藏的列）
            self.alwaysShowColumnIndexs.forEach(
                (key) => (self.columnInfos[key].disabled = true)
            );
            // 处理初始隐藏的列
            self.oprColumns(self.hidenColumnIndexs, false);

            // 缓存处理：记录初始展示的列的下标，从缓存中取
            // const columSettingResult = this.columSettingResult;
            // console.log( this.columSettingResult,'columSettingResult')
            // const name = this.$route.name;
            // for(let i in columSettingResult){
            //   if(columSettingResult[i].key === name){
            //     self.visibleIndexs = columSettingResult[i].value;
            //       console.log(self.visibleIndexs,'self.visibleIndexs')
            //   }
            // }
            // 存储页面默认可勾选的数组
            // self.columnInfos.forEach(
            //   (item,index) => {
            //     if(!item.disabled){
            //       self.keyArry.push(item.index);
            //     }
            //   }
            // );
            // this.oprColumns(this.differenceArry(self.keyArry,self.visibleIndexs),false);
            this.oprColumns(self.visibleIndexs, true);
        }
    },
    methods: {
        oprColumns (indexs, isShow) {
            indexs.forEach((index) => {
                this.$set(this.columnVisibles, index, isShow);
            });
        },
        getList () {
            /*
            @params getList 触发父组件后端分页查询事件别名
            @params this.listQuery  分页查询参数
            */
            this.tableLoading = true;
            this.$emit("getList", this.listQuery);
        },
        //后台分页请求返回时的回调方法，设置分页信息，渲染表格
        callback (res) {
            console.log(res, 4444)
            this.columnVisibles = new Array(this.columns.length).fill(true);
            this.tableData = res.rows;
            //初始化改变表头数据，添加disabled属性，设置总是不可隐藏的列
            this.columns.map((item, index) => {
                return (item.disabled = false);
            });
            // console.log(this.columns, "this.columns");

            this.totalSize = res.totalRecords;
            this.tableLoading = false;
        },
        // 数组求差值
        differenceArry (a, b) {
            return a.filter((v) => b.indexOf(v) == -1);
        },
    },
};
</script>

<style lang="scss" scoped>
.el-container {
    /deep/ .el-checkbox {
        width: 155px;
    }

    .rightFixedSet {
        height: 20px;
        text-align: right;
        margin-bottom: 10px;

        .columnSettingBtn {
            font-size: 25px;
            color: #666;
            cursor: pointer;
        }
    }

    .footer {
        height: 120px !important;
        padding: 0;
    }
}
</style>