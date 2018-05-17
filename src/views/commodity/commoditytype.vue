<template>
  <div v-if="!ct_addAndEditState" class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input style="width: 150px;" class="filter-item" placeholder="品类名称：" v-model="listQuery.title"></el-input>
      <el-button class="filter-item" type="primary" v-waves @click="handleFilter">查询</el-button>
      <el-button class="filter-item" type="primary" v-waves @click="show_ct_addAndEdit('add', '')">新增</el-button>
    </div>

    <el-table :key='tableKey' :data="table" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.idnum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="品类名称">
        <template slot-scope="scope">
          <span>{{scope.row.ordername}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="品类编号">
        <template slot-scope="scope">
          <span>{{scope.row.orderid}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="父级品类">
        <template slot-scope="scope">
          <span>{{scope.row.orderstatus}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="show_ct_addAndEdit('edit', scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>

  <div v-else-if="ct_addAndEditState">
    <ct_addAndEdit :data="ct_addAndEditData" @ct_addAndEdit="hide_ct_addAndEdit"></ct_addAndEdit>
  </div>
</template>

<script>
  import { fetchList, fetchPv } from '@/api/article'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'
  import ct_addAndEdit from './components/ct_addAndEdit'

  const calendarTypeOptions = [
    { key: '0', display_name: '全部' },
    { key: '1', display_name: '平价订单' },
    { key: '2', display_name: '换购订单' },
    { key: '3', display_name: '置换订单' },
    { key: '4', display_name: '任务订单' }
  ]

  // arr to obj ,such as { CN : "中国", US : "美国" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    name: 'commoditytype',
    components: { ct_addAndEdit },
    directives: {
      waves
    },
    data() {
      return {
        table: [
          { idnum: 1, orderid: '1001', ordername: '时尚服饰', orderstatus: '无' },
          { idnum: 2, orderid: '1002', ordername: '箱包珠宝', orderstatus: '无' },
          { idnum: 3, orderid: '1003', ordername: '食品副食', orderstatus: '无' },
          { idnum: 4, orderid: '1001001', ordername: '女装', orderstatus: '1001' },
          { idnum: 5, orderid: '1001002', ordername: '男装', orderstatus: '1001' },
          { idnum: 6, orderid: '1001003', ordername: '内衣', orderstatus: '1001' }
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
        importanceOptions: ['订单号', '会员账号'],
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
        ct_addAndEditData: '',
        ct_addAndEditState: false
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
      show_ct_addAndEdit(status, val) {
        let data = val
        if (status === 'add') {
          data = {
            ct_status: 'add'
          }
        } else {
          data.ct_status = 'edit'
        }
        this.ct_addAndEditData = data
        this.ct_addAndEditState = true
      },
      hide_ct_addAndEdit(val) {
        this.ct_addAndEditState = false
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

