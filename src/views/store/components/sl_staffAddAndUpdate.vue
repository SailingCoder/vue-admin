<template>
  <div>
    <div class="title-show-info">
      <el-button icon="el-icon-arrow-left" @click="backPrevPage()"></el-button>
      <span v-if="data.staffStatus=='add'">新增员工</span>
      <span v-else-if="data.staffStatus=='edit'">编辑员工</span>
    </div>
    <div class="addAndUpdate_container">
      <el-form :model="ruleForm" ref="ruleForm" label-width="110px" class="demo-ruleForm">
        <div class="addAndUpdate_title height_add_b">
          <span>基本信息</span>
        </div>
        <div class="addAndUpdate_content">
          <el-form-item class="label_inital" label="所属门店：">
            <el-input v-model="ruleForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item class="label_inital" label="所属角色：">
            <el-select clearable class="filter-item" style="width: 100%;max-width: 250px" v-model="ruleForm.type" placeholder="选择角色" :disabled="this.data.staffStatus === 'edit'">
              <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="label_inital" label="成员姓名：">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item class="label_inital" label="登录账号：">
            <el-input v-model="ruleForm.account" :disabled="data.staffStatus=='edit'"></el-input>
          </el-form-item>
          <el-form-item class="label_inital" label="登录密码：">
            <el-input v-model="ruleForm.pwd"></el-input>
          </el-form-item>
          <el-form-item class="label_inital" label="联系电话：">
            <el-input v-model="ruleForm.userphone"></el-input>
          </el-form-item>
        </div>

        <div class="addAndUpdate_title">
          <span>执行操作</span>
        </div>
        <div class="addAndUpdate_footer">
          <el-form-item>
            <el-button v-if="data.staffStatus=='edit'" type="primary" @click="submitForm('ruleForm')">保存修改</el-button>
            <el-button v-else type="primary" @click="submitForm('ruleForm')">新增</el-button>
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
    { key: 'JP', display_name: '客服人员' }
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
          username: '',
          account: '',
          pwd: '',
          userphone: ''
        }
      }
    },
    created() {
      if (this.data.staffStatus === 'edit') {
        this.ruleForm = {
          type: this.data.type,
          username: this.data.username,
          account: this.data.account,
          pwd: '',
          userphone: this.data.userphone
        }
      }
    },
    methods: {
      indexMethod(index) {
        return index + 1
      },
      backPrevPage() {
        this.$emit('sl_staffAddAndUpdate', false)
      }

    }
  }
</script>

<style scoped>

  .label_inital .el-form-item__label{
    width: 100px !important;
  }

  .label_inital .el-form-item__content{
    margin-left: 100px !important;
  }

  .addAndUpdate_content .el-input {
    width: 100%;
    max-width: 250px;
    float: left;
  }
</style>
