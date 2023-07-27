<template>
    <page-container>
        <pro-search
            :columns="columns"
            target="media-cascade"
            @search="handleSearch"
        />
        <FullPage>
            <JProTable
                ref="listRef"
                :columns="columns"
                :request="(e:any) => lastValueFrom(e)"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
                :params="params"
                :gridColumn="2"
            >
                <template #headerTitle>
                    <PermissionButton
                        type="primary"
                        @click="handleAdd"
                        hasPermission="media/Cascade:add"
                    >
                        <template #icon
                            ><AIcon type="PlusOutlined" />{{t('media.Cascade.index.5rg8qqd9ts40')}}</template
                        >
                    </PermissionButton>
                </template>
                <template #card="slotProps">
                    <CardBox
                        :value="slotProps"
                        :actions="getActions(slotProps, 'card')"
                        v-bind="slotProps"
                        :showStatus="true"
                        :status="slotProps.status?.value"
                        :statusText="slotProps.status?.text"
                        :statusNames="{
                            enabled: 'success',
                            disabled: 'error',
                        }"
                    >
                        <template #img>
                            <slot name="img">
                                <img
                                    :src="
                                        getImage(
                                            '/cascade.png',
                                        )
                                    "
                                />
                            </slot>
                        </template>
                        <template #content>
                            <Ellipsis style="width: calc(100% - 100px);">
                            <span style="font-size: 16px;font-weight: 700">
                                {{ slotProps.name }}
                            </span>
                            </Ellipsis>
                            <p>通道数量：{{ slotProps.count || 0 }}</p>
                            <j-badge
                                :status="
                                    slotProps.status?.value === 'enabled'
                                        ? 'success'
                                        : 'error'
                                "
                                style="display: flex; align-items: center;"
                            >
                                <template #text>
                                    <j-ellipsis>
                                        {{ `sip:${slotProps.sipConfigs[0]?.sipId}@${slotProps.sipConfigs[0]?.hostAndPort}` }}
                                    </j-ellipsis>
                                </template>
                            </j-badge>
                        </template>
                        <template #actions="item">
                            <PermissionButton
                                :disabled="item.disabled"
                                :popConfirm="item.popConfirm"
                                :tooltip="{
                                    ...item.tooltip,
                                }"
                                @click="item.onClick"
                                :hasPermission="'media/Cascade:' + item.key"
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
                <template #sipId="slotProps">
                    {{ slotProps.sipConfigs[0]?.sipId }}
                </template>
                <template #publicHost="slotProps">
                    {{ slotProps.sipConfigs[0]?.publicHost }}
                </template>
                <template #count="slotProps">
                    {{ slotProps.count || 0 }}
                </template>
                <template #status="slotProps">
                    <j-badge
                        :text="slotProps.status?.text"
                        :status="
                            slotProps.status?.value === 'enabled'
                                ? 'success'
                                : 'error'
                        "
                    />
                </template>
                <template #onlineStatus="slotProps">
                    <j-badge
                        :text="slotProps.onlineStatus?.text"
                        :status="
                            slotProps.onlineStatus?.value === 'online'
                                ? 'success'
                                : 'error'
                        "
                    />
                </template>
                <template #action="slotProps">
                    <j-space :size="16">
                        <template
                            v-for="i in getActions(slotProps, 'table')"
                            :key="i.key"
                        >
                            <PermissionButton
                                :danger="i.key === 'delete'"
                                :disabled="i.disabled"
                                :popConfirm="i.popConfirm"
                                :tooltip="{
                                    ...i.tooltip,
                                }"
                                @click="i.onClick"
                                type="link"
                                style="padding: 0px"
                                :hasPermission="'media/Cascade:' + i.key"
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

        <Publish v-model:visible="publishVis" :data="currentData" />
    </page-container>
</template>

<script setup lang="ts">
import CascadeApi from '@/api/media/cascade';
import type { ActionsType } from '@/views/device/Instance/typings';
import { getImage, onlyMessage } from '@/utils/comm';
import Publish from './Publish/index.vue';

import { useMenuStore } from 'store/menu';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const menuStory = useMenuStore();

const listRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

const columns = [
    {
        title: t('media.Cascade.index.5rg8qqd9wmk0'),
        dataIndex: 'name',
        key: 'name',
        width: 200,
        fixed: 'left',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: t('media.Cascade.index.SIPID'),
        dataIndex: 'sipId',
        key: 'sipId',
        scopedSlots: true,
        ellipsis: true,
    },
    {
        title: t('media.Cascade.index.SIPAddress'),
        dataIndex: 'publicHost',
        key: 'publicHost',
        scopedSlots: true,
        ellipsis: true,
    },
    {
        title: t('media.Cascade.index.5rg8qqd9wxw0'),
        dataIndex: 'count',
        key: 'count',
        scopedSlots: true,
        width: 100,
    },
    {
        title: t('media.Cascade.index.5rg8qqd9x6w0'),
        dataIndex: 'status',
        key: 'status',
        scopedSlots: true,
        width: 100,
        search: {
            type: 'select',
            options: [
                { label: t('media.Cascade.index.5rg8qqd9xeo0'), value: 'enabled' },
                { label: t('media.Cascade.index.5rg8qqd9xng0'), value: 'disabled' },
            ],
            handleValue: (v: any) => {
                return v;
            },
        },
    },
    {
        title: t('media.Cascade.index.5rg8qqd9xyo0'),
        dataIndex: 'onlineStatus',
        key: 'onlineStatus',
        scopedSlots: true,
        width: 100,
        search: {
            type: 'select',
            options: [
                { label: t('media.Cascade.index.5rg8qqd9y540'), value: 'online' },
                { label: t('media.Cascade.index.5rg8qqd9ycs0'), value: 'offline' },
            ],
            handleValue: (v: any) => {
                return v;
            },
        },
    },
    {
        title: t('media.Cascade.index.5rg8qqd9yn80'),
        key: 'action',
        fixed: 'right',
        width: 200,
        scopedSlots: true,
    },
];

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    params.value = e;
};

