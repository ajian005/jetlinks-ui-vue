<template>
    <page-container>
        <div>
            <pro-search
                :columns="columns"
                target="search-datacollect-channel"
                @search="handleSearch"
            />
            <FullPage>
                <j-pro-table
                    ref="tableRef"
                    :columns="columns"
                    model="CARD"
                    :gridColumn="3"
                    :request="query"
                    :defaultParams="{
                        sorts: [{ name: 'createTime', order: 'desc' }],
                    }"
                    :params="params"
                >
                    <template #headerTitle>
                        <PermissionButton
                            type="primary"
                            @click="handlAdd"
                            hasPermission="DataCollect/Channel:add"
                        >
                            <template #icon
                                ><AIcon type="PlusOutlined"
                            /></template>
                            {{t('DataCollect.Channel.index.5rg5p0xfs8o0')}}
                        </PermissionButton>
                    </template>
                    <template #card="slotProps">
                        <CardBox
                            :showStatus="true"
                            :value="slotProps"
                            :actions="getActions(slotProps, 'card')"
                            v-bind="slotProps"
                            :status="getState(slotProps).value"
                            :statusText="getState(slotProps).text"
                            :statusNames="StatusColorEnum"
                            @click="handlEye(slotProps.id)"
                        >
                            <template #img>
                                <slot name="img">
                                    <img :src="getImage('/channel.png')" />
                                </slot>
                            </template>
                            <template #content>
                                <div class="card-item-content">
                                    <Ellipsis style="width: calc(100% - 100px)">
                                        <span
                                            style="
                                                font-size: 18px;
                                                font-weight: 800;
                                                line-height: 22px;
                                            "
                                        >
                                            {{ slotProps.name }}
                                        </span>
                                    </Ellipsis>
                                    <j-row class="card-item-content-box">
                                        <j-col :span="12">
                                            <div class="card-item-content-text">
                                                {{t('DataCollect.Channel.index.5rg5p0xfut00')}}
                                            </div>
                                            <div class="card-item-content-text">
                                                <j-tooltip>
                                                    <template #title>{{
                                                        slotProps.provider
                                                    }}</template>
                                                    {{ slotProps.provider }}
                                                </j-tooltip>
                                            </div>
                                        </j-col>
                                        <!-- <j-col :span="12">
                                            <div class="card-item-content-text">
                                                {{t('DataCollect.Channel.index.5rg5p0xfv500')}}
                                            </div>
                                            <div class="card-item-content-text">
                                                <j-tooltip>
                                                    <template #title>{{
                                                        slotProps.configuration
                                                            .host ||
                                                        slotProps.configuration
                                                            .endpoint
                                                    }}</template>
                                                    <span
                                                        class="details-text"
                                                        >{{
                                                            slotProps
                                                                .configuration
                                                                .host ||
                                                            slotProps
                                                                .configuration
                                                                .endpoint
                                                        }}</span
                                                    >
                                                </j-tooltip>
                                            </div>
                                        </j-col> -->
                                        <j-col :span="12">
                                            <div class="card-item-content-text">
                                                说明
                                            </div>
                                            <div class="card-item-content-text">
                                                <j-ellipsis>{{slotProps.description}}</j-ellipsis>
                                            </div>
                                        </j-col>
                                    </j-row>
                                </div>
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
                                        'DataCollect/Channel:' + item.key
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
                </j-pro-table>
            </FullPage>
            <Save v-if="visible" :data="current" @change="saveChange" />
        </div>
    </page-container>
</template>
<script lang="ts" setup name="DataCollectPage">
import type { ActionsType } from '@/components/Table/index';
import { getImage } from '@/utils/comm';
import { query, remove, update } from '@/api/data-collect/channel';
import { onlyMessage } from '@/utils/comm';
import { StatusColorEnum, updateStatus } from './data';
import { useMenuStore } from 'store/menu';
import Save from './Save/index.vue';
import _ from 'lodash';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const menuStory = useMenuStore();
const tableRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});
const visible = ref(false);
const current = ref({});

