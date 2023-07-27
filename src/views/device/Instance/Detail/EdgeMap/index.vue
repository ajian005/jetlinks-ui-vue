<template>
    <j-spin :spinning="loading" v-if="metadata.properties?.length">
        <j-card :bordered="false" style="padding: 0">
            <template #extra>
                <j-space>
                    <j-button @click="visible = true">{{t('Detail.EdgeMap.index.5rcyhehog580')}}</j-button>
                    <j-button type="primary" @click="onSave">{{t('Detail.EdgeMap.index.5rcyhehohjo0')}}</j-button>
                </j-space>
            </template>
            <j-form ref="formRef" :model="modelRef">
                <j-table
                    :dataSource="modelRef.dataSource"
                    :columns="columns"
                    :pagination="false"
                >
                    <template #headerCell="{ column }">
                        <template v-if="column.key === 'collectorId'">
                            {{t('Detail.EdgeMap.index.5rcyhehohuc0')}}
                            <j-tooltip :title="t('Detail.EdgeMap.index.5rcyhehoi1s0')">
                                <AIcon type="QuestionCircleOutlined" />
                            </j-tooltip>
                        </template>
                    </template>
                    <template #bodyCell="{ column, record, index }">
                        <template v-if="column.dataIndex === 'metadataName'">
                            <span v-if="record.metadataName">{{ record.metadataName }}</span>
                            <span v-else style="color: red;">{{ record.metadataId }}</span>
                        </template>
                        <template v-if="column.dataIndex === 'channelId'">
                            <j-form-item
                                :name="['dataSource', index, 'channelId']"
                            >
                                <j-select
                                    style="width: 100%"
                                    v-model:value="record[column.dataIndex]"
                                    :placeholder="t('Detail.EdgeMap.index.5rcyhehoi8g0')"
                                    allowClear
                                    @change="
                                        () => onChannelChange(index, 'channel')
                                    "
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
                                        message: t('Detail.EdgeMap.index.5rcyhehoifk0'),
                                    },
                                ]"
                            >
                                <MSelect
                                    v-model="record[column.dataIndex]"
                                    :id="record.channelId"
                                    type="COLLECTOR"
                                    :edgeId="instanceStore.current.parentId"
                                    v-model:provider="record.provider"
                                    @change="
                                        onChannelChange(index, 'collector')
                                    "
                                />
                            </j-form-item>
                        </template>
                        <template v-if="column.dataIndex === 'pointId'">
                            <j-form-item
                                :name="['dataSource', index, 'pointId']"
                                :rules="[
                                    {
                                        required: !!record.channelId,
                                        message: t('Detail.EdgeMap.index.5rcyhehoilk0'),
                                    },
                                ]"
                            >
                                <MSelect
                                    v-model="record[column.dataIndex]"
                                    :id="record.collectorId"
                                    type="POINT"
                                    :edgeId="instanceStore.current.parentId"
                                />
                            </j-form-item>
                        </template>
                        <template v-if="column.dataIndex === 'id'">
                            <template v-if="record[column.dataIndex]">
                                <j-badge
                                    v-if="record.state.value === 'enabled'"
                                    status="success"
                                    :text="t('Detail.EdgeMap.index.5rcyhehoir40')"
                                />
                                <j-badge
                                    v-else
                                    status="warning"
                                    :text="t('Detail.EdgeMap.index.5rcyhehoix00')"
                                />
                            </template>
                            <j-badge v-else status="error" :text="t('Detail.EdgeMap.index.5rcyhehoj2o0')" />
                        </template>
                        <template v-if="column.key === 'action'">
                            <j-space>
                                <j-tooltip
                                    :title="
                                        isPermission
                                            ? t('Detail.EdgeMap.index.5rcyhehoj8c0')
                                            : t('Detail.EdgeMap.index.5rcyhehoje80')
                                    "
                                >
                                    <j-popconfirm
                                        :title="t('Detail.EdgeMap.index.5rcyhehojm80')"
                                        :disabled="!record.id || !isPermission"
                                        @confirm="unbind(record.id)"
                                    >
                                        <j-button
                                            type="link"
                                            :disabled="
                                                !record.id || !isPermission
                                            "
                                            style="padding: 0 5px"
                                        >
                                            <AIcon type="icon-jiebang" />
                                        </j-button>
                                    </j-popconfirm>
                                </j-tooltip>
                                <template v-if="record.id">
                                    <j-tooltip
                                        :title="
                                            isPermission
                                                ? record.state.value ===
                                                  'enabled'
                                                    ? t('Detail.EdgeMap.index.5rcyhehojrw0')
                                                    : t('Detail.EdgeMap.index.5rcyhehojxc0')
                                                : t('Detail.EdgeMap.index.5rcyhehoje80')
                                        "
                                    >
                                        <j-popconfirm
                                            :title="
                                                record.state.value === 'enabled'
                                                    ? t('Detail.EdgeMap.index.5rcyhehok2w0')
                                                    : t('Detail.EdgeMap.index.5rcyhehok8k0')
                                            "
                                            :disabled="!isPermission"
                                            @confirm="onAction(record)"
                                        >
                                            <j-button
                                                type="link"
                                                style="padding: 0 5px"
                                                :disabled="!isPermission"
                                            >
                                                <AIcon
                                                    v-if="
                                                        record.state.value ===
                                                        'enabled'
                                                    "
                                                    type="StopOutlined"
                                                />
                                                <AIcon
                                                    v-else
                                                    type="PlayCircleOutlined"
                                                />
                                            </j-button>
                                        </j-popconfirm>
                                    </j-tooltip>
                                </template>
                            </j-space>
                        </template>
                    </template>
                </j-table>
                <div class="pagination">
                    <j-pagination
                        v-model:pageSize="pageSize"
                        v-model:current="current"
                        :total="metadata?.properties?.length || 0"
                        @change="onPageChange"
                    />
                </div>
            </j-form>
        </j-card>
        <PatchMapping
            :deviceId="instanceStore.current.id"
            v-if="visible"
            @close="visible = false"
            @save="onPatchBind"
            :metaData="metadata.properties"
            :edgeId="instanceStore.current.parentId"
        />
    </j-spin>
    <j-card v-else :bordered="false" style="padding: 0">
        <JEmpty :description="t('Detail.EdgeMap.index.5rcyhehoke80')" style="margin: 10% 0" />
    </j-card>
