<template>
  <div class="alreadyPriceLine">
    <h1 class="navi-title">分配竞标线路</h1>
    <div class="contain">
      <div class="search-wrap">
        <el-form
          :inline="true"
          :model="listQuery"
          ref="listQuery"
          class="search-form"
        >
          <el-form-item label="通知单号：">
            <el-input
              class="el-input-interval"
              v-model.trim="listQuery.noticeNo"
              placeholder="请输入通知单号"
              style="width: 210px;"
              @keyup.enter.native="submitForm()"
            ></el-input>
          </el-form-item>
          <el-form-item label="装车地：">
            <el-input
              v-model.trim="listQuery.deliverAddressName"
              placeholder="请输入装车地"
              @keyup.enter.native="submitForm()"
            ></el-input>
          </el-form-item>
          <el-form-item label="卸车地：">
            <el-input
              v-model.trim="listQuery.takeAddressName"
              placeholder="请输入卸车地"
              @keyup.enter.native="submitForm()"
            ></el-input>
          </el-form-item>
          <el-form-item label="通知单同步时间：" class="dateTimeContainer">
            <el-date-picker
              v-model="listQuery.syncStartTime"
              :picker-options="syncStartTime"
              @change="
                checkTime(
                  listQuery.syncStartTime,
                  listQuery.syncEndTime,
                  'syncStartTime',
                  'syncEndTime'
                )
              "
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="00:00:00"
              placeholder="请选择开始时间"
            >
            </el-date-picker>
            <span>至</span>
            <el-date-picker
              v-model="listQuery.syncEndTime"
              :picker-options="syncEndTime"
              @change="
                checkTime(
                  listQuery.syncStartTime,
                  listQuery.syncEndTime,
                  'syncStartTime',
                  'syncEndTime'
                )
              "
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="23:59:59"
              placeholder="请选择结束时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item class="search-fr">
            <el-button type="primary" @click="submitForm()">查询</el-button>
            <el-button type="primary" plain @click="resetForm()"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div>
        <ComTable
          ref="dataTable"
          :table-data="tableData"
          :columns="columns"
          :table-option="tableOption"
          :listQuery="listQuery"
          :dynamicColumnSetting="true"
          :showAlwaysShowColumnInCheckbox="true"
          @getList="getList"
          :alwaysShowColumnIndexs="[0, 2]"
        >
        </ComTable>
      </div>
    </div>
    <!-- 竞价线路查看 -->
    <check-dia
      :priceDiaVisible.sync="priceDiaVisible"
      @close="diaClose"
      :getDiaData="getDiaData"
      :noticeId="noticeId"
      title="竞价线路查看"
    />
    <!-- 竞标线路分配 -->
    <check-dia
      :priceDiaVisible.sync="selectVisible"
      :select="hasSelect"
      title="竞标线路分配"
      @close="diaClose()"
      :getDiaData="getDiaData"
      :noticeId="noticeId"
      @sureHandle="sureHandle"
    />
  </div>
</template>

