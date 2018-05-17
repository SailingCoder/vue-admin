<template>
  <div v-if="!detailState&&!sl_detailState&&!sl_staffAddAndUpdateState" class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input style="width: 150px;" class="filter-item" placeholder="端口号：" v-model="listQuery.title"></el-input>
      <el-input style="width: 150px;" class="filter-item" placeholder="门店名称：" v-model="listQuery.title"></el-input>
      <el-input style="width: 150px;" class="filter-item" placeholder="联系人：" v-model="listQuery.title"></el-input>
      <el-button class="filter-item" type="primary" v-waves @click="handleFilter">查询</el-button>
    </div>
    <el-table :key='tableKey' :data="table" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.idnum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="端口号">
        <template slot-scope="scope">
          <span>{{scope.row.orderid}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="150" label="门店名称">
        <template slot-scope="scope">
          <span>{{scope.row.ordertype}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="门店类型">
        <template slot-scope="scope">
          <span>{{scope.row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="联系人">
        <template slot-scope="scope">
          <span>{{scope.row.amount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" label="联系电话">
        <template slot-scope="scope">
          <span>{{scope.row.userphone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="账号状态">
        <template slot-scope="scope">
          <span>{{scope.row.payway}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="152" label="开设时间">
        <template slot-scope="scope">
          <span>{{scope.row.ordertime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="155" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="show_storeadd('detail',scope.row)">详情</el-button>
          <el-button type="text" size="small" @click="show_storeadd('edit',scope.row)">编辑</el-button>
          <el-button v-if="scope.row.payway=='正常'" type="text" size="small" @click="frozenAccount(scope.row)">冻结</el-button>
          <el-button v-if="scope.row.payway=='冻结'" type="text" size="small" @click="frozenAccount(scope.row)">解冻</el-button>
          <el-button type="text" size="small" @click="show_sl_staffAddAndUpdate(scope.row)">新增员工</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-size="listQuery.limit" layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div>

  </div>

  <div v-else-if="detailState">
    <storeadd :data="detailData" @storeadd="hide_storeadd"></storeadd>
  </div>

  <div v-else-if="sl_detailState">
    <sl_stafflist :data="sl_detailData" @sl_stafflist="hide_sl_detail"></sl_stafflist>
  </div>

  <div v-else-if="sl_staffAddAndUpdateState">
    <sl_staffAddAndUpdate :data="sl_staffAddAndUpdateData" @sl_staffAddAndUpdate="hide_sl_staffAddAndUpdate"></sl_staffAddAndUpdate>
  </div>
</template>

<script>
  import { fetchList, fetchPv } from '@/api/article'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'
  import storeadd from './storeadd'
  import sl_staffAddAndUpdate from './components/sl_staffAddAndUpdate'

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
    name: 'allOrder',
    components: { storeadd, sl_staffAddAndUpdate },
    directives: {
      waves
    },
    data() {
      return {
        table: [
          { idnum: 1, orderid: '123456', ordertype: '圣煜麒麟北京西三旗店', userphone: '13288888888', amount: '方南一号', payway: '正常', status: '加盟店', ordertime: '2017-12-26' },
          { idnum: 2, orderid: '123457', ordertype: '圣煜麒麟北京上地店', userphone: '13288888887', amount: '方南二号', payway: '正常', status: '加盟店', ordertime: '2017-12-25' },
          { idnum: 3, orderid: '123458', ordertype: '圣煜麒麟北京回龙观店', userphone: '13288888886', amount: '方南三号', payway: '正常', status: '加盟店', ordertime: '2017-12-24' }
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
        sl_detailData: '',
        sl_detailState: false,
        detailData: '',
        detailState: false,
        sl_staffAddAndUpdateData: '',
        sl_staffAddAndUpdateState: false
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
      show_storeadd(status, val) {
        val.storeStatus = status
        this.detailData = val
        this.detailState = true
      },
      hide_storeadd(val) {
        this.detailState = false
      },
      show_sl_staffAddAndUpdate(val) {
        val.staffStatus = 'add'
        this.sl_staffAddAndUpdateData = val
        this.sl_staffAddAndUpdateState = true
      },
      hide_sl_staffAddAndUpdate(val) {
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
      frozenAccount(data) {
        let state = '冻结'
        if (data.payway === '冻结') {
          state = '解冻'
        } else {
          state = '冻结'
        }
        this.$confirm('此操作将' + state + data.orderid + ', 是否继续?', state, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (data.payway === '冻结') {
            data.payway = '正常'
          } else {
            data.payway = '冻结'
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

