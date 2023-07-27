<template>
    <page-container>
        <pro-search :columns="columns" target="edge-resource" @search="handleSearch" />
        <FullPage>
            <JProTable ref="edgeResourceRef" :columns="columns" :request="query" :defaultParams="defaultParams"
                :params="params">
                <template #card="slotProps">
                    <CardBox :value="slotProps" @click="handleView(slotProps)" :actions="getActions(slotProps, 'card')"
                        :status="slotProps.state?.value" :statusText="slotProps.state?.text" :statusNames="{
                            enabled: 'processing',
                            disabled: 'error',
                        }">
                        <template #img>
                            <img :src="getImage('/device/instance/device-card.png')
                                " />
                        </template>
                        <template #content>
                            <Ellipsis style="width: calc(100% - 100px)">
                                <span style="font-size: 16px; font-weight: 600">
                                    {{ slotProps.name }}
                                </span>
                            </Ellipsis>
                            <j-row style="margin-top: 18px">
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        {{ t('edge.Resource.index.5rg5fwsihz80') }}
                                    </div>
                                    <Ellipsis>{{
                                        slotProps.category
                                    }}</Ellipsis>
                                </j-col>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        {{ t('edge.Resource.index.5rg5fwsij3k0') }}
                                    </div>
                                    <Ellipsis style="width: 100%">
                                        {{ slotProps.sourceName }}
                                    </Ellipsis>
                                </j-col>
                            </j-row>
                        </template>
                        <template #actions="item">
                            <PermissionButton :disabled="item.disabled" :popConfirm="item.popConfirm" :tooltip="{
                                ...item.tooltip,
                            }" @click="item.onClick" :hasPermission="'edge/Resource:' + item.key">
                                <AIcon type="DeleteOutlined" v-if="item.key === 'delete'" />
                                <template v-else>
                                    <AIcon :type="item.icon" />
                                    <span>{{ item?.text }}</span>
                                </template>
                            </PermissionButton>
                        </template>
                    </CardBox>
                </template>
                <template #state="slotProps">
                    <BadgeStatus :status="slotProps.state?.value" :text="slotProps.state?.text" :statusNames="{
                        enabled: 'processing',
                        disabled: 'error',
                    }" />
                </template>
                <template #sourceId="slotProps">
                    {{ slotProps.sourceName }}
                </template>
                <template #category="slotProps">
                    {{
                      slotProps.category
                    }}
                </template>
                <template #createTime="slotProps">
                    <span>{{
                        dayjs(slotProps.createTime).format(
                            'YYYY-MM-DD HH:mm:ss',
                        )
                    }}</span>
                </template>
                <template #action="slotProps">
                    <j-space>
                        <template v-for="i in getActions(slotProps, 'table')" :key="i.key">
                            <PermissionButton :disabled="i.disabled" :popConfirm="i.popConfirm" :tooltip="{
                                ...i.tooltip,
                            }" @click="i.onClick" type="link" style="padding: 0 5px" :danger="i.key === 'delete'"
                                :hasPermission="i.key === 'view'
                                        ? true
                                        : 'edge/Resource:' + i.key
                                    ">
                                <template #icon>
                                    <AIcon :type="i.icon" />
                                </template>
                            </PermissionButton>
                        </template>
                    </j-space>
                </template>
            </JProTable>
        </FullPage>

        <Save v-if="visible" :data="current" @close="visible = false" @save="saveBtn" />
        <Issue v-if="settingVisible" :data="current" @close="settingVisible = false" />
    </page-container>
</template>

<script lang="ts" setup>
import { queryNoPagingPost } from '@/api/device/instance';
import { ActionsType } from '@/views/device/Instance/typings';
import { useMenuStore } from '@/store/menu';
import { getImage, onlyMessage } from '@/utils/comm';
import dayjs from 'dayjs';
import { query, _delete, _start, _stop } from '@/api/edge/resource';
import Save from './Save/index.vue';
import Issue from './Issue/index.vue';
import BadgeStatus from '@/components/BadgeStatus/index.vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const menuStory = useMenuStore();

const defaultParams = { sorts: [{ name: 'createTime', order: 'desc' }] };

const statusMap = new Map();
statusMap.set('enabled', 'processing');
statusMap.set('disabled', 'error');

