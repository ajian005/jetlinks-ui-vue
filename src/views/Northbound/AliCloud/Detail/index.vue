<template>
    <page-container>
        <FullPage>
            <j-card>
                <div class="box">
                    <div class="left">
                        <div class="left-content">
                            <TitleComponent :data="t('AliCloud.Detail.index.5rg4hbavf1s0')" />
                            <j-alert
                                v-if="!!_error && modelRef?.id"
                                style="margin: 10px 0"
                                type="warning"
                            >
                                <template #message>
                                    <div
                                        style="
                                            display: flex;
                                            justify-content: space-between;
                                            align-items: center;
                                        "
                                    >
                                        <span
                                            style="
                                                width: calc(100% - 100px);
                                                text-align: center;
                                            "
                                            >{{ _error }}</span
                                        >
                                        <PermissionButton
                                            :popConfirm="{
                                                title: '确认启用',
                                                onConfirm: onActiveProduct,
                                            }"
                                            size="small"
                                            :hasPermission="'device/Product:action'"
                                        >
                                            立即启用
                                        </PermissionButton>
                                    </div>
                                </template>
                            </j-alert>
                            <j-form
                                :layout="'vertical'"
                                ref="formRef"
                                :model="modelRef"
                            >
                                <j-row :gutter="24">
                                    <j-col :span="24">
                                        <j-form-item
                                            :label="t('AliCloud.Detail.index.5rg4hbavguk0')"
                                            name="name"
                                            :rules="[
                                                {
                                                    required: true,
                                                    message: t('AliCloud.Detail.index.5rg4hbavh7c0'),
                                                },
                                                {
                                                    max: 64,
                                                    message: t('AliCloud.Detail.index.5rg4hbavhgs0'),
                                                },
                                            ]"
                                        >
                                            <j-input
                                                :placeholder="t('AliCloud.Detail.index.5rg4hbavh7c0')"
                                                v-model:value="modelRef.name"
                                            />
                                        </j-form-item>
                                    </j-col>
                                    <j-col :span="24">
                                        <j-form-item
                                            :name="['accessConfig', 'regionId']"
                                            :rules="[
                                                {
                                                    required: true,
                                                    message: t('AliCloud.Detail.index.5rg4hbavhog0'),
                                                },
                                            ]"
                                        >
                                            <template #label>
                                                <span>
                                                    {{t('AliCloud.Detail.index.5rg4hbavhuw0')}}
                                                    <j-tooltip
                                                        :title="t('AliCloud.Detail.index.5rg4hbavia80')"
                                                    >
                                                        <AIcon
                                                            type="QuestionCircleOutlined"
                                                            style="
                                                                margin-left: 2px;
                                                            "
                                                        />
                                                    </j-tooltip>
                                                </span>
                                            </template>
                                            <j-select
                                                :placeholder="t('AliCloud.Detail.index.5rg4hbavhog0')"
                                                v-model:value="
                                                    modelRef.accessConfig
                                                        .regionId
                                                "
                                                show-search
                                                @blur="productChange"
                                            >
                                                <j-select-option
                                                    v-for="item in regionsList"
                                                    :key="item.id"
                                                    :value="item.id"
                                                    :label="item.name"
                                                    >{{
                                                        item.name
                                                    }}</j-select-option
                                                >
                                            </j-select>
                                        </j-form-item>
                                    </j-col>
                                    <j-col :span="24">
                                        <j-form-item
                                            :name="[
                                                'accessConfig',
                                                'instanceId',
                                            ]"
                                        >
                                            <template #label>
                                                <span>
                                                    {{t('AliCloud.Detail.index.5rg4hbavij00')}}
                                                    <j-tooltip
                                                        :title="t('AliCloud.Detail.index.5rg4hbavixc0')"
                                                    >
                                                        <AIcon
                                                            type="QuestionCircleOutlined"
                                                            style="
                                                                margin-left: 2px;
                                                            "
                                                        />
                                                    </j-tooltip>
                                                </span>
                                            </template>
                                            <j-input
                                                :placeholder="t('AliCloud.Detail.index.5rg4hbavj2o0')"
                                                v-model:value="
                                                    modelRef.accessConfig
                                                        .instanceId
                                                "
                                                @blur="productChange"
                                            />
                                        </j-form-item>
                                    </j-col>
                                    <j-col :span="24">
                                        <j-form-item
                                            :name="[
                                                'accessConfig',
                                                'accessKeyId',
                                            ]"
                                            :rules="[
                                                {
                                                    required: true,
                                                    message: t('AliCloud.Detail.index.5rg4hbavj7s0'),
                                                },
                                                {
                                                    max: 64,
                                                    message: t('AliCloud.Detail.index.5rg4hbavhgs0'),
                                                },
                                            ]"
                                        >
                                            <template #label>
                                                <span>
                                                    accessKey
                                                    <j-tooltip
                                                        :title="t('AliCloud.Detail.index.5rg4hbavjd80')"
                                                    >
                                                        <AIcon
                                                            type="QuestionCircleOutlined"
                                                            style="
                                                                margin-left: 2px;
                                                            "
                                                        />
                                                    </j-tooltip>
                                                </span>
                                            </template>
                                            <j-input
                                                :placeholder="t('AliCloud.Detail.index.5rg4hbavj7s0')"
                                                v-model:value="
                                                    modelRef.accessConfig
                                                        .accessKeyId
                                                "
                                                @blur="productChange"
                                            />
                                        </j-form-item>
                                    </j-col>
                                    <j-col :span="24">
                                        <j-form-item
                                            :name="[
                                                'accessConfig',
                                                'accessSecret',
                                            ]"
                                            :rules="[
                                                {
                                                    required: true,
                                                    message:
                                                        t('AliCloud.Detail.index.5rg4hbavjlc0'),
                                                },
                                                {
                                                    max: 64,
                                                    message: t('AliCloud.Detail.index.5rg4hbavhgs0'),
                                                },
                                            ]"
                                        >
                                            <template #label>
                                                <span>
                                                    accessSecret
                                                    <j-tooltip
                                                        :title="t('AliCloud.Detail.index.5rg4hbavjqo0')"
                                                    >
                                                        <AIcon
                                                            type="QuestionCircleOutlined"
                                                            style="
                                                                margin-left: 2px;
                                                            "
                                                        />
                                                    </j-tooltip>
                                                </span>
                                            </template>
                                            <j-input
                                                :placeholder="t('AliCloud.Detail.index.5rg4hbavjlc0')"
                                                v-model:value="
                                                    modelRef.accessConfig
                                                        .accessSecret
                                                "
                                                @blur="productChange"
                                            />
                                        </j-form-item>
                                    </j-col>
                                    <j-col :span="24">
                                        <j-form-item
                                            name="bridgeProductKey"
                                            :rules="{
                                                required: true,
                                                message: t('AliCloud.Detail.index.5rg4hbavjxo0'),
                                            }"
                                        >
                                            <template #label>
                                                <span>
                                                    {{t('AliCloud.Detail.index.5rg4hbavkfw0')}}
                                                    <j-tooltip
                                                        :title="t('AliCloud.Detail.index.5rg4hbavkq00')"
                                                    >
                                                        <AIcon
                                                            type="QuestionCircleOutlined"
                                                            style="
                                                                margin-left: 2px;
                                                            "
                                                        />
                                                    </j-tooltip>
                                                </span>
                                            </template>
                                            <j-select
                                                :placeholder="t('AliCloud.Detail.index.5rg4hbavjxo0')"
                                                v-model:value="
                                                    modelRef.bridgeProductKey
                                                "
                                                show-search
                                            >
                                                <j-select-option
                                                    v-for="item in aliyunProductList"
                                                    :key="item.productKey"
                                                    :value="item.productKey"
                                                    :label="item.productName"
                                                    >{{
                                                        item.productName
                                                    }}</j-select-option
                                                >
                                            </j-select>
                                        </j-form-item>
                                    </j-col>
                                    <j-col :span="24">
                                        <p>{{t('AliCloud.Detail.index.5rg4hbavkxw0')}}</p>
                                        <j-collapse
                                            v-if="modelRef.mappings.length"
                                            :activeKey="activeKey"
                                            @change="onCollChange"
                                        >
                                            <j-collapse-panel
                                                v-for="(
                                                    item, index
                                                ) in modelRef.mappings"
                                                :key="index"
                                                :forceRender="false"
                                                :header="
                                                    item.productKey
                                                        ? aliyunProductList.find(
                                                              (i) =>
                                                                  i.productKey ===
                                                                  item.productKey,
                                                          )?.productName ||
                                                          `${t('AliCloud.Detail.index.productMap') + (index + 1)}`
                                                        : `${t('AliCloud.Detail.index.productMap') + (index + 1)}`
                                                "
                                            >
                                                <template #extra
                                                    ><AIcon
                                                        type="DeleteOutlined"
                                                        @click="delItem(index)"
                                                /></template>
                                                <j-row :gutter="24">
                                                    <j-col :span="12">
                                                        <j-form-item
                                                            :label="t('AliCloud.Detail.index.5rg4hbavlfo0')"
                                                            :name="[
                                                                'mappings',
                                                                index,
                                                                'productKey',
                                                            ]"
                                                            :rules="{
                                                                required: true,
                                                                message:
                                                                    t('AliCloud.Detail.index.5rg4hbavln80'),
                                                            }"
                                                        >
                                                            <j-select
                                                                :placeholder="t('AliCloud.Detail.index.5rg4hbavln80')"
                                                                v-model:value="
                                                                    item.productKey
                                                                "
                                                                show-search
                                                            >
                                                                <j-select-option
                                                                    v-for="i in getAliyunProductList(
                                                                        item?.productKey ||
                                                                            '',
                                                                    )"
                                                                    :key="
                                                                        i.productKey
                                                                    "
                                                                    :value="
                                                                        i.productKey
                                                                    "
                                                                    :label="
                                                                        i.productName
                                                                    "
                                                                    >{{
                                                                        i.productName
                                                                    }}</j-select-option
                                                                >
                                                            </j-select>
                                                        </j-form-item>
                                                    </j-col>
                                                    <j-col :span="12">
                                                        <j-form-item
                                                            :label="t('AliCloud.Detail.index.5rg4hbavlww0')"
                                                            :name="[
                                                                'mappings',
                                                                index,
                                                                'productId',
                                                            ]"
                                                            :rules="[
                                                                {
                                                                    required: true,
                                                                    message:
                                                                        t('AliCloud.Detail.index.5rg4hbavm3k0'),
                                                                },
                                                                {
                                                                    validator:
                                                                        _validator,
                                                                    trigger:
                                                                        'change',
                                                                },
                                                            ]"
                                                        >
                                                            <!-- <j-select
                                                                :placeholder="t('AliCloud.Detail.index.5rg4hbavm3k0')"
                                                                v-model:value="
                                                                    item.productId
                                                                "
                                                                show-search
                                                            >
                                                                <j-select-option
                                                                    v-for="i in getPlatProduct(
                                                                        item.productId ||
                                                                            '',
                                                                    )"
                                                                    :key="i.id"
                                                                    :value="
                                                                        i?.id
                                                                    "
                                                                    :label="
                                                                        i.name
                                                                    "
                                                                    >{{
                                                                        i.name
                                                                    }}</j-select-option
                                                                >
                                                            </j-select> -->
                                                            <MSelect
                                                                v-model:value="
                                                                    item.productId
                                                                "
                                                                :options="
                                                                    getPlatProduct(
                                                                        item.productId ||
                                                                            '',
                                                                    )
                                                                "
                                                                @error="
                                                                    onPlatError
                                                                "
                                                            />
                                                        </j-form-item>
                                                    </j-col>
                                                </j-row>
                                            </j-collapse-panel>
                                        </j-collapse>
                                        <j-card v-else>
                                            <j-empty />
                                        </j-card>
                                    </j-col>
                                    <j-col :span="24">
                                        <j-button
                                            type="dashed"
                                            style="
                                                width: 100%;
                                                margin-top: 10px;
                                            "
                                            @click="addItem"
                                        >
                                            <AIcon
                                                type="PlusOutlined"
                                                style="margin-left: 2px"
                                            />{{ t('AliCloud.Detail.index.add') }}
                                        </j-button>
                                    </j-col>
                                    <j-col :span="24" style="margin-top: 20px">
                                        <j-form-item
                                            :label="t('AliCloud.Detail.index.5rg4hbavmb80')"
                                            name="description"
                                            :rules="{
                                                max: 200,
                                                message: t('AliCloud.Detail.index.5rg4hbavmio0'),
                                            }"
                                        >
                                            <j-textarea
                                                v-model:value="
                                                    modelRef.description
                                                "
                                                :placeholder="t('AliCloud.Detail.index.5rg4hbavmos0')"
                                                showCount
                                                :maxlength="200"
                                            />
                                        </j-form-item>
                                    </j-col>
                                </j-row>
                            </j-form>
                            <div v-if="type === 'edit'">
                                <PermissionButton
                                    type="primary"
                                    :loading="loading"
                                    @click="saveBtn"
                                    :hasPermission="[
                                        'Northbound/AliCloud:add',
                                        'Northbound/AliCloud:update',
                                    ]"
                                >
                                    {{t('AliCloud.Detail.index.5rg4hbavmuk0')}}
                                </PermissionButton>
                            </div>
                        </div>
                    </div>
                    <div class="right">
                        <Doc />
                    </div>
                </div>
            </j-card>
        </FullPage>
    </page-container>
