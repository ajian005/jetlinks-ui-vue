<template>
    <div>
        <img
            class="init-data-img"
            @click="showModal"
            :src="
                flag
                    ? getImage('/init-home/data-enabled.png')
                    : getImage('/init-home/data-disabled.png')
            "
        />
    </div>
    <!-- 初始数据提交表单 -->
    <j-modal
        v-model:visible="visible"
        :title="t('init-home.InitData.index.5rlbndz7cn40')"
        width="52vw"
        :maskClosable="false"
        @cancel="cancel"
        @ok="handelSave"
        :okText="t('init-home.InitData.index.5rlbndz7dpk0')"
        :cancelText="t('init-home.InitData.index.5rlbndz7dxo0')"
        class="modal-style"
        v-bind="layout"
    >
        <div class="data-content">
            <p class="data-p-style">
                <ExclamationCircleOutlined style="margin: 0 0 0 5px" />
                {{t('init-home.InitData.index.5rlbndz7e4w0')}}
                {{t('init-home.InitData.index.5rlbndz7eg40')}}
            </p>
        </div>
        <div style="margin-top: 20px">
            <j-form
                layout="vertical"
                :model="modalForm"
                ref="formRef"
                :rules="rulesModle"
            >
                <j-row :span="24" :gutter="24">
                    <j-col :span="12">
                        <j-form-item name="host">
                            <template #label>
                                <span>{{t('init-home.InitData.index.5rlbndz7en40')}} </span>
                                <j-tooltip
                                    :title="t('init-home.InitData.index.localAddress')"
                                >
                                    <img
                                        class="img-style"
                                        :src="getImage('/init-home/mark.png')"
                                    />
                                </j-tooltip>
                            </template>
                            <j-input
                                v-model:value="modalForm.host"
                                :disabled="true"
                            />
                        </j-form-item>
                        <j-form-item name="publicHost">
                            <template #label>
                                <span>{{t('init-home.InitData.index.5rlbndz7esk0')}} </span>
                                <j-tooltip
                                    :title="t('init-home.InitData.index.5rlbndz7ey40')"
                                >
                                    <img
                                        class="img-style"
                                        :src="getImage('/init-home/mark.png')"
                                    />
                                </j-tooltip>
                            </template>
                            <j-input v-model:value="modalForm.publicHost" :placeholder="t('init-home.InitData.index.5rlbndz7f4s0')">
                            </j-input>
                        </j-form-item>
                    </j-col>
                    <j-col :span="12">
                        <j-form-item name="port">
                            <template #label>
                                <span>{{t('init-home.InitData.index.5rlbndz7fb00')}} </span>
                                <j-tooltip :title="t('init-home.InitData.index.5rlbndz7fgc0')">
                                    <img
                                        class="img-style"
                                        :src="getImage('/init-home/mark.png')"
                                    />
                                </j-tooltip>
                            </template>
                            <j-select v-model:value="modalForm.port" :placeholder="t('init-home.InitData.index.5rlbndz7fm40')" show-search>
                                <j-select-option
                                    v-for="item in optionPorts"
                                    :key="item"
                                    :value="item.value"
                                    :label="item.label"
                                    >{{ item.label }}</j-select-option
                                >
                            </j-select>
                        </j-form-item>
                        <j-form-item name="publicPort">
                            <template #label>
                                <span>{{t('init-home.InitData.index.5rlbndz7fy00')}} </span>
                                <j-tooltip :title="t('init-home.InitData.index.5rlbndz7g400')">
                                    <img
                                        class="img-style"
                                        :src="getImage('/init-home/mark.png')"
                                    />
                                </j-tooltip>
                            </template>
                            <j-input-number
                                v-model:value="modalForm.publicPort"
                                :placeholder="t('init-home.InitData.index.5rlbndz7g9w0')"
                                style="width: 100%"
                            />
                        </j-form-item>
                    </j-col>
                </j-row>
            </j-form>
        </div>
    </j-modal>
</template>

<script lang="ts" setup>
import { getImage, onlyMessage } from '@/utils/comm';
import {
    saveNetwork,
    getResourcesCurrent,
    saveProtocol,
    getProtocol,
    saveAccessConfig,
    saveProduct,
    saveDevice,
    changeDeploy,
    deployDevice,
} from '@/api/initHome';
import { modalState } from '../data/interface';
import type { Rule } from 'ant-design-vue/es/form';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const formRef = ref();
/**
 * 初始化数据状态
 */
const flag = ref<boolean>(false);
const visible = ref<boolean>(false);
/**
 * 初始化弹窗表单数据
 */
const modalForm = reactive<modalState>({
    host: '0.0.0.0',
});
/**
 * 校验官网地址
 */
