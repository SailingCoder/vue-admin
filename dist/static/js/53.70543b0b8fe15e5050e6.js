webpackJsonp([53],{dEeD:function(e,r,t){"use strict";function a(e){t("t0l0")}Object.defineProperty(r,"__esModule",{value:!0});var n={props:["data"],data:function(){return{ruleForm:{name:"",region:"",date1:"",date2:"",delivery:!1,type:[],resource:"",desc:""},rules:{name:[{required:!0,message:"请输入活动名称",trigger:"blur"},{min:3,max:5,message:"长度在 3 到 5 个字符",trigger:"blur"}],region:[{required:!0,message:"请选择活动区域",trigger:"change"}],date1:[{type:"date",required:!0,message:"请选择日期",trigger:"change"}],date2:[{type:"date",required:!0,message:"请选择时间",trigger:"change"}],type:[{type:"array",required:!0,message:"请至少选择一个活动性质",trigger:"change"}],resource:[{required:!0,message:"请选择活动资源",trigger:"change"}],desc:[{required:!0,message:"请填写活动形式",trigger:"blur"}]}}},methods:{submitForm:function(e){this.$refs[e].validate(function(e){if(!e)return console.log("error submit!!"),!1;alert("submit!")})},backPrevPage:function(){this.$emit("adjust",!1)}}},l=function(){var e=this,r=e.$createElement,t=e._self._c||r;return t("div",[t("div",{staticClass:"title-show-info"},[t("el-button",{attrs:{icon:"el-icon-arrow-left"},on:{click:function(r){e.backPrevPage()}}}),e._v(" "),t("span",[e._v("会员列表 - 调整账户")])],1),e._v(" "),t("div",{staticClass:"addAndUpdate_container"},[t("el-form",{ref:"ruleForm",staticClass:"demo-ruleForm",attrs:{model:e.ruleForm,rules:e.rules,"label-width":"120px"}},[t("div",{staticClass:"addAndUpdate_title"},[t("span",[e._v("基本信息")])]),e._v(" "),t("div",{staticClass:"addAndUpdate_content"},[t("el-form-item",{attrs:{label:"注册手机账号：",prop:"name"}},[t("el-input",{model:{value:e.ruleForm.name,callback:function(r){e.$set(e.ruleForm,"name",r)},expression:"ruleForm.name"}})],1),e._v(" "),t("el-form-item",{attrs:{label:"当前会员账号：",prop:"name"}},[t("el-input",{model:{value:e.ruleForm.name,callback:function(r){e.$set(e.ruleForm,"name",r)},expression:"ruleForm.name"}})],1),e._v(" "),t("el-form-item",{attrs:{label:"登录密码：",prop:"name"}},[t("el-input",{model:{value:e.ruleForm.name,callback:function(r){e.$set(e.ruleForm,"name",r)},expression:"ruleForm.name"}})],1),e._v(" "),t("el-form-item",{attrs:{label:"交易密码：",prop:"name"}},[t("el-input",{model:{value:e.ruleForm.name,callback:function(r){e.$set(e.ruleForm,"name",r)},expression:"ruleForm.name"}})],1),e._v(" "),t("el-form-item",{attrs:{label:"所属门店：",prop:"name"}},[t("el-input",{model:{value:e.ruleForm.name,callback:function(r){e.$set(e.ruleForm,"name",r)},expression:"ruleForm.name"}})],1)],1),e._v(" "),t("div",{staticClass:"addAndUpdate_title"},[t("span",[e._v("执行操作")])]),e._v(" "),t("div",{staticClass:"addAndUpdate_footer"},[t("el-form-item",[t("el-button",{attrs:{type:"primary"},on:{click:function(r){e.submitForm("ruleForm")}}},[e._v("保存")])],1)],1)])],1)])},o=[],s={render:l,staticRenderFns:o},i=s,m=t("VU/8"),u=a,d=m(n,i,!1,u,"data-v-b389e09c",null);r.default=d.exports},he5c:function(e,r,t){r=e.exports=t("FZ+f")(!1),r.push([e.i,".addAndUpdate_content[data-v-b389e09c],.addAndUpdate_footer[data-v-b389e09c]{padding:10px 50px}",""])},t0l0:function(e,r,t){var a=t("he5c");"string"==typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);t("rjj0")("273d6600",a,!0)}});