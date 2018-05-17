<template>
  <div>
    <div class="title-show-info">
      <el-button icon="el-icon-arrow-left" @click="backPrevPage()"></el-button>
      <span v-if="data.r_status==='add'">新增版本</span>
      <span v-else>编辑版本</span>
    </div>
    <div class="addAndUpdate_container">

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <div class="addAndUpdate_title">
          <span>基本信息</span>
        </div>
        <div class="addAndUpdate_content">
          <el-form-item label="平台：">
            <el-radio-group v-model="ruleForm.platform" style="padding-top: 12px">
              <el-radio label="android" value="android"></el-radio>
              <el-radio label="ios" value="ios"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="发布状态：">
            <el-select clearable class="filter-item" v-model="ruleForm.releaseStatus" style="max-width: 250px;width: 100%;" placeholder="请选择" :disabled="this.data.r_status==='edit'">
              <el-option v-for="item in releaseStatus" :key="item.key" :label="item.display_name" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="URL：">
            <el-input v-model="ruleForm.url"></el-input>
          </el-form-item>
          <el-form-item label="版本代号：">
            <el-input v-model="ruleForm.versioncode"></el-input>
          </el-form-item>
          <el-form-item label="版本标识号：">
            <el-input v-model="ruleForm.versionnum"></el-input>
          </el-form-item>
          <el-form-item label="最大版本号：">
            <el-input v-model="ruleForm.bigcode"></el-input>
          </el-form-item>
          <el-form-item label="最小版本号：">
            <el-input v-model="ruleForm.smallcode"></el-input>
          </el-form-item>
          <el-form-item label="更新内容：">
            <el-input type="textarea" v-model="ruleForm.content"></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input type="textarea" v-model="ruleForm.menu"></el-input>
          </el-form-item>
          <el-form-item v-if="data.r_status==='edit'" label="创建时间：">
            <el-input v-model="ruleForm.ctime" disabled></el-input>
          </el-form-item>
          <el-form-item v-if="data.r_status==='edit'" label="更新时间：">
            <el-input v-model="ruleForm.gtime" disabled></el-input>
          </el-form-item>
        </div>

        <div class="addAndUpdate_title">
          <span>执行操作</span>
        </div>
        <div class="addAndUpdate_footer">
          <el-form-item>
            <el-button v-if="data.r_status==='add'" type="primary" @click="submitForm('ruleForm')">新增</el-button>
            <el-button v-else type="primary" @click="submitForm('ruleForm')">保存修改</el-button>
          </el-form-item>
        </div>

      </el-form>
    </div>
  </div>
</template>
<script>
  const releaseStatus = [
    { key: 'CN', display_name: '预发布' },
    { key: 'US', display_name: '已发布' },
    { key: 'JP', display_name: '已过期' }
  ]
  export default {
    props: [
      'data'
    ],
    data() {
      return {
        releaseStatus,
        ruleForm: {
          platform: '',
          releaseStatus: '',
          url: '',
          versioncode: '',
          versionnum: '',
          bigcode: '',
          smallcode: '',
          content: '',
          menu: '',
          ctime: '',
          gtime: ''
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
        platform: this.data.platform,
        releaseStatus: this.data.status,
        url: this.data.url,
        versioncode: this.data.versioncode,
        versionnum: this.data.versionnum,
        bigcode: this.data.bigcode,
        smallcode: this.data.smallcode,
        content: '',
        menu: '',
        ctime: this.data.ctime,
        gtime: this.data.gtime
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
        this.$emit('releaseUpdate', false)
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
