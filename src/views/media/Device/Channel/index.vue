<!-- 视频设备-通道列表 -->
<template>
    <page-container>
        <div class="device-channel-warp">
            <div class="left-warp" v-if="route.query.type === 'gb28181-2016'">
                <div class="left-content" :class="{ active: show }">
                    <Tree
                        :deviceId="deviceId"
                        :on-select="handleSelect"
                    />
                </div>
                <div
                    class="left-warp--btn"
                    :class="{ active: !show }"
                    @click="show = !show"
                >
                    <AIcon type="LeftOutlined" />
                </div>
            </div>
            <div class="right">
                <pro-search
                    :columns="columns"
                    target="channel"
                    @search="handleSearch"
                />
                <FullPage>
                    <JProTable
                        ref="listRef"
                        model="table"
                        :columns="columns"
                        :request="(e:any) => ChannelApi.list(e, route?.query.id as string)"
                        :defaultParams="{
                            sorts: [{ name: 'modifyTime', order: 'desc' }],
                        }"
                        :params="params"
                    >
                        <template #headerTitle>
                            <j-tooltip
                                v-if="route?.query.type === 'gb28181-2016'"
                                :title="t('Device.Channel.index.5rg8asbn6mc0')"
                            >
                                <j-button type="primary" disabled>
                                    {{t('Device.Channel.index.5rg8asbn7sw0')}}
                                </j-button>
                            </j-tooltip>
                            <PermissionButton
                                v-else
                                type="primary"
                                @click="handleAdd"
                                hasPermission="media/Device:add"
                            >
                                <template #icon
                                    ><AIcon type="PlusOutlined" />{{t('Device.Channel.index.5rg8asbn7sw0')}}</template
                                >
                            </PermissionButton>
                        </template>
                        <template #status="slotProps">
                            <j-space>
                                <j-badge
                                    :status="
                                        slotProps.status.value === 'online'
                                            ? 'success'
                                            : 'error'
                                    "
                                    :text="slotProps.status.text"
                                ></j-badge>
                            </j-space>
                        </template>
                        <template #action="slotProps">
                            <j-space>
                                <template
                                    v-for="i in getActions(slotProps, 'table')"
                                    :key="i.key"
                                >
                                    <PermissionButton
                                        v-if="
                                            i.key !== 'play' &&
                                            i.key !== 'backPlay'
                                        "
                                        :danger="i.key === 'delete'"
                                        :disabled="i.disabled"
                                        :popConfirm="i.popConfirm"
                                        :tooltip="{
                                            ...i.tooltip,
                                        }"
                                        @click="i.onClick"
                                        type="link"
                                        style="padding: 0px"
                                        :hasPermission="'media/Device:' + i.key"
                                    >
                                        <template #icon
                                            ><AIcon :type="i.icon"
                                        /></template>
                                    </PermissionButton>
                                    <!-- 回放/播放不要权限控制 -->
                                    <template v-else>
                                        <j-tooltip
                                            :key="i.key"
                                            v-bind="i.tooltip"
                                        >
                                            <j-button
                                                style="padding: 0px"
                                                type="link"
                                                @click="
                                                    i.onClick &&
                                                        i.onClick(slotProps)
                                                "
                                            >
                                                <j-button
                                                    :disabled="i.disabled"
                                                    style="padding: 0"
                                                    type="link"
                                                >
                                                    <AIcon :type="i.icon" />
                                                </j-button>
                                            </j-button>
                                        </j-tooltip>
                                    </template>
                                </template>
                            </j-space>
                        </template>
                    </JProTable>
                </FullPage>
            </div>
        </div>

        <Save
            v-model:visible="saveVis"
            :channelData="channelData"
            @submit="listRef.reload()"
        />
        <Live v-model:visible="playerVis" :data="playData" />
    </page-container>
</template>

<script setup lang="ts">
import ChannelApi from '@/api/media/channel';
import type { ActionsType } from '@/views/device/Instance/typings';
import { useMenuStore } from 'store/menu';
import Save from './Save.vue';
import Live from './Live/index.vue';
import Tree from './Tree/index.vue';
import { cloneDeep } from 'lodash-es';
import { useElementSize } from '@vueuse/core';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const menuStory = useMenuStore();
const route = useRoute();

