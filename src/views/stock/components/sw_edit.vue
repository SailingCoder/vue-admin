<template>
  <div>
    <div class="title-show-info">
      <el-button icon="el-icon-arrow-left" @click="backPrevPage()"></el-button>
      <span v-if="data.sw_status=='edit'">处理异常库存</span>
      <span v-else-if="data.sw_status=='detail'">异常库存详情</span>
    </div>
    <div class="addAndUpdate_container">

      <el-form :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <div class="addAndUpdate_title height_add_b">
          <span>异常详情</span>
        </div>
        <div class="addAndUpdate_content">
          <el-row :gutter="10">
            <div v-for="item in orderInfo">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="max-width: 520px">
                <el-form-item class="label_inital" :label="item.name + '：'">
                  <el-input v-model="item.val" :disabled="data.sw_status==='detail'"></el-input>
                </el-form-item>
              </el-col>
            </div>
          </el-row>
        </div>

        <div class="addAndUpdate_title height_add_b">
          <span>异常处理</span>
        </div>
        <div class="addAndUpdate_content">
          <el-form-item v-if="data.sw_status!='detail'" class="label_inital" label="处理状态：">
            <el-select clearable class="filter-item" style="width: 150px" v-model="ruleForm.status" placeholder="处理状态">
              <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="label_inital"  label="处理备注：" prop="name">
            <el-input type="textarea" v-model="ruleForm.menu" :disabled="data.sw_status==='detail'"></el-input>
          </el-form-item>
          <el-form-item v-if="data.sw_status!='detail'">
            <el-button type="primary">确认操作</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
  const calendarTypeOptions = [
    { key: 'CN', display_name: '已通过' },
    { key: 'JP', display_name: '已驳回' }
  ]
  export default {
    props: [
      'data'
    ],
    data() {
      return {
        calendarTypeOptions,
        orderInfo: [
          { key: 'name', name: '商品名称', val: '' },
          { key: 'idname', name: '提交门店', val: '' },
          { key: 'id', name: '商品条码', val: '' },
          { key: 'c_date', name: '提交时间', val: '' },
          { key: 'number', name: '异常数量', val: '' },
          { key: 'status', name: '处理状态', val: '' }
        ],
        ruleForm: {
          name: '',
          idname: '',
          id: '',
          c_date: '',
          number: '',
          menu: '',
          status: ''
        }
      }
    },
    created() {
      this.orderInfo.forEach((val) => {
        if (val.key === 'name') {
          val.val = this.data.name
        } else if (val.key === 'idname') {
          val.val = this.data.idname
        } else if (val.key === 'id') {
          val.val = this.data.id
        } else if (val.key === 'c_date') {
          val.val = this.data.c_date
        } else if (val.key === 'number') {
          val.val = this.data.number
        } else if (val.key === 'menu') {
          val.val = this.data.menu
        } else if (val.key === 'status') {
          val.val = this.data.status
        }
      })
    },
    methods: {
      backPrevPage() {
        this.$emit('sw_edit', false)
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