</template>

<script lang="ts" setup>
import Doc from './doc.vue';
import {
    savePatch,
    detail,
    getRegionsList,
    getAliyunProductsList,
    queryProductList,
} from '@/api/northbound/alicloud';
import _ from 'lodash';
import { onlyMessage } from '@/utils/comm';
import MSelect from '../../components/MSelect/index.vue';
import { _deploy } from '@/api/device/product';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter();
const route = useRoute();

const formRef = ref();
const _errorSet = ref<Set<string>>(new Set());

const modelRef = reactive({
    id: undefined,
    name: undefined,
    accessConfig: {
        regionId: undefined,
        instanceId: undefined,
        accessKeyId: undefined,
        accessSecret: undefined,
    },
    bridgeProductKey: undefined,
    bridgeProductName: undefined,
    mappings: [
        {
            productKey: undefined,
            productId: undefined,
        },
    ],
    description: undefined,
});

const addItem = () => {
    activeKey.value.push(String(modelRef.mappings.length));
    modelRef.mappings.push({
        productKey: undefined,
        productId: undefined,
    });
};

const delItem = (index: number) => {
    modelRef.mappings.splice(index, 1);
};

const productList = ref<Record<string, any>[]>([]);
const regionsList = ref<Record<string, any>[]>([]);
const aliyunProductList = ref<Record<string, any>[]>([]);
const loading = ref<boolean>(false);
const type = ref<'edit' | 'view'>('edit');
const activeKey = ref<string[]>(['0']);

