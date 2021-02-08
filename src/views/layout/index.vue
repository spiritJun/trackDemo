<template>
    <el-row class="container layout-container">
        <!--头部-->
        <el-col :span="24">
            <router-view name="top"></router-view>
        </el-col>
        <el-col :span="24" class="main">
            <!--左侧导航-->
            <router-view name="aside"></router-view>
            <!--右侧内容区-->
            <div class="content-container">
                <section class="content-top">
                    <div class="grid-content bg-purple-light">
                        <transition name="fade" mode="out-in">
                            <keep-alive>
                                <!-- 后期可根据需求加缓存 -->
                                <router-view></router-view>
                            </keep-alive>
                        </transition>
                    </div>
                </section>
                <div class="footer">Copyright @ 2020 北京快成物流科技股份公司</div>
            </div>
        </el-col>
    </el-row>
</template>
<script>
export default {
    name: 'layout',
    data () {
        return {
            loading: false
        }
    }
}
</script>

<style lang="scss">
</style>
