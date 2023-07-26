<template>
    <div class="device-home-container">
        <j-row :gutter="10">
            <j-col :span="14">
                <BootCard :cardData="opsBootConfig" :cardTitle="t('page.iot.home.op.title')" />
            </j-col>
            <j-col :span="10">
                <BasicCountCard />
            </j-col>
        </j-row>
        <j-row>
            <PlatformPicCard />
        </j-row>
        <j-row>
            <StepCard
                :cardTitle="t('page.iot.home.opTips.title')"
                :tooltip="t('page.iot.home.opTips.tooltip')"
                :dataList="opsStepDetails"
            />
        </j-row>
    </div>
</template>

<script setup lang="ts" name="devOpsHome">
import BootCard from '../BootCard.vue';
import BasicCountCard from '../BasicCountCard.vue';
import PlatformPicCard from '../PlatformPicCard.vue';
import StepCard from '../StepCard.vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
import type { bootConfig, recommendList } from '../../typing';
const opsBootConfig: bootConfig[] = [
    {
        english: 'STEP1',
        label: t('page.iot.home.op.step1'),
        link: 'link/AccessConfig',
    },
    {
        english: 'STEP2',
        label: t('page.iot.home.op.step2'),
        link: 'Log',
        params: {
            tab: 'system',
        },
    },
    {
        english: 'STEP3',
        label: t('page.iot.home.op.step3'),
        link: 'link/DashBoard',
    },
];
const opsStepDetails: recommendList[] = [
    {
        title: t('page.iot.home.opTips.step1'),
        details:
        t('page.iot.home.opTips.step1Content'),
        iconUrl: '/images/home/Frame4528.png',
        linkUrl: 'link/Protocol',
    },
    {
        title: t('page.iot.home.opTips.step2'),
        details: t('page.iot.home.opTips.step2Content'),
        iconUrl: '/images/home/Frame4528.png',
        linkUrl: 'link/Certificate',
    },
    {
        title: t('page.iot.home.opTips.step3'),
        details: t('page.iot.home.opTips.step3Content'),
        iconUrl: '/images/home/Frame4528.png',
        linkUrl: 'link/Type',
    },
    {
        title: t('page.iot.home.opTips.step4'),
        details: t('page.iot.home.opTips.step4Content'),
        iconUrl: '/images/home/Frame4528(1).png',
        linkUrl: 'link/AccessConfig',
    },
    {
        title: t('page.iot.home.opTips.step5'),
        details: t('page.iot.home.opTips.step5Content'),
        iconUrl: '/images/home/Frame4528.png',
        linkUrl: 'Log',
        params: {
            tab: 'system',
        },
    },
];
</script>

<style lang="less" scoped>
.device-home-container {
    .ant-row {
        margin-bottom: 24px;
    }
}
</style>
