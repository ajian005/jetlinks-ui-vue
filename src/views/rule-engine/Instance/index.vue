<template>
    <page-container>
        <div>
            <pro-search
                :columns="query.columns"
                target="rule-engine-instance"
                @search="handleSearch"
            />
            <FullPage>
                <JProTable
                    :columns="columns"
                    :request="queryList"
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
                                hasPermission="rule-engine/Instance:add"
                            >
                                <template #icon
                                    ><AIcon type="PlusOutlined"
                                /></template>
                                {{t('rule-engine.Instance.index.5rg4mqvp4dg0')}}
                            </PermissionButton>
                        </j-space>
                    </template>
                    <template #card="slotProps">
                        <CardBox
                            :value="slotProps"
                            :actions="getActions(slotProps, 'card')"
                            v-bind="slotProps"
                            :status="slotProps.state?.value"
                            :statusText="slotProps.state?.text"
                            @click="openRuleEditor"
                            :statusNames="{
                                started: 'processing',
                                disable: 'error',
                            }"
                        >
                            <template #img>
                                <slot name="img">
                                    <img
                                        :src="getImage('/scene/trigger-type/scene.png')"
                                    />
                                </slot>
                            </template>
                            <template #content>
                                <Ellipsis style="width: calc(100% - 100px); margin-bottom: 18px;">
                                    <span
                                        style="
                                            font-weight: 600;
                                            font-size: 16px;
                                        "
                                    >
                                        {{ slotProps.name }}
                                    </span>
                                </Ellipsis>
                                <j-row>
                                    <j-col :span="12">
                                        <Ellipsis>
                                            <div>
                                                {{ slotProps.description }}
                                            </div>
                                        </Ellipsis>
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
                                    :hasPermission="
                                        'rule-engine/Instance:' + item.key
                                    "
                                    @click="item.onClick"
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
                            :text="
                                slotProps.state?.value === 'started'
                                    ? t('rule-engine.Instance.index.5rg4mqvp6d00')
                                    : t('rule-engine.Instance.index.5rg4mqvp6s00')
                            "
                            :status="slotProps.state?.value"
                            :statusNames="{
                                started: 'processing',
                                disable: 'error',
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
                                    :tooltip="{
                                        ...i.tooltip,
                                    }"
                                    @click="i.onClick"
                                    type="link"
                                    style="padding: 0px"
                                    :hasPermission="
                                        'rule-engine/Instance:' + i.key
                                    "
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
            <Save
                :data="current"
                @success="refresh"
                v-if="visiable"
                @close-save="closeSave"
            />
        </div>
    </page-container>
</template>

