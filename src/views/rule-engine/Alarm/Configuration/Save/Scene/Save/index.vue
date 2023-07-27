<template>
    <j-modal
        visible
        :title="t('Scene.Save.index.5rg41y6hqh00')"
        :okText="t('Scene.Save.index.5rg41y6hrlc0')"
        :cancelText="t('Scene.Save.index.5rg41y6hrvo0')"
        :width="1000"
        @cancel="closeModal"
        @ok="saveCorrelation"
        :maskClosable="false"
    >
        <pro-search :columns="columns" @search="handleSearch" />
        <div style="height: 500px; overflow-y: auto">
            <JProTable
                model="CARD"
                :request="query"
                :rowSelection="{
                    selectedRowKeys: _selectedRowKeys,
                    onChange: onSelectChange
                }"
                :gridColumns="[1, 1, 1]"
                :defaultParams="{
                    sorts: [
                        {
                            name: 'createTime',
                            order: 'desc',
                        },
                    ],
                    terms,
                }"
                :params="params"
            >
                <template #card="slotProps">
                    <CardBox :value="slotProps" :status="slotProps.state?.value" :statusText="slotProps.state?.text"
                        :active="_selectedRowKeys.includes(slotProps.id)" @click="handleClick" :statusNames="{
                            started: 'processing',
                            disable: 'error',
                        }">
                        <template #type>
                            <span><img :height="16" :src="typeMap.get(slotProps.triggerType)?.icon
                                " style="margin-right: 5px" />{{
        typeMap.get(slotProps.triggerType)?.text
    }}</span>
                        </template>
                        <template #img>
                            <img :src="typeMap.get(slotProps.triggerType)?.img" />
                        </template>
                        <template #content>
                            <Ellipsis style="width: calc(100% - 100px)">
                                <span style="font-size: 16px; font-weight: 600">
                                    {{ slotProps.name }}
                                </span>
                            </Ellipsis>
                            <Ellipsis :lineClamp="2">
                                <div class="subTitle">
                                    {{ t('Scene.Save.index.5rg41y6hrvo0') +
                                        (slotProps?.description ||
                                            typeMap.get(slotProps.triggerType)?.tip)
                                    }}
                                </div>
                            </Ellipsis>
                        </template>
                    </CardBox>
                </template>
            </JProTable>
        </div>
    </j-modal>
</template>

<script lang="ts" setup>
import { query } from '@/api/rule-engine/scene';
import { bindScene } from '@/api/rule-engine/configuration';
import { getImage, onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const columns = [
    {
        title: '场景名称',
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'select',
            options: async () => {
              const res = await query(
                  {
                    sorts: [
                      {
                        name: 'createTime',
                        order: 'desc',
                      },
                    ],
                    terms: [
                      {
                        column: 'id',
                        termType: 'alarm-bind-rule$not',
                        value: props.id,
                        type: 'and',
                      },
                      {
                        column: 'triggerType',
                        termType: 'eq',
                        value: props.type === 'other' ? undefined : 'device',
                      },
                    ]
                  }
              );
              if (res.status === 200) {
                return res.result.data.map((item: any) => ({
                  label: item.name,
                  value: item.id,
                }));
              }
              return []
            }
        },
    },
    {
        title: t('Scene.Save.index.5rg41y6hsac0'),
        dataIndex: 'triggerType',
        key: 'triggerType',
        search: {
            type: 'select',
            options: [
                {
                    label: t('Scene.Save.index.5rg41y6hsi40'),
                    value: 'manual',
                },
                {
                    label: t('Scene.Save.index.5rg41y6hspc0'),
                    value: 'timer',
                },
                {
                    label: t('Scene.Save.index.5rg41y6hsvs0'),
                    value: 'device',
                },
            ],
        },
    },
    {
        title: t('Scene.Save.index.5rg41y6ht380'),
        dataIndex: 'state',
        key: 'state',
        search: {
            type: 'select',
            options: [
                {
                    label: t('Scene.Save.index.5rg41y6htcg0'),
                    value: 'started',
                },
                {
                    label: t('Scene.Save.index.5rg41y6htm80'),
                    value: 'disable',
                },
            ],
        },
    },
];
const props = defineProps({
    id: {
        type: String,
    },
    type: {
        type: String,
    },
});
const terms = [
    {
        terms: [
            {
                column: 'id',
                termType: 'alarm-bind-rule$not',
                value: props.id,
                type: 'and',
            },
            {
                column: 'triggerType',
                termType: 'eq',
                value: props.type === 'other' ? undefined : 'device',
            },
        ],
        type: 'and',
    },
];
const params = ref();
const typeMap = new Map();
typeMap.set('manual', {
    text: t('Scene.Save.index.5rg41y6hsi40'),
    img: getImage('/scene/scene-hand.png'),
    icon: getImage('/scene/trigger-type-icon/manual.png'),
    tip: t('Scene.Save.index.5rg41y6htt00'),
});
typeMap.set('timer', {
    text: t('Scene.Save.index.5rg41y6hspc0'),
    img: getImage('/scene/scene-timer.png'),
    icon: getImage('/scene/trigger-type-icon/timing.png'),
    tip: t('Scene.Save.index.5rg41y6htz00'),
});
typeMap.set('device', {
    text: t('Scene.Save.index.5rg41y6hsvs0'),
    img: getImage('/scene/scene-device.png'),
    icon: getImage('/scene/trigger-type-icon/device.png'),
    tip: t('Scene.Save.index.5rg41y6hu540'),
});
const _selectedRowKeys = ref<string[]>([]);
const handleClick = (dt: any) => {
    if (_selectedRowKeys.value.includes(dt.id)) {
        const _index = _selectedRowKeys.value.findIndex((i) => i === dt.id);
        _selectedRowKeys.value.splice(_index, 1);
    } else {
        _selectedRowKeys.value = [..._selectedRowKeys.value, dt.id];
    }
};
/**
 * 取消选择事件
 */
const onSelectChange = (arr: any[]) => {
    _selectedRowKeys.value = arr
};
const log = () => { };
log();
const handleSearch = (e: any) => {
    params.value = e;
};
const emit = defineEmits(['closeSave', 'saveScene']);
/**
 * 保存选中关联场景
 */
const saveCorrelation = async () => {
    if (_selectedRowKeys.value.length > 0) {
        const list = _selectedRowKeys.value.map((item: any) => {
            return {
                alarmId: props.id,
                ruleId: item,
            };
        });
        const res = await bindScene([...list]);
        if (res.status === 200) {
            onlyMessage(t('Scene.Save.index.5rg58exxb4k0'));
            emit('saveScene');
        }
    } else {
        onlyMessage(t('Scene.Save.index.5rg41y6huh00'), 'error');
    }
};
const closeModal = () => {
    emit('closeSave');
};
</script>
<style lang="less" scoped>
.subTitle {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    margin-top: 10px;
}
</style>