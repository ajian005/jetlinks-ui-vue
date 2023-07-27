<template>
    <div v-if="type === 'onelink'" class="doc">
        <div class="url">
            {{t('Platform.doc.index.5rgbkd1fs9s0')}}
            <a
                style="word-break: break-all"
                href="https://api.iot.10086.cn/api/index.html#/login"
                target="_blank"
                rel="noreferrer"
            >
                https://api.iot.10086.cn/api/index.html#/login
            </a>
        </div>
        <h1>1.{{t('Platform.doc.index.summarize')}}</h1>
        <p>
            {{t('Platform.doc.index.5rgbkd1ftjg0')}}
        </p>
        <h1>2.{{t('Platform.doc.index.explain')}}</h1>
        <h2>1、APP ID</h2>
        <p>
            {{t('Platform.doc.index.5rgbkd1ftps0')}}
            <br />
            {{t('Platform.doc.index.5rgbkd1ftx00')}}
        </p>
        <div class="image">
            <j-image
                width="100%"
                :src="getImage('/iot-card/onelink-appid.png')"
            />
        </div>
        <h2>2、Password</h2>
        <p>
            {{t('Platform.doc.index.5rgbkd1fu0c0')}}
            <br />
            {{t('Platform.doc.index.5rgbkd1ftx00')}}
        </p>
        <div class="image">
            <j-image
                width="100%"
                :src="getImage('/iot-card/onelink-pass.png')"
            />
        </div>
        <h2>3、{{t('Platform.doc.index.portAddress')}}</h2>
        <p>
            https://api.iot.10086.cn/v5/ec/get/token
            <br />
            {{t('Platform.doc.index.writeToken')}}
            <br />
            {{t('Platform.doc.index.example')}}https://api.iot.10086.cn/v5/authService?appid=xxx&password=xxx&transid=xxx
        </p>
    </div>

    <div v-if="type === 'ctwing'" class="doc">
        <div class="url">
            {{t('Platform.doc.index.platform')}}
            <a
                style="word-break: break-all"
                href="https://cmp.ctwing.cn:4821/login"
                target="_blank"
                rel="noreferrer"
            >
                https://cmp.ctwing.cn:4821/login
            </a>
        </div>
        <div>
            <h1>1.{{t('Platform.doc.index.summarize')}}</h1>
            <p>
                {{t('Platform.doc.index.5rgbkd1ftjg0')}}
            </p>
            <h1>2.{{t('Platform.doc.index.explain')}}</h1>
            <h2>1、{{t('Platform.doc.index.userID')}}</h2>
            <p>
                {{t('Platform.doc.index.platformTip')}}
                <br />
                {{t('Platform.doc.index.5rgbkd1fu5o0')}}
            </p>
            <div class="image">
                <j-image
                    width="100%"
                    :src="getImage('/iot-card/ctwing-id.png')"
                />
            </div>

            <h2>2、{{t('Platform.doc.index.pwd')}}</h2>
            <p>
                {{t('Platform.doc.index.5rgbkd1fu9s0')}}
                <br />
                {{t('Platform.doc.index.5rgbkd1fu5o0')}}
            </p>
            <div class="image">
                <j-image
                    width="100%"
                    :src="getImage('/iot-card/ctwing-pass.png')"
                />
            </div>

            <h2>3、secretKey</h2>
            <p>
                {{t('Platform.doc.index.secretKeyTip')}}
                <br />
                {{t('Platform.doc.index.5rgbkd1fu5o0')}}
            </p>
            <div class="image">
                <j-image
                    width="100%"
                    :src="getImage('/iot-card/ctwing-secret.png')"
                />
            </div>
        </div>
    </div>

    <div v-if="type === 'unicom'" class="doc">
        <div class="url">
            {{t('Platform.doc.index.5rgbkd1fuc80')}}
            <a
                style="word-break: break-all"
                href="  https://cmp.10646.cn/webframe/login"
                target="_blank"
                rel="noreferrer"
            >
                https://cmp.10646.cn/webframe/login
            </a>
        </div>

        <div>
            <h1>1.{{t('Platform.doc.index.summarize')}}</h1>
            <p>
                {{t('Platform.doc.index.5rgbkd1ftjg0')}}
            </p>
            <h1>2.{{t('Platform.doc.index.explain')}}</h1>
            <h2>1、APP ID</h2>
            <p>
                {{t('Platform.doc.index.5rgbkd1fues0')}}
                <br />
                {{t('Platform.doc.index.5rgbkd1fuhk0')}}
            </p>
            <div class="image">
                <j-image
                    width="100%"
                    :src="getImage('/iot-card/unicom-id.png')"
                />
            </div>

            <h2>2、App Secret</h2>
            <p>
                {{t('Platform.doc.index.5rgbkd1fuk00')}}
                <br />
                {{t('Platform.doc.index.5rgbkd1fuhk0')}}
            </p>
            <div class="image">
                <j-image
                    width="100%"
                    :src="getImage('/iot-card/unicom-secret.png')"
                />
            </div>

            <h2>3、{{t('Platform.doc.index.creatorID')}}</h2>
            <p>
                {{t('Platform.doc.index.5rgbkd1fums0')}}
                <br />
                {{t('Platform.doc.index.5rgbkd1fuhk0')}}
                <br />
            </p>
            <div class="image">
                <j-image
                    width="100%"
                    :src="getImage('/iot-card/unicom-openid.png')"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getImage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
    type: { type: String, default: 'onelink' },
});
</script>

<style scoped lang="less">
.doc {
    height: 800px;
    padding: 24px;
    overflow-y: auto;
    color: rgba(#000, 0.8);
    font-size: 14px;
    background-color: #fafafa;

    .url {
        padding: 8px 16px;
        color: #2f54eb;
        background-color: rgba(#a7bdf7, 0.2);
    }

    h1 {
        margin: 16px 0;
        color: rgba(#000, 0.85);
        font-weight: bold;
        font-size: 14px;

        // &:first-child {
        //     margin-top: 0;
        // }
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
