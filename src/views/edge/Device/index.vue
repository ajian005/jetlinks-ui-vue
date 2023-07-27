<template>
    <page-container>
        <pro-search
            :columns="columns"
            target="edge-device"
            @search="handleSearch"
        />
        <FullPage>
            <JProTable
                ref="edgeDeviceRef"
                :columns="columns"
                :request="query"
                :defaultParams="defaultParams"
                :params="params"
                :gridColumn="3"
            >
                <template #headerTitle>
                    <j-space>
                        <PermissionButton
                            type="primary"
                            @click="handleAdd"
                            hasPermission="edge/Device:add"
                        >
                            <template #icon
                                ><AIcon type="PlusOutlined"
                            /></template>
                            {{t('edge.Device.index.5rg5czh0vu00')}}
                        </PermissionButton>
                        <PermissionButton
                            @click="importVisible = true"
                            hasPermission="edge/Device:import"
                        >
                            <template #icon
                                ><AIcon type="ImportOutlined"
                            /></template>
                            {{t('edge.Device.index.5rg5czh0x2g0')}}
                        </PermissionButton>
                    </j-space>
                </template>
                <template #card="slotProps">
                    <CardBox
                        :value="slotProps"
                        :actions="getActions(slotProps, 'card')"
                        :status="slotProps.state?.value"
                        :statusText="slotProps.state?.text"
                        :statusNames="{
                            online: 'processing',
                            offline: 'error',
                            notActive: 'warning',
                        }"
                    >
                        <template #img>
                            <img
                                :width="80"
                                :height="80"
                                :src="
                                    slotProps?.photoUrl ||
                                    getImage('/device-gateway.png')
                                "
                            />
                        </template>
                        <template #content>
                            <Ellipsis style="width: calc(100% - 100px)">
                                <span
                                    style="font-size: 16px; font-weight: 600"
                                    @click.stop="handleView(slotProps.id)"
                                >
                                    {{ slotProps.name }}
                                </span>
                            </Ellipsis>
                            <j-row style="margin-top: 18px">
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        {{t('edge.Device.index.5rg5czh0xec0')}}
                                    </div>
                                    <div>{{ slotProps.deviceType?.text }}</div>
                                </j-col>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        {{t('edge.Device.index.5rg5czh0xmg0')}}
                                    </div>
                                    <Ellipsis style="width: 100%">
                                        {{ slotProps.productName }}
                                    </Ellipsis>
                                </j-col>
                            </j-row>
                        </template>
                        <template #actions="item">
                            <j-dropdown
                                placement="bottomRight"
                                v-if="item.key === 'others'"
                            >
                                <j-button>
                                    <AIcon :type="item.icon" />
                                    <span>{{ item.text }}</span>
                                </j-button>
                                <template #overlay>
                                    <j-menu>
                                        <j-menu-item
                                            v-for="(o, i) in item.children"
                                            :key="i"
                                        >
                                            <PermissionButton
                                                :disabled="o.disabled"
                                                :popConfirm="o.popConfirm"
                                                :tooltip="{
                                                    ...o.tooltip,
                                                }"
                                                @click="o.onClick"
                                                :hasPermission="
                                                    'edge/Device:' + o.key
                                                "
                                                type="link"
                                            >
                                                <AIcon :type="o.icon" />
                                                <span>{{ o?.text }}</span>
                                            </PermissionButton>
                                        </j-menu-item>
                                    </j-menu>
                                </template>
                            </j-dropdown>
                            <PermissionButton
                                :disabled="item.disabled"
                                v-else
                                :popConfirm="item.popConfirm"
                                :tooltip="{
                                    ...item.tooltip,
                                }"
                                @click="item.onClick"
                                :hasPermission="'edge/Device:' + item.key"
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
                        :status="slotProps.state?.value"
                        :text="slotProps.state?.text"
                        :statusNames="{
                            online: 'processing',
                            offline: 'error',
                            notActive: 'warning',
                        }"
                    />
                </template>
                <template #registryTime="slotProps">
                    <span>{{
                        dayjs(slotProps.registryTime).format(
                            'YYYY-MM-DD HH:mm:ss',
                        )
                    }}</span>
                </template>
                <template #action="slotProps">
                    <j-space>
                        <template
                            v-for="i in getActions(slotProps, 'table')"
                            :key="i.key"
                        >
                            <PermissionButton
                                :disabled="i.disabled"
                                :popConfirm="i.popConfirm"
                                :tooltip="{
                                    ...i.tooltip,
                                }"
                                @click="i.onClick"
                                type="link"
                                style="padding: 0 5px"
                                :danger="i.key === 'delete'"
                                :hasPermission="
                                    i.key === 'view'
                                        ? true
                                        : 'edge/Device:' + i.key
                                "
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
        <Save
            v-if="visible"
            :data="current"
            @close="visible = false"
            @save="saveBtn"
        />
        <Import
            @save="onRefresh"
            @close="importVisible = false"
            v-if="importVisible"
            type="official-edge-gateway"
        />
    </page-container>
