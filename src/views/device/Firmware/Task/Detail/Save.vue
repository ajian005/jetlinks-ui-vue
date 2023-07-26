<template lang="">
    <j-modal
        :title="t('Task.Detail.Save.5rg3lv59ig00')"
        :ok-text="t('Task.Detail.Save.5rg3lv59j7w0')"
        :cancel-text="t('Task.Detail.Save.5rg3lv59jdg0')"
        :visible="true"
        width="500px"
        @cancel="handleCancel"
        @ok="handleOk"
    >
        <span>{{t('Task.Detail.Save.err') + data }}</span>
    </j-modal>
</template>
<script lang="ts" setup name="TaskDetailSavePage">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});

const emit = defineEmits(['change']);

const handleOk = () => {
    handleCancel();
};
const handleCancel = () => {
    emit('change', false);
};
</script>

<style lang="less" scoped></style>
