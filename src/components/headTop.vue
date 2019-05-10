<template>
	  <div class="headerMain">
		    <div class="header_container">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item v-for="(item, index) in $route.meta.title" :key="index">{{item}}</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="right avatorinfo">
                <div class="left avatorbox">
                    <img :src="adminInfo.avator" class="avator">
                </div>
                <div class="left avatorbtn">
                    {{adminInfo.userName}},欢迎登录！ | <span @click="handleCommand('singout')"> &nbsp;&nbsp;退出登录</span>
                </div>
            </div>
        </div>
        <div>
            <!-- 标签栏 -->
            <div class="div-tags">
                <div class="ul-c">
                    <router-link
                      v-for="tag in visitedViews"
                      ref="tag"
                      :key="tag.path"
                      :class="isActive(tag)?'active':''"
                      :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
                      tag="span"
                      class="tags-view-item"
                      @click.middle.native="closeSelectedTag(tag)"
                      @contextmenu.prevent.native="openMenu(tag,$event)"
                    >
                        {{tag.meta.title[tag.meta.title.length - 1]}}
                        <span class="svg-container" @click.prevent.stop="closeSelectedTag(tag)">
                            <svg-icon icon-class="close" />
                        </span>
<!--                        <span v-if="!tag.meta.affix" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />-->
                    </router-link>
                </div>
                <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
                  <li @click="refreshSelectedTag(selectedTag)">
                    刷新
                  </li>
                  <li v-if="!(selectedTag.meta&&selectedTag.meta.affix)" @click="closeSelectedTag(selectedTag)">
                    关闭
                  </li>
                  <li @click="closeOthersTags">
                    关闭其他
                  </li>
                  <li @click="closeAllTags(selectedTag)">
                    关闭所有
                  </li>
                </ul>
<!--                 标签栏相关功能-->
                <div class="div-icons">
                    <div class="refresh-c"  title="刷新当前标签页" @click="refreshSelectedTag(selectedTag)">
                        <span class="svg-container">
                            <svg-icon icon-class="loading" />
                        </span>
                    </div>
                    <div class="tag-options" title="关闭标签">
                        <el-dropdown  @command="handleCommand">
                            <span class="el-dropdown-link">
                                <span class="svg-container specails">
                                    <svg-icon icon-class="etmore1" />
                                </span>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="1">关闭其他标签</el-dropdown-item>
                                <el-dropdown-item command="2">关闭所有标签</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </div>
        </div>
    </div>
  
</template>

