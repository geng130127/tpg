import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import gallery from './modules/gallery'

import apolloClient from '@common/graphql/apolloRequest'
import graphqlQuery from '@common/graphql/query'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    jwt : null,
    viewer : {},
    site : {},
    categories : [],
  },
  mutations: {
    setJwt (state, jwt){
      state.jwt = jwt;
    },
    setViewer (state, viewer){
      state.viewer = viewer;
    },
    setSite (state, site){
      state.site.title = site.title;
    },
    setCategories (state, categories){
      state.categories = categories;
    }
  },
  actions: {
    initialize (context){
      let jwt = window.localStorage.getItem('jwt');
      if (jwt){
        context.commit('setJwt', jwt);

        let viewerJson = window.localStorage.getItem('viewer');
        if (viewerJson){
          context.commit('setViewer', JSON.parse(viewerJson));
        }
      }

      return apolloClient
        .query({query: graphqlQuery.initialize})
        .then(({data,errors}) => {
          context.commit('setViewer', data.viewer);
          window.localStorage.setItem('viewer', JSON.stringify(data.viewer));

          context.commit('setSite', data.site);
          if (data.site.categoryList) {
            context.commit('setCategories', data.site.categoryList);
          }
          return data;
        })
        .catch(error=>{
          console.log('getUserInfoError'+error);
        });
    }
  },
  modules: {
    user,
    gallery
  },
})
