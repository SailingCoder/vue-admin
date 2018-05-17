<template>
  <div v-if="!carouselAddUpdateState" class="app-container calendar-list-container">
    <div class="filter-container">
      <el-select clearable style="width: 150px" class="filter-item" v-model="listQuery.importance" placeholder="素材类型">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <el-input style="width: 150px;" class="filter-item" placeholder="输入名称关键字：" v-model="listQuery.title">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves @click="handleFilter">查询</el-button>
      <el-button class="filter-item" v-waves @click="fun_showCarouselAddUpdate('add')" type="primary">添加</el-button>
    </div>

    <el-table :key='tableKey' :data="table" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.idnum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="素材类型">
        <template slot-scope="scope">
          <span>{{scope.row.materialtype}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="130" label="素材图片">
        <template slot-scope="scope">
          <img :src="a4" alt="" width="120" height="60">
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称">
        <template slot-scope="scope">
          <span>{{scope.row.materialname}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="跳转链接">
        <template slot-scope="scope">
          <span>{{scope.row.url}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否显示在首页">
        <template slot-scope="scope">
          <span>是</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="152" label="添加时间">
        <template slot-scope="scope">
          <span>{{scope.row.date}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="fun_showCarouselAddUpdate(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-size="listQuery.limit" layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div>

  </div>

  <div v-else-if="carouselAddUpdateState">
    <carouselAddUpdate :data="carouselAddUpdateData" @carouselAddUpdate="fun_hideCarouselAddUpdate"></carouselAddUpdate>
  </div>
</template>

<script>
  import { fetchList, fetchPv } from '@/api/article'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'
  import carouselAddUpdate from './components/carouselAddUpdate'
  import a4 from '@/assets/images/1/4.jpg'

  const calendarTypeOptions = [
    { key: 'CN', display_name: '轮播图' },
    { key: 'US', display_name: '特色购物' },
    { key: 'JP', display_name: '广告区' }
  ]

  // arr to obj ,such as { CN : "中国", US : "美国" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    name: 'carousel',
    components: { carouselAddUpdate },
    directives: {
      waves
    },
    data() {
      return {
        table: [
          { idnum: 1, materialtype: '轮播图', image: '', materialname: '2018年元旦快乐', url: 'http://', date: '2017-12-28 12:25:25' },
          { idnum: 2, materialtype: '轮播图', image: '', materialname: '易物置换业务调整通知', url: 'http://', date: '2017-12-27 12:25:25' },
          { idnum: 3, materialtype: '轮播图', image: '', materialname: '热烈祝贺易物置换模式第一次会议召开', url: 'http://', date: '2017-12-26 12:25:25' },
          { idnum: 4, materialtype: '特色购物', image: '', materialname: '平价购物', url: 'http://', date: '2017-12-25 12:25:25' },
          { idnum: 5, materialtype: '特色购物', image: '', materialname: '积分兑换', url: 'http://', date: '2017-12-24 12:25:25' },
          { idnum: 6, materialtype: '特色购物', image: '', materialname: '易物置换', url: 'http://', date: '2017-12-21 12:25:25' },
          { idnum: 7, materialtype: '广告区', image: '', materialname: '广告一区', url: 'http://', date: '2017-12-21 12:25:25' },
          { idnum: 8, materialtype: '广告区', image: '', materialname: '广告二区', url: 'http://', date: '2017-12-21 12:25:25' }
        ],
        a4,
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
        importanceOptions: ['轮播图', '特色购物', '广告区'],
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
        carouselAddUpdateData: '',
        carouselAddUpdateState: false
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
      fun_showCarouselAddUpdate(val) {
        this.carouselAddUpdateData = val
        this.carouselAddUpdateState = true
      },
      fun_hideCarouselAddUpdate(data) {
        this.carouselAddUpdateState = false
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