const queryRegionsList = async () => {
    const resp = await getRegionsList();
    if (resp.status === 200) {
        regionsList.value = resp.result as Record<string, any>[];
    }
};
const getProduct = async () => {
    const resp = await queryProductList({
        paging: false,
        sorts: [{ name: 'createTime', order: 'desc' }],
    });
    if (resp.status === 200) {
        productList.value = resp?.result as Record<string, any>[];
    }
};

const getAliyunProduct = async (data: any) => {
    if (data.regionId && data.accessKeyId && data.accessSecret) {
        const resp: any = await getAliyunProductsList(data);
        if (resp.status === 200) {
            aliyunProductList.value = resp?.result?.data as Record<
                string,
                any
            >[];
        }
    }
};

const productChange = () => {
    const data = modelRef.accessConfig;
    getAliyunProduct(data);
};

const getPlatProduct = (val: string) => {
    const arr = modelRef.mappings.map((item) => item?.productId) || [];
    const checked = _.cloneDeep(arr);
    const _index = checked.findIndex((i) => i === val);
    checked.splice(_index, 1);
    const list = productList.value.filter(
        (i: any) => !checked.includes(i?.id as any),
    );
    return list || [];
};

const getAliyunProductList = (val: string) => {
    const items = modelRef.mappings.map((item) => item?.productKey) || [];
    const checked = _.cloneDeep(items);
    const _index = checked.findIndex((i) => i === val);
    checked.splice(_index, 1);
    const list = aliyunProductList.value?.filter(
        (i: any) => !checked.includes(i?.productKey as any),
    );
    return list || [];
};

