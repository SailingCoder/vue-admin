<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
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
      <el-table-column align="center" min-width="110" label="充值单号">
        <template slot-scope="scope">
          <span>{{scope.row.ordernum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="充值类型">
        <template slot-scope="scope">
          <span>{{scope.row.rechargetype}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="充值金额">
        <template slot-scope="scope">
          <span>{{scope.row.rechargeamount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" label="充款账号">
        <template slot-scope="scope">
          <span>{{scope.row.userphone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="充值方式">
        <template slot-scope="scope">
          <span>{{scope.row.ifmyself}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="付款方式">
        <template slot-scope="scope">
          <span>{{scope.row.payway}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="付款结果">
        <template slot-scope="scope">
          <span>{{scope.row.payresult}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="152" label="充值时间">
        <template slot-scope="scope">
          <span>{{scope.row.paytime}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-size="listQuery.limit" layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import { fetchList, fetchPv } from '@/api/article'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'

  const calendarTypeOptions = [
    { key: 'CN', display_name: '中国' },
    { key: 'US', display_name: '美国' },
    { key: 'JP', display_name: '日本' },
    { key: 'EU', display_name: '欧元区' }
  ]

  // arr to obj ,such as { CN : "中国", US : "美国" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    name: 'memberStorageValue',
    directives: {
      waves
    },
    data() {
      return {
        table: [
          { idnum: 1, ordernum: 'CZ123456789', rechargetype: '储值', rechargeamount: '120', userphone: '13288888888', ifmyself: '本人充', payway: '微信', payresult: '充值成功', paytime: '2017-12-28 10:47:01' },
          { idnum: 2, ordernum: 'CZ123456788', rechargetype: '储值', rechargeamount: '120', userphone: '13288888889', ifmyself: '本人充', payway: '支付宝', payresult: '充值成功', paytime: '2017-12-27 10:47:01' },
          { idnum: 3, ordernum: 'CZ123456787', rechargetype: '储值', rechargeamount: '120', userphone: '13288888890', ifmyself: '本人充', payway: '微信', payresult: '充值成功', paytime: '2017-12-26 10:47:01' },
          { idnum: 4, ordernum: 'CZ123456786', rechargetype: '储值', rechargeamount: '120', userphone: '13288888891', ifmyself: '他人代充', payway: '支付宝', payresult: '充值成功', paytime: '2017-12-25 10:47:01' },
          { idnum: 5, ordernum: 'CZ123456785', rechargetype: '储值', rechargeamount: '120', userphone: '13288888892', ifmyself: '他人代充', payway: '微信', payresult: '充值成功', paytime: '2017-12-24 10:47:01' },
          { idnum: 6, ordernum: 'CZ123456784', rechargetype: '储值', rechargeamount: '120', userphone: '13288888893', ifmyself: '他人代充', payway: '支付宝', payresult: '充值成功', paytime: '2017-12-23 10:47:01' },
          { idnum: 7, ordernum: 'CZ123456783', rechargetype: '储值', rechargeamount: '120', userphone: '13288888894', ifmyself: '本人充', payway: '微信', payresult: '充值成功', paytime: '2017-12-22 10:47:01' },
          { idnum: 8, ordernum: 'CZ123456782', rechargetype: '储值', rechargeamount: '120', userphone: '13288888895', ifmyself: '本人充', payway: '微信', payresult: '充值成功', paytime: '2017-12-21 10:47:01' },
          { idnum: 9, ordernum: 'CZ123456781', rechargetype: '储值', rechargeamount: '120', userphone: '13288888896', ifmyself: '本人充', payway: '微信', payresult: '充值成功', paytime: '2017-12-20 10:47:01' },
          { idnum: 10, ordernum: 'CZ123456779', rechargetype: '储值', rechargeamount: '120', userphone: '13288888897', ifmyself: '本人充', payway: '微信', payresult: '充值成功', paytime: '2017-12-19 10:47:01' },
          { idnum: 11, ordernum: 'CZ123456778', rechargetype: '储值', rechargeamount: '120', userphone: '13288888898', ifmyself: '本人充', payway: '微信', payresult: '充值成功', paytime: '2017-12-18 10:47:01' }
        ],
        tableKey: 0,
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        },
        importanceOptions: ['充款账号', '充值单号'],
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
        }
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

