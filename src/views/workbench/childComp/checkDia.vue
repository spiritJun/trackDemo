<template>
  <el-dialog
    :title="title"
    width="800px"
    :visible.sync="priceDiaVisible"
    v-el-drag-dialog="priceDiaVisible"
    :before-close="diaClose"
  >
    <ComTable
      ref="dataTable"
      :table-data="tableData"
      :columns="columns"
      :table-option="tableOption"
      :has-select="select"
      :listQuery="listQuery"
      :dynamicColumnSetting="false"
      :showAlwaysShowColumnInCheckbox="true"
      @getList="getList"
      :alwaysShowColumnIndexs="[0, 2]"
      :paging="false"
    >
    </ComTable>
    <div slot="footer" class="dia-handle" v-if="select">
      <el-button @click="diaClose" size="medium">取消</el-button>
      <el-button
        @click="sureHandle"
        type="primary"
        size="medium"
        :loading="btnLoading"
        >确定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import ComTable from "@/components/PageTable";
import elDragDialog from "@/directive/el-dragDialog";
export default {
  directives: { elDragDialog },
  components: { ComTable },
  props: {
    priceDiaVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
    select: {
      type: Boolean,
      default: false
    },
    getDiaData: {
      type: String,
      default: ""
    },
    noticeId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      listQuery: {
        pageNo: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [],
      columns: [],
      tableOption: {},
      selectArr: [],
      btnLoading: false
    };
  },
  mounted() {
    // handlerSelect
    this.$bus.$on("handlerSelect", this.selectHandle);
    // 全选
    this.$bus.$on("handlerSelectAll", this.selectAllHandle);

    switch (this.title) {
      case "标价查看":
        this.columns = [
          {
            label: "派单员",
            param: "userName",
            isShowTooltip: true,
            align: "left",
            width: ""
          },
          {
            label: "手机号",
            param: "userMobile",
            isShowTooltip: true,
            align: "left",
            width: ""
          },
          {
            label: "竞标价（元/吨）",
            isShowTooltip: true,
            param: "freight",
            align: "right",
            width: ""
          },
          {
            label: "竞标时间",
            param: "updateTime",
            align: "left",
            width: ""
          }
        ];
        break;
      case "竞价线路查看":
        this.columns = [
          {
            label: "派单员",
            param: "userName",
            isShowTooltip: true,
            align: "left",
            width: ""
          },
          {
            label: "手机号",
            param: "userMobile",
            isShowTooltip: true,
            align: "left",
            width: ""
          },
          {
            label: "分配时间",
            isShowTooltip: true,
            param: "createTime",
            align: "left",
            width: ""
          }
        ];
        break;
      case "竞标线路分配":
        this.columns = [
          {
            label: "派单员",
            param: "name",
            isShowTooltip: true,
            align: "left",
            width: ""
          },
          {
            label: "手机号",
            param: "mobile",
            isShowTooltip: true,
            align: "left",
            width: ""
          }
        ];
        break;
    }
  },
  destroyed() {
    this.$bus.$off("handlerSelect", this.selectHandle);
    this.$bus.$off("handlerSelectAll", this.selectAllHandle);
  },
  methods: {
    selectHandle(value) {
      const selectArr = value.map(item => ({
        userId: item.id,
        noticeId: this.noticeId,
        userMobile: item.mobile,
        userName: item.name
      }));
      this.selectArr = [...selectArr];
    },
    // 全选
    selectAllHandle(value) {
      console.log(value);
      const selectArr = value.map(item => ({
        userId: item.id,
        noticeId: this.noticeId,
        userMobile: item.mobile,
        userName: item.name
      }));
      this.selectArr = [...selectArr];
    },
    /*关闭弹窗*/
    diaClose() {
      this.$emit("close");
      this.btnLoading = false;
      // this.$emit('update:priceDiaVisible',false)
    },
    sureHandle() {
      console.log(this.selectArr);
      this.btnLoading = true;
      const params = { list: this.selectArr };
      console.log(params);
      this.$api.brokerweb.addBatchBidInfo(params).then(res => {
        if (res.data.code === "000000200") {
          const data = res.data.result;
          console.log(data);
          this.btnLoading = false;
          this.$emit("sureHandle");
          this.$emit("close");
        }
      });
    },
    getList(params) {
      // this.tableData = []
      if (!this.getDiaData) {
        return;
      }
      eval(this.getDiaData).then(res => {
        console.log(res);
        if (res.data.code === "000000200") {
          const data = res.data.result.list;
          this.tableData = [...data];

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
    }
  },
  computed: {},
  watch: {
    priceDiaVisible(newVal) {
      if (newVal) {
        if (this.noticeId) {
          this.listQuery.noticeId = this.noticeId;
        }
        this.getList(this.listQuery);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.dia-handle {
  text-align: right;
}
</style>
