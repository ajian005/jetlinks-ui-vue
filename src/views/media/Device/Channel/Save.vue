<!-- Modal 弹窗，用于新增、修改数据 -->
<template>
    <j-modal
        v-model:visible="_vis"
        :title="!!formData.id ? t('Device.Channel.Save.5rg8b3d7nhk0') : t('Device.Channel.Save.5rg8b3d7rtk0')"
        width="650px"
        :cancelText="t('Device.Channel.Save.5rg8b3d7s9c0')"
        :okText="t('Device.Channel.Save.5rg8b3d7shk0')"
        @ok="handleSubmit"
        @cancel="handleCancel"
        :confirmLoading="loading"
    >
        <j-form ref="formRef" :model="formData" layout="vertical">
            <j-row :gutter="10">
                <j-col :span="12">
                    <j-form-item
                        name="channelId"
                        :rules="[
                            {
                                max: 64,
                                message: t('Device.Channel.Save.5rg8b3d7sqk0'),
                            },
                            {
                                validator: validateChannelId,
                            },
                        ]"
                    >
                        <template #label>
                            {{t('Device.Channel.Save.5rg8b3d7t4w0')}}
                            <j-tooltip :title="t('Device.Channel.Save.5rg8b3d7te80')">
                                <AIcon
                                    type="QuestionCircleOutlined"
                                    style="margin-left: 2px"
                                />
                            </j-tooltip>
                        </template>
                        <j-input
                            v-model:value="formData.channelId"
                            :disabled="!!formData.id"
                            :placeholder="t('Device.Channel.Save.5rg8b3d7tr40')"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="12">
                    <j-form-item
                        name="name"
                        :label="t('Device.Channel.Save.5rg8b3d7u280')"
                        :rules="[
                            { required: true, message: t('Device.Channel.Save.5rg8b3d7ufs0') },
                            { max: 64, message: t('Device.Channel.Save.5rg8b3d7sqk0') },
                        ]"
                    >
                        <j-input
                            v-model:value="formData.name"
                            :placeholder="t('Device.Channel.Save.5rg8b3d7ufs0')"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="24" v-if="route.query.type === 'gb28181-2016'">
                    <j-form-item
                        :label="t('Device.Channel.Save.5rg8b3d7upc0')"
                        name="manufacturer"
                        :rules="[
                            { required: false, message: '' },
                            { max: 64, message: t('Device.Channel.Save.5rg8b3d7sqk0') },
                        ]"
                    >
                        <j-input
                            v-model:value="formData.manufacturer"
                            :placeholder="t('Device.Channel.Save.5rg8b3d7v140')"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="24" v-if="route.query.type === 'fixed-media'">
                    <j-form-item
                        name="media_url"
                        :rules="[
                            { required: true, message: t('Device.Channel.Save.5rg8b3d7vl00') },
                            { max: 128, message: t('Device.Channel.Save.5rg8b3d7vwo0') },
                            {
                                validator: validateUrl,
                            },
                        ]"
                    >
                        <template #label>
                            {{t('Device.Channel.Save.5rg8b3d7w9g0')}}
                            <j-tooltip
                                :title="t('Device.Channel.Save.5rg8b3d7wkc0')"
                            >
                                <AIcon
                                    type="QuestionCircleOutlined"
                                    style="margin-left: 2px"
                                />
                            </j-tooltip>
                        </template>
                        <j-input
                            v-model:value="formData.media_url"
                            :placeholder="t('Device.Channel.Save.5rg8b3d7vl00')"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="12">
                    <j-form-item
                        name="media_username"
                        :label="t('Device.Channel.Save.5rg8b3d7ws00')"
                        :rules="{ max: 64, message: t('Device.Channel.Save.5rg8b3d7sqk0') }"
                    >
                        <j-input
                            v-model:value="formData.media_username"
                            :placeholder="t('Device.Channel.Save.5rg8b3d7wz00')"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="12">
                    <j-form-item
                        name="media_password"
                        :label="t('Device.Channel.Save.5rg8b3d7x6k0')"
                        :rules="{ max: 64, message: t('Device.Channel.Save.5rg8b3d7sqk0') }"
                    >
                        <j-input-password
                            v-model:value="formData.media_password"
                            :placeholder="t('Device.Channel.Save.5rg8b3d7xfs0')"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="24">
                    <j-form-item
                        name="address"
                        :label="t('Device.Channel.Save.5rg8b3d7xns0')"
                        :rules="{ max: 64, message: t('Device.Channel.Save.5rg8b3d7sqk0') }"
                    >
                        <j-input
                            v-model:value="formData.address"
                            :placeholder="t('Device.Channel.Save.5rg8b3d7xso0')"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="24" v-if="route.query.type === 'gb28181-2016'">
                    <j-form-item :label="t('Device.Channel.Save.5rg8b3d7xzo0')" name="ptzType">
                        <j-select
                            v-model:value="formData.ptzType"
                            :options="[
                                { label: t('Device.Channel.Save.5rg8b3d7y3o0'), value: 0 },
                                { label: t('Device.Channel.Save.5rg8b3d7y7g0'), value: 1 },
                                { label: t('Device.Channel.Save.5rg8b3d7yc00'), value: 2 },
                                { label: t('Device.Channel.Save.5rg8b3d7yg80'), value: 3 },
                                { label: t('Device.Channel.Save.5rg8b3d7ynk0'), value: 4 },
                            ]"
                            :placeholder="t('Device.Channel.Save.5rg8b3d7ys00')"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="24">
                    <j-form-item name="description" :label="t('Device.Channel.Save.5rg8b3d7z180')">
                        <j-textarea
                            v-model:value="formData.description"
                            :rows="4"
                            :maxlength="200"
                            showCount
                        />
                    </j-form-item>
                </j-col>
            </j-row>
        </j-form>
    </j-modal>
