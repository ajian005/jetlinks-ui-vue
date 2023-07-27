<template>
    <j-modal
        visible
        :title="dialogTitle"
        :maskClosable="false"
        width="675px"
        @ok="confirm"
        @cancel="emits('update:visible', false)"
        :confirmLoading="loading"
        class="edit-dialog-container"
    >
        <j-form ref="formRef" :model="form.data" layout="vertical">
            <j-form-item
                :label="t('Relationship.components.EditDialog.5rg9w5kh7s40')"
                name="name"
                :rules="[
                    { required: true, message: t('Relationship.components.EditDialog.5rg9w5kh8uw0') },
                    { max: 64, message: t('Relationship.components.EditDialog.5rg9w5kh9080') },
                ]"
            >
                <j-input
                    v-model:value="form.data.name"
                    :placeholder="t('Relationship.components.EditDialog.5rg9w5kh8uw0')"
                />
            </j-form-item>
            <j-form-item
                name="relation"
                :label="t('Relationship.components.EditDialog.5rg9w5kh94g0')"
                :rules="[
                    { required: true, message: t('Relationship.components.EditDialog.5rg9w5kh9as0') },
                    { max: 64, message: t('Relationship.components.EditDialog.5rg9w5kh9080') },
                    { validator: form.rules.checkRelation, trigger: 'change' },
                ]"
            >
                <j-input
                    v-model:value="form.data.relation"
                    :placeholder="t('Relationship.components.EditDialog.5rg9w5kh9as0')"
                    :disabled="!!form.data.id"
                />
            </j-form-item>

            <j-row :gutter="24">
                <j-col :span="12">
                    <j-form-item
                        name="objectType"
                        :label="t('Relationship.components.EditDialog.5rg9w5kh9ew0')"
                        :rules="[{ required: true, message: t('Relationship.components.EditDialog.5rg9w5kh9iw0') }]"
                    >
                        <j-select
                            v-model:value="form.data.objectType"
                            :disabled="!!form.data.id"
                            @change="form.handleObjectTypeChange"
                            :placeholder="t('Relationship.components.EditDialog.5rg9w5kh9iw0')"
                        >
                            <j-select-option
                                v-for="item in form.objectList"
                                :value="item.id"
                            >
                                {{ item.name }}
                            </j-select-option>
                        </j-select>
                    </j-form-item>
                </j-col>
                <j-col :span="12">
                    <j-form-item
                        name="targetType"
                        :label="t('Relationship.components.EditDialog.5rg9w5kh9mg0')"
                        :rules="[{ required: true, message: t('Relationship.components.EditDialog.5rg9w5kh9vk0') }]"
                    >
                        <j-select
                            v-model:value="form.data.targetType"
                            :disabled="!!form.data.id"
                            @change="form.rules.checkUnique"
                            :placeholder="t('Relationship.components.EditDialog.5rg9w5kh9vk0')"
                        >
                            <j-select-option
                                v-for="item in targetList"
                                :value="item.id"
                            >
                                {{ item.name }}
                            </j-select-option>
                        </j-select>
                    </j-form-item>
                </j-col>
            </j-row>
            <j-form-item name="description" :label="t('Relationship.components.EditDialog.5rg9w5kh9z00')">
                <j-textarea
                    v-model:value="form.data.description"
                    :placeholder="t('Relationship.components.EditDialog.5rg9w5kha280')"
                    show-count
                    :maxlength="200"
                />
            </j-form-item>
        </j-form>
    </j-modal>
</template>

<script setup lang="ts">
import { FormInstance } from 'ant-design-vue';
import { Rule } from 'ant-design-vue/es/form';

import {
    getObjectList_api,
    addRelation_api,
    editRelation_api,
    validateField,
} from '@/api/system/relationship';
import { dictItemType } from '../../DataSource/typing';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emits = defineEmits(['refresh', 'update:visible']);
const props = defineProps<{
    visible: boolean;
    data: formType;
}>();
// 弹窗相关
const loading = ref(false);
const dialogTitle = computed(() => (props.data.id ? t('Relationship.components.EditDialog.5rg9w5kha6g0') : t('Relationship.components.EditDialog.5rg9w5kha9o0')));
const confirm = () => {
    loading.value = true;
    formRef.value
        ?.validate()
        .then(() => form.submit())
        .then((resp: any) => {
            if (resp.status === 200) {
                onlyMessage(t('Relationship.components.EditDialog.5rg9w5khacw0'));
                emits('refresh');
                emits('update:visible', false);
            }
        })
        .finally(() => (loading.value = false));
};

const formRef = ref<FormInstance>();
const form = reactive({
    data: props.data,
    rules: {
        /**
         * 验证标识
         * @param _rule
         * @param value
         */
        checkRelation: async (_rule: Rule, value: string) => {
            const reg = new RegExp('^[0-9a-zA-Z_\\\\-]+$');
            if (!value) return Promise.reject('');
            if (!reg.test(value))
                return Promise.reject(
                    t('Relationship.components.EditDialog.5rg9w5khagg0'),
                );
            return form.rules.checkUnique();
        },
        /**
         * 验证标识唯一性
         * @param value
         */
        checkUnique: () => {
            if (
                props.data?.id ||
                !form.data.relation ||
                !form.data.objectType ||
                !form.data.targetType
            )
                return;
            return new Promise(async (resolve, reject) => {
                const { result } = await validateField({
                    relation: form.data.relation,
                    objectType: form.data.objectType,
                    targetType: form.data.targetType,
                });
                result.passed ? resolve('') : reject(result.reason);
            });
        },
    },
    handleObjectTypeChange: () => {
        form.data.targetType = undefined;
        form.rules.checkUnique();
    },
    objectList: [] as any[],

    getObjectList: () => {
        getObjectList_api().then((resp: any) => {
            form.objectList = resp.result;
        });
    },
    submit: () => {
        const params = {
            ...form.data,
            objectTypeName: form.objectList.find(
                (item) => item.id === form.data.objectType,
            ).name,
            targetTypeName: targetList.value.find(
                (item: dictItemType) => item.id === form.data.targetType,
            )?.name,
        };
        const api = props.data.id ? editRelation_api : addRelation_api;
        return api(params);
    },
});
const targetList = computed(() =>
    form.data.objectType === 'device' ? [{ id: 'user', name: t('Relationship.components.EditDialog.5rg9w5khak00') }] : [],
);
form.getObjectList();

type formType = {
    name: string;
    relation: string;
    objectType: string | undefined;
    targetType: string | undefined;
    description: string;
    id?: string;
};
</script>
