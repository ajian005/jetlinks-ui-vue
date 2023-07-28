<!--产品分类 -->
<template>
    <page-container>
        <pro-search
            :columns="query.columns"
            target="category"
            @search="handleSearch"
        />
        <FullPage>
            <JProTable
                ref="tableRef"
                :columns="table.columns"
                :request="queryTree"
                model="TABLE"
                type="TREE"
                v-model:expandedRowKeys="expandedRowKeys"
                :scroll="{ y: 550 }"
                :defaultParams="{
                    paging: false,
                    sorts: [
                        { name: 'sortIndex', order: 'asc' },
                        {
                            name: 'createTime',
                            order: 'desc',
                        },
                    ],
                }"
                :params="params"
                :loading="tableLoading"
            >
                <template #headerTitle>
                    <PermissionButton
                        type="primary"
                        @click="add"
                        hasPermission="device/Category:add"
                    >
                        <template #icon><AIcon type="PlusOutlined" /></template>
                        {{t('device.Category.index.5rcy4wlxlf00')}}
                    </PermissionButton>
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
                                :hasPermission="'device/Category:' + i.key"
                                :tooltip="{
                                    ...i.tooltip,
                                }"
                                @click="i.onClick"
                                type="link"
                                style="padding: 0px"
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
        <!-- 新增和编辑弹窗 -->
        <ModifyModal
            ref="modifyRef"
            :formData="currentForm"
            :title="title"
            :isAdd="isAdd"
            :isChild="isChild"
            @refresh="refresh"
        />
    </page-container>
</template>
<script lang="ts" name="Category" setup>
import { queryTree, deleteTree } from '@/api/device/category';
import type { ActionsType } from '@/components/Table/index.vue';
import ModifyModal from './components/modifyModal/index.vue';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const expandedRowKeys = ref<any>([]);
const tableRef = ref<Record<string, any>>({});
const modifyRef = ref();
const dataSource = ref<any>([]);
const currentForm = ref({});
const title = ref('');
const isAdd = ref(0);
const isChild = ref(0);
const tableLoading = ref(false);
// 筛选
const query = reactive({
    columns: [
        {
            title: t('device.Category.index.5rcy4wlxmro0'),
            dataIndex: 'name',
            key: 'name',
            search: {
                type: 'string',
            },
        },
        {
            title: t('device.Category.index.5rcy4wlxn140'),
            dataIndex: 'sortIndex',
            key: 'sortIndex',
            search: {
                type: 'number',
            },
            scopedSlots: true,
        },
        {
            title: t('device.Category.index.5rcy4wlxn8c0'),
            key: 'description',
            dataIndex: 'description',
            search: {
                type: 'string',
            },
        },
        {
            title: t('device.Category.index.5rcy4wlxnf40'),
            key: 'action',
            fixed: 'right',
            width: 250,
            scopedSlots: true,
        },
    ],
});
let params = ref();
/**
 * 搜索
 */
const handleSearch = (e: any) => {
    params.value = e;
    expandedRowKeys.value = [];
};
/**
 * 操作栏按钮
 */
const getActions = (
    data: Partial<Record<string, any>>,
    type: 'table',
): ActionsType[] => {
    if (!data) return [];
    const actions = [
        {
            key: 'update',
            text: t('device.Category.index.5rcy4wlxnm80'),
            tooltip: {
                title: t('device.Category.index.5rcy4wlxnm80'),
            },
            icon: 'EditOutlined',
            onClick: async () => {
                title.value = t('device.Category.index.5rcy4wlxnss0');
                isAdd.value = 2;
                currentForm.value = data;
                nextTick(() => {
                    modifyRef.value.show(data);
                });
            },
        },
        {
            key: 'add',
            text: t('device.Category.index.5rcy4wlxnys0'),
            tooltip: {
                title: t('device.Category.index.5rcy4wlxnys0'),
            },
            icon: 'PlusCircleOutlined',
            onClick: () => {
                title.value = t('device.Category.index.5rcy4wlxo580');
                isAdd.value = 0;
                currentForm.value = {};
                if (data.children && data.children.length > 0) {
                    isChild.value = 1;
                } else {
                    isChild.value = 2;
                }
                nextTick(() => {
                    modifyRef.value.show(data);
                });
            },
        },
        {
            key: 'delete',
            text: t('device.Category.index.5rcy4wlxoes0'),
            tooltip: {
                title: t('device.Category.index.5rcy4wlxoes0'),
            },
            popConfirm: {
                title: t('device.Category.index.5rcy4wlxou40'),
                okText: t('device.Category.index.verify'),
                cancelText: t('device.Category.index.5rcy4wlxp0s0'),
                onConfirm: async () => {
                    const resp = await deleteTree(data.id);
                    if (resp.status === 200) {
                        onlyMessage(t('device.Category.index.5rcy4wlxp6o0'));
                        tableRef.value.reload();
                    } else {
                        onlyMessage(t('device.Category.index.5rcy4wlxpf80'), 'error');
                    }
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
    return actions;
};

const table = reactive({
    columns: [
        {
            title: t('device.Category.index.5rcy4wlxmro0'),
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            width: 500,
        },
        {
            title: t('device.Category.index.5rcy4wlxn140'),
            dataIndex: 'sortIndex',
            key: 'sortIndex',
            scopedSlots: true,
            width: 100,
        },
        {
            title: t('device.Category.index.5rcy4wlxpls0'),
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: t('device.Category.index.5rcy4wlxnf40'),
            key: 'action',
            fixed: 'right',
            ellipsis: true,
            scopedSlots: true,
            width: 120,
        },
    ],
    /**
     * 添加产品分类
     */
    add: async () => {
        title.value = t('device.Category.index.5rcy4wlxprw0');
        isAdd.value = 0;
        isChild.value = 3;
        nextTick(() => {
            modifyRef.value.show(currentForm.value);
        });
    },
    /**
     * 刷新表格数据
     */
    refresh: () => {
        tableRef.value.reload();
    },
});
const { add, columns, refresh } = toRefs(table);
/**
 * 初始化
 */
</script>
<style scoped lang="less">
:deep(._jtable-body_1eyxz_1 ._jtable-pagination_1eyxz_43) {
    margin-top: 20px;
    display: none;
    justify-content: flex-end;
}
</style>
