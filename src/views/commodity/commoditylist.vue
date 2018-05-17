<template>
  <div v-if="!cl_detailAndEditState" class="app-container calendar-list-container">
    <div class="filter-container">
      <el-select clearable class="filter-item" style="width: 150px" v-model="listQuery.type" placeholder="商品类型">
        <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>
      <el-input style="width: 150px;" class="filter-item" placeholder="商品名称：" v-model="listQuery.title"></el-input>
      <el-input style="width: 150px;" class="filter-item" placeholder="商品条码：" v-model="listQuery.title"></el-input>
      <el-input style="width: 150px;" class="filter-item" placeholder="商品编码：" v-model="listQuery.title"></el-input>
      <el-button class="filter-item" type="primary" v-waves @click="handleFilter">查询</el-button>
    </div>
    <el-table :key='tableKey' :data="table" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.idnum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" label="商品图片">
        <template slot-scope="scope">
          <img :src="a4" alt="" width="120" height="60">
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" label="商品名称">
        <template slot-scope="scope">
          <span>{{scope.row.orderName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" label="商品编号">
        <template slot-scope="scope">
          <span>{{scope.row.orderid}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" label="商品条码">
        <template slot-scope="scope">
          <span>{{scope.row.orderNum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" label="销售属性">
        <template slot-scope="scope">
          <span>所属分类：大米</span></br>
          <span>规格大小：50KG</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="销售类型">
        <template slot-scope="scope">
          <span>{{scope.row.ordertype}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="销售单价">
        <template slot-scope="scope">
          <span>{{(scope.row.status).split(',')[0]}}</span></br>
          <span>{{(scope.row.status).split(',')[1]}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="60" label="置换款">
        <template slot-scope="scope">
          <span>{{scope.row.payway}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100" label="在售状态">
        <template slot-scope="scope">
          <span>{{scope.row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="120" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="show_cl_detailAndEdit('detail', scope.row)">详情</el-button>
          <el-button type="text" size="small" @click="show_cl_detailAndEdit('edit', scope.row)">编辑</el-button>
          <el-button v-if="scope.row.status=='在售'" type="text" size="small" @click="frozenAccount(scope.row)">停售</el-button>
          <el-button v-if="scope.row.status=='停售'" type="text" size="small" @click="frozenAccount(scope.row)">开售</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-size="listQuery.limit" layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div>

  </div>

  <div v-else-if="cl_detailAndEditState">
    <cl_detailAndEdit :data="cl_detailAndEditData" @cl_detailAndEdit="hide_cl_detailAndEdit"></cl_detailAndEdit>
  </div>

</template>

<script>
  import { fetchList, fetchPv } from '@/api/article'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'
  import cl_detailAndEdit from './components/cl_detailAndEdit'
  import a4 from '@/assets/images/1/4.jpg'

  const calendarTypeOptions = [
    { key: '0', display_name: '全部' },
    { key: '1', display_name: '平价商品' },
    { key: '2', display_name: '积分换购' },
    { key: '3', display_name: '易物置换' },
    { key: '4', display_name: '任务商品' }
  ]

  // arr to obj ,such as { CN : "中国", US : "美国" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    name: 'commoditylist',
    components: { cl_detailAndEdit },
    directives: {
      waves
    },
    data() {
      return {
        table: [
          { idnum: 1, orderName: '黑龙江大米 50kg', orderid: 'QG00008', orderNum: '123456789', ordertype: '平价订单', amount: '￥120.00', payway: '否', status: '在售' },
          { idnum: 2, orderName: '盘锦大米 50kg', orderid: 'QG00007', orderNum: '123456788', ordertype: '平价订单', amount: '积分120,储值120', payway: '否', status: '在售' }
        ],
        a4,
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
        editData: '',
        editState: false,
        adjustData: '',
        adjustState: false,
        cl_detailAndEditData: '',
        cl_detailAndEditState: false
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
      show_cl_detailAndEdit(status, val) {
        val.cl_status = status
        this.cl_detailAndEditData = val
        this.cl_detailAndEditState = true
      },
      hide_cl_detailAndEdit(val) {
        this.cl_detailAndEditState = false
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
        let state = '开售'
        if (data.status === '在售') {
          state = '停售'
        } else {
          state = '开售'
        }
        this.$confirm('此操作将' + state + data.orderName + ', 是否继续?', state, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (data.status === '停售') {
            data.status = '在售'
          } else {
            data.status = '停售'
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

