<template>
  <div>
    <div class="title-show-info">
      <el-button icon="el-icon-arrow-left" @click="backPrevPage()"></el-button>
      <span v-if="data!='add'">宣传素材 - 编辑</span>
      <span v-else>宣传素材 - 添加</span>
    </div>
    <div class="addAndUpdate_container">

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <div class="addAndUpdate_title">
          <span>基本信息</span>
        </div>
        <div class="addAndUpdate_content">
          <el-form-item label="素材类型：">
            <el-select v-model="ruleForm.materialtype" placeholder="请选择素材类型" :disabled="data!='add'">
              <el-option label="轮播图" value="轮播图"></el-option>
              <el-option label="特色购物" value="特色购物"></el-option>
              <el-option label="广告区" value="广告区"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="宣传图名称：">
            <el-input v-model="ruleForm.materialname"></el-input>
          </el-form-item>
          <el-form-item label="跳转连接：">
            <el-input v-model="ruleForm.url"></el-input>
          </el-form-item>
          <el-form-item label="宣传图：">
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="显示在首页：">
            <el-radio-group v-model="ruleForm.resource" style="line-height: 50px">
              <el-radio label="显示"></el-radio>
              <el-radio label="不显示"></el-radio>
            </el-radio-group>
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
        imageUrl: '',
        ruleForm: {
          materialtype: '',
          materialname: '',
          url: '',
          resource: '显示'
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
        materialtype: this.data.materialtype,
        materialname: this.data.materialname,
        url: this.data.url,
        resource: '显示'
      }
    },
    methods: {
      handleAvatarSuccess(res, file) {
        console.log(file)
        this.imageUrl = URL.createObjectURL(file.raw)
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
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
        this.$emit('carouselAddUpdate', false)
      }
    }
  }
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
