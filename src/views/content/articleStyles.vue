<template>
  <div v-if="!editState&&!addAndUpdateState" class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button class="filter-item" v-waves @click="addAndUpdate('add')" type="primary">添加</el-button>
    </div>

    <el-table :key='tableKey' :data="table" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.idnum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="90" label="类型名称">
        <template slot-scope="scope">
          <span>{{scope.row.typename}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" label="备注">
        <template slot-scope="scope">
          <span>{{scope.row.explain}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" label="添加时间">
        <template slot-scope="scope">
          <span>{{scope.row.date}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="120" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addAndUpdate(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="memberlList_edit(scope.row)">添加文章</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--<div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-size="listQuery.limit" layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div>-->

  </div>

  <div v-else-if="editState">
    <edit :data="editData" @articleAddUpdate="hideEditState"></edit>
  </div>

  <div v-else-if="addAndUpdateState">
    <addUpdate :data="addAndUpdateData" @addAndUpdate="hideAddAndUpdateState"></addUpdate>
  </div>
</template>

<script>
  import { fetchList, fetchPv } from '@/api/article'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'
  import edit from './components/articleAddUpdate'
  import addUpdate from './components/addAndUpdate'

  const calendarTypeOptions = [
    { key: 'CN', display_name: '会员账号' },
    { key: 'US', display_name: '姓名' },
    { key: 'JP', display_name: '身份账号' }
  ]

  // arr to obj ,such as { CN : "中国", US : "美国" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    name: 'articleStyles',
    components: { edit, addUpdate },
    directives: {
      waves
    },
    data() {
      return {
        table: [
          { idnum: 1, typename: '今日看点', explain: '每日最新企业资讯', date: '2017-11-01 12:25:25' },
          { idnum: 2, typename: '精选商户', explain: '精选最优商户信息', date: '2017-11-02 12:25:25' },
          { idnum: 3, typename: '销售冠军', explain: '播报每月销售冠军', date: '2017-11-03 12:25:25' },
          { idnum: 4, typename: '商品推荐', explain: '为用户推荐最新商品', date: '2017-11-04 12:25:25' }
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
        importanceOptions: ['全部', '身份认证', '银行卡认账'],
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
        addAndUpdateData: '',
        addAndUpdateState: false
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
      memberlList_edit(val) {
        const data = val
        data.state = 'group'
        this.editData = data
        this.editState = true
      },
      hideEditState(data) {
        this.editState = false
      },
      addAndUpdate(val) {
        this.addAndUpdateData = val
        this.addAndUpdateState = true
      },
      hideAddAndUpdateState(data) {
        this.addAndUpdateState = false
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

