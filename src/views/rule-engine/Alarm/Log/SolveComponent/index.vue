<template>
    <j-modal
        :title="t('Log.SolveComponent.index.5rg45j1q54c0')"
        :okText="t('Log.SolveComponent.index.5rg45j1q6rg0')"
        :cancelText="t('Log.SolveComponent.index.5rg45j1q78o0')"
        visible
        @cancel="handleCancel"
        @ok="handleSave"
        destroyOnClose
        :confirmLoading="loading"
    >
        <j-form :rules="rules" layout="vertical" ref="formRef" :model="form">
            <j-form-item :label="t('Log.SolveComponent.index.5rg45j1q7gg0')" name="describe">
                <j-textarea
                    :rows="8"
                    :maxlength="200"
                    showCount
                    :placeholder="t('Log.SolveComponent.index.5rg45j1q7lo0')"
                    v-model:value="form.describe"
                ></j-textarea>
            </j-form-item>
        </j-form>
    </j-modal>
</template>

<script lang="ts" setup>
import { handleLog } from '@/api/rule-engine/log';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
    data: {
        type: Object,
    },
});
const loading = ref<boolean>(false);
const formRef = ref();
const rules = {
    describe: [
        {
            required: true,
            message: t('Log.SolveComponent.index.5rg45j1q7lo0'),
        },
    ],
};
const form = reactive({
    describe: '',
});
let visible = ref(true);
const emit = defineEmits(['closeSolve'])
const handleCancel = () => {
    emit('closeSolve');
};
const handleSave = () => {
    loading.value = true;
    formRef.value
        .validate()
        .then(async () => {
            const res = await handleLog({
                describe: form.describe,
                type: 'user',
                state: 'normal',
                alarmRecordId: props.data?.current?.id || '',
                alarmConfigId: props.data?.current?.alarmConfigId || '',
                alarmTime: props?.data?.current?.alarmTime || '',
            });
            if (res.status === 200) {
                onlyMessage(t('Log.SolveComponent.index.5rg45j1q7vs0'));
                emit('closeSolve');
            } else {
                onlyMessage(t('Log.SolveComponent.index.5rg45j1q8140'), 'error');
            }
            loading.value = false;
        })
        .catch((error) => {
            console.log(error);
            loading.value = false;
        });
};
</script>
<style lang="less" scoped>
</style>