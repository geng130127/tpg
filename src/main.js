import Vue from 'vue'
import Router from 'vue-router'
import VueApollo from 'vue-apollo'

import App from './App.vue'
import router from '@/router'
import store from '@/store'

import apiList from '@common/restful/interface' //引入axios封装
import apolloClient from '@common/graphql/apolloRequest'

import ElementUI from 'element-ui';
import relativeTime from '@components/RelativeTime'

import '@/icons' //svg图标
import animate from 'animate.css' //动画框架
import '@assets/element-index.scss' //element-ui样式

Vue.use(Router);
Vue.use(VueApollo);

const apolloProvider = new VueApollo({
  clients: {
    default: apolloClient,
    // 这个是我设置的默认接口的地址
    //other: otherApolloClient,
    // 这是另一部分功能的接口地址，另外这个key名，在页面中写具体请求时会用到，因为我们要指定接口的地址
  },
  defaultClient: apolloClient,
  /* defaultOptions: defaultOptions,*/
  errorHandler(error) {
    console.log('Global apollo error handler')
    console.error(error)
  }
});

Vue.config.productionTip = false;
Vue.prototype.$axios = apiList;

Vue.use(ElementUI);
Vue.use(animate);

Vue.component('relative-time', relativeTime);

//endregion

new Vue({
  router,
  store,
  apolloProvider,
  render: h => h(App),
  mounted(){
    this.$store.dispatch('initialize');
  }
}).$mount('#app');
