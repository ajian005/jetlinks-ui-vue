<template>
    <page-container
        :tabList="list"
        @tabChange="onTabChange"
        :tabActiveKey="tab"
    >
        <div v-if="tab == 'config'">
            <j-row :gutter="24">
                <j-col :span="14">
                    <FullPage>
                        <div class="alarm-level">
                            <j-card
                                :headStyle="{
                                    borderBottom: 'none',
                                    padding: 0,
                                }"
                                :bodyStyle="{ padding: 0 }"
                                :bordered="false"
                            >
                                <template #title>
                                    <div class="alarmLevelTitle">
                                        {{t('Alarm.Config.index.5rg40s8e8fs0')}}
                                    </div>
                                </template>
                                <div
                                    v-for="(item, i) in levels"
                                    :key="i"
                                    class="alarmInputItem"
                                >
                                    <div>
                                        <img
                                            :src="
                                                getImage(
                                                    `/alarm/alarm${i + 1}.png`,
                                                )
                                            "
                                            alt=""
                                        />
                                        <span>{{ t('Alarm.Config.index.level') +`${i + 1}` }}</span>
                                    </div>
                                    <div>
                                        <j-input
                                            type="text"
                                            v-model:value="item.title"
                                            :maxlength="64"
                                        ></j-input>
                                    </div>
                                </div>
                            </j-card>
                            <!-- <j-button
                            type="primary"
                            size="middle"
                            @click="handleSaveLevel"
                            >{{t('Alarm.Config.index.5rg40s8ea600')}}</j-button
                        > -->
                            <PermissionButton
                                type="primary"
                                size="middle"
                                @click="handleSaveLevel"
                                hasPermission="rule-engine/Alarm/Config:update"
                                >{{t('Alarm.Config.index.5rg40s8ea600')}}</PermissionButton
                            >
                        </div>
                    </FullPage>
                </j-col>
                <j-col :span="10">
                    <FullPage>
                        <div class="description">
                            <h1>{{t('Alarm.Config.index.5rg40s8eafs0')}}</h1>
                            <div>
                                {{t('Alarm.Config.index.explain1')}}
                            </div>
                            <div>{{t('Alarm.Config.index.explain2')}}</div>
                            <div>{{t('Alarm.Config.index.explain3')}}</div>
                        </div>
                    </FullPage>
                </j-col>
            </j-row>
        </div>
        <Io v-else></Io>
    </page-container>
</template>

<script lang="ts" setup>
import { getImage, onlyMessage } from '@/utils/comm';
import { queryLevel, saveLevel } from '@/api/rule-engine/config';
import { LevelItem } from './typing';
import Io from './Io/index.vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const list = ref([
    {
        key: 'config',
        tab: t('Alarm.Config.index.5rg40s8eap80'),
    },
    {
        key: 'io',
        tab: t('Alarm.Config.index.5rg40s8eaw80'),
    },
]);
let levels = ref<LevelItem[]>([]);
let tab = ref<'io' | 'config' | string>('config');
const getAlarmLevel = () => {
    queryLevel().then((res: any) => {
        if (res.status == 200) {
            levels.value = res.result.levels;
        }
    });
};
getAlarmLevel();
const handleSaveLevel = async () => {
    saveLevel(levels.value).then((res) => {
        if (res.status === 200) {
            onlyMessage(t('Alarm.Config.index.5rg40s8eb2k0'));
        }
    });
};
const onTabChange = (e: string) => {
    tab.value = e;
};
</script>
<style lang="less" scoped>
.alarm-level {
    padding: 24px;
    background-color: white;
    height: 700px;
}
.alarmLevelTitle {
    position: relative;
    padding-left: 10px;
    color: rgba(0, 0, 0, 0.8);
    font-weight: 600;
    line-height: 1;
    margin-bottom: 16px;
}
.alarmLevelTitle::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background-color: #1d39c4;
    border-radius: 0 3px 3px 0;
    content: ' ';
}
.alarmInputItem {
    margin-bottom: 22px;
}
.description {
    height: 700px;
    height: 100%;
    padding: 24px;
    overflow-y: auto;
    color: rgba(#000, 0.8);
    font-size: 14px;
    background-color: #fff;
    h1 {
        margin: 16px 0;
        color: rgba(#000, 0.85);
        font-weight: bold;
        font-size: 14px;
    }
}
</style>