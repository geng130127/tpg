<template>
  <main class="mainContainer">
    <v-channel @tagEvent="onChangeCategory"></v-channel>
    <div class="posts">
      <v-postList ref="postList" :type="sort" :querySize="querySize"></v-postList>
    </div>
  </main>
</template>

<script type="text/ecmascript-6">
  import channel from '@components/Channel'
  import postList from '@components/gallery/VPostList'
  import graphqlQuery from '@common/graphql/query.js'


  export default {
    name: 'latest',
    data() {
      return {
        querySize : 30
      }
    },
    props: ['sort', 'categorySlug'],
    methods: {
      onChangeCategory(category) {
        this.$router.push({
          name: this.$route.name,
          params: {categorySlug: category.slug}
        });
      },

      /**
       * 获取列表数据
       */
      fetchPosts(offset = 0) {
        let variables = {
          'offset' : offset,
          'size'   : this.querySize,
          'categorySlug': this.categorySlug
        };
        return this.$apollo
          .query({
            query: graphqlQuery.categoryPostList,
            variables: variables
          })
          .then(({data,errors}) => {
            return data.category ? data.category.postList : [];
          });
      },
    },
    provide (){
      return {
        fetchPosts : this.fetchPosts
      }
    },
    computed: {},
    components: {
      'v-channel': channel,
      'v-postList': postList
    },
    watch: {
      '$route' (to, from) {
        if (to.params.categorySlug == from.params.categorySlug)
          return;
        this.$refs.postList.reset();
        this.$refs.postList.loadPosts(0);
      }
    },
    created() {
    },
    mounted() {
      this.$refs.postList.loadPosts(0);
    },

  }
</script>