const validateUrl = async (_rule: Rule, value: string) => {
    if (!value) {
        return Promise.reject(t('init-home.InitData.index.5rlbndz7f4s0'));
    } else {
        var reg = new RegExp(
            /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/,
        );
        if (!reg.test(value)) {
            return Promise.reject(t('init-home.InitData.index.5rlbndz7gfw0'));
        }
        return Promise.resolve();
    }
};
/**
 * 校验数字
 */
const validateNumber = async (_rule: Rule, value: string) => {
    if (!value) {
        return Promise.reject(t('init-home.InitData.index.5rlbndz7g9w0'));
    } else {
        if (Number(value) < 1 || Number(value) > 65535) {
            return Promise.reject(t('init-home.InitData.index.5rlbndz7glo0'));
        }
        return Promise.resolve();
    }
};
const rulesModle = ref({
    host: [
        {
            required: true,
            message: t('init-home.InitData.index.5rlbndz7gw40'),
        },
    ],
    port: [
        {
            required: true,
            message: t('init-home.InitData.index.5rlbndz7fm40'),
        },
    ],
    publicHost: [
        {
            required: true,
            validator: validateUrl,
            trigger: 'change',
        },
    ],
    publicPort: [
        {
            required: true,
            validator: validateNumber,
            trigger: 'change',
        },
    ],
});

/**
 * 初始数据弹窗点击事件
 */
const showModal = () => {
    if (flag.value) {
        flag.value = false;
    } else {
        visible.value = true;
    }
};
/**
 * 表单取消事件
 */
const cancel = () => {
    formRef.value.resetFields();
};
/**
 * 提交初始化数据
 */
const initialization = reactive({
    isSucessInit: 0,
    optionPorts: [],
    /**
     * 查询端口数据
     */
    getCurrentPort: async () => {
        const resp = await getResourcesCurrent();
        const current = resp?.result;
        const _host =
            current.find((item: any) => item.host === '0.0.0.0')?.ports[
                'TCP'
            ] || [];
        initialization.optionPorts = _host?.map((p: any) => ({
            label: p,
            value: p,
        }));
    },
});
/**
 * 提交初始数据表单
 */

const saveCurrentData = () => {
    return new Promise(async (resolve) => {
        if (!flag.value) {
            return resolve(true);
        }
        formRef.value
            .validate()
            .then(async () => {
                try {
                    // 新增网络组件
                    const network = await saveNetwork({
                        type: 'MQTT_SERVER',
                        shareCluster: true,
                        name: 'MQTT网络组件',
                        configuration: {
                            host: '0.0.0.0',
                            secure: false,
                            port: modalForm.port,
                            publicHost: modalForm.publicHost,
                            publicPort: modalForm.publicPort,
                            maxMessageSize:8192,
                        },
                    });
                    // 保存协议
                    const protocol = await saveProtocol();
                    let protocolItem: any = undefined;
                    if (protocol.status === 200) {
                        const proid = await getProtocol();
                        if (proid.status === 200) {
                            protocolItem = (proid?.result || []).find(
                                (it: any) => it.name === 'JetLinks官方协议',
                            );
                        }
                    }
                    // 新增设备接入网关
                    const accessConfig = await saveAccessConfig({
                        name: 'MQTT类型设备接入网关',
                        provider: 'mqtt-server-gateway',
                        protocol: protocolItem?.id,
                        transport: 'MQTT',
                        channel: 'network',
                        channelId: network?.result?.id,
                    });
                    // 新增产品
                    const product = await saveProduct({
                        name: 'MQTT产品',
                        messageProtocol: protocolItem?.id,
                        protocolName: protocolItem?.name,
                        transportProtocol: 'MQTT',
                        deviceType: 'device',
                        accessId: accessConfig.result?.id,
                        accessName: accessConfig.result?.name,
                        accessProvider: 'mqtt-server-gateway',
                    });
                    // 新增设备
                    const device = await saveDevice({
                        name: 'MQTT设备',
                        productId: product?.result?.id,
                        productName: product?.result?.name,
                    });
                    if (device.status === 200) {
                        await changeDeploy(product.result.id);
                        await deployDevice(device.result.id);
                    }
                    resolve(device.status == 200);
                } catch (e) {
                    resolve(false);
                }
            })
            .catch(() => {
                resolve(false);
            });
    });
};
const { optionPorts, isSucessInit } = toRefs(initialization);
const handelSave = () => {
    formRef.value.validate().then(() => {
        onlyMessage('保存成功');
        flag.value = true;
        visible.value = false;
    });
};
/**
 * 初始化
 */
initialization.getCurrentPort();
defineExpose({
    save: saveCurrentData,
});
</script>
<style lang="less" scoped>
.init-data-img {
    width: 300px;
}
.modal-style {
    .data-content {
        background: rgb(236, 237, 238);
        .data-p-style {
            padding: 10px;
        }
    }
}
</style>