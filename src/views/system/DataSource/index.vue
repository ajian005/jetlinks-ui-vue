<template>
    <page-container>
        <div class="data-source-container">
            <pro-search
                :columns="columns"
                target="system-data-source"
                @search="(params:any)=>queryParams = {...params}"
            />
            <FullPage>
                <j-pro-table
                    ref="tableRef"
                    :columns="columns"
                    :request="getDataSourceList_api"
                    model="TABLE"
                    :params="queryParams"
                    :defaultParams="{
                        sorts: [{ name: 'createTime', order: 'desc' }],
                    }"
                >
                    <template #headerTitle>
                        <PermissionButton type="primary" :hasPermission="`${permission}:add`" @click="table.openDialog({})">
                            <AIcon type="PlusOutlined" />
                            {{ t('system.DataSource.index.5rkk8mo8z800') }}
                        </PermissionButton>
                    </template>
                    <template #state="slotProps">
                        <BadgeStatus :status="slotProps.state?.value" :text="slotProps.state?.text" :statusNames="{
                            enabled: 'processing',
                            disabled: 'error',
                        }">
                        </BadgeStatus>
                    </template>
                    <template #typeId="slotProps">
                        {{
                            (table.typeOptions.value.length &&
                                table.getTypeLabel(slotProps.typeId)) ||
                            ''
                        }}
                    </template>
                    <template #action="slotProps">
                        <j-space :size="16">
                            <PermissionButton :hasPermission="`${permission}:update`" type="link" :tooltip="{
                                title: t('system.DataSource.index.5rg9zyk73i40'),
                            }" @click="table.openDialog(slotProps)">
                                <AIcon type="EditOutlined" />
                            </PermissionButton>
                            <PermissionButton :hasPermission="`${permission}:manage`" type="link" :tooltip="{
                                title:
                                    slotProps?.typeId === 'rabbitmq'
                                        ? t('system.DataSource.index.5rg9zyk74gc0')
                                        : table.getRowStatus(slotProps)
                                            ? t('system.DataSource.index.5rg9zyk74nk0')
                                            : t('system.DataSource.index.5rg9zyk74t80'),
                            }" @click="() =>
    router.push(
        `/system/DataSource/Management?id=${slotProps.id}`,
    )
    " :disabled="slotProps?.typeId === 'rabbitmq' ||
        !table.getRowStatus(slotProps)
        ">
                                <AIcon type="icon-ziyuankuguanli" />
                            </PermissionButton>
                            <PermissionButton :hasPermission="`${permission}:action`" type="link" :popConfirm="{
                                title: t('system.DataSource.index.tip', {
                                    action: table.getRowStatus(slotProps)
                                        ? t('system.DataSource.index.5rg9zyk74yo0')
                                        : t('system.DataSource.index.5rg9zyk75780')
                                }),
                                onConfirm: () =>
                                    table.clickChangeStatus(slotProps),
                            }" :tooltip="{
    title: table.getRowStatus(slotProps)
        ? t('system.DataSource.index.5rg9zyk74yo0')
        : t('system.DataSource.index.5rg9zyk75780'),
}">
                                <AIcon :type="table.getRowStatus(slotProps)
                                    ? 'StopOutlined'
                                    : 'PlayCircleOutlined'
                                    " />
                                <!-- <AIcon type="PlayCircleOutlined" /> -->
                            </PermissionButton>

                            <PermissionButton :hasPermission="`${permission}:delete`" type="link" :tooltip="{
                                title: table.getRowStatus(slotProps)
                                    ? t('system.DataSource.index.5rg9zyk75cs0')
                                    : t('system.DataSource.index.5rg9zyk75i40'),
                            }" :danger="true" :popConfirm="{
    title: t('system.DataSource.index.deleteTip'),
    onConfirm: () => table.clickDel(slotProps),
}" :disabled="table.getRowStatus(slotProps)">
                                <AIcon type="DeleteOutlined" />
                            </PermissionButton>
                        </j-space>
                    </template>
                </j-pro-table>
            </FullPage>

            <EditDialog v-if="dialog.visible" @cancel="table.cancel" :data="dialog.selectItem" @confirm="table.refresh" />
        </div>
    </page-container>
