<template>
    <j-modal
        visible
        :title="t('Menu.components.ChooseIconDialog.5rg9otsxd7o0')"
        width="800px"
        @cancel="emits('update:visible', false)"
        @ok="confirm"
    >
        <j-radio-group v-model:value="selected" class="radio">
            <j-radio-button
                v-for="typeStr in iconKeys"
                :value="typeStr"
                :key="typeStr"
                :class="{ active: selected === typeStr }"
            >
                <AIcon :type="typeStr" />
            </j-radio-button>
        </j-radio-group>
    </j-modal>
</template>

<script setup lang="ts">
import iconKeys from './fields';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emits = defineEmits(['confirm', 'update:visible']);
const props = defineProps<{
    visible: boolean;
}>();

const confirm = () => {
    emits('confirm', selected.value);
    emits('update:visible', false);
};

const selected = ref<string>('');
</script>

<style lang="less" scoped>
.radio {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(6, 1fr);
    max-height: 500px;
    overflow-y: auto;

    .ant-radio-button-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100px;
        font-size: 40px;
        border: 2px solid #efefef;
        border-radius: 2px;
        cursor: pointer;

        &.active {
            color: #415ed1;
            border-color: #415ed1;
        }
    }
}
</style>
