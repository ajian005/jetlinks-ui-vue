<template>
    <j-empty
        v-if="!metadata || (metadata && !metadata.functions?.length)"
        style="margin-top: 50px"
    >
        <template #description>
            {{t('Detail.Function.index.5rcyimhrhp00')}}
            <!-- <a @click="emits('onJump', 'Metadata')">物模型属性功能</a> -->
            <a @click="onJump">{{t('Detail.Function.index.5rcyimhrm7k0')}}</a>
        </template>
    </j-empty>
    <template v-else>
        <j-tabs v-model:activeKey="activeKey">
            <j-tab-pane key="Simple" :tab="t('Detail.Function.index.5rcyimhrmlc0')" />
            <j-tab-pane key="Advance" :tab="t('Detail.Function.index.5rcyimhrmqs0')" />
        </j-tabs>
        <component :is="tabs[activeKey]" />
    </template>
</template>

<script setup lang="ts">
import { useInstanceStore } from '@/store/instance';
import Simple from './components/Simple.vue';
import Advance from './components/Advance.vue';
import { useMenuStore } from 'store/menu';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const menuStory = useMenuStore();

const instanceStore = useInstanceStore();
// const emits = defineEmits(['onJump']);

const metadata = computed(() => JSON.parse(instanceStore.detail.metadata));

const activeKey = ref('Simple');
const tabs = {
    Simple,
    Advance,
};

const onJump = () => {
    menuStory.jumpPage(
        'device/Product/Detail',
        {
            id: instanceStore.current.productId,
        },
        { key: 'metadata' },
    );
};
</script>
