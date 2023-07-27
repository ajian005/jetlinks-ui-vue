<template>
    <page-container>
        <Card
            :infoData="info"
            @saveData="saveData"
            :license-data="license"
            :licenseTime="licenseTime"
        >
            <div style="width: 200px">{{t('License.init.index.expire') + licenseTime?.expire }}</div>
        </Card>
    </page-container>
</template>

<script lang="ts" setup>
import Card from '../component/Card.vue';
import {
    getModule,
    licenseInit,
    initPage,
    getLicense,
} from '@/api/system/license';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
let info = ref();
let license = ref();
let licenseTime = ref();
const saveData = (data: any) => {
    if (data) {
        save(data);
    } else {
        onlyMessage(t('License.init.index.5rgb4b0pcrk0'), 'error');
    }
};
const getlicense = async () => {
    const res: any = await getLicense();
    if (res.status === 200) {
        licenseTime.value = res.result;
        license.value = res.result?.license;
    }
};
const getInfo = async () => {
    const res = await getModule();
    if (res.status === 200) {
        info.value = res.result;
    }
};
const save = async (data: any) => {
    const res: any = await licenseInit(data);
    if (res.status === 200) {
        onlyMessage(t('License.init.index.5rgb4b0pdnc0'));
        const resp: any = await initPage();
        if (resp.status === 200 && !resp.result.length) {
            window.location.href = '/#/init-home';
        } else {
            window.location.href = '/';
        }
    }
};
onMounted(() => {
    getInfo();
    getlicense();
});
</script>
<style lang="less" scoped>
</style>