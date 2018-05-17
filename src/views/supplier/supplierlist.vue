<template>
  <div v-if="!detailState" class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input style="width: 150px;" class="filter-item" placeholder="供应商编码：" v-model="listQuery.title"></el-input>
      <el-input style="width: 150px;" class="filter-item" placeholder="供应商名称：" v-model="listQuery.title"></el-input>
      <el-input style="width: 150px;" class="filter-item" placeholder="联系人：" v-model="listQuery.title"></el-input>
      <el-button class="filter-item" type="primary" v-waves @click="handleFilter">查询</el-button>
    </div>

    <el-table :key='tableKey' :data="table" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.idnum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="90" label="供应商编码">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" label="供应商名称">
        <template slot-scope="scope">
          <span>{{scope.row.idname}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="主营品类">
        <template slot-scope="scope">
          <span>{{scope.row.idtype}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="法人">
        <template slot-scope="scope">
          <span>{{scope.row.author}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" label="联系电话">
        <template slot-scope="scope">
          <span>{{scope.row.idphone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="152" label="所在区域">
        <template slot-scope="scope">
          <span>{{scope.row.address}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="结算方式">
        <template slot-scope="scope">
          <span>{{scope.row.payway}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="合作状态">
        <template slot-scope="scope">
          <span>{{scope.row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" label="操作" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="show_storeadd('detail',scope.row)">详情</el-button>
          <el-button v-if="scope.row.status==='合作中'" type="text" size="small" @click="open6(scope.row)">停止合作</el-button>
          <el-button v-else-if="scope.row.status==='已停止'" type="text" size="small" @click="open6(scope.row)">重新合作</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--<div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-size="listQuery.limit" layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div>-->
  </div>
  <div v-else-if="detailState">
    <storeadd :data="detailData" @storeadd="hide_storeadd"></storeadd>
  </div>
</template>

<script>
  import { fetchList, fetchPv } from '@/api/article'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'
  import storeadd from '../store/storeadd'

  const calendarTypeOptions = [
    { key: 'CN', display_name: '会员账号' },
    { key: 'US', display_name: '姓名' },
    { key: 'JP', display_name: '身份账号' }
  ]

  // arr to obj ,such as { CN : "中国", US : "美国" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    name: 'settlement',
    components: { storeadd },
    directives: {
      waves
    },
    data() {
      return {
        table: [
          { idnum: 1, id: 'GYS001', idname: '圣煜麒麟1号供应商', idtype: '时尚服饰', author: '赵全', idphone: '13288888887', address: '北京-北京-海淀', payway: '现结', status: '合作中' },
          { idnum: 1, id: 'GYS002', idname: '圣煜麒麟2号供应商', idtype: '箱包珠宝', author: '通利来', idphone: '13288888888', address: '北京-北京-海淀', payway: '账期', status: '已停止' },
          { idnum: 1, id: 'GYS003', idname: '圣煜麒麟3号供应商', idtype: '食品副食', author: '餐餐香', idphone: '13288888889', address: '北京-北京-海淀', payway: '现结', status: '合作中' }
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
        importanceOptions: ['全部', '身份认证', '银行卡认账'],
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
      open6(data) {
        let status = ''
        if (data.status === '合作中') {
          status = '停止合作'
        } else {
          status = '重新合作'
        }
        this.$confirm('此操作将' + status + '“ ' + data.idname + ' ”, 是否继续?', status, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: '',
          center: true
        }).then(() => {
          if (data.status === '合作中') {
            data.status = '已停止'
          } else {
            data.status = '合作中'
          }
          this.$message({
            type: 'success',
            message: status + '成功!'
          })
        }).catch(() => {
        })
      },
      show_storeadd(status, val) {
        val.storeStatus = status
        this.detailData = val
        this.detailState = true
      },
      hide_storeadd(val) {
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

