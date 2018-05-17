<template>
  <div>
    <div class="title-show-info">
      <el-button icon="el-icon-arrow-left" @click="backPrevPage()"></el-button>
      <span>付款</span>
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
          <span>付款信息</span>
        </div>
        <div v-if="data.payway=='第三方支付'" class="addAndUpdate_content" style="text-align: center;font-size: 14px">
          <p>请消费者使用微信/支付宝客户端扫码付款，120s有效</p>
          <p><img :src="hp1" alt="" style="width: 200px;height: 200px;"></p>
        </div>
        <div v-if="data.payway=='积分+储值支付'" class="addAndUpdate_content" style="text-align: center;font-size: 14px">
          <h2>请消费者使用圣煜麒麟客户端完成付款！</h2>
          <p>操作路径：订单->消费消息->待付款订单消息->确认付款</p>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
  import hp1 from '@/assets/images/1514461194.png'

  export default {
    props: [
      'data'
    ],
    data() {
      return {
        hp1,
        orderInfo: [
          { key: 'orderId', name: '订单编号', val: '' },
          { key: 'orderType', name: '订单类型', val: '' },
          { key: 'orderStatus', name: '订单状态', val: '' },
          { key: 'orderDate', name: '下单时间', val: '' },
          { key: 'orderAmount', name: '应付金额', val: '' },
          { key: 'memberAccount', name: '会员账号', val: '' }
        ]
      }
    },
    created() {

    },
    methods: {
      backPrevPage() {
        this.$emit('sl_pay', false)
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
