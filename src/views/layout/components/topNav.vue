<template>
    <el-row class="container">
        <!--头部-->
        <el-col :span="24" class="topbar-wrap">
            <!-- logo -->
            <div class="topbar-logo topbar-btn" :class="isCollapse ? 'isClose' : ''">
                <a href="/">
                    <img src="@/assets/logo.png" style="padding-left:8px;" />
                    <span v-show="!isCollapse">快成物流</span>
                </a>
            </div>
            <div class="top-right">
                <!--展开折叠开关-->
                <div class="menu-toggle" @click.prevent="toggleSideBar">
                    <i class="el-icon-s-fold" v-show="!isCollapse"></i>
                    <i class="el-icon-s-unfold" v-show="isCollapse"></i>
                </div>
                <!-- 顶部菜单 -->
                <div class="topbar-title">
                    <el-row>
                        <el-col :span="24">
                            <el-menu :default-active="defaultActiveIndex" mode="horizontal" @select="handleSelect" :router="true">
                                <template v-for="(route, key) in permission_routers.filter(
                    item => !item.hidden
                  )">
                                    <el-menu-item :index="route.path" :key="key + 'index' + key" class="el-no-border">{{ route.name }}</el-menu-item>
                                </template>
                            </el-menu>
                        </el-col>
                    </el-row>
                </div>
                <!-- 顶部右侧 -->
                <div class="topbar-account topbar-btn">
                    <!-- <screenfull id="screenfull" class="right-menu-item hover-effect" /> -->
                    <!-- 改变主色 elementUI的也会修改 -->
                    <!-- <el-color-picker
            size="medium"
            v-model="mainColor"
            @change="changeColor">
          </el-color-picker> -->
                    <!-- 个人信息 -->
                    <!-- <el-dropdown trigger="click"> -->
                    <span class="el-dropdown-link userinfo-inner">
                        <i class="icon el-icon-user-solid"></i> {{userName}}
                        <i class="el-icon-caret-bottom"></i></span>
                    <!--<el-dropdown-menu slot="dropdown">
               <el-dropdown-item>
                <div @click="jumpTo('/user/profile')">
                  <span style="color: #555;font-size: 14px;">个人信息</span>
                </div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="jumpTo('/user/changepwd')">
                  <span style="color: #555;font-size: 14px;">修改密码</span>
                </div>
              </el-dropdown-item> 
              <el-dropdown-item divided @click.native="logout"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>-->
                    <!-- </el-dropdown> -->
                </div>
            </div>
        </el-col>
    </el-row>
</template>
<script>
import { mapGetters } from "vuex";
// import Screenfull from '@/components/Screenfull';// 全屏
import { changeThemeColor, curColor } from "@/utils/themeColorClient";
import Cookies from 'js-cookie'
export default {
    components: {
        // Screenfull,
    },
    data () {
        return {
            defaultActiveIndex: "/", //默认工作台的path
            mainColor: curColor,
            hideTheme: false,
            themeList: [
                {
                    title: "默认",
                    name: "primary",
                    preview: ""
                },
                {
                    title: "会员",
                    name: "star",
                    preview: ""
                },
                {
                    title: "随意",
                    name: "third",
                    preview: ""
                }
            ],
            userName: ''
        };
    },
    computed: {
        ...mapGetters(["sidebar", "permission_routers"]),
        isCollapse () {
            return !this.sidebar.opened
        },
    },
    created () {
        this.userName = Cookies.get('userName')
        // 组件创建完后获取数据
        this.fetchNavData();
    },
    methods: {
        // 换肤
        changeColor (newColor) {
            changeThemeColor(newColor).then(() => { });
        },
        //折叠导航栏
        toggleSideBar () {
            this.$store.dispatch("ToggleSideBar");
        },
        jumpTo (url) {
            this.$router.push(url); //用go刷新
        },
        handleSelect (index) {
            this.defaultActiveIndex = index;
        },
        fetchNavData () {
            // 初始化菜单激活项
            let cur_path = this.$route.path, //获取当前路由
                routers = this.permission_routers.filter(item => !item.hidden), // 获取路由对象
                nav_name = "";
            routers.forEach(item => {
                let children = item.children;
                if (children) {
                    for (let j = 0; j < children.length; j++) {
                        if (children[j].path === cur_path) {
                            nav_name = item.topname;
                            this.defaultActiveIndex = item.path;
                            break;
                        }
                        // 如果该菜单下还有子菜单
                        if (children[j].children) {
                            let grandChildren = children[j].children;
                            for (let z = 0; z < grandChildren.length; z++) {
                                if (grandChildren[z].path === cur_path) {
                                    nav_name = item.topname;
                                    break;
                                }
                            }
                        }
                    }
                }
            });
            this.$store.dispatch("updateleftNavState", nav_name);
        },
        logout () {
            this.$confirm("确认退出吗?", "提示", {
                confirmButtonClass: "el-button--warning"
            })
                .then(() => {
                    this.jumpTo("/login");
                })
                .catch(() => { });
        }
    },
    mounted () {
    },
    watch: {
        $route: function (to, from) {
            // 路由改变时执行
            this.fetchNavData();
        }
    }
};
</script>
<style lang="scss" scoped>
.textitem {
    height: 30px;
    text-align: center;
    cursor: pointer;
}
.themeIcon {
    cursor: pointer;
    margin-right: 10px;
}
.el-menu--horizontal > .el-menu-item {
    border-bottom: none;
}
</style>
