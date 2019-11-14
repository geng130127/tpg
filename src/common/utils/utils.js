import jsCookie from 'js-cookie';

/*处理cookie*/
let cookies={
  setCookie(key,value) {
    return jsCookie.set(key,value,{ expires: 3 });
  },
  getCookie(key) {
    return jsCookie.get(key);
  },
  removeCookie(key) {
    return jsCookie.remove(key);
  }
};

/*用户等级字典*/
let userLevel = {
  review: ['first_moderation', 'second_moderation'], //审核人员
  normal: ['user'], //普通用户
  ban: ['ban'], //禁用
  admin: ['admin'], //管理员
  vip: ['vip'] //VIP
};

export {cookies,userLevel}
