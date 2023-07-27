<template>
    <div class="button-mange-container">
        <j-pro-table
            ref="tableRef"
            :columns="table.columns"
            model="TABLE"
            :dataSource="table.tableData"
            noPagination
        >
            <template #headerTitle>
                <PermissionButton
                    type="primary"
                    :hasPermission="`${permission}:update`"
                    @click="openDialog('add', {})"
                >
                    <AIcon type="PlusOutlined" />
                    {{t('Menu.Detail.ButtonMange.5rkjy042lx40')}}
                </PermissionButton>
            </template>
            <template #action="slotProps">
                <j-space :size="16">
                    <PermissionButton
                        type="link"
                        :hasPermission="`${permission}:update`"
                        :tooltip="{ title: t('Menu.Detail.ButtonMange.5rg9pphvu7k0') }"
                        @click="openDialog('updata', slotProps)"
                    >
                        <AIcon type="EditOutlined" />
                    </PermissionButton>
                    <PermissionButton
                        type="link"
                        :hasPermission="`${permission}:view`"
                        :tooltip="{ title: t('Menu.Detail.ButtonMange.5rg9pphvv8s0') }"
                        @click="openDialog('view', slotProps)"
                    >
                        <AIcon type="SearchOutlined" />
                    </PermissionButton>
                    <PermissionButton
                        type="link"
                        :tooltip="{ title: t('Menu.Detail.ButtonMange.5rg9pphvvfg0') }"
                        :popConfirm="{
                            title: t('Menu.Detail.ButtonMange.deleteTip'),
                            onConfirm: () => table.clickDel(slotProps),
                        }"
                    >
                        <AIcon type="DeleteOutlined" />
                    </PermissionButton>
                </j-space>
            </template>
        </j-pro-table>

        <div class="dialog">
            <ButtonAddDialog
                v-if="dialogVisible"
                v-model:visible="dialogVisible"
                :menu-info="menuInfo"
                :mode="dialogTitle"
                :data="selectItem"
                @confirm="table.getList"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import PermissionButton from '@/components/PermissionButton/index.vue';
import ButtonAddDialog from '../components/ButtonAddDialog.vue';
import { getMenuInfo_api, saveMenuInfo_api } from '@/api/system/menu';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
type ModelType = 'add' | 'view' | 'updata' 
const permission = 'system/Menu';
// 路由
const route = useRoute();
const routeParams = reactive({
    id: route.params.id === ':id' ? '' : (route.params.id as string),
    ...route.query,
});
const paramsId = ref('');

// 弹窗相关
const selectItem = ref<any>({});
const dialogVisible = ref(false);
const dialogTitle = ref<ModelType>('add');
const openDialog = (mode: ModelType, row: object) => {
    if (!routeParams.id && !paramsId.value) {
        return onlyMessage(t('Menu.Detail.ButtonMange.5rg9pphvvkg0'), 'warning');
    }
    console.log(3);

    selectItem.value = { ...row };
    dialogTitle.value = mode;
    dialogVisible.value = true;
};
// 菜单的基本信息-其中包括了表格的数据
const menuInfo = ref<any>({});
// 表格相关
const table = reactive({
    columns: [
        {
            title: t('Menu.Detail.ButtonMange.5rg9pphvvp00'),
            dataIndex: 'id',
            key: 'id',
            width: 220,
        },
        {
            title: t('Menu.Detail.ButtonMange.5rg9pphvvu00'),
            dataIndex: 'name',
            key: 'name',
            width: 300,
        },
        {
            title: t('Menu.Detail.ButtonMange.5rg9pphvvy80'),
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: t('Menu.Detail.ButtonMange.5rg9pphvw280'),
            dataIndex: 'action',
            key: 'action',
            scopedSlots: true,
            width: 240,
        },
    ],
    tableData: [] as tableDataItem[],
    getList: () => {
        routeParams.id &&
            getMenuInfo_api(routeParams.id).then((resp: any) => {
                menuInfo.value = resp.result;
                table.tableData =
                    (resp.result?.buttons as tableDataItem[]) || [];
            });
    },
    clickDel: (row: tableDataItem) => {
        const buttons = menuInfo.value.buttons.filter(
            (item: tableDataItem) => item.id !== row.id,
        );
        const params = {
            ...menuInfo.value,
            buttons,
        };
        saveMenuInfo_api(params).then(() => {
            onlyMessage(t('Menu.Detail.ButtonMange.5rg9pphvw6k0'));
            table.getList();
        });
    },
});
table.getList();
type tableDataItem = {
    id: string;
    name: string;
    description?: string;
    permissions: object[];
};

watch(
    () => route.params.id,
    (value) => {
        if (!!value) {
            paramsId.value = value;
        }
    },
);
</script>

<style lang="less" scoped>
.button-mange-container {
    :deep(.ant-table-cell) {
        .ant-btn-link {
            padding: 0;
        }
    }
}
</style>
