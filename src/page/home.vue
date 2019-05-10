<template>
    <div class="fillcontain">
        <head-top></head-top>
      <div class="table_container" v-loading="loading">
        <!--<div class="specailbtn">-->
          <!--<el-button type="primary" icon="el-icon-refresh" size="small" @click="dialognewform=true">刷新</el-button>-->
        <!--</div>-->
        <div class="data_section">
          <header class="section_title">待处理订单</header>
          <div class="homelist">
            <el-card v-for="item in baseinfo" :class="item.color" :key="item.link">
              <a class="iconbox" @click="orderlink(item.link)">
                <em class="adminicon" ></em>
              </a>
              <div @click="orderlink(item.link)">
                <strong>{{item.mun}}</strong>
                <p>{{item.name}}</p>
              </div>
            </el-card>
          </div>
        </div>
        <div class="data_section"  v-for="list in maininfo" :key="list.type">
          <header class="section_title">{{list.title}}</header>
          <el-card shadow="hover" class="mainlist" v-for="item in list.list" :class="item.color" :key="item.link">
            <div @click="golink(item.link)">
              <div class="listtitle" >
                <em class="adminicon"></em>
                <span>{{item.listname}}</span>
              </div>
              <div class="listtip">{{item.listtitle}}（{{item.mun}}）</div>
              <em class="adminbg"></em>
            </div>
          </el-card>
        </div>
      </div>
    </div>
</template>

<script>
	import headTop from '../components/headTop'
	import {getIndexBacklog} from '@/api/getDatelist'
    export default {
      name: 'home',
    	data(){
    		return {
          loading:true,
    		  baseinfo:[
            {
              color:'color1',
              name:'办公采购',
              title:'buy',
              mun:10,
              link:'officeorder',
            },
            {
              color:'color2',
              name:'办公装修',
              title:'fitment',
              mun:10,
              link:'fitmentorder',
            },
            {
              color:'color3',
              name:'工商财税',
              title:'industry',
              mun:10,
              link:'multorder',
            },
            {
              color:'color4',
              name:'人才服务',
              title:'person',
              mun:10,
              link:'serviceorder',
            },
            {
              color:'color5',
              name:'会议室预订',
              title:'meeting',
              mun:10,
              link:'boardroomlist',
            },
            {
              color:'color6',
              name:'项目申报',
              title:'project',
              mun:10,
              link:'declareorder',
            },
          ],
          maininfo:[
            {
              title:'补登申请',
              type:1,
              list:[
                {
                  listname:'订单补登申请',
                  listtitle:'待审核',
                  name:'orderOffline',
                  color:'maincolor1',
                  mun:10,
                  link:'supplement',
                },
                {
                  listname:'账单补登申请',
                  listtitle:'待审核',
                  name:'billOffline',
                  color:'maincolor2',
                  mun:10,
                  link:'wesupple',

                },
              ]
            },
            {
              title:'开票申请',
              type:2,
              list:[
                {
                  listname:'订单待开票',
                  listtitle:'待开票',
                  name:'orderInvoice',
                  color:'maincolor3',
                  mun:10,
                  link:'invoice',
                },
                {
                  listname:'账单待开票',
                  listtitle:'待开票',
                  name:'billInvoice',
                  color:'maincolor4',
                  mun:10,
                  link:'weinvoice',
                },
              ]
            },
            {
              title:'退款申请',
              type:3,
              list:[
                {
                  listname:'退款申请',
                  listtitle:'待处理',
                  name:'refund',
                  color:'maincolor5',
                  mun:10,
                  link:'refundlist',
                },
              ]
            },
            {
              title:'售后申请',
              type:4,
              list:[
                {
                  listname:'售后申请',
                  listtitle:'待处理',
                  name:'afterSale',
                  color:'maincolor6',
                  mun:10,
                  link:'aftersale',
                },
              ]
            },
            {
              title:'用户反馈',
              type:5,
              list:[
                {
                  listname:'用户反馈',
                  listtitle:'待处理',
                  name:'feedBack',
                  color:'maincolor7',
                  mun:10,
                  link:'feedback',
                },
              ]
            },
          ],
    		}
    	},
    	components: {
    		headTop,
    	},
      created(){
    	  this.getIndexBacklog()
      },
    	methods: {
        async getIndexBacklog(){
          let res = await getIndexBacklog();
          if(res.code==0){
            this.baseinfo.forEach(item=>{
              res.data.orderNums.forEach(list=> {
                if(list.name==item.title){
                  item.mun=list.num;
                }
              })
            })
            res.data.otherNums.forEach(list=> {
              this.maininfo.forEach(item=>{
                if(list.type==item.type){
                  item.list.forEach(itemlist=>{
                    if(list.name==itemlist.name){
                      itemlist.mun=list.num;
                    }
                  })
                }
              })
            })
          }
          this.loading=false;
        },
        orderlink(link){
          console.log(link)
          this.$router.push(link+'?status=3')
        },
        golink(link){
          this.$router.push(link+'?status=0')
        },
    	}
    }
