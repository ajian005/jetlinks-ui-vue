<template>
    <page-container>
        <div class="user-container">
            <pro-search
                :columns="columns"
                target="system-user"
                @search="handleParams"
            />
            <FullPage>
                <j-pro-table
                    ref="tableRef"
                    :columns="columns"
                    :request="getUserList_api"
                    model="TABLE"
                    :params="queryParams"
                    :defaultParams="{
                        sorts: [{ name: 'createTime', order: 'desc' }],
                    }"
                >
                    <template #headerTitle>
                        <PermissionButton :hasPermission="`${permission}:add`" type="primary"
                            @click="table.openDialog('add')">
                            <AIcon type="PlusOutlined" />
                            {{t('system.User.index.5rkjhmivlto0')}}
                        </PermissionButton>
                    </template>
                    <template #type="slotProps">
                        {{ slotProps.type?.name }}
                    </template>
                    <template #status="slotProps">
                        <BadgeStatus :status="slotProps.status"
                            :text="slotProps.status ? t('system.User.index.5rg8tfgglf40') : t('system.User.index.5rg8tfggmow0')"
                            :statusNames="{
                                1: 'success',
                                0: 'error',
                            }"></BadgeStatus>
                    </template>
                    <template #action="slotProps">
                        <j-space :size="16">
                            <PermissionButton :hasPermission="`${permission}:update`" type="link" :tooltip="{
                                title: t('system.User.index.5rg8tfggmx40'),
                            }" @click="table.openDialog('edit', slotProps)">
                                <AIcon type="EditOutlined" />
                            </PermissionButton>
                            <PermissionButton :hasPermission="`${permission}:action`" type="link" :tooltip="{
                                title: `${slotProps.status ? t('system.User.index.5rg8tfggmow0') : t('system.User.index.5rg8tfggn1w0')}`,
                            }" :popConfirm="{
    title:t('system.User.index.verify',{stateText:slotProps.status ? t('system.User.index.5rg8tfggmow0') : t('system.User.index.5rg8tfggn1w0')}), onConfirm: () =>
        table.changeStatus(slotProps),
}">
                                <AIcon :type="slotProps.status
                                    ? 'StopOutlined'
                                    : 'PlayCircleOutlined'
                                    " />
                            </PermissionButton>
                            <PermissionButton :hasPermission="`${permission}:update`" type="link" :tooltip="{
                                title: t('system.User.index.5rg8tfggn5o0'),
                            }" @click="table.openDialog('reset', slotProps)">
                                <AIcon type="icon-zhongzhimima" />
                            </PermissionButton>
                            <PermissionButton type="link" :hasPermission="`${permission}:delete`" :tooltip="{
                                title: slotProps.status
                                    ? t('system.User.index.5rg8tfggne40')
                                    : t('system.User.index.5rg8tfggnlw0'),
                            }" :popConfirm="{
    title: t('system.User.index.deleteTip'),
    onConfirm: () =>
        table.clickDel(slotProps.id),
}" :disabled="slotProps.status">
                                <AIcon type="DeleteOutlined" />
                            </PermissionButton>
                        </j-space>
                    </template>
                </j-pro-table>
            </FullPage>

            <EditUserDialog v-if="dialog.visible" :type="dialog.type" v-model:visible="dialog.visible"
                :data="dialog.selectItem" @confirm="table.refresh" />
        </div>
    </page-container>
</template>

<script setup lang="ts" name="UserMange">
import PermissionButton from '@/components/PermissionButton/index.vue';
import EditUserDialog from './components/EditUserDialog.vue';
import {
    getUserType_api,
    getUserList_api,
    changeUserStatus_api,
    deleteUser_api,
} from '@/api/system/user';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const permission = 'system/User';

const columns = [
    {
        title: t('system.User.index.5rg8tfggnps0'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: t('system.User.index.5rg8tfggntg0'),
        dataIndex: 'username',
        key: 'username',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: t('system.User.index.5rg8tfggnww0'),
        dataIndex: 'type',
        key: 'type',
        ellipsis: true,
        search: {
            type: 'select',
            options: () =>
                new Promise((resolve) => {
                    getUserType_api().then((resp: any) => {
                        resolve(
                            resp.result.map((item: dictType) => ({
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
        title: t('system.User.index.5rg8tfggo040'),
        dataIndex: 'status',
        key: 'status',
        ellipsis: true,
        search: {
            rename: 'status',
            type: 'select',
            options: [
                {
                    label: t('system.User.index.5rg8tfgglf40'),
                    value: 1,
                },
                {
                    label: t('system.User.index.5rg8tfggmow0'),
                    value: 0,
                },
            ],
        },
        scopedSlots: true,
    },
    {
        title: t('system.User.index.5rg8tfggo6w0'),
        dataIndex: 'telephone',
        key: 'telephone',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: t('system.User.index.5rg8tfggoa80'),
        dataIndex: 'email',
        key: 'email',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: t('system.User.index.5rg8tfggodw0'),
        dataIndex: 'action',
        key: 'action',
        fixed: 'right',
        width: 150,
        scopedSlots: true,
    },
];
const queryParams = ref({});

const tableRef = ref<Record<string, any>>({}); // 表格实例
const table = {
    // 打开编辑弹窗
    openDialog: (type: modalType, row?: any) => {
        dialog.selectItem = { ...(row || {}) };
        dialog.type = type;
        dialog.visible = true;
    },
    changeStatus: ({ id, status }: any) => {
        const params = {
            status: status === 0 ? 1 : 0,
            id,
        };
        changeUserStatus_api(params).then(() => {
            onlyMessage(t('system.User.index.5rg8tfggoh80'));
            table.refresh();
        });
    },
    // 删除
    clickDel: (id: string) => {
        deleteUser_api(id).then(() => {
            onlyMessage(t('system.User.index.5rg8tfggoh80'));
            table.refresh();
        });
    },
    // 刷新列表
    refresh: () => {
        tableRef.value.reload();
    },
};

const dialog = reactive({
    selectItem: {},
    visible: false,
    type: '' as modalType,
});

type dictType = {
    id: string;
    name: string;
};
type modalType = '' | 'add' | 'edit' | 'reset';

const handleParams = (params: any) => {
    const newParams = (params?.terms as any[])?.map((item1) => {
        let arr: any[] = []
        item1.terms = item1.terms.map((item2: any) => {
            if (['telephone', 'email'].includes(item2.column)) {
                return {
                    column: 'id$user-detail',
                    value: [item2],
                };
            }
            if (['type'].includes(item2.column) && item2.value === 'other') {
                arr = [
                    {
                        ...item2,
                        type: 'or',
                        termType: 'isnull',
                        value: 1,
                    },
                    {
                        ...item2,
                        type: 'or',
                        termType: 'empty',
                        value: 1,
                    }
                ]
            }
            return item2;
        });
        if (arr.length) {
            item1.terms = [...item1.terms, ...arr]
        }
        return item1;
    });
    queryParams.value = { terms: newParams || [] };
};
</script>

<style lang="less" scoped>
.user-container {
    :deep(.ant-table-tbody) {
        .ant-table-cell {
            .ant-space-item {
                .ant-btn-link {
                    padding: 0;
                }
            }
        }
    }
}
</style>
