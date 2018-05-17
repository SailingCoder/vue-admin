<template>
  <div v-if="!editAddState" class="app-container calendar-list-container">
    <div class="filter-container">
        <el-button class="filter-item" type="primary" size="medium" v-waves @click="show_editAdd('add')">添加</el-button>
    </div>
    <el-table :data="table" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.idnum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称">
        <template slot-scope="scope">
          <span>{{scope.row.managerid}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{scope.row.managername}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="QQ">
        <template slot-scope="scope">
          <span>{{scope.row.QQ}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="微信">
        <template slot-scope="scope">
          <span>{{scope.row.wechat}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="邮箱">
        <template slot-scope="scope">
          <span>{{scope.row.email}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{(scope.row.ctime).split(' ')[0]}}</span></br>
          <span>{{(scope.row.ctime).split(' ')[1]}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="show_editAdd(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>


  <div v-else-if="editAddState">
    <editAdd :data="editAddData" @editAdd="hide_editAdd"></editAdd>
  </div>
</template>

<script>
  import { fetchList, fetchPv } from '@/api/article'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'
  import editAdd from './components/editAdd'

  const calendarTypeOptions = [
    { key: '0', name: '全部' },
    { key: '1', name: '平价订单' },
    { key: '2', name: '换购订单' },
    { key: '3', name: '置换订单' },
    { key: '4', name: '任务订单' }
  ]

  // arr to obj ,such as { CN : "中国", US : "美国" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    name: 'orderList',
    components: { editAdd },
    directives: {
      waves
    },
    data() {
      return {
        table: [
          { idnum: 1, managerid: 'syqlzhaosanquan', managername: '赵三全', QQ: '1111111111', wechat: '1111111111', phone: '13218888888', email: 'zsq@163.com', status: '正常', ctime: '2017-11-15 22:10:01' },
          { idnum: 2, managerid: 'syqlxiaojian', managername: '肖剑', QQ: '1111111112', wechat: '1111111112', phone: '13228888888', email: 'xj@163.com', status: '正常', ctime: '2017-11-16 22:10:01' },
          { idnum: 3, managerid: 'syqlyouzi', managername: '又芝', QQ: '1111111113', wechat: '1111111113', phone: '13238888888', email: 'yz@163.com', status: '正常', ctime: '2017-11-17 22:10:01' },
          { idnum: 4, managerid: 'syqlzhang', managername: '张山', QQ: '1111111114', wechat: '1111111114', phone: '13248888888', email: 'zs@163.com', status: '正常', ctime: '2017-11-18 22:10:01' },
          { idnum: 5, managerid: 'syqlwang', managername: '王五', QQ: '1111111115', wechat: '1111111115', phone: '13258888888', email: 'ww@163.com', status: '正常', ctime: '2017-11-19 22:10:01' },
          { idnum: 6, managerid: 'syqlgu', managername: '古瓷', QQ: '1111111116', wechat: '1111111116', phone: '13268888888', email: 'gc@163.com', status: '正常', ctime: '2017-11-20 22:10:01' },
          { idnum: 7, managerid: 'syqlqi', managername: '亓欣', QQ: '1111111117', wechat: '1111111117', phone: '13278888888', email: 'qx@163.com', status: '正常', ctime: '2017-11-21 22:10:01' },
          { idnum: 8, managerid: 'syqlyu', managername: '于丹', QQ: '1111111118', wechat: '1111111118', phone: '13288888888', email: 'yd@163.com', status: '正常', ctime: '2017-11-22 22:10:01' },
          { idnum: 9, managerid: 'syqlfu', managername: '符佐', QQ: '1111111119', wechat: '1111111119', phone: '13298888888', email: 'fz@163.com', status: '正常', ctime: '2017-11-23 22:10:01' },
          { idnum: 10, managerid: 'syqljiang', managername: '江浪', QQ: '1111111110', wechat: '1111111110', phone: '13208888888', email: 'jl@163.com', status: '正常', ctime: '2017-11-24 22:10:01' }
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
        editAddState: false,
        editAddData: ''
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
      show_editAdd(data) {
        this.editAddData = data
        this.editAddState = true
      },
      hide_editAdd(data) {
        this.editAddState = false
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
<style scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
