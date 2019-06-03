<template>
  <el-container>
    <el-header class="app__header">
      <div class="app__header-title" @click="viewDocument('/')">
        测试环境部署
      </div>
      <el-input class="app__port" placeholder="输入端口号查询是否被占用" v-model.trim="port">
        <el-button slot="append" icon="el-icon-search" @click="queryPort"></el-button>
      </el-input>
      <div>
        <i class="el-icon-plus" @click="openOperateProjectDialog"></i>
        <el-dropdown class="app__dropdown" @command="viewDocument">
          <span>文档<i class="el-icon-caret-bottom"></i></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="/">示例</el-dropdown-item>
            <el-dropdown-item command="/">说明</el-dropdown-item>
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
      return {
        port: ''
      }
    },
    methods: {
      ...mapMutations(['changeOperateProjectDialogVisible']),
      ...mapActions(['queryProjectList']),
      openOperateProjectDialog() {
        this.changeOperateProjectDialogVisible(true)
      },
      viewDocument(path) {
        if (path.startsWith('http')) {
          window.open(path)
        } else {
          this.$router.push(path)
        }
      },
      queryPort() {
        if (!this.port) {
          return this.$message.warning('端口号不能为空')
        }

        this.$http.projectApi.queryPort(this.port)
                .then(res => {
                  const { data } = res

                  if (!data.success) {
                    throw new Error(data.message)
                  }

                  if (data.message) {
                    this.$message.warning(`端口号已被占用`)
                  } else {
                    this.$message.success('端口号未被占用')
                  }
                })
                .catch(err => {
                  this.$message.error(err.message)
                })
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

  .app__port {
    margin-top: 10px;
    width: 400px;
  }

  .app__header {
    color: @text;
    display: flex;
    justify-content: space-between;
    line-height: 60px;
    background-color: @theme;
  }

  .app__header-title {
    cursor: pointer;
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
