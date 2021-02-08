<template>
  <div class="bidding-hall">
    <div class="navi-title">竞标大厅</div>
    <!-- <div class="search">
      <div class="search-input">
        <el-input
          v-model.trim="listQuery.deliverAddressName"
          placeholder="装货地"
          style="width: 164px;"
        ></el-input>
        <div
          class="change-address"
          @click="exchange"
        >
          <i class="el-icon-sort"></i>
        </div>
        <el-input
          v-model.trim="listQuery.takeAddressName"
          placeholder="卸货地"
          style="width: 164px;"
        ></el-input>
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
          @click="getBidNoticeHallPage()"
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
              @keyup.enter.native="getBidNoticeHallPage()"
            ></el-input>
          </el-form-item>
          <el-form-item label="卸车地：">
            <el-input
              v-model.trim="listQuery.takeAddressName"
              placeholder="请输入卸车地"
              @keyup.enter.native="getBidNoticeHallPage()"
            ></el-input>
          </el-form-item>
          <el-form-item class="search-fr">
            <el-button type="primary" @click="getBidNoticeHallPage()"
              >查询</el-button
            >
            <el-button type="primary" plain @click="resetForm()"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    <div
      class="bidding-list"
      v-if="bidList.length > 0"
    >
      <div
        class="bidding-list-card"
        v-for="(item, index) in bidList"
      >
        <div class="card-top">
          <div class="content">
            <div class="code">通知单编号：{{item.noticeNo}}</div>
            <div class="address">
              <span class="start">起：</span>{{item.deliverAddressName}}
            </div>
            <div class="address">
              <span class="end">终：</span>{{item.takeAddressName}}
            </div>
            <div class="address">
              <span class="dot"></span>货物名称：{{item.typeName}}
            </div>
          </div>
        </div>
        <div class="card-bottom">
          <div class="content">
            <div class="time">剩余时间：
              <CountDown :remainTime="item.second" ref="remainTime"/>
            </div>
            <img
              src="@/assets/images/bidding/time-icon.png"
              alt=""
            >
            <div class="nums">
              已参与竞标人数：{{item.bidCount}}
            </div>
          </div>
          <div class="handle">
            <el-button
              size="medium"
              type="success"
              class="button"
              @click="handleBidDialog(item, index)"
            >立即竞标</el-button>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="custom-empty"
    >
    <img src="@/assets/images/null.png">
    <p>暂无数据</p>  
    </div>
    <pagination
      v-if="bidList.length > 0"
      :total="totalSize"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      :params="listQuery"
      @pagination="getBidNoticeHallPage"
    />
    <bid-dialog
      :isVisible.sync="setVisible"
      @close="diaClose"
      :info="info"
      @sureHandle="sureHandle"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import CountDown from "@/components/CountDown";
import bidDialog from "./bidDialog";
export default {
  data() {
    return {
      bidList: [],
      listQuery: {
        status: 0,
        pageNo: 1,
        pageSize: 8,
        deliverAddressName: "",
        takeAddressName: "",
      },
      cloneModifyQuery: {},
      totalSize: 0,
      // 弹窗
      setVisible: false,
      info: {},
    };
  },
  components: {
    Pagination,
    CountDown,
    bidDialog,
  },
  created() {
    this.cloneModifyQuery = { ...this.listQuery };
    this.getBidNoticeHallPage();
  },
  methods: {
    //交换位置
    exchange() {
      [this.listQuery.deliverAddressName, this.listQuery.takeAddressName] = [
        this.listQuery.takeAddressName,
        this.listQuery.deliverAddressName,
      ];
    },
    // 竞标大厅列表
    getBidNoticeHallPage() {
      this.$api.brokerweb.getBidNoticeHallPage(this.listQuery).then((res) => {
        let data = res.data.result.page;
        this.totalSize = data.rowsCount;
        this.bidList = data.list;
      });
    },
    handleBidDialog(item, index) {
      this.info = item;
      this.info.second = this.$refs.remainTime[index].intervalTime;
      this.setVisible = true;
    },
    // 重置
    resetForm() {
      this.listQuery = { ...this.cloneModifyQuery };
      this.getBidNoticeHallPage();
    },
    // 关闭弹窗
    diaClose() {
      this.setVisible = false;
    },
    sureHandle() {
      this.resetForm();
      this.info = {};
    },
  },
};
</script>

<style lang='scss' scoped>
.bidding-hall {
  background: #f4f6fc;
  overflow: hidden;
  .navi-title:not(:first-child) {
    margin: 24px 0;
  }
  .bidding-list {
    margin-top: 30px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .bidding-list-card {
      display: flex;
      flex-direction: column;
      width: 23%;
      height: 430px;
      margin-right: 32px;
      border-radius: 8px;
      background: #fff;
      margin-bottom: 20px;
      box-shadow: 6px 6px 12px 0 rgba(0, 0, 0, 0.05);
      .card-top {
        background-image: url("../../assets/images/bidding/card-bg.png");
        background-repeat: no-repeat;
        background-size: contain;
        background-position-y: bottom;
        height: 60%;
        .content {
          padding: 25px;
          .code {
            color: #202224;
            font-size: 16px;
            padding-bottom: 16px;
          }
          .address {
            padding: 8px 0;
            .start {
              font-weight: bold;
              color: #2fa943;
              margin-right: 5px;
            }
            .end {
              font-weight: bold;
              color: #ff1916;
              margin-right: 5px;
            }
            .dot {
              display: inline-block;
              width: 12px;
              height: 12px;
              border-radius: 50%;
              margin-right: 16px;
              background: #2e53eb;
            }
          }
        }
      }
      .card-bottom {
        background: #f1f4f9;
        padding-bottom: 28px;
        border-radius: 0px 0px 8px 8px;
        flex: 1;
        .content {
          margin: 25px;
          position: relative;
          .time {
            color: #202224;
            font-size: 16px;
            padding-bottom: 16px;
          }
          .nums {
            font-size: 14px;
            color: #2e53eb;
          }
          img {
            width: 44px;
            height: 44px;
            position: absolute;
            right: 0;
            top: -10px;
          }
        }
        .handle {
          text-align: right;
          margin-right: 25px;
          .button {
            background: rgba(62, 214, 164, 0.2);
            color: #3ed6a4;
            border: none;
            &:hover,
            &:focus {
              color: #fff;
              background: #3ed6a4;
              // border: 1px solid  #3ed6a4;
            }
          }
        }
      }
      &:nth-child(4),
      &:nth-child(8) {
        margin-right: 0;
      }
    }
  }
}
@media screen and (max-width: 1630px){
    .bidding-list-card {
      width: 30%!important;
      &:nth-child(3),
      &:nth-child(6) {
        margin-right: 0!important;
      }
      &:nth-child(4),
      &:nth-child(8) {
        margin-right: 32px!important;
      }
    }
}
</style>
