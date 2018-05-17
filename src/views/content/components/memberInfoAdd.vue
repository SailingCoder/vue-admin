<template>
  <div>
    <div class="title-show-info">
      <el-button icon="el-icon-arrow-left" @click="backPrevPage()"></el-button>
      <span>{{this.title.val}}</span>
    </div>
    <div class="addAndUpdate_container">

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
        <div class="addAndUpdate_title">
          <span>基本信息</span>
        </div>
        <div class="addAndUpdate_content">
          <el-form-item label="内容类型：">
            <el-input v-model="ruleForm.region" disabled></el-input>
          </el-form-item>
          <el-form-item label="推送内容：">
            <div v-if="this.title.id==='txt'">
              <el-input type="textarea" v-model="ruleForm.desc" placeholder="请输入推送内容"></el-input>
            </div>
            <div v-else>
              <el-select v-model="ruleForm.txt" placeholder="请选择推送文章" style="max-width: 250px;width: 100%;">
                <el-option label="1" value="shanghai"></el-option>
                <el-option label="2" value="beijing"></el-option>
                <el-option label="3" value="beijing"></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="推送对象：">
            <el-row>
              <el-radio-group v-model="ruleForm.obj" style="padding-top: 13px">
                <el-radio label="全体会员"></el-radio>
                <el-radio label="部分会员"></el-radio>
              </el-radio-group>
            </el-row>
            <el-row>
              <el-input v-if="ruleForm.obj==='部分会员'" type="textarea" v-model="ruleForm.desc" placeholder="请填写会员账号,用“ , ”隔开"></el-input>
            </el-row>
          </el-form-item>
          <el-form-item label="推送时间：">
            <el-row>
              <el-radio-group v-model="ruleForm.datetype" style="padding-top: 13px">
                <el-radio label="即时"></el-radio>
                <el-radio label="定时"></el-radio>
              </el-radio-group>
            </el-row>
            <el-row>
              <el-date-picker v-if="ruleForm.datetype==='定时'" v-model="ruleForm.date" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-row>
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
        title: {
          id: 'txt',
          val: '添加纯文本'
        },
        dialogImageUrl: '',
        dialogVisible: false,
        ruleForm: {
          name: '',
          region: '',
          date1: '',
          datetype: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
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
      if (this.data === 'txt') {
        this.title.id = 'txt'
        this.title.val = '添加纯文本'
        this.ruleForm = {
          name: '',
          region: '纯文本',
          date1: '',
          datetype: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      } else if (this.data === 'image') {
        this.title.id = 'image'
        this.title.val = '添加图文类'
        this.ruleForm = {
          name: '',
          region: '纯文本',
          date1: '',
          datetype: '',
          delivery: false,
          txt: '',
          resource: '',
          desc: ''
        }
      }
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
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
        this.$emit('memberInfoAdd', false)
      }
    }
  }
</script>

<style scoped>

</style>
