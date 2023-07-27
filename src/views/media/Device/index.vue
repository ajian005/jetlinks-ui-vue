<template>
    <page-container>
        <pro-search
            :columns="columns"
            target="notice-config"
            @search="handleSearch"
        />
        <FullPage>
            <JProTable
                ref="listRef"
                :columns="columns"
                :request="DeviceApi.list"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
                :params="params"
                :gridColumn="4"
            >
                <template #headerTitle>
                    <PermissionButton
                        type="primary"
                        @click="handleAdd"
                        hasPermission="media/Device:add"
                    >
                        <template #icon
                            ><AIcon type="PlusOutlined" />{{t('media.Device.index.5rg8fywrmpg0')}}</template
                        >
                    </PermissionButton>
                </template>
                <template #card="slotProps">
                    <CardBox
                        :value="slotProps"
                        :actions="getActions(slotProps, 'card')"
                        v-bind="slotProps"
                        :showStatus="true"
                        :status="slotProps.state.value"
                        :statusText="slotProps.state.text"
                        :statusNames="{
                            online: 'processing',
                            offline: 'error',
                        }"
                    >
                        <template #img>
                            <slot name="img">
                                <img :src="getImage('/device-media.png')" />
                            </slot>
                        </template>
                        <template #content>
                            <Ellipsis style="width: calc(100% - 100px);">
                            <span style="font-size: 16px;font-weight: 700">
                                {{ slotProps.name }}
                            </span>
                            </Ellipsis>
                            <j-row>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        {{t('media.Device.index.5rg8fywrom00')}}
                                    </div>
                                    <Ellipsis style="width: calc(100% - 20px);">
                                        <div>{{ slotProps.manufacturer }}</div>
                                    </Ellipsis>
                                </j-col>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        {{t('media.Device.index.5rg8fywrouo0')}}
                                    </div>
                                    <div>{{ slotProps.channelNumber }}</div>
                                </j-col>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        {{t('media.Device.index.5rg8fywrp1w0')}}
                                    </div>
                                    <Ellipsis style="width: calc(100% - 20px);">{{ slotProps.model }}</Ellipsis>
                                </j-col>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        {{t('media.Device.index.5rg8fywrpiw0')}}
                                    </div>
                                    <div>
                                        {{ providerType[slotProps.provider] }}
                                    </div>
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
                                    'media/Device:' +
                                    (item.key !== 'updateChannel'
                                        ? item.key
                                        : 'update')
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

                <template #channelNumber="slotProps">
                    {{ slotProps.channelNumber || 0 }}
                </template>
                <template #provider="slotProps">
                    {{ providerType[slotProps.provider] }}
                </template>
                <template #productId="slotProps">
                    {{ getProductName(slotProps.productId) }}
                </template>
                <template #state="slotProps">
                    <j-badge
                        :text="slotProps.state?.text"
                        :status="
                            slotProps.state?.value === 'online'
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
                                :hasPermission="
                                    'media/Device:' +
                                    (i.key !== 'updateChannel' &&
                                    i.key !== 'viewDevice'
                                        ? i.key
                                        : 'update')
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
    </page-container>
</template>

<script setup lang="ts">
import DeviceApi from '@/api/media/device';
import type { ActionsType } from '@/views/device/Instance/typings';
import { getImage, onlyMessage } from '@/utils/comm';
import { PROVIDER_OPTIONS } from '@/views/media/Device/const';
import { providerType } from './const';
import encodeQuery from '@/utils/encodeQuery';

import { useMenuStore } from 'store/menu';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const menuStory = useMenuStore();

const listRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 200,
        fixed: 'left',
        search: {
            type: 'string',
        },
        ellipsis: true,
    },
    {
        title: t('media.Device.index.5rg8fywrpqs0'),
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
            first: true,
        },
        ellipsis: true,
    },
    {
        title: t('media.Device.index.5rg8fywrpiw0'),
        dataIndex: 'provider',
        key: 'provider',
        scopedSlots: true,
        width:120,
        search: {
            type: 'select',
            options: PROVIDER_OPTIONS,
            handleValue: (v: any) => {
                return v;
            },
        },
    },
    {
        title: t('media.Device.index.5rg8fywrouo0'),
        dataIndex: 'channelNumber',
        key: 'channelNumber',
        scopedSlots: true,
        width: 100,
    },
    {
        title: t('media.Device.index.5rg8fywrom00'),
        dataIndex: 'manufacturer',
        key: 'manufacturer',
        search: {
            type: 'string',
        },
        ellipsis: true,
    },
    {
        title: t('media.Device.index.5rg8fywrpxg0'),
        dataIndex: 'productId',
        key: 'productId',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'select',
            options: () =>
                new Promise((resolve) => {
                    DeviceApi.getProductList(
                        encodeQuery({
                            terms: {
                                messageProtocol$in: [
                                    'gb28181-2016',
                                    'fixed-media',
                                ],
                            },
                        }),
                    ).then((resp: any) => {
                        resolve(
                            resp.result.map((pItem: any) => ({
                                label: pItem.name,
                                value: pItem.id,
                            })),
                        );
                    });
                }),
            handleValue: (v: any) => {
                return v;
            },
        },
    },
    {
        title: t('media.Device.index.5rg8fywrq3c0'),
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        width: 100,
        search: {
            type: 'select',
            options: [
                { label: t('media.Device.index.5rg8fywrq9g0'), value: 'notActive' },
                { label: t('media.Device.index.5rg8fywrqeg0'), value: 'offline' },
                { label: t('media.Device.index.5rg8fywrqjw0'), value: 'online' },
            ],
            handleValue: (v: any) => {
                return v;
            },
        },
    },
    {
        title: t('media.Device.index.5rg8fywrqqc0'),
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
    // console.log('handleSearch:', e);
    params.value = e;
};

