<template>
    <page-container :tabList="isNoCommunity ? list : noList" :tabActiveKey="data.tab" @tabChange="onTabChange">
        <TableComponents :type="data.tab"></TableComponents>
    </page-container>
</template>

<script lang="ts" setup>
import { isNoCommunity } from '@/utils/utils';
import { useAlarmStore } from '@/store/alarm';
import { storeToRefs } from 'pinia';
import { queryLevel } from '@/api/rule-engine/config';
import  TableComponents  from './TabComponent/index.vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const list = [
    {
        key: 'all',
        tab: t('Alarm.Log.index.5rg46pvieuo0'),
    },
    {
        key: 'product',
        tab: t('Alarm.Log.index.5rg46pvih5o0'),
    },
    {
        key: 'device',
        tab: t('Alarm.Log.index.5rg46pvihe80'),
    },
    {
        key: 'org',
        tab: t('Alarm.Log.index.5rg46pvihio0'),
    },
    {
        key: 'other',
        tab: t('Alarm.Log.index.5rg46pvihmg0'),
    },
];
const noList = [
    {
        key: 'all',
        tab: t('Alarm.Log.index.5rg46pvieuo0'),
    },
    {
        key: 'product',
        tab: t('Alarm.Log.index.5rg46pvih5o0'),
    },
    {
        key: 'device',
        tab: t('Alarm.Log.index.5rg46pvihe80'),
    },
    {
        key: 'other',
        tab: t('Alarm.Log.index.5rg46pvihmg0'),
    },
];
const alarmStore = useAlarmStore();
const { data }  = storeToRefs(alarmStore);
const getDefaulitLevel = () => {
    queryLevel().then((res)=>{
        if(res.status === 200 ){
            data.value.defaultLevel = res.result?.levels || [];
        }
    })
}
getDefaulitLevel();
const onTabChange = (key:string) =>{
    data.value.tab = key;
}
</script>
<style lang="less" scoped>
</style>