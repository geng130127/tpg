<template>
  <div class="postDetailArea">
    <i class="el-icon-close" @click.stop="close"></i>
    <main class="leftContainer" v-loading="postState.loading" element-loading-background="rgba(0, 0, 0, 0.3)">
      <div v-if="post" class="postLike" @click.stop="postlikedEvent">
        <div class="iconZan before">
          <svg-icon icon-class="zan" :style="{color:(post.viewerLiked?'red':'')}"></svg-icon>
        </div>
        <span class="likes">{{post.likes > 0 ? post.likes : '赞'}}</span>
      </div>
      <section v-if="post" class="imageViewMain" :style="{'opacity':postState.opacity}">
        <div class="arrow left before" @click.stop="pageUp">
          <i class="el-icon-arrow-left"></i>
        </div>
        <div class="arrow right before" @click.stop="pageDown">
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="imageBox">
          <img v-if="photoList.length>0 && !postState.loading" :src="photoList[0].url" alt="">
        </div>
      </section>
    </main>
    <aside class="rightContainer" v-if="post">
      <section class="postInfo">
        <div class="postUser">
          <router-link class="avatar" :to="{name:'user', params:post.author}">
            <img :src="post.author.avatar" alt="">
          </router-link>
          <div class="name">
            <router-link :to="{name:'user', params:post.author}">{{post.author.name}}</router-link>
            <relative-time :datetime="post.createdAt"></relative-time>
          </div>
        </div>
        <p class="content">
          {{post.content}}
        </p>
      </section>
      <section class="review">
        <h3>专业点评</h3>

        <ul class="reviewList">
          <li class="mainReview" v-for="(item,index) in reviewList" :key="index">
            <div class="siteIcon">
              <img :src="item.author.avatar" alt="">
            </div>
            <div>
              <router-link class="siteName" :to="{name:'user', params:item.author}">{{item.author.name}}</router-link>
              <relative-time :datetime="item.createdAt"></relative-time>
            </div>
            <div class="reviewContent">
              <p>{{item.content}}</p>
              <el-rate
                v-model="item.score"
                disabled>
              </el-rate>
              <div class="reviewFoot">
                <el-button v-if="item.viewerCanDelete" type="text" @click="deleteReview(item.id,index)">删除</el-button>
              </div>
            </div>
          </li>
        </ul>

        <el-button v-if="post.viewerCanReview" size="small" type="primary" @click.stop="dialogVisible=true">点评
        </el-button>
        <div style="margin-top: 10px" v-if="viewer.role==='administrator' && post.pendingCategories">
          <el-button size="small" @click.stop="secondInstance('accept')" type="success">通过</el-button>
          <el-button size="small" @click.stop="secondInstance('reject')" type="danger">拒绝</el-button>
        </div>
      </section>
      <section class="commentForm" ref="commentTextArea">
        <h3 v-if="post">{{post.comments}}条评论</h3>
        <el-input
          type="textarea"
          :rows="3"
          v-model="commentForm.content"
        >
        </el-input>
        <el-button type="primary" size="small" :disabled="commentForm.content?false:true" @click.stop="commentSubmit"
                   :loading="commentForm.buttonLoading">
          {{commentForm.buttonText}}
        </el-button>

        <ul class="commentList">
          <li class="mainComment" v-for="(item,index) in commentList" :key="index">
            <div>
              <router-link class="siteName" :to="{name:'user', params:item.author}">{{item.author.name}}</router-link>
              <relative-time :datetime="item.createdAt"></relative-time>
            </div>
            <div class="commentContent">
              <p>{{item.content}}</p>

              <div class="commentFoot">
                <el-button type="text" @click.stop="commentReply(item.author.name)">回复</el-button>
                <el-button v-if="item.viewerCanDelete" type="text" @click="deleteComment(item.id,index)">删除</el-button>
              </div>
            </div>
          </li>
        </ul>
      </section>
    </aside>

    <el-dialog
      title="点评"
      :visible.sync="dialogVisible"
      width="30%"
      append-to-body
      custom-class="post-review-dialog">
      <el-form :model="reviewFrom" label-width="80px">
        <el-form-item label="点评内容" prop="content">
          <el-input v-model="reviewFrom.content" type="textarea" :rows="5"></el-input>
        </el-form-item>
        <el-form-item label="点评分数" size="mini" prop="score">
          <el-rate
            v-model="reviewFrom.score" show-text :texts="reviewFrom.scoreTexts">
          </el-rate>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click.stop="commitReview">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script type="text/ecmascript-6">
  import {mapState} from 'vuex';
  import gql from 'graphql-tag'
  import graphqlQuery from '@common/graphql/query.js'
  import graphqlMutation from '@common/graphql/mutation'

  export default {
    name: 'postDetail',
    data() {
      return {
        post: null,
        postState:{
          loading:true,
          opacity: 0.3,
        },
        commentList: [],
        reviewList: [],
        photoList: [],
        commentForm: {
          content: '',
          beReplyName: '',//被回复人的name
          buttonText: '回复',
          buttonLoading: false
        },
        dialogVisible: false, //点评dialog状态
        reviewFrom: {
          content: '',
          score: 1,
          scoreTexts: ['有缺陷：存在着一些明显可改善的部分', '普通：大部分的照片属于此类', '不错：整体完成度较好', '精彩：有较为出彩的地方', '完美：各方面都无可挑剔']
        }
      }
    },
    props: {
      postslug: String, //帖子Slug
      postindex: Number, //帖子下标
      //pageSize: Number, //每页加载数目
      postList: Array, //帖子列表
      type: String, //最新latest 最热popular 用户userzone
    },
    methods: {
      //关闭帖子详情
      close() {
        this.$router.go(-1);
        /*
        this.$router.replace({
          name: this.type
        });*/
      },

      //获取帖子详情
      getPostDetail() {
        this.postState = {
          loading: true,
          opacity: 0,
        };
        let variables;
        variables = {
          slug: this.postslug,
        };
        this.$apollo
          .query({
            query: graphqlQuery.postBySlug,
            variables: variables
          })
          .then(({data, errors}) => {
            if (data.post) {
              this.post = data.post;
              this.commentList = data.post.commentList;
              this.reviewList = data.post.reviewList;
              this.photoList = data.post.photoList;
              this.postState.opacity=1;
              this.postState.loading=false;
            }
          })
          .catch(error => {

          });
      },

      //上一个帖子
      pageUp() {
        let index, postslug;
        if (this.postindex == 0) {
          this.$message({
            message: '已经是第一个帖子',
            type: 'warning'
          });
          return false;
        }
        index = this.postindex - 1;
        postslug = this.postList[index].slug;
        this.$router.replace({
          name: this.$route.name,
          params: {postslug: postslug},
          query: {postindex: index}
        });
      },
      //下一个帖子
      pageDown() {
        let index, postslug;
        if (this.postindex + 1 >= this.postList.length) {
          this.$message({
            message: '已经是最后一个帖子',
            type: 'warning'
          });
          return false;
        }
        index = this.postindex + 1;
        postslug = this.postList[index].slug;
        this.$router.replace({
          name: this.$route.name,
          params: {postslug: postslug},
          query: {postindex: index}
        });
      },

      // 帖子点赞
      postlikedEvent() {
        let gqlStr;
        this.post.viewerLiked = !this.post.viewerLiked;
        this.post.viewerLiked ? ++this.post.likes : --this.post.likes;
        this.$apollo
          .mutate({
            mutation: this.post.viewerLiked ? graphqlMutation.postLike : graphqlMutation.postUnlike,
            variables: {
              postId: this.post.id
            }
          })
          .then(response => {
            if (response.errors) {
              return false;
            }
            this.post.likes = response.data.postLike.likes;
          })
          .catch(error => {

          });
      },

      //回复评论
      commentSubmit() {
        this.commentForm.buttonText = '回复中';
        this.commentForm.buttonLoading = true;

        this.$apollo.mutate({
          mutation: graphqlMutation.commentCreate,
          variables: {
            targetId: this.post.id,
            targetType: 'post',
            content: this.commentForm.content
          }
        })
          .then(response => {

            this.commentForm.buttonText = '回复';
            this.commentForm.buttonLoading = false;
            if (response.errors) {
              this.$message({
                showClose: true,
                message: '评论失败，稍候再试',
                type: 'error'
              });
              return false;
            }
            let comment = response.data.commentCreate;
            this.commentList.unshift(comment);
            this.commentForm.content = '';
            this.$message({
              showClose: true,
              message: '评论成功',
              type: 'success'
            });
          })
          .catch(error => {
            this.commentForm.buttonText = '回复';
            this.commentForm.buttonLoading = false;
            this.$message({
              showClose: true,
              message: error.graphQLErrors[0].message,
              type: 'error'
            });
          });
      },

      //回复其他用户评论
      commentReply(userName) {
        this.$refs.commentTextArea.scrollIntoView(true);
        this.commentForm.content = `@${userName} `;
      },

      //删除评论
      deleteComment(id, index) {
        this.$confirm('你确定删除这条评论吗?', '删除评论', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.$apollo
            .mutate({
              mutation: graphqlMutation.commentDelete,
              variables: {
                commentId: id
              }
            })
            .then(response => {
              if (response.errors) {
                this.$message({
                  showClose: true,
                  message: '删除失败',
                  type: 'error'
                });
                return false;
              }
              this.commentList.splice(index, 1);
              this.$message({
                showClose: true,
                message: '删除成功',
                type: 'success'
              });
            })
            .catch(error => {
              this.$message({
                showClose: true,
                message: '删除失败',
                type: 'error'
              });
            });
        })
          .catch(() => {

          });
      },

      //提交点评
      commitReview() {
        if (!this.reviewFrom.content) {
          this.$message({
            message: '请填写点评内容',
            type: 'warning'
          });
          return false;
        }
        this.$apollo
          .mutate({
            mutation: graphqlMutation.reviewCreate,
            variables: {
              postId: this.post.id,
              content: this.reviewFrom.content,
              score: this.reviewFrom.score,
            }
          })
          .then(({data, errors}) => {
            console.log(data);
            if (errors) {
              this.$message({
                message: '点评失败，请稍候再试',
                type: 'error'
              });
              return false;
            }
            this.reviewList.push(data.reviewCreate);
            this.dialogVisible = false;
            this.$message({
              message: '点评成功',
              type: 'success'
            });
          })
          .catch(error => {

          });
      },

      //删除点评
      deleteReview(id, index) {
        this.$confirm('你确定删除这条点评吗?', '删除点评', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.$apollo
            .mutate({
              mutation: graphqlMutation.reviewDelete,
              variables: {
                reviewId: id
              }
            })
            .then((data, errors) => {
              if (errors) {
                this.$message({
                  showClose: true,
                  message: '删除失败',
                  type: 'error'
                });
                return false;
              }
              this.reviewList.splice(index, 1);
              this.$message({
                showClose: true,
                message: '删除成功',
                type: 'success'
              });
            })
            .catch(error => {
              this.$message({
                showClose: true,
                message: '删除失败',
                type: 'error'
              });
            });
        })
          .catch(() => {

          });
      },

      //二审通过
      secondInstance(type) {
        this.$apollo
          .mutate({
            mutation: graphqlMutation.postModerate,
            variables: {
              postId: this.post.id,
              action:type,
            }
          })
          .then((data, errors) => {
            if (errors) {
              this.$message({
                showClose: true,
                message: '审核失败',
                type: 'error'
              });
              return false;
            }
            this.post.pendingCategories = data.data.postModerate.pendingCategories;
            this.$message({
              showClose: true,
              message: '审核成功',
              type: 'success'
            });
          })
          .catch(error => {
            this.$message({
              showClose: true,
              message: '审核失败',
              type: 'error'
            });
          });
      },
    },
    computed: {
      ...mapState({
        viewer: 'viewer'
      }),
    },
    components: {},
    created() {
      this.getPostDetail();
    },
    mounted() {
      document.body.setAttribute('style', 'overflow:hidden');
    },
    beforeDestroy() {
      document.body.setAttribute('style', 'overflow:auto');
    },
    watch: {
      '$route'(to, from) {
        this.getPostDetail();
      }
    }
  }

</script>
