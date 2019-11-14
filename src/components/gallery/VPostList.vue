<template>
  <div class="postListArea" :style="{width: `${containerWidth}px`}">
    <article class="postItem" v-for="(post,index) in postList">
      <div class="image" @click.stop="postItemEvent(post)" :style="post.sizeStyle">
        <img :src="post.photoList.length>0?post.photoList[0].url:''" alt="">
      </div>
      <div v-if="post.author" class="info">
        <router-link :to="{name:'user', params: post.author}" class="authorName">© {{post.author.name}}</router-link>
      </div>
    </article>
    <router-view :postList='postList' :type="type"></router-view>
  </div>
</template>

<script type="text/ecmascript-6">

  export default {
    name: 'VPostList',
    data() {
      return {
        containerWidth: document.body.clientWidth > 1650 ? 1650 : (document.body.clientWidth < 1000 ? 1000 : document.body.clientWidth - 30),
        queryOffset : 0,
        postList: [],
        loading : false,
        hasMore : true,
      }
    },
    props: {
      type: String, //最新latest 最热popular 用户userzone
      querySize : Number,
    },
    inject: ['fetchPosts'],
    methods: {
      postItemEvent(item) {
        this.$router.push({
          name: `${this.type}Postdetail`,
          params: {postslug: item.slug},
          query: {postindex: item.index}
        });
      },
      reset(){
        this.postList = [];
        this.queryOffset = 0;
        this.loading = false;
        this.hasMore = true;
        window.scroll(0, 0); //返回顶部
      },
      loadPosts(offset){
        this.loading = true;
        this.fetchPosts(offset)
          .then((posts) => {
            let postIndex = this.postList.length;
            for (let i = 0; i < posts.length; i++){
              posts[i].index = postIndex;

              this.postList.push(posts[i]);
              postIndex++;
            }

            this.preProcess(this.postList);

            this.loading = false;
            this.queryOffset += posts.length;
            if (posts.length < this.querySize)
              this.hasMore = false;
          })
          .catch(error => {
            console.log(error);
          });
      },
      preProcess(posts){
        let containerWidth = this.containerWidth, gutter = 70, maxTotalWidth = 4.65, minTotalWidth = 3;

        // 找到第一个未设置宽高的对象
        let i = posts.length;
        while(posts[i - 1] && posts[i - 1].sizeStyle === undefined){
          i--;
        };

        while(posts[i]){
          let j = i, widthSum = 0;

          do {
            widthSum += posts[j].photoList[0].aspectRatio || 1;
            j++;
          }
          while(posts[j] && (widthSum + (posts[j].photoList[0].aspectRatio || 1) < maxTotalWidth));

          if (widthSum < minTotalWidth)
            return;

          let height = (containerWidth - gutter * (j - i)) / widthSum;

          for (; i < j; i++){
            let post = posts[i];
            post.sizeStyle = {
              width : height * post.photoList[0].aspectRatio + 'px',
              height : height + 'px'
            };
          }
        }
      }
    },
    computed: {},
    components: {},
    created() {

    },
    mounted() {
      const that = this
      window.onresize = () => {
        that.containerWidth = document.body.clientWidth > 1650 ? 1650 : (document.body.clientWidth < 1000 ? 1000 : document.body.clientWidth - 30)
      }

      window.onscroll = () => {
        if (!this.hasMore || this.loading)
          return;
        // 距离底部200px时加载一次
        let bottomOfWindow = document.documentElement.scrollHeight - (document.documentElement.scrollTop + document.body.scrollTop + window.innerHeight);

        if (bottomOfWindow < 200) {
          this.loadPosts(this.queryOffset);
        }
      };
    },
    beforeDestroy() {
      window.onresize = null;
      window.onscroll = null;
    },
  }
</script>
