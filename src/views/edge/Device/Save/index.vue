<template>
    <j-modal
        :maskClosable="false"
        width="650px"
        :visible="true"
        :title="!!data?.id ? t('Device.Save.index.5rg5cooxqwc0') : t('Device.Save.index.5rg5cooxs800')"
        @ok="handleSave"
        @cancel="handleCancel"
        :confirmLoading="loading"
    >
        <div style="margin-top: 10px">
            <j-form :layout="'vertical'" ref="formRef" :model="modelRef">
                <j-row type="flex">
                    <j-col flex="180px">
                        <j-form-item name="photoUrl">
                            <JProUpload accept="image/jpeg,image/png" v-model="modelRef.photoUrl" :size="4"/>
                        </j-form-item>
                    </j-col>
                    <j-col flex="auto">
                        <j-form-item
                            name="id"
                            :rules="[
                                {
                                    pattern: /^[a-zA-Z0-9_\-]+$/,
                                    message: t('Device.Save.index.5rg5cooxsls0'),
                                },
                                {
                                    max: 64,
                                    message: t('Device.Save.index.5rg5cooxswc0'),
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
                                        :title="t('Device.Save.index.5rg5cooxt7k0')"
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
                                :placeholder="t('Device.Save.index.5rg8ellkoio0')"
                                :disabled="!!data?.id"
                            />
                        </j-form-item>
                        <j-form-item
                            :label="t('Device.Save.index.5rg5cooxtlo0')"
                            name="name"
                            :rules="[
                                {
                                    required: true,
                                    message: t('Device.Save.index.5rg5cooxts40'),
                                },
                                {
                                    max: 64,
                                    message: t('Device.Save.index.5rg5cooxswc0'),
                                },
                            ]"
                        >
                            <j-input
                                v-model:value="modelRef.name"
                                :placeholder="t('Device.Save.index.5rg5cooxts40')"
                            />
                        </j-form-item>
                    </j-col>
                </j-row>
                <j-row>
                    <j-col :span="22">
                        <j-form-item
                            name="productId"
                            :rules="[
                                {
                                    required: true,
                                    message: t('Device.Save.index.5rg5cooxty80'),
                                },
                            ]"
                        >
                            <template #label>
                                <span
                                    >
                                    {{t('Device.Save.index.5rke0desopk0')}}
                                    <j-tooltip :title="t('Device.Save.index.5rg5cooxu4s0')">
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
                                :placeholder="t('Device.Save.index.5rg8ellkpgo0')"
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
                    </j-col>
                    <j-col :span="2" style="margin-top: 30px">
                        <PermissionButton
                            type="link"
                            :disabled="data.id"
                            @click="visible = true"
                            hasPermission="device/Product:add"
                        >
                            <AIcon type="PlusOutlined" />
                        </PermissionButton>
                    </j-col>
                </j-row>
                <j-form-item
                    :label="t('Device.Save.index.5rg8ellkqv80')"
                    name="describe"
                    :rules="[
                        {
                            max: 200,
                            message: t('Device.Save.index.5rg5cooxuh00'),
                        },
                    ]"
                >
                    <j-textarea
                        v-model:value="modelRef.describe"
                        :placeholder="t('Device.Save.index.5rg8ellkqyg0')"
                        showCount
                        :maxlength="200"
                    />
                </j-form-item>
            </j-form>
        </div>
    </j-modal>
    <SaveProduct
        v-model:visible="visible"
        v-model:productId="modelRef.productId"
        :channel="'official-edge-gateway'"
        @close="onClose"
        :deviceType="'gateway'"
        @save="onSave"
    />
</template>

<script lang="ts" setup>
import { queryNoPagingPost } from '@/api/device/product';
import { isExists, update } from '@/api/device/instance';
import { getImage, onlyMessage } from '@/utils/comm';
import SaveProduct from '@/views/media/Device/Save/SaveProduct.vue';
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
const visible = ref<boolean>(false);

const formRef = ref();

const modelRef = reactive({
    productId: undefined,
    id: undefined,
    name: '',
    describe: '',
    photoUrl: getImage('/device-gateway.png'),
});

const vailId = async (_: Record<string, any>, value: string) => {
    if (!props?.data?.id && value) {
        const resp = await isExists(value);
        if (resp.status === 200 && resp.result) {
            return Promise.reject('该ID已存在');
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
                            type: 'and',
                        },
                        {
                            termType: 'eq',
                            column: 'accessProvider',
                            value: 'official-edge-gateway',
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
    },
    { immediate: true, deep: true },
);

const handleCancel = () => {
    emit('close');
    formRef.value.resetFields();
};

const onClose = () => {
    visible.value = false;
};

const onSave = (_data: any) => {
    productList.value.push(_data)
}

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
                onlyMessage(t('Device.Save.index.5rg5cooxuww0'));
                emit('save');
                formRef.value.resetFields();
            }
        })
        .catch((err: any) => {
            console.log('error', err);
        });
};
</script>