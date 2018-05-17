<template>
  <div class="app-container calendar-list-container">
    <div class="title-show-info" style="padding: 0 0 20px 0">
      <el-button icon="el-icon-arrow-left" @click="backPrevPage()"></el-button>
      <span>组员列表</span>
    </div>
    <div class="container">
      <el-row class="c-body">
        <el-col :xs="24" :sm="24" :md="8" class="c-body-aside">

          <el-row class="el-collapse-title">组员名单</el-row>
          <el-collapse accordion style="border: 1px solid #e6ebf5;border-radius: 5px;padding: 0 10px;">
            <div class="el-collapse-group" v-for="(item, index) in crewlist">
              <el-collapse-item>
                <template slot="title">
                  <div>
                    <div class="el-collapse-list">{{index+1}}</div>
                    <div class="el-collapse-list el-collapse-list-p">
                      <div>{{item.managerid}}</div>
                      <div>{{item.managername}}</div>
                    </div>
                    <div class="el-collapse-list">
                      <el-button type="text" size="small" @click.stop="deletecrew(item, index)">删除</el-button>
                    </div>
                  </div>
                </template>
                <div>状态：{{item.status}}</div>
                <div>创建时间：{{item.ctime}}</div>
              </el-collapse-item>
            </div>
          </el-collapse>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" class="c-body-section">
          <el-row class="el-collapse-title" style="text-align: left">添加名单</el-row>
          <el-table :key='tableKey' :data="table" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
            <el-table-column align="center" label="序号" width="50">
              <template slot-scope="scope">
                <span>{{scope.row.idnum}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width="110" label="账号">
              <template slot-scope="scope">
                <span>{{scope.row.managerid}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width="110" label="昵称">
              <template slot-scope="scope">
                <span>{{scope.row.managername}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width="60" label="状态">
              <template slot-scope="scope">
                <span>{{scope.row.status}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width="152" label="创建时间">
              <template slot-scope="scope">
                <span>{{scope.row.ctime}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width="60" label="操作" class-name="small-padding">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="addcrew(scope.row)">添加</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import waves from '@/directive/waves' // 水波纹指令
  export default {
    props: [
      'data'
    ],
    directives: {
      waves
    },
    data() {
      return {
        activeNames: [],
        crewlist: [
          { idnum: 1, managerid: 'syqlzhaosanquan', managername: '赵三全', status: '正常', ctime: '2017-11-15 22:10:01' },
          { idnum: 2, managerid: 'syqlxiaojian', managername: '肖剑', status: '正常', ctime: '2017-11-16 22:10:01' },
          { idnum: 3, managerid: 'syqlyouzi', managername: '又芝', status: '正常', ctime: '2017-11-17 22:10:01' }
        ],
        table: [
          { idnum: 1, managerid: '02125632001', managername: '李四', status: '正常', ctime: '2017-11-15 22:10:01' },
          { idnum: 2, managerid: '02125632002', managername: '张五', status: '正常', ctime: '2017-11-16 22:10:01' },
          { idnum: 3, managerid: '02125632003', managername: '赵六', status: '正常', ctime: '2017-11-17 22:10:01' }
        ],
        tableKey: 0,
        list: null,
        total: null,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 10,
          value6: '',
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        },
        importanceOptions: [1, 2, 3],
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
        pvData: []
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
      }
    },
    created() {
      this.getList()
    },
    methods: {
      handleChange(val) {
        console.log(val)
      },
      getList() {
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
      backPrevPage() {
        this.$emit('crewlist', false)
      },
      deletecrew(data, index) {
        this.$confirm('此操作将删除“' + this.data.rolename + '”里的“' + data.managerid + '”组员, 是否继续?', '删除组员', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.crewlist.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
        })
      },
      addcrew(data) {
        this.$confirm('此操作将添加“' + data.managerid + '”到“' + this.data.rolename + '”角色组中, 是否继续?', '添加组员', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.crewlist.push(data)
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
        }).catch(() => {
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .container {
    border: 1px solid #d1dbe5;
    -webkit-border-radius: 5px;
    -moz-border-radius: 50px;
    border-radius: 5px;
  }

  .c-body-aside {
    min-width: 265px;
    max-width: 350px;
    padding: 10px;
  }

  .aside-tree {
    border: 1px solid #d1dbe5;
  }

  .c-body-section {
    padding: 10px 10px 30px;
  }

  .section-form {
    padding: 20px;
    border: 1px solid #d1dbe5;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
  }

  .el-tree-node__content {
    height: 35px !important;
  }

  .el-collapse-list {
    float: left;
  }

  .el-collapse-list:first-child {
    width: 25px;
    padding-left: 5px;
  }

  .el-collapse-list:nth-child(2) {
    width: 140px;
  }

  .el-collapse-list-p {
    padding-top: 5px;
    line-height: 18px;
  }

  .el-collapse-list:last-child {
    width: 35px;
    float: right;
  }

  .el-collapse-title {
    text-align: center;
    padding: 15px 0 10px;
  }

  .el-collapse-group {
    border-bottom: 1px solid #e6ebf5;
  }

  .el-collapse-group:last-child {
    border-bottom: none;
  }
</style>
