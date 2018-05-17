<template>
  <div v-if="!sl_detailState&&!sl_payState&&!sl_refundState" class="app-container calendar-list-container">
    <div class="filter-container">
      <el-date-picker v-model="listQuery.value6" type="daterange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期">
      </el-date-picker>
      <el-select clearable class="filter-item" style="width: 150px" v-model="listQuery.type" placeholder="订单类型">
        <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>
      <el-input style="width: 150px;" class="filter-item" placeholder="会员账号：" v-model="listQuery.title"></el-input>
      <el-input style="width: 150px;" class="filter-item" placeholder="订单号：" v-model="listQuery.title"></el-input>
      <el-input style="width: 150px;" class="filter-item" placeholder="购买门店：" v-model="listQuery.title"></el-input>
      <el-button class="filter-item" type="primary" v-waves @click="handleFilter">查询</el-button>
    </div>
    <el-table :key='tableKey' :data="table" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.idnum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" label="订单编号">
        <template slot-scope="scope">
          <span>{{scope.row.orderid}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="订单类型">
        <template slot-scope="scope">
          <span>{{scope.row.ordertype}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="90" label="会员账号">
        <template slot-scope="scope">
          <span>{{scope.row.userphone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="订单金额">
        <template slot-scope="scope">
          <span>{{(scope.row.amount).split(',')[0]}}</span></br>
          <span>{{(scope.row.amount).split(',')[1]}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="115" label="支付方式">
        <template slot-scope="scope">
          <span>{{scope.row.payway}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="订单状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status==='已退单'||scope.row.status==='已取消'" style="color: red;">{{scope.row.status}}</span>
          <span v-else>{{scope.row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="152" label="购买门店">
        <template slot-scope="scope">
          <span>{{scope.row.shoppingname}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="95" label="购买时间">
        <template slot-scope="scope">
          <span>{{(scope.row.ordertime).split(' ')[0]}}</span></br>
          <span>{{(scope.row.ordertime).split(' ')[1]}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="80" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="show_sl_detail(scope.row)">详情</el-button>
          <el-button type="text" size="small" @click="show_sl_pay(scope.row)">付款</el-button>
          <el-button type="text" size="small">打印</el-button>
          <el-button type="text" size="small" @click="show_sl_refund(scope.row)">退款</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-size="listQuery.limit" layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div>

  </div>

  <div v-else-if="sl_detailState">
    <sl_detail :data="sl_detailData" @sl_detail="hide_sl_detail"></sl_detail>
  </div>

  <div v-else-if="sl_payState">
    <sl_pay :data="sl_payData" @sl_pay="hide_sl_pay"></sl_pay>
  </div>

  <div v-else-if="sl_refundState">
    <sl_refund :data="sl_refundData" @sl_refund="hide_sl_refund"></sl_refund>
  </div>
</template>

<script>
  import { fetchList, fetchPv } from '@/api/article'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'
  import sl_detail from './components/sl_detail'
  import sl_pay from './components/sl_pay'
  import sl_refund from './components/sl_refund'

  const calendarTypeOptions = [
    { key: '0', display_name: '全部' },
    { key: '1', display_name: '平价订单' },
    { key: '2', display_name: '换购订单' },
    { key: '3', display_name: '置换订单' },
    { key: '4', display_name: '任务订单' }
  ]

  // arr to obj ,such as { CN : "中国", US : "美国" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    name: 'allOrder',
    components: { sl_detail, sl_pay, sl_refund },
    directives: {
      waves
    },
    data() {
      return {
        table: [
          { idnum: 1, orderid: 'DD123456789', ordertype: '平价订单', userphone: '123456987', amount: '￥400.00', payway: '第三方支付', status: '待付款', shoppingname: '圣煜麒麟西三旗店', ordertime: '2017-12-08 11:28:01' },
          { idnum: 2, orderid: 'DD123456791', ordertype: '积分兑换', userphone: '123456987', amount: '积分100,储值100', payway: '积分+储值支付', status: '待付款', shoppingname: '圣煜麒麟西三旗店', ordertime: '2017-12-07 11:28:01' },
          { idnum: 3, orderid: 'DD123456792', ordertype: '易物置换', userphone: '123456987', amount: '￥1000.00', payway: '第三方支付', status: '待付款', shoppingname: '圣煜麒麟西三旗店', ordertime: '2017-12-06 11:28:01' },
          { idnum: 4, orderid: 'DD123456793', ordertype: '任务订单', userphone: '123456987', amount: '积分100,储值100', payway: '积分+储值支付', status: '待付款', shoppingname: '圣煜麒麟西三旗店', ordertime: '2017-12-05 11:28:01' }
        ],
        tableKey: 0,
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          value6: '',
          page: 1,
          limit: 10,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        },
        importanceOptions: ['订单号', '会员账号', '关联订单'],
        calendarTypeOptions,
        statusOptions: ['published', 'draft', 'deleted'],
        temp: {
          id: undefined,
          importance: 1,
          remark: '',
          timestamp: new Date(),
          title: '',
          type: '',
          status: 'published'
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          type: [{ required: true, message: 'type is required', trigger: 'change' }],
          timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        },
        sl_payData: '',
        sl_payState: false,
        sl_refundData: '',
        sl_refundState: false,
        sl_detailData: '',
        sl_detailState: false
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    created() {
      this.getList()
    },
    methods: {
      show_sl_detail(val) {
        this.sl_detailData = val
        this.sl_detailState = true
      },
      hide_sl_detail(val) {
        this.sl_detailState = false
      },
      show_sl_pay(val) {
        this.sl_payData = val
        this.sl_payState = true
      },
      hide_sl_pay(val) {
        this.sl_payState = false
      },
      show_sl_refund(val) {
        this.sl_refundData = val
        this.sl_refundState = true
      },
      hide_sl_refund(val) {
        this.sl_refundState = false
      },
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.list = response.data.items
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },

      handleFetchPv(pv) {
        fetchPv(pv).then(response => {
          this.pvData = response.data.pvData
          this.dialogPvVisible = true
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      }
    }
  }
</script>

