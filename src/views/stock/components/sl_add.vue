<template>
  <div>
    <div class="title-show-info">
      <el-button icon="el-icon-arrow-left" @click="backPrevPage()"></el-button>
      <span>新增入库</span>
    </div>
    <div class="addAndUpdate_container">

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <div class="addAndUpdate_title">
          <span>基本信息</span>
        </div>
        <div class="addAndUpdate_content">
          <el-form-item label="操作方式：">
            <el-radio-group v-model="ruleForm.radio">
              <el-radio label="单件入库"></el-radio>
              <el-radio label="批量入库"></el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="ruleForm.radio=='单件入库'">
            <el-form-item label="门店端口号：">
              <el-input v-model="ruleForm.exchange"></el-input>
            </el-form-item>
            <el-form-item label="商品条码：">
              <el-input v-model="ruleForm.num"></el-input>
            </el-form-item>
            <el-form-item label="入库数量：">
              <el-input v-model="ruleForm.book"></el-input>
            </el-form-item>
            <el-form-item label="入库单号：">
              <el-input v-model="ruleForm.id"></el-input>
            </el-form-item>
            <el-form-item label="供应商：">
              <el-input v-model="ruleForm.gy"></el-input>
            </el-form-item>
          </div>
          <div v-if="ruleForm.radio=='批量入库'">
            <el-form-item label="商品数据：">
              <el-upload
                class="upload-demo"
                ref="upload"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :auto-upload="false"
                :limit="1"
                >
                <el-button slot="trigger" size="small" type="success">选择文件</el-button>
                <el-button size="small" type="success">下载模板</el-button>
              </el-upload>
            </el-form-item>
          </div>
        </div>

        <div class="addAndUpdate_title">
          <span>执行操作</span>
        </div>
        <div class="addAndUpdate_footer">
          <el-form-item>
            <el-button v-if="ruleForm.radio=='单件入库'" type="primary" @click="submitForm('ruleForm')">新增</el-button>
            <el-button v-else-if="ruleForm.radio=='批量入库'" type="primary" @click="submitUpload">新增</el-button>
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
        fileList: [],
        ruleForm: {
          radio: '单件入库',
          exchange: '',
          num: '',
          book: '',
          id: '',
          gy: ''
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
      submitUpload() {
        this.$refs.upload.submit()
      },
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      handlePreview(file) {
        console.log(file)
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
        this.$emit('sl_add', false)
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

  .el-radio-group{
    padding-top: 12px;
  }

  .upload-demo{
    padding-top: 5px;
  }
</style>
