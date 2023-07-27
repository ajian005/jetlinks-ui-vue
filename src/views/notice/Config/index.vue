<!-- 通知配置 -->
<template>
    <page-container>
        <pro-search :columns="columns" target="notice-config" @search="handleSearch" />
        <FullPage>
            <JProTable ref="configRef" :columns="columns" :request="ConfigApi.list" :defaultParams="{
                sorts: [{ name: 'createTime', order: 'desc' }],
            }" :params="params" :gridColumn="3">
                <template #headerTitle>
                    <j-space>
                        <PermissionButton
                            type="primary"
                            @click="handleAdd"
                            hasPermission="notice/Config:add"
                        >
                            {{t('notice.Config.index.5saxhx4p4n80')}}
                        </PermissionButton>
                        <j-upload
                            name="file"
                            accept=".json"
                            :showUploadList="false"
                            :before-upload="beforeUpload"
                        >
                            <PermissionButton
                                hasPermission="notice/Config:import"
                            >
                                {{t('notice.Config.index.5saxhx4p66k0')}}
                            </PermissionButton>
                        </j-upload>
                        <j-popconfirm
                            :title="t('notice.Config.index.5saxhx4p6eo0')"
                            :ok-text="t('notice.Config.index.5saxhx4p6l00')"
                            :cancel-text="t('notice.Config.index.5saxhx4p6qg0')"
                            @confirm="handleExport"
                        >
                            <PermissionButton
                                hasPermission="notice/Config:export"
                            >
                                {{t('notice.Config.index.5saxhx4p6x40')}}
                            </PermissionButton>
                        </j-popconfirm>
                    </j-space>
                </template>
                <template #card="slotProps">
                    <CardBox :showStatus="false" :statusNames="{}" :value="slotProps"
                        :actions="getActions(slotProps, 'card')">
                        <template #img>
                            <slot name="img">
                                <img :src="getLogo(
                                    slotProps.type,
                                    slotProps.provider,
                                )
                                    " class="logo" />
                            </slot>
                        </template>
                        <template #content>
                            <h3 class="card-item-content-title">
                                {{ slotProps.name }}
                            </h3>
                            <j-row>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        {{t('notice.Config.index.5saxhx4p72g0')}}
                                    </div>
                                    <div>
                                        {{ getMethodTxt(slotProps.type) }}
                                    </div>
                                </j-col>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        {{t('notice.Config.index.5saxhx4p77s0')}}
                                    </div>
                                    <Ellipsis>
                                        {{ slotProps.description }}
                                    </Ellipsis>
                                </j-col>
                            </j-row>
                        </template>
                        <template #actions="item">
                            <j-tooltip v-bind="item.tooltip" :title="item.disabled && item.tooltip.title">
                                <j-dropdown placement="bottomRight" v-if="item.key === 'others'">
                                    <j-button>
                                        <AIcon :type="item.icon" />
                                        <span>{{ item.text }}</span>
                                    </j-button>
                                    <template #overlay>
                                        <j-menu>
                                            <j-menu-item v-for="(o, i) in item.children" :key="i">
                                                <PermissionButton type="link" @click="o.onClick"
                                                    :hasPermission="`notice/Config:${o.key}`">
                                                    <template #icon>
                                                        <AIcon :type="o.icon" />
                                                    </template>
                                                    <span>{{ o.text }}</span>
                                                </PermissionButton>
                                            </j-menu-item>
                                        </j-menu>
                                    </template>
                                </j-dropdown>
                                <j-popconfirm v-else-if="item.key === 'delete'" v-bind="item.popConfirm"
                                    :disabled="item.disabled">
                                    <PermissionButton :disabled="item.disabled"
                                        :hasPermission="`notice/Config:${item.key}`">
                                        <template #icon>
                                            <AIcon type="DeleteOutlined" />
                                        </template>
                                    </PermissionButton>
                                </j-popconfirm>
                                <template v-else>
                                    <PermissionButton :disabled="item.disabled" @click="item.onClick"
                                        :hasPermission="`notice/Config:${item.key}`">
                                        <template #icon>
                                            <AIcon :type="item.icon" />
                                        </template>
                                        <span>{{ item.text }}</span>
                                    </PermissionButton>
                                </template>
                            </j-tooltip>
                        </template>
                    </CardBox>
                </template>
                <template #type="slotProps">
                    <span> {{ getMethodTxt(slotProps.type) }}</span>
                </template>
                <template #provider="slotProps">
                    <span>
                        {{ getProviderTxt(slotProps.type, slotProps.provider) }}
                    </span>
                </template>
                <template #description="slotProps">
                    <Ellipsis>
                        {{ slotProps.description }}
                    </Ellipsis>
                </template>
                <template #action="slotProps">
                    <j-space :size="16">
                        <template v-for="i in getActions(slotProps, 'table')" :key="i.key">
                            <PermissionButton :danger="i.key === 'delete'" :disabled="i.disabled" :popConfirm="i.popConfirm"
                                :tooltip="{
                                    ...i.tooltip,
                                }" @click="i.onClick" type="link" style="padding: 0px"
                                :hasPermission="'notice/Config:' + i.key">
                                <template #icon>
                                    <AIcon :type="i.icon" />
                                </template>
                            </PermissionButton>
                        </template>
                    </j-space>
                </template>
            </JProTable>
        </FullPage>

        <Debug v-model:visible="debugVis" :data="currentConfig" />
        <Log v-model:visible="logVis" :data="currentConfig" />
        <SyncUser v-model:visible="syncVis" :data="currentConfig" />
    </page-container>
