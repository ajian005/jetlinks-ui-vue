<template>
    <page-container>
        <div class="permission-container">
            <pro-search
                :columns="columns"
                target="system-permission"
                @search="handleSearch"
            />
            <FullPage>
                <j-pro-table
                    ref="tableRef"
                    :columns="columns"
                    :request="getPermission_api"
                    model="TABLE"
                    :params="queryParams"
                    :defaultParams="{
                        sorts: [{ name: 'id', order: 'asc' }],
                    }"
                >
                    <template #headerTitle>
                        <PermissionButton
                            type="primary"
                            :hasPermission="`${permission}:add`"
                            @click="table.openDialog(undefined)"
                        >
                            <AIcon type="PlusOutlined" />
                            {{t('system.Permission.index.5rg9un6bg3k0')}}
                        </PermissionButton>
                        <j-dropdown trigger="hover">
                            <j-button>{{t('system.Permission.index.5rg9un6bhos0')}}</j-button>
                            <template #overlay>
                                <j-menu>
                                    <j-menu-item>
                                        <j-upload
                                            name="file"
                                            action="#"
                                            accept=".json"
                                            :showUploadList="false"
                                            :before-upload="table.clickImport"
                                            :disabled="
                                                !hasPermission(
                                                    `${permission}:import`,
                                                )
                                            "
                                        >
                                            <PermissionButton
                                                :hasPermission="`${permission}:import`"
                                            >
                                                {{t('system.Permission.index.5rg9un6bi280')}}
                                            </PermissionButton>
                                        </j-upload>
                                    </j-menu-item>
                                    <j-menu-item>
                                        <PermissionButton
                                            :hasPermission="`${permission}:export`"
                                            :popConfirm="{
                                                title: t('system.Permission.index.export'),
                                                onConfirm: () =>
                                                    table.clickExport(),
                                            }"
                                        >
                                            {{t('system.Permission.index.5rg9un6bib40')}}
                                        </PermissionButton>
                                    </j-menu-item>
                                </j-menu>
                            </template>
                        </j-dropdown>
                    </template>
                    <template #status="slotProps">
                        <BadgeStatus
                            :status="slotProps.status"
                            :text="slotProps.status ? t('system.Permission.index.5rg9un6bik40') : t('system.Permission.index.5rg9un6bisk0')"
                            :statusNames="{
                                1: 'success',
                                0: 'error',
                            }"
                        ></BadgeStatus>
                    </template>
                    <template #action="slotProps">
                        <j-space :size="16">
                            <PermissionButton
                                :hasPermission="`${permission}:update`"
                                type="link"
                                :tooltip="{
                                    title: t('system.Permission.index.5rg9un6bj340'),
                                }"
                                @click="table.openDialog(slotProps)"
                            >
                                <AIcon type="EditOutlined" />
                            </PermissionButton>

                            <PermissionButton
                                :hasPermission="`${permission}:action`"
                                type="link"
                                :popConfirm="{
                                    title: t('system.Permission.index.verify',{stateText: slotProps.status ? t('system.Permission.index.5rg9un6bisk0') : t('system.Permission.index.5rg9un6bik40') }) ,
                                    onConfirm: () =>
                                        table.changeStatus(slotProps),
                                }"
                                :tooltip="{
                                    title: slotProps.status ? t('system.Permission.index.5rg9un6bisk0') : t('system.Permission.index.5rg9un6bik40'),
                                }"
                            >
                                <AIcon
                                    :type="
                                        slotProps.status
                                            ? 'StopOutlined'
                                            : 'PlayCircleOutlined'
                                    "
                                />
                            </PermissionButton>

                            <PermissionButton
                                :hasPermission="`${permission}:delete`"
                                type="link"
                                :tooltip="{
                                    title: slotProps.status
                                        ? t('system.Permission.index.5rg9un6bjcg0')
                                        : t('system.Permission.index.5rg9un6bjpg0'),
                                }"
                                :popConfirm="{
                                    title: t('system.Permission.index.deleteTip'),
                                    onConfirm: () => table.clickDel(slotProps),
                                }"
                                :disabled="slotProps.status"
                            >
                                <AIcon type="DeleteOutlined" />
                            </PermissionButton>
                        </j-space>
                    </template>
                </j-pro-table>
            </FullPage>

            <EditDialog
                v-if="dialog.visible"
                v-model:visible="dialog.visible"
                :data="dialog.selectItem"
                @refresh="table.refresh"
            />
        </div>
    </page-container>
