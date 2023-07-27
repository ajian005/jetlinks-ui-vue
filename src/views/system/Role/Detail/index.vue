<template>
    <page-container>
        <div class="details-container">
            <j-tabs v-model:activeKey="activeKey">
                <j-tab-pane key="1" :tab="t('Role.Detail.index.5rkju6fy9nw0')"><Permiss /></j-tab-pane>
                <j-tab-pane key="2" :tab="t('Role.Detail.index.5rkju6fyaws0')"><User /></j-tab-pane>
            </j-tabs>
        </div>
    </page-container>
</template>

<script setup lang="ts" name="Detail">
import Permiss from './Permiss/index.vue';
import User from './User/index.vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n() 
const activeKey = ref('1');
</script>

<style lang="less" scoped>
.details-container {
    :deep(.ant-tabs-nav-wrap) {
        background-color: #fff;
        padding-left: 24px;
    }
}
</style>
