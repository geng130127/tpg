import axios from './restfulRequest' // 导入 api

const interfaceList = {
  post: (params, url) => {
    return axios({
      url: url,
      method: 'POST',
      data: params
    })
  },
  get: (params, url) => {
    return axios({
      url: url,
      method: 'GET',
      params
    })
  }
};

export default interfaceList
