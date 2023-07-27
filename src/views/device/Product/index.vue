<template>
    <page-container>
        <pro-search
            :columns="query.columns"
            target="product-manage"
            @search="handleSearch"
        />
        <FullPage>
            <JProTable
                :columns="columns"
                :request="queryProductList"
                ref="tableRef"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
                :params="params"
            >
                <template #headerTitle>
                    <j-space>
                        <PermissionButton
                            type="primary"
                            @click="add"
                            hasPermission="device/Product:add"
                        >
                            <template #icon
                                ><AIcon type="PlusOutlined"
                            /></template>
                            {{t('device.Product.index.5rcy142sjs40')}}
                        </PermissionButton>
                        <j-upload
                            name="file"
                            accept=".json"
                            :showUploadList="false"
                            :before-upload="beforeUpload"
                        >
                            <PermissionButton
                                hasPermission="device/Product:import"
                                >{{t('device.Product.index.5rcy142sl800')}}</PermissionButton
                            >
                        </j-upload>
                    </j-space>
                </template>
                <template #deviceType="slotProps">
                    <div>{{ slotProps.deviceType.text }}</div>
                </template>
                <template #card="slotProps">
                    <CardBox
                        :value="slotProps"
                        :actions="getActions(slotProps, 'card')"
                        v-bind="slotProps"
                        :active="_selectedRowKeys.includes(slotProps.id)"
                        :status="slotProps.state"
                        @click="handleView(slotProps.id)"
                        :statusText="slotProps.state === 1 ? t('device.Product.index.5rcy142slf80') : t('device.Product.index.5rcy142sljs0')"
                        :statusNames="{
                            1: 'processing',
                            0: 'error',
                        }"
                    >
                        <template #img>
                            <slot name="img">
                                <img
                                    :src="
                                        slotProps.photoUrl ||
                                        getImage('/device-product.png')
                                    "
                                    class="productImg"
                                />
                            </slot>
                        </template>
                        <template #content>
                            <Ellipsis style="width: calc(100% - 100px); margin-bottom: 18px;"
                                ><span
                                    style="font-weight: 600; font-size: 16px"
                                >
                                    {{ slotProps.name }}
                                </span></Ellipsis
                            >
                            <j-row>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        {{t('device.Product.index.5rcy142slu40')}}
                                    </div>
                                    <div>{{ slotProps?.deviceType?.text }}</div>
                                </j-col>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        {{t('device.Product.index.5rcy142slzs0')}}
                                    </div>
                                    <Ellipsis
                                        ><div>
                                            {{
                                                slotProps?.accessName
                                                    ? slotProps?.accessName
                                                    : t('device.Product.index.5rcy142tl080')
                                            }}
                                        </div></Ellipsis
                                    >
                                </j-col>
                            </j-row>
                        </template>
                        <template #actions="item">
                            <PermissionButton
                                :disabled="item.disabled"
                                :popConfirm="item.popConfirm"
                                :tooltip="{
                                    ...item.tooltip,
                                }"
                                @click="item.onClick"
                                :hasPermission="
                                    item.key === 'view'
                                        ? true
                                        : 'device/Product:' + item.key
                                "
                            >
                                <AIcon
                                    type="DeleteOutlined"
                                    v-if="item.key === 'delete'"
                                />
                                <template v-else>
                                    <AIcon :type="item.icon" />
                                    <span>{{ item?.text }}</span>
                                </template>
                            </PermissionButton>
                        </template>
                    </CardBox>
                </template>
                <template #state="slotProps">
                    <BadgeStatus
                        :text="slotProps.state === 1 ? t('device.Product.index.5rcy142slf80') : t('device.Product.index.5rcy142sljs0')"
                        :status="slotProps.state"
                        :statusNames="{
                            1: 'processing',
                            0: 'error',
                        }"
                    />
                </template>
                <template #action="slotProps">
                    <j-space :size="16">
                        <template
                            v-for="i in getActions(slotProps, 'table')"
                            :key="i.key"
                        >
                            <PermissionButton
                                :disabled="i.disabled"
                                :popConfirm="i.popConfirm"
                                :hasPermission="
                                    i.key === 'view'
                                        ? true
                                        : 'device/Product:' + i.key
                                "
                                :tooltip="{
                                    ...i.tooltip,
                                }"
                                @click="i.onClick"
                                type="link"
                                style="padding: 0px"
                                :danger="i.key === 'delete'"
                            >
                                <template #icon
                                    ><AIcon :type="i.icon"
                                /></template>
                            </PermissionButton>
                        </template>
                    </j-space>
                </template>
            </JProTable>
        </FullPage>
        <!-- 新增、编辑 -->
        <Save ref="saveRef" :isAdd="isAdd" :title="title" @success="refresh" />
    </page-container>
