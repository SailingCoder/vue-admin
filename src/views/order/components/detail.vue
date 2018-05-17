<template>
  <div>
    <div class="title-show-info">
      <el-button icon="el-icon-arrow-left" @click="backPrevPage()"></el-button>
      <span>订单详情</span>
    </div>
    <div class="addAndUpdate_container">

      <el-form label-width="100px" class="demo-ruleForm">
        <div class="addAndUpdate_title height_add_b">
          <span>基本信息</span>
        </div>
        <div class="addAndUpdate_content">
          <el-row :gutter="10">
            <div v-for="basic in orderInfo">
              <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="24" style="max-width: 520px">
                <el-form-item class="label_inital" :label="basic.name + '：'">
                  <el-input v-model="basic.val" disabled></el-input>
                </el-form-item>
              </el-col>
            </div>
          </el-row>
        </div>
        <div class="addAndUpdate_title height_add_b">
          <span>奖励信息</span>
        </div>
        <div class="addAndUpdate_content">
          <el-row :gutter="10">
            <div v-for="basic in rewardInfo">
              <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="24" style="max-width: 520px">
                <el-form-item class="label_inital" :label="basic.name + '：'">
                  <el-input v-model="basic.val" disabled></el-input>
                </el-form-item>
              </el-col>
            </div>
          </el-row>
        </div>
        <div class="addAndUpdate_title height_add_b">
          <span>商品信息</span>
        </div>
        <div>
          <el-table :data="tableData" style="width: 100%" border>
            <el-table-column type="index" align="center" label="序号" width="55" :index="indexMethod"></el-table-column>
            <el-table-column prop="goodsname"  align="center" label="商品名称"></el-table-column>
            <el-table-column prop="goodsnum"  align="center" label="商品编码"></el-table-column>
            <el-table-column prop="barcode"  align="center" label="商品条码"></el-table-column>
            <el-table-column prop="goodstype"  align="center" label="商品类型"></el-table-column>
            <el-table-column prop="price"  align="center" label="商品单价"></el-table-column>
            <el-table-column prop="zhprice"  align="center" label="置换款"></el-table-column>
            <el-table-column prop="number"  align="center" label="数量"></el-table-column>
            <el-table-column prop="payamount"  align="center" label="单件奖励"></el-table-column>
            <el-table-column prop="rewardone" align="center"  label="奖励小计"></el-table-column>
          </el-table>
          <div class="totlesum">
            <div>奖励总计：<span>1000</span></div>
            <div>应付总计：<span>1000</span></div>
          </div>
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
          { key: 'orderid', name: '订单号', val: '' },
          { key: 'amount', name: '订单金额', val: '' },
          { key: 'ordertype', name: '订单类型', val: '' },
          { key: 'payway', name: '支付方式', val: '' },
          { key: 'status', name: '订单状态', val: '' },
          { key: 'userphone', name: '购买会员', val: '' },
          { key: 'ordertime', name: '交易时间', val: '' },
          { key: 'md', name: '购买门店', val: '' }
        ],
        rewardInfo: [
          { key: 'ordertime', name: '积分奖励', val: '' },
          { key: 'ordertime', name: '过期时间', val: '' },
          { key: 'add', name: '储值返利', val: '' },
          { key: 'add', name: '领取时间', val: '' },
          { key: 'add', name: '任务奖励', val: '' },
          { key: 'ordertime', name: '奖励时间', val: '' }
        ],
        tableData: []
      }
    },
    created() {
      this.tableData = []
      if (this.data.ordertype === '平价订单') {
        this.tableData = [
          { idnum: 1, goodsname: '特鲜饼干', goodsnum: 'QG0001', barcode: '3698521471', goodstype: '平价商品', price: '￥20.00', zhprice: '否', number: '1', payamount: '￥20.00', rewardone: '20', rewardamount: '20' },
          { idnum: 2, goodsname: '香飘飘', goodsnum: 'QG0002', barcode: '3698521472', goodstype: '平价商品', price: '￥20.00', zhprice: '否', number: '1', payamount: '￥20.00', rewardone: '20', rewardamount: '20' },
          { idnum: 3, goodsname: '阿尔卑斯硬糖', goodsnum: 'QG0003', barcode: '3698521473', goodstype: '平价商品', price: '￥30.00', zhprice: '否', number: '1', payamount: '￥20.00', rewardone: '30', rewardamount: '30' },
          { idnum: 4, goodsname: '牛轧糖', goodsnum: 'QG0004', barcode: '3698521474', goodstype: '平价商品', price: '￥30.00', zhprice: '否', number: '1', payamount: '￥20.00', rewardone: '30', rewardamount: '30' }
        ]
      } else if (this.data.ordertype === '积分换购') {
        this.tableData = [
          { idnum: 1, goodsname: '羊毛衫1件', goodsnum: 'QG0005', barcode: '3698521475', goodstype: '换购商品', price: '积分100,储值100', zhprice: '否', number: '2', payamount: '积分200,储值200', rewardone: '80', rewardamount: '160' },
          { idnum: 2, goodsname: '被褥4件套', goodsnum: 'QG0006', barcode: '3698521476', goodstype: '换购商品', price: '积分150,储值150', zhprice: '否', number: '1', payamount: '积分150,储值150', rewardone: '100', rewardamount: '200' }
        ]
      } else if (this.data.ordertype === '易物置换') {
        this.tableData = [
          { idnum: 1, goodsname: 'iphone7plus', goodsnum: 'QG0007', barcode: '3698521477', goodstype: '易物商品', price: '5000', zhprice: '5000', number: '1', payamount: '10000', rewardone: '8000', rewardamount: '8000' }
        ]
      } else if (this.data.ordertype === '任务订单') {
        this.tableData = [
          { idnum: 1, goodsname: '古风一木纸巾', goodsnum: 'QG0008', barcode: '3698521478', goodstype: '置换商品', price: '积分30,储值30', zhprice: '否', number: '1', payamount: '积分30,储值30', rewardone: '10', rewardamount: '10' },
          { idnum: 2, goodsname: '威露士衣物消毒液', goodsnum: 'QG0008', barcode: '3698521479', goodstype: '置换商品', price: '积分40,储值40', zhprice: '否', number: '1', payamount: '积分40,储值40', rewardone: '20', rewardamount: '20' }
        ]
      }
      this.orderInfo.forEach((val) => {
        if (val.key === 'orderid') {
          val.val = this.data.orderid
        } else if (val.key === 'amount') {
          val.val = this.data.amount
        } else if (val.key === 'ordertime') {
          val.val = this.data.ordertime
        } else if (val.key === 'payway') {
          val.val = this.data.payway
        } else if (val.key === 'userphone') {
          val.val = this.data.userphone
        } else if (val.key === 'add') {
          val.val = '200积分'
        } else if (val.key === 'md') {
          val.val = '圣煜麒麟西三旗店'
        } else if (val.key === 'status') {
          val.val = this.data.status
        } else if (val.key === 'ordertype') {
          val.val = this.data.ordertype
        }
      })
    },
    methods: {
      indexMethod(index) {
        return index + 1
      },
      backPrevPage() {
        this.$emit('detail', false)
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

  .totlesum{
    height: 60px;
    line-height: 60px;
    margin-bottom: 20px;
    font-size: 16px;
    color: #5a5e66;
    font-weight: 700;
  }

  .totlesum>div{
    float: right;
  }

  .totlesum>div>span{
    font-weight: normal;
    font-size: 15px;
  }

  .totlesum>div:last-child{
    margin-right: 40px
  }
</style>
