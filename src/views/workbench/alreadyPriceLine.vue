<template>
  <div class="alreadyPriceLine">
    <h1 class="navi-title">已标价线路</h1>
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
              style="width: 210px"
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
          <el-form-item label="派单员：">
            <el-input
              class="el-input-interval"
              v-model.trim="listQuery.userName"
              placeholder="请输入派单员"
              @keyup.enter.native="submitForm()"
            ></el-input>
          </el-form-item>
          <el-form-item label="竞价时间：" class="dateTimeContainer">
            <el-date-picker
              v-model="listQuery.bidStartTime"
              :picker-options="bidStartTime"
              @change="
                checkTime(
                  listQuery.bidStartTime,
                  listQuery.bidEndTime,
                  'bidStartTime',
                  'bidEndTime'
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
              v-model="listQuery.bidEndTime"
              :picker-options="bidEndTime"
              @change="
                checkTime(
                  listQuery.bidStartTime,
                  listQuery.bidEndTime,
                  'bidStartTime',
                  'bidEndTime'
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
    <check-dia
      :priceDiaVisible.sync="priceDiaVisible"
      @close="diaClose"
      :getDiaData="getDiaData"
      :noticeId="noticeId"
      title="标价查看"
    />
    <!-- <template v-slot:content>
        我是内容
      </template>
      <template v-slot:footer>
        <el-button @click="priceClose">取消</el-button>
      <el-button>确定</el-button>
      </template> -->
    <!-- </price-dia>  -->
  </div>
</template>

<script>
import ComTable from "@/components/PageTable";
import CheckDia from "./childComp/checkDia";
import { checkTime } from "@/utils";

export default {
  components: { ComTable, CheckDia },
  data() {
    return {
      listQuery: {
        pageNo: 1,
        pageSize: 10,
      },
      total: 0,
      tableData: [],

      bidStartTime: {},
      bidEndTime: {},

      dialogFormVisible: false,

      cloneListQuery: {},

      columns: [],

      // 标价查看弹窗
      priceDiaVisible: false,
      getDiaData: "",
      noticeId: null,
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
        width: "200px",
      },
      {
        label: "装车地",
        param: "deliverAddressName",
        isShowTooltip: true,
        align: "left",
        width: "260px",
      },
      {
        label: "卸车地",
        param: "takeAddressName",
        isShowTooltip: true,
        align: "left",
        width: "260px",
      },
      {
        label: "货物名称",
        isShowTooltip: true,
        param: "typeName",
        align: "left",
        // className: "tablePic",
        width: "140px",
        // isImgView: true
      },
      {
        label: "分配竞标数",
        param: "bidAllCount",
        align: "left",
        width: "120px",
        // isMoney: true
      },
      {
        label: "参与竞标数",
        param: "bidCount",
        align: "left",
        width: "120px",
      },
      {
        label: "标价状态",
        param: "statusName",
        // isTag: true,
        align: "left",
        width: "120px",
        formatData: function (val) {
          // return shipperIdentityTypeMap[val]; //shipperIdentityTypeMap必须为key,value的对象形式
          return val;
        },
        render: (h, params) => {
          return h(
            "span",
            {
              class: {
                "column-success": params.row.statusName == "已完成",
                "column-info": params.row.statusName != "已完成",
              },
            },
            params.row.statusName
          );
        },
      },
    ];
  },
  computed: {
    tableOption() {
      // 操作按钮配置对象
      return {
        label: "操作",
        width: "120px",
        minWidth: this.minWidth,
        size: "mini",
        plain: true,
        fixed: "right",
        options: [
          {
            label: "标价查看",
            type: "primary",
            event: this.handleCreate,
            isShow: (item) => {
              //是否显示
              return true;
            },
          },
        ],
      };
    },
  },
  methods: {
    diaClose() {
      this.priceDiaVisible = false;
    },
    exchange() {
      [this.listQuery.deliverAddressName, this.listQuery.takeAddressName] = [
        this.listQuery.takeAddressName,
        this.listQuery.deliverAddressName,
      ];
    },
    // 查询
    getList(params) {
      this.$api.brokerweb.getBidNoticePage(params).then((res) => {
        if (res.data.code === "000000200") {
          const data = res.data.result.page;
          this.tableData = [...data.list];

          if (this.$refs.dataTable) {
            let res1 = {
              rows: this.tableData,
              pageNo: params.pageNo,
              pageSize: params.pageSize,
              totalPages: data.totalPageNumber,
              totalRecords: data.rowsCount,
            };
            this.$refs.dataTable.callback(res1);
          }
        }
      });
    },

    //处理过多时间
    handleTimeFn(arr) {
      arr.forEach((item) => {
        this[item] = {
          disabledDate(time) {
            return "";
          },
          selectableRange: "00:00:00 - 23:59:59",
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
      this.handleTimeFn(["bidStartTime", "bidEndTime"]);
      this.listQuery = { ...this.cloneListQuery };
      this.getList(this.listQuery);
    },

    /* 标价查看操作 */
    handleCreate(rows) {
      console.log(rows);
      this.noticeId = rows.id;
      this.priceDiaVisible = true;
      this.getDiaData = "this.$api.brokerweb.getBidInfoList(params)";
    },
    checkTime,
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
.alreadyPriceLine {
}
</style>
