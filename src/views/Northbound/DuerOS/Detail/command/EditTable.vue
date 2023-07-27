<template>
    <div class="inputs">
        <j-form ref="formRef" :model="modelRef">
            <j-table
                rowKey="id"
                :columns="columns"
                :data-source="modelRef.dataSource"
                bordered
                :pagination="false"
            >
                <template #bodyCell="{ column, record, index }">
                    <template v-if="column.dataIndex === 'value'">
                        <j-form-item
                            :name="['dataSource', index, 'value']"
                            :rules="[
                                {
                                    required: record.required,
                                    message:
                                        record.type === 'enum' ||
                                        record.type === 'boolean'
                                            ? t('Detail.command.EditTable.5rg4emwqf2c0')
                                            : t('Detail.command.EditTable.5rg4emwqg700'),
                                },
                            ]"
                        >
                            <ValueItem
                                v-model:modelValue="record.value"
                                :itemType="record.type"
                                :options="
                                    record.type === 'enum'
                                        ? (
                                              record?.dataType?.elements || []
                                          ).map((item) => {
                                              return {
                                                  label: item.text,
                                                  value: item.value,
                                              };
                                          })
                                        : record.type === 'boolean'
                                        ? [
                                              { label: t('Detail.command.EditTable.5rg4emwqgh80'), value: true },
                                              { label: t('Detail.command.EditTable.5rg4emwqh0g0'), value: false },
                                          ]
                                        : undefined
                                "
                                @change="onChange"
                            />
                        </j-form-item>
                    </template>
                    <template v-else>
                        <j-form-item
                            :name="['dataSource', index, column.dataIndex]"
                        >
                            <j-input
                                readonly
                                :bordered="false"
                                v-model:value="record[column.dataIndex]"
                            />
                        </j-form-item>
                    </template>
                </template>
            </j-table>
        </j-form>
    </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
type Emits = {
    (e: 'update:modelValue', data: Record<string, any>[]): void;
};
const _emit = defineEmits<Emits>();

const _props = defineProps({
    modelValue: {
        type: Array as PropType<Record<string, any>[]>,
        default: '',
    },
});
const columns = [
    // {
    //     title: 'ID',
    //     dataIndex: 'id',
    //     with: '33%',
    // },
    {
        title: t('Detail.command.EditTable.5rg4emwqh9c0'),
        dataIndex: 'name',
        with: '33%',
    },
    {
        title: t('Detail.command.EditTable.5rg4emwqhi80'),
        dataIndex: 'valueType',
        with: '33%',
    },
    {
        title: t('Detail.command.EditTable.5rg4emwqhqw0'),
        dataIndex: 'value',
        with: '34%',
    },
];

const modelRef = reactive<{
    dataSource: any[];
}>({
    dataSource: [],
});
const formRef = ref();

watchEffect(() => {
    modelRef.dataSource = _props.modelValue || [];
});

const onChange = () => {
    _emit('update:modelValue', modelRef.dataSource);
};

const onSave = () =>
    new Promise((resolve, reject) => {
        formRef.value
            .validate()
            .then(() => {
                resolve([...modelRef.dataSource]);
            })
            .catch(() => {
                reject(false);
            });
    });

defineExpose({ onSave });
</script>

<style lang="less" scoped>
</style>