<template>
  <div class="mainHeader">
    <header class="width-control">
      <nav class="mainNav">
        <ul class="navList">
          <li class="navItem">
            <router-link to="/">ImageField 像场</router-link>
          </li>
        </ul>
      </nav>
      <div v-if="viewer">
        <div v-if="viewer.id" class="right userInfo">
          <div class="createPost">
            <el-button type="primary" size="mini" @click.stop="createPost">投稿</el-button>
          </div>

          <el-dropdown @command="dropdownEvent">
            <div class="el-dropdown-link">
              <div class="avatar">
                <img :src="viewer.avatar" alt="">
              </div>
              <div class="name">{{viewer.name}}</div>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="0">
                <router-link tag="li" :to="{name:'user', params:{slug:viewer.slug}}">个人中心</router-link>
              </el-dropdown-item>
              <el-dropdown-item command="0"><router-link tag="li" :to="{name:'setting'}">账号设置</router-link></el-dropdown-item>
              <el-dropdown-item command="1">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

        </div>
        <div v-else class="right option">
          <div class="loginBtn" @click.stop="login">登录</div>
        </div>
      </div>

    </header>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapState, mapActions, mapGetters} from 'vuex';
  import {cookies} from '@common/utils/utils'
  import gql from 'graphql-tag'

  export default {
    data() {
      return {}
    },
    methods: {
      login() {
        /*window.open("https://open.weixin.qq.com/connect/qrconnect?appid=wx04368a0b1db36e67&redirect_uri=https://iyingdi.gonlan.com/web/user/login/weixin?loginCallback=https%3A%2F%2Fiyingdi.gonlan.com%2F&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect", "_self");*/
        this.$apollo
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
              //cookies.setCookie('jwt', data.jwt);
              window.localStorage.setItem('jwt', data.jwt);
              window.location.reload();
            }
            else {
              alert('登录失败');
            }
          })
          .catch(error => {
            console.log(error);
          });
      },

      createPost() {
        this.$router.replace({
          name: 'createPost'
        });
      },

      dropdownEvent(value) {
        if (!parseInt(value)) {
          return false;
        }
        window.localStorage.clear();
        window.location.href='/';
      },
    },
    computed: {
      ...mapState(['viewer'])
    },
    components: {},
    mounted() {
    },
  }
</script>
