<template>
  <section class="setting-container bind-phone">
    <div class="form-area">
      <h2 class="form-title">
        绑定手机
      </h2>
      <ul class="form-items">
        <li class="form-item">
          <label>手机号</label>
          <div class="form-item-content">
            <p class="txt">
              改手机号仅用于身份认证，不用于登录当前账号
              <svg-icon icon-class="wenhao"></svg-icon>
            </p>
            <!--<p class="detail-content">{{viewer.mobile}}</p>-->
            <div class="phone-area">
              <!--<el-input v-model="phoneNum" placeholder="请输入手机号码"></el-input>
              <div class="verification-code">
                <el-input v-model="verificationCode" placeholder="验证码"></el-input>
                <el-button type="info">{{sendSMS.text}}</el-button>
              </div>-->
              <el-form :model="form" :rules="formRules" ref="form" class="verification-form" >
                <el-form-item prop="phone">
                  <el-input v-model="form.phone" placeholder="请输入手机号码"></el-input>
                </el-form-item>

                <el-form-item prop="verificationCode">
                  <el-input v-model="form.verificationCode" placeholder="请输入验证码"></el-input>
                  <el-button :disabled="sendSMS.state" type="info" @click.stop="getSmsCode">
                    {{sendSMS.text}}
                  </el-button>
                </el-form-item>

              </el-form>
            </div>
          </div>
        </li>
        <li class="submit-item">
          <div class="buttons">
            <el-button type="success" @click.stop="submitForm('form')">绑定</el-button>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script type="text/ecmascript-6">
  import {mapState} from 'vuex';

  export default {
    name: '',
    data() {
      return {
        sendSMS: {
          state: true,
          text: '验证码',
          second: 60,
        },
        form: {
          phone: '',
          verificationCode: '',
        },
        formRules: {
          phone:[{
            validator: (rule, value, callback) => {
              this.sendSMS.state=true;
              if (!value) {
                callback('请输入手机号码');
                return false;
              } else if (!/^1[34578]\d{9}$/.test(value)) {
                callback('请输入正确的手机号码');
                return false;
              }
              this.sendSMS.state=false;
              callback();
            },
            trigger: 'blur'
          }],
          verificationCode:[{ required: true, message: '请输入验证码', trigger: 'blur' },]
        },
      }
    },
    props: {},
    methods: {
      getSmsCode() {
        let timer;
        timer = setInterval(()=>{
          this.sendSMS.second--;
          this.sendSMS.text = this.sendSMS.second + '秒后重新获取'
          this.sendSMS.state = true;
          if (this.sendSMS.second === 0) {
            this.sendSMS.second=60;
            this.sendSMS.state = false;
            this.sendSMS.text = '验证码'
            clearInterval(timer);
          }
        }, 1000)
      },

      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.form);
          } else {
            return false;
          }
        });
      }
    },
    computed: {
      ...mapState({
        viewer: 'viewer'
      })
    },
    components: {},
    created() {

    }
  }
</script>

<style lang="scss">
  .bind-phone {
    .phone-area {
      width: 50%;
      .verification-form {
        .el-form-item:nth-of-type(2) {
          .el-input {
            width: 40%;
            margin-right: 15px;
          }
        }
      }
    }

  }
</style>
