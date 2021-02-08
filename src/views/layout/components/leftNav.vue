<template>
  <!--左侧导航-->
  <el-scrollbar wrap-class="scrollbar-wrapper">
  <aside :class="{ showSidebar: !isCollapse }">
    <!--导航菜单-->
    <el-menu
      :default-active="$route.path"
      router
      :collapse="isCollapse"
      ref="leftNavigation"
      unique-opened
    >
      <template
        v-for="issue in permission_routers.filter(item => !item.hidden)"
      >
        <!-- 注意：leftNavState当该值与router的根路由的topname相等时加载相应菜单组 -->
        <template v-if="issue.topname == leftNavState">
          <template v-for="(item, index) in issue.children">
            <!-- 左侧多级菜单 -->
            <el-submenu
              v-if="item.children"
              :index="index + ''"
              v-show="item.menuShow"
              :key="index + 'index' + index"
            >
              <template slot="title"
                ><i :class="item.iconCls"></i
                ><span slot="title">{{ item.name }}</span></template
              >
              <el-menu-item
                v-for="term in item.children"
                :key="term.path"
                :index="term.path"
                :class="$route.path === term.path ? 'is-active' : ''"
              >
                <div v-if="term.menuShow" class="left-border">
                  <i :class="term.iconCls"></i
                  ><span slot="title">{{ term.name }}</span>
                </div>
              </el-menu-item>
            </el-submenu>
            <!-- 左侧一级菜单 -->
            <el-menu-item
              v-else-if="!item.children"
              :index="item.path"
              :key="index + 'index' + index"
              :class="$route.path === item.path ? 'is-active' : ''"
              v-show="item.menuShow"
            >
            <el-tooltip  popper-class="letBarPopover"  effect="dark" :content="`${item.name}`" placement="right" v-show="isCollapse">
              <div class="left-border">
                <i :class="item.iconCls"></i>
                <span slot="title">{{ item.name }}</span>
              </div> 
            </el-tooltip>
            <div class="left-border" v-show="!isCollapse">
                <i :class="item.iconCls"></i>
                <span slot="title">{{ item.name }}</span>
            </div> 
            </el-menu-item>
          </template>
        </template>
      </template>
    </el-menu>
  </aside>
  </el-scrollbar>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "leftNav",
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["sidebar", "permission_routers", "leftNavState"]),
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  methods: {
    // 左侧导航栏根据当前路径默认打开子菜单（如果当前是二级菜单，则父级子菜单默认打开）
    defaultLeftNavOpened() {
      let cur_path = this.$route.path; //获取当前路由
      let routers = this.$router.options.routes; // 获取路由对象
      let subMenuIndex = "",
        needOpenSubmenu = false;
      for (let i = 0; i < routers.length; i++) {
        let children = routers[i].children;
        if (children) {
          for (let j = 0; j < children.length; j++) {
            if (children[j].path === cur_path) {
              break;
            }
            // 如果该菜单下还有子菜单
            if (children[j].children && !children[j].leaf) {
              let grandChildren = children[j].children;
              for (let z = 0; z < grandChildren.length; z++) {
                if (grandChildren[z].path === cur_path) {
                  subMenuIndex = j;
                  needOpenSubmenu = true;
                  break;
                }
              }
            }
          }
        }
      }
      if (this.$refs["leftNavigation"] && needOpenSubmenu) {
        this.$refs["leftNavigation"].open(subMenuIndex); // 打开子菜单
      }
    }
  },
  watch: {
    // '$route': function(to, from){ // 路由改变时执行
    //   //console.info("to.path:" + to.path);
    // }
  },
  mounted() {
    console.log(this.sidebar, "sidebar");
    // this.defaultLeftNavOpened();
  }
};
</script>
