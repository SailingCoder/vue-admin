<template>
  <div v-if="!sl_staffAddAndUpdateState" class="app-container calendar-list-container">
    <div class="title-show-info" style="padding: 0 0 20px 0">
      <el-button icon="el-icon-arrow-left" @click="backPrevPage()"></el-button>
      <span>员工管理</span>
    </div>
    <div class="filter-container">
      <el-button class="filter-item" type="primary" v-waves @click="show_sl_staffAddAndUpdate('add', '')">新增</el-button>
    </div>

    <el-table :data="table" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.idnum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="90" label="所属角色">
        <template slot-scope="scope">
          <span>{{scope.row.type}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" label="登录账号">
        <template slot-scope="scope">
          <span>{{scope.row.account}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="成员姓名">
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" label="联系电话">
        <template slot-scope="scope">
          <span>{{scope.row.userphone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="账号状态">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="120" label="所属门店">
        <template slot-scope="scope">
          <span>{{scope.row.md}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="152" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.time}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="show_sl_staffAddAndUpdate('edit', scope.row)">编辑</el-button>
          <el-button v-if="scope.row.status=='正常'" type="text" size="small" @click="frozenAccount(scope.row)">冻结</el-button>
          <el-button v-if="scope.row.status=='冻结'" type="text" size="small" @click="frozenAccount(scope.row)">解冻</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--<div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-size="listQuery.limit" layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div>-->

  </div>

  <div v-else-if="sl_staffAddAndUpdateState">
    <sl_staffAddAndUpdate :data="sl_staffAddAndUpdateData" @sl_staffAddAndUpdate="hide_sl_staffAddAndUpdate"></sl_staffAddAndUpdate>
  </div>
</template>

<script>
  import { fetchList, fetchPv } from '@/api/article'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'
  import sl_staffAddAndUpdate from './sl_staffAddAndUpdate'

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
    components: { sl_staffAddAndUpdate },
    data() {
      return {
        table: [
          { idnum: 1, type: '门店总管', account: '12345678', username: '张三', userphone: '13288888888', status: '正常', md: '圣煜麒麟1号店', time: '2017-12-15 17:39:00' },
          { idnum: 2, type: '销售人员', account: '12345679', username: '李四', userphone: '13288888887', status: '冻结', md: '圣煜麒麟1号店', time: '2017-12-14 17:39:00' },
          { idnum: 3, type: '客服人员', account: '12345670', username: '王五', userphone: '13288888886', status: '正常', md: '圣煜麒麟1号店', time: '2017-12-13 17:39:00' }
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
        },
        sl_staffAddAndUpdateState: false,
        sl_staffAddAndUpdateData: ''
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
      show_sl_staffAddAndUpdate(state, data) {
        let info = data
        if (state === 'add') {
          info = { staffStatus: 'add' }
        } else {
          data.staffStatus = 'edit'
          info = data
        }
        this.sl_staffAddAndUpdateState = true
        this.sl_staffAddAndUpdateData = info
      },
      hide_sl_staffAddAndUpdate(data) {
        this.sl_staffAddAndUpdateState = false
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
      },
      backPrevPage() {
        this.$emit('sl_stafflist', false)
      },
      frozenAccount(data) {
        let state = '冻结'
        if (data.status === '冻结') {
          state = '解冻'
        } else {
          state = '冻结'
        }
        this.$confirm('此操作将' + state + data.username + ', 是否继续?', state, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (data.status === '冻结') {
            data.status = '正常'
          } else {
            data.status = '冻结'
          }
          this.$message({
            type: 'success',
            message: state + '成功!'
          })
        }).catch(() => {
        })
      }

    }
  }
</script>

