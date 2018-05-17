<template>
  <div v-if="!detailState" class="app-container calendar-list-container">
    <div class="filter-container">
      <el-date-picker v-model="listQuery.value6" type="daterange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期">
      </el-date-picker>
      <el-select clearable class="filter-item" style="width: 150px" v-model="listQuery.type" placeholder="订单类型">
        <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>
      <el-input style="width: 150px;" class="filter-item" placeholder="订单号：" v-model="listQuery.title"></el-input>
      <el-input style="width: 150px;" class="filter-item" placeholder="购买门店：" v-model="listQuery.title"></el-input>
      <el-input style="width: 150px;" class="filter-item" placeholder="供应商：" v-model="listQuery.title"></el-input>
      <el-button class="filter-item" type="primary" v-waves @click="handleFilter">查询</el-button>
      <el-button class="filter-item" type="primary" v-waves @click="centerDialogVisible = true">生成统计表</el-button>
    </div>
    <el-table :key='tableKey' :data="table" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.idnum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" label="订单编号">
        <template slot-scope="scope">
          <span>{{scope.row.orderid}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="订单类型">
        <template slot-scope="scope">
          <span>{{scope.row.ordertype}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="90" label="商品编号">
        <template slot-scope="scope">
          <span>{{scope.row.userphone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="120" label="商品名称">
        <template slot-scope="scope">
          <span>{{(scope.row.ordername).split('*')[0]}}</span></br>
          <span>{{'*'+(scope.row.ordername).split('*')[1]}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="商品单价">
        <template slot-scope="scope">
          <span>{{(scope.row.amount).split(',')[0]}}</span></br>
          <span>{{(scope.row.amount).split(',')[1]}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="70" label="置换款">
        <template slot-scope="scope">
          <span>{{scope.row.payway}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="订单状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status==='已退单'||scope.row.status==='已取消'" style="color: red;">{{scope.row.status}}</span>
          <span v-else>{{scope.row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="140" label="购买门店">
        <template slot-scope="scope">
          <span>{{scope.row.shoppingname}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="140" label="供应商">
        <template slot-scope="scope">
          <span>圣煜麒麟1号供应商</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="95" label="购买时间">
        <template slot-scope="scope">
          <span>{{(scope.row.ordertime).split(' ')[0]}}</span></br>
          <span>{{(scope.row.ordertime).split(' ')[1]}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-size="listQuery.limit" layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div>

    <el-dialog title="生成销售统计表" :visible.sync="centerDialogVisible" width="30%" center>
      <p>请选择一种统计方式：</p>
      <el-form ref="form" :model="form" label-width="80px">
          <el-radio-group v-model="form.resource">
            <el-radio label="按商品统计"></el-radio>
            <el-radio label="按供应商统计"></el-radio>
            <el-radio label="按销售门店统计"></el-radio>
          </el-radio-group>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
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
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        centerDialogVisible: false,
        table: [
          { idnum: 1, orderid: 'DD123456789', ordertype: '平价订单', ordername: '黑龙江大米 50Kg*1', userphone: 'QG00001', amount: '￥120.00', payway: '否', status: '待付款', shoppingname: '圣煜麒麟西三旗店', ordertime: '2017-12-08 11:28:01' },
          { idnum: 2, orderid: 'DD123456791', ordertype: '积分兑换', ordername: '盘锦大米 50KG*1', userphone: 'QG00002', amount: '￥120.00', payway: '否', status: '待付款', shoppingname: '圣煜麒麟西三旗店', ordertime: '2017-12-07 11:28:01' },
          { idnum: 3, orderid: 'DD123456792', ordertype: '易物置换', ordername: '香香香米 60KG*1', userphone: 'QG00003', amount: '积分100,储值100', payway: '否', status: '待付款', shoppingname: '圣煜麒麟西三旗店', ordertime: '2017-12-06 11:28:01' },
          { idnum: 4, orderid: 'DD123456793', ordertype: '任务订单', ordername: '小香香米 60KG*1', userphone: 'QG00004', amount: '积分100,储值100', payway: '否', status: '待付款', shoppingname: '圣煜麒麟西三旗店', ordertime: '2017-12-05 11:28:01' }
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
<style scoped>
  p{
    margin: 0 0 7px;
    font-size: 15px;
    color: #000;
  }
  .el-radio {
    display: block;
    line-height: 25px;
  }
  .el-radio+.el-radio {
    margin-left: 0px;
  }
</style>
<style>
  .el-dialog--center {
    text-align: center;
    border-radius: 5px;
  }
  .el-dialog--center .el-dialog__body {
    padding: 15px 30px 20px;
  }
</style>
