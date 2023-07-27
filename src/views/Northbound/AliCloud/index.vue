<template>
    <page-container>
        <pro-search
            :columns="columns"
            target="northbound-aliyun"
            @search="handleSearch"
        />
        <FullPage>
            <JProTable
                ref="instanceRef"
                :columns="columns"
                :request="query"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
                :params="params"
            >
                <template #headerTitle>
                    <j-space>
                        <PermissionButton
                            type="primary"
                            @click="handleAdd"
                            hasPermission="Northbound/AliCloud:add"
                        >
                            <template #icon
                                ><AIcon type="PlusOutlined"
                            /></template>
                            {{t('Northbound.AliCloud.index.5rg4hlqn56w0')}}
                        </PermissionButton>
                    </j-space>
                </template>
                <template #card="slotProps">
                    <CardBox
                        :value="slotProps"
                        @click="handleView(slotProps.id)"
                        :actions="getActions(slotProps, 'card')"
                        :status="slotProps.state?.value"
                        :statusText="slotProps.state?.text"
                        :statusNames="{
                            enabled: 'processing',
                            disabled: 'error',
                        }"
                    >
                        <template #img>
                            <img :src="getImage('/northbound/aliyun.png')" />
                        </template>
                        <template #content>
                            <Ellipsis style="width: calc(100% - 100px)">
                                <span style="font-size: 16px; font-weight: 600">
                                    {{ slotProps.name }}
                                </span>
                            </Ellipsis>
                            <j-row style="margin-top: 15px">
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        {{t('Northbound.AliCloud.index.5rg4hlqn7ac0')}}
                                    </div>
                                    <Ellipsis>
                                        <div>
                                            {{ slotProps?.bridgeProductName }}
                                        </div>
                                    </Ellipsis>
                                </j-col>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        <label>{{t('Northbound.AliCloud.index.5rg4hlqn7gs0')}}</label>
                                    </div>
                                    <Ellipsis>
                                        <div>{{ slotProps?.description }}</div>
                                    </Ellipsis>
                                </j-col>
                            </j-row>
                        </template>
                        <template #actions="item">
                            <PermissionButton
                                :disabled="item.disabled"
                                :popConfirm="item.popConfirm"
                                :tooltip="item.tooltip"
                                @click="item.onClick"
                                :hasPermission="
                                    'Northbound/AliCloud:' + item.key
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
                        :status="slotProps.state?.value"
                        :text="slotProps.state?.text"
                        :statusNames="{
                            enabled: 'processing',
                            disabled: 'error',
                        }"
                    />
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
                                :tooltip="i.tooltip"
                                style="padding: 0 5px"
                                @click="i.onClick"
                                type="link"
                                :danger="i.key === 'delete'"
                                :hasPermission="
                                    i.key === 'view'
                                        ? true
                                        : 'Northbound/AliCloud:' + i.key
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
import { query, _undeploy, _deploy, _delete } from '@/api/northbound/alicloud';
import type { ActionsType } from '@/views/device/Instance/typings';
import { getImage, onlyMessage } from '@/utils/comm';
import { useMenuStore } from 'store/menu';
import BadgeStatus from '@/components/BadgeStatus/index.vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const instanceRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

const menuStory = useMenuStore();

const columns = [
    {
        title: t('Northbound.AliCloud.index.5rg4hlqn7lc0'),
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
    },
    {
        title: t('Northbound.AliCloud.index.5rg4hlqn7ac0'),
        dataIndex: 'bridgeProductName',
        key: 'bridgeProductName',
        search: {
            type: 'string',
        },
    },
    {
        title: t('Northbound.AliCloud.index.5rg4hlqn7gs0'),
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: t('Northbound.AliCloud.index.5rg4hlqn7p80'),
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: t('Northbound.AliCloud.index.5rg4hlqn7uc0'), value: 'enabled' },
                { label: t('Northbound.AliCloud.index.5rg4hlqn7yc0'), value: 'disabled' },
            ],
        },
    },
    {
        title: t('Northbound.AliCloud.index.5rg4hlqn85k0'),
        key: 'action',
        fixed: 'right',
        width: 160,
        scopedSlots: true,
    },
];

/**
 * {{t('Northbound.AliCloud.index.5rg4hlqn56w0')}}
 */
const handleAdd = () => {
    menuStory.jumpPage('Northbound/AliCloud/Detail', { id: ':id' });
};

/**
 * {{t('Northbound.AliCloud.index.5rg4hlqn89c0')}}
 */
const handleView = (id: string) => {
    menuStory.jumpPage('Northbound/AliCloud/Detail', { id }, { type: 'view' });
};

const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
    if (!data) return [];
    const actions = [
        {
            key: 'view',
            text: t('Northbound.AliCloud.index.5rg4hlqn89c0'),
            tooltip: {
                title: t('Northbound.AliCloud.index.5rg4hlqn89c0'),
            },
            icon: 'EyeOutlined',
            onClick: () => {
                handleView(data.id);
            },
        },
        {
            key: 'update',
            text: t('Northbound.AliCloud.index.5rg4hlqn8dg0'),
            tooltip: {
                title: t('Northbound.AliCloud.index.5rg4hlqn8dg0'),
            },
            icon: 'EditOutlined',
            onClick: () => {
                menuStory.jumpPage(
                    'Northbound/AliCloud/Detail',
                    { id: data.id },
                    { type: 'edit' },
                );
            },
        },
        {
            key: 'action',
            text: data.state?.value !== 'disabled' ? t('Northbound.AliCloud.index.5rg4hlqn7yc0') : t('Northbound.AliCloud.index.5rg4hlqn8hc0'),
            tooltip: {
                title: data.state?.value !== 'disabled' ? t('Northbound.AliCloud.index.5rg4hlqn7yc0') : t('Northbound.AliCloud.index.5rg4hlqn8hc0'),
            },
            icon:
                data.state.value !== 'disabled'
                    ? 'StopOutlined'
                    : 'CheckCircleOutlined',
            popConfirm: {
                title: `${t('Northbound.AliCloud.index.verify') + 
                    (data.state.value !== 'disabled' ? t('Northbound.AliCloud.index.5rg4hlqn7yc0') : t('Northbound.AliCloud.index.5rg4hlqn8hc0'))
                }?`,
                onConfirm: async () => {
                    let response = undefined;
                    if (data.state.value !== 'disabled') {
                        response = await _undeploy(data.id);
                    } else {
                        response = await _deploy(data.id);
                    }
                    if (response && response.status === 200) {
                        onlyMessage(t('Northbound.AliCloud.index.5rg4hlqn8n00'));
                        instanceRef.value?.reload();
                    } else {
                        onlyMessage(t('Northbound.AliCloud.index.5rg4hlqn8qo0'), 'error');
                    }
                },
            },
        },
        {
            key: 'delete',
            text: t('Northbound.AliCloud.index.5rg4hlqn8ug0'),
            disabled: data.state?.value !== 'disabled',
            tooltip: {
                title:
                    data.state.value !== 'disabled'
                        ? t('Northbound.AliCloud.index.5rg4hlqn8y40')
                        : t('Northbound.AliCloud.index.5rg4hlqn8ug0'),
            },
            popConfirm: {
                title: t('Northbound.AliCloud.index.5rg4hlqn91o0'),
                onConfirm: async () => {
                    const resp = await _delete(data.id);
                    if (resp.status === 200) {
                        onlyMessage(t('Northbound.AliCloud.index.5rg4hlqn8n00'));
                        instanceRef.value?.reload();
                    } else {
                        onlyMessage(t('Northbound.AliCloud.index.5rg4hlqn8qo0'), 'error');
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
</script>
