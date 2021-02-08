<!-- test889 -->
<template>
  <div class='workbench-dashboard'>
    <h1 class="navi-title">数据统计</h1>
    <div class="date-contain">
      <div class="date">

      </div>
      <div class="data-wrap">
        <div class="date">
          <div class="search">
            <div class="search-input">
              <DateLinkage
                :year="listQuery.bidYear"
                :month="listQuery.bidMonth"
                :day="listQuery.bidDay"
                @change="changeDate"
              />
            </div>
          </div>
        </div>
        <div class="content">
          <div class="con">
            <div class="item">
              <div class="left">
                <img
                  src="@/assets/images/statis-all.png"
                  alt=""
                >
              </div>
              <div class="right">
                <span class="text">分配竞标数（单） </span>
                <b class="number">{{bidAllCount | NumFormat}}</b>
              </div>
            </div>
            <div class="item">
              <div class="left">
                <img
                  src="@/assets/images/statis-finish.png"
                  alt=""
                >
              </div>
              <div class="right">
                <span class="text">已竞标数（单） </span>
                <b class="number">{{bidCount | NumFormat}} </b>
              </div>
            </div>
            <div class="item">
              <div class="left">
                <img
                  src="@/assets/images/statis-not.png"
                  alt=""
                >
              </div>
              <div class="right">
                <span class="text">未参与竞标数（单） </span>
                <b class="number">{{bidNoneCount | NumFormat}} </b>
              </div>
            </div>
          </div>
          <div class="con">
            <div class="item">
              <div class="left">
                <img
                  src="@/assets/images/statis-all.png"
                  alt=""
                >
              </div>
              <div class="right">
                <span class="text">今日分配竞标数（单） </span>
                <b class="number">{{todayBidAllCount | NumFormat}} </b>
              </div>
            </div>
            <div class="item">
              <div class="left">
                <img
                  src="@/assets/images/statis-finish.png"
                  alt=""
                >
              </div>
              <div class="right">
                <span class="text">今日已竞标数（单） </span>
                <b class="number">{{todayBidCount | NumFormat}} </b>
              </div>
            </div>
            <div class="item">
              <div class="left">
                <img
                  src="@/assets/images/statis-not.png"
                  alt=""
                >
              </div>
              <div class="right">
                <span class="text">今日未参与竞标数（单） </span>
                <b class="number">{{todayBidNoneCount | NumFormat}} </b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DateLinkage from "@/components/DateLinkage";
export default {
  components: { DateLinkage },
  data() {
    return {
      listQuery: {
        bidYear: "",
        bidMonth: "",
        bidDay: "",
      },
      bidCount: 0, //已竞标数
      bidNoneCount: 0, //未参与竞标单数
      bidAllCount: 0, //分配竞标数
      todayBidCount: 0, //今日已竞标数
      todayBidNoneCount: 0, //今日未参与竞标单数
      todayBidAllCount: 0, //今日分配竞标数
    };
  },
  methods: {
    //历史统计
    getStatistics() {
      this.$api.brokerweb
        .getStatistics(this.listQuery)
        .then(({ data } = res) => {
          this.bidCount = data.result.bidCount;
          this.bidNoneCount = data.result.bidNoneCount;
          this.bidAllCount = data.result.bidAllCount;
        });
    },
    // 今日统计
    getTodayStatistics() {
      this.$api.brokerweb.getTodayStatistics().then(({ data } = res) => {
        this.todayBidCount = data.result.bidCount;
        this.todayBidNoneCount = data.result.bidNoneCount;
        this.todayBidAllCount = data.result.bidAllCount;
      });
    },
    //修改日期
    changeDate(data) {
      this.listQuery = {
        bidYear: data.year,
        bidMonth: data.month,
        bidDay: data.day,
      };
      this.getStatistics();
    },
  },
  created() {
    // this.getStatistics();
    this.getTodayStatistics();
  },
  mounted() {},
};
</script>
<style lang='scss' scoped>
.workbench-dashboard {
  background: #f4f6fc;

  .navi-title:not(:first-child) {
    margin: 24px 0;
  }

  .date-contain {
    position: relative;
    padding: 64px 0 48px 0;
    background: #fff;
    border-radius: 4px;
    box-shadow: 3px 3px 32px 0px rgba(0, 0, 0, 0.05);
    .data-wrap {
      position: relative;
      .date {
        position: absolute;
        top: -40px;
        right: 24px;
        .search {
          /deep/.el-input__inner {
            background: #fcfdfd;
          }
          /deep/.el-input--prefix .el-input__inner {
            padding-left: 15px;
          }
          .search-input {
            border-radius: 4px;
          }
        }
      }
      .content {
        width: 90%;
        margin: 15px auto 0;
        .con {
          display: flex;
          align-items: center;
          justify-content: space-around;
          .item {
            display: flex;
            width: 33%;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            padding: 15px 0;
            .left {
              width: 70px;
              height: 60px;
              img {
                width: 40px;
                height: 40px;
              }
            }

            .right {
              width: 50%;
              .text {
                font-size: 14px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #202224;
                line-height: 20px;
              }

              .number {
                display: block;
                margin-top: 4px;
                font-size: 24px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #202224;
              }
            }
          }
        }

        .item:nth-child(n + 4) {
          margin-top: 32px;
        }
      }
    }
  }
}
</style>