<template>
  <el-container>
    <el-header class="app__header">
      <div>自动化部署系统</div>
      <div>
        <i class="el-icon-bell"></i>
        <i class="el-icon-plus" @click="openOperateProjectDialog"></i>
        <el-dropdown class="app__dropdown">
          <span>王小虎<i class="el-icon-caret-bottom"></i></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>文档</el-dropdown-item>
            <el-dropdown-item>设置</el-dropdown-item>
            <el-dropdown-item>退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <el-aside class="app__aside">
        <el-menu class="app__menu" router :default-active="menuActived">
          <el-menu-item v-for="item in projectList" :key="item.name" :index="item.name" :route="{ path: `/${item.name}` }"><i class="el-icon-menu"></i>{{item.name}}</el-menu-item>
        </el-menu>
      </el-aside>
      <el-container class="app__main">
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
    <operate-project/>
  </el-container>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  import OperateProject from '@/components/OperateProject.vue'

  export default {
    data() {
      return {}
    },
    methods: {
      ...mapMutations(['changeOperateProjectDialogVisible']),
      ...mapActions(['queryProjectList']),
      openOperateProjectDialog() {
        this.changeOperateProjectDialogVisible(true)
      }
    },
    computed: {
      ...mapState(['projectList']),
      menuActived() {
        return this.$route.params.project
      }
    },
    created() {
      this.queryProjectList()
    },
    components: {
      OperateProject
    }
  };
</script>

<style lang="less">
  .app__aside {
    border-right: solid 1px #e6e6e6;
  }

  .app__menu {
    border: none;
  }

  .app__header {
    color: @text;
    display: flex;
    justify-content: space-between;
    line-height: 60px;
    background-color: @theme;
  }

  .el-icon-bell, .el-icon-plus {
    cursor: pointer;
    margin-right: 10px;
  }

  .app__dropdown {
    line-height: normal;
    cursor: pointer;
    color: @text;
  }

  .app__main {
    height: calc(100vh - 60px);
  }
</style>
