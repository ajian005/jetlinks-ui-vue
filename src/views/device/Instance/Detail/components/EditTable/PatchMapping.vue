<template>
    <j-modal
        width="900px"
        :title="t('components.EditTable.PatchMapping.5rcyeb76mkg0')"
        visible
        @ok="handleClick"
        @cancel="handleClose"
    >
        <div class="map-tree">
            <div class="map-tree-top">
                {{t('components.EditTable.PatchMapping.5rcyeb76o400')}}
            </div>
            <j-spin :spinning="loading">
                <div class="map-tree-content">
                    <j-card class="map-tree-content-card" :title="t('components.EditTable.PatchMapping.5rcyeb76ods0')">
                        <j-tree
                            checkable
                            :height="300"
                            :tree-data="dataSource"
                            :checkedKeys="checkedKeys"
                            @check="onCheck"
                        />
                    </j-card>
                    <div style="width: 100px">
                        <j-button
                            :disabled="rightList.length >= leftList.length"
                            @click="onRight"
                            >{{t('components.EditTable.PatchMapping.5rcyeb76ol80')}}</j-button
                        >
                    </div>
                    <j-card class="map-tree-content-card" :title="t('components.EditTable.PatchMapping.5rcyeb76oso0')">
                        <j-list
                            size="small"
                            :data-source="rightList"
                            class="map-tree-content-card-list"
                        >
                            <template #renderItem="{ item }">
                                <j-list-item>
                                    {{ item.title }}
                                    <template #actions>
                                        <j-popconfirm
                                            :title="t('components.EditTable.PatchMapping.5rcyeb76p6c0')"
                                            @confirm="_delete(item.key)"
                                        >
                                            <AIcon type="DeleteOutlined" />
                                        </j-popconfirm>
                                    </template>
                                </j-list-item>
                            </template>
                        </j-list>
                    </j-card>
                </div>
            </j-spin>
        </div>
    </j-modal>
</template>

<script lang="ts" setup>
import { treeMapping, saveMapping } from '@/api/device/instance';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const _props = defineProps({
    type: {
        type: String,
        default: 'MODBUS_TCP',
    },
    metaData: {
        type: Array,
        default: () => []
    },
    deviceId: {
        type: String,
        default: '',
    }
});
const _emits = defineEmits(['close', 'save']);

const checkedKeys = ref<string[]>([]);

const leftList = ref<any[]>([]);
const rightList = ref<any[]>([]);

const dataSource = ref<any[]>([]);
const loading = ref<boolean>(false);

const handleData = (data: any[], type: string) => {
    data.forEach((item) => {
        item.key = item.id;
        item.title = item.name;
        item.checkable = type === 'collectors';
        if (
            item.collectors &&
            Array.isArray(item.collectors) &&
            item.collectors.length
        ) {
            item.children = handleData(item.collectors, 'collectors');
        }
        if (item.points && Array.isArray(item.points) && item.points.length) {
            item.children = handleData(item.points, 'points');
        }
    });
    return data as any[];
};

const handleSearch = async () => {
    loading.value = true;
    const resp = await treeMapping({
        terms: [
            {
                column: 'provider',
                value: _props.type,
            },
        ],
    });
    loading.value = false;
    if (resp.status === 200) {
        dataSource.value = handleData(resp.result as any[], 'channel');
    }
};

const onCheck = (keys: string[], e: any) => {
    checkedKeys.value = [...keys];
    leftList.value = e?.checkedNodes || [];
};

const onRight = () => {
    rightList.value = leftList.value;
};

const _delete = (_key: string) => {
    const _index = rightList.value.findIndex((i) => i.key === _key);
    rightList.value.splice(_index, 1);
    checkedKeys.value = rightList.value.map((i) => i.key);
    leftList.value = rightList.value;
};

const handleClick = async () => {
    if (!rightList.value.length) {
        onlyMessage(t('components.EditTable.PatchMapping.5rcyeb76pd80'), 'warning');
    } else {
        const params: any[] = [];
        rightList.value.map((item: any) => {
            const array = (item.children || []).map((element: any) => ({
                channelId: item.parentId,
                collectorId: element.collectorId,
                pointId: element.id,
                metadataType: 'property',
                metadataId: (_props.metaData as any[]).find((i: any) => i.name === element.name)
                    ?.metadataId,
                provider: _props.type
            }));
            params.push(...array);
        });
        const filterParms = params.filter((item) => !!item.metadataId);
        if (filterParms && filterParms.length !== 0) {
            const res = await saveMapping(_props.deviceId, _props.type, filterParms);
            if (res.status === 200) {
                onlyMessage(t('components.EditTable.PatchMapping.5rcyeb76pkk0'));
                _emits('save');
            }
        } else {
            onlyMessage(t('components.EditTable.PatchMapping.5rcyeb76pww0'), 'error');
        }
    }
};
const handleClose = () => {
    _emits('close');
};

watchEffect(() => {
    if (_props.type) {
        handleSearch();
    }
});
</script>

<style lang="less" scoped>
.map-tree-content {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .map-tree-content-card {
        width: 350px;
        height: 400px;

        .map-tree-content-card-list {
            overflow-y: auto;
            height: 300px;
        }
    }
}
</style>