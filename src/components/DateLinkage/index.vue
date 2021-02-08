<template>
  <div>
    <!-- 年 -->
    <el-select
      v-model="year"
      style="width:100px"
      :size="size"
      placeholder="请选择年"
      @change="changeMonth"
      clearable
    >
      <el-option
        v-for="item in yearlist"
        :key="item.id"
        :value="item"
        :label="item + '年'"
      >
      </el-option>
    </el-select>

    <!-- 月 -->
    <el-select
      v-model="month"
      @change="changeMonth"
      style="width:100px"
      :size="size"
      placeholder="请选择月"
      clearable
    >
      <el-option
        v-for="item in monthlist"
        :key="item.id"
        :label="item + '月'"
        :value="item"
      >
      </el-option>
    </el-select>

    <!-- 日 -->
    <el-select
      v-model="day"
      style="width:100px"
      :size="size"
      placeholder="请选择日"
      @change="change"
      clearable
    >
      <el-option
        v-for="item in daylist"
        :key="item.id"
        :label="item + '日'"
        :value="item"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    propYear: {
      defalut: "",
    },
    propMonth: {
      defalut: "",
    },
    propDay: {
      defalut: "",
    },
    size: {
      default: "medium",
    },
  },
  data() {
    return {
      yearlist: [],
      monthlist: [],
      daylist: [],
      year: this.propYear || "",
      month: this.propMonth || "",
      day: this.propDay || "",
      dayListLength: 0,
    };
  },
  created() {
    this.initYearList();
    this.change();
  },
  methods: {
    // 初始化年份列表
    initYearList() {
      let now = new Date();
      let year = now.getFullYear();
      for (let i = 0; i <= 10; i++) {
        this.yearlist[i] = year - i;
      }
      this.initMonthList(now);
    },
    // 初始化月份列表
    initMonthList(now) {
      let month = now.getMonth() + 1;
      this.check(month);
      for (let i = 0; i < this.dayListLength; i++) {
        this.daylist[i] = i + 1;
      }
      for (let i = 0; i < 12; i++) {
        this.monthlist[i] = i + 1;
      }
    },
    // 修改月份
    changeMonth() {
      this.daylist = [];
      let month = this.month;
      this.check(month);
      for (let i = 0; i < this.dayListLength; i++) {
        this.daylist[i] = i + 1;
      }
      this.day = "";
      this.change();
    },
    check(month) {
      if (
        month == 1 ||
        month == 3 ||
        month == 5 ||
        month == 7 ||
        month == 8 ||
        month == 10 ||
        month == 12
      ) {
        return (this.dayListLength = 31);
      } else if (month == 4 || month == 6 || month == 11 || month == 9) {
        return (this.dayListLength = 30);
      } else if (month == 2) {
        if (
          this.year % 4 == 0 &&
          (this.year % 100 != 0 || this.year % 400 == 0)
        ) {
          return (this.dayListLength = 29);
        } else {
          return (this.dayListLength = 28);
        }
      }
    },
    change() {
      if (this.year == "") {
        this.month = "";
        this.day = "";
      }
      if (this.year != "" && this.month == "") {
        this.day = "";
      }
      let data = {
        year: this.year,
        month: (this.month && this.month < 10) ? '0' + this.month : this.month,
        day: (this.day && this.day < 10) ? '0' + this.day : this.day,
      };
      this.$emit("change", data);
    },
  },
};
</script>