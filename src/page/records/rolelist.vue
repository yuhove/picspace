<template>
  <div class="fillcontain">
    <head-top @menubtn="getmenubtn"></head-top>
    <div class="table_container">
      <el-row class="topFS">
        <el-button type="primary" @click="dialogtype = true" icon=" el-icon-plus" v-show="iconlist.some(({name})=>name=='添加新角色')">添加新角色</el-button>
      </el-row>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="角色名称"
          prop="roleName">
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="createDate"
         >
        </el-table-column>
        <el-table-column
          label="创建者"
          prop="createBy">
        </el-table-column>
        <el-table-column label="操作" width="350">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              v-show="iconlist.some(({name})=>name=='页面权限')"
              @click="handlemenu(scope.row)">页面权限</el-button>
            <el-button
              size="small"
              type="success" plain
              v-show="iconlist.some(({name})=>name=='操作权限')"
              @click="getRoleBtnAuthList(scope.row.id)">操作权限</el-button>
            <el-button
              size="small"
              type="primary"
              plain
              v-show="iconlist.some(({name})=>name=='修改')"
              @click="handleEdit(scope.row)">修改</el-button>
            <el-button
              size="small"
              type="danger"
              plain
              v-show="iconlist.some(({name})=>name=='删除')"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin: 20px 0;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10, 15, 20, 30]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="count">
        </el-pagination>

      </div>

      <el-dialog title="修改角色信息" :visible.sync="dialogFormVisible" class="specaildialog" width="30%">
        <el-form>
          <el-form-item label="角色名称" label-width="100px">
            <el-input v-model="rowinfo.roleName" auto-complete="off" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="创建者" label-width="100px">
            <el-input v-model="rowinfo.createBy" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="创建时间" label-width="100px">
            <el-input v-model="rowinfo.createDate" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="RoleUpdate">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="新增角色信息" :visible.sync="dialogtype" class="specaildialog" width="30%">
        <el-form >
          <el-form-item label="角色名称" label-width="100px">
            <el-input v-model="formdata.roleName" auto-complete="off" maxlength="20"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogtype = false">取 消</el-button>
          <el-button type="primary" @click="RoleNew">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="角色权限控制" :visible.sync="dialogtransfer" class="specaildialog" width="50%">
        <el-alert
          style="margin-top: -20px;"
          title="通过勾选支持转移，功能模块位于右侧代表该角色将可以看见操作该模块功能，位于左测将屏蔽该模块的目录"
          type="warning"
          show-icon>
        </el-alert>
        <div style="text-align: center;margin-top:20px;">
          <el-transfer
            style="text-align: left; display: inline-block;height:410px;"
            v-model="menu"
            filterable
            :left-default-checked="[2, 3]"
            :right-default-checked="[1]"
            :titles="['未授权列表', '开放权限列表']"
            :button-texts="['到左边', '到右边']"
            :format="{
              noChecked: '${total}',
              hasChecked: '${checked}/${total}'
            }"
            @change="handleChange"
            :data="menulist">
            <span slot-scope="{ option }">{{ option.key }} - {{ option.label }}</span>
            <!--<el-button class="transfer-footer" slot="left-footer" size="small">操作</el-button>-->
            <!--<el-button class="transfer-footer" slot="right-footer" size="small">操作</el-button>-->
          </el-transfer>
        </div>
        <div style="text-align: center;margin-top:20px;">
          <el-button type="primary" @click="postmenulist()">确 认</el-button>
        </div>
      </el-dialog>
      <el-dialog title="操作权限选择" :visible.sync="dialognewform" class="specaildialog" width="60%">
        <div class="goodtree">
          <el-tree
            :data="areabox"
            show-checkbox
            node-key="id"
            ref="tree"
            accordion
            :default-expand-all="false"
            :default-expanded-keys="noarrey"
            :filter-node-method="filterNode"
            @check="handleNodeClick">
          </el-tree>

        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialognewform=false">取 消</el-button>
          <el-button type="primary" @click="roleBtnAuth">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
    import headTop from '@/components/headTop'
    import {baseUrl} from '@/config/env'
    import {roleList, deleteRole, addOrEditRole,menuList,roleAuth,getRoleAuthList,getRoleBtnAuthList,roleBtnAuth} from '@/api/getDatelist'
    export default {
      name: 'rolelist',
      data(){
        return {
          baseUrl,
          iconlist:[],
          loading:true,
          stauts:2,
          LoginId:'',
          count:0,
          pageSize:20,
          page:1,
          tableData: [],
          RoleID:'',
          dialogFormVisible: false,
          dialogtransfer:false,
          dialognewform:false,
          noarrey:[],
          checkedkey:[],
          areabox:[],
          nowauths:[],
          menu:[],
          menulist:[],
          formdata:{
            roleId:0,
            roleName:'',
          },
          rowinfo:{},
          renderFunc(h, option) {
            return <span>{ option.key } - { option.label }</span>;
          },
          categoryOptions: [],
          dialogtype:false,
          dialogoptions:'',
        }
      },
      components: {
          headTop,
      },
      created(){
        this.RoleList();
      },
      methods:{
        getmenubtn(data){
          this.iconlist=data;
        },
        handleChange(value, direction, movedKeys) {
          console.log(value, direction, movedKeys);
        },
        handleSizeChange(val) {
          this.pageSize=val;
          this.RoleList();
        },
        handleCurrentChange(val) {
          this.page=val;
          this.RoleList();
        },
        //获取角色列表
        async RoleList(){
          let json={
            page:this.page,
            pageSize:this.pageSize,
          }
          this.loading=true;
          const res = await roleList(json);
          if(res.code==0){
            if(this.tableData==''){
              this.$message({
                type: 'success',
                message: '获取身份角色列表成功'
              });
            }
            this.count=res.data.count;
            this.tableData=res.data.roles;
            this.loading=false;
          }
        },
        //修改角色信息（编辑操作用到）
        async RoleUpdate(){
          if(!this.rowinfo.roleName){
            this.$notify({
              title: '失败',
              message: '抱歉，请输入管理员角色名',
              type: 'warning'
            });
            return false
          }
            let json={
              roleId:this.rowinfo.id,
              roleName:this.rowinfo.roleName,
            }
            const res = await addOrEditRole(json);
            if(res.code==0){
              this.$message({
                type: 'success',
                message: '管理员角色更新成功'
              });
              this.RoleList();
              this.dialogFormVisible=false;
            }
        },
        //新增角色（编辑操作用到）
        async RoleNew(){
          if(!this.formdata.roleName){
            this.$notify({
              title: '失败',
              message: '抱歉，请输入管理员角色名',
              type: 'warning'
            });
            return false
          }
          const res = await addOrEditRole(this.formdata);
          if(res.code==0){
            this.$message({
              type: 'success',
              message: '管理员角色添加成功'
            });
            this.RoleList();
            this.dialogtype=false;
          }
        },
        //删除角色
        handleDelete(row){
          this.$confirm('此操作将删除该角色名字, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            const res = await deleteRole({roleId:row.id});
            if(res.code==0){
              this.$message({
                type: 'success',
                message: '删除管理员'+row.roleName+'成功',
              });
              this.RoleList();
            }
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        //编辑角色
        handleEdit(row) {
          this.rowinfo=Object.assign({},row);
          console.log(this.rowinfo);
          this.dialogFormVisible=true;
        },
        //获取权限模块列表
        async handlemenu(row){
          this.rowinfo=Object.assign({},row);
          this.getRoleAuthList();
          const res = await menuList();
          if(res.code==0){
            if(this.tableData==''){
              this.$message({
                type: 'success',
                message: '获取权限模块列表'
              });
            }
            this.menulist=[];
            res.data.forEach(item=>{
              let datalist={};
              datalist.label=item.name;
              datalist.key=item.id;
              this.menulist.push(datalist);
            })
            this.dialogtransfer=true;
          }
        },
        //获取权限模块列表
        async getRoleAuthList(){
          const res = await getRoleAuthList({roleId:this.rowinfo.id});
          if(res.code==0){

            this.menu=res.data;
          }
        },
        postmenulist(){
          this.$confirm('此操作将修改绑定该角色的所有管理员权限, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            let json={
              roleId:this.rowinfo.id,
              auths:this.menu.join(',')
            }
            const res = await roleAuth(json);
            if(res.code==0){
              this.$message({
                type: 'success',
                message: '修改角色权限成功',
              });
              this.RoleList();
              this.dialogtransfer=false;
            }
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消编辑'
            });
          });
        },
        //获取角色页面操作按钮列表
        async getRoleBtnAuthList(id){
          this.loading=true;
          this.RoleID=id;
          const res = await getRoleBtnAuthList({roleId:id});
          this.loading=false;
          if(res.code==0){
            if(this.tableData==''){
              this.$message({
                type: 'success',
                message: '获取身份角色列表成功'
              });
            }
            this.dialognewform=true;
            this.nowauths=res.data.auths;
            this.areabox=[];
           res.data.menu.forEach(item=>{
             let json={};
             json.url=item.url;
             json.id=item.id;
             json.label=item.name;
             json.children=[];
             item.childMenus.forEach(list=>{
               let data={};
               data.id=list.id;
               data.label=list.name;
               json.children.push(data);
             })
            this.areabox.push(json);
           });
           let _this=this;
            setTimeout(function(){
              _this.$refs.tree.setCheckedKeys(_this.nowauths);
             // let treenodes=this.$refs.tree.store;
              // for(var i=0;i<treenodes._getAllNodes().length;i++){
              //   treenodes._getAllNodes()[i].expanded=false;
              // }
            },200)
          }
        },
        //过滤刷选省市
        filterNode(value, data) {
          if (!value) return true;
          return data.label.indexOf(value) !== -1;
        },
        //点击权限按钮选择
        handleNodeClick( checkedNodes,checkedKeys,halfCheckedNodes,halfCheckedKeys){
          this.checkedkey=[];
          checkedKeys.checkedNodes.forEach(item=>{
            if(!item.url){
              this.checkedkey.push(item.id);
            }
          })
          console.log(this.checkedkey)
        },
        //获取角色页面操作按钮列表
        async roleBtnAuth(){
          let json={
            auths:this.checkedkey.join(','),
            roleId:this.RoleID
          }
          this.loading=true;
          const res = await roleBtnAuth(json);
          this.loading=false;
          if(res.code==0){
            if(this.tableData==''){
              this.$message({
                type: 'success',
                message: '获取身份角色列表成功'
              });
            }
            this.dialognewform=false;
            this.checkedkey=[];
          }
        },
      },
      watch: {
        filterText(val) {
          this.$refs.tree.filter(val);
          if(!val){
            let treenodes=this.$refs.tree.store;
            for(var i=0;i<treenodes._getAllNodes().length;i++){
              treenodes._getAllNodes()[i].expanded=false;
            }
          }

        },
      },
    }
</script>

<style lang="less">
  .el-transfer-panel__list.is-filterable {
    height: 294px;
    padding-top: 0;
  }
  .el-transfer-panel__body {
    height: 346px;
    padding-bottom: 10px;
  }
</style>
<style lang="less">
  .goodtree .el-tree{float:left;}
  .goodtree  .el-tree:after{content:'';clear: both;}
  .goodtree .el-tree > .el-tree-node{float:left;margin-right: 15px;position: relative;width:100px;}

  .goodtree  .el-tree-node:last-child{content:'';clear: both;}
  .goodtree .el-tree__drop-indicator{clear: both;}
  .goodtree  .el-tree-node__children{position: absolute;background: #fff!important;z-index:5;box-shadow:0 1px 2px 1px #ccc;width:170px;}
  .avatar-3d{width:100px;height:100px;overflow: hidden;}
  .avatar-3d .el-upload{width:98px;height:98px;line-height:98px;font-size:28px;color:#8c939d;border:1px dashed #c0ccda;border-radius:6px;}
  .avatar-3d img{width:100%;}
</style>
