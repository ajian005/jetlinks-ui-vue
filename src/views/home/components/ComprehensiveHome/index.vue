<template>
    <div class="comprehensive-home-conatiner">
        <j-row :gutter="24" class="top" style="margin-bottom: 24px">
            <j-col :span="6" class="left">
                <BootCardSmall
                    :cardData="deviceBootConfig"
                    :cardTitle="t('pages.iot.home.iotGuidance.title')"
                />
                <div style="width: 100%; height: 24px"></div>
                <BootCardSmall :cardData="opsBootConfig" :cardTitle="t('pages.iot.home.op.title')" />
            </j-col>
            <j-col :span="18" class="right">
                <j-row :gutter="24">
                    <j-col :span="12"><DeviceCountCard /></j-col>
                    <j-col :span="12"><BasicCountCard /></j-col>
                    <j-col :span="24" style="margin-top: 24px">
                        <PlatformPicCard image="/images/home/content.png" />
                    </j-col>
                </j-row>
            </j-col>
        </j-row>

        <StepCard
            :cardTitle="t('pages.iot.home.deviceTips.title')"
            :tooltip="t('pages.iot.home.deviceTips.tooltip')"
            :dataList="deviceStepDetails"
            style="margin-bottom: 24px"
        />
        <StepCard
            :cardTitle="t('pages.iot.home.opTips.title')"
            :tooltip="t('pages.iot.home.opTips.tooltip')"
            :dataList="opsStepDetails"
        />

        <div class="dialog">
            <ProductChooseDialog
                v-if="productDialogVisible"
                v-model:visible="productDialogVisible"
                @confirm="(id:string)=>jumpPage('device/Product/Detail', { id, tab: 'Device'})"
            />
            <DeviceChooseDialog
                v-if="deviceDialogVisible"
                v-model:visible="deviceDialogVisible"
                @confirm="(id:string)=>jumpPage('device/Instance/Detail', { id, tab: 'Diagnose' })"
            />
        </div>
    </div>
</template>

<script setup lang="ts" name="ComprehensiveHome">
import ProductChooseDialog from '../dialogs/ProductChooseDialog.vue';
import DeviceChooseDialog from '../dialogs/DeviceChooseDialog.vue';
import BootCardSmall from '../BootCardSmall.vue';
import DeviceCountCard from '../DeviceCountCard.vue';
import BasicCountCard from '../BasicCountCard.vue';
import PlatformPicCard from '../PlatformPicCard.vue';
import StepCard from '../StepCard.vue';

import { usePermissionStore } from '@/store/permission';
import { recommendList, bootConfig } from '../../typing';
import { useMenuStore } from '@/store/menu';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { jumpPage } = useMenuStore();

// 按钮权限控制
const hasPermission = usePermissionStore().hasPermission;
const productPermission = (action: string) =>
    hasPermission(`device/Product:${action}`);
const devicePermission = (action: string) =>
    hasPermission(`device/Instance:${action}`);
const rulePermission = (action: string) =>
    hasPermission(`rule-engine/Instance:${action}`);

// 物联网引导-数据
const deviceBootConfig: bootConfig[] = [
    {
        english: 'STEP1',
        label: t('pages.iot.home.common.device'),
        link: 'device/Product',
        auth: productPermission('add'),
        image: '/images/home/guide-home1.png',
        params: {
            save: true,
        },
    },
    {
        english: 'STEP2',
        label: t('pages.iot.home.iotGuidance.step2'),
        link: 'device/Instance',
        auth: devicePermission('add'),
        image: '/images/home/guide-home1.png',
        params: {
            type: 'add',
        },
    },
    {
        english: 'STEP3',
        label: t('pages.iot.home.iotGuidance.step3'),
        link: 'rule-engine/Instance',
        auth: rulePermission('add'),
        image: '/images/home/guide-home3.png',
        params: {
            save: true,
        },
    },
];

// 设备接入推荐步骤-数据
const deviceStepDetails: recommendList[] = [
    {
        title: t('pages.iot.home.common.device'),
        details:
            t('pages.iot.home.deviceTips.step1Content'),
        iconUrl: '/images/home/bottom-4.png',
        linkUrl: 'device/Product',
        auth: productPermission('add'),
        params: {
            save: true,
        },
    },
    {
        title: t('pages.iot.home.deviceTips.step2'),
        details:
            t('pages.iot.home.deviceTips.step2Content'),
        iconUrl: '/images/home/bottom-1.png',
        linkUrl: 'device/Product/Detail',
        auth: productPermission('update'),
        onClick: () => {
            productDialogVisible.value = true;
        },
    },
    {
        title: t('pages.iot.home.deviceTips.step3'),
        details: t('pages.iot.home.deviceTips.step3Content'),
        iconUrl: '/images/home/bottom-5.png',
        linkUrl: 'device/Instance',
        auth: devicePermission('add'),
        params: {
            type: 'add',
        },
    },
    {
        title: t('pages.iot.home.deviceTips.step4'),
        details:
            t('pages.iot.home.deviceTips.step4Content'),
        iconUrl: '/images/home/bottom-2.png',
        linkUrl: 'device/Instance/Detail',
        auth: devicePermission('update'),
        onClick: () => {
            deviceDialogVisible.value = true;
        },
    },
    {
        title: t('pages.iot.home.deviceTips.step5'),
        details: t('pages.iot.home.deviceTips.step5Content'),
        iconUrl: '/images/home/bottom-3.png',
        linkUrl: 'device/Instance',
        auth: devicePermission('import'),
        params: {
            type: 'import',
        },
    },
];

// 运维管理引导-数据
const opsBootConfig: bootConfig[] = [
    {
        english: 'STEP1',
        label: t('pages.iot.home.op.step1'),
        link: 'link/AccessConfig',
        image: '/images/home/guide-home4.png',
    },
    {
        english: 'STEP2',
        label: t('pages.iot.home.op.step2'),
        link: 'Log',
        params: {
            tab: 'system',
        },
        image: '/images/home/guide-home5.png',
    },
    {
        english: 'STEP3',
        label: t('pages.iot.home.op.step3'),
        link: 'link/DashBoard',
        image: '/images/home/guide-home6.png',
    },
];

// 运维管理推荐步骤-数据
const opsStepDetails: recommendList[] = [
    {
        title: t('pages.iot.home.opTips.step1'),
        details:
            t('pages.iot.home.opTips.step1Content'),
        iconUrl: '/images/home/Frame4528.png',
        linkUrl: 'link/Protocol',
    },
    {
        title: t('pages.iot.home.opTips.step2'),
        details:  t('pages.iot.home.opTips.step2Content'),
        iconUrl: '/images/home/Frame4528.png',
        linkUrl: 'link/Certificate',
    },
    {
        title: t('pages.iot.home.opTips.step3'),
        details: t('pages.iot.home.opTips.step3Content'),
        iconUrl: '/images/home/Frame4528.png',
        linkUrl: 'link/Type',
    },
    {
        title: t('pages.iot.home.opTips.step4'),
        details: t('pages.iot.home.opTips.step4Content'),
        iconUrl: '/images/home/Frame4528(1).png',
        linkUrl: 'link/AccessConfig',
    },
    {
        title: t('pages.iot.home.opTips.step5'),
        details: t('pages.iot.home.opTips.step5Content'),
        iconUrl: '/images/home/Frame4528.png',
        linkUrl: 'Log',
        params: {
            tab: 'system',
        },
    },
];

const productDialogVisible = ref(false);
const deviceDialogVisible = ref(false);
</script>
