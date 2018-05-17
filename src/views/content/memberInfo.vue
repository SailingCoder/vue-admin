<template>
  <div v-if="!memberInfoAddState" class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button class="filter-item" v-waves @click="fun_showMemberInfoAdd('image')" type="primary">添加图文类</el-button>
      <el-button class="filter-item" v-waves @click="fun_showMemberInfoAdd('txt')" type="primary">添加纯文本</el-button>
    </div>

    <!--<el-date-picker v-if="ruleForm.datetype==='定时'" v-model="ruleForm.date" type="datetime" placeholder="选择日期时间"></el-date-picker>-->
    <!--<el-input v-if="ruleForm.obj==='部分会员'" type="textarea" v-model="ruleForm.desc" placeholder="请填写会员账号,用“ , ”隔开"></el-input>-->
    <el-table :key='tableKey' :data="table" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.idnum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="90" label="内容类型">
        <template slot-scope="scope">
          <span>{{scope.row.materialtype}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" label="内容标题">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" label="推送内容">
        <template slot-scope="scope">
          <span>{{scope.row.content}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="推送对象">
        <template slot-scope="scope">
          <span>{{scope.row.object}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="152" label="推送时间">
        <template slot-scope="scope">
          <span>{{scope.row.date}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" min-width="60" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="preview(scope.row)">预览</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" width="400px" class="m-el-dialog">
        <div class="dialog-phone">
          <el-row>
            <el-col :span="24" class="dialog-phone-header">
              <el-row>
                <el-col :span="3" style="text-align: right;padding-right: 5px;"><i class="el-icon-arrow-left"></i></el-col>
                <el-col :span="21">我的消息</el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row class="dialog-phone-container">
            <el-row v-if="!previewData.previewState">
              <el-row class="dialog-phone-container-time"><span>{{previewData.date}}</span></el-row>
              <el-row class="dialog-phone-container-txt">
                <el-row class="dialog-phone-container-txt-header"><span>系统消息</span></el-row>
                <el-row class="dialog-phone-container-txt-content">{{previewData.txt}}</el-row>
              </el-row>
            </el-row>
            <el-row v-else>
              <el-row class="dialog-phone-container-time"><span>{{previewData.date}}</span></el-row>
              <el-row class="dialog-phone-container-txt">
                  <el-row class="dialog-phone-container-txt-header"><span>系统消息</span></el-row>
                  <el-row class="dialog-phone-container-txt-content">
                    <el-col :span="6" class="content-image">
                      <img :src="a4" alt="">
                    </el-col>
                    <el-col :span="18" class="content-fig">
                      <el-row class="content-title"><span>{{previewData.title}}</span></el-row>
                      <el-row class="content-txt">{{previewData.txt}}</el-row>

                      <el-row><el-button type="text" style="padding: 0;">点击查看></el-button></el-row>
                    </el-col>
                  </el-row>
              </el-row>
            </el-row>
          </el-row>
        </div>
    </el-dialog>


  </div>

  <div v-else-if="memberInfoAddState">
    <memberInfoAdd :data="memberInfoAddData" @memberInfoAdd="fun_hideMemberInfoAdd"></memberInfoAdd>
  </div>



</template>

<script>
  import { fetchList, fetchPv } from '@/api/article'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'
  import memberInfoAdd from './components/memberInfoAdd'
  import a4 from '@/assets/images/123.png'

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
    name: 'memberInfo',
    components: { memberInfoAdd },
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
          { idnum: 1, materialtype: '纯文字', title: '2018元旦快乐！', content: '2018元旦快乐！', object: '全体会员', date: '2017-12-28 12:25:25' },
          { idnum: 2, materialtype: '纯文字', title: '派送会员福利！', content: '派送会员福利！', object: '部分会员：13288888888,1328888887', date: '2017-12-27 12:25:25' },
          { idnum: 3, materialtype: '图文', title: '小蓝单车宣布解散', content: '图文消息的简介', object: '全体会员', date: '2017-12-22 12:25:25' },
          { idnum: 4, materialtype: '图文', title: 'CK纯棉制造商', content: '图文消息的简介', object: '全体会员', date: '2017-12-21 12:25:25' }
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
        memberInfoAddData: '',
        memberInfoAddState: false
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
      fun_showMemberInfoAdd(val) {
        this.memberInfoAddData = val
        this.memberInfoAddState = true
      },
      fun_hideMemberInfoAdd(data) {
        this.memberInfoAddState = false
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

</style>

