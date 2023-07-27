<template>
    <j-modal
        :maskClosable="false"
        width="650px"
        destroyOnClose
        visible
        :title="props.data?.id ? t('Instance.Save.index.5rg4mi4y4qs0') : t('Instance.Save.index.5rg4mi4y7f00')"
        @ok="handleSave"
        @cancel="handleCancel"
        :okText="t('Instance.Save.index.5rg4mi4y7w00')"
        :cancelText="t('Instance.Save.index.5rg4mi4y84k0')"
        :confirmLoading="loading"
    >
        <div style="margin-top: 10px">
            <j-form
                :layout="'vertical'"
                ref="formRef"
                :rules="rules"
                :model="modelRef"
            >
                <j-form-item :label="t('Instance.Save.index.5rg4mi4y8jo0')" name="name">
                    <j-input
                        v-model:value="modelRef.name"
                        :placeholder="t('Instance.Save.index.5rg4mi4y8sw0')"
                    />
                </j-form-item>
                <j-form-item :label="t('Instance.Save.index.5rg4mi4y91w0')" name="describe">
                    <j-textarea
                        v-model:value="modelRef.description"
                        :placeholder="t('Instance.Save.index.5rg4mi4y9bw0')"
                        showCount
                        :maxlength="200"
                        :rows="4"
                    />
                </j-form-item>
            </j-form>
        </div>
    </j-modal>
</template>

<script lang="ts" setup>
import { saveRule, modify } from '@/api/rule-engine/instance';
import { getImage, onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emit = defineEmits(['success', 'closeSave']);
const props = defineProps({
    data: {
        type: Object,
    },
});

const productList = ref<Record<string, any>[]>([]);
const loading = ref<boolean>(false);
const formRef = ref();
const modelRef = ref();
modelRef.value = {...props.data};
const rules = {
    name: [
        {
            required: true,
            message: t('Instance.Save.index.5rg4mi4y8sw0'),
        },
        {
            max: 64,
            message: t('Instance.Save.index.5rg4mi4y9i80'),
        },
    ],
};
const handleCancel = () => {
    emit('closeSave');
};

const handleSave = () => {
    formRef.value
        .validate()
        .then(async () => {
            loading.value = true;
            if (!modelRef.value?.id) {
                let resp = await saveRule(modelRef.value);
                loading.value = false;
                if (resp.status === 200) {
                    onlyMessage(t('Instance.Save.index.5rg4mi4y9s00'));
                    emit('closeSave');
                    emit('success');
                } else {
                    onlyMessage(t('Instance.Save.index.5rg4mi4ya0g0'), 'error');
                }
            } else {
                let resp = await modify(modelRef.value?.id, modelRef.value);
                loading.value = false;
                if (resp.status === 200) {
                    onlyMessage(t('Instance.Save.index.5rg4mi4y9s00'));
                    emit('closeSave');
                    emit('success');
                } else {
                    onlyMessage(t('Instance.Save.index.5rg4mi4ya8g0'), 'error');
                }
            }
        })
        .catch((err: any) => {
            console.log('error', err);
        });
};
</script>