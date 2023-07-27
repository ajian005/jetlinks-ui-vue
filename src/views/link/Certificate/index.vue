<template>
    <page-container>
        <div>
            <pro-search
                :columns="columns"
                target="search-certificate"
                @search="handleSearch"
            />
            <FullPage>
                <j-pro-table
                    ref="tableRef"
                    model="TABLE"
                    :columns="columns"
                    :request="query"
                    :defaultParams="{
                        sorts: [{ name: 'createTime', order: 'desc' }],
                    }"
                    :params="params"
                >       
                    <template #headerTitle>
                        <PermissionButton
                            type="primary"
                            @click="handlAdd"
                            hasPermission="link/Certificate:add"
                        >
                            <template #icon
                                ><AIcon type="PlusOutlined"
                            /></template>
                            {{t('link.Certificate.index.5rg3ho1cvv00')}}
                        </PermissionButton>
                    </template>
                    <template #type="slotProps">
                        <span>{{ slotProps.type.text }}</span>
                    </template>
                    <template #action="slotProps">
                        <j-space>
                            <template
                                v-for="i in getActions(slotProps)"
                                :key="i.key"
                            >
                                <PermissionButton
                                    :disabled="i.disabled"
                                    :popConfirm="i.popConfirm"
                                    :tooltip="{
                                        ...i.tooltip,
                                    }"
                                    style="padding: 0px"
                                    @click="i.onClick"
                                    type="link"
                                    :danger="i.key === 'delete'"
                                    :hasPermission="'link/Certificate:' + i.key"
                                >
                                    <template #icon
                                        ><AIcon :type="i.icon"
                                    /></template>
                                </PermissionButton>
                            </template>
                        </j-space>
                    </template>
                </j-pro-table>
            </FullPage>
        </div>
    </page-container>
</template>
<script lang="ts" setup name="CertificatePage">
import type { ActionsType } from '@/components/Table/index';
import { query, remove } from '@/api/link/certificate';
import { onlyMessage } from '@/utils/comm';
import { useMenuStore } from 'store/menu';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const menuStory = useMenuStore();
const tableRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

const columns = [
    {
        title: t('link.Certificate.index.5rg3ho1cwq80'),
        dataIndex: 'type',
        key: 'type',
        fixed: 'left',
        width: 200,
        ellipsis: true,
        search: {
            type: 'select',
            options: [
                {
                    label: t('link.Certificate.index.5rg3ho1cwwk0'),
                    value: 'common',
                },
            ],
        },
        scopedSlots: true,
    },
    {
        title: t('link.Certificate.index.5rg3ho1cx100'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: t('link.Certificate.index.5rg3ho1cx580'),
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: t('link.Certificate.index.5rg3ho1cxa00'),
        key: 'action',
        fixed: 'right',
        width: 80,
        scopedSlots: true,
    },
];

const getActions = (data: Partial<Record<string, any>>): ActionsType[] => {
    if (!data) {
        return [];
    }
    return [
        // {
        //     key: 'view',
        //     text: '查看',
        //     tooltip: {
        //         title: '查看',
        //     },
        //     icon: 'EyeOutlined',
        //     onClick: async () => {
        //         handlEye(data.id);
        //     },
        // },
        {
            key: 'update',
            text: t('link.Certificate.index.5rg3ho1cxe40'),
            tooltip: {
                title: t('link.Certificate.index.5rg3ho1cxe40'),
            },
            icon: 'EditOutlined',
            onClick: async () => {
                handlEdit(data.id);
            },
        },
        {
            key: 'delete',
            text: t('link.Certificate.index.5rg3ho1cxhw0'),
            tooltip: {
                title: t('link.Certificate.index.5rg3ho1cxhw0'),
            },
            popConfirm: {
                title: t('link.Certificate.index.5rg3ho1cxo40'),
                okText: t('link.Certificate.index.5rh7zxrwi2o0'),
                cancelText: t('link.Certificate.index.5rg3ho1cxsc0'),
                onConfirm: async () => {
                    handlDelete(data.id);
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
};

const handlAdd = () => {
    menuStory.jumpPage(
        `link/Certificate/Detail`,
        { id: ':id' },
        { view: false },
    );
};

const handlEye = (id: string) => {
    menuStory.jumpPage(`link/Certificate/Detail`, { id }, { view: true });
};

const handlEdit = (id: string) => {
    menuStory.jumpPage(`link/Certificate/Detail`, { id }, { view: false });
};

const handlDelete = async (id: string) => {
    const res = await remove(id);
    if (res.success) {
        onlyMessage(t('link.Certificate.index.5rg3ho1cxwg0'), 'success');
        tableRef.value.reload();
    }
};

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    params.value = e;
};
</script>

<style lang="less" scoped></style>
