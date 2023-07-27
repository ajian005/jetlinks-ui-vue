<!-- 国标级联-绑定通道 -->
<template>
    <j-modal
        v-model:visible="_vis"
        :title="t('Channel.BindChannel.index.5rg8o1uw7ng0')"
        :cancelText="t('Channel.BindChannel.index.5rg8o1uwaug0')"
        :okText="t('Channel.BindChannel.index.5rg8o1uwcx40')"
        width="80%"
        @ok="handleSave"
        @cancel="_vis = false"
        :confirmLoading="loading"
    >
        <pro-search
            :columns="columns"
            target="media-bind"
            @search="handleSearch"
        />

        <JProTable
            ref="listRef"
            model="table"
            :columns="columns"
            :request="CascadeApi.queryChannelList"
            :defaultParams="{
                sorts: [{ name: 'deviceName', order: 'asc' }, { name: 'name', order: 'asc' }],
                terms: [
                    {
                        column: 'id',
                        termType: 'cascade_channel$not',
                        type: 'and',
                        value: route.query.id,
                    },
                    {
                        column: 'catalogType',
                        termType: 'eq',
                        type: 'and',
                        value: 'device',
                    },
                ],
            }"
            :params="params"
            :rowSelection="{
                selectedRowKeys: _selectedRowKeys,
                onSelectNone: onSelectNone,
                onSelect: onSelect,
                onSelectAll: onAllSelect,
            }"
        >
            <template #headerTitle>
                <h3>{{t('Channel.BindChannel.index.5rg8o1uwd940')}}</h3>
            </template>
            <template #status="slotProps">
                <j-space>
                    <j-badge
                        :status="
                            slotProps.status.value === 'online'
                                ? 'success'
                                : 'error'
                        "
                        :text="slotProps.status.text"
                    ></j-badge>
                </j-space>
            </template>
        </JProTable>
    </j-modal>
</template>

<script setup lang="ts">
import CascadeApi from '@/api/media/cascade';
import { onlyMessage } from '@/utils/comm';
import { PropType } from 'vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute();

type Emits = {
    (e: 'update:visible', data: boolean): void;
    (e: 'submit'): void;
};
const emit = defineEmits<Emits>();

const props = defineProps({
    visible: { type: Boolean, default: false },
    data: {
        type: Object as PropType<Partial<Record<string, any>>>,
        default: () => ({}),
    },
});

const _vis = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val),
});

watch(
    () => _vis.value,
    (val) => {
        if (val) handleSearch({ terms: [] });
        else _selectedRowKeys.value = [];
    },
);

const columns = [
    {
        title: t('Channel.BindChannel.index.5rg8o1uwdjg0'),
        dataIndex: 'deviceName',
        key: 'deviceName',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: t('Channel.BindChannel.index.5rg8o1uwf0w0'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: t('Channel.BindChannel.index.5rg8o1uwg100'),
        dataIndex: 'address',
        key: 'address',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: t('Channel.BindChannel.index.5rg8o1uwhv00'),
        dataIndex: 'manufacturer',
        key: 'manufacturer',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: t('Channel.BindChannel.index.5rg8o1uwirs0'),
        dataIndex: 'status',
        key: 'status',
        scopedSlots: true,
        width: 150,
        search: {
            type: 'select',
            options: [
                { label: t('Channel.BindChannel.index.5rg8o1uwj5w0'), value: 'online' },
                { label: t('Channel.BindChannel.index.5rg8o1uwk400'), value: 'offline' },
            ],
            handleValue: (v: any) => {
                return v;
            },
        },
    },
];

const params = ref<Record<string, any>>({});

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    params.value = e;
};

const listRef = ref();
const _selectedRowKeys = ref<string[]>([]);

const onSelectNone = () => {
    _selectedRowKeys.value = [];
};

const onSelect = (record: any, selected: boolean) => {
    const _set = new Set([..._selectedRowKeys.value])
    if (selected) {
        _set.add(record.id)
    } else {
        _set.delete(record.id)
    }
    _selectedRowKeys.value = [..._set]
};

const onAllSelect = (selected: boolean, _: any, keys: any[]) => {
    const _keys = keys.map(item => item.id) || []
    const _set = new Set([..._selectedRowKeys.value])
    _keys.map((i: any) => {
        if(selected) {
            _set.add(i)
        } else {
            _set.delete(i)
        }
    });
    _selectedRowKeys.value = [..._set]
};

const loading = ref(false);
const handleSave = async () => {
    if (!_selectedRowKeys.value.length) {
        onlyMessage(t('Channel.BindChannel.index.5rg8o1uwkik0'), 'error');
        return;
    }
    loading.value = true;
    const resp = await CascadeApi.bindChannel(
        route.query.id as string,
        _selectedRowKeys.value,
    );
    loading.value = false;
    if (resp.success) {
        onlyMessage(t('Channel.BindChannel.index.5rg8o1uwl0s0'));
        _vis.value = false;
        emit('submit');
    } else {
        onlyMessage(t('Channel.BindChannel.index.5rg8o1uwlao0'), 'error');
    }
};
</script>
