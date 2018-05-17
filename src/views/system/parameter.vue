<template>
  <div v-if="!editState" class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input style="width: 150px;" class="filter-item" placeholder="输入关键字：" v-model="listQuery.title"></el-input>
      <el-button class="filter-item" type="primary" v-waves @click="handleFilter">查询</el-button>
    </div>

    <el-table :key='tableKey' :data="table" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.idnum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="参数名称">
        <template slot-scope="scope">
          <span>{{scope.row.paraname}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" label="参数值">
        <template slot-scope="scope">
          <span>{{scope.row.paravalue}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" label="参数用途">
        <template slot-scope="scope">
          <span>{{scope.row.paraex}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="参数值说明">
        <template slot-scope="scope">
          <span>{{scope.row.howtouse}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="60" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="memberlList_edit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>

  <div v-else-if="editState">
    <edit :data="editData" @parameterUpdate="hideEditState"></edit>
  </div>
</template>

<script>
  import { fetchList, fetchPv } from '@/api/article'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'
  import edit from './components/parameterUpdate'

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
    name: 'parameter',
    components: { edit },
    directives: {
      waves
    },
    data() {
      return {
        table: [
          { idnum: 1, paraname: '推荐奖励劳动积分', paravalue: '10', paraex: '用户推荐一名成功注册的新用户可获得的劳动积分奖励', howtouse: '参数值为正整数' },
          { idnum: 2, paraname: '新用户注册奖励劳动积分', paravalue: '10', paraex: '新用户注册后获得的劳动积分奖励', howtouse: '参数值为正整数' },
          { idnum: 3, paraname: '月度满签奖励劳动积分', paravalue: '10', paraex: '用户当月内每天签到，当月最后一天签到时可获得该奖励', howtouse: '参数值为正整数' },
          { idnum: 4, paraname: '注册手机号正则', paravalue: '^[1]([3][0-9]|45|47|[5][0-3|5-9]|[7][0-3|6-8]|[8][0|1-9])[0-9]{8}$', paraex: '允许注册的手机号段', howtouse: '正则表达式' },
          { idnum: 5, paraname: '节日日期', paravalue: '2017-05-01,2017-05-30,2017-10-01,2017-10-04,2017-11-02', paraex: '添加的日期为可领取节日奖励的日期', howtouse: 'YYYY-MM-DD' }
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
        editData: '',
        editState: false
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
        this.editData = val
        this.editState = true
      },
      hideEditState(data) {
        this.editState = false
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

