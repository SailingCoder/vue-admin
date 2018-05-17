<template>
  <div v-if="!editState&&!adjustState&&!detailState" class="app-container calendar-list-container">
    <div class="filter-container">
      <el-select clearable style="width: 150px" class="filter-item" v-model="listQuery.importance" placeholder="会员类型">
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
      <el-table-column align="center" min-width="90" label="会员ID">
        <template slot-scope="scope">
          <span>{{scope.row.userid}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" label="会员账号">
        <template slot-scope="scope">
          <span>{{scope.row.userphone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" label="推荐人">
        <template slot-scope="scope">
          <span>{{scope.row.recom}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="会员状态">
        <template slot-scope="scope">
          <span>{{scope.row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="会员类型">
        <template slot-scope="scope">
          <span>{{scope.row.usertype}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100" label="所属门店">
        <template slot-scope="scope">
          <span>{{scope.row.md}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100" label="注册时间">
        <template slot-scope="scope">
          <span>{{scope.row.regtime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="memberlList_edit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="memberlAccount_details(scope.row)">账户详情</el-button>
          <el-button type="text" size="small" @click="memberlAccount_adjust(scope.row)">调整账户</el-button>
          <el-button v-if="scope.row.status=='正常'" type="text" size="small" @click="frozenAccount(scope.row)">冻结</el-button>
          <el-button v-if="scope.row.status=='冻结'" type="text" size="small" @click="frozenAccount(scope.row)">解冻</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-size="listQuery.limit" layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div>

  </div>

  <div v-else-if="editState">
    <edit :data="editData" @edit="hideEditState"></edit>
  </div>

  <div v-else-if="adjustState">
    <adjust :data="adjustData" @adjust="hideAdjustState"></adjust>
  </div>

  <div v-else-if="detailState">
    <detail :data="detailData" @detail="hideDetailState"></detail>
  </div>
</template>

<script>
  import { fetchList, fetchPv } from '@/api/article'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'
  import edit from './components/edit'
  import adjust from './components/adjust'
  import detail from './components/detail'

  const calendarTypeOptions = [
    { key: 'CN', display_name: '会员账号' },
    { key: 'US', display_name: '推荐人' }
  ]

  // arr to obj ,such as { CN : "中国", US : "美国" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    name: 'memberlist',
    components: { edit, adjust, detail },
    directives: {
      waves
    },
    data() {
      return {
        table: [
          { idnum: 1, userid: '1000001', userphone: '13288888888', recom: '13288888887', status: '正常', usertype: '普通会员', md: '圣煜麒麟西三旗店', regtime: '2017-12-01 15:33' },
          { idnum: 2, userid: '1000002', userphone: '13288888889', recom: '13288888887', status: '正常', usertype: '普通会员', md: '圣煜麒麟西三旗店', regtime: '2017-12-02 15:33' },
          { idnum: 3, userid: '1000003', userphone: '13288888890', recom: '13288888887', status: '正常', usertype: '普通会员', md: '圣煜麒麟西三旗店', regtime: '2017-12-03 15:33' },
          { idnum: 4, userid: '1000004', userphone: '13288888891', recom: '13288888887', status: '正常', usertype: '普通会员', md: '圣煜麒麟西三旗店', regtime: '2017-12-04 15:33' },
          { idnum: 5, userid: '1000005', userphone: '13288888892', recom: '13288888887', status: '正常', usertype: '普通会员', md: '圣煜麒麟西三旗店', regtime: '2017-12-05 15:33' },
          { idnum: 6, userid: '1000006', userphone: '13288888893', recom: '13288888887', status: '正常', usertype: '普通会员', md: '圣煜麒麟西三旗店', regtime: '2017-12-06 15:33' },
          { idnum: 7, userid: '1000007', userphone: '13288888894', recom: '13288888887', status: '正常', usertype: '普通会员', md: '圣煜麒麟西三旗店', regtime: '2017-12-07 15:33' },
          { idnum: 8, userid: '1000008', userphone: '13288888895', recom: '13288888887', status: '正常', usertype: '普通会员', md: '圣煜麒麟西三旗店', regtime: '2017-12-08 15:33' },
          { idnum: 9, userid: '1000009', userphone: '13288888896', recom: '13288888887', status: '正常', usertype: '普通会员', md: '圣煜麒麟西三旗店', regtime: '2017-12-09 15:33' },
          { idnum: 10, userid: '1000010', userphone: '13288888897', recom: '13288888887', status: '正常', usertype: '普通会员', md: '圣煜麒麟西三旗店', regtime: '2017-12-10 15:33' },
          { idnum: 11, userid: '1000011', userphone: '13288888898', recom: '13288888887', status: '正常', usertype: '普通会员', md: '圣煜麒麟西三旗店', regtime: '2017-12-11 15:33' }
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
        importanceOptions: ['普通会员', '实名会员'],
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
      memberlAccount_details(val) {
        this.detailData = val
        this.detailState = true
      },
      hideDetailState(val) {
        this.detailState = false
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
      },
      frozenAccount(data) {
        let state = '冻结'
        if (data.status === '冻结') {
          state = '解冻'
        } else {
          state = '冻结'
        }
        this.$confirm('此操作将' + state + data.orderid + ', 是否继续?', state, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (data.status === '冻结') {
            data.status = '正常'
          } else {
            data.status = '冻结'
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

