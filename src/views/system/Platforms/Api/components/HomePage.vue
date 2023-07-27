<template>
    <div class="home">
        <h1>{{t('Api.components.HomePage.5rga3xywvvk0')}}</h1>
        <div style="color: #666666">
            {{t('Api.components.HomePage.5rga3xywxi80')}}
            HTTP {{t('Api.components.HomePage.5rga3xywxrc0')}} 。
        </div>
        <h2>{{t('Api.components.HomePage.5rga3xywxws0')}}</h2>
        <div class="h2-text">1. {{t('Api.components.HomePage.5rga3xyx1gw0')}}</div>
        <div class="h2-text">
            2. {{t('Api.components.HomePage.5rga3xyx2uo0')}}
        </div>
        <div
            style="
                display: flex;
                border: 1px solid #e6e6e6;
                padding: 15;
                justify-content: space-between;
            "
        >
            <div>
                <h3>{{t('Api.components.HomePage.5rga3xyx3ds0')}}</h3>
                <p>
                    {{t('Api.components.HomePage.5rga3xyx5940')}}
                </p>
                <div class="div-border">
                    <div class="h3-text">
                        {{t('Api.components.HomePage.ascii')}} pageIndex=0&pageSize=20
                    </div>
                    <div class="h3-text">
                        {{t('Api.components.HomePage.Secretkey')}}
                        pageIndex=0&pageSize=201574993804802testSecure
                    </div>
                    <div class="h3-text">
                        {{t('Api.components.HomePage.5rga3xyx5l40')}}
                    </div>
                </div>
                <h3>{{t('Api.components.HomePage.5rga3xyx5s40')}}</h3>
                <div class="div-border">
                    <div class="h3-text">
                        GET /api/device?pageIndex=0&amp;pageSize=20
                    </div>
                    <div class="h3-text">X-Client-Id: testId</div>
                    <div class="h3-text">X-Timestamp: 1574993804802</div>
                    <div class="h3-text">
                        X-Sign: 837fe7fa29e7a5e4852d447578269523
                    </div>
                </div>
                <h3>{{t('Api.components.HomePage.5rga3xyx5x00')}}</h3>
                <div class="div-border">
                    <div class="h3-text">xxx</div>
                    <div class="h3-text">HTTP/1.1 200 OK</div>
                    <div class="h3-text">X-Timestamp: 1574994269075</div>
                    <div class="h3-text">
                        X-Sign: c23faa3c46784ada64423a8bba433f25
                    </div>
                    <div class="h3-text">status:200,result:[ ]</div>
                </div>
            </div>
            <div style="width: 50%">
                <h3>{{t('Api.components.HomePage.5rga3xyx6ak0')}}</h3>
                <div>
                    <j-pro-table
                        :dataSource="data"
                        model="TABLE"
                        noPagination
                        :columns="[
                            {
                                title: t('Api.components.HomePage.5rga3xyx6g00'),
                                dataIndex: 'type',
                            },
                            {
                                title: t('Api.components.HomePage.5rga3xyx6ak0'),
                                dataIndex: 'data',
                            },
                        ]"
                    />
                </div>
            </div>
        </div>
        <div
            :style="{
                display: 'flex',
                border: '1px solid #e6e6e6',
                padding: 15,
                justifyContent: 'space-between',
                marginTop: 20,
            }"
        >
            <div>
                <h3>{{t('Api.components.HomePage.5rga3xyx6lc0')}}</h3>
                <div>
                    <img :src="getImage('/apiHome.png')" style="width: 80%" />
                </div>
            </div>
            <div style="width: 505px">
                <h3>{{t('Api.components.HomePage.5rga3xyx6q80')}}</h3>
                <div>
                    <p>{{t('Api.components.HomePage.5rga3xyx7es0')}}</p>
                    <div>
                        <j-monaco-editor
                            language="java"
                            style="height: 370px"
                            theme="vs-dark"
                            v-model:modelValue="javaStr1"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div>
            <h2>{{ t('Api.components.HomePage.SDK') }}</h2>
            <div class="div-border">
                <div class="h3-text">
                    {{ t('Api.components.HomePage.SDKTip') }}
                </div>
            </div>

            <h3>{{t('Api.components.HomePage.5rga3xyx7nw0')}} SDK {{t('Api.components.HomePage.5rga3xyx7t80')}}</h3>
            <div class="h3-text">{{t('Api.components.HomePage.5rga3xyx88k0')}}</div>
            <div>
                <j-monaco-editor
                    language="java"
                    style="height: 370px"
                    theme="vs-dark"
                    v-model:modelValue="javaStr2"
                />
            </div>
            <h3>SDK {{t('Api.components.HomePage.5rga3xyx8no0')}}</h3>
            <div>
                <j-monaco-editor
                    language="java"
                    style="height: 370px"
                    theme="vs-dark"
                    v-model:modelValue="javaStr"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getImage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const data = [
    {
        key: '1',
        type: 'clientId',
        data: 'testId',
    },
    {
        key: '2',
        type: 'secureKey',
        data: 'testSecure',
    },
    {
        key: '3',
        type: t('Api.components.HomePage.5rga3xyx8z40'),
        data: '/api/v1/device/dev0001/log/_query',
    },
    {
        key: '4',
        type: t('Api.components.HomePage.5rga3xyx9580'),
        data: 'GET',
    },
    {
        key: '5',
        type: t('Api.components.HomePage.5rga3xyx9hw0'),
        data: 'pageSize=20&pageIndex=0',
    },
    {
        key: '6',
        type: t('Api.components.HomePage.5rga3xyx9n00'),
        data: 'MD5',
    },
    {
        key: '7',
        type: t('Api.components.HomePage.5rga3xyxals0'),
        data: '1574993804802 ',
    },
];
const javaStr1 = `String secureKey = ...; //密钥\r\nString responseBody = ...;//服务端响应结果\r\nString timestampHeader = ...;//响应头: X-Timestamp\r\nString signHeader = ...; //响应头: X-Sign\r\n\r\nString sign = DigestUtils.md5Hex(responseBody+timestampHeader+secureKey);\r\nif(sign.equalsIgnoreCase(signHeader)){\r\n //验签通过\r\n}`;
const javaStr2 =
    '<dependency>\r\n    <groupId>org.jetlinks.sdk</groupId>\r\n    <artifactId>api-sdk</artifactId>\r\n    <version>1.0.0</version>\r\n</dependency>';
