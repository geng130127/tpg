
const gallery = {
  namespaced: true,
  state: {
    /*postList:[],*/
    tagList:[]
  },
  mutations: {
    /*SET_POST_LIST(state,data){
      state.postList=data;
    },*/
    SET_TAG_LIST(state,data){
      state.tagList=data;
    }
  },
  actions: {
    setTagList(store, data) {
      const {commit, dispatch, state, rootState} = store
      commit('SET_TAG_LIST', data);
    }
  },
  getters: {

  }
}

export default gallery;
