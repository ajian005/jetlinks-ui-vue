<template>
    <page-container>
        <div>
            <pro-search
                :columns="columns"
                target="search-configuration"
                @search="handleSearch"
            />
            <FullPage>
                <JProTable
                    :columns="columns"
                    :request="queryList"
                    :gridColumn="3"
                    :gridColumns="[1, 2, 3]"
                    ref="tableRef"
                    :defaultParams="{
                        sorts: [{ name: 'createTime', order: 'desc' }],
                    }"
                    :params="params"
                >
                    <template #headerTitle>
                        <j-space>
                            <PermissionButton
                                type="primary"
                                @click="add"
                                hasPermission="rule-engine/Alarm/Configuration:add"
                            >
                                <template #icon
                                    ><AIcon type="PlusOutlined"
                                /></template>
                                {{t('Alarm.Configuration.index.5rg42zhpamw0')}}
                            </PermissionButton>
                        </j-space>
                    </template>
                    <template #card="slotProps">
                        <CardBox
                            :value="slotProps"
                            :actions="getActions(slotProps, 'card')"
                            v-bind="slotProps"
                            :status="slotProps.state?.value"
                            :statusText="slotProps.state?.text"
                            :statusNames="{
                                enabled: 'processing',
                                disabled: 'error',
                            }"
                            @click="
                                () => {
                                    menuStory.jumpPage(
                                        'rule-engine/Alarm/Configuration/Save',
                                        {},
                                        { id: slotProps.id },
                                    );
                                }
                            "
                        >
                            <template #img>
                                <slot name="img">
                                    <img
                                        :src="
                                            getImage('/alarm/alarm-config.png')
                                        "
                                    />
                                </slot>
                            </template>
                            <template #content>
                                <Ellipsis style="width: calc(100% - 100px)">
                                    <span
                                        style="
                                            font-weight: 600;
                                            font-size: 16px;
                                        "
                                    >
                                        {{ slotProps.name }}
                                    </span>
                                </Ellipsis>
                                <j-row>
                                    <j-col :span="12">
                                        <div class="content-des-title">
                                            {{t('Alarm.Configuration.index.5rg42zhpbjk0')}}
                                        </div>
                                        <Ellipsis style='margin-bottom: 18px;'
                                            ><div>
                                                {{ (slotProps?.scene || []).map((item: any) => item?.name).join(',') || '' }}
                                            </div></Ellipsis
                                        >
                                    </j-col>
                                    <j-col :span="12">
                                        <div class="content-des-title">
                                            {{t('Alarm.Configuration.index.5rg42zhpboo0')}}
                                        </div>
                                        <div>
                                            {{ (defaultLevel || []).find((item: any) => item?.level === slotProps.level)?.title ||
            slotProps.level }}
                                        </div>
                                    </j-col>
                                </j-row>
                            </template>
                            <template #actions="item">
                                <PermissionButton
                                    :disabled="item.disabled"
                                    :popConfirm="item.popConfirm"
                                    :tooltip="{ ...item.tooltip }"
                                    @click="item.onClick"
                                    :hasPermission="
                                        'rule-engine/Alarm/Configuration:' +
                                        item.key
                                    "
                                >
                                    <AIcon
                                        type="DeleteOutlined"
                                        v-if="item.key === 'delete'"
                                    />
                                    <template v-else>
                                        <AIcon :type="item.icon" />
                                        <span>{{ item?.text }}</span>
                                    </template>
                                </PermissionButton>
                            </template>
                        </CardBox>
                    </template>
                    <template #targetType="slotProps">
                        <span>{{ map[slotProps.targetType] }}</span>
                    </template>
                    <template #level="slotProps">
                        <j-tooltip
                            placement="topLeft"
                            :title="(defaultLevel || []).find((item) => item?.level === slotProps.level)?.title ||
            slotProps.level"
                        >
                            <div class="ellipsis">
                                {{ (defaultLevel || []).find((item) => item?.level === slotProps.level)?.title ||
            slotProps.level }}
                            </div>
                        </j-tooltip>
                    </template>
                    <template #scene="slotProps">
                        <span
                            >{{(slotProps?.scene || []).map((item) => item?.name).join(',') || ''}}</span
                        >
                    </template>
                    <template #state="slotProps">
                        <BadgeStatus
                            :text="
                                slotProps.state?.value === 'enabled'
                                    ? t('Alarm.Configuration.index.5rg42zhpbsw0')
                                    : t('Alarm.Configuration.index.5rg42zhpbww0')
                            "
                            :status="slotProps.state?.value"
                            :statusNames="{
                                enabled: 'processing',
                                disabled: 'error',
                            }"
                        />
                    </template>
                    <template #action="slotProps">
                        <j-space :size="16">
                            <template
                                v-for="i in getActions(slotProps, 'table')"
                                :key="i.key"
                            >
                                <PermissionButton
                                    :disabled="i.disabled"
                                    :popConfirm="i.popConfirm"
                                    :tooltip="{
                                        ...i.tooltip,
                                    }"
                                    @click="i.onClick"
                                    type="link"
                                    style="padding: 0px"
                                    :hasPermission="
                                        'rule-engine/Alarm/Configuration:' +
                                        i.key
                                    "
                                    :danger="i.key === 'delete'"
                                >
                                    <template #icon
                                        ><AIcon :type="i.icon"
                                    /></template>
                                </PermissionButton>
                            </template>
                        </j-space>
                    </template>
                </JProTable>
            </FullPage>
        </div>
    </page-container>
    <HandTrigger @save="onSave" @close="visible = false" v-if="visible" :data="current" />
