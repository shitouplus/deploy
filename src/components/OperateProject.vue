<template>
    <el-dialog
            title="添加项目"
            :visible.sync="dialogVisible">
        <el-form ref="form" :model="form" :rules="formRules" label-width="100px">
            <el-form-item label="名称" prop="name">
                <el-input v-model.trim="form.name"></el-input>
            </el-form-item>
            <el-form-item label="仓库" prop="repository">
                <el-input v-model.trim="form.repository" placeholder="符合正则/^(https:\/\/|git@).+\.git$/"></el-input>
            </el-form-item>
            <el-form-item label="说明" prop="readme">
                <el-input v-model="form.readme" type="textarea" placeholder="可以使用 Markdown 语法"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleCancel">取 消</el-button>
            <el-button type="primary" @click="handleConfirm">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'

  const Required = { required: true, message: '不能为空' }

  export default {
    name: 'operate-project',
    data() {
      return {
        formRules: {
          name: Required,
          repository: [
            Required,
            { pattern: /^(https:\/\/|git@).+\.git$/, message: '格式不正确' }
          ]
        }
      }
    },
    computed: {
      ...mapState({
        form: 'project'
      }),
      dialogVisible: {
        get () {
          return this.$store.state.operateProjectDialogVisible
        },
        set (value) {
          this.$store.commit('changeOperateProjectDialogVisible', value)
        }
      }
    },
    methods: {
      ...mapMutations({
        resetForm: 'resetProject'
      }),
      handleConfirm() {
        this.$refs['form'].validate((valid) => {
          if (!valid) { return }
          this.$http.projectApi.addItem(this.form).then(res => {
            const { data } = res

            if (!data.success) {
              throw new Error(data.message)
            }
            this.$message.success(data.message)
            this.resetForm()
          }).catch(err => {
            this.$message.error(err.message)
          })
        })
      },
      handleCancel() {
        this.dialogVisible = false
        this.resetForm()
      }
    }
  }
</script>