</template>

<script lang="ts" setup name="EdgeMap">
import { useInstanceStore } from '@/store/instance';
import {
    getEdgeMap,
    saveEdgeMap,
    removeEdgeMap,
    edgeChannel,
} from '@/api/device/instance';
import MSelect from './MSelect.vue';
import PatchMapping from './PatchMapping.vue';
import { onlyMessage } from '@/utils/comm';
import { cloneDeep } from 'lodash-es';
import { usePermissionStore } from '@/store/permission';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const columns = [
    {
        title: t('Detail.EdgeMap.index.5rcyhehokjc0'),
        dataIndex: 'metadataName',
        key: 'metadataName',
        width: '20%',
    },
    {
        title: t('Detail.EdgeMap.index.5rcyhehokpc0'),
        dataIndex: 'channelId',
        key: 'channelId',
        width: '20%',
    },
    {
        title: t('Detail.EdgeMap.index.5rcyhehohuc0'),
        dataIndex: 'collectorId',
        key: 'collectorId',
        width: '20%',
    },
    {
        title: t('Detail.EdgeMap.index.5rcyhehokx40'),
        key: 'pointId',
        dataIndex: 'pointId',
        width: '20%',
    },
    {
        title: t('Detail.EdgeMap.index.5rcyhehol400'),
        key: 'id',
        dataIndex: 'id',
        width: '10%',
    },
    {
        title: t('Detail.EdgeMap.index.5rcyhehol9k0'),
        key: 'action',
        width: '10%',
    },
];

const permissionStore = usePermissionStore();

const isPermission = permissionStore.hasPermission('device/Instance:update');

const current = ref<number>(1);
const pageSize = ref<number>(10);

const instanceStore = useInstanceStore();
const metadata = JSON.parse(instanceStore.current?.metadata || '{}');
const loading = ref<boolean>(false);
const channelList = ref<any[]>([]);

const _properties = computed(() => {
    const _cur = current.value >= 1 ? current.value : 1;
    return metadata.properties?.slice((_cur - 1) * 10, _cur * 10) || [];
});

const modelRef = reactive<{
    dataSource: any[];
}>({
    dataSource: [],
});

const formRef = ref();
const visible = ref<boolean>(false);

const getChannel = async () => {
    if (instanceStore.current?.parentId) {
        const resp: any = await edgeChannel(instanceStore.current.parentId);
        if (resp.status === 200) {
            channelList.value = resp.result?.[0]?.map((item: any) => ({
                label: item.name,
                value: item.id,
                provider: item.provider,
            }));
        }
    }
};

