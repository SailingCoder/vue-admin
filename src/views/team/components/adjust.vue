<template>
  <div>
    <div class="title-show-info">
      <el-button icon="el-icon-arrow-left" @click="backPrevPage()"></el-button>
      <span>分配权限</span>
    </div>
    <div class="addAndUpdate_container">

      <el-form label-width="120px" class="demo-ruleForm">
        <div class="addAndUpdate_title">
          <span>基本信息</span>
        </div>
        <div class="addAndUpdate_content">
          <el-form-item label="关键字查询：">
            <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
          </el-form-item>
          <el-form-item label="权限选择：">
            <el-tree
              class="filter-tree"
              :data="data2"
              show-checkbox
              :props="defaultProps"
              node-key="id"
              :filter-node-method="filterNode"
              :default-expanded-keys="[2, 3]"
              :default-checked-keys="[5]"
              ref="tree2">
            </el-tree>
          </el-form-item>
        </div>

        <div class="addAndUpdate_title">
          <span>执行操作</span>
        </div>
        <div class="addAndUpdate_footer">
          <el-form-item>
            <el-button type="primary" @click="submitForm()">保存</el-button>
          </el-form-item>
        </div>

      </el-form>
    </div>
  </div>
</template>
<script>
  export default {
    props: [
      'data'
    ],
    data() {
      return {
        filterText: '',
        data2: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val)
      }
    },

    methods: {
      submitForm() {
        console.log(this.$refs.tree2.getCheckedKeys())
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      backPrevPage() {
        this.$emit('adjust', false)
      }
    }
  }
</script>

<style scoped>
  .addAndUpdate_content{
    padding: 10px 50px;
  }

  .addAndUpdate_footer{
    padding: 10px 50px;
  }

  .filter-tree{
    padding-top: 10px;
  }
</style>
