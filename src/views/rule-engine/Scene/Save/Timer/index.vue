<template>
    <div class='timer'>
      <j-form-item
        :rules="rules"
        :name="['trigger', 'timer']"
      >
        <template #label>
          <TitleComponent :data="t('Save.Timer.index.5rg580jly400')" style='font-size: 14px;' />
        </template>
        <AddButton
            style='width: 100%'
            @click='visible = true'
        >
          <Title :options='data.options.trigger' />
        </AddButton>
      </j-form-item>
      <div class='actions-branches-item' >
        <j-form-item
          :rules="actionRules"
          :name="['branches', 0, 'then']"
        >
          <Action
            :thenOptions="data.branches ? data?.branches[0].then : []"
            :name="0"
          />
        </j-form-item>
      </div>
      <AddModel
        v-if="visible"
        @cancel='visible = false'
        @save="save"
        :value="data.trigger.timer"
      />
    </div>
</template>

<script lang="ts" setup name='SceneSaveTimer'>
import { useSceneStore } from '@/store/scene';
import { storeToRefs } from 'pinia';
import Action from '../action/index.vue';
import AddModel from './AddModal.vue'
import AddButton from '../components/AddButton.vue'
import Title from './Title.vue'
import type { OperationTimer, BranchesThen } from '@/views/rule-engine/Scene/typings'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const sceneStore = useSceneStore();
const { data } = storeToRefs(sceneStore);
const visible = ref(false)

const rules = [{
  validator(_: any, v: any) {
    console.log(v)
    if (!v) {
      return Promise.reject(new Error(t('Save.Timer.index.5rg580jlzlk0')));
    }
    return Promise.resolve();
  },
}]

const actionRules = [{
  validator(_: any, v?: BranchesThen[]) {
    if (!v || (v && !v.length) || !v.some(item => item.actions && item.actions.length)) {
      return Promise.reject(t('Save.Timer.index.5rg580jlzxo0'));
    }
    return Promise.resolve();
  },
}]

const onActionUpdate = (_data: any, type: boolean) => {
    const indexOf = data.value.branches![0].then.findIndex(
        (item) => item.parallel === type,
    );
    if (indexOf !== -1) {
        if (_data?.actions?.length) {
            data.value.branches![0].then[indexOf] = _data;
        } else {
            data.value.branches![0].then[indexOf].actions = [];
        }
    }
};

const save = (_data: OperationTimer, options: Record<string, any>) => {
  data.value.trigger!.timer = _data
  data.value.options!.trigger = options
  visible.value = false
}
</script>

<style scoped lang='less'>
@minWidth: 75%;

.timer {
  .actions-branches-item {
    width: 100%;
  }
}


@media (min-width: 1600px) {
  .timer {
    .actions-branches-item {
      width: @minWidth;
    }
  }
}
</style>