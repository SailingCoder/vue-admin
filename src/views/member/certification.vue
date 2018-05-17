<template>
  <div v-if="!editState" class="app-container calendar-list-container">
    <div class="filter-container">
      <el-select clearable style="width: 150px" class="filter-item" v-model="listQuery.importance" placeholder="实名类型">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <el-select clearable class="filter-item" style="width: 150px" v-model="listQuery.type" placeholder="查询内容">
        <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>
      <el-input style="width: 150px;" class="filter-item" placeholder="输入查询内容：" v-model="listQuery.title">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves @click="handleFilter">查询</el-button>
    </div>

    <el-table :key='tableKey' :data="table" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.idnum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="会员ID">
        <template slot-scope="scope">
          <span>{{scope.row.userid}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="会员账号">
        <template slot-scope="scope">
          <span>{{scope.row.userphone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="实名状态">
        <template slot-scope="scope">
          <span>{{(scope.row.status).split(',')[0]}}</span></br>
          <span>{{(scope.row.status).split(',')[1]}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="身份证号">
        <template slot-scope="scope">
          <span>{{scope.row.idcard}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="银行信息">
        <template slot-scope="scope">
          <span>{{(scope.row.bankinfo).split(',')[0]}}</span></br>
          <span>{{(scope.row.bankinfo).split(',')[1]}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="会员生日">
        <template slot-scope="scope">
          <span>{{scope.row.birthday}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属地">
        <template slot-scope="scope">
          <span>{{scope.row.address}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="60" label="操作" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="memberlList_edit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-size="listQuery.limit" layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div>

  </div>

  <div v-else-if="editState">
    <edit :data="editData" @certification-edit="hideEditState"></edit>
  </div>
</template>

<script>
  import { fetchList, fetchPv } from '@/api/article'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'
  import edit from './components/certification-edit'

  const calendarTypeOptions = [
    { key: 'US', display_name: '会员姓名' },
    { key: 'CN', display_name: '会员账号' },
    { key: 'JP', display_name: '身份证号' }
  ]

  // arr to obj ,such as { CN : "中国", US : "美国" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    name: 'memberlist',
    components: { edit },
    directives: {
      waves
    },
    data() {
      return {
        table: [
          { idnum: 1, userid: '1000001', userphone: '13288888888', status: '身份认证,2017-12-01', username: '赵全一', idcard: '1001001993010169852', bankinfo: '中国银行,6228480010793226111', birthday: '1993-01-01', address: '北京-北京-海淀' },
          { idnum: 2, userid: '1000002', userphone: '13288888889', status: '身份认证,2017-12-02', username: '赵全二', idcard: '1001001993010269852', bankinfo: '中国银行,6228480010793226112', birthday: '1993-01-02', address: '北京-北京-海淀' },
          { idnum: 3, userid: '1000003', userphone: '13288888890', status: '身份卡认证,2017-12-03', username: '赵全三', idcard: '1001001993030169852', bankinfo: '中国银行,6228480010793226113', birthday: '1993-03-01', address: '北京-北京-海淀' },
          { idnum: 4, userid: '1000004', userphone: '13288888891', status: '银行卡认证,2017-12-04', username: '赵全四', idcard: '1001001993040169852', bankinfo: '中国银行,6228480010793226114', birthday: '1993-04-01', address: '北京-北京-海淀' },
          { idnum: 5, userid: '1000005', userphone: '13288888892', status: '银行卡认证,2017-12-05', username: '赵全伍', idcard: '1001001993050169852', bankinfo: '中国银行,6228480010793226115', birthday: '1993-05-01', address: '北京-北京-海淀' },
          { idnum: 6, userid: '1000006', userphone: '13288888893', status: '银行卡认证,2017-12-06', username: '赵全路', idcard: '1001001993060169852', bankinfo: '中国银行,6228480010793226116', birthday: '1993-06-01', address: '北京-北京-海淀' },
          { idnum: 7, userid: '1000007', userphone: '13288888894', status: '身份认证,2017-12-07', username: '赵全其', idcard: '1001001993070169852', bankinfo: '中国银行,6228480010793226117', birthday: '1993-07-01', address: '北京-北京-海淀' },
          { idnum: 8, userid: '1000008', userphone: '13288888895', status: '身份认证,2017-12-08', username: '赵全拔', idcard: '1001001993080169852', bankinfo: '中国银行,6228480010793226118', birthday: '1993-08-01', address: '北京-北京-海淀' },
          { idnum: 9, userid: '1000009', userphone: '13288888896', status: '身份认证,2017-12-09', username: '赵全久', idcard: '1001001993090169852', bankinfo: '中国银行,6228480010793226119', birthday: '1993-09-01', address: '北京-北京-海淀' },
          { idnum: 10, userid: '1000010', userphone: '13288888897', status: '身份认证,2017-12-10', username: '赵全石', idcard: '1001001993100169852', bankinfo: '中国银行,6228480010793226110', birthday: '1993-10-01', address: '北京-北京-海淀' },
          { idnum: 11, userid: '1000011', userphone: '13288888898', status: '身份认证,2017-12-11', username: '赵全中', idcard: '1001001993110169852', bankinfo: '中国银行,6228480010793226110', birthday: '1993-11-01', address: '北京-北京-海淀' }
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
        importanceOptions: ['全部', '身份认证', '银行卡认证'],
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

