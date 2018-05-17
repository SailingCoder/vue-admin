<template>
  <div v-if="!detailState" class="app-container calendar-list-container">
    <div class="filter-container">
      <el-date-picker v-model="listQuery.value6" type="daterange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期">
      </el-date-picker>
      <el-select clearable style="width: 150px" class="filter-item" v-model="listQuery.importance" placeholder="查询项目">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <el-input style="width: 150px;" class="filter-item" placeholder="输入查询内容：" v-model="listQuery.title"></el-input>
      <el-button class="filter-item" type="primary" v-waves @click="handleFilter">查询</el-button>
    </div>

    <el-table :key='tableKey' :data="table" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.idnum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" label="易物置换单">
        <template slot-scope="scope">
          <span>{{scope.row.zhorderid}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" label="会员账号">
        <template slot-scope="scope">
          <span>{{scope.row.userphone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="任务金额">
        <template slot-scope="scope">
          <span>{{scope.row.taskamount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="任务奖励">
        <template slot-scope="scope">
          <span>{{scope.row.rewardamount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="95" label="任务状态">
        <template slot-scope="scope">
          <span>{{(scope.row.status).split(',')[0]}}</span></br>
          <span>{{(scope.row.status).split(',')[1]}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="90" label="未完成金额">
        <template slot-scope="scope">
          <span>积分：{{scope.row.iffinish}}</span><br>
          <span>储值：{{scope.row.iffinish}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="152" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.starttime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="60" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="memberlAccount_details(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-size="listQuery.limit" layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div>

  </div>

  <div v-else-if="detailState">
    <taskDetail :data="detailData" @detail="hideDetailState"></taskDetail>
  </div>
</template>

<script>
  import { fetchList, fetchPv } from '@/api/article'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'
  import taskDetail from './components/taskDetail'

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
    name: 'consumptionTask',
    components: { taskDetail },
    directives: {
      waves
    },
    data() {
      return {
        table: [
          { idnum: 1, taskid: 'DD123456789', userphone: '13288888888', taskamount: '10000', rewardamount: '80000', status: '未完成,2017-12-22', iffinish: '10000', zhorderid: 'DD123456796', starttime: '2017-12-22 11:28:01' },
          { idnum: 2, taskid: 'DD123456790', userphone: '13288888889', taskamount: '10000', rewardamount: '80000', status: '未完成,2017-12-22', iffinish: '10000', zhorderid: 'DD123456797', starttime: '2017-12-22 11:28:01' },
          { idnum: 3, taskid: 'DD123456791', userphone: '13288888890', taskamount: '10000', rewardamount: '80000', status: '未完成,2017-12-22', iffinish: '10000', zhorderid: 'DD123456800', starttime: '2017-12-22 11:28:01' },
          { idnum: 4, taskid: 'DD123456792', userphone: '13288888891', taskamount: '10000', rewardamount: '80000', status: '已领取,2017-12-16', iffinish: '0', zhorderid: 'DD123456811', starttime: '2017-10-09 11:28:01' },
          { idnum: 5, taskid: 'DD123456793', userphone: '13288888892', taskamount: '10000', rewardamount: '80000', status: '已领取,2017-12-15', iffinish: '0', zhorderid: 'DD123456812', starttime: '2017-10-08 11:28:01' },
          { idnum: 6, taskid: 'DD123456794', userphone: '13288888893', taskamount: '10000', rewardamount: '80000', status: '已领取,2017-12-14', iffinish: '0', zhorderid: 'DD123456813', starttime: '2017-10-07 11:28:01' },
          { idnum: 7, taskid: 'DD123456795', userphone: '13288888894', taskamount: '10000', rewardamount: '80000', status: '已奖励,2017-12-16', iffinish: '0', zhorderid: 'DD123456814', starttime: '2017-10-06 11:28:01' },
          { idnum: 8, taskid: 'DD123456796', userphone: '13288888895', taskamount: '10000', rewardamount: '80000', status: '已奖励,2017-12-15', iffinish: '0', zhorderid: 'DD123456815', starttime: '2017-10-05 11:28:01' },
          { idnum: 9, taskid: 'DD123456797', userphone: '13288888896', taskamount: '10000', rewardamount: '80000', status: '已奖励,2017-12-14', iffinish: '0', zhorderid: 'DD123456816', starttime: '2017-10-04 11:28:01' },
          { idnum: 10, taskid: 'DD123456798', userphone: '13288888897', taskamount: '10000', rewardamount: '80000', status: '已奖励,2017-12-13', iffinish: '0', zhorderid: 'DD123456817', starttime: '2017-10-03 11:28:01' },
          { idnum: 11, taskid: 'DD123456799', userphone: '13288888898', taskamount: '10000', rewardamount: '80000', status: '已奖励,2017-12-12', iffinish: '0', zhorderid: 'DD123456818', starttime: '2017-10-02 11:28:01' }
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
        editData: '',
        editState: false,
        adjustData: '',
        adjustState: false,
        detailData: '',
        detailState: false
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
      memberlAccount_details(val) {
        this.detailData = val
        this.detailState = true
      },
      hideDetailState(val) {
        this.detailState = false
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

