<template>
    <j-spin :spinning="loading" v-if="metadata.properties.length">
        <j-card :bordered="false" borderStyle="padding: 0">
            <template #extra>
                <j-space>
                    <j-button @click="visible = true">{{t('components.EditTable.index.5rcye0hx8mw0')}}</j-button>
                    <j-button type="primary" @click="onSave">{{t('components.EditTable.index.5rcye0hxb7c0')}}</j-button>
                </j-space>
            </template>
            <j-form ref="formRef" :model="modelRef">
                <j-table :dataSource="modelRef.dataSource" :columns="columns">
                    <template #headerCell="{ column }">
                        <template v-if="column.key === 'collectorId'">
                            {{t('components.EditTable.index.5rcye0hxbiw0')}}
                            <j-tooltip :title="t('components.EditTable.index.5rcye0hxbvc0')">
                                <AIcon type="QuestionCircleOutlined" />
                            </j-tooltip>
                        </template>
                    </template>
                    <template #bodyCell="{ column, record, index }">
                        <template v-if="column.dataIndex === 'channelId'">
                            <j-form-item
                                :name="['dataSource', index, 'channelId']"
                            >
                                <j-select
                                    style="width: 100%"
                                    v-model:value="record[column.dataIndex]"
                                    :placeholder="t('components.EditTable.index.5rcye0hxc2c0')"
                                    allowClear
                                    :filter-option="filterOption"
                                >
                                    <j-select-option
                                        v-for="item in channelList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"
                                        >{{ item.label }}</j-select-option
                                    >
                                </j-select>
                            </j-form-item>
                        </template>
                        <template v-if="column.dataIndex === 'collectorId'">
                            <j-form-item
                                :name="['dataSource', index, 'collectorId']"
                                :rules="[
                                    {
                                        required: !!record.channelId,
                                        message: t('components.EditTable.index.5rcye0hxca80'),
                                    },
                                ]"
                            >
                                <MSelect
                                    v-model="record[column.dataIndex]"
                                    :id="record.channelId"
                                    type="COLLECTOR"
                                />
                            </j-form-item>
                        </template>
                        <template v-if="column.dataIndex === 'pointId'">
                            <j-form-item
                                :name="['dataSource', index, 'pointId']"
                                :rules="[
                                    {
                                        required: !!record.channelId,
                                        message: t('components.EditTable.index.5rcye0hxcgk0'),
                                    },
                                ]"
                            >
                                <MSelect
                                    v-model="record[column.dataIndex]"
                                    :id="record.collectorId"
                                    type="POINT"
                                />
                            </j-form-item>
                        </template>
                        <template v-if="column.dataIndex === 'id'">
                            <j-badge
                                v-if="record[column.dataIndex]"
                                status="success"
                                :text="t('components.EditTable.index.5rcye0hxcmk0')"
                            />
                            <j-badge v-else status="error" :text="t('components.EditTable.index.5rcye0hxcsw0')" />
                        </template>
                        <template v-if="column.key === 'action'">
                            <j-tooltip :title="t('components.EditTable.index.5rcye0hxcyk0')">
                                <j-popconfirm
                                    :title="t('components.EditTable.index.5rcye0hxd680')"
                                    :disabled="!record.id"
                                    @confirm="unbind(record.id)"
                                >
                                    <j-button type="link" :disabled="!record.id"
                                        ><AIcon type="icon-jiebang"
                                    /></j-button>
                                </j-popconfirm>
                            </j-tooltip>
                        </template>
                    </template>
                </j-table>
            </j-form>
        </j-card>
        <PatchMapping
            :deviceId="instanceStore.current.id"
            v-if="visible"
            @close="visible = false"
            @save="onPatchBind"
            :type="provider"
            :metaData="modelRef.dataSource"
        />
    </j-spin>
    <j-card v-else :bordered="false" borderStyle="padding: 0">
        <JEmpty :description="t('components.EditTable.index.5rcye0hxdd00')" style="margin: 10% 0" />
    </j-card>
</template>

