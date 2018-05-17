<template>
  <div>
    <div class="addAndUpdate_container" style="padding-top: 40px">
      <el-form :model="ruleForm" ref="ruleForm" label-width="110px" class="demo-ruleForm">
        <div class="addAndUpdate_title height_add_b">
          <span>基本信息</span>
        </div>
        <div class="addAndUpdate_content">
          <el-row :gutter="10">
            <div v-for="basic in basicInfo">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="max-width: 520px">
                <el-form-item class="label_inital" :label="basic.name + '：'">
                  <el-select v-if="basic.key=='type'" clearable class="filter-item" v-model="ruleForm.value" style="width: 100%;max-width: 250px" placeholder="请选择">
                    <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
                    </el-option>
                  </el-select>
                  <el-input v-else v-model="basic.val"></el-input>
                </el-form-item>
              </el-col>
            </div>
          </el-row>
        </div>
        <div class="addAndUpdate_title height_add_b">
          <span>结算信息</span>
        </div>
        <div class="addAndUpdate_content">
          <div v-for="settle in settleInfo">
            <el-form-item class="label_inital" :label="settle.name + '：'">
              <el-select v-if="settle.key=='type'" clearable class="filter-item" v-model="ruleForm.value" style="width: 100%;max-width: 250px" placeholder="请选择">
                <el-option v-for="item in settleType" :key="item.key" :label="item.display_name" :value="item.key">
                </el-option>
              </el-select>
              <el-input v-else v-model="settle.val"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="addAndUpdate_title">
          <span>执行操作</span>
        </div>

        <div class="addAndUpdate_footer">
          <el-form-item class="label_inital">
            <el-button type="primary" @click="submitForm('ruleForm')">新增</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
  const calendarTypeOptions = [
    { key: '0', display_name: '品类1' },
    { key: '1', display_name: '品类2' }
  ]
  const settleType = [
    { key: '0', display_name: '账期' },
    { key: '0', display_name: '现结' }
  ]
  export default {
    data() {
      return {
        settleType,
        basicInfo: [
          { key: 'orderName', name: '供应商编码', val: '' },
          { key: 'orderid', name: '供应商名称', val: '' },
          { key: 'type', name: '主营品类', val: '' },
          { key: 'gy', name: '法人', val: '' },
          { key: 'orderAmount', name: '联系电话', val: '' },
          { key: 'payMethod', name: '所在区域', val: '' },
          { key: 'memberAccount', name: '详细地址', val: '' },
          { key: 'consumerStore', name: '合作状态', val: '' },
          { key: 'consumerStore', name: '添加时间', val: '' }
        ],
        settleInfo: [
          { key: 'type', name: '结算方式', val: '' },
          { key: 'orderAmount', name: '银行账号', val: '' },
          { key: 'payMethod', name: '开户银行', val: '' }
        ],
        calendarTypeOptions,
        ruleForm: {
          orderid: '',
          status: '',
          ordername: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
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
      }
    }
  }
</script>

<style scoped>
  .height_add_b{
    margin: 10px 0;
  }

  .label_inital .el-form-item__label{
    width: 100px !important;
  }

  .label_inital .el-form-item__content{
    margin-left: 100px !important;
    height: 40px;
  }

  .addAndUpdate_content .el-input {
    width: 100%;
    max-width: 250px;
    float: left;
  }

  .el-select {
    display: inherit;
  }
</style>
