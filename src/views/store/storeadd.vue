<template>
  <div>
    <div class="title-show-info" style="min-height: 56px">
      <el-button v-if="data&&(data.storeStatus=='detail'||data.storeStatus=='edit')" icon="el-icon-arrow-left" @click="backPrevPage()"></el-button>
      <span v-if="data&&data.storeStatus=='detail'">门店详情</span>
      <span v-else-if="data&&data.storeStatus=='edit'">门店编辑</span>
    </div>
    <div class="addAndUpdate_container">
      <el-form :model="ruleForm" ref="ruleForm" label-width="110px" class="demo-ruleForm">
        <div class="addAndUpdate_title height_add_b">
          <span>基本信息</span>
        </div>
        <div class="addAndUpdate_content">
          <el-row :gutter="10">
            <div v-for="basic in basicInfo">
              <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" style="max-width: 520px">
                <el-form-item v-if="basic.key=='radio'" class="label_inital" :label="basic.name + '：'">
                  <el-radio-group v-model="basic.radio" style="padding-top: 13px" :disabled="data&&data.storeStatus=='detail'">
                    <el-radio label="开通"></el-radio>
                    <el-radio label="关闭"></el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item v-else-if="basic.key=='menu'" class="label_inital" :label="basic.name + '：'">
                  <el-input type="textarea" v-model="basic.val" :disabled="data&&data.storeStatus=='detail'"></el-input>
                </el-form-item>
                <el-form-item v-else-if="basic.key=='status'" class="label_inital" :label="basic.name + '：'">
                  <el-select clearable class="filter-item" style="width: 100%;max-width: 250px" :disabled="data&&data.storeStatus=='detail'" v-model="ruleForm.status" placeholder="选择角色">
                    <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-else-if="basic.key=='address'" class="label_inital" :label="basic.name + '：'">
                  <addressHello :data="addressInData" @addressHello="addressOutData"></addressHello>
                </el-form-item>
                <el-form-item v-else class="label_inital" :label="basic.name + '：'">
                  <el-input v-model="basic.val" :disabled="data&&data.storeStatus=='detail'"></el-input>
                </el-form-item>
              </el-col>
            </div>
          </el-row>
        </div>

        <div class="addAndUpdate_title height_add_b">
          <span>门店图片</span>
        </div>
        <div class="addAndUpdate_content">
          <el-row>
            <el-col :xs="24">
              <el-form-item class="label_inital" label="外景图：">
                <el-row>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <img :src="a4" alt="" width="240">
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24">
              <el-form-item class="label_inital" label="室内图：">
                <el-row>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <img :src="a4" alt="" width="240">
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <img :src="a4" alt="" width="240">
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <img :src="a4" alt="" width="240">
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div v-if="!data||(data&&data.storeStatus=='edit')" class="addAndUpdate_title">
          <span>执行操作</span>
        </div>
        <div v-if="!data||(data&&data.storeStatus=='edit')" class="addAndUpdate_footer">
          <el-form-item>
            <el-button v-if="data&&data.storeStatus=='edit'" type="primary" @click="submitForm('ruleForm')">保存修改</el-button>
            <el-button v-else type="primary" @click="submitForm('ruleForm')">新增</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
  import a4 from '@/assets/images/1/4.jpg'
  import waves from '@/directive/waves' // 水波纹指令
  import addressHello from '../components-demo/threeLevelLinkage/address'
  const calendarTypeOptions = [
    { key: 'CN', display_name: '加盟店' },
    { key: 'US', display_name: '直营店' },
    { key: 'JP', display_name: '大门店' }
  ]
  export default {
    props: [
      'data'
    ],
    directives: {
      waves
    },
    components: { addressHello },
    data() {
      return {
        calendarTypeOptions,
        basicInfo: [
          { key: 'orderid', name: '端口号', val: '' },
          { key: 'amount', name: '联系人', val: '' },
          { key: 'status', name: '门店类型', val: '' },
          { key: 'userphone', name: '联系电话', val: '' },
          { key: 'ordertype', name: '门店名称', val: '' },
          { key: 'address', name: '所属省市', val: '' },
          { key: 'radio', name: '是否开通', val: '' },
          { key: 'address1', name: '详细地址', val: '' },
          { key: 'menu', name: '备注信息', val: '' }
        ],
        a4,
        ruleForm: {
          orderid: '',
          ordertype: '',
          status: '',
          address: '',
          address1: '',
          pinmi: '',
          amount: '',
          userphone: '',
          menu: ''
        },
        storeStatus: 'add',
        addressInData: ''
      }
    },
    created() {
      if (this.data) {
        this.ruleForm = {
          orderid: this.data.orderid,
          ordertype: this.data.ordertype,
          status: this.data.status,
          address: this.data.address,
          address1: this.data.address1,
          pinmi: this.data.pinmi,
          amount: this.data.amount,
          userphone: this.data.userphone,
          menu: this.data.menu
        }
      }
    },
    methods: {
      indexMethod(index) {
        return index + 1
      },
      backPrevPage() {
        this.$emit('storeadd', false)
      },
      addressOutData(data) {
        console.log(data)
      }
    }
  }
</script>

<style scoped>

  .label_inital .el-form-item__label{
    width: 100px !important;
  }

  .label_inital .el-form-item__content{
    margin-left: 100px !important;
  }

  .addAndUpdate_content .el-input {
    width: 100%;
    max-width: 250px;
    float: left;
  }

  .el-select {
    display: inherit;
  }
</style>
