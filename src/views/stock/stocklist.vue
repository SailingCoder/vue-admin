<template>
  <div v-if="!sl_addState" class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input style="width: 150px;" class="filter-item" placeholder="商品条码：" v-model="listQuery.title"></el-input>
      <el-input style="width: 150px;" class="filter-item" placeholder="入库单号：" v-model="listQuery.title"></el-input>
      <el-input style="width: 150px;" class="filter-item" placeholder="入库门店：" v-model="listQuery.title"></el-input>
      <el-input style="width: 150px;" class="filter-item" placeholder="供应商：" v-model="listQuery.title"></el-input>
      <el-button class="filter-item" type="primary" v-waves @click="handleFilter">查询</el-button>
      <el-button class="filter-item" type="primary" v-waves @click="fun_showSl_add">新增入库</el-button>
    </div>

    <el-table :data="table" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.idnum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" label="商品名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" label="商品条码">
        <template slot-scope="scope">
          <span>{{scope.row.num}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="80" label="入库数量">
        <template slot-scope="scope">
          <span>{{scope.row.book}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" label="入库单号">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" label="入库门店">
        <template slot-scope="scope">
          <span>{{scope.row.exchange}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" label="供应商">
        <template slot-scope="scope">
          <span>{{scope.row.gy}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100" label="操作员">
        <template slot-scope="scope">
          <span>{{scope.row.cz}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="152" label="入库时间">
        <template slot-scope="scope">
          <span>{{scope.row.date}}</span>
        </template>
      </el-table-column>
    </el-table>

    <!--<div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-size="listQuery.limit" layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div>-->

  </div>

  <div v-else-if="sl_addState">
    <sl_add :data="sl_addData" @sl_add="fun_hideSl_add"></sl_add>
  </div>
</template>

<script>
  import { fetchList, fetchPv } from '@/api/article'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'
  import sl_add from './components/sl_add'

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
    name: 'checkIn',
    components: { sl_add },
    directives: {
      waves
    },
    data() {
      return {
        table: [
          { idnum: 1, num: 'QG00001', name: '东北糯米', id: 'RK2017122101', price: '￥120.00', book: '100', gy: '麒麟1号供应商', cz: 'GRK001', exchange: '圣煜麒麟1号店', accoundId: 'RK2017122101', date: '2017-12-07 17:18:00' },
          { idnum: 2, num: 'QG00002', name: '香香香糯米', id: 'RK2017122101', price: '￥120.00', book: '100', gy: '麒麟1号供应商', cz: 'GRK002', exchange: '圣煜麒麟1号店', accoundId: 'RK2017122101', date: '2017-12-07 7:10:00' },
          { idnum: 3, num: 'QG00003', name: '盘锦糯米', id: 'RK2017122101', price: '￥120.00', book: '100', gy: '麒麟1号供应商', cz: 'GRK003', exchange: '圣煜麒麟1号店', accoundId: 'RK2017122101', date: '2017-12-06 17:18:00' }
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
        },
        sl_addData: '',
        sl_addState: false
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
      fun_showSl_add(val) {
        this.sl_addData = val
        this.sl_addState = true
      },
      fun_hideSl_add(data) {
        this.sl_addState = false
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

