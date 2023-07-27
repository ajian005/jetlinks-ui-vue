<template>
    <page-container>
        <div class="role-container">
            <pro-search
                :columns="columns"
                target="system-role"
                @search="(params:any)=>queryParams = {...params}"
            />
            <FullPage>
                <j-pro-table
                    ref="tableRef"
                    :columns="columns"
                    :request="getRoleList_api"
                    model="TABLE"
                    :params="queryParams"
                    :defaultParams="{
                        sorts: [
                            { name: 'createTime', order: 'desc' },
                            { name: 'id', order: 'desc' },
                        ],
                    }"
                >
                    <template #headerTitle>
                        <PermissionButton
                            type="primary"
                            :hasPermission="`${permission}:add`"
                            @click="dialogVisible = true"
                        >
                            <AIcon type="PlusOutlined" />
                            {{t('system.Role.index.5rkjulbvr2k0')}}
                        </PermissionButton>
                    </template>

                    <template #action="slotProps">
                        <j-space :size="16">
                            <PermissionButton
                                :hasPermission="`${permission}:update`"
                                type="link"
                                :tooltip="{
                                    title: t('system.Role.index.5rkjulbvs5s0'),
                                }"
                                @click="
                                    jumpPage(`system/Role/Detail`, {
                                        id: slotProps.id,
                                    })
                                "
                            >
                                <AIcon type="EditOutlined" />
                            </PermissionButton>
                            <PermissionButton
                                type="link"
                                :hasPermission="`${permission}:delete`"
                                :tooltip="{ title: t('system.Role.index.5rkjulbvsf80') }"
                                :popConfirm="{
                                    title: t('system.Role.index.deleteTip'),
                                    onConfirm: () => clickDel(slotProps),
                                }"
                            >
                                <AIcon type="DeleteOutlined" />
                            </PermissionButton>
                        </j-space>
                    </template>
                </j-pro-table>
            </FullPage>

            <AddDialog v-if="dialogVisible" v-model:visible="dialogVisible" />
        </div>
    </page-container>
</template>

<script setup lang="ts" name="Role">
import PermissionButton from '@/components/PermissionButton/index.vue';
import AddDialog from './components/AddDialog.vue';
import { getRoleList_api, delRole_api } from '@/api/system/role';
import { useMenuStore } from '@/store/menu';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n() 
const permission = 'system/Role';
const { jumpPage } = useMenuStore();

const isSave = !!useRoute().query.save;

const columns = [
    {
        title: t('system.Role.index.5rkjulbvsm80'),
        dataIndex: 'id',
        key: 'id',
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'string',
        },
    },
    {
        title: t('system.Role.index.5rkjulbvst00'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: t('system.Role.index.5rkjulbvt0o0'),
        key: 'description',
        ellipsis: true,
        dataIndex: 'description',
        search: {
            type: 'string',
        },
    },
    {
        title: t('system.Role.index.5rkjulbvt7c0'),
        dataIndex: 'action',
        key: 'action',
        width: 120,
        fixed: 'right',
        scopedSlots: true,
    },
];
const queryParams = ref({});
// 表格
const tableRef = ref<Record<string, any>>();
const clickDel = (row: any) => {
    delRole_api(row.id).then((resp: any) => {
        if (resp.status === 200) {
            tableRef.value?.reload();
            onlyMessage(t('system.Role.index.5rkjulbvtd80'));
        }
    });
};
const dialogVisible = ref(isSave);
</script>

<style lang="less" scoped>
.role-container {
    :deep(.ant-table-cell) {
        .ant-btn-link {
            padding: 0;
        }
    }
}
</style>
