<template>
  <div class="home" v-loading="loading" :element-loading-text="loadingText">
    <div class="home__meta">
      名称：
      <div class="home__content">{{project.name}} <el-tag v-if="project.tag">{{project.tag}}</el-tag></div>
    </div>
    <div class="home__meta">
      脚本：
      <div class="home__content">{{project.script}}</div>
    </div>
    <div class="home__meta">
      仓库：
      <div class="home__content">{{project.repository}}</div>
    </div>
    <div class="home__meta">
      说明：
      <div class="home__content" v-html="markedReadme"></div>
    </div>
    <div class="home__config">
      <div class="home-btn-group">
        <el-button icon="el-icon-edit" type="primary" @click="openConfigDialog">修改配置文件</el-button>
        <el-dropdown class="home__dropdown" @command="deployTag">
          <el-button type="primary">
            部署特定的版本<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="tag in releaseTags" :key="tag" :command="tag">{{tag}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button icon="el-icon-delete" type="danger" @click="deleteProject">删除项目</el-button>
      </div>
      <code ref="highlightEcosystemConfigFile">{{ecosystemConfigFile}}</code>
    </div>
    <config-project ref="configDialog" :config-info="ecosystemConfigFile" :dialog-info="project" @close="queryConfigFile" />
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import marked from 'marked'
  import hljs from 'highlight.js/lib/highlight';
  import javascript from 'highlight.js/lib/languages/javascript';
  import 'highlight.js/styles/atom-one-dark.css'
  import ConfigProject from '@/components/ConfigProject'

  hljs.registerLanguage('javascript', javascript);

  export default {
    name: 'home',
    data () {
      return {
        ecosystemConfigFile: '',
        releaseTags: [],
        loading: false,
        loadingText: ''
      }
    },
    computed: {
      ...mapState(['projectList']),
      project() {
        const app = this.$route.params.project

        return this.projectList.find(item => item.name === app) || {}
      },
      markedReadme() {
        return marked(this.project.readme || '')
      }
    },
    methods: {
      ...mapActions(['queryProjectList']),
      openConfigDialog() {
        this.$refs['configDialog'].dialogVisible = true
      },
      queryConfigFile(project) {
        if (!project) { return }

        this.$http.projectApi.queryItem(project).then(res => {
          const data = res.data

          if (!data.success) {
            throw new Error(data.message)
          }

          this.ecosystemConfigFile = data.message
        }).catch(err => {
          this.$message.error(err.message)
        })
      },
      queryTags(repository) {
        if (!repository) { return }

        this.$http.projectApi.queryTags(repository).then(res => {
          const data = res.data

          if (!data.success) {
            throw new Error(data.message)
          }

          this.releaseTags = data.message
        }).catch(err => {
          this.$message.error(err.message)
        })
      },
      deployTag(tag) {
        this.$confirm(`是否确认部署版本${tag}`, '提示', {
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.loadingText = `正在部署版本${tag}`
          this.$http.projectApi.deployTag({ name: this.project.name, tag }).then(res => {
            const data = res.data

            if (!data.success) {
              throw new Error(data.message)
            }

            this.$message.success(data.message)
            this.queryProjectList()
          }).catch(err => {
            this.$message.error(err.message)
          }).finally(() => {
            this.loading = false
            this.loadingText = ''
          })
        }).catch(() => {})
      },
      deleteProject() {
        this.$confirm(`是否确认下线并删除${this.project.name}？`, '提示', {
          type: 'warning'
        }).then(() => {
          this.$http.projectApi.deleteItem({ name: this.project.name }).then(res => {
            const data = res.data

            if (!data.success) {
              throw new Error(data.message)
            }

            this.queryProjectList()
            this.$router.push('/')
          }).catch(err => {
            this.$message.error(err.message)
          })
        }).catch(() => {})
      }
    },
    watch: {
      ecosystemConfigFile() {
        this.$refs.highlightEcosystemConfigFile.innerText = this.ecosystemConfigFile
        hljs.highlightBlock(this.$refs.highlightEcosystemConfigFile)
      },
      project: {
        handler(params) {
          this.queryConfigFile(params.name)
          this.queryTags(params.repository)
        },
        immediate: true
      }
    },
    components: { ConfigProject }
  }
</script>

<style lang="less">
  .home__meta {
    font-size: 18px;
    color: @secondary;
  }

  .home__content {
    font-size: 14px;
    color: @regular;
    padding: 5px 0 15px;
  }

  .home__config {
    white-space: pre;
  }

  .home-btn-group {
    padding-bottom: 10px;
  }

  .home__dropdown {
    margin: 0 10px;
  }
</style>
