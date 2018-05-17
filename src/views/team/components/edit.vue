<template>
  <div>
    <div class="title-show-info">
      <el-button icon="el-icon-arrow-left" @click="backPrevPage()"></el-button>
      <span>权限分组 - 编辑</span>
    </div>
    <div class="addAndUpdate_container">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <div class="addAndUpdate_title">
          <span>基本信息</span>
        </div>
        <div class="addAndUpdate_content">
          <el-form-item label="角色名称：">
            <el-input v-model="ruleForm.rolename"></el-input>
          </el-form-item>
          <el-form-item label="角色状态：">
            <p class="m-p-l">
            <el-radio-group v-model="ruleForm.rolestatus">
              <el-radio label="正常" value="正常"></el-radio>
              <el-radio label="冻结" value="冻结"></el-radio>
            </el-radio-group>
            </p>
          </el-form-item>
          <el-form-item label="角色详情：">
            <el-input type="textarea" v-model="ruleForm.roleex"></el-input>
          </el-form-item>
          <el-form-item label="创建时间：">
            <el-input v-model="ruleForm.ctime" disabled></el-input>
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
          rolename: '',
          rolestatus: '',
          roleex: '',
          ctime: ''
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
        rolename: this.data.rolename,
        rolestatus: this.data.rolestatus,
        roleex: this.data.roleex,
        ctime: this.data.ctime
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
        this.$emit('edit', false)
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
