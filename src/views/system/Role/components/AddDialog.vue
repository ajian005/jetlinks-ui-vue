<template>
    <j-modal
        visible
        :title="t('Role.components.AddDialog.5rkjo56mia80')"
        width="670px"
        @cancel="emits('update:visible', false)"
        @ok="confirm"
        :confirm-loading="loading"
    >
        <j-form ref="formRef" :model="form" layout="vertical">
            <j-form-item
                name="name"
                :label="t('Role.components.AddDialog.5rkjo56mj380')"
                :rules="[
                    { required: true, message: t('Role.components.AddDialog.5rkjo56mjf00') },
                    { max: 64, message: t('Role.components.AddDialog.5rkjo56mjko0') },
                ]"
            >
                <j-input
                    v-model:value="form.name"
                    :placeholder="t('Role.components.AddDialog.5rkjo56mjpw0')"
                    allow-clear
                />
            </j-form-item>
            <j-form-item name="name" :label="t('Role.components.AddDialog.5rkjo56mjvk0')">
                <j-textarea
                    v-model:value="form.description"
                    :placeholder="t('Role.components.AddDialog.5rkjo56mk0g0')"
                    allow-clear
                    :maxlength="200"
                    show-count
                />
            </j-form-item>
        </j-form>
    </j-modal>
</template>

<script setup lang="ts">
import { FormInstance } from 'ant-design-vue';
import { saveRole_api } from '@/api/system/role';
import { useMenuStore } from '@/store/menu';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n() 
const route = useRoute();
const { jumpPage } = useMenuStore();

const emits = defineEmits(['update:visible']);
const props = defineProps<{
    visible: boolean;
}>();
// 弹窗相关
const loading = ref(false);
const form = ref<any>({});
const formRef = ref<FormInstance>();

const confirm = () => {
    loading.value = true;
    formRef.value
        ?.validate()
        .then(() => saveRole_api(form.value))
        .then((resp) => {
            if (resp.status === 200) {
                onlyMessage(t('Role.components.AddDialog.5rkjo56mk5g0'));
                emits('update:visible', false);

                if (route.query.save) {
                    // @ts-ignore
                    window?.onTabSaveSuccess(resp.result.id);
                    setTimeout(() => window.close(), 300);
                } else jumpPage(`system/Role/Detail`, { id: resp.result.id });
            }
        })
        .finally(() => (loading.value = false));
};
// 表单相关
</script>

<style scoped></style>
