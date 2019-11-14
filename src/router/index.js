import Router from 'vue-router'
import routerConfig from './routerConfig'
import store from '@/store'
import {cookies} from '@common/utils/utils'
import gql from 'graphql-tag'
import apolloClient from '@common/graphql/apolloRequest'
import graphqlQuery from '@common/graphql/query'

const router = new Router({
  //mode: 'history',
  routes: [
    ...routerConfig
  ]
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? to.meta.title : 'ImageField 像场';
  if (to.query.code) {
    //1.根据code获取用户就jwt信息；
    //2.根据jwt获取用户信息
    //3.根据获取的用户信息判断是否跳转到绑定页面或者首页
    apolloClient
      .query({
        query: gql`
              query ($unionid:String!){
                jwt(unionid:$unionid)
              }
            `,
        variables: {
          unionid: 'seu382sjkd'
        }
      })
      .then(({data, errors}) => {
        if (data) {
          window.localStorage.setItem('jwt', data.jwt);
          return store.dispatch('initialize');
        }
      })
      .then((data) => {
        if (data.viewer.mobile) {
          next('/')
          return false;
        }
        next({name: 'bindphone'})
      });
  }
  else {
    if (to.meta.login && !window.localStorage.getItem('jwt')) {
      next('/');
      return false;
    }
    //判断是否需要存储用户信息
    /*if (!store.state.user.user_token && cookies.getCookie('user_token')) {
      let token = cookies.getCookie('user_token');
      store.commit('SET_USER_TOKEN', token);
      next();
      return false;
    }*/
    next();
  }
});

export default router;
