<template>
    <j-modal
        :maskClosable="false"
        width="45vw"
        :title="t('Io.Save.input.5rg3yc0d6o00')"
        @cancel="close"
        @ok="save"
        visible
        :cancelText="t('Io.Save.input.5rg3yc0d8d00')"
        :okText="t('Io.Save.input.5rg3yc0d8p40')"
    >
        <j-form layout="vertical" :model="inputData" ref="formRef">
            <j-form-item
                :label="t('Io.Save.input.kafka')"
                name="address"
                :rules="[
                    {
                        max: 64,
                        message: t('Io.Save.input.5rg3yc0d8xc0'),
                    },
                ]"
            >
                <j-input
                    v-model:value="inputData.address"
                    :placeholder="t('Io.Save.input.5rg3yc0d9400')"
                ></j-input>
            </j-form-item>
            <j-form-item
                label="topic"
                name="topic"
                :rules="[
                    {
                        max: 64,
                        message: t('Io.Save.input.5rg3yc0d8xc0'),
                    },
                ]"
            >
                <j-input v-model:value="inputData.topic"></j-input>
            </j-form-item>
            <j-form-item :label="t('Io.Save.input.5rg3yc0d9c80')">
                <j-switch
                    :checked-children="t('Io.Save.input.5rg3yc0d9j80')"
                    :un-checked-children="t('Io.Save.input.5rg3yc0d9pg0')"
                    v-model:checked="inputData.status"
                ></j-switch>
            </j-form-item>
        </j-form>
    </j-modal>
</template>

<script lang="ts" setup>
import { saveOutputData } from '@/api/rule-engine/config';
import { onlyMessage } from '@/utils/comm';
import { Form } from 'jetlinks-ui-components';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const useForm = Form.useForm;
const formRef = ref();
const Myprops = defineProps({
    data: {
        default: '',
    },
});
let inputData = reactive({
    status: false,
    address: '',
    topic: '',
});
watchEffect(() => {
    inputData.status =
        Myprops.data?.data?.state?.value === 'enabled' ? true : false;
    inputData.address = Myprops.data?.data?.config?.config?.address;
    inputData.topic = Myprops.data?.data?.config?.config?.topic;
});

const close = () => {
    emit('closeModel');
};
const save = () => {
    formRef.value.validateFields().then(() => {
        saveOutputData({
            config: {
                sourceType: 'kafka',
                config: {
                    ...inputData,
                    state: inputData?.status ? 'enabled' : 'disable',
                },
            },
            state: inputData?.status ? 'enabled' : 'disable',
            id: Myprops?.data?.data?.id,
            sourceType: 'kafka',
            exchangeType: 'consume',
        }).then((res) => {
            if (res.status === 200) {
                onlyMessage(t('Io.Save.input.5rg3yc0d9vw0'));
                emit('saveSuc');
            }
        });
    });
};
const emit = defineEmits(['closeModel', 'saveSuc']);
</script>
<style lang="less" scoped>
</style>