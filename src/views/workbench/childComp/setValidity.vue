<template>
  <el-dialog
    title="竞标有效期设置"
    width="400px"
    :visible.sync="priceDiaVisible"
    v-el-drag-dialog="priceDiaVisible"
    :before-close="diaClose"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
  >
    <el-form
      :model="changeInfo"
      size="mini"
      ref="changeInfo"
      label-width="120px"
      :rules="setRules"
    >
      <el-form-item label="选择有效期" prop="hour">
        <el-select v-model="changeInfo.hour" placeholder="选择有效期">
          <el-option
            v-for="item in dateArr"
            :label="item"
            :value="item"
            :key="item"
          >
          </el-option>
        </el-select>
        <span> 小时</span>
      </el-form-item>
    </el-form>
    <p class="error" style="padding-left: 30px;">
      提示：修改成功后，新分配的竞标线路在该有效期内支持竞标，过有效期后不支持竞标。
    </p>
    <div slot="footer" class="dia-handle">
      <el-button @click="diaClose" size="medium">取消</el-button>
      <el-button
        @click="sureHandle('changeInfo')"
        :loading="buttonLoading"
        type="primary"
        size="medium"
        >确定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import ComTable from "@/components/PageTable";
import elDragDialog from "@/directive/el-dragDialog";
export default {
  directives: {
    elDragDialog
  },
  components: {
    ComTable
  },
  props: {
    priceDiaVisible: {
      type: Boolean,
      default: false
    },
    hour: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      changeInfo: {},
      dateArr: [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24
      ],
      setRules: {
        hour: [
          {
            required: true,
            message: "请选择有效期",
            trigger: "change"
          }
        ]
      },
      buttonLoading: false
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
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          let params = this.changeInfo;
          this.$api.brokerweb.addBidEffectiveTime(params).then(res => {
            if (res.data.code === "000000200") {
              this.$message.closeAll();
              this.$message({
                type: "success",
                message: "操作成功!"
              });
              this.$emit("close");
              this.$emit("sureHandle");
              this.buttonLoading = false;
            }
          });
        } else {
          return false;
        }
      });
    }
  },
  computed: {}
};
</script>
<style lang="scss" scoped>
.dia-handle {
  text-align: right;
}
</style>