</template>

<script setup lang="ts">
import server from '@/utils/request';
import type { ActionsType } from '@/components/Table/index.vue';
import { getImage, onlyMessage } from '@/utils/comm';
import {
    getProviders,
    category,
    queryOrgThree,
    queryGatewayList,
    queryProductList,
    _deploy,
    _undeploy,
    deleteProduct,
    addProduct,
    editProduct,
    queryProductId,
    updateDevice,
} from '@/api/device/product';
import { isNoCommunity, downloadObject } from '@/utils/utils';
import { omit } from 'lodash-es';
import { typeOptions } from '@/components/Search/util';
import Save from './Save/index.vue';
import { useMenuStore } from 'store/menu';
import { useRoute } from 'vue-router';
import { useRouterParams } from '@/utils/hooks/useParams';
import { accessConfigTypeFilter } from '@/utils/setting';
import {cloneDeep} from "lodash";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
/**
 * 表格数据
 */
const menuStory = useMenuStore();
const isAdd = ref<number>(0);
const title = ref<string>('');
const params = ref<Record<string, any>>({});
const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        scopedSlots: true,
        width: 200,
        ellipsis: true,
    },
    {
        title: t('device.Product.index.5rcy142tlgw0'),
        dataIndex: 'name',
        key: 'name',
        width: 220,
        ellipsis: true,
    },
    {
        title: t('device.Product.index.5rcy142slzs0'),
        dataIndex: 'accessName',
        key: 'accessName',
        width: 220,
        ellipsis: true,
    },
    {
        title: t('device.Product.index.5rcy142slu40'),
        dataIndex: 'deviceType',
        key: 'deviceType',
        scopedSlots: true,
        ellipsis: true,
        width: 120,
    },
    {
        title: t('device.Product.index.5rcy142tlvo0'),
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        ellipsis: true,
        width: 90,
    },
    {
        title: t('device.Product.index.5rcy142tm5g0'),
        dataIndex: 'describe',
        key: 'describe',
        ellipsis: true,
    },
    {
        title: t('device.Product.index.5rcy142tmdw0'),
        key: 'action',
        fixed: 'right',
        width: 200,
        scopedSlots: true,
        ellipsis: true,
    },
];

const _selectedRowKeys = ref<string[]>([]);
const currentForm = ref({});

