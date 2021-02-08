<template>
  <div class="container user">
    测试
    <!-- <ComTable
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
    </ComTable> -->
    <!-- 添加弹框 -->
    <el-dialog
      v-el-drag-dialog="dialogFormVisible"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      width="900px"
      @close="resetTemp('modifyQuery')"
      :title="modifyTitle"
    >
      <div class="modify-wrap">
        <el-form
          :inline="true"
          :model="modifyQuery"
          ref="modifyQuery"
          size="mini"
          label-width="120px"
          class="modify-form"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="登录账号：" prop="loginName" v-if="!editing">
                <el-input
                  v-model.trim="modifyQuery.loginName"
                  placeholder="请录入平台登录账号，昵称为登录名称不可重复"
                ></el-input>
              </el-form-item>
              <el-form-item label="登录账号：" v-else>
                <span>{{ modifyQuery.loginName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="姓名：" prop="userName" v-if="!editing">
                <el-input
                  v-model.trim="modifyQuery.userName"
                  placeholder="请输入姓名"
                ></el-input>
              </el-form-item>
              <el-form-item label="姓名：" v-else>
                <span>{{ modifyQuery.userName }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="手机号：" prop="mobile" v-if="!editing">
                <el-input
                  v-model.trim="modifyQuery.mobile"
                  placeholder="请输入手机号"
                ></el-input>
              </el-form-item>
              <el-form-item label="手机号：" v-else>
                <span>{{ modifyQuery.mobile }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱：" prop="email">
                <el-input
                  v-model.trim="modifyQuery.email"
                  placeholder="请输入邮箱"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="性别：" prop="sex">
                <el-radio-group v-model="modifyQuery.sex">
                  <el-radio :label="1">男</el-radio>
                  <el-radio :label="2">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="入职时间：" prop="joinDate">
                <el-date-picker
                  v-model="modifyQuery.joinDate"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="员工编号：" prop="empNo">
                <el-input
                  v-model.trim="modifyQuery.empNo"
                  placeholder="请输入员工编号"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="微信号：" prop="wxNo">
                <el-input
                  v-model.trim="modifyQuery.wxNo"
                  placeholder="请输入微信号"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <p>
              <span class="error" style="margin-left: 120px"
                >初始密码为kcwl8888</span
              >
            </p>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          size="mini"
          @click="
            dialogFormVisible = false;
            resetTemp('modifyQuery');
          "
          >取 消</el-button
        >
        <el-button size="mini" type="warning" @click="modifySave('modifyQuery')"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ComTable from "@/components/PageTable";
import elDragDialog from "@/directive/el-dragDialog";
/* 货主身份类型 */
const shipperIdentityTypeMap = {
  "1": "公司",
  "2": "信息部"
};
export default {
  name: "billLeaderWaring",
  components: { ComTable },
  directives: { elDragDialog },
  data() {
    return {
      columnVisibles: null,
      listQuery: {
        userName: "",
        isFrozen: "",
        organizationId: "",
        mainDeptId: "",
        pageNo: 1,
        pageSize: 10
      },
      total: 0,
      tableData:[
            {
                "manageRange":"山西快成物流科技有限公司下所有企业",
                "organizationName":"山西快成物流科技有限公司",
                "mainDeptName":"运营部",
                "roleNames":"总财务",
                "checkSel":null,
                "operatorId":"03b552f3098344919c324f0133249cac",
                "operatorName":"admin_new",
                "createTime":"2020-12-01 11:31:53",
                "updateTime":"2020-12-01 11:31:53",
                "roleIds":[
                    215
                ],
                "rangeIds":null,
                "orgIds":null,
                "employeeId":1439,
                "loginName":"yangluru",
                "userName":"杨璐茹",
                "userId":"0b439beff0584472b7ba50dec5cb1100",
                "organizationId":135,
                "mainDeptId":339,
                "mainPositionId":0,
                "mainJobId":0,
                "name":"杨璐茹",
                "namePinyin":"",
                "namePinyinFirst":"",
                "sex":1,
                "nation":0,
                "nativePlace":"",
                "certType":0,
                "certCode":"",
                "birthday":null,
                "empNo":null,
                "mobile":"18135381628",
                "email":"",
                "employeeStatus":0,
                "isFrozen":2,
                "joinDate":null,
                "regularDate":null,
                "leaveDate":null,
                "memo":"",
                "wxNo":null,
                "baseUserId":null,
                "dataMask":0,
                "dataMaskList":[

                ]
            },
            {
                "manageRange":"山西快成物流科技有限公司下所有企业",
                "organizationName":"山西快成物流科技有限公司",
                "mainDeptName":"运营部",
                "roleNames":"总财务",
                "checkSel":null,
                "operatorId":"03b552f3098344919c324f0133249cac",
                "operatorName":"admin_new",
                "createTime":"2020-12-01 11:31:28",
                "updateTime":"2020-12-01 11:31:28",
                "roleIds":[
                    215
                ],
                "rangeIds":null,
                "orgIds":null,
                "employeeId":1437,
                "loginName":"shiqq",
                "userName":"史青青",
                "userId":"48c41945ded748e19728273f54215fe3",
                "organizationId":135,
                "mainDeptId":339,
                "mainPositionId":0,
                "mainJobId":0,
                "name":"史青青",
                "namePinyin":"",
                "namePinyinFirst":"",
                "sex":2,
                "nation":0,
                "nativePlace":"",
                "certType":0,
                "certCode":"",
                "birthday":null,
                "empNo":null,
                "mobile":"13603565040",
                "email":"",
                "employeeStatus":0,
                "isFrozen":2,
                "joinDate":null,
                "regularDate":null,
                "leaveDate":null,
                "memo":"",
                "wxNo":null,
                "baseUserId":null,
                "dataMask":0,
                "dataMaskList":[

                ]
            },
            {
                "manageRange":"新绛县快成物流科技有限公司下所有企业",
                "organizationName":"新绛县快成物流科技有限公司",
                "mainDeptName":"市场部",
                "roleNames":"县级分公司管理员,运营",
                "checkSel":null,
                "operatorId":"e549cf8362d2394c0162dbdba621001f",
                "operatorName":"tester",
                "createTime":"2020-12-01 11:21:07",
                "updateTime":"2020-12-01 11:21:07",
                "roleIds":[
                    169,
                    101
                ],
                "rangeIds":null,
                "orgIds":null,
                "employeeId":1435,
                "loginName":"testsyq",
                "userName":"快宋",
                "userId":"473e5d5e07d242c69343aa929eaecdcc",
                "organizationId":181,
                "mainDeptId":405,
                "mainPositionId":0,
                "mainJobId":1,
                "name":"快宋",
                "namePinyin":"",
                "namePinyinFirst":"",
                "sex":1,
                "nation":0,
                "nativePlace":"",
                "certType":0,
                "certCode":"",
                "birthday":null,
                "empNo":null,
                "mobile":null,
                "email":"",
                "employeeStatus":0,
                "isFrozen":2,
                "joinDate":"2020-12-01 00:00:00",
                "regularDate":null,
                "leaveDate":null,
                "memo":"",
                "wxNo":null,
                "baseUserId":null,
                "dataMask":0,
                "dataMaskList":[

                ]
            },
            {
                "manageRange":"快成物流下所有企业",
                "organizationName":"快成物流",
                "mainDeptName":"运营部",
                "roleNames":"市级分公司管理员,线路围栏设定管理,测试管理员,测试权限1,凌角色,运营",
                "checkSel":null,
                "operatorId":"03b552f3098344919c324f0133249cac",
                "operatorName":"admin_new",
                "createTime":"2019-11-29 17:51:30",
                "updateTime":"2020-11-30 15:57:32",
                "roleIds":[
                    97,
                    189,
                    183,
                    111,
                    107,
                    101
                ],
                "rangeIds":null,
                "orgIds":null,
                "employeeId":331,
                "loginName":"tester",
                "userName":"测试员",
                "userId":"e549cf8362d2394c0162dbdba621001f",
                "organizationId":107,
                "mainDeptId":317,
                "mainPositionId":317,
                "mainJobId":1,
                "name":"测试员",
                "namePinyin":"",
                "namePinyinFirst":"",
                "sex":1,
                "nation":0,
                "nativePlace":"",
                "certType":0,
                "certCode":"",
                "birthday":null,
                "empNo":null,
                "mobile":"13240258170",
                "email":"",
                "employeeStatus":0,
                "isFrozen":2,
                "joinDate":"2019-11-29 00:00:00",
                "regularDate":null,
                "leaveDate":null,
                "memo":"",
                "wxNo":null,
                "baseUserId":null,
                "dataMask":3,
                "dataMaskList":[
                    1,
                    2
                ]
            },
            {
                "manageRange":"山西快成吕梁分公司下所有企业",
                "organizationName":"山西快成吕梁分公司",
                "mainDeptName":"运营部",
                "roleNames":"运营,客服,市级分公司管理员",
                "checkSel":null,
                "operatorId":"03b552f3098344919c324f0133249cac",
                "operatorName":"admin_new",
                "createTime":"2020-11-26 16:06:28",
                "updateTime":"2020-11-26 16:06:28",
                "roleIds":[
                    101,
                    99,
                    97
                ],
                "rangeIds":null,
                "orgIds":null,
                "employeeId":1433,
                "loginName":"sjh",
                "userName":"手机号",
                "userId":"49c743c09ba742c9a4ea8011173515ac",
                "organizationId":143,
                "mainDeptId":345,
                "mainPositionId":0,
                "mainJobId":0,
                "name":"手机号",
                "namePinyin":"",
                "namePinyinFirst":"",
                "sex":1,
                "nation":0,
                "nativePlace":"",
                "certType":0,
                "certCode":"",
                "birthday":null,
                "empNo":null,
                "mobile":"18701553303",
                "email":"",
                "employeeStatus":0,
                "isFrozen":2,
                "joinDate":null,
                "regularDate":null,
                "leaveDate":null,
                "memo":"",
                "wxNo":null,
                "baseUserId":null,
                "dataMask":0,
                "dataMaskList":[

                ]
            },
            {
                "manageRange":"察右中旗鑫源居酒楼下所有企业,内蒙古工业大学机械厂",
                "organizationName":"察右中旗鑫源居酒楼",
                "mainDeptName":"市场部",
                "roleNames":"县级分公司管理员",
                "checkSel":null,
                "operatorId":"e549cf8362d2394c0162dbdba621001f",
                "operatorName":"tester",
                "createTime":"2020-03-25 16:52:39",
                "updateTime":"2020-11-23 15:17:13",
                "roleIds":[
                    169
                ],
                "rangeIds":null,
                "orgIds":null,
                "employeeId":381,
                "loginName":"chanpxj01",
                "userName":"海娜",
                "userId":"962c2f69817b49c9bdeb061098159d00",
                "organizationId":203,
                "mainDeptId":413,
                "mainPositionId":0,
                "mainJobId":0,
                "name":"海娜",
                "namePinyin":"",
                "namePinyinFirst":"",
                "sex":2,
                "nation":0,
                "nativePlace":"",
                "certType":0,
                "certCode":"",
                "birthday":null,
                "empNo":null,
                "mobile":"18511248557",
                "email":"hn_haina@126.com",
                "employeeStatus":0,
                "isFrozen":2,
                "joinDate":null,
                "regularDate":null,
                "leaveDate":null,
                "memo":"",
                "wxNo":null,
                "baseUserId":null,
                "dataMask":0,
                "dataMaskList":[

                ]
            },
            {
                "manageRange":"柳林县快成物流科技有限公司下所有企业",
                "organizationName":"柳林县快成物流科技有限公司",
                "mainDeptName":"运营部",
                "roleNames":"县级分公司管理员",
                "checkSel":null,
                "operatorId":"03b552f3098344919c324f0133249cac",
                "operatorName":"admin_new",
                "createTime":"2020-01-02 10:20:00",
                "updateTime":"2020-11-18 16:04:32",
                "roleIds":[
                    169
                ],
                "rangeIds":null,
                "orgIds":null,
                "employeeId":353,
                "loginName":"llxj",
                "userName":"柳林佳",
                "userId":"e549cf836cfbadaf016cfbc06028000c",
                "organizationId":139,
                "mainDeptId":343,
                "mainPositionId":0,
                "mainJobId":11,
                "name":"柳林佳",
                "namePinyin":"",
                "namePinyinFirst":"",
                "sex":2,
                "nation":0,
                "nativePlace":"",
                "certType":0,
                "certCode":"",
                "birthday":null,
                "empNo":"111",
                "mobile":null,
                "email":"hain@kcwl.com",
                "employeeStatus":0,
                "isFrozen":2,
                "joinDate":"2019-11-01 00:00:00",
                "regularDate":null,
                "leaveDate":null,
                "memo":"",
                "wxNo":null,
                "baseUserId":null,
                "dataMask":1,
                "dataMaskList":[
                    1
                ]
            },
            {
                "manageRange":"山西快成吕梁分公司下所有企业",
                "organizationName":"山西快成吕梁分公司",
                "mainDeptName":"客服部",
                "roleNames":"市级分公司管理员",
                "checkSel":null,
                "operatorId":"e549cf8362d2394c0162dbdba621001f",
                "operatorName":"tester",
                "createTime":"2020-11-16 10:10:12",
                "updateTime":"2020-11-16 18:14:43",
                "roleIds":[
                    97
                ],
                "rangeIds":null,
                "orgIds":null,
                "employeeId":1425,
                "loginName":"ssyyqq",
                "userName":"宋永强",
                "userId":"d740a34c308c4e97ad0b6483c7de908d",
                "organizationId":143,
                "mainDeptId":417,
                "mainPositionId":0,
                "mainJobId":15,
                "name":"宋永强",
                "namePinyin":"",
                "namePinyinFirst":"",
                "sex":1,
                "nation":0,
                "nativePlace":"",
                "certType":0,
                "certCode":"",
                "birthday":null,
                "empNo":null,
                "mobile":"18097657463",
                "email":"",
                "employeeStatus":0,
                "isFrozen":2,
                "joinDate":null,
                "regularDate":null,
                "leaveDate":null,
                "memo":"",
                "wxNo":null,
                "baseUserId":null,
                "dataMask":1,
                "dataMaskList":[
                    1
                ]
            },
            {
                "manageRange":"新绛县快成物流科技有限公司下所有企业",
                "organizationName":"新绛县快成物流科技有限公司",
                "mainDeptName":"市场部",
                "roleNames":"县级分公司管理员",
                "checkSel":null,
                "operatorId":"e549cf8362d2394c0162dbdba621001f",
                "operatorName":"tester",
                "createTime":"2019-09-25 10:33:00",
                "updateTime":"2020-11-16 11:08:36",
                "roleIds":[
                    169
                ],
                "rangeIds":null,
                "orgIds":null,
                "employeeId":357,
                "loginName":"syq",
                "userName":"宋永强",
                "userId":"ff808081707cac700170809443af001b",
                "organizationId":181,
                "mainDeptId":405,
                "mainPositionId":0,
                "mainJobId":3,
                "name":"宋永强",
                "namePinyin":"",
                "namePinyinFirst":"",
                "sex":1,
                "nation":0,
                "nativePlace":"",
                "certType":0,
                "certCode":"",
                "birthday":null,
                "empNo":"066",
                "mobile":null,
                "email":"18301234566@163.com",
                "employeeStatus":0,
                "isFrozen":2,
                "joinDate":"2019-09-25 00:00:00",
                "regularDate":null,
                "leaveDate":null,
                "memo":"",
                "wxNo":"676876455",
                "baseUserId":null,
                "dataMask":1,
                "dataMaskList":[
                    1
                ]
            },
            {
                "manageRange":"快成物流下所有企业",
                "organizationName":"快成物流",
                "mainDeptName":"运营部",
                "roleNames":"凌角色,市级分公司管理员",
                "checkSel":null,
                "operatorId":"03b552f3098344919c324f0133249cac",
                "operatorName":"admin_new",
                "createTime":"2019-07-24 14:21:26",
                "updateTime":"2020-11-16 10:05:06",
                "roleIds":[
                    107,
                    97
                ],
                "rangeIds":null,
                "orgIds":null,
                "employeeId":263,
                "loginName":"darling",
                "userName":"大凌",
                "userId":"c3336e2874e4410c9da9cd50b9033217",
                "organizationId":107,
                "mainDeptId":317,
                "mainPositionId":0,
                "mainJobId":17,
                "name":"大凌",
                "namePinyin":"",
                "namePinyinFirst":"",
                "sex":2,
                "nation":0,
                "nativePlace":"",
                "certType":0,
                "certCode":"",
                "birthday":null,
                "empNo":null,
                "mobile":"18301665196",
                "email":"lingy@kcwl.com",
                "employeeStatus":0,
                "isFrozen":2,
                "joinDate":null,
                "regularDate":null,
                "leaveDate":null,
                "memo":"",
                "wxNo":null,
                "baseUserId":null,
                "dataMask":3,
                "dataMaskList":[
                    1,
                    2
                ]
            }
        ],
      minWidth: "160px",
      dialogFormVisible: false,
      modifyQuery: {
        sex: 1,
        organizationId: null,
        mainDeptId: null,
        dataMaskList: []
      },
      cloneModifyQuery: {},
      modifyTitle: "",
      editing: false,
      columns: [],
      shipperIdentityTypeMap
    };
  },
  created() {
    this.cloneModifyQuery = { ...this.modifyQuery };
    this.getList(this.listQuery);

    // this.columnVisibles=new Array(this.columns.length).fill(true)
  },
  mounted() {},
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
        this.tableData[0].src =
          "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1606371552268&di=ab1503c32e9ba3315456d8f82c606a8a&imgtype=0&src=http%3A%2F%2Fa1.att.hudong.com%2F05%2F00%2F01300000194285122188000535877.jpg";
        // this.total = data.totalRecords;
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
      // }
      if (this.$refs.dataTable) {
        this.$refs.dataTable.callback(this.tableData);
      }
      });
    },
    /* 添加 */
    handleCreate(rows) {
      console.log(rows, "rows");
      this.modifyTitle = "添加用户";
      this.modifyQuery = this.cloneModifyQuery;
      this.editing = false;
      this.isAdd = true; // 设置是添加操作
      this.dialogFormVisible = true;
    },
    resetTemp(formName) {
      // 添加
      if (this.isAdd) {
        this.$refs[formName].resetFields();
      } else {
        this.$refs[formName].clearValidate();
      }
      this.isFirstEdit = false;
      // this.coalMineName = '';
    }
  },
  watch: {}
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ {
  .order_status_color_orang {
    color: red;
  }
  .pointer {
    cursor: pointer;
  }
}
</style>