const columns = [
    {
        title: t('DataCollect.Channel.index.5rg5p0xfveo0'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'string',
        },
    },
    {
        title: t('DataCollect.Channel.index.5rg5p0xfvkg0'),
        dataIndex: 'provider',
        key: 'provider',
        ellipsis: true,
        search: {
            type: 'select',
            options: [
                { label: 'OPC_UA', value: 'OPC_UA' },
                { label: 'MODBUS_TCP', value: 'MODBUS_TCP' },
            ],
        },
    },
    {
        title: t('DataCollect.Channel.index.5rg5p0xfvsg0'),
        dataIndex: 'state',
        key: 'state',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: t('DataCollect.Channel.index.5rg5p0xfvxs0'), value: 'enabled' },
                { label: t('DataCollect.Channel.index.5rg5p0xfw3s0'), value: 'disabled' },
            ],
        },
    },
    {
        title: t('DataCollect.Channel.index.5rg5p0xfwak0'),
        dataIndex: 'runningState',
        key: 'runningState',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: t('DataCollect.Channel.index.5rg5p0xfwg00'), value: 'running' },
                { label: t('DataCollect.Channel.index.5rg5p0xfwm00'), value: 'partialError' },
                { label: t('DataCollect.Channel.index.5rg5p0xfws80'), value: 'failed' },
            ],
        },
    },
    {
        title: t('DataCollect.Channel.index.5rg5p0xfwxw0'),
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: t('DataCollect.Channel.index.5rg5p0xfx680'),
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
    const state = data.state.value;
    const stateText = state === 'enabled' ? t('DataCollect.Channel.index.5rg5p0xfw3s0') : t('DataCollect.Channel.index.5rg5p0xfxd80');
    const actions = [
        {
            key: 'update',
            text: t('DataCollect.Channel.index.5rg5p0xfxis0'),
            tooltip: {
                title: t('DataCollect.Channel.index.5rg5p0xfxis0'),
            },
            icon: 'EditOutlined',
            onClick: () => {
                handlEdit(data);
            },
        },
        {
            key: 'action',
            text: stateText,
            tooltip: {
                title: stateText,
            },
            icon: state === 'enabled' ? 'StopOutlined' : 'CheckCircleOutlined',
            popConfirm: {
                title: `${t('DataCollect.Channel.index.verify') + stateText}?`,
                onConfirm: async () => {
                    const res = await update(data.id, updateStatus[state]);
                    if (res.success) {
                        onlyMessage(t('DataCollect.Channel.index.5rg5p0xfxo40'), 'success');
                        tableRef.value?.reload();
                    }
                },
            },
        },
        {
            key: 'delete',
            text: t('DataCollect.Channel.index.5rg5p0xfxto0'),
            disabled: state === 'enabled',
            tooltip: {
                title:
                    state === 'enabled' ? t('DataCollect.Channel.index.5rg5p0xfy0c0') : t('DataCollect.Channel.index.5rg5p0xfxto0'),
            },
            popConfirm: {
                placement: 'topRight',
                title: t('DataCollect.Channel.index.5rg5p0xfy6w0'),
                onConfirm: async () => {
                    const res = await remove(data.id);
                    if (res.success) {
                        onlyMessage(t('DataCollect.Channel.index.5rg5p0xfxo40'), 'success');
                        tableRef.value.reload();
                    }
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
    return actions;
};

const handlAdd = () => {
    current.value = {};
    visible.value = true;
};

const handlEdit = (data: object) => {
    current.value = _.cloneDeep(data);
    visible.value = true;
};
const handlEye = (id: string) => {
    menuStory.jumpPage(`DataCollect/Collector`, {}, { channelId: id });
};
const saveChange = (value: object) => {
    visible.value = false;
    current.value = {};
    if (value) {
        onlyMessage(t('DataCollect.Channel.index.5rg5p0xfxo40'), 'success');
        tableRef.value.reload();
    }
};
const getState = (record: Partial<Record<string, any>>) => {
    if (record) {
        if (record?.state?.value === 'enabled') {
            return { ...record?.runningState };
        } else {
            return {
                text: t('DataCollect.Channel.index.5rg5p0xfw3s0'),
                value: 'disabled',
            };
        }
    } else {
        return {};
    }
};

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    params.value = e;
};
</script>
<style lang="less" scoped>
.card-item-content {
    min-height: 100px;
    .card-item-content-box {
        min-height: 50px;
    }
    .card-item-content-text {
        margin-top: 10px;
        color: rgba(0, 0, 0, 0.75);
        font-size: 12px;
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap; //溢出不换行
    }
}
.details-text {
    font-weight: 700;
    font-size: 14px;
}
</style>
