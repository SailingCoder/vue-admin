<template>
  <div v-if="!articleAddUpdateState&&!adjustState&&!detailState" class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input style="width: 170px;" class="filter-item" placeholder="输入文章标题关键字：" v-model="listQuery.title">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves @click="handleFilter">查询</el-button>
      <el-button class="filter-item" v-waves @click="fun_showArticleAddUpdate('add','')" type="primary">添加</el-button>
    </div>

    <el-table :data="table" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.idnum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="90" label="所属类型">
        <template slot-scope="scope">
          <span>{{scope.row.typename}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" label="文章标题">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100" label="显示在首页">
        <template slot-scope="scope">
          <span>{{scope.row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100" label="总浏览量">
        <template slot-scope="scope">
          <span>{{scope.row.num}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="152" label="添加时间">
        <template slot-scope="scope">
          <span>{{scope.row.date}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="80" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="fun_showArticleAddUpdate('edit',scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="preview(scope.row)">预览</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--<div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-size="listQuery.limit" layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div>-->

    <el-dialog :visible.sync="dialogVisible" width="380px" class="m-el-dialog">
      <div class="dialog-phone" style="padding: 15px;margin: 0 auto;">
        <div style="background: #ffffff;">
        <el-row>
          <el-col :span="24" class="dialog-phone-header">
            <el-row>
              <el-col :span="3" style="text-align: right;padding-right: 5px;"><i class="el-icon-arrow-left"></i></el-col>
              <el-col :span="21">我的消息</el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="dialog-phone-container" style="background: #ffffff;padding: 0;">
          <el-row>
            <el-row class="dialog-phone-container-time" style="color: #333333;font-weight: bold;font-size: 15px;padding: 5px 0 0;"><span>会员客户端上线，助你一臂之力</span></el-row>
            <el-row class="dialog-phone-container-time" style="color: #333333;line-height: 22px;height: 22px;"><span style="padding-right: 15px;">发布时间：2017-10-25 12:00</span><span>发布人：行政部</span></el-row>
            <el-row class="dialog-phone-container-txt" style="padding: 0 16px;">
              <el-row style="line-height: normal"><img :src="a4" width="100%" alt=""></el-row>
              <el-row style="font-size: 14px;line-height: 20px">人工智能（AI）的发展如火如荼，中国已成为该领域重要竞争者，并紧追美国这个领头羊。多个研究机构近期发布的报告显示，中国大量资金正流向AI，尤其是AI与其他行业的应用结合，中国企业在这一层面的融资额已逼近美国。与此同时，中国企业还在人才争夺方面投入重金“补足”，并在应用层面与美国不相上下后，开始向核心技术领域进发。</el-row>
            </el-row>
          </el-row>
        </el-row>
        </div>
      </div>
    </el-dialog>


  </div>

  <div v-else-if="articleAddUpdateState">
    <articleAddUpdate :data="articleAddUpdateData" @articleAddUpdate="fun_hideArticleAddUpdate"></articleAddUpdate>
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
  import articleAddUpdate from './components/articleAddUpdate'
  import adjust from './components/adjust'
  import detail from './components/detail'
  import a4 from '@/assets/images/1234.jpg'

  const calendarTypeOptions = [
    { key: 'CN', display_name: '中国' },
    { key: 'US', display_name: '美国' },
    { key: 'JP', display_name: '日本' },
    { key: 'EU', display_name: '欧元区' }
  ]

  // arr to obj ,such as { CN : "中国", US : "美国" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    name: 'article',
    components: { articleAddUpdate, adjust, detail },
    directives: {
      waves
    },
    data() {
      return {
        a4,
        previewData: {
          previewState: false,
          date: '',
          title: '',
          title2: '',
          txt: ''
        },
        dialogVisible: false,
        table: [
          { idnum: 1, typename: '今日看点', title: '小蓝单车宣布解散', num: '10', status: '显示', date: '2017-11-03 12:25:25' },
          { idnum: 2, typename: '精选商家', title: 'CK纯棉制造商', num: '0', status: '不显示', date: '2017-11-02 12:25:25' },
          { idnum: 3, typename: '销售冠军', title: '北京西三旗店10月销售第一', num: '10', status: '显示', date: '2017-11-01 12:25:25' },
          { idnum: 4, typename: '商品推荐', title: '居家好用——谷风一木纸抽', num: '300', status: '显示', date: '2017-11-01 12:25:25' }
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
        importanceOptions: [1, 2, 3],
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
        articleAddUpdateData: '',
        articleAddUpdateState: false,
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
      preview(data) {
        if (data.materialtype === '纯文字') {
          this.previewData.previewState = false
        } else {
          this.previewData.previewState = true
        }
        this.previewData.date = data.date
        this.previewData.title = data.title
        this.previewData.title2 = data.title2
        this.previewData.txt = data.content
        this.dialogVisible = true
      },
      fun_showArticleAddUpdate(state, val) {
        if (state === 'add') {
          this.articleAddUpdateData = { state: 'add' }
        } else {
          val.state = 'edit'
          this.articleAddUpdateData = val
        }
        this.articleAddUpdateState = true
      },
      fun_hideArticleAddUpdate(data) {
        this.articleAddUpdateState = false
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
      }
    }
  }
</script>
<style>
  .el-dialog {
    background: #f2f2f2 !important;
  }
  .el-dialog__body {
    padding: 0 0 15px;
  }
</style>

