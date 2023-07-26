<template lang="">
    <j-modal
        :title="data.id ? t('Task.Save.index.5rg3m1fsf1o0') : t('Task.Save.index.5rg3m1fsgm80') + t('Task.Save.index.5rg3m1fsgxk0')"
        :ok-text="t('Task.Save.index.5rg3m1fsh5s0')"
        :cancel-text="t('Task.Save.index.5rg3m1fshd00')"
        :visible="true"
        width="700px"
        :confirm-loading="loading"
        @cancel="handleCancel"
        @ok="handleOk"
    >
        <j-form
            class="form"
            layout="vertical"
            :model="formData"
            name="basic"
            autocomplete="off"
            ref="formRef"
            :rules="rules"
        >
            <j-row :gutter="[24, 0]">
                <j-col :span="24">
                    <j-form-item :label="t('Task.Save.index.5rg3m1fshks0')" name="name">
                        <j-input
                            :placeholder="t('Task.Save.index.5rg3m1fshs00')"
                            v-model:value="formData.name"
                            :disabled="view"
                    /></j-form-item>
                </j-col>
                <j-col :span="24"
                    ><j-form-item :label="t('Task.Save.index.5rg3m1fshyk0')" name="mode">
                        <j-select
                            v-model:value="formData.mode"
                            :options="[
                                { label: t('Task.Save.index.5rg3m1fsi5k0'), value: 'push' },
                                { label: t('Task.Save.index.5rg3m1fsic00'), value: 'pull' },
                            ]"
                            :placeholder="t('Task.Save.index.5rg3m1fsiiw0')"
                            allowClear
                            show-search
                            :filter-option="filterOption"
                            @change="changeMode"
                            :disabled="view"
                        /> </j-form-item
                ></j-col>
                <j-col :span="12" v-if="formData.mode === 'push'"
                    ><j-form-item
                        :label="t('Task.Save.index.5rg3m1fsipc0')"
                        name="responseTimeoutSeconds"
                    >
                        <j-input-number
                            :placeholder="t('Task.Save.index.5rg3m1fsj280')"
                            style="width: 100%"
                            :min="1"
                            :max="99999"
                            :disabled="view"
                            v-model:value="
                                formData.responseTimeoutSeconds
                            " /></j-form-item
                ></j-col>
                <j-col
                    :span="formData.mode === 'push' ? 12 : 24"
                    v-if="formData.mode === 'push' || formData.mode === 'pull'"
                    ><j-form-item :label="t('Task.Save.index.5rg3m1fsjdk0')" name="timeoutSeconds">
                        <j-input-number
                            :placeholder="t('Task.Save.index.5rg3m1fsjmo0')"
                            style="width: 100%"
                            :min="1"
                            :max="99999"
                            :disabled="view"
                            v-model:value="
                                formData.timeoutSeconds
                            " /></j-form-item
                ></j-col>
                <j-col :span="12" v-if="!!formData.mode"
                    ><j-form-item :label="t('Task.Save.index.5rg3m1fsjss0')" name="releaseType">
                        <j-radio-group
                            v-model:value="formData.releaseType"
                            button-style="solid"
                            @change="changeShareCluster"
                            :disabled="view"
                        >
                            <j-radio value="all">{{t('Task.Save.index.5rg3m1fsjzc0')}}</j-radio>
                            <j-radio value="part">{{t('Task.Save.index.5rg3m1fsk540')}}</j-radio>
                        </j-radio-group>
                    </j-form-item>
                </j-col>
                <j-col :span="12" v-if="formData.releaseType === 'part'">
                    <j-form-item :label="t('Task.Save.index.5rg3m1fsk540')" name="deviceId">
                        <SelectDevices
                            v-model:modelValue="formData.deviceId"
                            :data="data"
                        ></SelectDevices> </j-form-item
                ></j-col>
                <j-col :span="24">
                    <j-form-item :label="t('Task.Save.index.5rg3m1fskb40')" name="description">
                        <j-textarea
                            :placeholder="t('Task.Save.index.5rg3m1fski40')"
                            v-model:value="formData.description"
                            :maxlength="200"
                            :rows="3"
                            showCount
                            :disabled="view"
                        /> </j-form-item
                ></j-col>
            </j-row>
        </j-form>
    </j-modal>
</template>
<script lang="ts" setup name="TaskPage">
import { queryProduct, saveTask } from '@/api/device/firmware';
import type { FormInstance } from 'ant-design-vue';
import SelectDevices from './SelectDevices.vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});

const formRef = ref<FormInstance>();

const route = useRoute();
const loading = ref(false);
const productOptions = ref([]);
const emit = defineEmits(['change']);

const firmwareId = route.query.id;
const productId = route.query.productId;
const view = props.data.view;

const formData: any = ref({
    name: '',
    mode: undefined,
    responseTimeoutSeconds: '',
    timeoutSeconds: '',
    releaseType: 'all',
    deviceId: undefined,
    description: '',
});

const rules = {
    name: [
        { required: true, message: t('Task.Save.index.5rg3m1fshs00') },
        { max: 64, message: t('Task.Save.index.5rg3m1fskss0') },
    ],
    mode: [{ required: true, message: t('Task.Save.index.5rg3m1fsiiw0') }],
    responseTimeoutSeconds: [{ required: true, message: t('Task.Save.index.5rg3m1fskxc0') }],
    timeoutSeconds: [{ required: true, message: t('Task.Save.index.5rg3m1fsl5k0') }],
    releaseType: [{ required: true }],
    deviceId: [{ required: true, message: t('Task.Save.index.5rg3m1fslao0') }],
    description: [{ max: 200, message: t('Task.Save.index.5rg3m1fslfo0') }],
};

const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const onSubmit = async () => {
    const params = await formRef.value?.validate();
    loading.value = true;
    const resp = await saveTask({
        ...params,
        firmwareId,
        productId,
    }).finally(() => {
        loading.value = false;
    })
    resp.success && emit('change', true);
};

const handleOk = () => {
    return view ? emit('change', false) : onSubmit();
};
const handleCancel = () => {
    emit('change', false);
};

const changeShareCluster = () => {
    formData.value.deviceId = undefined;
};

onMounted(() => {
    queryProduct({
        paging: false,
        terms: [{ column: 'state', value: 1 }],
        sorts: [{ name: 'createTime', order: 'desc' }],
    }).then((resp: any) => {
        productOptions.value = resp.result.map((item: any) => ({
            value: item.id,
            label: item.name,
        }));
    });
});
watch(
    () => props.data,
    (value) => {
        if (value.id) {
            formData.value = {
                ...value,
                mode: value.mode.value,
                releaseType: value?.deviceId ? 'part' : 'all',
            };
        }
    },
    { immediate: true, deep: true },
);
</script>

<style lang="less" scoped></style>
