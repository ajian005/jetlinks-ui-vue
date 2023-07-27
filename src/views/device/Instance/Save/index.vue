<template>
    <j-modal
        :maskClosable="false"
        width="650px"
        :visible="true"
        :title="!!data?.id ? t('Instance.Save.index.5rg4mi4y4qs0') : t('Instance.Save.index.5rg4mi4y7f00')"
        @ok="handleSave"
        @cancel="handleCancel"
        :confirmLoading="loading"
    >
        <div style="margin-top: 10px">
            <j-form :layout="'vertical'" ref="formRef" :model="modelRef">
                <j-row type="flex">
                    <j-col flex="180px">
                        <j-form-item name="photoUrl">
                            <JProUpload accept="image/jpeg,image/png" v-model="modelRef.photoUrl" />
                        </j-form-item>
                    </j-col>
                    <j-col flex="auto">
                        <j-form-item
                            name="id"
                            :rules="[
                                {
                                    pattern: /^[a-zA-Z0-9_\-]+$/,
                                    message: t('Instance.Save.index.5rcy87xoavw0'),
                                },
                                {
                                    max: 64,
                                    message: t('Instance.Save.index.5rg4mi4y9i80'),
                                },
                                {
                                    validator: vailId,
                                    trigger: 'blur',
                                },
                            ]"
                        >
                            <template #label>
                                <span>
                                    ID
                                    <j-tooltip
                                        :title="t('Instance.Save.index.5rcy87xob6s0')"
                                    >
                                        <AIcon
                                            type="QuestionCircleOutlined"
                                            style="margin-left: 2px"
                                        />
                                    </j-tooltip>
                                </span>
                            </template>
                            <j-input
                                v-model:value="modelRef.id"
                                :placeholder="t('Instance.Save.index.5rcy87xobc40')"
                                :disabled="!!data?.id"
                            />
                        </j-form-item>
                        <j-form-item
                            :label="t('Instance.Save.index.5rg4mi4y8jo0')"
                            name="name"
                            :rules="[
                                {
                                    required: true,
                                    message: t('Instance.Save.index.5rg4mi4y8sw0'),
                                },
                                {
                                    max: 64,
                                    message: t('Instance.Save.index.5rg4mi4y9i80'),
                                },
                            ]"
                        >
                            <j-input
                                v-model:value="modelRef.name"
                                :placeholder="t('Instance.Save.index.5rg4mi4y8sw0')"
                            />
                        </j-form-item>
                    </j-col>
                </j-row>
                <j-form-item
                    name="productId"
                    :rules="[
                        {
                            required: true,
                            message: t('Instance.Save.index.5rcy87xobpo0'),
                        },
                    ]"
                >
                    <template #label>
                        <span
                            >
                            {{t('Instance.Save.index.5rh473it3qc0')}}
                            <j-tooltip :title="t('Instance.Save.index.5rcy87xobu40')">
                                <AIcon
                                    type="QuestionCircleOutlined"
                                    style="margin-left: 2px"
                                />
                            </j-tooltip>
                        </span>
                    </template>
                    <j-select
                        showSearch
                        v-model:value="modelRef.productId"
                        :disabled="!!data?.id"
                        :placeholder="t('Instance.Save.index.5rcy87xoc040')"
                    >
                        <j-select-option
                            :value="item.id"
                            v-for="item in productList"
                            :key="item.id"
                            :label="item.name"
                            >{{ item.name }}</j-select-option
                        >
                    </j-select>
                </j-form-item>
                <j-form-item
                    :label="t('Instance.Save.index.5rg4mi4y91w0')"
                    name="describe"
                    :rules="[
                        {
                            max: 200,
                            message: t('Instance.Save.index.5rcy87xoc8s0')
                        },
                    ]"
                >
                    <j-textarea
                        v-model:value="modelRef.describe"
                        :placeholder="t('Instance.Save.index.5rg4mi4y9bw0')"
                        showCount
                        :maxlength="200"
                    />
                </j-form-item>
            </j-form>
        </div>
    </j-modal>
</template>

<script lang="ts" setup>
import { queryNoPagingPost } from '@/api/device/product';
import { isExists, update } from '@/api/device/instance';
import { getImage, onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emit = defineEmits(['close', 'save']);
const props = defineProps({
    data: {
        type: Object,
        default: undefined,
    },
});
const productList = ref<Record<string, any>[]>([]);
const loading = ref<boolean>(false);

const formRef = ref();

const modelRef = reactive({
    productId: undefined,
    id: undefined,
    name: '',
    describe: '',
    photoUrl: getImage('/device/instance/device-card.png'),
});

const vailId = async (_: Record<string, any>, value: string) => {
    if (!props?.data?.id && value) {
        const resp = await isExists(value);
        if (resp.status === 200 && resp.result) {
            return Promise.reject(t('Instance.Save.index.IDRepeat'));
        } else {
            return Promise.resolve();
        }
    } else {
        return Promise.resolve();
    }
};

watch(
    () => props.data,
    (newValue) => {
        queryNoPagingPost({
            paging: false,
            sorts: [{ name: 'createTime', order: 'desc' }],
            terms: [
                {
                    terms: [
                        {
                            termType: 'eq',
                            column: 'state',
                            value: 1,
                        },
                    ],
                },
            ],
        }).then((resp) => {
            if (resp.status === 200) {
                productList.value = resp.result as Record<string, any>[];
            }
        });
        Object.assign(modelRef, newValue);
        // description 和 describe 处理
        modelRef.describe = newValue?.describe || newValue?.description
    },
    { immediate: true, deep: true },
);

const handleCancel = () => {
    emit('close');
    formRef.value.resetFields();
};

const handleSave = () => {
    formRef.value
        .validate()
        .then(async (_data: any) => {
            loading.value = true;
            const obj = { ..._data };
            if (!obj.id) {
                delete obj.id;
            }
            const resp = await update(obj).finally(() => {
                loading.value = false;
            });
            if (resp.status === 200) {
                onlyMessage(t('Instance.Save.index.5rg4mi4y9s00'));
                emit('save');
                formRef.value.resetFields();
            }
        })
        .catch((err: any) => {
            console.log('error', err);
        });
};
</script>