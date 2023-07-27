<template>
    <div class="does-container">
        <div v-show="props.type === 'internal-standalone'">
            <h1>1.{{ t('Save.components.Does.summarize') }}</h1>
            <div>
                {{ t('Save.components.Does.5rgb1lt1h000') }}
            </div>
            <div>
                {{ t('Save.components.Does.5rgb1lt1itc0') }}
            </div>
            <div class="image">
                <j-image width="100%" :src="img1" />
            </div>

            <h1>2.{{ t('Save.components.Does.accessExplain') }}</h1>
            <div>1、{{ t('Save.components.Does.integration') }}</div>
            <div>
                {{ t('Save.components.Does.5rgb1lt1j9s0') }}
            </div>
            <div>2、{{ t('Save.components.Does.API') }}</div>
            <div>
                <span>{{ t('Save.components.Does.5rgb1lt1jl40') }}</span>
            </div>
            <div>3、{{ t('Save.components.Does.APIService') }}</div>
            <div>
                <span>{{ t('Save.components.Does.5rgb1lt1kas0') }}</span>
            </div>
            <div>
                {{ t('Save.components.Does.5rgb1lt1kwc0') }}
            </div>
            <div>4、{{ t('Save.components.Does.enter') }}</div>
            <div>
                {{ t('Save.components.Does.5rgb1lt1lac0') }}
            </div>
        </div>
        <div v-show="props.type === 'internal-integrated'">
            <h1>1.{{ t('Save.components.Does.5rgb1lt1m900') }}</h1>
            <div>
                {{ t('Save.components.Does.5rgb1lt1lis0') }}
            </div>
            <div>{{ t('Save.components.Does.5rgb1lt1llk0') }}
            </div>
            <div class="image">
                <j-image width="100%" :src="img2" />
            </div>
            <h1>2.{{ t('Save.components.Does.explain') }}</h1>
            <div>1、{{ t('Save.components.Does.integration') }}</div>
            <div>
                {{ t('Save.components.Does.5rgb1lt1lo80') }}
            </div>
            <div>2、{{ t('Save.components.Does.API') }}</div>
            <div>
                {{ t('Save.components.Does.5rkm01ocqy40') }}
            </div>
        </div>
        <div v-show="props.type === 'dingtalk-ent-app'">
            <div class="url">
                {{ t('Save.components.Does.5rgb1lt1lr80') }}
                <a href="https://open-dev.dingtalk.com" target="_blank" rel="noopener noreferrer">
                    https://open-dev.dingtalk.com
                </a>
            </div>
            <h1>1.概述</h1>
            <div>配置成功后，用户可以采用钉钉扫码授权的方式登录<span>物联网平台</span></div>
            <div class="image">
                <j-image width="100%" :src="img4" />
            </div>
        </div>
        <div v-show="props.type === 'wechat-webapp'">
            <div class="url">
                {{t('Save.components.Does.5rgb1lt1lzw0')}}
                <a
                    href="https://open.weixin.qq.com/cgi-bin/frame?t=home/web_tmpl&lang=zh_CN"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    https://open.weixin.qq.com/cgi-bin/frame?t=home/web_tmpl&lang=zh_CN
                </a>
            </div>
            <h1>1.概述</h1>
            <div>配置成功后，用户可以采用微信扫码授权的方式登录<span>物联网平台</span></div>
            <div class="image">
                <j-image width="100%" :src="img3" />
            </div>
        </div>
        <div v-show="props.type === 'third-party'">
            <h1>1.{{ t('Save.components.Does.5rgb1lt1m900') }}</h1>
            <div>
                {{ t('Save.components.Does.5rgb1lt1mbs0') }}
            </div>
            <div class="image">
                <j-image width="100%" :src="img5" />
            </div>
            <h1>2.{{ t('Save.components.Does.explain') }}</h1>
            <div>1、{{ t('Save.components.Does.integration') }}</div>
            <div>
                {{ t('Save.components.Does.5rgb1lt1mm80') }}
            </div>
            <div>2、{{ t('Save.components.Does.API') }}</div>
            <div>
                {{ t('Save.components.Does.5rgb1lt1mp00') }}
            </div>
            <div>3、{{ t('Save.components.Does.APIService') }}</div>
            <div>
                {{ t('Save.components.Does.5rgb1lt1mrs0') }}
            </div>
            <div>
                {{ t('Save.components.Does.5rgb1lt1kmo0') }}
            </div>
            <div>
               {{ t('Save.components.Does.5rgb1lt1kz40') }}
            </div>
            <div>4、{{ t('Save.components.Does.enter') }}</div>
            <div>
                {{ t('Save.components.Does.5rgb1lt1ldc0') }}
            </div>
        </div>
        <div v-show="props.type === 'wechat-miniapp'">
            <div class="url">
                小程序开放平台:
                <a
                    href="https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-login/code2Session.html"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-login/code2Session.html
                </a>
            </div>
            <h1>1.概述</h1>
            <div>配置成功后，平台用户可以在微信小程序中授权登录<span>物联网平台</span></div>
            <div class="image">
                <j-image width="100%" :src="img6" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getImage } from '@/utils/comm';
import type { applyType } from '../typing';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps<{
    type: applyType;
}>();

const img1 = getImage('/apply/1.png');
const img2 = getImage('/apply/2.png');
const img3 = getImage('/apply/3.png');
const img4 = getImage('/apply/4.png');
const img5 = getImage('/apply/5.png');
const img6 = getImage('/apply/6.png');
</script>

<style lang="less" scoped>
.does-container {
    padding: 24px;
    overflow-y: auto;
    height: 100%;
    color: rgba(#000, 0.8);
    font-size: 14px;
    background-color: #fafafa;

    .url {
        padding: 8px 16px;
        color: #2f54eb;
        background-color: rgba(#a7bdf7, 0.2);
        word-wrap: break-word;
    }

    h1 {
        margin: 16px 0;
        color: rgba(#000, 0.85);
        font-weight: bold;
        font-size: 14px;

        &:first-child {
            margin-top: 0;
        }
    }

    h2 {
        margin: 6px 0;
        color: rgba(0, 0, 0, 0.8);
        font-size: 14px;
    }

    .image {
        margin: 16px 0;
    }
}
</style>
