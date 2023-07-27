<template>
    <div class="role-user-container">
        <pro-search
            :columns="columns"
            target="system-role-user"
            @search="(params:any)=>queryParams = {...params}"
        />

        <j-pro-table
            ref="tableRef"
            :columns="columns"
            :request="table.getList"
            model="TABLE"
            :params="queryParams"
            :rowSelection="{
                selectedRowKeys: selectedRowKeys,
                onChange: (keys:string[])=>selectedRowKeys = keys,
            }"
            size="small"
        >
            <template #headerTitle>
                <j-space>
                    <j-button type="primary" @click="dialogVisible = true">
                        <AIcon type="PlusOutlined" />
                        {{t('Detail.User.index.5rkjscuv3cs0')}}
                    </j-button>
                    <PermissionButton
                        :popConfirm="{
                            title: t('Detail.User.index.batchUntieTip'),
                            onConfirm: () => table.unbind(),
                        }"
                    >
                        <AIcon type="DisconnectOutlined" />
                        {{t('Detail.User.index.5rkjscuv4po0')}}
                    </PermissionButton>
                </j-space>
            </template>

            <template #status="slotProps">
                <BadgeStatus
                    :status="slotProps.status"
                    :text="slotProps.status ? t('Detail.User.index.5rkjrwlp1mw0') : t('Detail.User.index.5rkjrwlp3es0')"
                    :statusNames="{
                        1: 'success',
                        0: 'error',
                    }"
                ></BadgeStatus>
            </template>
            <template #createTime="slotProps">
                {{ dayjs(slotProps.createTime).format('YYYY-MM-DD HH:mm:ss') }}
            </template>

            <template #action="slotProps">
                <j-space :size="16">
                    <PermissionButton
                        type="link"
                        :tooltip="{ title: t('Detail.User.index.5rkjrwlp3v80') }"
                        :pop-confirm="{
                            title: t('Detail.User.index.untieTip'),
                            onConfirm: () => table.unbind([slotProps.id]),
                        }"
                    >
                        <AIcon type="DisconnectOutlined" />
                    </PermissionButton>
                </j-space>
            </template>
        </j-pro-table>

        <AddUserDialog
            v-if="dialogVisible"
            v-model:visible="dialogVisible"
            :role-id="roleId"
            @refresh="table.refresh"
        />
    </div>
</template>

<script setup lang="ts" name="RoleUser">
import PermissionButton from '@/components/PermissionButton/index.vue';
import AddUserDialog from '../components/AddUserDialog.vue';
import { getUserByRole_api, unbindUser_api } from '@/api/system/role';
import dayjs from 'dayjs';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n() 
const roleId = useRoute().params.id as string;

const columns = [
    {
        title: t('Detail.User.index.5rkjrwlp4300'),
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
    },
    {
        title: t('Detail.User.index.5rkjrwlp4ac0'),
        dataIndex: 'username',
        key: 'username',
        search: {
            type: 'string',
        },
    },
    {
        title: t('Detail.User.index.5rkjrwlp4i80'),
        dataIndex: 'createTime',
        key: 'createTime',
        search: {
            type: 'date',
        },
        scopedSlots: true,
    },
    {
        title: t('Detail.User.index.5rkjrwlp4po0'),
        dataIndex: 'status',
        key: 'status',
        search: {
            type: 'select',
            options: [
                {
                    label: t('Detail.User.index.5rkjrwlp1mw0'),
                    value: 1,
                },
                {
                    label: t('Detail.User.index.5rkjrwlp3es0'),
                    value: 0,
                },
            ],
        },
        scopedSlots: true,
    },
    {
        title: t('Detail.User.index.5rkjrwlp4ws0'),
        dataIndex: 'action',
        key: 'action',
        width: '200px',
        scopedSlots: true,
    },
];
const queryParams = ref({});

const tableRef = ref<Record<string, any>>({});
const selectedRowKeys = ref<string[]>([]);
const table = {
    getList: (oParams: any) => {
        const params = {
            ...oParams,
            terms: [
                {
                    terms: [
                        {
                            column: 'id$in-dimension$role',
                            value: roleId,
                        },
                    ],
                },
            ],
        };
        if (oParams.terms[0])
            params.terms.unshift({
                terms: oParams.terms[0].terms,
            });
        return getUserByRole_api(params);
    },
    // 批量解绑
    unbind: (ids?: string[]) => {
        const data = ids ? ids : selectedRowKeys.value;
        if (!data.length) {
            onlyMessage(t('Detail.User.index.5rkjrwlp54g0'), 'warning');
            return;
        }
        unbindUser_api(roleId, data).then((resp) => {
            if (resp.status === 200) {
                onlyMessage(t('Detail.User.index.5rkjrwlp5b00'));
                table.refresh();
            }
        });
    },
    // 刷新表格
    refresh: () => {
        tableRef.value.reload();
        selectedRowKeys.value = [];
    },
};

// 弹窗相关
const dialogVisible = ref(false);

</script>

<style lang="less" scoped>
.role-user-container {
    background-color: #fff;

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
