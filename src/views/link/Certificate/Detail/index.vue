<template>
    <page-container>
        <FullPage>
            <j-card>
                <j-row :gutter="[24, 24]" style="padding: 24px">
                    <j-col :span="12">
                        <j-form
                            class="form"
                            layout="vertical"
                            :model="formData"
                            name="basic"
                            :label-col="{ span: 8 }"
                            :wrapper-col="{ span: 24 }"
                            autocomplete="off"
                        >
                            <j-form-item
                                :label="t('Certificate.Detail.index.5rg3hg3xaeo0')"
                                v-bind="validateInfos.type"
                            >
                                <j-radio-group v-model:value="formData.type">
                                    <j-radio-button
                                        class="form-radio-button"
                                        value="common"
                                    >
                                        <img
                                            :src="getImage('/certificate.png')"
                                        />
                                    </j-radio-button>
                                </j-radio-group>
                            </j-form-item>
                            <j-form-item
                                :label="t('Certificate.Detail.index.5rg3hg3xc9g0')"
                                v-bind="validateInfos.name"
                            >
                                <j-input
                                    :placeholder="t('Certificate.Detail.index.5rg3hg3xco40')"
                                    v-model:value="formData.name"
                                />
                            </j-form-item>
                            <j-form-item
                                :label="t('Certificate.Detail.index.5rg3hg3xcvk0')"
                                v-bind="validateInfos['configs.cert']"
                            >
                                <CertificateFile
                                    name="cert"
                                    v-model:modelValue="formData.configs.cert"
                                    :placeholder="t('Certificate.Detail.index.5rg3hg3xdbk0')"
                                />
                            </j-form-item>
                            <j-form-item
                                :label="t('Certificate.Detail.index.5rg3hg3xdjs0')"
                                v-bind="validateInfos['configs.key']"
                            >
                                <CertificateFile
                                    name="key"
                                    v-model:modelValue="formData.configs.key"
                                    :placeholder="t('Certificate.Detail.index.5rg3hg3xe000')"
                                />
                            </j-form-item>
                            <j-form-item :label="t('Certificate.Detail.index.5rg3hg3xe6k0')" name="description">
                                <j-textarea
                                    :placeholder="t('Certificate.Detail.index.5rg3hg3xedg0')"
                                    v-model:value="formData.description"
                                    :maxlength="200"
                                    :rows="3"
                                    showCount
                                />
                            </j-form-item>

                            <j-form-item>
                                <j-button
                                    v-if="view === 'false'"
                                    class="form-submit"
                                    html-type="submit"
                                    type="primary"
                                    @click.prevent="onSubmit"
                                    :loading="loading"
                                    >{{t('Certificate.Detail.index.5rg3hg3xek00')}}</j-button
                                >
                            </j-form-item>
                        </j-form>
                    </j-col>
                    <j-col :span="12">
                        <div class="doc">
                            <h1>1. {{t('Certificate.Detail.index.5rg3hg3xeoc0')}}</h1>
                            <div>
                                {{t('Certificate.Detail.index.5rg3hg3xes00')}}
                            </div>
                            <h1>2. {{t('Certificate.Detail.index.5rg3hg3xevk0')}}</h1>
                            <h2>1、{{$t('Certificate.Detail.index.5rg3hg3xcvk0')}}</h2>
                            <div>
                                {{t('Certificate.Detail.index.5rg3hg3xezg0')}}
                            </div>
                            <h2>2、{{$t('Certificate.Detail.index.5rg3hg3xdjs0')}}</h2>
                            <div>
                                {{t('Certificate.Detail.index.5rg3hg3xf4s0')}}
                                {{t('Certificate.Detail.index.5rg3hg3xf8o0')}}
                            </div>
                        </div>
                    </j-col>
                </j-row>
            </j-card>
        </FullPage>
    </page-container>
</template>

<script lang="ts" setup name="CertificateDetail">
import { Form } from 'ant-design-vue';
import { getImage } from '@/utils/comm';
import CertificateFile from './CertificateFile.vue';
import type { UploadChangeParam } from 'ant-design-vue';
import { save, update, queryDetail } from '@/api/link/certificate';
import { FormDataType, TypeObjType } from '../type';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter();
const route = useRoute();
const view = route.query.view as string;
const id = route.params.id as string;

const useForm = Form.useForm;

const fileLoading = ref(false);
const loading = ref(false);

const formData = ref<FormDataType>({
    type: 'common',
    name: '',
    configs: {
        cert: '',
        key: '',
    },
    description: '',
});

const { resetFields, validate, validateInfos } = useForm(
    formData,
    reactive({
        type: [{ required: true, message: t('Certificate.Detail.index.5rg3hg3xfc80'), trigger: 'blur' }],
        name: [
            { required: true, message: t('Certificate.Detail.index.5rg3hg3xco40'), trigger: 'blur' },
            { max: 64, message: t('Certificate.Detail.index.5rg3hg3xffs0') },
        ],
        'configs.cert': [
            { required: true, message: t('Certificate.Detail.index.5rg3hg3xfjw0'), trigger: 'blur' },
        ],
        'configs.key': [
            { required: true, message: t('Certificate.Detail.index.5rg3hg3xfjw0'), trigger: 'blur' },
        ],
        description: [{ max: 200, message: t('Certificate.Detail.index.5rg3hg3xfns0') }],
    }),
);

const onSubmit = () => {
    validate()
        .then(async (res) => {
            const params = toRaw(formData.value);
            loading.value = true;
            const response =
                id === ':id'
                    ? await save(params).catch(() => {})
                    : await update({ ...params, id }).catch(() => {});
            if (response?.status === 200) {
                onlyMessage(t('Certificate.Detail.index.5rg3hg3xfyo0'), 'success');
                router.push('/iot/link/certificate');
            }
            loading.value = false;
        })
        .catch((err) => {
            loading.value = false;
        });
};

const handleChange = (info: UploadChangeParam) => {
    fileLoading.value = true;
    if (info.file.status === 'done') {
        onlyMessage(t('Certificate.Detail.index.5rg3hg3xg1s0'), 'success');
        const result = info.file.response?.result;
        formData.value.configs.cert = result;
        fileLoading.value = false;
    }
};

const detail = async (id: string) => {
    if (id !== ':id') {
        loading.value = true;
        const res: any = await queryDetail(id);
        if (res.success) {
            const result: any = res.result;
            const type = result.type.value as TypeObjType;
            formData.value = {
                ...result,
                type,
            };
        }
        loading.value = false;
    }
};

detail(id);
</script>

<style lang="less" scoped>
.form {
    .form-radio-button {
        width: 148px;
        height: 80px;
        padding: 0;
        img {
            width: 100%;
            height: 100%;
        }
    }
}
</style>
