<template>
  <span class="count-down">
    <span>
      <span class="value">{{hourString}}</span>小时
      <span class="value">{{minuteString}}</span>分
      <span class="value">{{secondString}}</span>秒
    </span>
  </span>
</template>

<script>
export default {
  data() {
    return {
      hour: "",
      minute: "",
      second: "",
      promiseTimer: "",
      intervalTime: ""
    };
  },
  props: {
    remainTime: {
      // 倒计时间总秒数
      default: "",
    },
  },
  created() {
    if (this.remainTime > 0) {
      this.intervalTime = this.remainTime;
      this.hour = Math.floor((this.remainTime / 3600) % 24);
      this.minute = Math.floor((this.remainTime / 60) % 60);
      this.second = Math.floor(this.remainTime % 60);
      this.countDowm();
    }
  },
  methods: {
    countDowm() {
      clearInterval(this.promiseTimer);
      this.promiseTimer = setInterval(() => {
        this.intervalTime -=1;
        if (this.hour === 0) {
          if (this.minute !== 0 && this.second === 0) {
            this.second = 59;
            this.minute -= 1;
          } else if (this.minute === 0 && this.second === 0) {
            this.second = 0;
            this.$emit("countDowmEnd", true);
            clearInterval(this.promiseTimer);
          } else {
            this.second -= 1;
          }
        } else {
          if (this.minute !== 0 && this.second === 0) {
            this.second = 59;
            this.minute -= 1;
          } else if (this.minute === 0 && this.second === 0) {
            this.hour -= 1;
            this.minute = 59;
            this.second = 59;
          } else {
            this.second -= 1;
          }
        }
      }, 1000);
    },
    formatNum(num) {
      return num < 10 ? "0" + num : "" + num;
    },
  },
  computed: {
    hourString() {
      return this.formatNum(this.hour);
    },
    minuteString() {
      return this.formatNum(this.minute);
    },
    secondString() {
      return this.formatNum(this.second);
    },
  },
};
</script>
<style  lang='scss' scoped>
.count-down {
  font-size: 12px;
  color: #202224;
  .value {
    font-size: 18px;
    color: #f757aa;
  }
}
</style>