<template>
    <j-modal
        visible
        :title="t('components.EditInfo.index.5rmxm54jtv00')"
        @ok="handleOk"
        width="770px"
        @cancel="emits('close')"
        :confirmLoading="loading"
    >
        <j-form :model="form" layout="vertical" ref="formRef">
            <j-row :gutter="24">
                <j-col :span="12">
                    <j-form-item
                        :label="t('components.EditInfo.index.5rmxm54jv0w0')"
                        name="name"
                        :rules="[
                            { required: true, message: t('components.EditInfo.index.5rmxm54jv700') },
                            { max: 64, message: t('components.EditInfo.index.5rmxm54jvck0') },
                        ]"
                    >
                        <j-input
                            v-model:value="form.name"
                            :placeholder="t('components.EditInfo.index.5rmxm54jvh00')"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="12">
                    <j-form-item :label="t('components.EditInfo.index.5rmxm54jvmk0')">
                        <j-input
                            v-model:value="form.username"
                            :placeholder="t('components.EditInfo.index.5rmxm54jvrk0')"
                            disabled
                        />
                    </j-form-item>
                </j-col>
            </j-row>
            <j-row :gutter="24">
                <j-col :span="12">
                    <j-form-item :label="t('components.EditInfo.index.5rmxm54jvwo0')">
                        <j-input
                            :value="
                                form.roleList.map((item) => item.name).join(',')
                            "
                            placeholder="请选择角色"
                            disabled
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="12">
                    <j-form-item :label="t('components.EditInfo.index.5rmxm54jw6o0')">
                        <j-input
                            :value="
                                form.orgList.map((item) => item.name).join(',')
                            "
                            placeholder="请选择组织"
                            disabled
                        />
                    </j-form-item>
                </j-col>
            </j-row>
            <j-row :gutter="24">
                <j-col :span="12">
                    <j-form-item
                        :label="t('components.EditInfo.index.5rmxm54jwj40')"
                        name="telephone"
                        :rules="[
                            {
                                pattern: /^1[3456789]\d{9}$/,
                                message: t('components.EditInfo.index.5rmxm54jwng0'),
                            },
                        ]"
                    >
                        <j-input
                            v-model:value="form.telephone"
                            :placeholder="t('components.EditInfo.index.5rmxm54jwsc0')"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="12">
                    <j-form-item
                        :label="t('components.EditInfo.index.5rmxm54jwx00')"
                        name="email"
                        :rules="[
                            {
                                type: 'email',
                                message: t('components.EditInfo.index.5rmxm54jx1w0'),
                            },
                        ]"
                    >
                        <j-input
                            v-model:value="form.email"
                            :placeholder="t('components.EditInfo.index.5rmxm54jx6k0')"
                        />
                    </j-form-item>
                </j-col>
            </j-row>
        </j-form>
    </j-modal>
</template>

<script setup lang="ts">
import { updateMeInfo_api } from '@/api/account/center';
import { onlyMessage } from '@/utils/comm';
import { cloneDeep } from 'lodash-es';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emits = defineEmits(['save', 'close']);
const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});
const loading = ref(false);
const form = ref<any>(cloneDeep(props.data));
const formRef = ref<any>();


const handleOk = () => {
    formRef.value?.validate().then(() => {
        loading.value = true;
        updateMeInfo_api(form.value)
            .then((resp) => {
                if (resp.status === 200) {
                    onlyMessage(t('components.EditInfo.index.5rmxm54jxbc0'), 'success');
                    emits('save', form.value);
                }
            })
            .finally(() => (loading.value = false));
    });
};
</script>

<style scoped></style>
