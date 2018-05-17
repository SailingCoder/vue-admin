<template>
  <div>
    <div class="title-show-info">
      <el-button icon="el-icon-arrow-left" @click="backPrevPage()"></el-button>
      <span>退款</span>
    </div>
    <div class="addAndUpdate_container">

      <el-form label-width="105px" class="demo-ruleForm">
        <div class="addAndUpdate_title height_add_b">
          <span>基本信息</span>
        </div>
        <div class="addAndUpdate_content">
          <el-row :gutter="10">
            <div v-for="item in orderInfo">
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                <el-form-item class="label_inital" :label="item.name + '：'">
                  <el-input v-model="item.val" disabled></el-input>
                </el-form-item>
              </el-col>
            </div>
          </el-row>
        </div>
        <div class="addAndUpdate_title height_add_b">
          <span>退款操作</span>
        </div>
        <div class="addAndUpdate_content">
          <div v-for="item in refundInfo">
            <div v-if="item.key=='refundType'">
              <el-form-item label="操作方式：">
                <el-radio-group v-model="item.val">
                  <el-radio label="原支付渠道"></el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div v-else>
              <el-form-item class="label_inital" :label="item.name + '：'">
                <el-input v-model="item.val" disabled></el-input>
              </el-form-item>
            </div>
          </div>
        </div>

        <div class="addAndUpdate_title">
          <span>执行操作</span>
        </div>
        <div class="addAndUpdate_footer">
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">退款</el-button>
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
        orderInfo: [
          { key: 'orderId', name: '订单编号', val: '' },
          { key: 'orderType', name: '订单类型', val: '' },
          { key: 'orderStatus', name: '订单状态', val: '' },
          { key: 'orderDate', name: '下单时间', val: '' },
          { key: 'orderAmount', name: '应付金额', val: '' },
          { key: 'payMethod', name: '支付方式', val: '' },
          { key: 'memberAccount', name: '会员账号', val: '' }
        ],
        refundInfo: [
          { key: 'refundAmount', name: '应退金额', val: '' },
          { key: 'refundType', name: '退回方式', val: '原支付渠道' },
          { key: 'refundProgress', name: '退款进度', val: '' },
          { key: 'refundMenu', name: '退款备注', val: '' }
        ]
      }
    },
    created() {

    },
    methods: {
      backPrevPage() {
        this.$emit('sl_refund', false)
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

  .el-radio-group{
    padding-top: 12px;
  }
</style>
