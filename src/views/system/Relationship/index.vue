<template>
    <page-container>
        <div class="relationship-container">
            <pro-search
                :columns="columns"
                target="system-relationship"
                @search="(params:any)=>queryParams = {...params}"
            />
            <FullPage>
                <j-pro-table
                    ref="tableRef"
                    :columns="columns"
                    :request="getRelationshipList_api"
                    model="TABLE"
                    :params="queryParams"
                    :defaultParams="{
                        sorts: [{ name: 'createTime', order: 'desc' }],
                    }"
                >
                    <template #headerTitle>
                        <PermissionButton type="primary" :hasPermission="`${permission}:add`"
                            @click="table.openDialog(undefined)">
                            <AIcon type="PlusOutlined" />
                            {{t('system.Relationship.index.5rg9wmwbz5k0')}}
                        </PermissionButton>
                    </template>
                    <template #action="slotProps">
                        <j-space :size="16">
                            <PermissionButton :hasPermission="`${permission}:update`" type="link" :tooltip="{
                                title: t('system.Relationship.index.5rg9wmwc0no0'),
                            }" @click="table.openDialog(slotProps)">
                                <AIcon type="EditOutlined" />
                            </PermissionButton>

                            <PermissionButton :danger="true" :hasPermission="`${permission}:delete`" type="link"
                                :tooltip="{ title: t('system.Relationship.index.5rg9wmwc0vk0') }" :popConfirm="{
                                    title: t('system.Relationship.index.deleteTip'),
                                    onConfirm: () => table.clickDel(slotProps),
                                }" :disabled="slotProps.status">
                                <AIcon type="DeleteOutlined" />
                            </PermissionButton>
                        </j-space>
                    </template>
                </j-pro-table>
            </FullPage>

            <EditDialog v-if="dialog.visible" v-model:visible="dialog.visible" :data="dialog.selectRow"
                @refresh="table.refresh" />
        </div>
    </page-container>
</template>

<script setup lang="ts" name="Relationship">
import PermissionButton from '@/components/PermissionButton/index.vue';
import {
    getRelationshipList_api,
    delRelation_api,
} from '@/api/system/relationship';
import EditDialog from './components/EditDialog.vue';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const permission = 'system/Relationship';

const columns = [
    {
        title: t('system.Relationship.index.5rg9wmwc1100'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'string',
        },
    },
    {
        title: t('system.Relationship.index.5rg9wmwc15g0'),
        dataIndex: 'objectTypeName',
        key: 'objectTypeName',
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'select',
            options: [
                {
                    label: t('system.Relationship.index.5rg9wmwc19s0'),
                    value: t('system.Relationship.index.5rg9wmwc19s0'),
                },
                {
                    label: t('system.Relationship.index.5rg9wmwc1e80'),
                    value: t('system.Relationship.index.5rg9wmwc1e80'),
                },
            ],
        },
    },
    {
        title: t('system.Relationship.index.5rg9wmwc1ik0'),
        dataIndex: 'targetTypeName',
        key: 'targetTypeName',
        ellipsis: true,
        fixed: 'left',
        search: {
            rename: 'targetType',
            type: 'select',
            options: [
                {
                    label: t('system.Relationship.index.5rg9wmwc19s0'),
                    value: 'user',
                },
            ],
        },
    },
    {
        title: t('system.Relationship.index.5rg9wmwc1ms0'),
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'string',
        },
    },
    {
        title: t('system.Relationship.index.5rg9wmwc1qs0'),
        dataIndex: 'action',
        key: 'action',
        scopedSlots: true,
        width: 100,
    },
];
const queryParams = ref({});

const tableRef = ref<Record<string, any>>({}); // 表格实例
const table = {
    // 打开编辑弹窗
    openDialog: (row: object | undefined = {}) => {
        dialog.selectRow = { ...row };
        dialog.visible = true;
    },
    // 删除
    clickDel: (row: any) => {
        delRelation_api(row.id).then((resp: any) => {
            if (resp.status === 200) {
                tableRef.value?.reload();
                onlyMessage(t('system.Relationship.index.5rg9wmwc1y00'));
            } else {
                onlyMessage(resp.message, 'error');
            }
        });
    },
    // 刷新列表
    refresh: () => {
        tableRef.value.reload();
    },
};

const dialog = reactive({
    selectRow: {} as any,
    visible: false,
});
</script>

<style lang="less" scoped>
.relationship-container {
    :deep(.ant-table-cell) {
        .ant-btn-link {
            padding: 0;
        }
    }
}
</style>
