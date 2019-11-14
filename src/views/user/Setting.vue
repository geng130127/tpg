<template>
  <section class="setting-container">
    <div class="form-area">
      <h2 class="form-title">
        账号设置
      </h2>
      <!--{{viewer}}-->
      <ul class="form-items">
        <li class="form-item">
          <label>头像</label>
          <div class="form-item-content">
            <div class="image">
              <img :src="viewer.avatar" alt="">
            </div>
          </div>
        </li>
        <li class="form-item">
          <label>用户名</label>
          <div class="form-item-content">
            <p class="txt">描述提示XXXXXXXXXXXXXXXX</p>
            <p class="detail-content">{{viewer.name}}</p>
          </div>
        </li>
        <li class="form-item">
          <label>手机号</label>
          <div class="form-item-content">
            <p class="txt">
              改手机号仅用于身份认证，不用于登录当前账号
              <svg-icon icon-class="wenhao"></svg-icon>
            </p>
            <p class="detail-content">{{viewer.mobile}}</p>
          </div>
        </li>
        <li class="submit-item">
          <div class="buttons">
            <el-button type="success">保  存</el-button>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script type="text/ecmascript-6">

  import {mapState} from 'vuex';

  export default {
    name: 'setting',
    data() {
      return {
      }
    },
    props: {},
    methods: {},
    computed: {
      ...mapState({
        viewer:'viewer'
      })
    },
    components: {},
    created() {

    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">

</style>