<script lang="ts" setup>
import {
    queryList,
    startRule,
    stopRule,
    deleteRule,
} from '@/api/rule-engine/instance';
import type { ActionsType } from '@/components/Table/index.vue';
import { getImage, onlyMessage } from '@/utils/comm';
import Save from './Save/index.vue';
import { SystemConst } from '@/utils/consts';
import { useRouterParams } from '@/utils/hooks/useParams';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const params = ref<Record<string, any>>({});
let visiable = ref(false);
const tableRef = ref<Record<string, any>>({});
const { params: routeParams } = useRouterParams();
const query = {
    columns: [
        {
            title: t('rule-engine.Instance.index.5rg4mqvp7040'),
            dataIndex: 'name',
            key: 'name',
            search: {
                type: 'string',
            },
        },
        {
            title: t('rule-engine.Instance.index.5rg4mqvp75c0'),
            dataIndex: 'state',
            key: 'state',
            search: {
                type: 'select',
                options: [
                    {
                        label: t('rule-engine.Instance.index.5rg4mqvp6d00'),
                        value: 'started',
                    },
                    {
                        label: t('rule-engine.Instance.index.5rg4mqvp6s00'),
                        value: 'disable',
                    },
                ],
            },
        },
        {
            title: t('rule-engine.Instance.index.5rg4mqvp7a00'),
            key: 'description',
            dataIndex: 'description',
            search: {
                type: 'string',
            },
        },
    ],
};
const columns = [
    {
        title: t('rule-engine.Instance.index.5rg4mqvp7040'),
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: t('rule-engine.Instance.index.5rg4mqvp75c0'),
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
    },
    {
        title: t('rule-engine.Instance.index.5rg4mqvp7a00'),
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: t('rule-engine.Instance.index.5rg4mqvp7g80'),
        key: 'action',
        fixed: 'right',
        width: 150,
        scopedSlots: true,
    },
];
const current = ref();
const getActions = (
    data: Partial<Record<string, any>>,
    type?: 'card' | 'table',
): ActionsType[] => {
    if (!data) {
        return [];
    }
    const actions = [
        {
            key: 'update',
            text: t('rule-engine.Instance.index.5rg4mqvp7n80'),
            tooltip: {
                title: t('rule-engine.Instance.index.5rg4mqvp7n80'),
            },

            icon: 'EditOutlined',
            onClick: () => {
                current.value = data;
                visiable.value = true;
            },
        },
        {
            key: 'view',
            text: t('rule-engine.Instance.index.5rg4mqvp7s40'),
            tooltip: {
                title: t('rule-engine.Instance.index.5rg4mqvp7s40'),
            },
            icon: 'EyeOutlined',
            onClick: () => {
                openRuleEditor(data);
            },
        },
        {
            key: 'action',
            text: data.state?.value !== 'disable' ? t('rule-engine.Instance.index.5rg4mqvp6s00') : t('rule-engine.Instance.index.5rg4mqvp7wc0'),
            tooltip: {
                title: data.state?.value !== 'disable' ? t('rule-engine.Instance.index.5rg4mqvp6s00') : t('rule-engine.Instance.index.5rg4mqvp7wc0'),
            },
            icon:
                data.state?.value !== 'disable'
                    ? 'StopOutlined'
                    : 'CheckCircleOutlined',
            popConfirm: {
                title: t('rule-engine.Instance.index.verify',{stateText:data.state !== 'disable' ? t('rule-engine.Instance.index.5rg4mqvp6s00') : t('rule-engine.Instance.index.5rg4mqvp7wc0')}),
                onConfirm: async () => {
                    let response = undefined;
                    if (data.state?.value !== 'started') {
                        response = await startRule(data.id);
                    } else {
                        response = await stopRule(data.id);
                    }
                    if (response && response.status === 200) {
                        onlyMessage(t('rule-engine.Instance.index.5rg4mqvp8000'));
                        tableRef.value?.reload();
                    } else {
                        onlyMessage(t('rule-engine.Instance.index.5rg4mqvp84g0'), 'error');
                    }
                },
            },
        },
        {
            key: 'delete',
            text: t('rule-engine.Instance.index.5rg4mqvp8840'),
            disabled: data?.state?.value !== 'disable',
            tooltip: {
                title:
                    data?.state?.value !== 'disable'
                        ? t('rule-engine.Instance.index.5rg4mqvp8dc0')
                        : t('rule-engine.Instance.index.5rg4mqvp8840'),
            },
            popConfirm: {
                title: t('rule-engine.Instance.index.5rg4mqvp8h80'),
                onConfirm: async () => {
                    const resp = await deleteRule(data.id);
                    if (resp.status === 200) {
                        onlyMessage(t('rule-engine.Instance.index.5rg4mqvp8000'));
                        tableRef.value?.reload();
                    } else {
                        onlyMessage(t('rule-engine.Instance.index.5rg4mqvp84g0'), 'error');
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
const add = () => {
    (current.value = {
        name: '',
        description: '',
    }),
        (visiable.value = true);
};
/**
 * 刷新数据
 */
const refresh = () => {
    tableRef.value?.reload();
};
const handleSearch = (e: any) => {
    params.value = e;
};
const openRuleEditor = (item: any) => {
    window.open(
        `/${SystemConst.API_BASE}/rule-editor/index.html#flow/${item.id}`,
    );
};
const closeSave = () => {
    visiable.value = false;
};
onMounted(() => {
    if (history.state?.params) {
        add();
    }
});
</script>
<style scoped>
</style>