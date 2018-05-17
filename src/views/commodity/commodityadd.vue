<template>
  <div>
    <div class="addAndUpdate_container" style="padding-top: 40px">

      <el-form :model="ruleForm" ref="ruleForm" label-width="110px" class="demo-ruleForm">
        <div class="addAndUpdate_title height_add_b">
          <span>基本信息</span>
        </div>
        <div class="addAndUpdate_content">
          <div v-for="item in orderInfo">
            <div v-if="item.key=='ordertype'">
              <el-form-item class="label_inital" :label="item.name + '：'">
                <el-select clearable class="filter-item" v-model="item.value" style="max-width: 250px;width: 100%;" placeholder="请选择">
                  <el-option v-for="item in ordertype" :key="item.key" :label="item.display_name" :value="item.key">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div v-else-if="item.key=='gy'">
              <el-form-item class="label_inital" :label="item.name + '：'">
                <el-select clearable class="filter-item" v-model="item.value" style="max-width: 250px;width: 100%;" placeholder="请选择">
                  <el-option v-for="item in gy" :key="item.key" :label="item.display_name" :value="item.key">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div v-else>
              <el-form-item class="label_inital" :label="item.name + '：'">
                <el-input v-model="item.val"></el-input>
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="addAndUpdate_title height_add_b">
          <span>商品销售</span>
        </div>
        <div class="addAndUpdate_content">
          <div v-for="sale in saleInfo">
            <div v-if="sale.key=='saleStatus'">
              <el-form-item class="label_inital" :label="sale.name + '：'">
                <el-select clearable class="filter-item" v-model="sale.value" style="max-width: 250px;width: 100%;" placeholder="请选择">
                  <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div v-else>
              <el-form-item class="label_inital" :label="sale.name + '：'">
                <el-input v-model="sale.val"></el-input>
              </el-form-item>
            </div>
          </div>
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

        <div class="addAndUpdate_title">
          <span>执行操作</span>
        </div>

        <div class="addAndUpdate_footer" style="padding-left: 70px">
          <el-button type="primary" @click="submitForm('ruleForm')">新增</el-button>
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
  const ordertype = [
    { key: '1', display_name: '品类1' },
    { key: '2', display_name: '品类2' }
  ]
  const gy = [
    { key: '1', display_name: '供应商1' },
    { key: '2', display_name: '供应商2' }
  ]
  export default {
    data() {
      return {
        a4,
        gy,
        ordertype,
        calendarTypeOptions,
        orderInfo: [
          { key: 'ordertype', name: '商品品类', val: '' },
          { key: 'gy', name: '供货商', val: '' },
          { key: 'orderName', name: '商品名称', val: '' },
          { key: 'payMethod', name: '商品条码', val: '' },
          { key: 'memberAccount', name: '商品规格', val: '' },
          { key: 'orderprice', name: '商品进价', val: '' }
        ],
        saleInfo: [
          { key: 'saleStatus', name: '销售类型', val: '平价商品' },
          { key: 'gy', name: '销售单价', val: '' },
          { key: 'gy', name: '销售单价', val: '' },
          { key: 'orderAmount', name: '积分奖励', val: '' },
          { key: 'ordertype', name: '返还储值', val: '' },
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
