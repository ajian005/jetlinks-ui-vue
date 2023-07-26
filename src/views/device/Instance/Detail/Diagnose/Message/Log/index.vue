<template>
    <div class="log-item" :key="data.id">
        <div class="log-card">
            <div class="log-icon" @click="visible = !visible">
                <AIcon :type="visible ? 'DownOutlined' : 'RightOutlined'" />
            </div>
            <div class="log-box">
                <div class="log-header">
                    <div class="log-title">
                        <j-tag color="error">ERROR</j-tag>
                        {{ operationMap.get(data.operation) }}
                    </div>
                    <div class="log-time">
                        {{ dayjs(data.endTime).format('YYYY-MM-DD HH:mm:ss') }}
                    </div>
                </div>
                <div className="log-editor" v-if="visible">
                    <j-textarea
                        autoSize
                        :bordered="false"
                        :value="data?.detail"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const operationMap = new Map();
operationMap.set('connection', t('Message.Log.index.5rcyfoe9hqo0'));
operationMap.set('auth', t('Message.Log.index.5rcyfoe9jk00'));
operationMap.set('decode', t('Message.Log.index.5rcyfoe9juc0'));
operationMap.set('encode', t('Message.Log.index.5rcyfoe9k180'));
operationMap.set('request', t('Message.Log.index.5rcyfoe9kak0'));
operationMap.set('response', t('Message.Log.index.5rcyfoe9ki00'));
operationMap.set('downstream', t('Message.Log.index.5rcyfoe9koc0'));
operationMap.set('upstream', t('Message.Log.index.5rcyfoe9ku80'));

const visible = ref<boolean>(false);

const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});
</script>

<style lang="less" scoped>
.log-item {
    display: flex;
    justify-content: flex-start;
    width: 100%;
    padding-bottom: 12px;

    .log-card {
        display: flex;
        width: 100%;
        background-color: #fff;

        .log-icon {
            margin-right: 10px;
            color: rgba(0, 0, 0, 0.75);
            font-weight: 500;
            font-size: 12px;
        }

        .log-box {
            display: flex;
            flex-direction: column;
            width: 100%;

            .log-header {
                .log-title {
                    color: rgba(0, 0, 0, 0.75);
                    font-weight: 700;
                    font-size: 14px;
                }

                .log-time {
                    color: rgba(0, 0, 0, 0.65);
                    font-size: 12px;
                }
            }

            .log-editor {
                width: 100%;
                margin-top: 10px;
                color: rgba(0, 0, 0, 0.75);

                textarea {
                    color: black !important;
                    background-color: #fafafa !important;
                }

                textarea::-webkit-scrollbar {
                    width: 5px !important;
                }
            }
        }
    }
}
</style>