</template>

<script lang="ts" setup>
import {
    queryList,
    _enable,
    _disable,
    remove,
    getScene,
} from '@/api/rule-engine/configuration';
import { queryLevel } from '@/api/rule-engine/config';
import type { ActionsType } from '@/components/Table/index.vue';
import { getImage, onlyMessage } from '@/utils/comm';
import { useMenuStore } from '@/store/menu';
import encodeQuery from '@/utils/encodeQuery';
import HandTrigger from './HandTrigger/index.vue';

import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const params = ref<Record<string, any>>({});
let isAdd = ref<number>(0);
let title = ref<string>('');
const tableRef = ref<Record<string, any>>({});
const menuStory = useMenuStore();
const columns = [
    {
        title: '配置名称',
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
        width: 220,
        ellipsis: true,
    },
    {
        title: t('Alarm.Configuration.index.5rg42zhpc5c0'),
        dataIndex: 'targetType',
        key: 'targetType',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                {
                    label: t('Alarm.Configuration.index.5rg42zhpc8w0'),
                    value: 'product',
                },
                {
                    label: t('Alarm.Configuration.index.5rg42zhpccc0'),
                    value: 'device',
                },
                {
                    label: t('Alarm.Configuration.index.5rg42zhpci80'),
                    value: 'org',
                },
                {
                    label: t('Alarm.Configuration.index.5rg42zhpcls0'),
                    value: 'other',
                },
            ],
        },
        width: 100,
    },
    {
        title: t('Alarm.Configuration.index.5rg42zhpboo0'),
        dataIndex: 'level',
        key: 'level',
        scopedSlots: true,
        search: {
            type: 'select',
            options: async () => {
                const res = await queryLevel();
                if (res.status === 200) {
                    return (res?.result?.levels || [])
                        .filter((i: any) => i?.level && i?.title)
                        .map((item: any) => ({
                            label: item.title,
                            value: item.level,
                        }));
                }
                return [];
            },
        },
        width: 200,
        ellipsis: true,
    },
    {
        title: t('Alarm.Configuration.index.5rg42zhpbjk0'),
        dataIndex: 'scene',
        scopedSlots: true,
        key: 'scene',
        search: {
            type: 'select',
            // defaultTermType: 'rule-bind-alarm',
            options: async () => {
                const allData = await queryList({paging: false, sorts: [{ name: 'createTime', order: 'desc' }]})
                const result = allData.result?.data as any[]
                if (allData.success && result && result.length) {
                  const sceneDataMap = new Map() // 用于去重
                  result.forEach(item => {
                    item.scene.forEach((a: any) => {
                      sceneDataMap.set(a.id, {
                        label: a.name,
                        value: a.id
                      })
                    })
                  })

                  return [...sceneDataMap.values()]
                }

                // const res = await getScene(
                //     encodeQuery({
                //         sorts: { createTime: 'desc' },
                //     }),
                // );
                // if (res.status === 200) {
                //     return res.result.map((item: any) => ({
                //         label: item.name,
                //         value: item.id,
                //     }));
                // }
                return [];
            },
        },
        width: 220,
        ellipsis: true,
    },
    {
        title: t('Alarm.Configuration.index.5rg42zhpcpc0'),
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                {
                    label: t('Alarm.Configuration.index.5rg42zhpbsw0'),
                    value: 'enabled',
                },
                {
                    label: t('Alarm.Configuration.index.5rg42zhpbww0'),
                    value: 'disabled',
                },
            ],
        },
        width: 90,
    },
    {
        title: t('Alarm.Configuration.index.5rg42zhpcso0'),
        dataIndex: 'description',
        key: 'description',
        search: {
            type: 'string',
        },
        ellipsis: true,
    },
    {
        title: t('Alarm.Configuration.index.5rg42zhpcw80'),
        key: 'action',
        fixed: 'right',
        width: 120,
        scopedSlots: true,
    },
];
const visible = ref<boolean>(false);
const current = ref<any>({});