<script lang="ts" setup>
import { useInstanceStore } from '@/store/instance';
import {
    queryMapping,
    saveMapping,
    removeMapping,
    queryChannelNoPaging,
} from '@/api/device/instance';
import MSelect from '../MSelect.vue';
import PatchMapping from './PatchMapping.vue';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const columns = [
    {
        title: t('components.EditTable.index.5rcye0hxdj00'),
        dataIndex: 'metadataName',
        key: 'metadataName',
        width: '20%',
    },
    {
        title: t('components.EditTable.index.5rcye0hxdtw0'),
        dataIndex: 'channelId',
        key: 'channelId',
        width: '20%',
    },
    {
        title: t('components.EditTable.index.5rcye0hxbiw0'),
        dataIndex: 'collectorId',
        key: 'collectorId',
        width: '20%',
    },
    {
        title: t('components.EditTable.index.5rcye0hxe480'),
        key: 'pointId',
        dataIndex: 'pointId',
        width: '20%',
    },
    {
        title: t('components.EditTable.index.5rcye0hxeao0'),
        key: 'id',
        dataIndex: 'id',
        width: '10%',
    },
    {
        title: t('components.EditTable.index.5rcye0hxehc0'),
        key: 'action',
        width: '10%',
    },
];

const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const props = defineProps({
    provider: {
        type: String,
        default: 'MODBUS_TCP',
    },
});

const instanceStore = useInstanceStore();
const metadata = JSON.parse(instanceStore.current?.metadata || '{}');
const loading = ref<boolean>(false);
const channelList = ref([]);

const modelRef = reactive({
    dataSource: [],
});

const formRef = ref();
const visible = ref<boolean>(false);

const getChannel = async () => {
    const resp: any = await queryChannelNoPaging({
        paging: false,
        terms: [
            {
                terms: [
                    {
                        column: 'provider',
                        value: props.provider,
                    },
                ],
            },
        ],
    });
    if (resp.status === 200) {
        channelList.value = resp.result?.map((item: any) => ({
            label: item.name,
            value: item.id,
            provider: item.provider,
        }));
    }
};

const handleSearch = async () => {
    loading.value = true;
    getChannel();
    const _metadata = metadata.properties.map((item: any) => ({
        metadataId: item.id,
        metadataName: `${item.name}(${item.id})`,
        metadataType: 'property',
        name: item.name,
    }));
    if (_metadata && _metadata.length) {
        const resp: any = await queryMapping(
            'device',
            instanceStore.current.id,
        );
        if (resp.status === 200) {
            const array = resp.result.reduce((x: any, y: any) => {
                const metadataId = _metadata.find(
                    (item: any) => item.metadataId === y.metadataId,
                );
                if (metadataId) {
                    Object.assign(metadataId, y);
                } else {
                    x.push(y);
                }
                return x;
            }, _metadata);
            modelRef.dataSource = array;
        }
    }
    loading.value = false;
};

const unbind = async (id: string) => {
    if (id) {
        const resp = await removeMapping('device', instanceStore.current.id, [
            id,
        ]);
        if (resp.status === 200) {
            onlyMessage(t('components.EditTable.index.5rcye0hxeo80'));
            handleSearch();
        }
    }
};

const onPatchBind = () => {
    visible.value = false;
    handleSearch();
};

onMounted(() => {
    handleSearch();
});

const onSave = () => {
    formRef.value
        .validate()
        .then(async () => {
            const arr = toRaw(modelRef).dataSource.filter(
                (i: any) => i.channelId,
            );
            if (arr && arr.length !== 0) {
                const resp = await saveMapping(
                    instanceStore.current.id,
                    props.provider,
                    arr,
                );
                if (resp.status === 200) {
                    onlyMessage(t('components.EditTable.index.5rcye0hxeo80'));
                    handleSearch();
                }
            }
        })
        .catch((err: any) => {
            console.log('error', err);
        });
};
</script>

<style lang="less" scoped>
:deep(.ant-form-item) {
    margin: 0 !important;
}
</style>