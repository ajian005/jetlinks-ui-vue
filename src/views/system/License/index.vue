<template>
    <Card :infoData="info" @saveData="saveData" />
</template>

<script lang="ts" setup>
import Card from './component/Card.vue';
import { getModule, licenseInit, initPage } from '@/api/system/license';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
let info = ref();
const saveData = (data: any) => {
    if (data) {
        save(data);
    } else {
        onlyMessage(t('system.License.index.5rgb4hv02440'), 'error');
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
        onlyMessage(t('system.License.index.5rgb4hv03280'));
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
});
</script>
<style lang="less" scoped>
</style>