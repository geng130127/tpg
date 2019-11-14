import apolloClient from '@common/graphql/apolloRequest'
import gql from 'graphql-tag'

const user = {
  namespaced: true,
  state: {
    user_token:'',
    user_info:{},
  },
  mutations: {
    SET_USER_TOKEN(state,token){
      state.user_token=token;
    },

    SET_USER_INFO(state,data){
      state.user_info=data;
    }
  },
  actions: {
    setUserToken(store, token) {
      const {commit, dispatch, state, rootState} = store
      commit('SET_USER_TOKEN', token);
      return apolloClient.query({
            query:gql`
              query viewer{
                viewer{
                  id
                  name
                  avatar
                  mobile
                  memberLevel
                  reviewCategories
                }
              }
            `
        })
        .then(response => {
          let viewer;
          viewer=response.data.viewer;
          commit('SET_USER_INFO', viewer);
        })
        .catch(error=>{
          console.log('getUserInfoError'+error);
        });
    }
  },
  getters: {

  }
}

export default user
