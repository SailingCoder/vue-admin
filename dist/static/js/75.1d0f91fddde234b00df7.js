webpackJsonp([75],{PTzy:function(t,a,e){"use strict";function l(t){e("UAlh")}Object.defineProperty(a,"__esModule",{value:!0});var d=e("hDQj"),s=e.n(d),i=[{key:"1",display_name:"平价商品"},{key:"2",display_name:"积分换购"},{key:"3",display_name:"易物置换"},{key:"4",display_name:"任务商品"}],n={props:["data"],data:function(){return{a4:s.a,calendarTypeOptions:i,orderInfo:[{key:"orderName",name:"商品名称",val:""},{key:"orderid",name:"商品编号",val:""},{key:"ordertype",name:"商品分类",val:""},{key:"gy",name:"供货商",val:""},{key:"orderAmount",name:"在售状态",val:""},{key:"payMethod",name:"商品条码",val:""},{key:"memberAccount",name:"商品规格",val:""},{key:"consumerStore",name:"添加时间",val:""}],saleInfo:[{key:"saleStatus",name:"销售类型",val:"平价商品"},{key:"orderid",name:"置换款",val:""},{key:"ordertype",name:"返还储值",val:""},{key:"gy",name:"销售单价",val:""},{key:"orderAmount",name:"积分奖励",val:""},{key:"payMethod",name:"任务奖励",val:""}],ruleForm:{taskid:"",userphone:"",starttime:"",zhorderid:"",status:"",taskamount:"",iffinish:"",rewardamount:""}}},created:function(){},methods:{indexMethod:function(t){return t+1},backPrevPage:function(){this.$emit("cl_detailAndEdit",!1)}}},r=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",[e("div",{staticClass:"title-show-info"},[e("el-button",{attrs:{icon:"el-icon-arrow-left"},on:{click:function(a){t.backPrevPage()}}}),t._v(" "),"detail"===t.data.cl_status?e("span",[t._v("商品详情")]):t._e(),t._v(" "),"edit"===t.data.cl_status?e("span",[t._v("商品编辑")]):t._e()],1),t._v(" "),e("div",{staticClass:"addAndUpdate_container"},[e("el-form",{ref:"ruleForm",staticClass:"demo-ruleForm",attrs:{model:t.ruleForm,"label-width":"110px"}},[e("div",{staticClass:"addAndUpdate_title height_add_b"},[e("span",[t._v("基本信息")])]),t._v(" "),e("div",{staticClass:"addAndUpdate_content"},[e("el-row",{attrs:{gutter:10}},t._l(t.orderInfo,function(a){return e("div",[e("el-col",{staticStyle:{"max-width":"520px"},attrs:{xs:24,sm:24,md:12,lg:12,xl:12}},[e("el-form-item",{staticClass:"label_inital",attrs:{label:a.name+"："}},[e("el-input",{attrs:{disabled:"detail"===t.data.cl_status},model:{value:a.val,callback:function(e){t.$set(a,"val",e)},expression:"item.val"}})],1)],1)],1)}))],1),t._v(" "),e("div",{staticClass:"addAndUpdate_title height_add_b"},[e("span",[t._v("商品销售")])]),t._v(" "),e("div",{staticClass:"addAndUpdate_content"},[e("el-row",{attrs:{gutter:10}},t._l(t.saleInfo,function(a){return e("div",[e("el-col",{staticStyle:{"max-width":"520px"},attrs:{xs:24,sm:24,md:12,lg:12,xl:12}},["saleStatus"==a.key?e("div",[e("el-form-item",{staticClass:"label_inital",attrs:{label:a.name+"："}},[e("el-select",{staticClass:"filter-item",staticStyle:{width:"100%"},attrs:{clearable:"",placeholder:"商品类型",disabled:"detail"===t.data.cl_status},model:{value:a.value,callback:function(e){t.$set(a,"value",e)},expression:"sale.value"}},t._l(t.calendarTypeOptions,function(t){return e("el-option",{key:t.key,attrs:{label:t.display_name,value:t.key}})}))],1)],1):e("div",[e("el-form-item",{staticClass:"label_inital",attrs:{label:a.name+"："}},[e("el-input",{attrs:{disabled:"detail"===t.data.cl_status},model:{value:a.val,callback:function(e){t.$set(a,"val",e)},expression:"sale.val"}})],1)],1)])],1)}))],1),t._v(" "),e("div",{staticClass:"addAndUpdate_title height_add_b"},[e("span",[t._v("商品图片")])]),t._v(" "),e("div",{staticClass:"addAndUpdate_content",staticStyle:{"padding-left":"70px"}},[e("el-row",{attrs:{gutter:10}},[e("el-col",{attrs:{xs:24,sm:24,md:12,lg:8,xl:8}},[e("img",{attrs:{src:t.a4,alt:"",width:"240"}})])],1)],1),t._v(" "),"edit"===t.data.cl_status?e("div",{staticClass:"addAndUpdate_title"},[e("span",[t._v("执行操作")])]):t._e(),t._v(" "),"edit"===t.data.cl_status?e("div",{staticClass:"addAndUpdate_footer",staticStyle:{"padding-left":"70px"}},[e("el-button",{attrs:{type:"primary"},on:{click:function(a){t.submitForm("ruleForm")}}},[t._v("保存修改")])],1):t._e()])],1)])},o=[],c={render:r,staticRenderFns:o},m=c,v=e("VU/8"),_=l,u=v(n,m,!1,_,"data-v-67dc9134",null);a.default=u.exports},R2N5:function(t,a,e){a=t.exports=e("FZ+f")(!1),a.push([t.i,".height_add_b[data-v-67dc9134]{margin:10px 0}.label_inital .el-form-item__label[data-v-67dc9134]{width:100px!important}.label_inital .el-form-item__content[data-v-67dc9134]{margin-left:100px!important}.addAndUpdate_content .el-input[data-v-67dc9134]{width:100%;max-width:250px;float:left}.el-select[data-v-67dc9134]{display:inherit}",""])},UAlh:function(t,a,e){var l=e("R2N5");"string"==typeof l&&(l=[[t.i,l,""]]),l.locals&&(t.exports=l.locals);e("rjj0")("343263a3",l,!0)}});