<template>
  <div id="app" class="app-main">
    <router-view/>
    <el-backtop target=".content-container">
        <div class="backtop">
          <span class="el-icon-arrow-up" style="display: block; margin: 5px 0 0 0;font-weight:600;"></span>
          <span style="display: block;">TOP</span>
        </div>
    </el-backtop>
  </div>
</template>

<style lang="scss" scoped>
.backtop {
  height: 100%;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
  text-align: center;
  line-height: 25px;
  font-size: 12px;
  color: #1989fa;
  font-weight: 600;
}

.backtop:hover {
  background: #1989fa;
  color: #fff;
}
</style>
