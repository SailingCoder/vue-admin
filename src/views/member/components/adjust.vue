<template>
  <div>
    <div class="title-show-info">
      <el-button icon="el-icon-arrow-left" @click="backPrevPage()"></el-button>
      <span>会员列表 - 调整账户</span>
    </div>
    <div class="addAndUpdate_container">

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <div class="addAndUpdate_title">
          <span>基本信息</span>
        </div>
        <div class="addAndUpdate_content">

          <el-form-item label="账户类型：">
            <el-select clearable class="filter-item" v-model="ruleForm.type" placeholder="选择类型">
              <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.value" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="当前余额：">
            <el-input v-model="ruleForm.payAgain" disabled></el-input>
          </el-form-item>
          <el-form-item label="变动金额：">
            <el-input v-model="ruleForm.payNum"></el-input>
          </el-form-item>
          <el-form-item label="调整后余额：">
            <el-input v-model="ruleForm.payAfter" disabled></el-input>
          </el-form-item>
          <el-form-item label="调整类型：">
            <el-input v-model="ruleForm.status" disabled></el-input>
          </el-form-item>
          <el-form-item label="变动说明：">
            <el-input v-model="ruleForm.menu"></el-input>
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
    { key: 'CN', value: '劳动积分' },
    { key: 'US', value: '消费积分' },
    { key: 'JP', value: '储值余额' }
  ]
  export default {
    props: [
      'data'
    ],
    data() {
      return {
        calendarTypeOptions,
        ruleForm: {
          type: '',
          payAgain: '0',
          payNum: '0',
          payAfter: '0',
          status: '后台调整',
          menu: ''
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
        this.$emit('adjust', false)
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
