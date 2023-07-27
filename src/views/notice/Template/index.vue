<!-- 通知模板 -->
<template>
    <page-container>
        <pro-search :columns="columns" target="notice-config" @search="handleSearch" />
        <FullPage>
            <JProTable ref="configRef" :columns="columns" :request="TemplateApi.list" :defaultParams="{
                sorts: [{ name: 'createTime', order: 'desc' }],
            }" :params="params" :gridColumn="3">
                <template #headerTitle>
                    <j-space>
                        <PermissionButton type="primary" @click="handleAdd" hasPermission="notice/Template:add">
                            {{ t('common.add') }}
                        </PermissionButton>
                        <j-upload name="file" accept=".json" :showUploadList="false" :before-upload="beforeUpload">
                            <PermissionButton hasPermission="notice/Template:import">
                                {{ t('common.import') }}
                            </PermissionButton>
                        </j-upload>
                        <j-popconfirm :title="t('common.tips.export')" :ok-text="t('common.ok')" :cancel-text="t('common.cancel')" @confirm="handleExport">
                            <PermissionButton hasPermission="notice/Template:export">
                                {{ t('common.export') }}
                            </PermissionButton>
                        </j-popconfirm>
                    </j-space>
                </template>
                <template #card="slotProps">
                    <CardBox :showStatus="false" :value="slotProps" :actions="getActions(slotProps, 'card')"
                        :statusNames="{}">
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
                                        {{ t('common.notiMode') }}
                                    </div>
                                    <div>
                                        {{ getMethodTxt(slotProps.type) }}
                                    </div>
                                </j-col>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        {{ t('common.descri') }}
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
                                                    :hasPermission="`notice/Template:${o.key}`">
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
                                        :hasPermission="`notice/Template:${item.key}`">
                                        <template #icon>
                                            <AIcon type="DeleteOutlined" />
                                        </template>
                                    </PermissionButton>
                                </j-popconfirm>
                                <template v-else>
                                    <PermissionButton :disabled="item.disabled" @click="item.onClick"
                                        :hasPermission="`notice/Template:${item.key}`">
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
                                :hasPermission="'notice/Template:' + i.key">
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
    </page-container>
</template>

<script setup lang="ts">
import TemplateApi from '@/api/notice/template';
import type { ActionsType } from '@/views/device/Instance/typings';
import { NOTICE_METHOD, MSG_TYPE } from '@/views/notice/const';
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
        title: t('pages.iot.notice.template.templateName'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: t('common.notiMode'),
        dataIndex: 'type',
        key: 'type',
        scopedSlots: true,
        search: {
            type: 'select',
            options: NOTICE_METHOD,
            handleValue: (v: any) => {
                return v;
            },
        },
    },
    {
        title: t('common.type'),
        dataIndex: 'provider',
        key: 'provider',
        scopedSlots: true,
        search: {
            type: 'select',
            options: providerList,
            handleValue: (v: any) => {
                return v;
            },
        },
    },
    {
        title: t('common.descri'),
        dataIndex: 'description',
        key: 'description',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: t('common.action'),
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
    // console.log('params.value: ', params.value);
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
 * 新增
 */
const handleAdd = () => {
    menuStory.jumpPage('notice/Template/Detail', {
        id: ':id',
    });
};

/**
 * 导入
 */
const beforeUpload = (file: any) => {
    // console.log('file: ', file);
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async (result) => {
        const text = result.target?.result;
        console.log('text: ', text);
        if (!file.type.includes('json')) {
            onlyMessage('请上传json格式文件', 'error');
            return false;
        }
        try {
            const data = JSON.parse(text || '{}');
            const { success } = await TemplateApi.update(data);
            if (success) {
                onlyMessage('操作成功');
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
 * 导出
 */
const handleExport = () => {
    downloadObject(configRef.value._dataSource, `通知模板数据`);
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
            text: t('common.redact'),
            tooltip: {
                title: t('common.redact'),
            },
            icon: 'EditOutlined',
            onClick: () => {
                menuStory.jumpPage('notice/Template/Detail', {
                    id: data.id,
                });
            },
        },
        {
            key: 'debug',
            text: t('common.debug'),
            tooltip: {
                title: t('common.debug'),
            },
            icon: 'BugOutlined',
            onClick: () => {
                debugVis.value = true;
                currentConfig.value = data;
            },
        },
        {
            key: 'delete',
            text: t('common.delete'),
            popConfirm: {
                title:  t('common.tips.delete'),
                onConfirm: async () => {
                    const resp = await TemplateApi.del(data.id);
                    if (resp.status === 200) {
                        onlyMessage('操作成功！');
                        configRef.value?.reload();
                    } else {
                        onlyMessage('操作失败！', 'error');
                    }
                },
            },
            icon: 'DeleteOutlined',
        },
    ];

    const others: ActionsType = {
        key: 'others',
        text: t('common.others'),
        icon: 'EllipsisOutlined',
        children: [
            {
                key: 'export',
                text:  t('common.export'),
                tooltip: {
                    title: t('common.export'),
                },
                icon: 'ArrowDownOutlined',
                onClick: () => {
                    downloadObject(data, `${data.name}`);
                },
            },
            {
                key: 'log',
                text: t('pages.iot.notice.template.noticeRecord'),
                tooltip: {
                    title: t('pages.iot.notice.template.noticeRecord'),
                },
                icon: 'BarsOutlined',
                onClick: () => {
                    logVis.value = true;
                    currentConfig.value = data;
                },
            },
        ],
    };

    type === 'card'
        ? actions.splice(actions.length - 1, 0, others)
        : actions.splice(actions.length - 1, 0, ...others.children);
    return actions;
};
</script>

<style lang="less" scoped>
.logo {
    width: 88px;
    height: 88px;
}
</style>
