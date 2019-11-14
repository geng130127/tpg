<template>
  <section class="published-container">
    <div class="posts">
      <v-postList ref="postList" :type="sort" :querySize="querySize"></v-postList>
    </div>
  </section>
</template>

<script type="text/ecmascript-6">
  import postList from '@components/gallery/VPostList'
  import graphqlQuery from '@common/graphql/query.js'

  export default {
    name: 'userPublished',
    data() {
      return {
        querySize: 30,
      }
    },
    provide (){
      return {
        fetchPosts : this.fetchPosts
      }
    },
    props: ['slug','sort'],
    methods: {
      /**
       * 获取列表数据
       */
      fetchPosts(offset = 0) {
        let variables = {
          'slug': this.slug,
          'offset' : offset,
          'size'   : this.querySize,
        };
        return this.$apollo
          .query({
            query: graphqlQuery.userPostList,
            variables: variables
          })
          .then(({data,errors}) => {
            return data.user ? data.user.postList : [];
          });
      },
    },
    computed: {},
    components: {
      'v-postList': postList
    },
    created() {

    },
    mounted() {
      this.$refs.postList.loadPosts(0);
    },
  }
</script>

