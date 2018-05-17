<template>
  <div v-if="!editState" class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" v-waves @click="memberlList_edit('add', '')">新增</el-button>
    </div>
    <el-table :key='tableKey' :data="table" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.idnum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="平台">
        <template slot-scope="scope">
          <span>{{scope.row.platform}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="60" label="版本">
        <template slot-scope="scope">
          <span>{{scope.row.versioncode}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="60" label="版本">
        <template slot-scope="scope">
          <span>{{scope.row.versionnum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="最大版本">
        <template slot-scope="scope">
          <span>{{scope.row.bigcode}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="最小版本">
        <template slot-scope="scope">
          <span>{{scope.row.smallcode}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="152" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.ctime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="152" label="更新时间">
        <template slot-scope="scope">
          <span>{{scope.row.gtime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="memberlList_edit('edit', scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

   <!--<div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-size="listQuery.limit" layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div>-->

  </div>

  <div v-else-if="editState">
    <releaseUpdate :data="editData" @releaseUpdate="hideEditState"></releaseUpdate>
  </div>
</template>

<script>
  import { fetchList, fetchPv } from '@/api/article'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'
  import releaseUpdate from './components/releaseUpdate'

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
    name: 'release',
    components: { releaseUpdate },
    directives: {
      waves
    },
    data() {
      return {
        table: [
          { idnum: 1, platform: 'android', versioncode: '37', versionnum: '0.2.14', bigcode: '36', smallcode: '34', status: '预发布', ctime: '2017-12-28 22:10:01', gtime: '2017-12-28 22:10:01' },
          { idnum: 2, platform: 'android', versioncode: '36', versionnum: '0.2.13', bigcode: '36', smallcode: '33', status: '已发布', ctime: '2017-12-22 22:10:01', gtime: '2017-12-22 22:10:01' },
          { idnum: 3, platform: 'android', versioncode: '35', versionnum: '0.2.12', bigcode: '35', smallcode: '32', status: '已发布', ctime: '2017-12-10 22:10:01', gtime: '2017-12-10 22:10:01' },
          { idnum: 4, platform: 'android', versioncode: '34', versionnum: '0.2.11', bigcode: '34', smallcode: '31', status: '已发布', ctime: '2017-12-01 22:10:01', gtime: '2017-12-01 22:10:01' },
          { idnum: 5, platform: 'android', versioncode: '33', versionnum: '0.2.10', bigcode: '32', smallcode: '29', status: '已发布', ctime: '2017-11-15 22:10:01', gtime: '2017-11-15 22:10:01' }
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
      memberlList_edit(status, val) {
        let data = val
        if (status === 'add') {
          data = {
            r_status: 'add'
          }
        } else {
          data.r_status = 'edit'
        }
        this.editData = data
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

