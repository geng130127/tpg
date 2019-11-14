<template>
  <div id="app">
    <v-header></v-header>
    <router-view/>
  </div>
</template>

<script type="text/ecmascript-6">
import header from '@components/Header'
import graphqlQuery from '@common/graphql/query'

export default {
  name:'app',
  data() {
    return {}
  },
  methods: {

  },
  computed: {
  },
  components: {
    'v-header':header
  },
  created(){
  }
}
</script>