</script>

<style lang="less">
	@import '../style/mixin';
  .fillcontain{position: relative;}
  .specailbtn{position: absolute;top:12px;right:40px;}
  .homelist{margin-bottom: 10px;width:70%;min-width:910px;overflow: hidden;
    .el-card{width:29%;float:left;margin: 20px 2%;cursor: pointer;
      .el-card__body{overflow: hidden;}
      .iconbox{width:92px;height:92px;float:left;display: block;margin-right: 20px;}
      strong{font-size:28px;line-height:50px;}
    }
    .el-card:hover{box-shadow: 0 0px 12px 0 rgba(0,0,0,.3);border-color:transparent;}
  }
  .data_section .mainlist{width:32.5%;min-width:420px; margin:0 1%;float:left;position: relative;height:160px;line-height:50px;color:#fff;cursor: pointer;
    .listtitle{height:50px;}
    .adminicon{float:left;margin: 0;}
    .listtip{position: absolute;left:0;bottom:0;background-color: rgba(0,0,0,.3);height:50px;width: 100%;padding:0 20px;}
  }
  .data_section .el-card.is-hover-shadow:hover{box-shadow: 0 0px 12px 0 rgba(0,0,0,.5);border-color:transparent;}
  .adminicon{background:url('../assets/adminicon.png') no-repeat;width:50px;height:50px;display: block;margin:21px;}
  .adminbg{background:url('../assets/adminbgicon.png') no-repeat;width:140px;height:140px;display: block;position: absolute;bottom:0;right:30px;}
  .colorfun (@a,@index) {
    .iconbox{background-color: @a; }
    .adminicon{background-position:@index 0;}
    strong{color:@a;}
  }
  .color1{
    .colorfun(#30b9ca,0)
  }
  .color2{
    .colorfun(#0a93ff,-50px)
  }
  .color3{
    .colorfun(#fd8457,-100px)
  }
  .color4{
    .colorfun(#ffb64a,-150px)
  }
  .color5{
    .colorfun(#20c789,-250px)
  }
  .color6{
    .colorfun(#39bee9,-200px)
  }
  .bgfun (@a,@index,@mun) {
    background-color: @a;
    .adminicon{background-position:@index 0;}
    .adminbg{background-position:@mun 0;}
    strong{color:@a;}
  }
  .data_section .maincolor1{
    .bgfun(#30b9ca,-300px,0)
  }
  .data_section .maincolor2{
    .bgfun(#0ab7ff,-350px,-140px)
  }
  .data_section .maincolor3{
    .bgfun(#0ca7a2,-300px,0)
  }
  .data_section .maincolor4{
    .bgfun(#0a93ff,-350px,-140px)
  }
  .data_section .maincolor5{
    .bgfun(#20c789,-450px,-280px)
  }
  .data_section .maincolor6{
    .bgfun(#fd8457,-400px,-420px)
  }
  .data_section .maincolor7{
    .bgfun(#ffb64a,-500px,-560px)
  }
	.data_section{
		padding:10px 20px;
    overflow: hidden;
    min-width:900px;
		.section_title{
			text-align: left;
			font-size: 16px;
      margin-left: 1.4%;
			margin-bottom: 10px;
		}
	}

</style>
