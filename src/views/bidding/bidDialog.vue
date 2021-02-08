<template>
  <el-dialog
    title="立即标价"
    width="500px"
    :visible.sync="isVisible"
    v-el-drag-dialog="isVisible"
    :before-close="diaClose"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    v-if="isVisible"
  >
    <el-form
      :model="changeInfo"
      size="mini"
      ref="changeInfo"
      label-width="120px"
      :rules="setRules"
    >
      <el-form-item label="截止时间：">
        <CountDown :remainTime="info.second" />
      </el-form-item>
      <el-form-item
        label="输入标价："
        prop="price"
      >
        <el-input
          v-model="changeInfo.price"
          placeholder="请输入标价"
          style="width: 150px;"
        >
        </el-input>
        <span>元/吨</span>
      </el-form-item>
    </el-form>
    <p
      class="error"
      style="padding-left: 120px;"
    >
      请确定后提交，提交成功无法撤回。
    </p>
    <div
      slot="footer"
      class="dia-handle"
    >
      <el-button
        @click="diaClose"
        size="medium"
      >取消</el-button>
      <el-button
        @click="sureHandle('changeInfo')"
        :loading="buttonLoading"
        type="primary"
        size="medium"
      >确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import elDragDialog from "@/directive/el-dragDialog";
import CountDown from "@/components/CountDown";
export default {
  directives: {
    elDragDialog,
  },
  components: {
    CountDown,
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    info: {
      default: {},
    },
  },
  data() {
    const validPrice = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入标价！"));
      } else {
        if (isNaN(value)) {
          callback(new Error("标价应为最多只有两位小数点的数字类型"));
        } else {
          if (value.split(".")[1] && value.split(".")[1].length > 2) {
            callback(new Error("标价应为最多只有两位小数点的数字类型"));
          } else {
            callback();
          }
        }
      }
    };
    return {
      changeInfo: {
        price: "",
      },
      setRules: {
        price: [{ required: true, validator: validPrice, trigger: "blur" }],
      },
      buttonLoading: false,
    };
  },
  methods: {
    /*关闭弹窗*/
    diaClose() {
      this.$emit("close");
      this.$refs.changeInfo.resetFields();
      this.buttonLoading = false;
    },
    sureHandle(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          let param = {
            id: this.info.bidId,
            freight: this.changeInfo.price,
            noticeId: this.info.id,
          };
          this.$api.brokerweb.updateBídInfo(param).then((res) => {
            if (res.data.code === "000000200") {
              this.$message({
                type: "success",
                message: "竞标成功!",
              });
              this.$emit("close");
              this.$emit("sureHandle");
            }
            this.buttonLoading = false;
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.dia-handle {
  text-align: right;
}
</style>