const defaultLevel = ref<any[]>([]);

const map = {
    product: t('Alarm.Configuration.index.5rg42zhpc8w0'),
    device: t('Alarm.Configuration.index.5rg42zhpccc0'),
    org: t('Alarm.Configuration.index.5rg42zhpci80'),
    other: t('Alarm.Configuration.index.5rg42zhpcls0'),
};
const handleSearch = (e: any) => {
    const _terms = (e?.terms || []).map((item: any) => {
        item.terms = item.terms.map((i: any) => {
            if(i.column === 'scene'){
                return {
                    ...i,
                    termType: 'rule-bind-alarm',
                    column: 'id'
                }
            }
            return i
        })
        return item
    })
    params.value = {
        ...e,
        terms: _terms
    }
};
const queryDefaultLevel = () => {
    queryLevel().then((res) => {
        if (res.status === 200) {
            defaultLevel.value = res.result?.levels || [];
        }
    });
};
queryDefaultLevel();
const getActions = (
    data: Partial<Record<string, any>>,
    type?: 'card' | 'table',
): ActionsType[] => {
    if (!data) {
        return [];
    }
    const actions = [
        {
            key: 'tigger',
            text: t('Alarm.Configuration.index.5rg42zhpczk0'),
            disabled: data?.state?.value === 'disabled',
            tooltip: {
                title:
                    data?.state?.value === 'disabled'
                        ? t('Alarm.Configuration.index.5rg42zhpd2k0')
                        : t('Alarm.Configuration.index.5rg42zhpczk0'),
            },
            onClick: () => {
                visible.value = true;
                current.value = data
            },
            icon: 'LikeOutlined',
        },
        {
            key: 'update',
            text: t('Alarm.Configuration.index.5rg42zhpdkc0'),
            tooltip: {
                title: t('Alarm.Configuration.index.5rg42zhpdkc0'),
            },

            icon: 'EditOutlined',
            onClick: () => {
                menuStory.jumpPage(
                    'rule-engine/Alarm/Configuration/Save',
                    {},
                    { id: data.id },
                );
            },
        },
        {
            key: 'action',
            text: data.state?.value !== 'disabled' ? t('Alarm.Configuration.index.5rg42zhpbww0') : t('Alarm.Configuration.index.5rg42zhpdto0'),
            tooltip: {
                title: data.state?.value !== 'disabled' ? t('Alarm.Configuration.index.5rg42zhpbww0') : t('Alarm.Configuration.index.5rg42zhpdto0'),
            },
            icon:
                data.state?.value !== 'disabled'
                    ? 'StopOutlined'
                    : 'CheckCircleOutlined',
            popConfirm: {
                title: `${
                    data.state?.value !== 'disabled'
                        ? t('Alarm.Configuration.index.5rg42zhpdxs0')
                        : t('Alarm.Configuration.index.5rg42zhpe2g0')
                }?`,
                onConfirm: async () => {
                    let response = undefined;
                    if (data.state?.value === 'disabled') {
                        response = await _enable(data.id);
                    } else {
                        response = await _disable(data.id);
                    }
                    if (response && response.status === 200) {
                        onlyMessage(t('Alarm.Configuration.index.5rg42zhpe680'));
                        tableRef.value?.reload();
                    } else {
                        onlyMessage(t('Alarm.Configuration.index.5rg42zhpe9w0'), 'error');
                    }
                },
            },
        },
        {
            key: 'delete',
            text: t('Alarm.Configuration.index.5rg42zhpee00'),
            disabled: data?.state?.value !== 'disabled',
            tooltip: {
                title:
                    data?.state?.value !== 'disabled'
                        ? t('Alarm.Configuration.index.5rg42zhpehw0')
                        : t('Alarm.Configuration.index.5rg42zhpee00'),
                placement:"topLeft"
            },
            popConfirm: {
                title: t('Alarm.Configuration.index.5rg42zhpels0'),
                onConfirm: async () => {
                    const resp = await remove(data.id);
                    if (resp.status === 200) {
                        onlyMessage(t('Alarm.Configuration.index.5rg42zhpe680'));
                        tableRef.value?.reload();
                    } else {
                        onlyMessage(t('Alarm.Configuration.index.5rg42zhpe9w0'), 'error');
                    }
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
    return actions.filter(
        (item) => item.key != 'tigger' || data.sceneTriggerType == 'manual',
    );
};
const onSave = () => {
    visible.value = false;
    tableRef.value?.reload();
}
const add = () => {
    menuStory.jumpPage('rule-engine/Alarm/Configuration/Save');
};
</script>
<style lang="less" scoped>
.content-des-title {
    font-size: 12px;
}
</style>