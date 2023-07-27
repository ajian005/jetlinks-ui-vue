<template>
    <j-modal
        :title="t('action.Modal.index.5rg4szf88p00')"
        visible
        :width="860"
        @cancel="onCancel"
        @ok="onOk"
        :maskClosable="false"
    >
        <j-form ref="actionForm" :model="formModel" layout="vertical">
            <j-form-item
                :label="t('action.Modal.index.5rg4szf88p00')"
                name="type"
                :rules="[
                    {
                        required: true,
                        message: t('action.Modal.index.5rg4szf89rs0'),
                    },
                ]"
            >
                <CardSelect v-model:value="formModel.type" :options="options.filter(item => !(item.value === 'delay' && parallel))"/>
            </j-form-item>
            <ActionTypeComponent
                v-bind="props"
                v-if="!!actionType"
                :actionType="actionType"
                :options='actionOptions'
                @save="onPropsOk"
                @cancel="onPropsCancel"
            />
        </j-form>
    </j-modal>
</template>

<script lang="ts" setup name='UpdateActionItemModal'>
import { getImage } from '@/utils/comm';
import Delay from '../Delay/index.vue';
import Notify from '../Notify/index.vue';
import Device from '../Device/index.vue';
import { PropType } from 'vue';
import { ActionsType } from '../../../typings';
import ActionTypeComponent from './ActionTypeComponent.vue';
import { randomString } from '@/utils/utils';
import CardSelect from '../../components/CardSelect.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
    branchesName: {
        type: Number,
        default: 0,
    },
    thenName: {
        type: Number,
        default: 0,
    },
    name: {
        type: Number,
        default: 0,
    },
    data: {
        type: Object as PropType<ActionsType>,
        default: () => ({
            key: randomString(),
        }),
    },
    parallel: {
        type: Boolean,
    },
    actionOptions: {
      type: Object,
      default: () => ({})
    }
});

const emit = defineEmits(['cancel', 'save']);

const options = [
  {
    label: t('action.Modal.index.5rg4szf89x80'),
    value: 'device',
    iconUrl: getImage('/scene/device-type.png'),
    subLabel: t('action.Modal.index.5rg4szf8a1o0'),
  },
  {
    label: t('action.Modal.index.5rg4szf8a7o0'),
    value: 'notify',
    iconUrl: getImage('/scene/message-type.png'),
    subLabel: t('action.Modal.index.5rg4szf8aeg0'),
  },
  {
    label: t('action.Modal.index.5rg4szf8aig0'),
    value: 'delay',
    iconUrl: getImage('/scene/delay-type.png'),
    subLabel: t('action.Modal.index.5rg4szf8am40'),
  },
  {
    label: t('action.Modal.index.5rg4szf8aq80'),
    value: 'trigger',
    iconUrl: getImage('/scene/trigger-type.png'),
    subLabel: t('action.Modal.index.5rg4szf8ats0'),
  },
  {
    label: t('action.Modal.index.5rg4szf8axc0'),
    value: 'relieve',
    iconUrl: getImage('/scene/cancel-type.png'),
    subLabel: t('action.Modal.index.5rg4szf8b380'),
  },
];

const actionForm = ref();
const formModel = reactive({
    type: 'device',
});

const actionType = ref<string>('');

watch(
    () => props.data,
    (newVal) => {
        if (newVal?.executor) {
            formModel.type = (
                newVal?.executor === 'alarm'
                    ? newVal?.alarm?.mode
                    : newVal?.executor
            ) as string;
        }
    },
    {
        immediate: true,
        deep: true,
    },
);
const onOk = () => {
    actionForm.value.validate().then((values: any) => {
        actionType.value = values?.type;
        if (values?.type === 'relieve' || values?.type === 'trigger') {
            emit(
                'save',
                {
                    // ...props.data,
                    key: props.data.key,
                    executor: 'alarm',
                    alarm: { mode: values.type },
                },
                {},
            );
        }
    });
};

const onCancel = () => {
    emit('cancel');
};

const onPropsOk = (data: any, options?: any) => {
    emit('save', { ...data, executor: data.type }, options);
    actionType.value = '';
};

const onPropsCancel = () => {
    actionType.value = '';
};
</script>