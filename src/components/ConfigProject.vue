<template>
    <el-dialog
            :title="dialogInfo.name + ' 配置文件'"
            :visible.sync="dialogVisible">
        <el-form ref="form" :model="form" :rules="formRules">
            <el-form-item label="" prop="config">
                <el-input spellcheck="false" rows="20" v-model="form.config" type="textarea" placeholder="name字段禁止修改"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleCancel">取 消</el-button>
            <el-button type="primary" @click="handleConfirm">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
  export default {
    name: 'config-project',
    props: ['dialogInfo', 'configInfo'],
    data() {
      return {
        formRules: {
          config: { pattern: /\S/, message: '不能为空' },
        },
        form: {
          config: this.configInfo
        },
        dialogVisible: false
      }
    },
    methods: {
      handleConfirm() {
        this.$refs['form'].validate((valid) => {
          if (!valid) { return }

          let config = `(${this.form.config})`

          // 去除"module.exports =" 便于解析
          config = config.replace(/module\.exports\s?=\s?/, '')
          try {
            config = eval(config)
          } catch (e) {
            return this.$message.error(e.message)
          }

          if (config.apps[0].name !== this.dialogInfo.name) {
            return this.$message.warning('name字段禁止修改')
          }

          config = 'module.exports = ' + JSON.stringify(config, null, 2)

          this.$http.projectApi.configItem({
            name: this.dialogInfo.name,
            config
          }).then(res => {
            const { data } = res

            if (!data.success) {
              throw new Error(data.message)
            }
            this.$message.success(data.message)
            this.$emit('close', this.dialogInfo.name)
            this.handleCancel()
          }).catch(err => {
            this.$message.error(err.message)
          })
        })
      },
      handleCancel() {
        this.dialogVisible = false
      }
    },
    watch: {
      configInfo(val) {
        this.form.config = val
      }
    }
  }
</script>
