webpackJsonp([74],{"5beK":function(t,e,a){e=t.exports=a("FZ+f")(!1),e.push([t.i,".height_add_b[data-v-73b1d708]{margin:10px 0}.label_inital .el-form-item__label[data-v-73b1d708]{width:100px!important}.label_inital .el-form-item__content[data-v-73b1d708]{margin-left:100px!important}.addAndUpdate_content .el-input[data-v-73b1d708]{width:100%;max-width:250px;float:left}",""])},"9I3h":function(t,e,a){var l=a("5beK");"string"==typeof l&&(l=[[t.i,l,""]]),l.locals&&(t.exports=l.locals);a("rjj0")("d513ecd4",l,!0)},ELgP:function(t,e,a){"use strict";function l(t){a("9I3h")}Object.defineProperty(e,"__esModule",{value:!0});var r=[{key:"0",display_name:""}],i={props:["data"],data:function(){return{calendarTypeOptions:r,ruleForm:{orderid:"",status:"",ordername:""}}},created:function(){"edit"===this.data.ct_status&&(this.ruleForm.orderid=this.data.orderid,this.ruleForm.ordername=this.data.ordername)},methods:{backPrevPage:function(){this.$emit("ct_addAndEdit",!1)}}},d=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"title-show-info"},[a("el-button",{attrs:{icon:"el-icon-arrow-left"},on:{click:function(e){t.backPrevPage()}}}),t._v(" "),"add"===t.data.ct_status?a("span",[t._v("新增品类")]):a("span",[t._v("编辑品类")])],1),t._v(" "),a("div",{staticClass:"addAndUpdate_container"},[a("el-form",{ref:"ruleForm",staticClass:"demo-ruleForm",attrs:{model:t.ruleForm,"label-width":"120px"}},[a("div",{staticClass:"addAndUpdate_title height_add_b"},[a("span",[t._v("基本信息")])]),t._v(" "),a("div",{staticClass:"addAndUpdate_content"},[a("el-form-item",{staticClass:"label_inital",attrs:{label:"品类编号："}},[a("el-input",{model:{value:t.ruleForm.orderid,callback:function(e){t.$set(t.ruleForm,"orderid",e)},expression:"ruleForm.orderid"}})],1),t._v(" "),a("el-form-item",{staticClass:"label_inital",attrs:{label:"父级品类："}},[a("el-select",{staticClass:"filter-item",staticStyle:{width:"100%","max-width":"250px"},attrs:{clearable:"",placeholder:"商品类型"},model:{value:t.ruleForm.value,callback:function(e){t.$set(t.ruleForm,"value",e)},expression:"ruleForm.value"}},t._l(t.calendarTypeOptions,function(t){return a("el-option",{key:t.key,attrs:{label:t.display_name,value:t.key}})}))],1),t._v(" "),a("el-form-item",{staticClass:"label_inital",attrs:{label:"品类名称："}},[a("el-input",{model:{value:t.ruleForm.ordername,callback:function(e){t.$set(t.ruleForm,"ordername",e)},expression:"ruleForm.ordername"}})],1)],1),t._v(" "),a("div",{staticClass:"addAndUpdate_title"},[a("span",[t._v("执行操作")])]),t._v(" "),a("div",{staticClass:"addAndUpdate_footer"},[a("el-form-item",{staticClass:"label_inital"},["add"===t.data.ct_status?a("el-button",{attrs:{type:"primary"},on:{click:function(e){t.submitForm("ruleForm")}}},[t._v("新增")]):a("el-button",{attrs:{type:"primary"},on:{click:function(e){t.submitForm("ruleForm")}}},[t._v("保存修改")])],1)],1)])],1)])},n=[],s={render:d,staticRenderFns:n},o=s,c=a("VU/8"),u=l,m=c(i,o,!1,u,"data-v-73b1d708",null);e.default=m.exports}});