/**
 * 处理表格数据
 * @param params
 */
const lastValueFrom = (params: any) => {
    return new Promise(async (resolve) => {
        const res = await CascadeApi.list(params);
        res.result.data.forEach(async (item: any) => {
            const resp = await CascadeApi.queryBindChannel(item.id, {});
            item.count = resp.result.total;
        });
        setTimeout(() => {
            resolve(res);
        }, 1000);
    });
};

/**
 * {{t('media.Cascade.index.5rg8qqd9ts40')}}
 */
const handleAdd = () => {
    menuStory.jumpPage('media/Cascade/Save');
};

const publishVis = ref(false);
const currentData = ref();
/**
 * 按钮
 * @param data
 * @param type
 */
const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
    if (!data) return [];
    const actions = [
        {
            key: 'update',
            text: t('media.Cascade.index.5rg8qqd9ytg0'),
            tooltip: {
                title: t('media.Cascade.index.5rg8qqd9ytg0'),
            },
            icon: 'EditOutlined',
            onClick: () => {
                menuStory.jumpPage(
                    'media/Cascade/Save',
                    {},
                    {
                        id: data.id,
                    },
                );
            },
        },
        {
            key: 'channel',
            text: t('media.Cascade.index.5rg8qqd9yzs0'),
            tooltip: {
                title: t('media.Cascade.index.5rg8qqd9yzs0'),
            },
            icon: 'LinkOutlined',
            onClick: () => {
                menuStory.jumpPage(
                    'media/Cascade/Channel',
                    {},
                    {
                        id: data.id,
                    },
                );
            },
        },
        {
            key: 'push',
            text: t('media.Cascade.index.5rg8qqd9z5k0'),
            tooltip: {
                title:
                    data.status?.value === 'disabled'
                        ? t('media.Cascade.index.5rg8qqd9zbg0')
                        : t('media.Cascade.index.5rg8qqd9z5k0'),
            },
            disabled: data.status?.value === 'disabled',
            icon: 'ShareAltOutlined',
            onClick: () => {
                publishVis.value = true;
                currentData.value = data;
            },
        },
        {
            key: 'action',
            text: data.status?.value === 'enabled' ? t('media.Cascade.index.5rg8qqd9xng0') : t('media.Cascade.index.5rg8qqd9zhs0'),
            tooltip: {
                title: data.status?.value === 'enabled' ? t('media.Cascade.index.5rg8qqd9xng0') : t('media.Cascade.index.5rg8qqd9zhs0'),
            },
            icon:
                data.status?.value === 'enabled'
                    ? 'StopOutlined'
                    : 'PlayCircleOutlined',
            popConfirm: {
                title: `确认${
                    data.status?.value === 'enabled' ? t('media.Cascade.index.5rg8qqd9xng0') : t('media.Cascade.index.5rg8qqd9zhs0')
                }?`,
                onConfirm: async () => {
                    let res =
                        data.status.value === 'enabled'
                            ? await CascadeApi.disabled(data.id)
                            : await CascadeApi.enabled(data.id);

                    if (res.success) {
                        onlyMessage(t('media.Cascade.index.5rg8qqd9zns0'));
                        listRef.value?.reload();
                    } else {
                        onlyMessage(t('media.Cascade.index.5rg8qqd9zug0'), 'error');
                    }
                },
            },
        },
        {
            key: 'delete',
            text: t('media.Cascade.index.5rg8qqda00c0'),
            tooltip: {
                title:
                    data.status?.value === 'enabled'
                        ? t('media.Cascade.index.deleteTip')
                        : t('media.Cascade.index.5rg8qqda00c0'),
            },
            disabled: data.status?.value === 'enabled',
            popConfirm: {
                title: t('media.Cascade.index.5rg8qqda05s0'),
                onConfirm: async () => {
                    const resp = await CascadeApi.del(data.id);
                    if (resp.status === 200) {
                        onlyMessage(t('media.Cascade.index.5rg8qqd9zns0'));
                        listRef.value?.reload();
                    } else {
                        onlyMessage(t('media.Cascade.index.5rg8qqd9zug0'), 'error');
                    }
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
    return actions;
};
</script>
