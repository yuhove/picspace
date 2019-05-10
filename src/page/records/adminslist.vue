<template>
  <div class="fillcontain">
    <head-top @menubtn="getmenubtn"></head-top>
    <div class="table_container">
      <el-row class="topFS">
        <el-button type="primary" @click="dialognewform = true" v-show="iconlist.some(({name})=>name=='添加新管理员')">添加新管理员</el-button>
        <!--<el-button type="success" plain @click="changeList(1)" v-show="stauts!=1">查看有效的管理员</el-button>-->
        <!--<el-button type="success" plain @click="changeList(2)" v-show="stauts!=2">查看所有的管理员</el-button>-->
      </el-row>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          :label="admintitlelist[stauts].admintitle"
          prop="userName">
        </el-table-column>
        <el-table-column
          label="账号"
          prop="account">
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="createDate"
          >
        </el-table-column>
        <el-table-column
          label="身份角色">
          <template slot-scope="scope">
            <span v-if="scope.row.roleName">{{scope.row.roleName}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <!--<el-table-column-->
          <!--label="状态"-->
          <!--prop="StatusName">-->
          <!--<template slot-scope="scope">-->
            <!--<span>{{scope.row.status|statusinfo}}</span>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column
          label="创建人">
          <template slot-scope="scope">
            <span v-if="scope.row.createBy">{{scope.row.createBy}}</span>
            <span v-else>系统创建</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.account!='admin'"
              size="small"
              type="primary"
              plain
              v-show="iconlist.some(({name})=>name=='角色分配')"
              @click="handleDelete(scope.row)">角色分配</el-button>
            <el-button
              v-if="scope.row.account!='admin'"
              size="small"
              type="danger"
              v-show="iconlist.some(({name})=>name=='删除')"
              @click="handleEdit(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="Pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="PageSize"
          layout="total, prev, pager, next"
          :total="count">
        </el-pagination>
      </div>
      <el-dialog title="新加管理员信息" :visible.sync="dialognewform" class="specaildialog" width="30%">
        <el-form :model="loginForm"  ref="loginForm">
          <el-form-item label="管理员账号" label-width="100px" prop="account" :rules="{
      required: true, message: '管理用户名不能为空', trigger: 'blur'}">
            <el-input v-model="loginForm.account" auto-complete="off" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="登录密码" label-width="100px" prop="password" :rules="{
      required: true, message: '所登录密码不能为空', trigger: 'blur'}">
            <el-input v-model="loginForm.password" auto-complete="off" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" label-width="100px" prop="phone" :rules="[{
          required: true, message: '手机号码为空', trigger: 'blur'},
          { pattern: regs.Phone, message: '请输入正确的手机号码', trigger: 'blur'}]">
            <el-input v-model="loginForm.phone" auto-complete="off" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="管理姓名" label-width="100px" prop="userName" :rules="{
      required: true, message: '管理姓名不能为空', trigger: 'blur'}">
            <el-input v-model="loginForm.userName" auto-complete="off" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="管理头像" label-width="100px" style="margin-bottom:5px;">
            <el-upload
              class="avatar-uploader"
              :action="url"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="loginForm.userIcon" :src="loginForm.userIcon" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialognewform = false">取 消</el-button>
          <el-button type="primary" @click="addSysUser('loginForm')">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="管理员角色信息" :visible.sync="dialogFormVisible" class="specaildialog" width="30%">
        <el-form :model="loginForm"  ref="loginForm">
          <el-form-item label="管理员名称" label-width="100px">
            <el-input v-model="rowinfo.userName" auto-complete="off" readonly></el-input>
          </el-form-item>
          <el-form-item label="身份角色" label-width="100px">
            <el-select v-model="rowinfo.roleId" filterable placeholder="请选择">
              <el-option
                v-for="item in rolelists"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="RoleUpdate()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
    // export default {
    //     name: "adminlist"
    // }

    import headTop from '@/components/headTop'
    import {baseUrl} from '@/config/env'
    import regs from '@/config/regExp'
    import {setStore,getStore} from '@/config/mUtils';
    import {getSysUserList,addSysUser} from '@/api/getData'
    import {roleList,userAuth,delSysUser} from '@/api/getDatelist'
    export default {
      name: 'adminslist',
      data(){
        return {
          baseUrl,
          regs,
          iconlist:[],
          loading:true,
          url:baseUrl+'/file/upFile',
          useId:getStore('login_token'),
          stauts:2,
          currentPage:1,
          PageSize: 20,
          count: 40,
          tableData: [],
          StaffID:'',
          admintitlelist:[
            {admintitle:""},
            {admintitle:"有效的管理员"},
            {admintitle:"管理员名称"},
          ],
          rolelists:[],
          currentPage: 1,
          rowinfo:{},
          roleid:'',
          dialogFormVisible: false,
          dialognewform:false,
          categoryOptions: {},
          selectedCategory: [],
          loginForm: {
            account: '',
            password:'',
            phone: '',
            userIcon: '',
            userName: '',
            userId:'',
          },

        }
      },
      components: {
          headTop,
      },
      created(){
        this.restaurant_id = this.$route.query.restaurant_id;
        this.getSysUserList();
        this.RoleList();
      },
      methods:{
        getmenubtn(data){
          this.iconlist=data;
        },
        //获取角色列表
        async RoleList(){
          let json={
            page:1,
            pageSize:1000,
          }
          const res = await roleList(json);
          if(res.code==0){
            if(this.tableData==''){
              this.$message({
                type: 'success',
                message: '获取身份角色列表成功'
              });
            }
            this.rolelists=[];
            this.rolelists.push({
              value:0,
              label:'--',
            })
            res.data.roles.forEach(item=>{
              let list={};
              list.value=item.id;
              list.label=item.roleName;
              this.rolelists.push(list)
            });

            console.log(this.rolelists)
          }
        },
        //图片上传后赋值
        handleAvatarSuccess(res, file) {
          //this.imageUrl = URL.createObjectURL(file.raw);

          this.loginForm.userIcon=res.data.imgUrl;
        },
        handleEdit(item){
          const h = this.$createElement;
          this.$msgbox({
            title: '提示',
            message: h('p', { style: 'padding: 10px;font-size:15px;' }, [
              h('span', null, '此操作将删除管理员 '),
              h('i', { style: 'color: #409EFF' }, item.userName),
              h('span', null, '，请谨慎操作 '),
            ]),
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(action => {
            this.delSysUser(item.id)
          }).catch(() => {

          });
        },
        //
        async delSysUser(id){
          const res = await delSysUser({userId:id});
          if(res.code==0){
              this.$message({
                type: 'success',
                message: '删除管理员成功'
              });
            this.getSysUserList();
          }
        },
        //上传前过滤上传图片格式
        beforeAvatarUpload(file) {
          let testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
          let extension=false;
          if(testmsg.toUpperCase()==='JPG'||testmsg.toUpperCase()==='PNG'||testmsg.toUpperCase()==='JPEG'){
            extension=true;
          }
          const isLt2M = file.size / 1024  < 1000
          if(!extension) {
            this.$message({
              message: '上传文件只能是 jpg、png、jpeg格式!',
              type: 'warning'
            });
            return false;
          }
          if(!isLt2M) {
            this.$message({
              message: '上传图片大小不能超过 1000kB!',
              type: 'warning'
            });
            return false;
          }
          return extension && isLt2M
        },
        //获取管理员列表
        async getSysUserList(){
          let form={
            currentPage: this.currentPage,
            pageSize: this.PageSize,
            userId:this.useId,
          }
          const res = await getSysUserList(form);
          if(res.code==0){
            if(this.tableData==''){
              this.$message({
                type: 'success',
                message: '管理员列表获取成功'
              });
            }
            this.count=res.data.count;
            this.tableData=res.data.sysUserList;
            this.loading=false;
          }
        },
        //新增管理员角色（编辑操作用到）
        addSysUser(formName) {
          this.$refs[formName].validate( async (valid) => {
            if (valid) {
              this.loginForm.userId = this.useId;
              const res = await addSysUser(this.loginForm);
              if (res.code == "000000") {
                this.$message({
                  type: 'success',
                  message:'添加管理员成功'
                });
                this.getSysUserList();
                this.dialognewform = false;
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                });
              }
            } else {
              console.log('error submit!!');
              return false;
            }
          })
        },
        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
          this.currentPage = val;
          this.PageIndex = val;
          this.getSysUserList()
        },
        handleDelete(row){
          this.rowinfo=row;
          console.log(this.rowinfo)
          this.dialogFormVisible=true;
        },
        RoleUpdate(){
          this.$confirm('此操作将修改管理员权限, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            let json={
              roleId:this.rowinfo.roleId,
              userId:this.rowinfo.id
            }
            const res = await userAuth(json);
            if(res.code==0){
              this.$message({
                type: 'success',
                message: '修改角色权限成功',
              });
              this.getSysUserList();
              this.dialogFormVisible=false;
            }
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
      },
      filters:{
        statusinfo: function (value) {
          if (!value&&value!=0) return ''
          let status=["正常","冻结"];
          return status[value];
        },
      },
    }
</script>

<style lang="less" scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .table_container{
    padding: 20px;
  }
  .Pagination{
    display: flex;
    justify-content: flex-start;
    margin-top: 8px;
  }
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
</style>
