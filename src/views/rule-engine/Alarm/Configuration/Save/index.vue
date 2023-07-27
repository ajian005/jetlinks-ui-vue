<template>
    <page-container>
        <j-card>
            <j-tabs :activeKey="activeKey" @change="changeTabs">
                <j-tab-pane key="1" :tab="t('Configuration.Save.index.5rg42qgd0no0')">
                    <Base v-if="activeKey === '1'" @change="typeChange" />
                </j-tab-pane>
                <j-tab-pane key="2" :tab="t('Configuration.Save.index.5rg42qgd1u80')">
                    <Scene></Scene>
                </j-tab-pane>
                <j-tab-pane key="3" :tab="t('Configuration.Save.index.5rg42qgd2040')">
                    <Log v-if="activeKey === '3'" :type="type" />
                </j-tab-pane>
            </j-tabs>
        </j-card>
    </page-container>
</template>

<script lang="ts" setup>
import Base from './Base/index.vue';
import Scene from './Scene/index.vue';
import Log from './Log/indev.vue';
import { useRoute } from 'vue-router';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute();
const changeTabs = (e: any) => {
    if (route.query?.id) {
        activeKey.value = e;
    } else {
        onlyMessage(t('Configuration.Save.index.5rg42qgd24w0'), 'error');
    }
};
const activeKey = ref('1');
const type = ref('detail')

const typeChange = (_type: string) => {
  console.log(_type)
  type.value = _type
}
</script>
<style lang="less" scoped>
</style>