<template>
    <j-modal
        visible
        :title="t('components.EditPassword.index.5rmxmuyx2bo0')"
        width="615px"
        :bodyStyle="{
            padding: 0,
        }"
        :confirmLoading="loading"
        @cancel="emits('close')"
    >
        <div>
            <div style="background-color: #f8f9fc; padding: 24px">
                <j-steps
                    :current="current"
                    size="small"
                    progress-dot
                    @change="onChange"
                >
                    <j-step
                        :title="item"
                        v-for="(item, index) in list"
                        :key="item"
                    >
                        <template #description>
                            <span v-if="current === index">{{t('components.EditPassword.index.5sbl13vo7p00')}}</span>
                            <span v-if="current < index">{{t('components.EditPassword.index.5sbl13vo8y80')}}</span>
                            <span v-if="current > index">{{t('components.EditPassword.index.5sbl13vo94g0')}}</span>
                        </template>
                    </j-step>
                </j-steps>
            </div>
            <div class="content">
                <j-form :model="form" layout="vertical" ref="formRef">
                    <j-form-item
                        :label="t('components.EditPassword.index.5sbl13vo98s0')"
                        name="oldPassword"
                        v-show="current === 0"
                        :rules="[
                            { required: true, message: t('components.EditPassword.index.5rmxmuyx44w0') },
                            { validator: checkMethods.old, trigger: 'blur' },
                        ]"
                    >
                        <j-input
                            v-model:value="form.oldPassword"
                            :placeholder="t('components.EditPassword.index.5rmxmuyx44w0')"
                        />
                    </j-form-item>
                    <j-form-item
                        :label="t('components.EditPassword.index.5sbl13vo9cs0')"
                        name="newPassword"
                        v-show="current === 1"
                        :rules="[
                            { required: true, message: t('components.EditPassword.index.5rmxmuyx4cc0') },
                            { validator: checkMethods.new, trigger: 'blur' },
                        ]"
                    >
                        <j-input-password
                            v-model:value="form.newPassword"
                            :placeholder="t('components.EditPassword.index.5rmxmuyx4cc0')"
                        />
                    </j-form-item>
                    <j-form-item
                        :label="t('components.EditPassword.index.5sbl13vo9h80')"
                        v-show="current === 2"
                        name="confirmPassword"
                        :rules="[
                            { required: true, message: t('components.EditPassword.index.5rmxmuyx4kg0') },
                            {
                                validator: checkMethods.confirm,
                                trigger: 'blur',
                            },
                        ]"
                    >
                        <j-input
                            v-model:value="form.confirmPassword"
                            :placeholder="t('components.EditPassword.index.5rmxmuyx4kg0')"
                        />
                    </j-form-item>
                </j-form>
            </div>
        </div>
        <template #footer>
            <j-button v-if="current === 0" @click="emits('close')"
                >{{t('components.EditPassword.index.5rmxmuyx4rk0')}}</j-button
            >
            <j-button v-if="current === 2" @click="onPrev">{{t('components.EditPassword.index.5rmxmuyx4y40')}}</j-button>
            <j-button type="primary" v-else @click="onNext">{{t('components.EditPassword.index.5rmxmuyx5ew0')}}</j-button>
            <j-button v-if="current === 2" type="primary" @click="handleOk"
                >{{t('components.EditPassword.index.5rmxmuyx8580')}}</j-button
            >
        </template>
    </j-modal>
</template>

<script setup lang="ts">
import {
    updateMepsd_api,
    checkOldPassword_api,
    validateField_api,
} from '@/api/account/center';
import { onlyMessage } from '@/utils/comm';
import { Modal } from 'jetlinks-ui-components';
import { LoginPath } from '@/router/menu';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
type formType = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
};

const emits = defineEmits(['close']);
const router = useRouter();

const list = [t('components.EditPassword.index.5rmxmuyx3f80'), t('components.EditPassword.index.5rmxmuyx3p40'), t('components.EditPassword.index.5rmxmuyx3x80')];

const loading = ref(false);
const formRef = ref<any>();

const form = ref<formType>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
});
const current = ref<number>(0);

const onPrev = () => {
    current.value -= 1;
};

const jumpStep = (val: number) => {
    if (val === 1) {
        formRef.value?.validate('oldPassword').then(() => {
            current.value += 1;
        });
    } else if (val === 2) {
        formRef.value?.validate('newPassword').then(() => {
            current.value += 1;
        });
    }
};

const onNext = () => {
    jumpStep(current.value + 1);
};

const onChange = (cur: number) => {
    jumpStep(cur);
};

const checkMethods = {
    old: async (_rule: any, value: string) => {
        if (!value) return Promise.resolve();
        try {
            const resp: any = await checkOldPassword_api(value);
            if (resp.status === 200 && !resp.result.passed)
                return Promise.reject(resp.result.reason);
            else return Promise.resolve();
        } catch (error) {
            return Promise.reject(t('components.EditPassword.index.5rmxmuyx8hc0'));
        }
    },
    new: async (_rule: any, value: string) => {
        if (!value) return Promise.resolve();
        try {
            const resp: any = await validateField_api('password', value);
            if (resp.status === 200 && !resp.result.passed)
                return Promise.reject(resp.result.reason);
            else return Promise.resolve();
        } catch (error) {
            return Promise.reject(t('components.EditPassword.index.5rmxmuyx8hc0'));
        }
    },
    confirm: async (_rule: any, value: string) => {
        if (!value) return Promise.resolve();
        else if (form.value.newPassword && value !== form.value.newPassword) {
            return Promise.reject(t('components.EditPassword.index.5rmxmuyx8p80'));
        }
        try {
            const resp: any = await validateField_api('password', value);
            if (resp.status === 200 && !resp.result.passed)
                return Promise.reject(resp.result.reason);
            else return Promise.resolve();
        } catch (error) {
            return Promise.reject(t('components.EditPassword.index.5rmxmuyx8hc0'));
        }
    },
};

const handleOk = () => {
    formRef.value?.validate().then(() => {
        loading.value = true;
        const params = {
            oldPassword: form.value.oldPassword,
            newPassword: form.value.newPassword,
        };
        updateMepsd_api(params)
            .then((resp) => {
                if (resp.status === 200) {
                    onlyMessage(t('components.EditPassword.index.5rmxmuyx8ww0'), 'success');
                    emits('close')
                    Modal.warning({
                        content: t('components.EditPassword.index.5sbl13vo9l00'),
                        okText: t('components.EditPassword.index.5sbl13vo9oo0'),
                        onOk() {
                            localStorage.clear();
                            router.push(LoginPath);
                        },
                    });
                }
            })
            .finally(() => (loading.value = false));
    });
};
</script>

<style scoped lang="less">
.content {
    padding: 30px 50px;
}
</style>
