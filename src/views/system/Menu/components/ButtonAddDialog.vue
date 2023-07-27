<template>
    <j-modal visible :title="title" width="660px" @ok="confirm" @cancel="emits('update:visible', false)"
        :maskClosable="false" :confirmLoading="loading">
        <j-form :model="form.data" class="basic-form" ref="formRef">
            <j-form-item :label="t('Menu.components.ButtonAddDialog.5rg9nf3rtf80')" name="id" :rules="[
                { required: true, message: t('Menu.components.ButtonAddDialog.5rg9nf3rucs0') },
                { max: 64, message: t('Menu.components.ButtonAddDialog.5rg9nf3ruio0') },
            ]">
                <j-auto-complete v-model:value="form.data.id" :options="codeOptions" :placeholder="t('Menu.components.ButtonAddDialog.5rg9nf3rucs0')"
                    :disabled="props.mode !== 'add'">
                    <template #option="{ value: val, message }">
                        {{ val }}
                        <span class="message">{{ message }}</span>
                    </template>
                </j-auto-complete>
            </j-form-item>
            <j-form-item :label="t('Menu.components.ButtonAddDialog.5rg9nf3run00')" name="name" :rules="[
                { required: true, message: t('Menu.components.ButtonAddDialog.5rg9nf3rur40') },
                { max: 64, message: t('Menu.components.ButtonAddDialog.5rg9nf3ruio0') },
            ]">
                <j-input v-model:value="form.data.name" :disabled="props.mode === 'view'" :placeholder="t('Menu.components.ButtonAddDialog.5rg9nf3rur40')" />
            </j-form-item>
            <j-form-item :label="t('Menu.components.ButtonAddDialog.5rg9nf3ruvg0')" name="permissions" :rules="[
                {
                    required: true,
                    message: t('Menu.components.ButtonAddDialog.5rg9nf3ruz00'),
                    validator: form.checkPermission,
                },
            ]">
                <PermissChoose :first-width="8" max-height="350px" v-model:value="form.data.permissions"
                    :disabled="props.mode === 'view'" :key="form.data.id || ''" />
            </j-form-item>
            <j-form-item :label="t('Menu.components.ButtonAddDialog.5rg9nf3rv4g0')" name="describe">
                <j-textarea v-model:value="form.data.describe" :rows="4" :placeholder="t('Menu.components.ButtonAddDialog.5rg9nf3rv8c0')"
                    :disabled="props.mode === 'view'" />
            </j-form-item>
        </j-form>
    </j-modal>
</template>

<script setup lang="ts">
import { FormInstance } from 'ant-design-vue';
import { Rule } from 'ant-design-vue/es/form';
import PermissChoose from '../components/PermissChoose.vue';
import { saveMenuInfo_api } from '@/api/system/menu';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emits = defineEmits(['confirm', 'update:visible']);
const props = defineProps<{
    menuInfo: {
        buttons: formType[];
        id: string;
    };
    visible: boolean;
    mode: string;
    data: formType;
}>();
const title = computed(() => {
    switch (props.mode) {
        case 'add': return t('Menu.components.ButtonAddDialog.5rg9nf3rvbo0');
        case 'view': return t('Menu.components.ButtonAddDialog.5rg9nf3rvf40');
        default: return t('Menu.components.ButtonAddDialog.5rg9nf3rvis0');
    }
})
const loading = ref(false);
const confirm = () => {
    formRef.value &&
        formRef.value.validate().then(() => {
            const buttons = toRaw(props.menuInfo?.buttons) || [];
            const button = buttons?.find((item) => item.id === form.data.id);
            if (button) {
                Object.entries(form.data).forEach(([key, value]) => {
                    button[key] = value;
                });
            } else {
                buttons.push({ ...form.data });
            }
            const params = {
                ...props.menuInfo,
                buttons,
            };
            loading.value = true;
            saveMenuInfo_api(params)
                .then((resp) => {
                    onlyMessage('操作成功');
                    emits('confirm');
                    emits('update:visible', false);
                })
                .finally(() => (loading.value = false))
                .catch(() => {
                    loading.value = false;
                });
        });
};
const initForm = {
    name: '',
    id: '',
    permissions: [],
    describe: '',
} as formType;
const formRef = ref<FormInstance>();
const form = reactive({
    data: { ...initForm, ...props.data },
    checkPermission: (_rule: Rule, value: string[]) => {
        if (!value || value.length < 1) return Promise.reject(t('Menu.components.ButtonAddDialog.5rg9nf3ruz00'));
        return Promise.resolve();
    },
});
const codeOptions = [
    { label: 'add', value: 'add', message: t('Menu.components.ButtonAddDialog.5rg9nf3rvbo0') },
    { label: 'delete', value: 'delete', message: t('Menu.components.ButtonAddDialog.5rg9nf3rvpk0') },
    { label: 'update', value: 'update', message: t('Menu.components.ButtonAddDialog.5rg9nf3rvso0') },
];

type formType = {
    name: string;
    id: string;
    permissions: any[];
    describe: string;
};
</script>

<style lang="less" scoped>
.basic-form {
    .ant-form-item {
        display: block;

        :deep(.ant-form-item-label) {
            overflow: inherit;

            label::after {
                display: none;
            }
        }

        .message {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.4);
        }
    }
}
</style>