const onCollChange = (_key: string[]) => {
    activeKey.value = _key;
};

const _error = computed(() => {
    return _errorSet.value.size ? `当前选择的部分产品为禁用状态` : ''
})

const onActiveProduct = async () => {
    [..._errorSet.value.values()].forEach(async (i: any) => {
        const resp = await _deploy(i).catch((error) => {
            onlyMessage('操作失败', 'error');
        });
        if(resp?.status === 200) {
            _errorSet.value.delete(i)
            onlyMessage(t('AliCloud.Detail.index.5rg4hbavn100'));
        }
    });
    await getProduct();
};

const onPlatError = (val: any) => {
    const _item = productList.value.find((item) => item.id === val);
    if (val && _item && !_item?.state) {
        _errorSet.value.add(val)
    }
};

const _validator = (_rule: any, value: string): Promise<any> =>
    new Promise((resolve, reject) => {
        const _item = productList.value.find((item) => item.id === value);
        if(!modelRef.id || modelRef.id === ':id') {
            return resolve('');
        } else if (!_item && value) {
            return reject('关联产品已被删除，请重新选择');
        }
        return resolve('');
    });

const saveBtn = () => {
    formRef.value
        .validate()
        .then(async (data: any) => {
            const product = (aliyunProductList.value || []).find(
                (item: any) => item?.productKey === data?.bridgeProductKey,
            );
            data.bridgeProductName = product?.productName || '';
            loading.value = true;
            const resp = await savePatch({
                ...toRaw(modelRef),
                ...data,
            }).finally(() => {
                loading.value = false;
            });
            if (resp.status === 200) {
                onlyMessage(t('AliCloud.Detail.index.5rg4hbavn100'));
                formRef.value.resetFields();
                router.push('/iot/northbound/AliCloud');
            }
        })
        .catch((err: any) => {
            const _arr = err.errorFields.map((i: any) => i.name);
            _arr.map((item: string | any[]) => {
                if (item.length === 3 && !activeKey.value.includes(item[1])) {
                    activeKey.value.push(item[1]);
                }
            });
        });
};
watch(
    () => route.params?.id,
    async (newId) => {
        if (newId) {
            queryRegionsList();
            await getProduct();
            if (newId === ':id' || !newId) return;
            const resp = await detail(newId as string);
            const _data: any = resp.result;
            if (_data) {
                getAliyunProduct(_data?.accessConfig);
            }
            Object.assign(modelRef, _data);
            activeKey.value = (_data?.mappings || []).map(
                (_: any, index: number) => index,
            );
        }
    },
    { immediate: true, deep: true },
);

watch(
    () => route.query.type,
    (newVal) => {
        if (newVal) {
            type.value = newVal as 'edit' | 'view';
        }
    },
    { immediate: true, deep: true },
);
</script>

<style scoped lang="less">
.box {
    position: relative;
    .left {
        .left-content {
            width: 66%;
        }
    }
    .right {
        width: 33%;
        position: absolute;
        right: 0;
        top: 0;
        overflow-y: auto;
        height: 100%;
    }
}
</style>