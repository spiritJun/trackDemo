<template>
  <div class="alreadyPriceLine">
    <h1 class="navi-title">设置竞标有效期</h1>
    <div class="contain">
      <ComTable
        ref="dataTable"
        :table-data="tableData"
        :columns="columns"
        :table-option="tableOption"
        :has-select="false"
        :listQuery="listQuery"
        :dynamicColumnSetting="false"
        :showAlwaysShowColumnInCheckbox="true"
        @getList="getList"
        :alwaysShowColumnIndexs="[0, 2]"
        :paging="false"
      >
      </ComTable>
    </div>
    <set-validity
      :priceDiaVisible.sync="setVisible"
      @close="diaClose"
      :hour="hour"
      @sureHandle="sureHandle"
    />
  </div>
</template>

<script>
import ComTable from "@/components/PageTable";
import SetValidity from "./childComp/setValidity";
const shipperIdentityTypeMap = {
  "1": "公司",
  "2": "信息部"
};
export default {
  components: { ComTable, SetValidity },
  data() {
    return {
      listQuery: {
        pageNo: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [],

      bidStartTime: {},
      bidEndTime: {},

      columns: [],

      dialogFormVisible: false,

      cloneListQuery: {},
      // 弹窗
      setVisible: false,
      hour: 0
    };
  },
  created() {
    this.getList();
    this.columns = [
      {
        label: "有效时间（小时）",
        param: "hour",
        isShowTooltip: true,
        align: "left",
        width: "200px"
      },
      {
        label: "修改时间",
        isShowTooltip: true,
        param: "updateTime",
        align: "left",
        // className: "tablePic",
        width: "200px"
        // isImgView: true
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
            label: "设置竞标有效期",
            type: "primary",
            event: this.checkPriceHandle,
            isShow: item => {
              //是否显示
              return true;
            }
          }
        ]
      };
    }
  },
  methods: {
    // 查询
    getList() {
      this.$api.brokerweb.getBidEffectiveTime().then(res => {
        if (res.data.code === "000000200") {
          const data = res.data.result;
          this.tableData = [data];

          if (this.$refs.dataTable) {
            let res1 = {
              rows: this.tableData,
              pageNo: 1,
              pageSize: 10,
              totalPages: 36,
              totalRecords: 360
            };
            this.$refs.dataTable.callback(res1);
          }
        }
      });
    },
    // 设置竞标有效期
    checkPriceHandle(row) {
      this.setVisible = true;
      this.hour = row.hour;
    },
    // 关闭弹窗
    diaClose() {
      this.setVisible = false;
    },
    // 弹窗确实事件
    sureHandle() {
      this.getList();
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.alreadyPriceLine {
}
</style>
