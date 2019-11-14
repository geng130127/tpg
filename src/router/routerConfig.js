/*const home = () => import('@/views/Home');*/
const latest = () => import('@/views/gallery/Latest'); //最新 默认首页
const popular = () => import('@/views/gallery/Popular'); //最新 默认首页
const pending=()=>import('@/views/gallery/Pending')
const postDetail = () => import('@/views/gallery/PostDetail'); //帖子详情
const createPost = () => import('@/views/gallery/CreatePost'); //发布帖子
const User = () => import('@/views/user/User');
const userPublished = () => import('@/views/user/Published');
const userPortfolio = () => import('@/views/user/Portfolio');
const userSetting = () => import('@/views/user/Setting');
const bindPhone=()=>import('@/views/user/BindPhone');

let titleSuffix = ' - ImageField 像场';

export default [
  {
    path: '/',
    redirect: '/latest-all',
  },
  {
    path: '/latest-:categorySlug',
    name: 'latest',
    component: latest,
    meta: {
      title: '最新' + titleSuffix
    },
    props: (router) => {
      return {
        sort: 'latest',
        categorySlug: router.params.categorySlug,
      }
    },
    children: [
      {
        path: "p:postslug",
        name:'latestPostdetail',
        component: postDetail,
        props: (router) => {
          return {
            postslug: router.params.postslug,
            postindex: parseInt(router.query.postindex),
          }
        }
      }
    ]
  },
  {
    path: '/popular-:categorySlug',
    name: 'popular',
    component: popular,
    meta: {
      title: '最热' + titleSuffix
    },
    props: (router) => {
      return {
        sort: 'popular',
        categorySlug: router.params.categorySlug,
      }
    },
    children: [
      {
        path: "p:postslug",
        name:'popularPostdetail',
        component: postDetail,
        props: (router) => {
          return {
            postslug: router.params.postslug,
            postindex: parseInt(router.query.postindex),
          }
        }
      }
    ]
  },
  {
    path:'/pending',
    name:'pending',
    component:pending,
    meta: {
      title: '待审核' + titleSuffix,
    },
    props:(router) => {
      return {
        sort: 'pending',
      }
    },
    children: [
      {
        path: "p:postslug",
        name:'pendingPostdetail',
        component: postDetail,
        props: (router) => {
          return {
            postslug: router.params.postslug,
            postindex: parseInt(router.query.postindex),
          }
        }
      }
    ]
  },
  {
    path:'/createPost',
    name:'createPost',
    component:createPost,
    meta:{
      title:'发表帖子' + titleSuffix,
      login:true,//是否需要登录
    }
  },
  {
    path:'/u:slug',
    name:'user',
    props: true,
    component:User,
    redirect:{name:'userPublished'},
    meta:{
      title: '个人主页',
      login:true,//是否需要登录
    },
    children:[
      {
        path:'published',
        name:'userPublished',
        component: userPublished,
        meta:{
          title: `个人主页-Published`,
          login:true,//是否需要登录
        },
        props:(router) => {
          return {
            sort: 'userPublished',
          }
        },
        children: [
          {
            path: "p:postslug",
            name:'userPublishedPostdetail',
            component: postDetail,
            props: (router) => {
              return {
                postslug: router.params.postslug,
                postindex: parseInt(router.query.postindex),
              }
            }
          }
        ]
      },
      {
        path:'portfolio',
        name:'userPortfolio',
        component: userPortfolio,
        meta:{
          title: `个人主页-Portfolio`,
          login:true,//是否需要登录
        },
        props:(router) => {
          return {
            sort: 'userPortfolio',
          }
        },
        children: [
          {
            path: "p:postslug",
            name:'userPortfolioPostdetail',
            component: postDetail,
            props: (router) => {
              return {
                postslug: router.params.postslug,
                postindex: parseInt(router.query.postindex),
              }
            }
          }
        ]
      }
    ],
  },
  {
    path:'/setting',
    name:'setting',
    props: true,
    component:userSetting,
    meta:{
      title: '个人资料设置',
      login:true,//是否需要登录
    },
  },
  {
    path:'/bindphone',
    name:'bindphone',
    props: true,
    component:bindPhone,
    meta:{
      title: '绑定手机',
      login:true,//是否需要登录
    },
  }

]