const params = ref<Record<string, any>>({});
const edgeResourceRef = ref<Record<string, any>>({});
const settingVisible = ref<boolean>(false);
const visible = ref<boolean>(false);
const current = ref<Record<string, any>>({});

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: t('edge.Resource.index.5rg5fwsij9o0'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        dataIndex: 'category',
        title: t('edge.Resource.index.5rg5fwsijg00'),
        valueType: 'select',
        scopedSlots: true,
        key: 'category',
        search: {
            type: 'select',
            options: () =>
                new Promise((resolve) => {
                    query({
                        paging: false,
                        sorts: [{ name: 'createTime', order: 'desc' }],
                    }).then((resp: any) => {
                      const arrMap = new Map()
                      resp.result.data.forEach((item: any) => {
                        arrMap.set(item.category, {
                          label: item.category,
                          value: item.category,
                        })
                      })
                      resolve([...arrMap.values()]);
                    });
                }),
        },
    },
    {
        title: t('edge.Resource.index.5rg5fwsij3k0'),
        dataIndex: 'sourceId',
        key: 'sourceId',
        scopedSlots: true,
        search: {
            type: 'select',
            options: () =>
                new Promise((resolve) => {
                  query({
                        paging: false,
                        sorts: [
                            {
                                name: 'createTime',
                                order: 'desc',
                            },
                        ],
                    }).then((resp: any) => {
                        const arrMap = new Map()
                        resp.result.data.forEach((item: any) => {
                          arrMap.set(item.sourceId, {
                            label: item.sourceName,
                            value: item.sourceId,
                          })
                        })
                        resolve([...arrMap.values()]);
                    });
                }),
        },
    },
    {
        title: t('edge.Resource.index.5rg5fwsijl80'),
        dataIndex: 'createTime',
        key: 'createTime',
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: t('edge.Resource.index.5rg5fwsijps0'),
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: t('edge.Resource.index.5rg5fwsijts0'), value: 'disabled' },
                { label: t('edge.Resource.index.5rg5fwsijy00'), value: 'enabled' },
            ],
        },
    },
    {
        title: t('edge.Resource.index.5rg5fwsik400'),
        key: 'action',
        fixed: 'right',
        width: 200,
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
            text: t('edge.Resource.index.5rg5fwsik7k0'),
            tooltip: {
                title: t('edge.Resource.index.5rg5fwsik7k0'),
            },
            icon: 'EyeOutlined',
            onClick: () => {
                handleView(data);
            },
        },
        {
            key: 'update',
            text: t('edge.Resource.index.5rg5fwsikb40'),
            tooltip: {
                title: t('edge.Resource.index.5rg5fwsikb40'),
            },
            icon: 'EditOutlined',
            onClick: () => {
                visible.value = true;
                current.value = data;
            },
        },
        {
            key: 'setting',
            text: t('edge.Resource.index.5rg5fwsikfg0'),
            disabled: data.state?.value === 'disabled',
            tooltip: {
                title:
                    data.state.value === 'disabled'
                        ? t('edge.Resource.index.5rg5fwsikiw0')
                        : t('edge.Resource.index.5rg5fwsikfg0'),
            },
            icon: 'DownSquareOutlined',
            onClick: () => {
                settingVisible.value = true;
                current.value = data;
            },
        },
        {
            key: 'action',
            text: data.state?.value !== 'disabled' ? t('edge.Resource.index.5rg5fwsijts0') : t('edge.Resource.index.5rg5fwsikmg0'),
            tooltip: {
                title: data.state?.value !== 'disabled' ? t('edge.Resource.index.5rg5fwsijts0') : t('edge.Resource.index.5rg5fwsikmg0'),
            },
            icon:
                data.state.value !== 'disabled'
                    ? 'StopOutlined'
                    : 'CheckCircleOutlined',
            popConfirm: {
                title: `${t('edge.Resource.index.verify') +
                    (data.state.value !== 'disabled' ? t('edge.Resource.index.5rg5fwsijts0') : t('edge.Resource.index.5rg5fwsikmg0'))
                    }?`,
                onConfirm: async () => {
                    let response = undefined;
                    if (data.state.value !== 'disabled') {
                        response = await _stop([data.id]);
                    } else {
                        response = await _start([data.id]);
                    }
                    if (response && response.status === 200) {
                        onlyMessage(t('edge.Resource.index.5rg5fwsikq00'));
                        edgeResourceRef.value?.reload();
                    } else {
                        onlyMessage(t('edge.Resource.index.5rg5fwsikxo0'), 'error');
                    }
                },
            },
        },
        {
            key: 'delete',
            text: t('edge.Resource.index.5rg5fwsil1o0'),
            disabled: data.state?.value !== 'disabled',
            tooltip: {
                title:
                    data.state.value !== 'disabled'
                        ? t('edge.Resource.index.5rg5fwsil540')
                        : t('edge.Resource.index.5rg5fwsil1o0'),
            },
            popConfirm: {
                title: t('edge.Resource.index.5rg5fwsil9k0'),
                onConfirm: async () => {
                    const resp = await _delete(data.id);
                    if (resp.status === 200) {
                        onlyMessage(t('edge.Resource.index.5rg5fwsikq00'));
                        edgeResourceRef.value?.reload();
                    } else {
                        onlyMessage(t('edge.Resource.index.5rg5fwsikxo0'), 'error');
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

const handleSearch = (_params: any) => {
    params.value = _params;
};

const handleView = (dt: any) => {
    menuStory.jumpPage('device/Instance/Detail', { id: dt?.sourceId });
};

const saveBtn = () => {
    visible.value = false;
    edgeResourceRef.value?.reload();
};

const onRefresh = () => {
    settingVisible.value = false;
    edgeResourceRef.value?.reload();
};
</script>

<style lang="less" scoped></style>