</template>

<script setup lang="ts">
import ChannelApi from '@/api/media/channel';
import { PropType } from 'vue';
import type { Rule } from 'ant-design-vue/es/form';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute();

type Emits = {
    (e: 'update:visible', data: boolean): void;
    (e: 'submit'): void;
};

const emit = defineEmits<Emits>();

const props = defineProps({
    visible: { type: Boolean, default: false },
    channelData: {
        type: Object as PropType<Partial<Record<string, any>>>,
        default: () => ({}),
    },
});

const _vis = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val),
});

const formRef = ref();
const formData = ref({
    id: undefined,
    address: '',
    channelId: '',
    description: '',
    deviceId: route.query.id,
    name: '',
    manufacturer: '',
    ptzType: '',
    // 以下字段, 提交时需提取到others字段当中
    media_password: '',
    media_url: '',
    media_username: '',
});

const loading = ref<boolean>(false)
watch(
    () => props.channelData,
    (val: any) => {
        console.log('val: ', val);
        const {
            id,
            address,
            channelId,
            description,
            deviceId,
            name,
            manufacturer,
            ptzType,
            others,
            ...extra
        } = val;
        formData.value = {
            id,
            address,
            channelId,
            description,
            deviceId,
            name,
            manufacturer,
            ptzType: ptzType?.value || 0,
            ...others,
        };
    },
    { deep: true },
);

/**
 * 通道ID字段验证是否存在
 * @param _rule
 * @param value
 */
const validateChannelId = async (_rule: Rule, value: string) => {
    // ID非必填, 没有输入ID时, 不校验ID是否存在
    if (!value) return;
    // 编辑时不校验唯一性
    if(!!formData.value?.id) return;
    const { result } = await ChannelApi.validateField({
        deviceId: route.query.id,
        channelId: value,
    });

    if (!result.passed) {
        return Promise.reject(t('Device.Channel.Save.5rg8b3d7z5c0'));
    } else {
        return Promise.resolve();
    }
};

/**
 * 校验视频地址
 * @param _rule
 * @param value
 */
const validateUrl = async (_rule: Rule, value: string) => {
    console.log('value: ', value);
    const reg = /(http|https|rtsp|rtmp):\/\/([\w.]+\/?)\S*/;
    return new Promise((resolve, reject) => {
        reg.test(value) || !value
            ? resolve('')
            : reject(t('Device.Channel.Save.5rg8b3d7za00'));
    });
};

/**
 * 提交
 */
const handleSubmit = () => {
    formRef.value
        .validate()
        .then(async () => {
            loading.value = true;
            const {
                media_url,
                media_password,
                media_username,
                manufacturer,
                // ptzType,
                ...extraFormData
            } = formData.value;
            if (media_url || media_password || media_username) {
                extraFormData.others = {
                    media_url,
                    media_password,
                    media_username,
                };
            }
            const res = formData.value.id
                ? await ChannelApi.update(formData.value.id, extraFormData).finally(() => {loading.value = false;})
                : await ChannelApi.save(extraFormData).finally(() => {loading.value = false;});
            if (res.success) {
                onlyMessage(t('Device.Channel.Save.5rg8b3d7zes0'));
                _vis.value = false;
                loading.value = false;
                emit('submit');
            } else {
                loading.value = false;
                onlyMessage(t('Device.Channel.Save.5rg8b3d7zks0'), 'error');
            }
        })
        .catch((err: any) => {
            loading.value = false;
            console.log('err: ', err);
        });
};
const handleCancel = () => {
    _vis.value = false;
};
watch(
    () => _vis.value,
    (val) => {
        if (!val) {
            formRef.value?.resetFields(); // resetFields没有生效
            // 以下字段非表单所填, 重置字段需手动置空
            Object.keys(formData.value).forEach((key: string) => {
                if (key === 'id') formData.value.id = undefined;
                else if (key === 'deviceId')
                    formData.value.deviceId = route.query.id;
                else formData.value[key] = '';
            });
        }
    },
);
</script>
