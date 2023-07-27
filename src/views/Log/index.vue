<template>
    <page-container
        :tabList="list"
        :tabActiveKey="activeKey"
        @tabChange="onTabChange"
    >
        <FullPage>
            <AccessLog v-if="activeKey === '1'" />
            <SystemLog v-else />
        </FullPage>
    </page-container>
</template>
<script lang="ts" setup name="LogPage">
import { defineComponent, ref } from 'vue';
import AccessLog from './Access/index.vue';
import SystemLog from './System/index.vue';
import { useRouterParams } from '@/utils/hooks/useParams';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const routerParams = useRouterParams();
const activeKey = ref('1');

const list = [
    {
        key: '1',
        tab: t('views.Log.index.5rg3dtx8n4g0'),
    },
    {
        key: '2',
        tab: t('views.Log.index.5rg3dtx8o0s0'),
    },
];

const onTabChange = (e: string) => {
    activeKey.value = e;
};

onMounted(() => {
    if (routerParams.params.value.tab === 'system') {
        activeKey.value = '2';
    }
});
</script>