</template>

<script setup lang="ts">
import PermissionButton from '@/components/PermissionButton/index.vue';
import EditDialog from './components/EditDialog.vue';
import {
    getPermission_api,
    editPermission_api,
    delPermission_api,
    exportPermission_api,
} from '@/api/system/permission';
import { downloadObject } from '@/utils/utils';
import { usePermissionStore } from '@/store/permission';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const permission = 'system/Permission';
const hasPermission = usePermissionStore().hasPermission;

const columns = [
    {
        title: t('system.Permission.index.5rg9un6bjxs0'),
        dataIndex: 'id',
        key: 'id',
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'string',
        },
    },
    {
        title: t('system.Permission.index.5rg9un6bk5c0'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: t('system.Permission.index.5rg9un6bke00'),
        dataIndex: 'status',
        key: 'status',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: t('system.Permission.index.5rg9un6bik40'), value: 1 },
                { label: t('system.Permission.index.5rg9un6bisk0'), value: 0 },
            ],
            handleValue: (v: any) => {
                return v;
            },
        },
    },
    {
        title: t('system.Permission.index.5rg9un6bklg0'),
        dataIndex: 'action',
        key: 'action',
        width: 120,
        fixed: 'right',
        scopedSlots: true,
    },
];
const queryParams = ref({});
const handleSearch = (e: any) => {
    queryParams.value = e;
};
// 表格
const tableRef = ref<Record<string, any>>({}); // 表格实例
const table = {
    // 打开编辑弹窗
    openDialog: (row: object | undefined = {}) => {
        dialog.selectItem = { ...row };
        dialog.visible = true;
    },
    // 导入数据
    clickImport: (file: File) => {
        if (file.type === 'application/json') {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = (result: any) => {
                try {
                    const data = JSON.parse(result.target.result);
                    editPermission_api(data).then((resp) => {
                        if (resp.status === 200) {
                            onlyMessage(t('system.Permission.index.5rg9un6bktc0'));
                            table.refresh();
                        }
                    });
                } catch (error) {
                    onlyMessage(t('system.Permission.index.5rg9un6bl0w0'), 'error');
                }
            };
        } else onlyMessage(t('system.Permission.index.5rg9un6bl8g0'), 'error');
        return false;
    },
    // 导出数据
    clickExport: () => {
        const params = {
            paging: false,
            ...queryParams.value,
        };
        exportPermission_api(params).then((resp) => {
            if (resp.status === 200) {
                downloadObject(resp.result as any, t('system.Permission.index.5rg9un6blgw0'));
                onlyMessage(t('system.Permission.index.5rg9un6blsk0'));
            } else {
                onlyMessage(t('system.Permission.index.5rg9un6bm1c0'), 'error');
            }
        });
    },
    // 修改状态
    changeStatus: (row: any) => {
        const params = {
            ...row,
            status: row.status ? 0 : 1,
        };
        editPermission_api(params).then(() => {
            onlyMessage(t('system.Permission.index.5rg9un6bmdc0'));
            tableRef.value.reload();
        });
    },
    // 删除
    clickDel: (row: any) => {
        delPermission_api(row.id).then((resp: any) => {
            if (resp.status === 200) {
                tableRef.value?.reload();
                onlyMessage(t('system.Permission.index.5rg9un6bmnw0'));
            }
        });
    },
    // 刷新列表
    refresh: () => {
        tableRef.value.reload();s
    },
};

const dialog = reactive({
    selectItem: {},
    visible: false,
});
</script>

<style lang="less" scoped>
.permission-container {
    .ant-dropdown-trigger {
        margin-left: 12px;
    }

    :deep(.ant-table-cell) {
        .ant-btn-link {
            padding: 0;
        }
    }
}
</style>
