<template>
  <div class="com_table">
    <!-- 
      /**
      * @elementui中table的第二次封装，分为表头columns、内容区tableData、操作列tableOption三个数组
        1、列中可插入图片（使用v-viewer放大预览）isImgView必传true，可自定义className(但需要在此组件中维护样式)
        2、列表可插入自定义标签及点击事件，自定义render方法，通过h函数创建标签
        3、列中可插入tag标签，必传isTag为true，可自定义formatData和type
        4、可自定义操作列，可以控制操作按钮的显示隐藏isShow(回调函数)，按钮权限btnpermission
        5、列中靠右的金额处理，isMoney必传true
      * @prop(Json) 
      * @return: 数组
      */ 
    -->
    <el-table
      ref="comTable"
      :data="tableData"
      :border="border"
      tooltip-effect="dark"
      row-key="id"
      style="width:100%"
      :size="size"
      @selection-change="handlerSelectChange"
      @select="handlerSelect"
      @select-all="handlerSelectAll"
    >
      <!-- 暂无数据 -->
      <template slot="empty">
        <div class="custom-empty">暂无数据</div>
      </template>

      <!-- 复选框 :selectable="checkSelectable" -->
      <el-table-column v-if="hasSelect" type="selection" width="38">
      </el-table-column>

      <!-- 序号 -->
      <el-table-column v-if="hasNumber" fixed width="60px" label="序号">
        <template slot-scope="scope">
          <span>{{
            (listQuery.pageNo - 1) * listQuery.pageSize + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>

      <!-- 表格其余各列 -->
      <!--  注释width设置 样式影响ly
          :width="item.width ? item.width : ''" -->
      <template v-for="(item, index) in columns">
        <el-table-column
          :key="index"
          :minWidth="item.width ? item.width : ''"
          :align="item.align"
          :label="item.label"
          :prop="item.param"
          v-if="columnVisibles[index]"
          :show-overflow-tooltip="
            item.isShowTooltip ? item.isShowTooltip : false
          "
          :sortable="item.sortable ? 'custom' : false"
        >
          <template slot-scope="scope">
            <!-- 自己创建元素 -->
            <create-dom
              v-if="item.render"
              :column="item"
              :row="scope.row"
              :render="item.render"
              :index="index"
            ></create-dom>
            <!-- 图片 -->
            <template v-else-if="item.isImgView">
              <div class="view" v-viewer.rebuild="imgOptions">
                <img
                  :src="scope.row[item.param]"
                  alt=""
                  :class="item.className"
                  v-show="scope.row[item.param]"
                />
              </div>
            </template>
            <!-- tag标签 -->
            <template v-else-if="item.isTag">
              <el-tag size="mini" :type="item.type(scope.row)">
                {{ item.formatData(scope.row[item.param]) }}
              </el-tag>
            </template>
            <!-- 如果是金额 -->
            <template v-else-if="item.isMoney">
              <span>{{ scope.row[item.param] | getThousand }}</span>
            </template>
            <span v-else>{{ scope.row[item.param] }}</span>
          </template>
        </el-table-column>
      </template>

      <!-- 操作列 -->

      <!-- v-hasPermission='item.btnpermission' -->
      <template v-if="tableOption">
        <el-table-column
          v-if="tableOption.label"
          :fixed="tableOption.fixed"
          :width="tableOption.width"
          :min-width="tableOption.minWidth"
          :label="tableOption.label"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <template v-for="(item, index) in tableOption.options">
              <el-button
                :key="index"
                :type="item.type"
                :size="tableOption.size ? tableOption.size : ''"
                :plain="tableOption.plain ? tableOption.plain : false"
                v-if="item.isShow ? item.isShow(scope.row) : false"
                :icon="item.icon"
                @click="item.event(scope.row)"
              >
                {{ item.label }}
              </el-button>
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>
<script>
import { getThousandNum, tableCellClassName, arr2obj } from "@/utils";
import merge from "lodash/merge";
import Viewer from "v-viewer";
import Vue from "vue";
Vue.use(Viewer);
export default {
  name: "ComTable",
  components: {
    createDom: {
      functional: true,
      props: {
        row: Object,
        render: Function,
        index: Number,
        column: {
          type: Object,
          default: null
        }
      },
      render: (h, ctx) => {
        const params = {
          row: ctx.props.row,
          index: ctx.props.index
        };
        if (ctx.props.column) params.column = ctx.props.column;
        return ctx.props.render(h, params);
      }
    }
  },
  props: {
    hasSelect: {
      // 是否有选择框
      type: Boolean,
      default: false
    },
    border: {
      // 是否有border
      type: Boolean,
      default: false
    },
    hasNumber: {
      // 是否有序号
      type: Boolean,
      default: true
    },
    tableData: {
      // table表单Object
      type: Array,
      default: () => []
    },
    columns: {
      // table表头数据
      type: Array,
      default: () => []
    },
    tableOption: {
      // 操作功能按钮数据
      type: Object,
      default: () => {}
    },
    size: {
      //table尺寸 medium / small / mini, 默认medium
      type: String,
      default: "medium"
    },
    listQuery: {
      //分页的额外参数,序号使用
      type: Object,
      default: () => {}
    },
    columnVisibles: {
      //列可见性，初始需要设置全true。列下标从0开始
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      imgOptions: {
        navbar: false,
        zIndex: 99999999999999999,
        title: false,
        toolbar: {
          zoomIn: true,
          zoomOut: true,
          rotateLeft: true,
          rotateRight: true
        }
      }
    };
  },
  created() {
    // console.log(this.columns, "columns2");
    // console.log(this.columnVisibles, "columnVisibles2");
  },
  filters: {
    getThousand(num) {
      if (num) {
        let m = (num / 100).toFixed(2);
        return getThousandNum(m);
      } else {
        return num;
      }
    }
  },
  computed: {},
  methods: {
    handlerSelectAll(val) {
      // 全选
      // this.$emit("handlerSelectAll", val);
      this.$bus.$emit("handlerSelectAll", val);
    },
    handlerSelect(value, obj) {
      // 选中项
      // console.log(value)
      // this.$emit('handlerSelect', value)
      this.$bus.$emit("handlerSelect", value);
    },
    handlerSelectChange(value) {
      // 选择修改
      this.$emit("handlerSelectChange", value);
    },
    /* // 是否可选择
    checkSelectable(row, index) {
      if(row.id === 215693) {
        return false
      } else {
        return true
      }
    } */
  }
};
</script>
<style lang="scss">
.com_table {
  width: 100%;
  .tablePic {
    width: 40px;
    height: 40px;
    cursor: pointer;
    vertical-align: middle;
  }
  .el-table td.is-right,
  .el-table th.is-right {
    padding-right: 10px;
  }
  .column-danger{
    color:#FF3A30;
  }
  .column-success{
    color:#96A9F5;
  }
  .column-warn{
    color:#FFAC26;
  }
  .column-info{
    color:#5574EF;
  }
  .el-button{
    border-radius: 14px!important;
    border: none!important;
  }
  .el-button--warning.is-plain{
    color: #B47EED!important;
    background: #F0E5FB!important;
    &:hover,&:focus{
      color: #ffffff!important;
      background: #B47EED!important;
    }
  }
  .el-button--primary.is-plain{
    color: #3ED6A4!important;
    background: #D8F7ED!important;
    &:hover,&:focus{
      color: #ffffff!important;
      background: #3ED6A4!important;
    }
  }
}
</style>