<script>
import ComTable from "@/components/PageTable";
import CheckDia from "./childComp/checkDia";
import { checkTime } from "@/utils";
const shipperIdentityTypeMap = {
  "1": "公司",
  "2": "信息部"
};
export default {
  components: { ComTable, CheckDia },
  data() {
    return {
      listQuery: {
        pageNo: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [],

      syncStartTime: {},
      syncEndTime: {},

      dialogFormVisible: false,

      cloneListQuery: {},
      // 标价查看弹窗
      priceDiaVisible: false,
      // 带选择select弹窗
      selectVisible: false,
      hasSelect: true,
      getDiaData: "",
      noticeId: 0,
      allocateUser: {}
    };
  },
  created() {
    this.cloneListQuery = { ...this.listQuery };
    this.getList(this.listQuery);
    this.columns = [
      {
        label: "通知单编号",
        param: "noticeNo",
        isShowTooltip: true,
        align: "left",
        width: "200px"
      },
      {
        label: "装车地",
        param: "deliverAddressName",
        isShowTooltip: true,
        align: "left",
        width: "260px"
      },
      {
        label: "卸车地",
        param: "takeAddressName",
        isShowTooltip: true,
        align: "left",
        width: "260px"
      },
      {
        label: "货物名称",
        isShowTooltip: true,
        param: "typeName",
        align: "left",
        // className: "tablePic",
        width: "180px"
        // isImgView: true
      },
      {
        label: "通知单同步时间",
        param: "createTime",
        align: "left",
        width: "170px"
        // isMoney: true
      },
      {
        label: "分配状态",
        param: "statusName",
        align: "left",
        width: "100px",
        formatData: function(val) {
          // return shipperIdentityTypeMap[val]; //shipperIdentityTypeMap必须为key,value的对象形式
          return val
        },
        render: (h, params) => {
          return h(
            "span",
            {
              class:{
                'column-success':params.row.statusName == '已完成',
                'column-info':params.row.statusName != '已完成'
              },
            },
            params.row.statusName
          );
        }
      },
      
      {
        label: "已分配数",
        param: "bidAllCount",
        // isTag: true,
        align: "left",
        width: "100px"
        /* formatData: function(val) {
                return shipperIdentityTypeMap[val]; //shipperIdentityTypeMap必须为key,value的对象形式
              }, */
      },
      {
        label: "未分配数",
        param: "bidNoneCount",
        align: "left",
        width: "100px"
      }
    ];
  },
  mounted() {},
  computed: {
    tableOption() {
      // 操作按钮配置对象
      return {
        label: "操作",
        width: "150px",
        minWidth: this.minWidth,
        size: "mini",
        plain: true,
        fixed: "right",
        options: [
          {
            label: "竞标线路分配",
            type: "primary",
            event: this.lineHandle,
            isShow: item => {
              //是否显示
              return item.statusName == "进行中" ? true : false;
            }
          },
          {
            label: "查看分配信息",
            type: "warning",
            // icon: "el-icon-view",
            event: this.checkHandle,
            isShow: item => {
              return item.statusName == "已完成" ? true : false;
            }
          }
        ]
      };
    }
  },
  methods: {
    checkTime,
    price() {
      this.priceDiaVisible = true;
    },
    exchange() {
      [this.listQuery.deliverAddressName, this.listQuery.takeAddressName] = [
        this.listQuery.takeAddressName,
        this.listQuery.deliverAddressName
      ];
    },
    // 查询
    getList(params) {
      this.$api.brokerweb.getNoticePage(params).then(res => {
        if (res.data.code === "000000200") {
          const data = res.data.result.page;
          this.tableData = [...data.list];
          this.total = data.totalPageNumber;

          if (this.$refs.dataTable) {
            let res1 = {
              rows: this.tableData,
              pageNo: params.pageNo,
              pageSize: params.pageSize,
              totalPages: data.totalPageNumber,
              totalRecords: data.rowsCount
            };
            this.$refs.dataTable.callback(res1);
          }
        }
      });
    },

    sureHandle() {
      this.getList(this.listQuery);
    },

    //处理过多时间
    handleTimeFn(arr) {
      arr.forEach(item => {
        this[item] = {
          disabledDate(time) {
            return "";
          },
          selectableRange: "00:00:00 - 23:59:59"
        };
      });
    },
    /* 查询按钮提交 */
    submitForm(formName) {
      this.listQuery.pageNo = 1;
      let params = this.listQuery;
      this.getList(params);
    },
    /* 重置 */
    resetForm() {
      this.handleTimeFn(["syncStartTime", "syncEndTime"]);
      this.listQuery = { ...this.cloneListQuery };
      this.getList(this.listQuery);
    },

    /* 查看分配信息操作 */
    checkHandle(rows) {
      this.priceDiaVisible = true;
      this.noticeId = rows.id;
      this.getDiaData = "this.$api.brokerweb.getBidInfoList(params)";
    },
    diaClose() {
      this.priceDiaVisible = false;
      this.selectVisible = false;
    },
    // 竞标线路分配弹窗
    lineHandle(rows) {
      console.log("竞标线路分配弹窗");
      this.selectVisible = true;
      this.getDiaData = "this.$api.brokerweb.getBidUserList(params)";
      this.noticeId = rows.id;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.alreadyPriceLine {
  
}
</style>
