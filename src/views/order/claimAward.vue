<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-date-picker v-model="listQuery.value6" type="daterange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期">
      </el-date-picker>
      <el-select clearable style="width: 150px" class="filter-item" v-model="listQuery.importance" placeholder="置换单状态">
        <el-option v-for="item in status" :key="item.key" :label="item.display_name" :value="item.display_name">
        </el-option>
      </el-select>
      <el-select clearable style="width: 150px" class="filter-item" v-model="listQuery.importance" placeholder="查询项目">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <el-input style="width: 150px;" class="filter-item" placeholder="输入查询内容：" v-model="listQuery.title"></el-input>
      <el-button class="filter-item" type="primary" v-waves @click="handleFilter">查询</el-button>
      <el-button class="filter-item" type="primary" v-waves @click="handleFilter">下载</el-button>
    </div>

    <el-table :key='tableKey' :data="table" v-loading="listLoading" element-loading-text="给我一点时间" fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.idnum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="115" label="易物置换单">
        <template slot-scope="scope">
          <span>{{scope.row.tastnum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="115" label="会员账号">
        <template slot-scope="scope">
          <span>{{scope.row.userphone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="任务奖励">
        <template slot-scope="scope">
          <span>{{scope.row.rewardamount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="申领方式">
        <template slot-scope="scope">
          <span>{{scope.row.getway}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="收款人">
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="175" label="收款信息">
        <template slot-scope="scope">
          <span>{{(scope.row.bankinfo).split(',')[0]}}</span></br>
          <span>{{(scope.row.bankinfo).split(',')[1]}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="150" label="领取时间">
        <template slot-scope="scope">
          <span>{{scope.row.applytime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === '标为处理'" type="text" size="small" @click="handleOrder(scope.row)">标为处理</el-button>
          <span v-else-if="scope.row.status === '已处理'">已处理</span>
        </template>
      </el-table-column>
      <el-table-column type="expand" max-width="10">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="奖励时间">
              <span class="m-span-l">{{ props.row.gettime }}</span>
            </el-form-item>
            <el-form-item label="备注">
              <span class="m-span-l">{{ props.row.menu }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-size="listQuery.limit" layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div>

    <el-dialog title="操作确认" :visible.sync="centerDialogVisible" width="30%" center>
      <span>
        <el-form :model="form" label-width="55px">
          <el-form-item label="备注：" style="margin-bottom: 5px;">
            <el-input type="textarea" v-model="form.menu"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleOrderTrue">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
  import { fetchList, fetchPv } from '@/api/article'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'

  const calendarTypeOptions = [
    { key: '0', display_name: '全部' },
    { key: '1', display_name: '平价订单' },
    { key: '2', display_name: '换购订单' },
    { key: '3', display_name: '置换订单' },
    { key: '4', display_name: '任务订单' }
  ]
  const status = [
    { key: '0', display_name: '全部' },
    { key: '1', display_name: '已处理' },
    { key: '2', display_name: '待处理' }
  ]

  // arr to obj ,such as { CN : "中国", US : "美国" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    name: 'claimAward',
    directives: {
      waves
    },
    data() {
      return {
        status,
        table: [
          { idnum: 1, tastnum: 'DD123456798', userphone: '13288888897', rewardamount: '8000', getway: '银行卡', username: '赵全石', bankinfo: '中国银行,6228480010793226120', status: '标为处理', menu: '', applytime: '2017-12-10', gettime: '' },
          { idnum: 2, tastnum: 'DD123456797', userphone: '13288888896', rewardamount: '8000', getway: '银行卡', username: '赵全久', bankinfo: '中国银行,6228480010793226119', status: '标为处理', menu: '', applytime: '2017-12-11', gettime: '' },
          { idnum: 3, tastnum: 'DD123456796', userphone: '13288888895', rewardamount: '8000', getway: '银行卡', username: '赵全拔', bankinfo: '中国银行,6228480010793226118', status: '标为处理', menu: '', applytime: '2017-12-12', gettime: '' },
          { idnum: 4, tastnum: 'DD123456795', userphone: '13288888894', rewardamount: '8000', getway: '银行卡', username: '赵全其', bankinfo: '中国银行,6228480010793226117', status: '已处理', menu: '', applytime: '2017-12-13', gettime: '2017-12-16' },
          { idnum: 5, tastnum: 'DD123456794', userphone: '13288888893', rewardamount: '8000', getway: '银行卡', username: '赵全路', bankinfo: '中国银行,6228480010793226116', status: '已处理', menu: '', applytime: '2017-12-14', gettime: '2017-12-17' },
          { idnum: 6, tastnum: 'DD123456793', userphone: '13288888892', rewardamount: '8000', getway: '银行卡', username: '赵全伍', bankinfo: '中国银行,6228480010793226115', status: '已处理', menu: '', applytime: '2017-12-15', gettime: '2017-12-18' },
          { idnum: 7, tastnum: 'DD123456792', userphone: '13288888891', rewardamount: '8000', getway: '银行卡', username: '赵全四', bankinfo: '中国银行,6228480010793226114', status: '已处理', menu: '', applytime: '2017-12-16', gettime: '2017-12-19' },
          { idnum: 8, tastnum: 'DD123456799', userphone: '13288888898', rewardamount: '8000', getway: '银行卡', username: '赵全中', bankinfo: '中国银行,6228480010793226121', status: '已处理', menu: '', applytime: '2017-12-09', gettime: '2017-12-12' }
        ],
        form: {
          desc: ''
        },
        centerDialogVisible: false,
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
        }
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
      handleOrder(data) {
        this.centerDialogVisible = true
        this.form = data
      },
      handleOrderTrue() {
        this.centerDialogVisible = false
        this.form.status = '已处理'
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
<style>
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
  .m-span-l{
    line-height: 40px;
  }
  .el-dialog{
    border-radius: 5px;
  }
  .el-dialog--center .el-dialog__header{
    padding-top: 20px;
    font-size: 16px;
  }
  .el-dialog--center .el-dialog__footer {
    padding-bottom:20px;
    text-align: right;
  }
  .el-dialog--center .el-dialog__body{
    padding: 15px;
  }
</style>
