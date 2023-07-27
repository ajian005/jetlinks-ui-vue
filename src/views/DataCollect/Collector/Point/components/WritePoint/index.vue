<template lang="">
    <j-modal :title="t('components.WritePoint.index.5rg7tjif9dw0')" :visible="true" width="500px" @cancel="handleCancel">
        <j-form
            class="form"
            layout="vertical"
            :model="formData"
            name="basic"
            autocomplete="off"
            ref="formRef"
        >
            <j-form-item
                :label="data.name"
                name="value"
                :rules="[
                    {
                        required: true,
                        message: `${t('components.WritePoint.index.5rg7tjifav40') + data.name}`,
                    },
                ]"
                v-if="
                    data.provider === 'MODBUS_TCP' &&
                    data?.configuration.function === 'Coils'
                "
            >
                <j-textarea
                    :placeholder="t('components.WritePoint.index.5rg7tjifav40')"
                    v-model:value="formData.value"
                    :maxlength="200"
                    :rows="3"
                    showCount
                />
            </j-form-item>
            <j-form-item
                :label="data.name"
                name="value"
                :rules="[
                    {
                        required: true,
                        message: `${t('components.WritePoint.index.5rg7tjifav40') + data.name}`,
                    },
                ]"
                v-else-if="data.provider === 'OPC_UA'"
            >
                <j-input-number
                    v-if="['double', 'float', 'llong', 'long', 'integer', 'short'].includes(valueType)"
                    style="width: 100%"
                    :placeholder="t('components.WritePoint.index.5rg7tjifav40')"
                    v-model:value="formData.value"
                />
                <j-select
                    v-else-if="['boolean'].includes(valueType)"
                    style="width: 100%"
                    v-model:value="formData.value"
                    :options="[
                        {
                            label: t('components.WritePoint.index.5rg7tjifb5w0'),
                            value: true,
                        },
                        {
                            label: t('components.WritePoint.index.5rg7tjifbn40'),
                            value: false,
                        },
                    ]"
                    :placeholder="t('components.WritePoint.index.5rg7tjifbu80')"
                    allowClear
                    show-search
                    :filter-option="filterOption"
                />
                <j-date-picker
                    v-else-if="['datetime'].includes(valueType)"
                    style="width: 100%"
                    format="YYYY-MM-DD HH:mm:ss"
                    show-time
                    :placeholder="t('components.WritePoint.index.5rg7tjifbu80')"
                    @change="onChange"
                />

                <j-input
                    v-else
                    :placeholder="t('components.WritePoint.index.5rg7tjifav40')"
                    v-model:value="formData.value"
                />
            </j-form-item>
            <j-form-item
                :label="data.name"
                name="value"
                :rules="[
                    {
                        required: true,
                        message: `${t('components.WritePoint.index.5rg7tjifav40') + data.name}`,
                    },
                ]"
                v-else
            >
                <j-input-number
                    v-if="valueTypeArray.includes(valueType)"
                    style="width: 100%"
                    :placeholder="t('components.WritePoint.index.5rg7tjifav40')"
                    v-model:value="formData.value"
                />
                <j-select
                    v-else-if="['boolean'].includes(valueType)"
                    style="width: 100%"
                    v-model:value="formData.value"
                    :options="[
                        {
                            label: t('components.WritePoint.index.5rg7tjifb5w0'),
                            value: true,
                        },
                        {
                            label: t('components.WritePoint.index.5rg7tjifbn40'),
                            value: false,
                        },
                    ]"
                    :placeholder="t('components.WritePoint.index.5rg7tjifbu80')"
                    allowClear
                    show-search
                    :filter-option="filterOption"
                />
                <j-date-picker
                    v-else-if="['datetime'].includes(valueType)"
                    style="width: 100%"
                    format="YYYY-MM-DD HH:mm:ss"
                    show-time
                    :placeholder="t('components.WritePoint.index.5rg7tjifbu80')"
                    @change="onChange"
                />

                <j-input
                    v-else
                    :placeholder="t('components.WritePoint.index.5rg7tjifav40')"
                    v-model:value="formData.value"
                />
            </j-form-item>
        </j-form>
        <template #footer>
            <j-button key="back" @click="handleCancel">{{t('components.WritePoint.index.5rg7tjifbyw0')}}</j-button>
            <PermissionButton
                key="submit"
                type="primary"
                :loading="loading"
                @click="handleOk"
                style="margin-left: 8px"
                :hasPermission="`DataCollect/Collector:update`"
            >
                {{t('components.WritePoint.index.5rg7tjifc7g0')}}
            </PermissionButton>
        </template>
    </j-modal>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue';
import type { Dayjs } from 'dayjs';
import { writePoint } from '@/api/data-collect/collector';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});

const valueType: string = (
    props.data?.provider === 'OPC_UA'
        ? props?.data?.configuration?.type || 'String'
        : props.data?.configuration?.codec?.provider || 'int8'
).toLocaleLowerCase();

const valueTypeArray = [
    'int8',
    'int16',
    'int32',
    'ieee754_float',
    'ieee754_double',
    'hex,',
    'number',
];

const emit = defineEmits(['change']);
const loading = ref(false);
const formRef = ref<FormInstance>();

const collectorId = props.data.collectorId;
const pointId: string = props.data.id;

const formData = ref({
    value: '',
});

const onChange = (value: Dayjs, dateString: string) => {
    formData.value.value = dateString;
};

const handleOk = async () => {
    const data = await formRef.value?.validate();
    const params: any = {
        ...data,
        pointId,
    };
    loading.value = true;
    const response = await writePoint(collectorId, [params]).catch(() => {});
    emit('change', response?.status === 200);
    loading.value = false;
};

const handleCancel = () => {
    emit('change', false);
};

const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
</script>

<style lang="less" scoped></style>
