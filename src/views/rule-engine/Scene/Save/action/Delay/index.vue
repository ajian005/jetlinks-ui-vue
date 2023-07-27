<template>
    <j-modal
        :title="t('action.Delay.index.5rg4ngxgi400')"
        visible
        :width="400"
        @cancel="onCancel"
        @ok="onOk"
        :maskClosable="false"
    >
        <j-input-number
            style="max-width: 220px"
            :placeholder="t('action.Delay.index.5rg4ngxgl4s0')"
            v-model:value="_value"
            :precision="3"
            :min="0.001"
            :max="65535"
        >
            <template #addonAfter>
                <j-select
                    :options="[
                        { label: t('action.Delay.index.5rg4ngxgljs0'), value: 'seconds' },
                        { label: t('action.Delay.index.5rg4ngxglzg0'), value: 'minutes' },
                        { label: t('action.Delay.index.5rg4ngxgm680'), value: 'hours' },
                    ]"
                    v-model:value="unit"
                />
            </template>
        </j-input-number>
    </j-modal>
</template>

<script lang="ts" setup>
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
    value: {
        type: Object,
        default: () => {
            return {
                time: 0,
                unit: 'seconds',
            };
        },
    },
});

const timeUnitEnum = {
    seconds: t('action.Delay.index.5rg4ngxgljs0'),
    minutes: t('action.Delay.index.5rg4ngxglzg0'),
    hours: t('action.Delay.index.5rg4ngxgm680'),
};

const emit = defineEmits(['cancel', 'save']);

const _value = ref<number>(props.value.time);
const unit = ref<'seconds' | 'minutes' | 'hours'>(
    props.value?.unit || 'seconds',
);

watch(
    () => props.value,
    (newVal) => {
        _value.value = newVal?.time || 0;
        unit.value = newVal?.unit || 'seconds';
    },
    {
        immediate: true,
        deep: true,
    },
);

const onCancel = () => {
    emit('cancel');
};
const onOk = () => {
    if (unref(_value)) {
        emit(
            'save',
            {
                time: _value.value,
                unit: unit.value,
            },
            {
                name: `${_value.value} ${
                    timeUnitEnum[unit.value]
                }${t('action.Delay.index.action')}`,
            },
        );
    } else {
        onlyMessage(t('action.Delay.index.5rg4ngxgl4s0'), 'error');
    }
};
</script>