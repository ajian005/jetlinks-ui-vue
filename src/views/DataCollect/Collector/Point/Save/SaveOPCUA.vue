<template lang="">
    <j-modal :title="t('Point.Save.SaveOPCUA.5rg7v9xg3d40')" :visible="true" width="700px" @cancel="handleCancel">
        <j-form
            class="form"
            layout="vertical"
            :model="formData"
            name="basic"
            autocomplete="off"
            :rules="OPCUARules"
            ref="formRef"
        >
            <j-form-item :label="t('Point.Save.SaveOPCUA.5rg7v9xg4es0')" name="name">
                <j-input
                    :placeholder="t('Point.Save.SaveOPCUA.5rg7v9xg4mc0')"
                    v-model:value="formData.name"
                />
            </j-form-item>
            <j-form-item :label="t('Point.Save.SaveOPCUA.5rg7v9xg4sk0')" :name="['configuration', 'type']">
                <j-select
                    style="width: 100%"
                    v-model:value="formData.configuration.type"
                    :options="options
                    // [
                        // { value: 'Number', label: '数值类型' },
                        // { value: 'DateTime', label: '时间类型' },
                        // { value: 'Array', label: '数组类型' },
                        // { value: 'String', label: '文本类型' },
                        // { value: 'Boolean', label: '布尔' },
                    // ]
                    "
                    :placeholder="t('Point.Save.SaveOPCUA.5rg7v9xg4y80')"
                    allowClear
                    show-search
                    :filter-option="filterOption"
                />
            </j-form-item>

            <j-form-item :label="t('Point.Save.SaveOPCUA.5rg7v9xg5900')" name="accessModes">
                <j-card-select
                    multiple
                    :showImage="false"
                    v-model:value="formData.accessModes"
                    :options="[
                        { label: t('Point.Save.SaveOPCUA.5rg7v9xg5g00'), value: 'read' },
                        { label: t('Point.Save.SaveOPCUA.5rg7v9xg5ow0'), value: 'write' },
                        { label: t('Point.Save.SaveOPCUA.5rg7v9xg5uo0'), value: 'subscribe' },
                    ]"
                    :column="3"
                />
            </j-form-item>
            <j-form-item
                :label="t('Point.Save.SaveOPCUA.5rg7v9xg5z40')"
                :name="['configuration', 'interval']"
                :rules="[...OPCUARules.interval]"
            >
                <j-input-number
                    style="width: 100%"
                    :placeholder="t('Point.Save.SaveOPCUA.5rg7v9xg63g0')"
                    v-model:value="formData.configuration.interval"
                    addon-after="ms"
                    :max="2147483648"
                    :min="0"
                />
            </j-form-item>
            <j-form-item label="" :name="['features']">
                <j-checkbox-group v-model:value="formData.features">
                    <j-checkbox value="changedOnly" name="type"
                        >{{t('Point.Save.SaveOPCUA.5rg7v9xg68g0')}}</j-checkbox
                    >
                </j-checkbox-group>
            </j-form-item>
            <j-form-item :label="t('Point.Save.SaveOPCUA.5rg7v9xg6co0')" :name="['description']">
                <j-textarea
                    :placeholder="t('Point.Save.SaveOPCUA.5rg7v9xg6h00')"
                    v-model:value="formData.description"
                    :maxlength="200"
                    :rows="3"
                    showCount
                />
            </j-form-item>
        </j-form>
        <template #footer>
            <j-button key="back" @click="handleCancel">{{t('Point.Save.SaveOPCUA.5rg7v9xg6lc0')}}</j-button>
            <PermissionButton
                key="submit"
                type="primary"
                :loading="loading"
                @click="handleOk"
                style="margin-left: 8px"
                :hasPermission="`DataCollect/Collector:${
                    id ? 'update' : 'add'
                }`"
            >
                {{t('Point.Save.SaveOPCUA.5rg7v9xg6ps0')}}
            </PermissionButton>
        </template>
    </j-modal>
</template>
<script lang="ts" setup>
import {
    savePoint,
    updatePoint,
    _validateField,
    queryTypeList
} from '@/api/data-collect/collector';
import { OPCUARules } from '../../data.ts';
import type { FormInstance } from 'ant-design-vue';
import { Rule } from 'ant-design-vue/lib/form';
import { cloneDeep } from 'lodash-es';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});

const emit = defineEmits(['change']);
const loading = ref(false);
const formRef = ref<FormInstance>();

const id = props.data.id;
const collectorId = props.data.collectorId;
const provider = props.data.provider;
const options = ref([]);

const formData = ref({
    name: '',
    configuration: {
        type: undefined,
        interval: 3000,
    },
    accessModes: [],
    features: [],
    description: '',
});

const handleOk = async () => {
    const data = await formRef.value?.validate();
    const { interval } = formData.value.configuration;
    const params = {
        ...props.data,
        ...data,
        provider,
        collectorId,
        interval,
    };

    loading.value = true;
    const response = !id
        ? await savePoint(params).catch(() => {})
        : await updatePoint(id, { ...props.data, ...params }).catch(() => {});
    emit('change', response?.status === 200);
    loading.value = false;
};

const handleCancel = () => {
    emit('change', false);
};

const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

onMounted(() => {
    queryTypeList().then((resp: any) => {
        if(resp.status === 200){
            options.value = (resp?.result || []).map((item: any) => {
                return {
                    label: item, 
                    value: item
                }
            })
        }
    })
})

watch(
    () => props.data,
    (value) => {
        if (value.id && value.provider === 'OPC_UA') {
            const _value: any = cloneDeep(value);
            formData.value = _value;
            if (!!_value.accessModes[0]?.value) {
                formData.value.accessModes = value.accessModes.map(
                    (i: any) => i.value,
                );
            }
            if (!!_value.features[0]?.value) {
                formData.value.features = value.features.map(
                    (i: any) => i.value,
                );
            }
        }
    },
    { immediate: true, deep: true },
);
</script>

<style lang="less" scoped></style>
