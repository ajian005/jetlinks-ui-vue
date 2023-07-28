<!-- 第三方账户绑定 -->
<template>
  <div class='page-container'>
    <div class='content-bind'>
      <div class='title'>{{t('Center.bind.index.5rmxfod33ws0')}}</div>
      <!-- 已登录-绑定三方账号 -->
      <template v-if='!!token'>
        <div class='info'>
          <div class='info-body'>
              <j-avatar
                :size="86"
                style="margin-bottom: 16px;"
                :src="
                    user?.avatar ||
                    getImage('/bind/jetlinksLogo.png')
                "
              />
              <div class="info-body-item"><span>{{t('Center.bind.index.account')}}</span><j-ellipsis :lineClamp="2">{{ user?.username || '-' }}</j-ellipsis></div>
              <div class="info-body-item"><span>{{t('Center.bind.index.userName')}}</span><j-ellipsis :lineClamp="2">{{ user?.name || "-" }}</j-ellipsis></div>
            </div>
          <img :src="getImage('/bind/Vector.png')" />
          <div class='info-body'>
              <j-avatar
                :size="86"
                shape="square"
                style="margin-bottom: 16px;"
                :src="
                bindUser.result?.avatar ||
                    iconMap.get(
                        bindUser?.applicationProvider,
                    ) || getImage('/apply/internal-standalone.png')
                "
              />
              <div class="info-body-item"><span>{{t('Center.bind.index.account')}}</span><j-ellipsis :lineClamp="2">{{ bindUser?.result?.userId || '' }}</j-ellipsis></div>
              <div class="info-body-item"><span>{{t('Center.bind.index.userName')}}</span><j-ellipsis :lineClamp="2">{{ bindUser?.result?.name || '' }}</j-ellipsis></div>
            </div>
        </div>
        <div class='btn'>
          <j-button type='primary' @click='handleBind'>{{ t('Center.bind.index.bind') }}
          </j-button>
        </div>
      </template>
      <!-- 未登录-绑定三方账号 -->
      <template v-else>
        <div class='not-login'>
          <div class='logo'>
            <img :src="getImage('/bind/jetlinksLogo.png')" />
            <img
              class='arrow'
              :src="getImage('/bind/Vector.png')"
            />
            <img
              :src='bindUser?.avatar || iconMap.get(bindUser?.applicationProvider)'
            />
          </div>
          <div class='desc'>
            {{ t('Center.bind.index.5rmxfod3f6o0') }}
            {{ bindUser?.appName }}
            {{ t('Center.bind.index.5rmxfod3fj40') }}
          </div>
          <div class='login-form'>
            <j-form layout='vertical'>
              <j-form-item :label="t('Center.bind.index.5rmxfod3fvk0')" v-bind='validateInfos.username'>
                <j-input v-model:value='formData.username' :placeholder="t('Center.bind.index.5rmxfod3g7k0')" />
              </j-form-item>
              <j-form-item :label="t('Center.bind.index.5rmxfod3gpo0')" v-bind='validateInfos.password'>
                <j-input-password v-model:value='formData.password' :placeholder="t('Center.bind.index.5rmxfod3h200')" />
              </j-form-item>
              <template v-if='captcha.base64'>
                <j-form-item :label="t('Center.bind.index.5rmxfod3hf40')" v-bind='validateInfos.verifyCode' :rules="[
                  {
                    required: true,
                    message: t('Center.bind.index.5rmxfod3hog0'),
                  },
                ]">
                  <j-input v-model:value='formData.verifyCode' :placeholder="t('Center.bind.index.5rmxfod3hog0')">
                    <template #addonAfter>
                      <img :src='captcha.base64' @click='getCode' style='cursor: pointer' />
                    </template>
                  </j-input>
                </j-form-item>

              </template>
              <j-form-item>
                <j-button type='primary' @click='handleLoginBind' style='width: 100%'>
                  {{ t('Center.bind.index.5rmxfod3hvg0') }}
                </j-button>
              </j-form-item>
            </j-form>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang='ts' name='AccountBind'>
import { getImage, LocalStore, onlyMessage } from '@/utils/comm'
import { TOKEN_KEY } from '@/utils/variable'
import { Form } from 'ant-design-vue'

import { applicationInfo, bindAccount } from '@/api/bind'
import { code, authLogin, userDetail } from '@/api/login'
import { useSystem } from '@/store/system'

const useForm = Form.useForm;
const systemStore = useSystem();
import { useI18n } from 'vue-i18n'

const { t } = useI18n()


interface formData {
  username: string;
  password: string;
  verifyCode: string;
}

const iconMap = new Map()
iconMap.set('dingtalk-ent-app', getImage('/notice/dingtalk.png'))
iconMap.set('wechat-webapp', getImage('/notice/wechat.png'))
iconMap.set('internal-standalone', getImage('/apply/internal-standalone.png'))
iconMap.set('third-party', getImage('/apply/third-party.png'))

const token = computed(() => LocalStore.get(TOKEN_KEY))

/**
 * 用户信息
 */
