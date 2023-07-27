<template>
    <page-container>
        <div>
            <pro-search
                :columns="columns"
                target="search-firmware"
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
                            hasPermission="device/Firmware:add"
                        >
                            <template #icon
                                ><AIcon type="PlusOutlined"
                            /></template>
                            {{t('device.Firmware.index.5rg3o0pa74w0')}}
                        </PermissionButton>
                    </template>
                    <template #productId="slotProps">
                        <span>{{ slotProps.productName }}</span>
                    </template>
                    <template #createTime="slotProps">
                        <span>{{
                            dayjs(slotProps.createTime).format(
                                'YYYY-MM-DD HH:mm:ss',
                            )
                        }}</span>
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
                                    :hasPermission="'device/Firmware:' + i.key"
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
        <Save v-if="visible" :data="current" @change="saveChange" />
    </page-container>
</template>
<script lang="ts" setup name="FirmwarePage">
import type { ActionsType } from '@/components/Table/index';
import { query, queryProduct, remove } from '@/api/device/firmware';
import dayjs from 'dayjs';
import _ from 'lodash';
import Save from './Save/index.vue';
import { useMenuStore } from 'store/menu';
import type { FormDataType } from './type';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const menuStory = useMenuStore();

const tableRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

const productOptions = ref([]);
const visible = ref(false);
const current = ref({});

const columns = [
    {
        title: t('device.Firmware.index.5rg3o0pa84c0'),
        key: 'name',
        dataIndex: 'name',
        fixed: 'left',
        width: 200,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: t('device.Firmware.index.5rg3o0pa8ds0'),
        dataIndex: 'version',
        key: 'version',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: t('device.Firmware.index.5rg3o0pa8iw0'),
        dataIndex: 'productId',
        key: 'productId',
        ellipsis: true,
        width: 200,
        scopedSlots: true,
        search: {
            type: 'select',
            options: productOptions,
        },
    },
    {
        title: t('device.Firmware.index.5rg3o0pa8mw0'),
        dataIndex: 'signMethod',
        key: 'signMethod',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                {
                    label: 'MD5',
                    value: 'md5',
                },
                {
                    label: 'SHA256',
                    value: 'sha256',
                },
            ],
        },
        width: 150,
    },
    {
        title: t('device.Firmware.index.5rg3o0pa8sw0'),
        key: 'createTime',
        dataIndex: 'createTime',
        search: {
            type: 'date',
        },
        width: 200,
        scopedSlots: true,
    },
    {
        title: t('device.Firmware.index.5rg3o0pa8wk0'),
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },

    {
        title: t('device.Firmware.index.5rg3o0pa91s0'),
        key: 'action',
        fixed: 'right',
        width: 120,
        scopedSlots: true,
    },
];

const getActions = (data: Partial<Record<string, any>>): ActionsType[] => {
    if (!data) {
        return [];
    }
    return [
        {
            key: 'view',
            text: t('device.Firmware.index.5rg3o0pa9600'),
            tooltip: {
                title: t('device.Firmware.index.5rg3o0pa9600'),
            },
            icon: 'FileTextOutlined',
            onClick: async () => {
                handlUpdate(data);
            },
        },
        {
            key: 'update',
            text: t('device.Firmware.index.5rg3o0pa99k0'),
            tooltip: {
                title: t('device.Firmware.index.5rg3o0pa99k0'),
            },
            icon: 'EditOutlined',
            onClick: async () => {
                handlEdit(data);
            },
        },
        {
            key: 'delete',
            text: t('device.Firmware.index.5rg3o0pa9d00'),
            tooltip: {
                title: t('device.Firmware.index.5rg3o0pa9d00'),
            },
            popConfirm: {
                title: t('device.Firmware.index.5rg3o0pa9gs0'),
                okText: t('device.Firmware.index.5rh83xe7m2w0'),
                placement: 'topLeft',
                cancelText: t('device.Firmware.index.5rg3o0pa9k40'),
                onConfirm: async () => {
                    handlDelete(data.id);
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
};

const handlUpdate = (data: Partial<Record<string, any>>) => {
    menuStory.jumpPage(
        'device/Firmware/Task',
        {},
        {
            id: data.id,
            productId: data.productId,
        },
    );
};

const handlAdd = () => {
    current.value = {};
    visible.value = true;
};
const handlEdit = (data: Partial<Record<string, any>>) => {
    current.value = _.cloneDeep(data);
    visible.value = true;
};

const saveChange = (value: FormDataType) => {
    visible.value = false;
    current.value = {};
    if (value) {
        onlyMessage(t('device.Firmware.index.5rg3o0pa9o00'), 'success');
        tableRef.value.reload();
    }
};

const handlDelete = async (id: string) => {
    const res = await remove(id);
    if (res.status === 200) {
        onlyMessage(t('device.Firmware.index.5rg3o0pa9o00'), 'success');
        tableRef.value.reload();
    } else {
        onlyMessage(res?.message, 'error');
    }
};

onMounted(() => {
    queryProduct({
        paging: false,
        sorts: [{ name: 'name', order: 'desc' }],
        terms: [{ column: 'state', value: 1 }], // 不传参会报错，暂时查询启用状态的，后期会改查全部 todo
    }).then((resp: any) => {
        const list = resp.result.filter((it: any) => {
            return _.map(it?.features || [], 'id').includes('supportFirmware');
        });
        productOptions.value = list.map((item: any) => ({
            label: item.name,
            value: item.id,
        }));
    });
});

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    params.value = e;
};
</script>

<style lang="less" scoped></style>