/**
 * {{t('media.Device.index.5rg8fywrmpg0')}}
 */
const handleAdd = () => {
    menuStory.jumpPage('media/Device/Save', {
        id: ':id',
    });
};

const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
    if (!data) return [];
    const actions = [
        {
            key: 'update',
            text: t('media.Device.index.5rg8fywrqv80'),
            tooltip: {
                title: t('media.Device.index.5rg8fywrqv80'),
            },
            icon: 'EditOutlined',
            onClick: () => {
                menuStory.jumpPage(
                    'media/Device/Save',
                    {},
                    {
                        id: data.id,
                    },
                );
            },
        },
        {
            key: 'view',
            text: t('media.Device.index.5rg8fywrr280'),
            tooltip: {
                title: t('media.Device.index.5rg8fywrr280'),
            },
            icon: 'PartitionOutlined',
            onClick: () => {
                menuStory.jumpPage(
                    'media/Device/Channel',
                    {},
                    {
                        id: data.id,
                        type: data.provider,
                    },
                );
            },
        },
        {
            key: 'viewDevice',
            text: t('media.Device.index.5rg8fywrr740'),
            tooltip: {
                title: t('media.Device.index.5rg8fywrr740'),
            },
            icon: 'EyeOutlined',
            onClick: () => {
                menuStory.jumpPage('device/Instance/Detail', { id: data.id });
            },
        },
        {
            key: 'updateChannel',
            text: t('media.Device.index.5rg8fywrrdc0'),
            tooltip: {
                title:
                    data.provider === 'fixed-media'
                        ? t('media.Device.index.5rg8fywrrkg0')
                        : data.state.value === 'offline'
                        ? t('media.Device.index.5rg8fywrrq80')
                        : data.state.value === 'notActive'
                        ? t('media.Device.index.5rg8fywrrw80')
                        : t('media.Device.index.5rg8fywrrdc0'),
            },
            disabled:
                data.state.value === 'offline' ||
                data.state.value === 'notActive' ||
                data.provider === 'fixed-media',
            icon: 'SyncOutlined',
            onClick: async () => {
                const res = await DeviceApi.updateChannels(data.id);
                if (res.success) {
                    onlyMessage(t('media.Device.index.5rg8fywrs2k0'));
                    listRef.value?.reload();
                }
            },
        },
        {
            key: 'delete',
            text: t('media.Device.index.5rg8fywrsc00'),
            tooltip: {
                title:
                    data.state.value === 'online' ? t('media.Device.index.5rg8fywrsgo0') : t('media.Device.index.5rg8fywrsc00'),
            },
            disabled: data.state.value === 'online',
            popConfirm: {
                title: t('media.Device.index.5rg8fywrsmo0'),
                onConfirm: async () => {
                    const resp = await DeviceApi.del(data.id);
                    if (resp.status === 200) {
                        onlyMessage(t('media.Device.index.5rg8fywrsww0'));
                        listRef.value?.reload();
                    } else {
                        onlyMessage(t('media.Device.index.5rg8fywrt1o0'), 'error');
                    }
                },
            },
            icon: 'DeleteOutlined',
        },
    ];

    let acts: any = [];
    if (type === 'card') {
        // 卡片不展示查看按钮
        const tempActs = actions.filter((f: any) => f.key !== 'viewDevice');
        acts =
            data.provider === 'fixed-media'
                ? tempActs.filter((f: any) => f.key !== 'updateChannel')
                : tempActs;
    } else {
        acts =
            data.provider === 'fixed-media'
                ? actions.filter((f: any) => f.key !== 'updateChannel')
                : actions;
    }
    return acts;
};

const productList = ref<any[]>([]);
const getProductList = () => {
    DeviceApi.getProductList(
        encodeQuery({
            terms: {
                messageProtocol$in: ['gb28181-2016', 'fixed-media'],
            },
        }),
    ).then((resp: any) => {
        productList.value = resp.result.map((pItem: any) => ({
            label: pItem.name,
            value: pItem.id,
        }));
    });
};
getProductList();

const getProductName = (pid: string) => {
    return productList.value.find((f: any) => f.value === pid)?.label;
};
</script>
