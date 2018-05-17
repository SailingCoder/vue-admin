<template>
  <div class="app-container calendar-list-container">
    <div class="title-show-info" style="padding: 0 0 20px 0">
      <el-button icon="el-icon-arrow-left" @click="backPrevPage()"></el-button>
      <span>账户详情</span>
    </div>
    <el-radio-group v-model="tabPosition" style="margin-bottom: 20px;">
      <el-radio-button label="top"><span>劳动积分</span><br>
        <span>123456</span></el-radio-button>
      <el-radio-button label="right"><span>消费积分</span><br>
        <span>123456</span></el-radio-button>
      <el-radio-button label="bottom"><span>储蓄积分</span><br>
        <span>123456</span></el-radio-button>
    </el-radio-group>
    <div class="filter-container">
      <el-date-picker v-model="listQuery.value6" type="daterange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      <el-input style="width: 150px;" class="filter-item" placeholder="关键字" v-model="listQuery.title"></el-input>
      <el-button class="filter-item" type="primary" v-waves @click="handleFilter">查询</el-button>
    </div>

    <el-table :key='tableKey' :data="table" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.idnum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="90" label="交易流水号">
        <template slot-scope="scope">
          <span>{{scope.row.orderId}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" label="交易类型">
        <template slot-scope="scope">
          <span>{{scope.row.payStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" label="交易前余额">
        <template slot-scope="scope">
          <span>{{scope.row.payAgain}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="交易额">
        <template slot-scope="scope">
          <span>{{scope.row.payNum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="交易后余额">
        <template slot-scope="scope">
          <span>{{scope.row.payAfter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100" label="交易说明">
        <template slot-scope="scope">
          <span>{{scope.row.menu}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="152" label="交易时间">
        <template slot-scope="scope">
          <span>{{scope.row.date}}</span>
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
    props: [
      'data'
    ],
    directives: {
      waves
    },
    data() {
      return {
        tabPosition: 'top',
        table: [
          { idnum: 2, orderId: '123456789', payStatus: '签到赠送', payAgain: '201', payNum: '+200', payAfter: '301', menu: '这里是交易说明', date: '2017-07-06 12:00:00' },
          { idnum: 1, orderId: '123456788', payStatus: '签到赠送', payAgain: '0', payNum: '+101', payAfter: '101', menu: '这里是交易说明', date: '2017-07-06 12:00:00' }
        ],
        tableKey: 0,
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          value6: '',
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        },
        importanceOptions: [1, 2, 3],
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
    watch: {
      tabPosition(val, oldVal) {
        console.log(val)
      }
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
      },
      backPrevPage() {
        this.$emit('detail', false)
      },
      tabTable(data) {
        console.log(data)
      }
    }
  }
</script>
<style scoped>
  .tab-table{
    max-width: 170px;
    border: 1px solid #d8dce5;
    padding: 6px;font-size: 14px;
    cursor: pointer;
  }

  .tab-table-active{
    background: #f5f7fa;
    color: #000;
  }

</style>
<style>
  .el-radio-button__inner{
    padding: 6px 60px;
  }
  .el-radio-button__orig-radio:checked+.el-radio-button__inner {
    color: #fff;
    background-color: #409EFF;
    border-color: #409EFF;
    -webkit-box-shadow: -1px 0 0 0 #409EFF;
    box-shadow: -1px 0 0 0 #409EFF;
  }
</style>
