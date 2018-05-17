<template>
  <div>
    <div class="title-show-info">
      <el-button icon="el-icon-arrow-left" @click="backPrevPage()"></el-button>
      <span>任务详情</span>
    </div>
    <div class="addAndUpdate_container">

      <el-form :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <div class="addAndUpdate_title height_add_b">
          <span>任务信息</span>
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
          <span>任务订单</span>
        </div>
        <div>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column type="index" align="center" label="序号" :index="indexMethod"></el-table-column>
            <el-table-column prop="orderid"  align="center" label="任务订单"></el-table-column>
            <el-table-column prop="ordertype"  align="center" label="订单类型"></el-table-column>
            <el-table-column prop="comsumescore"  align="center" label="订单金额"></el-table-column>
            <el-table-column prop="date"  align="center" label="创建日期"></el-table-column>
          </el-table>
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
          { key: 'taskid', name: '任务单号', val: '' },
          { key: 'iffinish', name: '已完成金额', val: '' },
          { key: 'userphone', name: '会员账号', val: '' },
          { key: 'iffinish', name: '未完成金额', val: '' },
          { key: 'starttime', name: '创建时间', val: '' },
          { key: 'taskamount', name: '任务金额', val: '' },
          { key: 'zhorderid', name: '关联置换订单', val: '' },
          { key: 'name', name: '申领方式', val: '' },
          { key: 'status', name: '任务状态', val: '' },
          { key: 'name', name: '申领时间', val: '' },
          { key: 'rewardamount', name: '任务奖励', val: '' },
          { key: 'name', name: '奖励时间', val: '' }
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
        },
        tableData: [
          { idnum: 1, orderid: 'DD123456111', ordertype: '任务订单', comsumescore: '积分1000,储值1000', cashscore: '1000', leftscore: '0', leftcashscore: '0', date: '2017-12-12 11:28:01' },
          { idnum: 2, orderid: 'DD123456112', ordertype: '任务订单', comsumescore: '积分1000,储值1000', cashscore: '2000', leftscore: '1000', leftcashscore: '1000', date: '2017-11-06 11:28:01' },
          { idnum: 3, orderid: 'DD123456113', ordertype: '任务订单', comsumescore: '积分1000,储值1000', cashscore: '3000', leftscore: '3000', leftcashscore: '3000', date: '2017-10-25 11:28:01' },
          { idnum: 4, orderid: 'DD123456114', ordertype: '任务订单', comsumescore: '积分1000,储值1000', cashscore: '1000', leftscore: '6000', leftcashscore: '6000', date: '2017-10-11 11:28:01' },
          { idnum: 5, orderid: 'DD123456115', ordertype: '任务订单', comsumescore: '积分1000,储值1000', cashscore: '3000', leftscore: '7000', leftcashscore: '7000', date: '2017-10-07 11:28:01' }
        ]
      }
    },
    created() {
      this.ruleForm = {
        taskid: this.data.taskid,
        userphone: this.data.userphone,
        starttime: this.data.starttime,
        zhorderid: this.data.zhorderid,
        status: this.data.status,
        taskamount: this.data.taskamount,
        iffinish: this.data.iffinish,
        rewardamount: this.data.rewardamount
      }
      this.orderInfo.forEach((val) => {
        if (val.key === 'taskid') {
          val.val = this.data.taskid
        } else if (val.key === 'userphone') {
          val.val = this.data.userphone
        } else if (val.key === 'starttime') {
          val.val = this.data.starttime
        } else if (val.key === 'zhorderid') {
          val.val = this.data.zhorderid
        } else if (val.key === 'status') {
          val.val = this.data.status
        } else if (val.key === 'taskamount') {
          val.val = this.data.taskamount
        } else if (val.key === 'iffinish') {
          val.val = this.data.iffinish
        } else if (val.key === 'rewardamount') {
          val.val = this.data.rewardamount
        } else if (val.key === 'name') {
          val.val = this.data.name
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
</style>