const javaStr =
    '\r\n        //服务器的baseUrl\r\n        String baseUrl = "http://localhost:9000/jetlinks";\r\n  //客户端Id\r\n        String clientId = "aSoq98aAxzP";\r\n  //访问秘钥\r\n        String secureKey = "DaYsxpiWSfdTAPJyKW8rP2WAGyWErnsR";\r\n\r\n        ClientConfig clientConfig = new ClientConfig(baseUrl, clientId, secureKey);\r\n\r\n        ApiClient client = new WebApiClient(clientConfig);\r\n\r\nApiResponse < PagerResult < DeviceInfo >> response = client\r\n    .request(QueryDeviceRequest\r\n        .of(query -> query\r\n            .where("productId", "demo-device")\r\n            .doPaging(0, 100)));';
</script>

<style lang="less" scoped>
.home {
    padding: 20px;

    h1 {
        font-weight: 600;
        font-size: 20px;
    }

    h2 {
        font-weight: 600;
        font-size: 18px;
    }

    .h2-text {
        color: #999;
    }

    h3 {
        margin-top: 10px;
        font-weight: 600;
        font-size: 16px;
    }

    .h3-text {
        max-width: 530px;
        margin-top: 3px;
        color: #999;
    }

    p {
        color: #666;
    }

    .div-border {
        padding: 10px;
        border-left: 10px solid #eee;
    }
}
</style>