const columns = [
    {
        title: t('Device.Channel.index.5rg8asbn7yo0'),
        dataIndex: 'channelId',
        key: 'channelId',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: t('Device.Channel.index.5rg8asbn82s0'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: t('Device.Channel.index.5rg8asbn86k0'),
        dataIndex: 'manufacturer',
        key: 'manufacturer',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: t('Device.Channel.index.5rg8asbn8ak0'),
        dataIndex: 'address',
        ellipsis: true,
        key: 'address',
        search: {
            type: 'string',
        },
    },
    {
        title: t('Device.Channel.index.5rg8asbn8e40'),
        dataIndex: 'status',
        key: 'status',
        scopedSlots: true,
        width: 150,
        search: {
            type: 'select',
            options: [
                { label: t('Device.Channel.index.5rg8asbn8ig0'), value: 'online' },
                { label: t('Device.Channel.index.5rg8asbn8nk0'), value: 'offline' },
            ],
            handleValue: (v: any) => {
                return v;
            },
        },
    },
    {
        title: t('Device.Channel.index.5rg8asbn8sg0'),
        key: 'action',
        width: 200,
        scopedSlots: true,
    },
];

const params = ref<Record<string, any>>({});

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    params.value = e;
};

const saveVis = ref(false);
const handleAdd = () => {
    channelData.value = undefined
    saveVis.value = true;
};

const listRef = ref();
const playerVis = ref(false);
const channelData = ref();
const playData = ref();

/**
 * 表格操作按钮
 * @param data 表格数据项
 * @param type 表格展示类型
 */
const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
    if (!data) return [];
    const actions = [
        {
            key: 'update',
            text: t('Device.Channel.index.5rg8asbn8zg0'),
            tooltip: {
                title: t('Device.Channel.index.5rg8asbn8zg0'),
            },
            icon: 'EditOutlined',
            onClick: () => {
                channelData.value = cloneDeep(data);
                saveVis.value = true;
            },
        },
        {
            key: 'play',
            text: t('Device.Channel.index.5rg8asbn94w0'),
            tooltip: {
                title: t('Device.Channel.index.5rg8asbn94w0'),
            },
            icon: 'VideoCameraOutlined',
            onClick: () => {
                playData.value = cloneDeep(data);
                playerVis.value = true;
            },
        },
        {
            key: 'backPlay',
            text: t('Device.Channel.index.5rg8asbn9980'),
            tooltip: {
                title: t('Device.Channel.index.5rg8asbn9980'),
            },
            icon: 'HistoryOutlined',
            onClick: () => {
                menuStory.jumpPage(
                    'media/Device/Playback',
                    {},
                    {
                        id: route.query.id,
                        type: route.query.type,
                        channelId: data.channelId,
                    },
                );
            },
        },
        {
            key: 'delete',
            text: t('Device.Channel.index.5rg8asbn9ec0'),
            tooltip: {
                title: t('Device.Channel.index.5rg8asbn9ec0'),
            },
            popConfirm: {
                title: t('Device.Channel.index.5rg8asbn9hw0'),
                onConfirm: async () => {
                    const resp = await ChannelApi.del(data.id);
                    if (resp.status === 200) {
                        onlyMessage(t('Device.Channel.index.5rg8asbn9lk0'));
                        listRef.value?.reload();
                    } else {
                        onlyMessage(t('Device.Channel.index.5rg8asbn9r00'), 'error');
                    }
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
    return route?.query.type === 'gb28181-2016'
        ? actions.filter((f) => f.key !== 'delete')
        : actions;
};

// 左侧树
const show = ref(false);
const deviceId = computed(() => route.query.id as string);
const handleSelect = (key: string) => {
    if (key === deviceId.value && listRef.value?.reload) {
        listRef.value?.reload();
    } else {
        params.value = {
            terms: [
                {
                    column: 'parentId',
                    value: key,
                },
            ],
        };
    }
};
</script>
<style lang="less" scoped>
@import './index.less';
</style>
