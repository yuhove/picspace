<template>
  <div class="contentbox">
    <head-top></head-top>
    <div class="table_container flexbox">
      <el-card class="treebox">
        <el-tree
          :data="data"
          :props="defaultProps"
          ref="tree"
          accordion
          @node-click="handleNodeClick">
        </el-tree>
        <div class="emptybox imgpositin" v-if="data.length<1">
          <img src="../../assets/empty.png" alt="">
          <!--<span>抱歉，暂无数据</span>-->
        </div>
      </el-card>
      <div class="classifybox">
        <div>
          <el-button type="primary" @click="dialognewform=true" v-show="JSON.stringify(checkinfo) != '{}'">新增页面按钮</el-button>
        </div>
        <div class="classify-name">
          <em>分类名称：</em>
          <div class="cleft" >
            <el-input v-model.trim="checkinfo.label" placeholder="请输入内容" :disabled="true"></el-input>
          </div>
          <el-button  v-show="checkinfo.label" type="primary" @click="changedialog">修改</el-button>
        </div>
        <el-table
          border
          :data="tableData"
          style="width: 100%">
          <el-table-column
            label="按钮id"
            width="100"
            prop="id"
            align="center">
            <template slot-scope="scope">
              {{scope.$index+1}}
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            align="center"
            label="按钮名称">
          </el-table-column>
          <el-table-column
            prop="createBy"
            label="创建者">
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <!--<el-button-->
              <!--size="small"-->
              <!--type="primary"-->
              <!--@click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
              <el-button
                size="small"
                type="primary"
                @click="handlechange(scope.$index, scope.row)">修改</el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px;color: darkred;">
          请非技术人员不要操作该页面
        </div>
      </div>
      <el-dialog :title="title[type]" :visible.sync="dialognewform" class="specaildialog" :before-close="changetype" width="30%">
        <el-form :model="categoryOptions">
          <el-form-item label="按钮名称：" label-width="100px">
            <el-input v-model.trim="categoryOptions.name" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closechangetype">取 消</el-button>
          <el-button type="primary" @click="StaffNew()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import headTop from '@/components/headTop'
  import { baseUrl,baseImgPath} from '@/config/env'
  import {mapActions, mapState} from 'vuex'
  import {addProductCatalog,deleteProductCatalog,updateProductCatalog,getAllCatalog,upImg,addMenu,getAuthMenuList,addBtn} from '@/api/getDatelist'

  export default {
    name: 'iconlist',
    data() {
      return {
        categoryOptions:{
          parentId:'0',
          name:'',
          url:'',
        },
        url:baseUrl+'/file/upFile',
        dialognewform:false,
        title:['新增分类','修改分类信息'],
        type:0,
        tableData: [],
        protree: [],
        checkinfo:{},
        changecate:'',
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    components: {
      headTop,
    },
    computed: {
      ...mapState(['admin_token','adminInfo']),
    },
    mounted(){
      this.getAuthMenuList();
      // this.data = this.proJSON(this.adminInfo.manage, 0);
      // console.log(this.data)
    },
    methods: {
      //新增类目
      async getAuthMenuList(){
        const res = await getAuthMenuList();
        if(res.code==0){
          this.protree= res.data;
          this.data=[];
          res.data.forEach(item=>{
            let json={};
            json.url=item.url;
            json.label=item.name+'-- ('+item.url+')';
            json.value=item.id;
            //json.children=item.childMenus;
            this.data.push(json)
          })
          //this.$refs.tree.setCheckedKeys([this.changecate]);
          console.log(this.data)
          // location.reload();
        }

      },
      //获取目录
      getAllCatalog(){
        console.log()
        this.protree=this.adminInfo.manage;
        this.data = this.proJSON(this.adminInfo.manage, 0);
      },
      //目录递归函数
      proJSON(oldArr, pid) {
        let newArr = [];
        var self = this;
        oldArr.map(function(item) {
          if(item.pid == pid) {
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
      //确认类目提交
      StaffNew(){
        if(!this.categoryOptions.name){
          this.$notify({
            title: '失败',
            message: '抱歉，请先填写页面名称',
            type: 'error'
          });
          return false;
        }
        if(this.categoryOptions.name.length>8){
          this.$notify({
            title: '失败',
            message: '抱歉，页面名称最多只能包含8个字',
            type: 'error'
          });
          return false;
        }
        if(this.type==1){
          this.updateProductCatalog();
        }else{
          this.addMenu();
        }
      },
      //新增类目
      async addMenu(){
        if(this.checkinfo.value){
          this.categoryOptions.parentId=this.checkinfo.value;
        }else{
        }
        const res = await addBtn(this.categoryOptions);
        if(res.code==0){
          this.$message({
            type: 'success',
            message:'页面按钮添加成功'
          });
          this.getAuthMenuList();
          this.dialognewform=false;
          this.type=0;
          this.categoryOptions.name='';
          this.categoryOptions.parentId='';
        }

      },
      //修改类目
      async updateProductCatalog(){
        let form=this.categoryOptions;
        form.id=this.changecate;
        const res = await updateProductCatalog(form);
        if(res.code==0){
          this.protree.forEach(item =>{
            if(item.id==this.categoryOptions.id){
              item.name=this.categoryOptions.name;
              item.url=this.categoryOptions.url;
            }
          })
          this.tableData=this.proJSON(this.protree,this.checkinfo.value)
          this.data=this.proJSON(this.protree,0);
          this.changecate=this.checkinfo.value;
          this.dialognewform=false;
          this.type=0;
          this.categoryOptions.name='';
          this.categoryOptions.url='';
        }

      },
      //删除类目
      deleteProductCatalog(){
        this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const res = await deleteProductCatalog({id:this.checkinfo.value});
          if(res.code==0){
            this.$message({
              type: 'success',
              message: '您成功删除了该分类'
            });
            this.getAllCatalog();
            this.checkinfo=[];
          }

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //弹窗关闭前切换前函数
      changetype(done){
        this.type=0;
        done();
      },
      closechangetype(){
        this.dialognewform=false;
        this.type=0;
      },

      handlechange(index,row){
        this.type=1;
        this.changecate=row.value;
        this.categoryOptions.parentId=row.pid;
        this.categoryOptions.name=row.label;
        this.categoryOptions.url=row.url;
        this.dialognewform=true;
      },
      //删除table的目录
      handleDelete(index,row){
        this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const res = await deleteProductCatalog({id:row.value});
          if(res.code==0){
            this.$message({
              type: 'success',
              message: '您成功删除了该分类'
            });
            this.getAllCatalog();
            this.tableData.splice(index,1)
            this.checkinfo=[];
          }

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //修改目录
      changedialog(){
        this.type=1;
        this.categoryOptions.parentId=this.checkinfo.pid;
        this.categoryOptions.name=this.checkinfo.label;
        this.categoryOptions.classifyId=this.checkinfo.pid;
        this.categoryOptions.url=this.checkinfo.url;
        this.dialognewform=true;
      },
      handleNodeClick(data) {
        this.checkinfo=data;
        console.log(this.checkinfo)
        this.changecate=data.value;
        this.protree.forEach(item=>{
          if(item.id==data.value){
            this.tableData=item.childMenus;
          }
        })
        console.log(this.tableData)
      }
    },
    watch: {
      adminInfo: function (newValue, oldVal) {
        this.getAllCatalog()
      },
    }
  }
</script>

<style lang="less">
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 20px;
    color: #8c939d;
    width: 98px;
    height: 98px;
    line-height: 98px;
    text-align: center;
  }
  .avatar {
    width: 98px;
    height: 98px;
    display: block;
  }
  .contentbox{height:100%;display: flex;flex-direction:column;}
  .flexbox{display: flex;flex:1;position: relative;}
  .contentbox .treebox{width:250px;margin-right: 20px;height:100%;overflow-y: scroll;}
  .classifybox{flex: 1;}
  .el-tree{height:100%;
    .is-current >.el-tree-node__content{background:#48576a!important;color:#fff;}
  }
  .classify-name{margin:20px 0;overflow: hidden;
    em{float:left;line-height:38px;font-style: normal;}
    .cleft{width:200px;float:left;margin-right: 20px;
    }
  }
  .imgpositin{width:100%;position: absolute;top:100px;left:0;width:200px;
    img{display: block;height:80px;margin:10px auto;}
    span{font-size:14px;display: block;text-align: center;color:#666;}
  }
</style>