<script>
	import {loginquit} from '@/api/getData'
	import {mapActions, mapState} from 'vuex'
  import {getSysUserInfo} from '@/api/getData'
  import {getMenuBtnList} from '@/api/getDatelist'
	import {removeStore,getStore,setStore} from '@/config/mUtils'
	import {baseImgPath} from '@/config/env'

    export default {
        data(){
            return {
                useinfo:'',
                tagsArry: [{name: 'home', text: '首页'}],
                affixTags: [],
                selectedTag:{},
                top: 0,
                left: 0,
                visible: false,
            }
        },
        created(){
            this.getMenuBtnList();
            this.addTags();
            if(this.adminToken&&this.adminInfo.isok){
            }else{
              this.getmangefun();
            }
        },
        computed: {
            ...mapState({
                adminToken: state => state.user.adminToken,
                adminInfo: state => state.user.adminInfo,
                visitedViews: state => state.tagsView.visitedViews,
            }),
        },
        methods: {
            //获取用户基本信息并提交vuex
            async getmangefun(){
                let login_token=getStore('login_token');
                this.$store.dispatch('user/getAdmintoken',login_token);
                let adminInfo={};
                const res = await getSysUserInfo()
                if (res.code == 0) {
                  let useicon=res.data.sysUserInfo.userIcon?res.data.sysUserInfo.userIcon:'http://192.168.2.21/static/img/avator.abbfb12.jpg';
                  setStore('adminInfo',useicon);
                  setStore('managelist',res.data.menus);
                  adminInfo={
                    avator:useicon,
                    userName:res.data.sysUserInfo.userName,
                    isok:true,
                    manage:res.data.menus,
                  }
                }else{
                  // removeStore("login_token");
                  // removeStore("phone");
                  adminInfo={
                    avator:'',
                    userName:'',
                    isok:false,
                    manage:[],
                  }
              }
              this.$store.dispatch('user/getAdminData',adminInfo);
            },
            //获取页面按钮权限
            async getMenuBtnList(command) {
                let lingks=this.$route.path.replace('/', '');
                this.addTags();
                const res = await getMenuBtnList({menu:lingks});
                if(res.code=='0'){
                    this.$emit("menubtn", res.data)
                }
            },
            //是否选中
            isActive(route) {
              this.selectedTag=route;
              return route.path === this.$route.path
            },
            //路由变化添加导航标签到vuex
            addTags() {
              const { name } = this.$route
              if (name) {
                this.$store.dispatch('tagsView/addView', this.$route)
              }
              return false
            },

            moveToCurrentTag() {
              const tags = this.$refs.tag
              // this.$nextTick(() => {
              //   for (const tag of tags) {
              //     if (tag.to.path === this.$route.path) {
              //       //this.$refs.scrollPane.moveToTarget(tag)
              //       // when query is different then update
              //       if (tag.to.fullPath !== this.$route.fullPath) {
              //         this.$store.dispatch('tagsView/updateVisitedView', this.$route)
              //       }
              //       break
              //     }
              //   }
              // })
            },
            //选择并删除相应标签
            handleCommand(command){
              if(command===1){
                this.closeOthersTags();
              }else{
                this.closeAllTags();
              }
            },
            //刷新当前页 暂时没好的策略
            refreshSelectedTag(view) {
              this.$store.dispatch('tagsView/delCachedView', view).then(() => {
                const { fullPath } = view
                console.log(fullPath,view)
                this.$nextTick(() => {
                  this.$router.replace({
                    path: '/bridge',
                    query:{path:encodeURIComponent(fullPath)}
                  })
                })
              })
            },
            //关闭对应标签导航
            closeSelectedTag(view) {
              this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
                if (this.isActive(view)) {
                  this.toLastView(visitedViews, view)
                }
              })
            },
            //关闭其他导航
            closeOthersTags() {
              this.$router.push(this.selectedTag)
              this.$store.dispatch('tagsView/delOthersViews', this.selectedTag).then(() => {
                this.moveToCurrentTag()
              })
            },
            //关闭所有标签导航
            closeAllTags(view) {
              this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
                if (this.affixTags.some(tag => tag.path === view.path)) {
                  return
                }
                this.toLastView(visitedViews, view)
              })
            },
            //路由回归
            toLastView(visitedViews, view) {
              const latestView = visitedViews.slice(-1)[0]
              if (latestView) {
                this.$router.push(latestView)
              } else {
                  this.$router.push('/home')
              }
            },
            //导航标签
            openMenu(tag, e) {
              const menuMinWidth = 105
              const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
              const offsetWidth = this.$el.offsetWidth // container width
              const maxLeft = offsetWidth - menuMinWidth // left boundary
              const left = e.clientX +15 // 15: margin right
              console.log(maxLeft,left,e.clientX,offsetLeft,)
              if (left > maxLeft) {
                this.left = maxLeft
              } else {
                this.left = left
              }
              this.top = e.clientY
              this.visible = true
              this.selectedTag = tag
            },
            closeMenu() {
              this.visible = false
            }
        },
      watch:{
				"$route":"getMenuBtnList",
        visible(value) {
            if (value) {
              document.body.addEventListener('click', this.closeMenu)
            } else {
              document.body.removeEventListener('click', this.closeMenu)
            }
        }
      }
    }
</script>

<style lang="less">
	@import '../style/mixin';
	.headerMain{
		height:100px;
	}
	.header_container{
		background-color: #EFF2F7;
		height: 60px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 20px;
	}
	.avator{
		.wh(36px, 36px);
		border-radius: 50%;
		margin-right: 37px;
	}
	.el-dropdown-menu__item{
        text-align: center;
		}
	.avatorinfo{height:48px;margin:11px 20px 23px 10px;}
	.avatorbox{width:48px;height:48px;
		img{
			width:100%;height:100%;
		}
	}
	.avatorbtn{line-height:48px;height:48px;font-size:12px;margin-left:12px;color:#6c6c6c;
		span{
			cursor: pointer;
			}
	}
	.div-tags {
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow:0 3px 3px 0 #eee;
  }
  .div-icons {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      background: #fff;
      height: 34px;
      width: 100px;
      font-size: 18px;
      .svg-container{
          margin: 0 10px;
          font-size:20px;
          cursor: pointer;
      }
      .specails{
          font-size:24px;
      }
  }
/* 标签栏 */
.ul-c {
    height: 34px;
    margin: 2px 0;
    background: #fff;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 10px;
    overflow: hidden;
    width: calc(~"100% - 100px");
  .tags-view-item {
    display: inline-block;
    position: relative;
    cursor: pointer;
    height: 26px;
    line-height: 26px;
    border: 1px solid #d8dce5;
    color: #495060;
    background: #fff;
    padding: 0 8px;
    font-size: 12px;
    margin-left: 5px;
    margin-top: 4px;
    &:first-of-type {
      margin-left: 15px;
    }
    &:last-of-type {
      margin-right: 15px;
    }
    &.active {
      background-color: #42b983;
      color: #fff;
      border-color: #42b983;
      &::before {
        content: '';
        background: #fff;
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        position: relative;
        margin-right: 2px;
      }
    }
  }
}
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
.active {
    background: #409eff;
    border: 1px solid #409eff;
    a {
        color: #fff;
    }
}
/* 主要内容区域 */
.main-content {
    overflow: auto;
    height: 100%;
    width: 100%;
    background: #eee;
    padding: 10px 12px;
}
.view-c {
    position: relative;
    background: #fff;
    padding: 15px;
}
.pointer {
    cursor: pointer;
}
</style>
