<template>
  <div class="container user">
    测试
     <ComTable
      ref="dataTable"
      :table-data="tableData"
      :columns="columns"
      :table-option="tableOption"
      :has-select="true"
      :listQuery="listQuery"
      :dynamicColumnSetting="true"
      :showAlwaysShowColumnInCheckbox="true"
      @getList="getList"
      :alwaysShowColumnIndexs="[0, 2]"
      v-if="tableData.length > 0"
    >
    </ComTable> 
  </div>
</template>

<script>
import ComTable from "@/components/PageTable";
/* 货主身份类型 */
const shipperIdentityTypeMap = {
  "1": "公司",
  "2": "信息部"
};
export default {
  name: "billLeaderWaring",
  components: { ComTable },
  data() {
    return {
      columnVisibles: null,
      listQuery: {
        pageNo: 1,
        pageSize: 10
      },
      total: 0,
      tableData:[],
      minWidth: "160px",
      columns: []
      };
  },
  computed: {
    tableOption() {
      // 操作按钮配置对象
      return {
        label: "操作",
        width: "160px",
        minWidth: this.minWidth,
        size: "mini",
        plain: true,
        fixed: "right",
        options: [
          {
            label: "删除",
            type: "success",
            icon: "el-icon-delete",
            event: this.handleCreate,
            btnpermission: "claimListReview", //是否有按钮权限
            isShow: item => {
              //是否显示
              return true;
            }
          },
          {
            label: "修改",
            type: "primary",
            icon: "el-icon-view",
            event: this.handleCreate,
            btnpermission: "claimListReview",
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
    getList(params) {
      this.$api.system.getOrgEmployeePage(params).then((res) => {
      // if (res.data.code === 0) {
        // const data = res.data.data;
        // this.tableData = data.rows;
        // this.total = data.totalRecords;
      // }
      this.tableData=[{
          manageRange: "新绛县快成物流科技有限公司下所有企业",
          organizationName: "新绛县快成物流科技有限公司",
          mainDeptName: "市场部",
          roleNames: "县级分公司管理员,运营",
          checkSel: null,
          operatorId: "e549cf8362d2394c0162dbdba621001f",
          operatorName: "tester",
          createTime: "2020-12-01 11:21:07",
          updateTime: "2020-12-01 11:21:07",
          roleIds: [169, 101],
          rangeIds: null,
          orgIds: null,
          employeeId: 1435,
          loginName: "testsyq",
          userName: "快宋",
          userId: "473e5d5e07d242c69343aa929eaecdcc",
          organizationId: 181,
          mainDeptId: 405,
          mainPositionId: 0,
          mainJobId: 1,
          name: "快宋",
          namePinyin: "",
          namePinyinFirst: "",
          sex: 1,
          nation: 0,
          nativePlace: "",
          certType: 0,
          certCode: "",
          birthday: null,
          empNo: null,
          mobile: null,
          email: "",
          employeeStatus: 0,
          isFrozen: 2,
          joinDate: "2020-12-01 00:00:00",
          regularDate: null,
          leaveDate: null,
          memo: "",
          wxNo: null,
          baseUserId: null,
          dataMask: 0,
          dataMaskList: []
        }]
      this.tableData[0].src =
          "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1606371552268&di=ab1503c32e9ba3315456d8f82c606a8a&imgtype=0&src=http%3A%2F%2Fa1.att.hudong.com%2F05%2F00%2F01300000194285122188000535877.jpg";
      this.columns = [
          { label: "登录账号", param: "loginName", align: "left", width: "" },
          { label: "姓名", param: "userName", align: "left", width: "" },
          {
            label: "头像",
            param: "src",
            align: "left",
            className: "tablePic",
            width: "",
            isImgView: true
          },
          {
            label: "金额(元)",
            param: "employeeId",
            align: "right",
            width: "",
            isMoney: true
          },
          {
            label: "手机号",
            param: "mobile",
            isShowTooltip: true,
            align: "left",
            width: "",
            render: (h, params) => {
              return h(
                "p",
                {
                  class: "order_status_color_orang pointer",
                  on: {
                    click: () => {
                      console.log("这里可以跳转详情");
                    }
                  }
                },
                params.row.mobile
              );
            }
          },
          {
            label: "账号状态",
            param: "isFrozen",
            isTag: true,
            align: "left",
            width: "100px",
            formatData: function(val) {
              return shipperIdentityTypeMap[val]; //shipperIdentityTypeMap必须为key,value的对象形式
            },
            type: item => {
              return item.isFrozen == 2 ? "success" : "danger";
            }
          }
        ];

        if (this.$refs.dataTable) {
          let res1={
            rows:this.tableData,
            pageNo: 1,
            pageSize: 10,
            totalPages: 36,
            totalRecords: 360
          }
          this.$refs.dataTable.callback(this.tableData);
        }
      });
    },
    /* 添加 */
    handleCreate(rows) {
      console.log(rows, "rows");
    }
  },
  watch: {}
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
