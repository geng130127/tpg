<template>
  <main class="user-main-container">
    <div class="hero-image"></div>
    <section class="user-detail width-control">
      <div class="coveroverlay" v-if="user">
        <div class="user-avatar">
          <img :src="user.avatar" alt="">
        </div>
        <div class="user-name">{{user.name}}</div>
      </div>

      <ul class="tabs">
        <router-link class="tab" tag="li" :to="{name:'userPublished'}">Published</router-link>
        <router-link class="tab" tag="li" :to="{name:'userPortfolio'}">Portfolio</router-link>
        <!--<router-link class="tab" tag="a" :to="{name:''}">Followers</router-link>
        <router-link class="tab" tag="a" :to="{name:''}">About</router-link>-->
      </ul>
    </section>

    <section class="router-container">
      <router-view :slug="slug"></router-view>
    </section>

  </main>
</template>

<script type="text/ecmascript-6">
  import graphqlQuery from '@common/graphql/query.js'

  export default {
    name: 'user',
    data() {
      return {
        querySize: 30,
        user: null
      }
    },
    props: ['slug'],
    methods: {
      fetchData() {
        this.$apollo
          .query({
            query: graphqlQuery.userBySlug,
            variables: {'slug': this.slug}
          })
          .then(({data, errors}) => {
            this.user = data.user;
          })
          .catch(error => {
            console.log(error);
          });
      },
    },

    computed: {},
    components: {

    },
    watch: {

    },
    created() {
    },
    mounted() {
      this.fetchData();
    },
  }
</script>