</template>

<script setup lang="ts" name="DataSource">
import PermissionButton from '@/components/PermissionButton/index.vue';
import BadgeStatus from '@/components/BadgeStatus/index.vue';
import EditDialog from './components/EditDialog.vue';

import type { dictItemType, optionItemType, sourceItemType } from './typing';

import {
    getDataSourceList_api,
    getDataTypeDict_api,
    changeStatus_api,
    delDataSource_api,
} from '@/api/system/dataSource';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'
const { t } = useI18n();
const permission = 'system/DataSource';

const router = useRouter();

const columns = [
    {
        title: t('system.DataSource.index.5rg9zyk75nc0'),
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
        width: '250px',
    },
    {
        title: t('system.DataSource.index.5rg9zyk75ss0'),
        dataIndex: 'typeId',
        key: 'typeId',
        search: {
            type: 'select',
            options: () =>
                new Promise((resolve) => {
                    if (table.typeOptions.value.length > 0)
                        return resolve(table.typeOptions.value);
                    getDataTypeDict_api().then((resp: any) => {
                        const result = resp.result as dictItemType[];
                        resolve(
                            result.map((item) => ({
                                label: item.name,
                                value: item.id,
                            })),
                        );
                    });
                }),
        },
        scopedSlots: true,
    },
    {
        title: t('system.DataSource.index.5rg9zyk75xk0'),
        dataIndex: 'description',
        key: 'description',
        search: {
            type: 'string',
        },
        ellipsis: true,
    },
    {
        title: t('system.DataSource.index.5rg9zyk76340'),
        dataIndex: 'state',
        key: 'state',
        search: {
            type: 'select',
            options: [
                {
                    label: t('system.DataSource.index.5rg9zyk76880'),
                    value: 'enabled',
                },
                {
                    label: t('system.DataSource.index.5rg9zyk74yo0'),
                    value: 'disabled',
                },
            ],
        },
        scopedSlots: true,
        width: '120px',
    },
    {
        title: t('system.DataSource.index.5rg9zyk76d80'),
        dataIndex: 'action',
        key: 'action',
        scopedSlots: true,
        width: '160px',
        fixed: 'right',
    },
];
const queryParams = ref({});

const tableRef = ref<Record<string, any>>({}); // 表格实例
const table = {
    typeOptions: ref<optionItemType[]>([]),

    getTypeOption: () => {
        getDataTypeDict_api().then((resp: any) => {
            const result = resp.result as dictItemType[];
            table.typeOptions.value = result.map((item) => ({
                label: item.name,
                value: item.id,
            }));
        });
    },
    getTypeLabel: (val: string): string => {
        const options = table.typeOptions.value;
        if (options.length < 1 || val === '') return '';
        return options.find((item) => item.value === val)?.label || '';
    },

    getRowStatus: (row: sourceItemType) => {
        return row.state?.value === 'enabled';
    },
    // 打开编辑弹窗
    openDialog: (row: sourceItemType | {}) => {
        dialog.selectItem = { shareConfig: {}, ...row };
        dialog.visible = true;
    },
    // 删除
    clickDel: (row: sourceItemType) => {
        delDataSource_api(row.id as string).then((resp: any) => {
            if (resp.status === 200) {
                tableRef.value?.reload();
                onlyMessage(t('system.DataSource.index.5rg9zyk76i40'));
            }
        });
    },
    clickChangeStatus: (row: sourceItemType) => {
        const status = row.state.value === 'enabled' ? '_disable' : '_enable';

        changeStatus_api(row.id as string, status).then(() => {
            onlyMessage(t('system.DataSource.index.5rg9zyk76mo0'));
            table.refresh();
        });
    },
    // 刷新列表
    refresh: () => {
        tableRef.value.reload();
        dialog.visible = false;
        dialog.selectItem = {};
    },
    cancel: () => {
        dialog.visible = false;
        dialog.selectItem = {};
    },
};
table.getTypeOption();

const dialog = reactive({
    visible: false,
    selectItem: {} as any,
});
</script>

<style lang="less" scoped>
.data-source-container {
    :deep(.ant-table-cell) {
        .ant-btn-link {
            padding: 0;
        }
    }
}
</style>