const handleSearch = async (_array: any[]) => {
    loading.value = true;
    const _metadata: any[] = _array.map((item: any) => ({
        metadataId: item.id,
        metadataName: `${item.name}(${item.id})`,
        metadataType: 'property',
        name: item.name,
    }));
    if (_metadata && _metadata.length) {
        const resp: any = await getEdgeMap(
            instanceStore.current?.parentId || '',
            {
                deviceId: instanceStore.current.id,
                query: {},
            },
        ).catch(() => {
            modelRef.dataSource = _metadata;
            loading.value = false;
        });
        if (resp.status === 200) {
            const array = _metadata.map((item: any) => {
              const metadataId = resp.result?.[0].find((x: any) => x.metadataId === item.metadataId);
              Object.assign(item, metadataId);
              return item
            })
            // const array = resp.result?.[0].reduce((x: any, y: any) => {
            //     const metadataId = _metadata.find(
            //         (item: any) => item.metadataId === y.metadataId,
            //     );
            //     if (metadataId) {
            //         Object.assign(metadataId, y);
            //     } else {
            //         x.push(y);
            //     }
            //     return x;
            // }, _metadata);
            modelRef.dataSource = array;
        }
    }
    loading.value = false;
};

const unbind = async (id: string) => {
    const _deviceId = instanceStore.current.id;
    if (id && _deviceId) {
        const resp = await removeEdgeMap(
            instanceStore.current?.parentId || '',
            {
                deviceId: _deviceId,
                idList: [id],
            },
        );
        if (resp.status === 200) {
            onlyMessage(t('Detail.EdgeMap.index.5rcyhehole40'), 'success');
            handleSearch(_properties.value);
        }
    }
};

const onPatchBind = () => {
    visible.value = false;
    onRefresh();
};

const onChannelChange = (_index: number, type: 'collector' | 'channel') => {
    if (type === 'channel') {
        modelRef.dataSource[_index].collectorId = undefined;
        modelRef.dataSource[_index].pointId = undefined;
    } else {
        modelRef.dataSource[_index].pointId = undefined;
    }
};

onMounted(() => {
    getChannel();
    handleSearch(_properties.value);
});

const onPageChange = () => {
    handleSearch(_properties.value);
};

const onSave = () => {
    formRef.value
        .validate()
        .then(async (_data: any) => {
            const arr = toRaw(modelRef).dataSource.filter(
                (i: any) => i.channelId,
            );
            if (arr && arr.length !== 0) {
                const submitData = {
                    deviceId: instanceStore.current.id,
                    provider: (arr[0] as any)?.provider,
                    requestList: arr,
                };
                const resp = await saveEdgeMap(
                    instanceStore.current.parentId || '',
                    submitData,
                );
                if (resp.status === 200) {
                    onlyMessage(t('Detail.EdgeMap.index.5rcyhehole40'), 'success');
                    onRefresh();
                }
            }
        })
        .catch((err: any) => {
            console.log('error', err);
        });
};

const onAction = async (record: any) => {
    const array = (modelRef.dataSource || [])?.filter(
        (item: any) => item.channelId,
    );
    const findArray = array.find((item: any) => item.id === record?.id);
    const arr = {
        ...findArray,
        state: record?.state.value === 'enabled' ? 'disabled' : 'enabled',
    };
    const filterArray = array.filter((item: any) => item.id !== record?.id);
    const submitData = {
        deviceId: instanceStore.current.id,
        provider: array[0]?.provider,
        requestList: [...filterArray, arr],
    };
    const resp = await saveEdgeMap(
        instanceStore.current.parentId || '',
        submitData,
    );
    if (resp.status === 200) {
        onlyMessage(t('Detail.EdgeMap.index.5rcyhehole40'), 'success');
        onRefresh();
    }
};

const onRefresh = async () => {
    loading.value = true;
    if (modelRef.dataSource && modelRef.dataSource.length) {
        const resp: any = await getEdgeMap(
            instanceStore.current?.parentId || '',
            {
                deviceId: instanceStore.current.id,
                query: {},
            },
        ).catch(() => {
            loading.value = false;
        });
        if (resp.status === 200) {
            const arr = cloneDeep(modelRef.dataSource);
            const array = arr.map((x: any) => {
                const _item = resp.result?.[0].find(
                    (item: any) => item.metadataId === x.metadataId,
                );
                if (_item) {
                    return {
                        ...x,
                        ..._item,
                    };
                } else {
                    return x;
                }
            });
            modelRef.dataSource = array;
        }
    }
    loading.value = false;
};
</script>

<style lang="less" scoped>
:deep(.ant-form-item) {
    margin: 0 !important;
}

.pagination {
    display: flex;
    margin-top: 20px;
    width: 100%;
    justify-content: flex-end;
}
</style>