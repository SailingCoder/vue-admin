<template>
  <div>
    <div class="title-show-info">
      <el-button icon="el-icon-arrow-left" @click="backPrevPage()"></el-button>
      <span v-if="data.ct_status==='add'">新增品类</span>
      <span v-else>编辑品类</span>
    </div>
    <div class="addAndUpdate_container">

      <el-form :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <div class="addAndUpdate_title height_add_b">
          <span>基本信息</span>
        </div>
        <div class="addAndUpdate_content">
          <el-form-item class="label_inital" label="品类编号：">
            <el-input v-model="ruleForm.orderid"></el-input>
          </el-form-item>
          <el-form-item class="label_inital" label="父级品类：">
            <el-select clearable class="filter-item" v-model="ruleForm.value" style="width: 100%;max-width: 250px" placeholder="商品类型">
              <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="label_inital" label="品类名称：">
            <el-input v-model="ruleForm.ordername"></el-input>
          </el-form-item>
        </div>

        <div class="addAndUpdate_title">
          <span>执行操作</span>
        </div>

        <div class="addAndUpdate_footer">
          <el-form-item class="label_inital">
            <el-button v-if="data.ct_status==='add'" type="primary" @click="submitForm('ruleForm')">新增</el-button>
            <el-button v-else type="primary" @click="submitForm('ruleForm')">保存修改</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
  const calendarTypeOptions = [
    { key: '0', display_name: '' }
  ]
  export default {
    props: [
      'data'
    ],
    data() {
      return {
        calendarTypeOptions,
        ruleForm: {
          orderid: '',
          status: '',
          ordername: ''
        }
      }
    },
    created() {
      if (this.data.ct_status === 'edit') {
        this.ruleForm.orderid = this.data.orderid
        this.ruleForm.ordername = this.data.ordername
      }
    },
    methods: {
      backPrevPage() {
        this.$emit('ct_addAndEdit', false)
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
  }

  .addAndUpdate_content .el-input {
    width: 100%;
    max-width: 250px;
    float: left;
  }
</style>