</template>
  
<script lang="ts" setup>
import { queryGatewayList, queryNoPagingPost } from '@/api/device/product';
import { queryTree } from '@/api/device/category';
import { ActionsType } from '@/views/device/Instance/typings';
import { useMenuStore } from '@/store/menu';
import { getImage, onlyMessage } from '@/utils/comm';
import dayjs from 'dayjs';
import { query, _delete, _deploy, _undeploy } from '@/api/device/instance';
import { restPassword } from '@/api/edge/device';
import Save from './Save/index.vue';
import Import from '@/views/device/Instance/Import/index.vue';
import BadgeStatus from '@/components/BadgeStatus/index.vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const menuStory = useMenuStore();

const defaultParams = {
    sorts: [{ name: 'createTime', order: 'desc' }],
    terms: [
        {
            terms: [
                {
                    column: 'productId$product-info',
                    value: 'accessProvider is official-edge-gateway',
                },
            ],
            type: 'and',
        },
    ],
};

const statusMap = new Map();
statusMap.set('online', 'success');
statusMap.set('offline', 'error');
statusMap.set('notActive', 'warning');

const params = ref<Record<string, any>>({});
const edgeDeviceRef = ref<Record<string, any>>({});
const importVisible = ref<boolean>(false);
const visible = ref<boolean>(false);
const current = ref<Record<string, any>>({});

const transformData = (arr: any[]): any[] => {
    if (Array.isArray(arr) && arr.length) {
        return (arr || []).map((item: any) => {
            return {
                ...item,
                id: `classifiedId is ${item.id}`,
                children: transformData(item.children),
            };
        });
    } else {
        return [];
    }
};

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        search: {
            type: 'string',
            defaultTermType: 'eq',
        },
    },
    {
        title: t('edge.Device.index.5rg5czh0xs40'),
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: t('edge.Device.index.5rg5czh0xmg0'),
        dataIndex: 'productName',
        key: 'productName',
        search: {
            type: 'select',
            rename: 'productId',
            options: () =>
                new Promise((resolve) => {
                    queryNoPagingPost({ paging: false }).then((resp: any) => {
                        resolve(
                            resp.result.map((item: any) => ({
                                label: item.name,
                                value: item.id,
                            })),
                        );
                    });
                }),
        },
    },
    {
        title: t('edge.Device.index.5rg5czh0xxg0'),
        dataIndex: 'registryTime',
        key: 'registryTime',
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: t('edge.Device.index.5rg5czh0y1o0'),
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: t('edge.Device.index.5rg5czh0y580'), value: 'notActive' },
                { label: t('edge.Device.index.5rg5czh0ybk0'), value: 'offline' },
                { label: t('edge.Device.index.5rg5czh0yfo0'), value: 'online' },
            ],
        },
    },
    {
        key: 'productId$product-info',
        dataIndex: 'productId$product-info',
        title: t('edge.Device.index.5rg5czh0yjk0'),
        hideInTable: true,
        search: {
            type: 'treeSelect',
            options: () =>
                new Promise((resolve) => {
                    queryTree({ paging: false }).then((resp: any) => {
                        resolve(transformData(resp.result));
                    });
                }),
        },
    },
    // {
    //     key: 'productId$product-info',
    //     dataIndex: 'productId$product-info',
    //     title: '接入方式',
    //     hideInTable: true,
    //     search: {
    //         type: 'select',
    //         options: () =>
    //             new Promise((resolve) => {
    //                 queryGatewayList({}).then((resp: any) => {
    //                     resolve(
    //                         resp.result.map((item: any) => ({
    //                             label: item.name,
    //                             value: `accessId is ${item.id}`,
    //                         })),
    //                     );
    //                 });
    //             }),
    //     },
    // },
    {
        dataIndex: 'deviceType',
        title: t('edge.Device.index.5rg5czh0xec0'),
        valueType: 'select',
        hideInTable: true,
        search: {
            type: 'select',
            options: [
                { label: t('edge.Device.index.5rg5czh0ync0'), value: 'device' },
                { label: t('edge.Device.index.5rg5czh0yqs0'), value: 'childrenDevice' },
                { label: t('edge.Device.index.5rg5czh0yuk0'), value: 'gateway' },
            ],
        },
    },
    {
        title: t('edge.Device.index.5rg5czh0yy00'),
        dataIndex: 'describe',
        key: 'describe',
        search: {
            type: 'string',
        },
    },
    {
        title: t('edge.Device.index.5rg5czh0z1g0'),
        key: 'action',
        fixed: 'right',
        width: 250,
        scopedSlots: true,
    },
];

