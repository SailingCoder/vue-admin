<template>
  <div v-if="!detailState" class="app-container calendar-list-container">
    <div class="filter-container">
      <el-date-picker v-model="listQuery.value6" type="daterange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期">
      </el-date-picker>
      <el-select clearable class="filter-item" style="width: 150px" v-model="listQuery.type" placeholder="订单类型">
        <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>
      <el-select clearable style="width: 150px" class="filter-item" v-model="listQuery.importance" placeholder="查询项目">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <el-input style="width: 150px;" class="filter-item" placeholder="输入查询内容：" v-model="listQuery.title"></el-input>
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
      <el-table-column align="center" min-width="110" label="会员账号">
        <template slot-scope="scope">
          <span>{{scope.row.userphone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="订单金额">
        <template slot-scope="scope">
          <span>{{scope.row.amount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="支付方式">
        <template slot-scope="scope">
          <span>{{scope.row.payway}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100" label="订单状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status==='已退单'||scope.row.status==='已取消'" style="color: red;">{{scope.row.status}}</span>
          <span v-else>{{scope.row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="152" label="购买时间">
        <template slot-scope="scope">
          <span>{{scope.row.ordertime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="80" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="memberlAccount_details(scope.row)">订单详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-size="listQuery.limit" layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div>

  </div>

  <div v-else-if="detailState">
    <detail :data="detailData" @detail="hideDetailState"></detail>
  </div>
</template>

<script>
  import { fetchList, fetchPv } from '@/api/article'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'
  import detail from './components/detail'

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
    components: { detail },
    directives: {
      waves
    },
    data() {
      return {
        table: [
          { idnum: 1, orderid: 'DD123456789', ordertype: '平价订单', userphone: '13288888888', amount: '100', payway: '', status: '待支付', ordertime: '2017-12-28 11:28:01' },
          { idnum: 2, orderid: 'DD123456791', ordertype: '平价订单', userphone: '13288888887', amount: '100', payway: '微信', status: '成功交易', ordertime: '2017-12-27 11:28:01' },
          { idnum: 3, orderid: 'DD123456792', ordertype: '平价订单', userphone: '13288888886', amount: '100', payway: '微信', status: '已退单', ordertime: '2017-12-26 11:28:01' },
          { idnum: 4, orderid: 'DD123456793', ordertype: '平价订单', userphone: '13288888885', amount: '100', payway: '支付宝', status: '已奖励', ordertime: '2017-12-25 11:28:01' },
          { idnum: 5, orderid: 'DD123456794', ordertype: '积分换购', userphone: '13288888884', amount: '100', payway: '积分+储值', status: '成功交易', ordertime: '2017-12-24 11:28:01' },
          { idnum: 6, orderid: 'DD123456795', ordertype: '积分换购', userphone: '13288888883', amount: '100', payway: '', status: '已取消', ordertime: '2017-12-23 11:28:01' },
          { idnum: 7, orderid: 'DD123456796', ordertype: '易物置换', userphone: '13288888882', amount: '1000', payway: '微信', status: '成功交易', ordertime: '2017-12-22 11:28:01' },
          { idnum: 8, orderid: 'DD123456797', ordertype: '易物置换', userphone: '13288888881', amount: '1000', payway: '支付宝', status: '成功交易', ordertime: '2017-12-21 11:28:01' },
          { idnum: 9, orderid: 'DD123456798', ordertype: '任务订单', userphone: '13288888880', amount: '100', payway: '积分+储值', status: '成功交易', ordertime: '2017-12-20 11:28:01' },
          { idnum: 10, orderid: 'DD123456799', ordertype: '任务订单', userphone: '13288888889', amount: '100', payway: '', status: '已取消', ordertime: '2017-12-19 11:28:01' }
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
        editData: '',
        editState: false,
        adjustData: '',
        adjustState: false,
        detailData: '',
        detailState: false
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
      memberlAccount_details(val) {
        this.detailData = val
        this.detailState = true
      },
      hideDetailState(val) {
        this.detailState = false
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

