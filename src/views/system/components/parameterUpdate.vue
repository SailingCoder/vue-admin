<template>
  <div>
    <div class="title-show-info">
      <el-button icon="el-icon-arrow-left" @click="backPrevPage()"></el-button>
      <span>参数设置 - 编辑</span>
    </div>
    <div class="addAndUpdate_container">

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <div class="addAndUpdate_title">
          <span>基本信息</span>
        </div>
        <div class="addAndUpdate_content">
          <el-form-item label="参数名称：">
            <el-input v-model="ruleForm.paraname"></el-input>
          </el-form-item>
          <el-form-item label="参数值：">
            <el-input v-model="ruleForm.paravalue"></el-input>
          </el-form-item>
          <el-form-item label="参数用途：">
            <el-input type="textarea" v-model="ruleForm.paraex"></el-input>
          </el-form-item>
          <el-form-item label="参数说明：">
            <el-input type="textarea" v-model="ruleForm.howtouse"></el-input>
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
          paraname: '',
          paravalue: '',
          paraex: '',
          howtouse: ''
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
        paraname: this.data.paraname,
        paravalue: this.data.paravalue,
        paraex: this.data.paraex,
        howtouse: this.data.howtouse
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
        this.$emit('parameterUpdate', false)
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
</style>