const user = ref()
const getDetail = () => {
  if (!token.value) return
  userDetail().then((res: any) => {
    user.value = res?.result
  })
}


/**
 * 获取url参数
 */
const getUrlCode = () => {
  const url = new URLSearchParams(window.location.href)
  return url.get('code') as string
}

/**
 * 三方应用信息
 */
const bindUser = ref<any>({ appName: '' })
const getAppInfo = async () => {
  const code = getUrlCode()
  const { result } = await applicationInfo(code)
  bindUser.value = result

  if (result.applicationProvider === 'dingtalk-ent-app') {
    bindUser.value.appName = t('Center.bind.index.5rmxfod3i780')
  } else if (result.applicationProvider === 'wechat-webapp') {
    bindUser.value.appName = t('Center.bind.index.5rmxfod3ie00')
  } else {
    bindUser.value.appName = result.applicationName
  }
}


/**
 * {{t('Center.bind.index.bind')}}
 */
const handleBind = async () => {
  const code = getUrlCode()
  const res = await bindAccount(code)
  console.log('bindAccount: ', res)
  onlyMessage(t('Center.bind.index.5rmxfod3ikw0'))
  goRedirect()
  setTimeout(() => window.close(), 1000)
}

// 未登录-先登录再绑定
const formData = ref<formData>({
  username: '',
  password: '',
  verifyCode: ''
})
const formRules = ref({
  username: [
    {
      required: true,
      message: t('Center.bind.index.5rmxfod3g7k0')
    }
  ],
  password: [
    {
      required: true,
      message: t('Center.bind.index.5rmxfod3h200')
    }
  ]
})

const { resetFields, validate, validateInfos } = useForm(
  formData.value,
  formRules.value
)

/**
 * 获取图形验证码
 */
const captcha = ref({
  base64: '',
  key: ''
})
const getCode = async () => {
  const res: any = await code()
  captcha.value.base64 = res.result?.base64
  captcha.value.key = res.result?.key
}


/**
 * {{t('Center.bind.index.5rmxfod3hvg0')}}
 */
const handleLoginBind = () => {
  validate()
    .then(async () => {
      const code = getUrlCode()
      const params: any = {
        ...formData.value,
        bindCode: code,
        expires: 3600000
      }

      if (captcha.value.base64) {
        params.verifyKey = captcha.value.key
      } else {
        delete params.verifyCode
      }

      const res = await authLogin(params)
      console.log('res: ', res)
      if (res.success) {
        onlyMessage(t('Center.bind.index.5rmxfod3iqo0'))
        LocalStore.set(TOKEN_KEY, res.result!.token as string)
        goRedirect()
      }
    })
    .catch((err) => {
      console.log(err)
      getCode()
    })
}

/**
 * 绑定成功跳转至页面url的: redirect
 */
const goRedirect = () => {
  const urlParams = new URLSearchParams(window.location.hash)
  const redirectUrl =
    urlParams.get('redirect') ||
    window.location.href.split('redirect=')?.[1]
  console.log('redirectUrl: ', redirectUrl)
  //内部集成需要跳回它们页面
  if (redirectUrl && redirectUrl.indexOf('account/center/bind') === -1) {
    window.location.href = decodeURIComponent(redirectUrl)
  } else {
    window.location.href = '/'
    setTimeout(() => window.close(), 1000)
  }
}

onMounted(() => {
  getAppInfo()
  getCode()
  getDetail()
  systemStore.getFront()
})

</script>

<style lang='less' scoped>
:deep(.ant-form-item-label > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::before) {
  display: none;
}

:deep(.ant-form-item-label > label) {
  font-weight: bold;
}

.page-container {
  width: 100%;
  height: 100vh;
  background: url(/images/bind/bindPage.png) 0% 0% / 100% 100% no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;

  .content-bind {
    box-sizing: border-box;
    width: 928px;
    min-height: 510px;
    background: #fff;
    border-radius: 22px;
    padding: 40px;

    .title {
      margin-bottom: 30px;
      color: #333333;
      font-weight: 400;
      font-size: 22px;
      font-family: 'PingFang SC';
      font-style: normal;
      line-height: 25px;
      text-align: center;
    }

    // 已登录-绑定三方账号
    .info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 86px 0;

      img {
        width: 69px;
      }

      &-body {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        width: 317px;

        &-item {
          display: flex;
          color: #333333;

          span {
            color: #666666;
            white-space: nowrap;
          }
        }
      }
    }

    .btn {
      display: flex;
      justify-content: center;
      margin-top: 30px;
    }

    // 未登录
    .not-login {
      display: flex;
      flex-direction: column;
      align-items: center;

      .logo {
        display: flex;
        align-items: center;
        gap: 20px;

        img {
          width: 50px;
          height: 50px;
        }

        .arrow {
          width: 15px;
          height: 15px;
        }
      }

      .desc {
        margin-top: 30px;
        margin-bottom: 30px;
        font-size: 14px;
        font-family: 'PingFang SC';
        font-style: normal;
        line-height: 14px;
        opacity: 0.75;
        mix-blend-mode: normal;
      }
    }
  }
}
</style>
