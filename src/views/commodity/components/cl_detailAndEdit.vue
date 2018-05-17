<template>
  <div>
    <div class="title-show-info">
      <el-button icon="el-icon-arrow-left" @click="backPrevPage()"></el-button>
      <span v-if="data.cl_status==='detail'">商品详情</span>
      <span v-if="data.cl_status==='edit'">商品编辑</span>
    </div>
    <div class="addAndUpdate_container">

      <el-form :model="ruleForm" ref="ruleForm" label-width="110px" class="demo-ruleForm">
        <div class="addAndUpdate_title height_add_b">
          <span>基本信息</span>
        </div>
        <div class="addAndUpdate_content">
          <el-row :gutter="10">
            <div v-for="item in orderInfo">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="max-width: 520px">
                <el-form-item class="label_inital" :label="item.name + '：'">
                  <el-input v-model="item.val" :disabled="data.cl_status==='detail'"></el-input>
                </el-form-item>
              </el-col>
            </div>
          </el-row>
        </div>
        <div class="addAndUpdate_title height_add_b">
          <span>商品销售</span>
        </div>
        <div class="addAndUpdate_content">
          <el-row :gutter="10">
            <div v-for="sale in saleInfo">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="max-width: 520px">
                <div v-if="sale.key=='saleStatus'">
                <el-form-item class="label_inital" :label="sale.name + '：'">
                  <el-select clearable class="filter-item" v-model="sale.value" style="width: 100%;" placeholder="商品类型"  :disabled="data.cl_status==='detail'">
                    <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
                    </el-option>
                  </el-select>
                </el-form-item>
                </div>
                <div v-else>
                  <el-form-item class="label_inital" :label="sale.name + '：'">
                    <el-input v-model="sale.val"  :disabled="data.cl_status==='detail'"></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </div>
          </el-row>
        </div>

        <div class="addAndUpdate_title height_add_b">
          <span>商品图片</span>
        </div>

        <div class="addAndUpdate_content" style="padding-left: 70px;">
          <el-row :gutter="10">
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
              <img :src="a4" alt="" width="240">
            </el-col>
          </el-row>
        </div>

        <div v-if="data.cl_status==='edit'" class="addAndUpdate_title">
          <span>执行操作</span>
        </div>

        <div v-if="data.cl_status==='edit'" class="addAndUpdate_footer" style="padding-left: 70px">
          <el-button type="primary" @click="submitForm('ruleForm')">保存修改</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
  import a4 from '@/assets/images/1/4.jpg'
  const calendarTypeOptions = [
    { key: '1', display_name: '平价商品' },
    { key: '2', display_name: '积分换购' },
    { key: '3', display_name: '易物置换' },
    { key: '4', display_name: '任务商品' }
  ]
  export default {
    props: [
      'data'
    ],
    data() {
      return {
        a4,
        calendarTypeOptions,
        orderInfo: [
          { key: 'orderName', name: '商品名称', val: '' },
          { key: 'orderid', name: '商品编号', val: '' },
          { key: 'ordertype', name: '商品分类', val: '' },
          { key: 'gy', name: '供货商', val: '' },
          { key: 'orderAmount', name: '在售状态', val: '' },
          { key: 'payMethod', name: '商品条码', val: '' },
          { key: 'memberAccount', name: '商品规格', val: '' },
          { key: 'consumerStore', name: '添加时间', val: '' }
        ],
        saleInfo: [
          { key: 'saleStatus', name: '销售类型', val: '平价商品' },
          { key: 'orderid', name: '置换款', val: '' },
          { key: 'ordertype', name: '返还储值', val: '' },
          { key: 'gy', name: '销售单价', val: '' },
          { key: 'orderAmount', name: '积分奖励', val: '' },
          { key: 'payMethod', name: '任务奖励', val: '' }
        ],
        ruleForm: {
          taskid: '',
          userphone: '',
          starttime: '',
          zhorderid: '',
          status: '',
          taskamount: '',
          iffinish: '',
          rewardamount: ''
        }
      }
    },
    created() {
    },
    methods: {
      indexMethod(index) {
        return index + 1
      },
      backPrevPage() {
        this.$emit('cl_detailAndEdit', false)
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

  .el-select {
    display: inherit;
  }
</style>
