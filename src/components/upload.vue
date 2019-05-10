<template>
  <div class="skupiccontent">
    <draggable class="skupicbox" :class="{propicbox:boxcontent}" v-model="imgurllist" v-if="imgurllist.length>0" @end="changelist">
      <li v-for="(item,index) in imgurllist">
        <img :src="item" alt="">
        <label class="skupic-checkicon">
          <i class="el-icon-check"></i>
        </label>
        <span  class="skupic-deleteicon">
                        <i class="el-icon-delete" @click="removeskuimgfun(index)"></i>
                      </span>
      </li>
    </draggable>
    <el-upload class="uploadDemosku"
               :class="{bigupload:boxcontent}"
               ref="uploads"
               v-show="imgurllist.length < imglength"
               multiple
               :limit="imglength"
               :on-exceed="handleExceed"
               :action="url"
               :show-file-list="false"
               :file-list="fileList"
               :on-progress="handlePictureCardPreview"
               :beforeUpload="beforeAvatarUpload"
               :on-success="fileimg">

      <!--<em>点击</em>-->
      <el-progress v-if="videoFlag == true" type="circle" :percentage="videoUploadPercent" :width='progresswidth'></el-progress>
      <i class="el-icon-upload" v-else></i>
      <!--<el-button size="mini" type="primary">点击上传</el-button>-->
    </el-upload>
  </div>
</template>

<script>
  import {baseUrl} from '@/config/env'
  import draggable from 'vuedraggable';
  export default {
    name: "upload",
    props:['sendname','boxcontent','imglength'],
    data () {
      return {
        videoFlag:false,
        videoUploadPercent:0,
        imgurllist:(typeof this.sendname == "string")?(this.sendname!='')?(this.sendname.split(',')):[]:this.sendname,
        fileList:[],
        url:baseUrl+'/file/upFile',
      }
    },
    components: {
      draggable,
    },
    computed: {
      nowmax:function(){
        let lengths=this.imglength;
        let havelength=this.sendname.length;
        let limitlength=lengths-havelength>0?lengths-havelength:1;
        return limitlength;
      },
      progresswidth:function(){
        let widths=120;
        if(this.boxcontent){

        }else{
          widths=60;
        }
        return widths;
      }
    },
    mounted(){
      this.changefielist();
    },
    methods: {
      changefielist(){
        this.imgurllist=(typeof this.sendname == "string")?(this.sendname!='')?(this.sendname.split(',')):[]:this.sendname;
        let _this=this;
        setTimeout(function(){
          _this.imgurllist.forEach((item,index)=>{
            let lists={
              name:'pic'+index+'.jpeg',
              url:item,
            }
            _this.$refs.uploads.$children[0].fileList.push(lists);
          })
        },1000)
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
        //return extension || extension2
      },
      //图上传
      fileimg(response, file, fileList)	{
        this.videoFlag = false;
        this.videoUploadPercent = 0;
        //this.imgurllist.push( response.data.imgUrl);
        this.imgurllist=[]
        this.$refs.uploads.uploadFiles.forEach(item=>{
          if(item.status=="success"){
            this.imgurllist.push(item.response.data.imgUrl)
          }else{
            this.imgurllist.push(item.url)
          }
        })
        console.log(this.$refs.uploads.uploadFiles)
        this.$emit('showimglist',this.imgurllist)
      },
      //图片删除
      removeskuimgfun(index){
        let filelist=this.$refs.uploads.$children[0].fileList;
        filelist.splice(index,1);
        this.imgurllist.splice(index,1);
        console.log(filelist)
        this.$emit('showimglist',this.imgurllist)
      },
      //进度方法
      handlePictureCardPreview(event, file, fileList) {
        this.videoFlag = true;
        this.videoUploadPercent = (file.percentage.toFixed(0))*1;
      },
      changelist(){
        let newfilelist=[];
        this.imgurllist.forEach((item,index)=>{
          let json={
            name:'pic'+index+'.jpg',
            url:item,
          }
          newfilelist.push(json);
        })
        this.$refs.uploads.uploadFiles=newfilelist;
        this.$emit('showimglist',this.imgurllist)
      },
      //超出上限警报
      handleExceed(files, fileList) {
        console.log(this.imglength,fileList)
        this.$notify({
          title: '警告',
          message: `当前限制选择 ${this.imglength} 张图片，本次选择了 ${files.length} 张图片，共选择了 ${files.length*1 + this.imgurllist.length*1} 张图片`,
          type: 'warning'
        });
      },
    },
    watch: {
      sendname(oldval,newval) {
        this.imgurllist=(typeof this.sendname == "string")?(this.sendname!='')?(this.sendname.split(',')):[]:this.sendname;
      },
    },
  }
</script>

<style lang="less" scoped>
  .skupicbox{margin:0;display: inline-block;vertical-align:top;list-style: none;
    li{width:60px;height:60px;line-height:68px;position: relative;border: 1px solid #c0ccda;overflow: hidden;background-color: #fff;border-radius:3px;box-sizing: border-box;margin: 0 8px 8px 0;cursor: pointer;display: inline-block;
      img{width:100%;}
      .skupic-checkicon{    position: absolute;
        right: -15px;
        top: -6px;
        width: 40px;
        height: 24px;
        background: #13ce66;
        text-align: center;
        transform: rotate(45deg);
        box-shadow: 0 0 1pc 1px rgba(0,0,0,.2);
        color:#fff;
      }
      .el-icon-check {
        position: absolute;
        bottom:2px;left:12px;
        font-size: 12px;
        margin-top: -11px;
        transform: rotate(-45deg) scale(.8);
      }
      .skupic-deleteicon{    position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        cursor: default;
        text-align: center;
        color: #fff;
        opacity: 0;
        cursor: pointer;
        font-size: 20px;
        line-height:60px;
        background-color: rgba(0,0,0,.5);
        transition: opacity .3s;}
      .el-icon-delete{

      }
    }
    .item .el-form-item{margin-bottom:0;}
    .box-card{margin-bottom: 20px;}
    li:hover{
      .skupic-checkicon{opacity: 0;}
      .skupic-deleteicon{opacity: 1;}
    }
  }
  .propicbox{
    li{width:120px;height:120px;line-height:120px;
      .skupic-checkicon{
        width: 40px;
        height: 24px;
      }
      .skupic-deleteicon{
        font-size: 30px;
        line-height:118px;
      }
    }
  }
  .masterMap .el-upload--picture-card{width:100px;height:100px;line-height:110px;}

  .masterMap .el-upload-list--picture-card .el-upload-list__item{width:100px!important;height:100px!important;line-height:110px;}
</style>
<style lang="less">
  .uploadDemosku{display: inline-block;}
  .uploadDemosku .el-upload{width:60px;height:60px;line-height:60px;color: #8c939d; font-size:20px;   background-color: #fbfdff;
    border: 1px dashed #c0ccda;border-radius:3px;box-sizing: border-box;
    .el-icon-upload{}
  }
  .bigupload  .el-upload{width:120px;height:120px;line-height:120px;
    .el-icon-upload{font-size:30px;}
  }
</style>