const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
    if (!data) return [];
    const actions = [
        {
            key: 'view',
            text: t('edge.Device.index.5rg5czh0z540'),
            tooltip: {
                title: t('edge.Device.index.5rg5czh0z540'),
            },
            icon: 'EyeOutlined',
            onClick: () => {
                handleView(data.id);
            },
        },
        {
            key: 'update',
            text: t('edge.Device.index.5rg5czh0z8c0'),
            tooltip: {
                title: t('edge.Device.index.5rg5czh0z8c0'),
            },
            icon: 'EditOutlined',
            onClick: () => {
                visible.value = true;
                current.value = data;
            },
        },
        {
            key: 'action',
            text: data.state?.value !== 'notActive' ? t('edge.Device.index.5rg5czh0y580') : t('edge.Device.index.5rg5czh0zbo0'),
            tooltip: {
                title: data.state?.value !== 'notActive' ? t('edge.Device.index.5rg5czh0y580') : t('edge.Device.index.5rg5czh0zbo0'),
            },
            icon:
                data.state.value !== 'notActive'
                    ? 'StopOutlined'
                    : 'CheckCircleOutlined',
            popConfirm: {
                title: `${ t('edge.Device.index.verify') + 
                    (data.state.value !== 'notActive' ? t('edge.Device.index.5rg5czh0y580') : t('edge.Device.index.5rg5czh0zbo0'))
                }?`,
                onConfirm: async () => {
                    let response = undefined;
                    if (data.state.value !== 'notActive') {
                        response = await _undeploy(data.id);
                    } else {
                        response = await _deploy(data.id);
                    }
                    if (response && response.status === 200) {
                        onlyMessage(t('edge.Device.index.5rg5czh0zh40'));
                        edgeDeviceRef.value?.reload();
                    } else {
                        onlyMessage(t('edge.Device.index.5rg5czh0zm40'), 'error');
                    }
                },
            },
        },
    ];
    const others = [
        {
            key: 'setting',
            text: t('edge.Device.index.5rg5czh0zpc0'),
            tooltip: {
                title: t('edge.Device.index.5rg5czh0zpc0'),
            },
            icon: 'ControlOutlined',
            onClick: () => {
                menuStory.jumpPage('edge/Device/Remote', {
                    id: data.id,
                });
            },
        },
        {
            key: 'password',
            text: t('edge.Device.index.5rg5czh0zv40'),
            tooltip: {
                title: t('edge.Device.index.5rg5czh0zv40'),
            },
            icon: 'RedoOutlined',
            popConfirm: {
                title: t('edge.Device.index.5rg5czh0zyg0'),
                onConfirm: async () => {
                    restPassword(data.id).then((resp: any) => {
                        if (resp.status === 200) {
                            onlyMessage(t('edge.Device.index.5rg5czh0zh40'));
                            edgeDeviceRef.value?.reload();
                        }
                    });
                },
            },
        },
    ];

    const deleteItem = {
        key: 'delete',
        text: t('edge.Device.index.5rg5czh101g0'),
        disabled: data.state?.value !== 'notActive',
        tooltip: {
            title:
                data.state.value !== 'notActive'
                    ? t('edge.Device.index.5rg5czh10480')
                    : t('edge.Device.index.5rg5czh101g0'),
        },
        popConfirm: {
            title: t('edge.Device.index.5rg5czh107g0'),
            onConfirm: async () => {
                const resp = await _delete(data.id);
                if (resp.status === 200) {
                    onlyMessage(t('edge.Device.index.5rg5czh0zh40'));
                    edgeDeviceRef.value?.reload();
                } else {
                    onlyMessage(t('edge.Device.index.5rg5czh0zm40'), 'error');
                }
            },
        },
        icon: 'DeleteOutlined',
    };

    if (type === 'card') {
        const arr = actions.filter((i: ActionsType) => i.key !== 'view');
        return [
            ...arr,
            {
                key: 'others',
                text: t('edge.Device.index.5rg5czh10a40'),
                icon: 'EllipsisOutlined',
                children: [...others],
            },
            deleteItem,
        ];
    } else {
        return [...actions, ...others, deleteItem];
    }
};

const handleSearch = (_params: any) => {
    params.value = _params;
};

const handleView = (id: string) => {
    menuStory.jumpPage('device/Instance/Detail', { id });
};

const handleAdd = () => {
    visible.value = true;
    current.value = {};
};

const saveBtn = () => {
    visible.value = false;
    edgeDeviceRef.value?.reload();
};

const onRefresh = () => {
    importVisible.value = false;
    edgeDeviceRef.value?.reload();
};
</script>
  
  <style lang="less" scoped>
</style>