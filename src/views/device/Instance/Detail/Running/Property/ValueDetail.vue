<template>
    <j-modal
        :maskClosable="false"
        width="600px"
        :visible="true"
        :title="t('Running.Property.ValueDetail.5rcyq640pqo0')"
        :okText="t('Running.Property.ValueDetail.5rcyq640qq80')"
        :cancelText="t('Running.Property.ValueDetail.5rcyq640r000')"
        @ok="handleCancel"
        @cancel="handleCancel"
    >
        <template v-if="['.jpg', '.png'].includes(type)">
            <j-image :src="value?.formatValue" />
        </template>
        <template v-else-if="['.flv', '.m3u8', '.mp4'].includes(type)">
            <LivePlayer :url="value?.formatValue" autoplay />
        </template>
        <template v-else>
            <JsonViewer
                :expand-depth="5"
                :value="value?.formatValue"
            />
        </template>
    </j-modal>
</template>

<script lang="ts" setup>
import JsonViewer from 'vue-json-viewer';
import LivePlayer from '@/components/Player/index.vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const _data = defineProps({
    type: {
        type: String,
        default: '',
    },
    value: {
        type: [Object, String],
        default: () => {},
    },
});
const _emit = defineEmits(['close']);
const handleCancel = () => {
    _emit('close');
};

</script>

<style lang="less" scoped>
</style>