const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
    if (!data) {
        return [];
    }
    const actions = [
        {
            key: 'view',
            text: t('device.Product.index.5rcy142tmsw0'),
            tooltip: {
                title: t('device.Product.index.5rcy142tmsw0'),
            },
            icon: 'EyeOutlined',
            onClick: () => {
                handleView(data.id);
            },
        },
        {
            key: 'update',
            text: t('device.Product.index.5rcy142tn2o0'),
            tooltip: {
                title: t('device.Product.index.5rcy142tn2o0'),
            },
            icon: 'EditOutlined',
            onClick: () => {
                title.value = t('device.Product.index.5rcy142tn2o0');
                isAdd.value = 2;
                nextTick(() => {
                    saveRef.value.show(data);
                });
            },
        },
        {
            key: 'export',
            text: t('device.Product.index.5rcy142tnbk0'),
            tooltip: {
                title: t('device.Product.index.5rcy142tnbk0'),
            },

            icon: 'icon-xiazai',
            onClick: () => {
                const extra = omit(data, [
                    'transportProtocol',
                    'protocolName',
                    'accessId',
                    'accessName',
                    'accessProvider',
                    'messageProtocol',
                ]);
                downloadObject(extra, t('device.Product.index.5rcy142tnio0'));
            },
        },
        {
            key: 'action',
            text: data.state !== 0 ? t('device.Product.index.5rcy142sljs0') : t('device.Product.index.5rcy142tnp40'),
            tooltip: {
                title: data.state !== 0 ? t('device.Product.index.5rcy142sljs0') : t('device.Product.index.5rcy142tnp40'),
            },
            icon: data.state !== 0 ? 'StopOutlined' : 'CheckCircleOutlined',
            popConfirm: {
                title: `${t('device.Product.index.verify') + (data.state !== 0 ? t('device.Product.index.5rcy142sljs0') : t('device.Product.index.5rcy142tnp40'))}?`,
                onConfirm: async () => {
                    let response = undefined;
                    if (data.state !== 0) {
                        response = await _undeploy(data.id);
                    } else {
                        response = await _deploy(data.id);
                    }
                    if (response && response.status === 200) {
                        onlyMessage(t('device.Product.index.5rcy142tnw00'));
                        tableRef.value?.reload();
                    } else {
                        onlyMessage(t('device.Product.index.5rcy142to240'), 'error');
                    }
                },
            },
        },
        {
            key: 'delete',
            text: t('device.Product.index.5rcy142to7s0'),
            disabled: data.state !== 0,
            tooltip: {
                title: data.state !== 0 ? t('device.Product.index.5rcy142toe80') : t('device.Product.index.5rcy142to7s0'),
            },
            popConfirm: {
                title: t('device.Product.index.5rcy142tomg0'),
                onConfirm: async () => {
                    const resp = await deleteProduct(data.id);
                    if (resp.status === 200) {
                        onlyMessage(t('device.Product.index.5rcy142tnw00'));
                        tableRef.value?.reload();
                    } else {
                        onlyMessage(t('device.Product.index.5rcy142to240'), 'error');
                    }
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
    if (type === 'card')
        return actions.filter((i: ActionsType) => i.key !== 'view');
    return actions;
};

/**
 * {{t('device.Product.index.5rcy142sjs40')}}
 */
const add = () => {
    isAdd.value = 1;
    title.value = t('device.Product.index.5rcy142sjs40');
    nextTick(() => {
        saveRef.value.show(currentForm.value);
    });
};

/**
 * {{t('device.Product.index.5rcy142sl800')}}
 */
const beforeUpload = (file: any) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async (result) => {
        const text = result.target?.result;
        console.log('text: ', text);
        if (!file.type.includes('json')) {
            onlyMessage(t('device.Product.index.5rcy142tor80'), 'error');
            return false;
        }
        try {
            const data = JSON.parse(text || '{}');
            // 设置导入的产品状态为未发布
            data.state = 0;
            if (Array.isArray(data)) {
                onlyMessage(t('device.Product.index.5rcy142tor80'), 'error');
                return false;
            }
            delete data.state;
            const res = await updateDevice(data);
            if (res.status === 200) {
                onlyMessage(t('device.Product.index.5rcy142tox40'));
                tableRef.value?.reload();
            }
            return true;
        } catch {
            // onlyMessage('请上传json格式文件', 'error');
        }
        return true;
    };
    return false;
};
/**
 * {{t('device.Product.index.5rcy142tmsw0')}}
 */
const handleView = (id: string) => {
    menuStory.jumpPage('device/Product/Detail', { id });
};

/**
 * 刷新数据
 */
const refresh = () => {
    tableRef.value?.reload();
};
// 筛选
const listData = ref([]);
const typeList = ref([]);
const tableRef = ref<Record<string, any>>({});
const query = reactive({
    columns: [
        {
            title: t('device.Product.index.5rcy142tp1s0'),
            dataIndex: 'name',
            key: 'name',
            search: {
                first: true,
                type: 'string',
            },
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            search: {
                type: 'string',
            },
        },
        {
            title: t('device.Product.index.5rcy142tpb00'),
            key: 'accessProvider',
            dataIndex: 'accessProvider',
            search: {
                type: 'select',
                options: async () => {
                    return new Promise((resolve) => {
                        getProviders().then((resp: any) => {
                            const data = resp.result || [];
                            resolve(accessConfigTypeFilter(data));
                        });
                    });
                },
            },
        },
        {
            title: t('device.Product.index.5rcy142slzs0'),
            key: 'accessId',
            dataIndex: 'accessId',
            search: {
                type: 'select',
                options: async () => {
                    return new Promise((res) => {
                        queryGatewayList({
                            paging: false,
                        }).then((resp: any) => {
                            typeList.value = [];
                            typeList.value = resp.result.map((item: any) => ({
                                label: item.name,
                                value: item.id,
                            }));
                            res(typeList.value);
                        });
                    });
                },
            },
        },
        {
            title: t('device.Product.index.5rcy142slu40'),
            key: 'deviceType',
            dataIndex: 'deviceType',
            search: {
                type: 'select',
                options: [
                    {
                        label: t('device.Product.index.5rcy142tpi00'),
                        value: 'device',
                    },
                    {
                        label: t('device.Product.index.5rcy142tpp40'),
                        value: 'childrenDevice',
                    },
                    {
                        label: t('device.Product.index.5rcy142tpu80'),
                        value: 'gateway',
                    },
                ],
            },
        },
        {
            title: t('device.Product.index.5rcy142tlvo0'),
            key: 'state',
            dataIndex: 'state',
            search: {
                type: 'select',
                options: [
                    {
                        label: t('device.Product.index.5rcy142slf80'),
                        value: 1,
                    },
                    {
                        label: t('device.Product.index.5rcy142sljs0'),
                        value: 0,
                    },
                ],
            },
        },
        {
            title: t('device.Product.index.5rcy142tm5g0'),
            key: 'describe',
            dataIndex: 'describe',
            search: {
                type: 'string',
            },
        },
        {
            title: t('device.Product.index.5rcy142tpz00'),
            key: 'classified',
            dataIndex: 'classifiedId',
            search: {
                type: 'treeSelect',
                options: async () => {
                    return new Promise((res) => {
                        category({
                            paging: false,
                        }).then((resp) => {
                            res(resp.result);
                        });
                    });
                },
            },
        },
        {
            title: t('device.Product.index.5rcy142tq4k0'),
            key: 'id$dim-assets',
            dataIndex: 'id$dim-assets',
            search: {
                first: true,
                type: 'treeSelect',
                options: async () => {
                    return new Promise((res) => {
                        queryOrgThree({ paging: false }).then((resp: any) => {
                            const formatValue = (list: any[]) => {
                                const _list: any[] = [];
                                list.forEach((item) => {
                                    if (item.children) {
                                        item.children = formatValue(
                                            item.children,
                                        );
                                    }
                                    _list.push({
                                        ...item,
                                        value: JSON.stringify({
                                            assetType: 'product',
                                            targets: [
                                                {
                                                    type: 'org',
                                                    id: item.id,
                                                },
                                            ],
                                        }),
                                    });
                                });
                                return _list;
                            };
                            res(formatValue(resp.result));
                        });
                    });
                },
            },
        },
        {
            title: t('device.Product.index.5rcy142tmdw0'),
            key: 'action',
            fixed: 'right',
            width: 250,
            scopedSlots: true,
        },
    ],
});
const saveRef = ref();
const handleSearch = (e: any) => {

  const newTerms = cloneDeep(e)
  if (newTerms.terms?.length) {
    newTerms.terms.forEach((a : any) => {
        a.terms = a.terms.map((b: any) => {
          if (b.column === 'id$dim-assets') {
            const value = b.value
            b = {
              column: 'id',
              termType: 'dim-assets',
              value: {
                assetType: 'product',
                targets: [
                  {
                    type: 'org',
                    id: value,
                  },
                ],
              },
            }
          }
          return b
        })
    })
  }

  params.value = newTerms;
};
const routerParams = useRouterParams();
onMounted(() => {
    if (routerParams.params?.value.save) {
        add();
    }
});
</script>

<style lang="less" scoped>
.box {
    padding: 20px;
    background: #f0f2f5;
}
.productImg {
    width: 80px;
    height: 80px;
}
.productName {
    white-space: nowrap; /*强制在同一行内显示所有文本，直到文本结束或者遭遇br标签对象才换行。*/
    overflow: hidden; /*超出部分隐藏*/
    text-overflow: ellipsis; /*隐藏部分以省略号代替*/
}
</style>
