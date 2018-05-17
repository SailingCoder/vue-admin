<template>
  <div>
    <div class="title-show-info">
      <el-button icon="el-icon-arrow-left" @click="backPrevPage()"></el-button>
      <span>实名认证 - 编辑</span>
    </div>
    <div class="addAndUpdate_container">

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <div class="addAndUpdate_title">
          <span>基本信息</span>
        </div>
        <div class="addAndUpdate_content">
          <el-form-item label="手机账号：">
            <el-input v-model="ruleForm.userphone" disabled></el-input>
          </el-form-item>
          <el-form-item label="姓名：">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="身份证号：">
            <el-input v-model="ruleForm.idcard"></el-input>
          </el-form-item>
          <el-form-item label="银行卡名称：">
            <el-input v-model="ruleForm.bankinfoName"></el-input>
          </el-form-item>
          <el-form-item label="银行卡号：">
            <el-input v-model="ruleForm.bankinfoNumber"></el-input>
          </el-form-item>
          <el-form-item label="会员生日：">
            <el-input v-model="ruleForm.birthday"></el-input>
          </el-form-item>
          <el-form-item label="所在地：">
            <el-input v-model="ruleForm.address"></el-input>
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
  export default {
    props: [
      'data'
    ],
    data() {
      return {
        ruleForm: {
          userphone: '',
          username: '',
          idcard: '',
          bankinfoName: '',
          bankinfoNumber: '',
          birthday: '',
          address: ''
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
      this.ruleForm = {
        userphone: this.data.userphone,
        username: this.data.username,
        idcard: this.data.idcard,
        bankinfoName: (this.data.bankinfo).split(',')[0],
        bankinfoNumber: (this.data.bankinfo).split(',')[1],
        birthday: this.data.birthday,
        address: this.data.address
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
        this.$emit('certification-edit', false)
      }
    }
  }
</script>

<style scoped>

</style>
