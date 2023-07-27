<template>
    <div style="margin-top: 20px">
        <j-descriptions bordered>
            <template #title>
                {{t('components.Relation.index.5rcyk945af00')}}
                <PermissionButton
                    type="link"
                    @click="visible = true"
                    hasPermission="device/Instance:update"
                >
                    <AIcon type="EditOutlined" />{{t('components.Relation.index.5rcyk945dco0')}}<j-tooltip
                        :title="t('components.Relation.index.5rcyk945e7c0')"
                        ><AIcon type="QuestionCircleOutlined"
                    /></j-tooltip>
                </PermissionButton>
            </template>
            <j-descriptions-item
                :span="1"
                v-for="item in dataSource"
                :key="item.objectId"
            >
                <template #label>
                    <Ellipsis>{{ item.relationName }}</Ellipsis>
                </template>
                <Ellipsis>
                    {{
                        item?.related
                            ? (item?.related || []).map((i) => i.name).join(',')
                            : ''
                    }}
                </Ellipsis>
            </j-descriptions-item>
        </j-descriptions>
        <Save v-if="visible" @save="saveBtn" @close="visible = false" />
    </div>
</template>

<script lang="ts" setup>
import { useInstanceStore } from '@/store/instance';
import Save from './Save.vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const instanceStore = useInstanceStore();

const dataSource = ref<Record<any, any>[]>([]);
const visible = ref<boolean>(false);

watchEffect(() => {
    const arr = (instanceStore.current?.relations || []).reverse();
    dataSource.value = arr as Record<any, any>[];
});

const saveBtn = () => {
    visible.value = false;
    if (instanceStore.current.id) {
        instanceStore.refresh(instanceStore.current.id);
    }
};
</script>
