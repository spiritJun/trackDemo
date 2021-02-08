<template>
  <div class="bidding-record">
    <h1 class="navi-title">已竞标线路</h1>
    <div class="contain">
      <!-- <div class="search">
        <div class="search-input">
          <el-input
            v-model.trim="listQuery.deliverAddressName"
            placeholder="装货地"
            style="width: 164px;"
          ></el-input>
          <div class="change-address" @click="exchange">
            <i class="el-icon-sort"></i>
          </div>
          <el-input
            class="el-input-interval"
            v-model.trim="listQuery.takeAddressName"
            placeholder="卸货地"
            style="width: 164px;"
          ></el-input>
          <el-date-picker
            class="el-input-interval"
            v-model="listQuery.bidStartTime"
            :picker-options="bidStartTime"
            @change="checkTime(listQuery.bidStartTime,listQuery.bidEndTime, 'bidStartTime','bidEndTime')"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
            prefix-icon="el-icon-arrow-down"
            placeholder="请选择开始时间"
            :clearable="false"
          >
          </el-date-picker>
          <el-date-picker
            v-model="listQuery.bidEndTime"
            :picker-options="bidEndTime"
            @change="checkTime(listQuery.bidStartTime,listQuery.bidEndTime, 'bidStartTime','bidEndTime')"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="23:59:59"
            prefix-icon="el-icon-arrow-down"
            placeholder="请选择结束时间"
            :clearable="false"
          >
          </el-date-picker>
        </div>
        <div class="button-space">
          <el-button
            type="primary"
            size="medium"
            plain
            @click="resetForm()"
          >重置</el-button>
          <el-button
            type="primary"
            size="medium"
            @click="getList()"
          >查询</el-button>
        </div>
      </div> -->
      <div class="search-wrap">
        <el-form
          :inline="true"
          :model="listQuery"
          ref="listQuery"
          class="search-form"
        >
          <el-form-item label="装车地：">
            <el-input
              v-model.trim="listQuery.deliverAddressName"
              placeholder="请输入装车地"
              @keyup.enter.native="getList()"
            ></el-input>
          </el-form-item>
          <el-form-item label="卸车地：">
            <el-input
              v-model.trim="listQuery.takeAddressName"
              placeholder="请输入卸车地"
              @keyup.enter.native="getList()"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="竞标时间："
            class="dateTimeContainer"
          >
            <el-date-picker
              class="el-input-interval"
              v-model="listQuery.bidStartTime"
              :picker-options="bidStartTime"
              @change="checkTime(listQuery.bidStartTime,listQuery.bidEndTime, 'bidStartTime','bidEndTime')"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="00:00:00"
              placeholder="请选择开始时间"
              :clearable="false"
            >
            </el-date-picker>
            <span>至</span>
            <el-date-picker
              v-model="listQuery.bidEndTime"
              :picker-options="bidEndTime"
              @change="checkTime(listQuery.bidStartTime,listQuery.bidEndTime, 'bidStartTime','bidEndTime')"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="23:59:59"
              placeholder="请选择结束时间"
              :clearable="false"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item class="search-fr">
            <el-button
              type="primary"
              @click="getList()"
            >查询</el-button>
            <el-button
              type="primary"
              plain
              @click="resetForm()"
            >重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="dataTable">
        <ComTable
          ref="dataTable"
          :table-data="tableData"
          :columns="columns"
          :listQuery="listQuery"
          @getList="getList"
          :alwaysShowColumnIndexs="[0, 2]"
        >
        </ComTable>
      </div>
    </div>
  </div>
</template>

<script>
import ComTable from "@/components/PageTable";
import { checkTime } from "@/utils";
export default {
  components: { ComTable },
  data() {
    return {
      listQuery: {
        status: 1,
        bidStartTime: "",
        bidEndTime: "",
        deliverAddressName: "",
        takeAddressName: "",
        pageNo: 1,
        pageSize: 10,
      },
      bidStartTime: {},
      bidEndTime: {},
      tableData: [],
      cloneModifyQuery: {},
      columns: [],
      rowsCount: 0,
      totalPageNumber: 0,
    };
  },
  created() {
    this.cloneModifyQuery = { ...this.listQuery };
    this.getList();
  },
  methods: {
    checkTime,
    exchange() {
      [this.listQuery.deliverAddressName, this.listQuery.takeAddressName] = [
        this.listQuery.takeAddressName,
        this.listQuery.deliverAddressName,
      ];
    },
    // 查询
    getList() {
      this.$api.brokerweb.getBidNoticePage(this.listQuery).then((res) => {
        let data = res.data.result.page;
        this.tableData = data.list;
        this.rowsCount = data.rowsCount;
        this.totalPageNumber = data.totalPageNumber;
        this.columns = [
          {
            label: "装车地",
            param: "deliverAddressName",
            align: "left",
            width: "260px",
          },
          {
            label: "卸车地",
            param: "takeAddressName",
            align: "left",
            width: "260px",
          },
          { label: "货物名称", param: "typeName", align: "left", width: "180px" },
          {
            label: "标价（元）",
            param: "freight",
            align: "left",
            width: "140px"
          },
          { label: "竞标时间", param: "bidTime", align: "left", width: "170px" },
        ];
        // }

        if (this.$refs.dataTable) {
          let res1 = {
            rows: this.tableData,
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            totalPages: this.totalPageNumber,
            totalRecords: this.rowsCount,
          };
          this.$refs.dataTable.callback(res1);
        }
      });
    },
    // 重置
    resetForm() {
      this.listQuery = { ...this.cloneModifyQuery };
      this.getList();
    },
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
.bidding-record {
  .dataTable {
    margin-top: 30px;
  }
}
</style>
