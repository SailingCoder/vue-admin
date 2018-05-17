<template>
  <div v-if="!editState&&!adjustState&&!crewlistState" class="app-container calendar-list-container">
    <el-table :key='tableKey' :data="table" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.idnum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色名称">
        <template slot-scope="scope">
          <span>{{scope.row.rolename}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色状态">
        <template slot-scope="scope">
          <span>{{scope.row.rolestatus}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色详情">
        <template slot-scope="scope">
          <span>{{scope.row.roleex}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.ctime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="memberlList_edit(scope.row)">编辑信息</el-button>
          <el-button type="text" size="small" @click="show_crewlist(scope.row)">组员列表</el-button>
          <el-button type="text" size="small" @click="memberlAccount_adjust(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <div v-else-if="editState">
    <edit :data="editData" @edit="hideEditState"></edit>
  </div>

  <div v-else-if="adjustState">
    <adjust :data="adjustData" @adjust="hideAdjustState"></adjust>
  </div>

  <div v-else-if="crewlistState">
    <crewlist :data="crewlistData" @crewlist="hide_crewlist"></crewlist>
  </div>
</template>

<script>
  import { fetchList, fetchPv } from '@/api/article'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'
  import edit from './components/edit'
  import adjust from './components/adjust'
  import crewlist from './components/crewlist'

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
    name: 'powerGroup',
    components: { edit, adjust, crewlist },
    directives: {
      waves
    },
    data() {
      return {
        table: [
          { idnum: 1, rolename: '超级管理员', rolestatus: '正常', roleex: '拥有最高管理权限，请谨慎添加', ctime: '2017-12-02' },
          { idnum: 2, rolename: '会员业务查询', rolestatus: '正常', roleex: '仅提供信息查看功能', ctime: '2017-12-03' },
          { idnum: 3, rolename: '客服组', rolestatus: '正常', roleex: '业务查询、信息修改', ctime: '2017-12-04' }
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
        editState: false,
        adjustData: '',
        adjustState: false,
        crewlistData: '',
        crewlistState: false
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
      show_crewlist(val) {
        this.crewlistData = val
        this.crewlistState = true
      },
      hide_crewlist(val) {
        this.crewlistState = false
      },
      memberlAccount_adjust(val) {
        console.log(222)
        this.adjustData = val
        this.adjustState = true
      },
      hideAdjustState(val) {
        this.adjustState = false
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

