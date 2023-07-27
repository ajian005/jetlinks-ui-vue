<template lang="">
    <j-modal
        :title="data.id ? t('Channel.Save.index.5rg5orzohtk0') : t('Channel.Save.index.5rg5orzojf80')"
        :visible="true"
        width="700px"
        @cancel="handleCancel"
    >
        <j-form
            class="form"
            layout="vertical"
            :model="formData"
            name="basic"
            autocomplete="off"
            :rules="FormValidate"
            ref="formRef"
        >
            <j-form-item :label="t('Channel.Save.index.5rg5orzojq40')" name="name">
                <j-input
                    :placeholder="t('Channel.Save.index.5rg5orzojyo0')"
                    v-model:value="formData.name"
                />
            </j-form-item>
            <j-form-item :label="t('Channel.Save.index.5rg5orzok780')" name="provider">
                <j-select
                    style="width: 100%"
                    v-model:value="formData.provider"
                    :options="providersList"
                    :placeholder="t('Channel.Save.index.5rg5orzokfc0')"
                    allowClear
                    show-search
                    :filter-option="filterOption"
                    :disabled="!!id"
                />
            </j-form-item>
            <j-form-item
                v-if="formData.provider === 'MODBUS_TCP'"
                :name="['configuration', 'host']"
                :rules="FormValidate.host"
            >
                <template #label>
                    {{t('Channel.Save.index.ip')}}
                    <j-tooltip :title="t('Channel.Save.index.5rg5orzokmc0')">
                        <AIcon
                            type="QuestionCircleOutlined"
                            style="margin-left: 2px"
                        />
                    </j-tooltip>
                </template>
                <j-input
                    :placeholder="t('Channel.Save.index.5rg5orzoktw0')"
                    v-model:value="formData.configuration.host"
                />
            </j-form-item>
            <j-form-item
                v-if="formData.provider === 'MODBUS_TCP'"
                :label="t('Channel.Save.index.5rg5orzol400')"
                :name="['configuration', 'port']"
                :rules="FormValidate.port"
            >
                <j-input-number
                    style="width: 100%"
                    :placeholder="t('Channel.Save.index.5rg5orzolb00')"
                    v-model:value="formData.configuration.port"
                    :min="0"
                    :max="65535"
                />
            </j-form-item>
            <j-form-item
                v-if="formData.provider === 'OPC_UA'"
                :label="t('Channel.Save.index.5rg5orzollo0')"
                :name="['configuration', 'endpoint']"
                :rules="FormValidate.endpoint"
            >
                <j-input
                    :placeholder="t('Channel.Save.index.5rg5orzolwg0')"
                    v-model:value="formData.configuration.endpoint"
                />
            </j-form-item>
            <j-form-item
                v-if="formData.provider === 'OPC_UA'"
                :label="t('Channel.Save.index.5rg5orzom400')"
                :name="['configuration', 'securityPolicy']"
                :rules="FormValidate.securityPolicy"
            >
                <j-select
                    style="width: 100%"
                    v-model:value="formData.configuration.securityPolicy"
                    :options="Options['security-policies']"
                    :placeholder="t('Channel.Save.index.5rg5orzome80')"
                    allowClear
                    show-search
                    :filter-option="filterOption"
                />
            </j-form-item>
            <j-form-item
                v-if="formData.provider === 'OPC_UA'"
                :label="t('Channel.Save.index.5rg5orzomlo0')"
                :name="['configuration', 'securityMode']"
                :rules="FormValidate.securityMode"
            >
                <j-select
                    style="width: 100%"
                    v-model:value="formData.configuration.securityMode"
                    :options="Options['security-modes']"
                    :placeholder="t('Channel.Save.index.5rg5orzoms00')"
                    allowClear
                    show-search
                    :filter-option="filterOption"
                />
            </j-form-item>
            <j-form-item
                v-if="isSecurityMode"
                :label="t('Channel.Save.index.5rg5orzomzc0')"
                :name="['configuration', 'certId']"
                :rules="FormValidate.certId"
            >
                <j-select
                    style="width: 100%"
                    v-model:value="formData.configuration.certId"
                    :options="certificateList"
                    :placeholder="t('Channel.Save.index.5rg5orzon740')"
                    allowClear
                    show-search
                    :filter-option="filterOption"
                />
            </j-form-item>
            <j-form-item
                v-if="formData.provider === 'OPC_UA'"
                :label="t('Channel.Save.index.5rg5orzoni80')"
                :name="['configuration', 'authType']"
                :rules="FormValidate.authType"
            >
                <j-card-select
                    :showImage="false"
                    v-model:value="formData.configuration.authType"
                    :options="Options['auth-types']"
                    @change="changeAuthType"
                    :column="2"
                />
            </j-form-item>
            <j-form-item
                v-if="isAuthType"
                :label="t('Channel.Save.index.5rg5orzonp00')"
                :name="['configuration', 'username']"
                :rules="FormValidate.username"
            >
                <j-input
                    :placeholder="t('Channel.Save.index.5rg5orzonyk0')"
                    v-model:value="formData.configuration.username"
                />
            </j-form-item>
            <j-form-item
                v-if="isAuthType"
                :label="t('Channel.Save.index.5rg5orzoo7k0')"
                :name="['configuration', 'password']"
                :rules="FormValidate.password"
            >
                <j-input-password
                    :placeholder="t('Channel.Save.index.5rg5orzoofk0')"
                    v-model:value="formData.configuration.password"
                />
            </j-form-item>
            <j-form-item :label="t('Channel.Save.index.5rg5orzooks0')" name="description">
                <j-textarea
                    :placeholder="t('Channel.Save.index.5rg5orzoops0')"
                    v-model:value="formData.description"
                    :maxlength="200"
                    :rows="3"
                    showCount
                />
            </j-form-item>
        </j-form>
        <template #footer>
            <j-button key="back" @click="handleCancel">{{t('Channel.Save.index.5rg5orzoouo0')}}</j-button>
            <PermissionButton
                key="submit"
                type="primary"
                :loading="loading"
                @click="handleOk"
                style="margin-left: 8px"
                :hasPermission="`DataCollect/Channel:${id ? 'update' : 'add'}`"
            >
                {{t('Channel.Save.index.5rg5orzooz80')}}
            </PermissionButton>
        </template>
    </j-modal>
