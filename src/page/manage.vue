<template>
	<div class="manage_page fillcontain">
    <!-- <headers></headers> -->
    <el-row style="height: 100%;overflow:hidden">
	  		<el-col :xs="5" :sm="4" :md="4" :lg="3"  style="height: 100%; background-color: #324057; overflow-y:scroll" id="manage">
				<el-menu :default-active="defaultActive" style="min-height: 100%;" theme="dark" router :unique-opened="true">
					<el-menu-item index="home"><i class="el-icon-menu"></i>首页</el-menu-item>
          <el-submenu v-for="(item,index) in menulist" :index="item.value" :key="item.value" v-show="item.value!=1">
            <template slot="title"><i :class="iconlist[index]"></i>{{item.label}}</template>
            <el-menu-item v-for="list in item.children" :index="list.url"  :key="list.value" v-if="list.isCheck">{{list.label}}</el-menu-item>
            <el-menu-item v-for="list in item.children" :index="list.url"  :key="list.value" v-if="!list.isCheck" disabled>{{list.label}}</el-menu-item>
          </el-submenu>
				</el-menu>
			</el-col>
			<el-col :xs="19" :sm="20" :md="20" :lg="21"  style="height: 100%;overflow: auto;">
				  <router-view></router-view>
			</el-col>
		</el-row>
  	</div>
</template>

<script>
  import {mapActions, mapState} from 'vuex'
  import {getStore,setStore,removeStore} from '@/config/mUtils';

  export default {
    name: 'manage',
    data(){
      return {
        menulist:[],
        iconlist:[
          'el-icon-menu',
          'el-icon-share',
          'el-icon-goods',
          'el-icon-date',
          'el-icon-document',
          'el-icon-edit',
          'el-icon-printer',
          'el-icon-rank',
          'el-icon-refresh',
          'el-icon-warning',
        ],
        orderNum:this.$route,
      }
    },
		computed: {
        adminToken() {
          return this.$store.state.user.adminToken
        },
        adminInfo() {
          return this.$store.state.user.adminInfo
        },
      // ...mapState({
      //     adminToken: state => state.user.adminToken,
      //     adminInfo: state => state.user.adminInfo,
      //   }),
			defaultActive: function(){
        let bool=true;
        this.adminInfo.manage.forEach(item=>{
          if(this.$route.path.replace('/', '')==item.url&&!item.isCheck&&item.id!=1){
            this.$message({
              type: 'error',
              message: '抱歉，您的账号没有权限访问该页面'
            });
            this.bool=false;
            this.$router.push('/home')
          }
        })
        if(bool){
          return this.$route.path.replace('/', '');
        }
			},

		},

    mounted(){
      let manage=getStore('managelist')
      this.menulist = this.proJSON(JSON.parse(manage), 0);
    },
    methods: {
      checkrouter(){
        this.adminInfo.manage.forEach(item=>{
          if(this.$route.path.replace('/', '')==item.url&&!item.isCheck&&item.id!=1){
            this.$message({
              type: 'error',
              message: '抱歉，您的账号没有权限访问该页面'
            });
            this.$router.push('/home')
          }
        })
      },
    //目录递归函数
      proJSON(oldArr, pid) {
        let newArr = [];
        var self = this;
        oldArr.map(function(item) {
          if(item.pid == pid&&item.isShow!=1) {
            let obj = {
              value: item.id+'',
              isCheck: item.isCheck,
              pid:item.pid,
              url:item.url?item.url:'',
              label: item.name
            }
            let child = self.proJSON(oldArr, item.id);
            if(child.length > 0) {
              obj.children = child
            }
            newArr.push(obj)
          }
        })
        return newArr;
      },
    },
    watch: {
      adminInfo: function (newValue, oldVal) {
        this.menulist=[];
        this.menulist = this.proJSON(this.adminInfo.manage, 0);
        this.checkrouter()
      },
    }
  }
</script>
<style lang="less" scoped>
	@import '../style/mixin';
	.manage_page{

  }
  .el-icon-goods:before{ content: "\E618";}
</style>
