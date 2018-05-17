<template>
  <div v-if="!sw_editState" class="app-container calendar-list-container">
    <div class="filter-container">
      <el-date-picker v-model="listQuery.value6" type="daterange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期">
      </el-date-picker>
      <el-select clearable class="filter-item" style="width: 150px" v-model="listQuery.type" placeholder="处理状态">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>
      <el-input style="width: 150px;" class="filter-item" placeholder="商品条码：" v-model="listQuery.title"></el-input>
      <el-input style="width: 150px;" class="filter-item" placeholder="提交门店：" v-model="listQuery.title"></el-input>
      <el-button class="filter-item" type="primary" v-waves @click="handleFilter">查询</el-button>
    </div>

    <el-table :data="table" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.idnum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品条码">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="异常数量">
        <template slot-scope="scope">
          <span>{{scope.row.number}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="提交门店">
        <template slot-scope="scope">
          <span>{{scope.row.idname}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作人">
        <template slot-scope="scope">
          <span>{{scope.row.gy}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="处理状态">
        <template slot-scope="scope">
          <span>{{scope.row.stauts}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="提交时间">
        <template slot-scope="scope">
          <span>{{scope.row.c_date}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="处理时间">
        <template slot-scope="scope">
          <span>{{scope.row.u_date}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="120" class-name="small-padding">
        <template slot-scope="scope">
          <el-button v-if="scope.row.stauts=='未处理'" type="text" size="small" @click="show_sw_edit('edit', scope.row)">去处理</el-button>
          <el-button v-else type="text" size="small" @click="show_sw_edit('detail', scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

   <!-- <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-size="listQuery.limit" layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div>-->

  </div>

  <div v-else-if="sw_editState">
    <sw_edit :data="sw_editData" @sw_edit="hide_sw_edit"></sw_edit>
  </div>
</template>

<script>
  import { fetchList, fetchPv } from '@/api/article'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'
  import sw_edit from './components/sw_edit'

  const calendarTypeOptions = [
    { key: 'CN', display_name: '待处理' },
    { key: 'US', display_name: '已通过' },
    { key: 'JP', display_name: '已驳回' }
  ]

  // arr to obj ,such as { CN : "中国", US : "美国" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    name: 'checkIn',
    components: { sw_edit },
    directives: {
      waves
    },
    data() {
      return {
        table: [
          { idnum: 1, num: '10928736453', name: 'richeese饼干', id: '123456789', idname: '圣煜麒麟1号店', number: '2', gy: '管理员1', stauts: '未处理', c_date: '2017-12-07 17:18:00', u_date: '' },
          { idnum: 2, num: '10928736454', name: '简约风条纹杯', id: '123456788', idname: '圣煜麒麟1号店', number: '-2', gy: '管理员1', stauts: '已通过', c_date: '2017-12-07 17:18:00', u_date: '2017-12-07 17:18:00' },
          { idnum: 3, num: '10928736455', name: '谷风一木餐巾纸', id: '123456787', idname: '圣煜麒麟1号店', number: '2', gy: '管理员1', stauts: '已通过', c_date: '2017-12-07 17:18:00', u_date: '2017-12-07 17:18:00' },
          { idnum: 3, num: '10928736456', name: '美的电热水壶', id: '123456787', idname: '圣煜麒麟1号店', number: '2', gy: '管理员1', stauts: '已驳回', c_date: '2017-12-07 17:18:00', u_date: '2017-12-07 17:18:00' }
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
        sw_editData: '',
        sw_editState: false
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
      show_sw_edit(status, val) {
        val.sw_status = status
        this.sw_editData = val
        this.sw_editState = true
      },
      hide_sw_edit(data) {
        this.sw_editState = false
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