</template>
<script lang="ts" setup>
import {
    save,
    update,
    queryOptionsList,
    queryCertificateList,
    getProviders,
} from '@/api/data-collect/channel';
import { FormValidate, FormState } from '../data';
import type { FormInstance } from 'ant-design-vue';
import type { FormDataType } from '../type.d';
import { cloneDeep, isArray } from 'lodash-es';
import { protocolList } from '@/utils/consts';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
    data: {
        type: Object,
        default: () => { },
    },
});

const emit = defineEmits(['change']);
const loading = ref(false);
const id = props.data.id;
const formRef = ref<FormInstance>();

const certificateList = ref([]);
const providersList = ref([]);
const Options = ref({
    'auth-types': [],
    'security-modes': [],
    'security-policies': [],
});

const formData = ref<FormDataType>(cloneDeep(FormState));

const handleOk = async () => {
    const params = await formRef.value?.validate();
    loading.value = true;
    const response = !id
        ? await save(params).catch(() => { })
        : await update(id, { ...props.data, ...params }).catch(() => { });
    emit('change', response?.status === 200);
    loading.value = false;
    formRef.value?.resetFields();
};

const handleCancel = () => {
    emit('change', false);
    formRef.value?.resetFields();
};

const changeAuthType = (value: Array<string>) => {
    formData.value.configuration.authType = value[0];
};

const isAuthType = computed(() => {
    const { authType } = formData.value.configuration;
    return isArray(authType)
        ? authType[0] === 'username' && formData.value.provider === 'OPC_UA'
        : authType === 'username' && formData.value.provider === 'OPC_UA';
});
const isSecurityMode = computed(() => {
    const { securityMode } = formData.value.configuration;
    return securityMode === 'SignAndEncrypt' || securityMode === 'Sign'
        ? true
        : false;
});

const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const getOptionsList = async () => {
    for (let key in Options.value) {
        const res: any = await queryOptionsList(key);
        if (res.status === 200) {
            Options.value[key] = res.result.map((item: any) => ({
                label: item?.text || item,
                value: item?.value || item,
            }));
        }
    }
};
const getCertificateList = async () => {
    const res: any = await queryCertificateList();
    if (res.status === 200) {
        certificateList.value = res.result.map((item: any) => ({
            label: item.name,
            value: item.id,
        }));
    }
};

const getProvidersList = async () => {
    const resp: any = await getProviders();
    if (resp.status === 200) {
        const arr = resp.result
            .filter(
                (item: any) => item.id === 'modbus-tcp' || item.id === 'opc-ua',
            )
            .map((it: any) => it.id);
        const providers: any = protocolList.filter((item: any) =>
            arr.includes(item.alias),
        );
        providersList.value = providers;
        if (arr.includes('opc-ua')) {
            getOptionsList();
        }
    }
};
getProvidersList();
getCertificateList();

watch(
    () => props.data,
    (value) => {
        if (value.id) formData.value = value as FormDataType;
    },
    { immediate: true, deep: true },
);
</script>

<style lang="less" scoped></style>
