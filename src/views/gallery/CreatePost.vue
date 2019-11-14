<template>
  <article class="postFormArea">
    <section class="imageUpload">
      <el-upload
        class="uploadArea"
        ref="upload"
        :action="uploadHost"
        :data="uploadParam"
        accept="image/jpeg,image/jpg"
        :show-file-list="false"
        :file-list="fileList"
        :before-upload="beforeUpload"
        :on-progress="onProgress"
        :on-success="uploadSuccess"
        :on-error="uploadError"
      >
        <el-button type="info" class="uploadbtn">上传图片</el-button>
      </el-upload>

      <div class="imageShow">
        <div class="progress" v-if="imageProgress.state">
          <el-progress type="circle" color="rgb(19, 206, 102)" :percentage="imageProgress.number"
                       :stroke-width="12"></el-progress>
        </div>
        <div class="image" v-else>
          <img :src="this.imageUrl" alt="">
          <div class="removeImage" v-if="this.imageUrl">
            <i class="el-icon-delete" @click.stop="removeImage"></i>
          </div>
        </div>
      </div>

    </section>

    <section class="tagArea">
      <h3 class="h3Title">选择标签</h3>
      <ul class="tagList" v-if="tagList.length">
        <li v-for="(item,index) in tagList" class="tagItem before" :class="{active:tagActiveIndex===index}"
            @click.stop="tagActive(index)">
          <span>{{item.name}}</span>
        </li>
      </ul>
    </section>

    <section class="content">
      <h3 class="h3Title">图片描述</h3>

      <el-input
        type="textarea"
        :rows="5"
        placeholder="请输入图片描述"
        v-model="content"
      >
      </el-input>

    </section>

    <div class="postCommit">
      <el-button type="success" class="postButton" round @click.stop="postCommit">提交审核</el-button>
    </div>
  </article>
</template>

<script type="text/ecmascript-6">
  import graphqlQuery from '@common/graphql/query.js'
  import gql from 'graphql-tag';

  export default {
    name: 'createPost',
    data() {
      return {
        uploadHost: 'http://tpg-photos.oss-cn-shanghai.aliyuncs.com', //OSS地址
        showFileName: '', //显示的文件名
        uploadFileName: '',//存储到OSS的文件名称
        uploadParam: null, //OSS需要的参数
        imageUrl: '',//图片地址
        fileList: [], //已经上传的图片数组
        imageProgress: {//上传进度
          state: false,
          number: 0,
        },
        tagActiveIndex: -1,//所选的标签
        content: '',//图片描述
        photoId: 0, //图片ID
      }
    },
    props: {},
    methods: {

      //上传之前
      beforeUpload(file) {
        this.showFileName = file.name;
        this.uploadFileName = `${file.uid}${file.name}`;
        this.uploadParam['key'] = this.uploadFileName;
        this.imageProgress.state = true;
      },

      //上传中
      onProgress(event, file, fileList) {
        this.imageProgress.number = Math.floor(event.percent); //设置上传百分比
      },

      //上传成功
      uploadSuccess(response, file, fileList) {
        this.imageProgress = {
          state: false,
          number: 0
        };
        if (response.error) {
          this.$message.error('上传图片失败，请稍候再试');
          return false;
        }
        this.fileList = [file];
        this.imageUrl = response.data.url;
        this.photoId = response.data.id;
      },

      //上传失败
      uploadError(err, file, fileList) {
        this.imageProgress = {
          state: false,
          number: 0
        };
        this.$message.error('上传图片失败，请稍候再试');
      },

      //删除已经上传的图片
      removeImage() {
        this.fileList = [];
        this.imageUrl = '';
        this.photoId = 0;
      },

      //选中标签
      tagActive(index) {
        if (this.tagActiveIndex === index) {
          this.tagActiveIndex = -1;
          return false;
        }
        this.tagActiveIndex = index;
      },

      postCommit() {
        if (!this.photoId) {
          this.$message({
            message: '请上传图片',
            type: 'warning'
          });
          return false;
        }
        if (this.tagActiveIndex < 0) {
          this.$message({
            message: '请选择标签',
            type: 'warning'
          });
          return false;
        }
        if (!this.content) {
          this.$message({
            message: '请输入帖子描述',
            type: 'warning'
          });
          return false;
        }

        this.$apollo.mutate({
            mutation: gql`
              mutation postCreate($tags:[String], $content: String!,$photoList:[ObjectId]) {
                postCreate(tags:$tags,content:$content,photoList:$photoList) {
                  id
                  status
                  content
                  tags
                }
              }
            `,
            variables: {
              tags: [this.tagList[this.tagActiveIndex].name],
              content:this.content,
              photoList: [this.photoId]
            }
          })
          .then(response => {
            this.$alert('请等待管理员审核', '发布成功', {center : true })
              .then(()=>{
                this.$router.push({
                  path : '/'
                });
              });
          })
          .catch(error => {

          });
      },
      //初始化上传参数
      initUploadParam() {
        this.$axios.get({bucket: 'tpg-photos'}, '/oss/get')
          .then((response) => {
            this.uploadParam = {
              'key': '${filename}', //文件名称
              'host' : response.host,
              'policy': response.policy,
              'OSSAccessKeyId': response.accessid,
              'success_action_status': '200', //让服务端返回200,不然，默认会返回204
              'signature': response.signature,
              'callback': response.callback
            };
          })
          .catch(() => {

          });
      },
    },
    computed: {
      tagList (){
        let tags = this.$store.state.categories
          .filter((item)=>{return item.slug != 'all'});
        return tags;
      }
    },
    components: {},
    created() {
    },
    mounted() {
      this.initUploadParam();
    },
  }
</script>
