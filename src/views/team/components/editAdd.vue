<template>
  <div>
    <div class="title-show-info">
      <el-button icon="el-icon-arrow-left" @click="backPrevPage()"></el-button>
      <span v-if="identification=='edit'"> 编辑管理员</span>
      <span v-else>添加管理员</span>
    </div>
    <div class="addAndUpdate_container">

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <div class="addAndUpdate_title">
          <span>基本信息</span>
        </div>
        <div class="addAndUpdate_content">
          <el-form-item label="账号：">
            <el-input v-model="ruleForm.managerid" :disabled="identification=='edit'"></el-input>
          </el-form-item>
          <el-form-item label="昵称：">
            <el-input v-model="ruleForm.managername"></el-input>
          </el-form-item>
          <el-form-item label="密码：">
            <el-input v-model="ruleForm.pwd"></el-input>
          </el-form-item>
          <el-form-item label="QQ：">
            <el-input v-model="ruleForm.QQ"></el-input>
          </el-form-item>
          <el-form-item label="微信：">
            <el-input v-model="ruleForm.wechat"></el-input>
          </el-form-item>
          <el-form-item label="手机：">
            <el-input v-model="ruleForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：">
            <el-input v-model="ruleForm.email"></el-input>
          </el-form-item>
          <el-form-item label="状态：">
            <p class="m-p-l">
            <el-radio-group v-model="ruleForm.status">
              <el-radio label="正常" value="正常"></el-radio>
              <el-radio label="冻结" value="冻结"></el-radio>
            </el-radio-group>
            </p>
          </el-form-item>
        </div>

        <div class="addAndUpdate_title">
          <span>执行操作</span>
        </div>
        <div class="addAndUpdate_footer">
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          </el-form-item>
        </div>

      </el-form>
    </div>
  </div>
</template>
<script>
  const calendarTypeOptions = [
    { key: 'CN', display_name: '门店总管' },
    { key: 'US', display_name: '销售人员' },
    { key: 'US', display_name: '客服人员' }
  ]
  export default {
    props: [
      'data'
    ],
    data() {
      return {
        calendarTypeOptions,
        identification: 'add',
        ruleForm: {
          managerid: '',
          managername: '',
          pwd: '',
          QQ: '',
          wechat: '',
          phone: '',
          email: '',
          status: '正常'
        },
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          date2: [
            { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.identification = 'add'
      if (this.data !== 'add') {
        this.identification = 'edit'
        const info = this.data
        this.ruleForm = {
          managerid: info.managerid,
          managername: info.managername,
          pwd: '',
          QQ: info.QQ,
          wechat: info.wechat,
          email: info.email,
          phone: info.phone,
          status: info.status
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      backPrevPage() {
        this.$emit('editAdd', false)
      }
    }
  }
</script>

<style scoped>
  .addAndUpdate_content{
    padding: 10px 50px;
  }

  .addAndUpdate_footer{
    padding: 10px 50px;
  }

  .addAndUpdate_content .el-input{
    width: 250px;
  }

  .addAndUpdate_content .el-select{
    width: 250px;
  }
</style>
