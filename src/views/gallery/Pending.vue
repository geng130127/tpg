
<template>
  <main class="pending-container">
    <v-channel :categorieHidden="true"></v-channel>
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
    name: 'pending',
    data() {
      return {
        querySize:30
      }
    },
    props: {
      sort: String
    },
    provide (){
      return {
        fetchPosts : this.fetchPosts
      }
    },
    methods: {
      //获取数据
      fetchPosts(offset = 0) {
        let variables = {
          'offset' : offset,
          'size'   : this.querySize
        };
        return this.$apollo
          .query({
            query: graphqlQuery.postsForReview,
            variables: variables
          })
          .then(({data,errors}) => {
            return data.postsForReview;
          });
      },
    },
    computed: {},
    components: {
      'v-postList':postList,
      'v-channel':channel
    },
    created() {

    },
    mounted() {
      this.$refs.postList.loadPosts(0);
    },

  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">

</style>