</template>

<script setup lang="ts">
import ConfigApi from '@/api/notice/config';
import type { ActionsType } from '@/views/device/Instance/typings';

import { NOTICE_METHOD, MSG_TYPE } from '@/views/notice/const';
import SyncUser from './SyncUser/index.vue';
import Debug from './Debug/index.vue';
import Log from './Log/index.vue';
import { downloadObject } from '@/utils/utils';
import { useMenuStore } from 'store/menu';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const menuStory = useMenuStore();

let providerList: any = [];
Object.keys(MSG_TYPE).forEach((key) => {
    providerList = [...providerList, ...MSG_TYPE[key]];
});

const configRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

const columns = [
    {
        title: t('notice.Config.index.5saxhx4p7do0'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: t('notice.Config.index.5saxhx4p72g0'),
        dataIndex: 'type',
        key: 'type',
        scopedSlots: true,
        width: 100,
        search: {
            type: 'select',
            options: NOTICE_METHOD,
            handleValue: (v: any) => {
                return v;
            },
        },
    },
    {
        title: t('notice.Config.index.5saxhx4p7jo0'),
        dataIndex: 'provider',
        key: 'provider',
        scopedSlots: true,
        width: 200,
        search: {
            type: 'select',
            options: providerList,
            handleValue: (v: any) => {
                return v;
            },
        },
    },
    {
        title: t('notice.Config.index.5saxhx4p77s0'),
        dataIndex: 'description',
        key: 'description',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: t('notice.Config.index.5saxhx4p7ps0'),
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
 * 根据通知方式展示对应logo
 */
const getLogo = (type: string, provider: string) => {
    return MSG_TYPE[type].find((f: any) => f.value === provider)?.logo;
};
/**
 * 通知方式字段展示对应文字
 */
const getMethodTxt = (type: string) => {
    return NOTICE_METHOD.find((f) => f.value === type)?.label;
};
/**
 * 根据类型展示对应文案
 * @param type
 * @param provider
 */
const getProviderTxt = (type: string, provider: string) => {
    return MSG_TYPE[type].find((f: any) => f.value === provider)?.label;
};

/**
 * {{t('notice.Config.index.5saxhx4p4n80')}}
 */
const handleAdd = () => {
    menuStory.jumpPage('notice/Config/Detail', { id: ':id' });
};

/**
 * {{t('notice.Config.index.5saxhx4p66k0')}}
 */
const beforeUpload = (file: any) => {
    console.log('file: ', file);
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async (result) => {
        const text = result.target?.result;
        console.log('text: ', text);
        if (!file.type.includes('json')) {
            onlyMessage(t('notice.Config.index.5saxhx4p7v80'), 'error');
            return false;
        }
        try {
            const data = JSON.parse(text || '{}');
            const { success } = await ConfigApi.update(data);
            if (success) {
                onlyMessage(t('notice.Config.index.5saxhx4p8080'));
                configRef.value.reload();
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
 * {{t('notice.Config.index.5saxhx4p6x40')}}
 */
const handleExport = () => {
    downloadObject(configRef.value._dataSource, `通知配置数据`);
};

const syncVis = ref(false);
const debugVis = ref(false);
const logVis = ref(false);
const currentConfig = ref<Partial<Record<string, any>>>();
const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
    if (!data) return [];
    const actions = [
        {
            key: 'update',
            text: t('notice.Config.index.5saxhx4p85o0'),
            tooltip: {
                title: t('notice.Config.index.5saxhx4p85o0'),
            },
            icon: 'EditOutlined',
            onClick: () => {
                menuStory.jumpPage('notice/Config/Detail', {
                    id: data.id,
                });
            },
        },
        {
            key: 'debug',
            text: t('notice.Config.index.5saxhx4p8as0'),
            tooltip: {
                title: t('notice.Config.index.5saxhx4p8as0'),
            },
            icon: 'BugOutlined',
            onClick: () => {
                debugVis.value = true;
                currentConfig.value = data;
            },
        },
        {
            key: 'delete',
            text: t('notice.Config.index.5saxhx4p8fo0'),
            popConfirm: {
                title: t('notice.Config.index.5saxhx4p8lc0'),
                onConfirm: async () => {
                    const resp = await ConfigApi.del(data.id);
                    if (resp.status === 200) {
                        onlyMessage(t('notice.Config.index.5saxhx4p8sw0'));
                        configRef.value?.reload();
                    } else {
                        onlyMessage(t('notice.Config.index.5saxhx4p8yg0'), 'error');
                    }
                },
            },
            icon: 'DeleteOutlined',
        },
    ];

    const others: ActionsType = {
        key: 'others',
        text: t('notice.Config.index.5saxhx4p94s0'),
        icon: 'EllipsisOutlined',
        children: [
            {
                key: 'export',
                text: t('notice.Config.index.5saxhx4p6x40'),
                tooltip: {
                    title: t('notice.Config.index.5saxhx4p6x40'),
                },
                icon: 'ArrowDownOutlined',
                onClick: () => {
                    downloadObject(data, `${data.name}`);
                },
            },
            {
                key: 'bind',
                text: t('notice.Config.index.5saxhx4p9d00'),
                tooltip: {
                    title: t('notice.Config.index.5saxhx4p9d00'),
                },
                icon: 'TeamOutlined',
                onClick: () => {
                    syncVis.value = true;
                    currentConfig.value = data;
                },
            },
            {
                key: 'log',
                text: t('notice.Config.index.5saxhx4p9hk0'),
                tooltip: {
                    title: t('notice.Config.index.5saxhx4p9hk0'),
                },
                icon: 'BarsOutlined',
                onClick: () => {
                    logVis.value = true;
                    currentConfig.value = data;
                },
            },
        ],
    };

    if (type === 'card') {
        if (
            data.provider !== 'dingTalkMessage' &&
            data.provider !== 'corpMessage'
        )
            others.children?.splice(1, 1);
        actions.splice(actions.length - 1, 0, others);
        return actions;
    } else {
        if (
            data.provider !== 'dingTalkMessage' &&
            data.provider !== 'corpMessage'
        )
            others.children?.splice(1, 1);
        actions.splice(actions.length - 1, 0, ...others.children);
        return actions;
    }
};
</script>
<style lang="less" scoped>
.logo {
    width: 88px;
    height: 88px;
}
</style>
