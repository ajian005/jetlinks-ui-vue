<template>
    <FullPage>
        <JProTable
            model="CARD"
            :request="query"
            :defaultParams="{
                sorts: [{ name: 'createTime', order: 'desc' }],
                terms,
            }"
            ref="actionRef"
        >
            <template #headerTitle>
                <j-space>
                    <PermissionButton
                        type="primary"
                        @click="showModal"
                        hasPermission="rule-engine/Alarm/Configuration:add"
                    >
                        <template #icon><AIcon type="PlusOutlined" /></template>
                        {{t('Save.Scene.index.5rg425yim6w0')}}
                    </PermissionButton>
                </j-space>
            </template>
            <template #card="slotProps">
                <CardBox
                    :value="slotProps"
                    :actions="getActions(slotProps, 'card')"
                    :status="slotProps.state?.value"
                    :statusText="slotProps.state?.text"
                    :statusNames="{
                        started: 'processing',
                        disable: 'error',
                    }"
                >
                    <template #type>
                        <span
                            ><img
                                :height="16"
                                :src="typeMap.get(slotProps.triggerType)?.icon"
                                style="margin-right: 5px"
                            />{{
                                typeMap.get(slotProps.triggerType)?.text
                            }}</span
                        >
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
                                {{ t('Save.Scene.index.explain') + (
                                    slotProps?.description ||
                                    typeMap.get(slotProps.triggerType)?.tip)
                                }}
                            </div>
                        </Ellipsis>
                    </template>
                    <template #actions="item">
                        <PermissionButton
                            :disabled="item.disabled"
                            :popConfirm="item.popConfirm"
                            :tooltip="{
                                ...item.tooltip,
                            }"
                            @click="item.onClick"
                            :hasPermission="'rule-engine/Scene:' + item.key"
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
        </JProTable>
    </FullPage>
    <Save
        :id="id"
        :type="configurationData.current?.targetType"
        @close-save="closeSave"
        @save-scene="saveSuccess"
        v-if="visible"
    ></Save>
</template>

<script lang="ts" setup>
import { query } from '@/api/rule-engine/scene';
import { unbindScene } from '@/api/rule-engine/configuration';
import { useRoute } from 'vue-router';
import type { ActionsType } from '@/components/Table';
import { getImage, onlyMessage } from '@/utils/comm';
import Save from './Save/index.vue';
import { useAlarmConfigurationStore } from '@/store/alarm';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute();
const id = route.query?.id;

const alarmConfigurationStore = useAlarmConfigurationStore();
const { configurationData } = storeToRefs(alarmConfigurationStore);

const terms = [
    {
        terms: [
            {
                column: 'id',
                termType: 'alarm-bind-rule',
                value: id,
            },
        ],
        type: 'and',
    },
];
const actionRef = ref();
const typeMap = new Map();
typeMap.set('manual', {
    text: t('Save.Scene.index.5rg425yinvc0'),
    img: getImage('/scene/scene-hand.png'),
    icon: getImage('/scene/trigger-type-icon/manual.png'),
    tip: t('Save.Scene.index.5rg425yio4g0'),
});
typeMap.set('timer', {
    text: t('Save.Scene.index.5rg425yioa80'),
    img: getImage('/scene/scene-timer.png'),
    icon: getImage('/scene/trigger-type-icon/timing.png'),
    tip: t('Save.Scene.index.5rg425yiokw0'),
});
typeMap.set('device', {
    text: t('Save.Scene.index.5rg425yiork0'),
    img: getImage('/scene/scene-device.png'),
    icon: getImage('/scene/trigger-type-icon/device.png'),
    tip: t('Save.Scene.index.5rg425yioxs0'),
});
const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
    if (!data) return [];
    const actions: ActionsType[] = [
        {
            key: 'action',
            text: t('Save.Scene.index.5rg425yip440'),
            icon: 'DisconnectOutlined',
            popConfirm: {
                title: t('Save.Scene.index.5rg425yip8w0'),
                onConfirm: async () => {
                    const res = await unbindScene(id, [data.id]);
                    if (res.status === 200) {
                        onlyMessage(t('Save.Scene.index.5rg425yipe80'));
                        actionRef.value.reload();
                    }
                },
            },
        },
    ];
    return actions;
};
const visible = ref(false);
const log = () => {
    console.log();
};
log();
const showModal = () => {
    visible.value = true;
};
const closeSave = () => {
    visible.value = false;
};
const saveSuccess = () => {
    visible.value = false;
    actionRef.value.reload();
};
</script>
<style lang="less" scoped>
.subTitle {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    margin-top: 10px;
}
</style>