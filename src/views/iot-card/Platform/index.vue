<!-- 平台对接 -->
<template>
    <page-container>
        <pro-search :columns="columns" target="platform-search" @search="handleSearch" />
        <FullPage>
          <j-pro-table ref="platformRef" :columns="columns" :request="queryList"
              :defaultParams="{ sorts: [{ name: 'createTime', order: 'desc' }] }" :params="params" :gridColumn="3">
              <template #headerTitle>
                  <j-space>
                  <!-- <j-button type="primary" @click="handleAdd">
                          <AIcon type="PlusOutlined" />新增
                          </j-button> -->
                      <PermissionButton @click="handleAdd" :hasPermission="'iot-card/Platform:add'" type="primary">
                          <AIcon type="PlusOutlined" />
                          {{t('iot-card.Platform.index.5rgbkt23gzo0')}}
                      </PermissionButton>
                  </j-space>
              </template>
              <template #card="slotProps">
                  <CardBox :value="slotProps" :actions="getActions(slotProps, 'card')" v-bind="slotProps"
                      :status="slotProps.state.value" :statusText="slotProps.state.text" :statusNames="{
                          enabled: 'processing',
                          disabled: 'error',
                      }">
                      <template #img>
                          <slot name="img">
                              <img :src="getImage('/iot-card/iot-card-bg.png')" />
                          </slot>
                      </template>
                      <template #content>
                          <h3  style='font-size: 16px;width: calc(100% - 90px); margin-bottom: 18px;'>
                            <Ellipsis>
                              {{ slotProps.name }}
                            </Ellipsis>
                          </h3>
                          <j-row>
                              <j-col :span="12">
                                  <div class="card-item-content-text">
                                      {{t('iot-card.Platform.index.5rgbkt23i9w0')}}
                                  </div>
                                  <div>{{ slotProps.operatorName }}</div>
                              </j-col>
                              <j-col :span="12">
                                  <div class="card-item-content-text">{{t('iot-card.Platform.index.5rgbkt23ii00')}}</div>
                                  <Ellipsis>{{ slotProps.explain }}</Ellipsis>
                              </j-col>
                          </j-row>
                      </template>
                      <template #actions="item">
                          <PermissionButton :disabled="item.disabled" :popConfirm="item.popConfirm" :tooltip="{
                              ...item.tooltip,
                          }" @click="item.onClick" :hasPermission="'iot-card/Platform:' + item.key">
                              <AIcon type="DeleteOutlined" v-if="item.key === 'delete'" />
                              <template v-else>
                                  <AIcon :type="item.icon" />
                                  <span>{{ item?.text }}</span>
                              </template>
                          </PermissionButton>
                      </template>
                  </CardBox>
              </template>
              <template #state="slotProps">
                  <j-badge :text="slotProps.state.text" :status="
                      slotProps.state.value === 'disabled'
                          ? 'error'
                          : 'success'
                  " />
              </template>
              <template #action="slotProps">
                  <j-space :size="16">
                      <template v-for="i in getActions(slotProps, 'table')" :key="i.key">
                          <PermissionButton :disabled="i.disabled" :popConfirm="i.popConfirm" :tooltip="{
                              ...i.tooltip,
                          }" @click="i.onClick" type="link" style="padding: 0px"
                              :hasPermission="'iot-card/Platform:' + i.key">
                              <template #icon>
                                  <AIcon :type="i.icon" />
                              </template>
                          </PermissionButton>
                      </template>
                  </j-space>
              </template>
          </j-pro-table>
        </FullPage>
    </page-container>
</template>

<script setup lang="ts">
import { getImage, onlyMessage } from '@/utils/comm';
import type { ActionsType } from '@/components/Table';
import { queryList, update, del } from '@/api/iot-card/platform';
import { useMenuStore } from 'store/menu'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const menuStory = useMenuStore()
const router = useRouter()
const platformRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

const columns = [
    {
        title: t('iot-card.Platform.index.5rgbkt23iqo0'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: t('iot-card.Platform.index.5rgbkt23i9w0'),
        dataIndex: 'operatorName',
        key: 'operatorName',
        search: {
            type: 'select',
            options: [
                { label: t('iot-card.Platform.index.5rgbkt23ivk0'), value: 'onelink' },
                { label: t('iot-card.Platform.index.5rgbkt23j500'), value: 'ctwing' },
                { label: t('iot-card.Platform.index.5rgbkt23jag0'), value: 'unicom' },
            ],
        },
    },
    {
        title: t('iot-card.Platform.index.5rgbkt23jio0'),
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        width: 120,
        search: {
            type: 'select',
            options: [
                { label: t('iot-card.Platform.index.5rgbkt23jng0'), value: 'enabled' },
                { label: t('iot-card.Platform.index.5rgbkt23jrg0'), value: 'disabled' },
            ],
        },
    },
    {
        title: t('iot-card.Platform.index.5rgbkt23ii00'),
        dataIndex: 'explain',
        key: 'explain',
        ellipsis: true,
    },
    {
        title: t('iot-card.Platform.index.5rgbkt23jvc0'),
        key: 'action',
        fixed: 'right',
        width: 120,
        scopedSlots: true,
    },
];

const statusUpdate = async (data: any) => {
    const res = await update(data);
    if (res.status === 200) {
        onlyMessage(t('iot-card.Platform.index.5rgbkt23k0c0'));
        platformRef.value?.reload();
    }
};

const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
    if (!data) return [];
    return [
        {
            key: 'update',
            text: t('iot-card.Platform.index.5rgbkt23k4c0'),
            tooltip: {
                title: t('iot-card.Platform.index.5rgbkt23k4c0'),
            },
            icon: 'EditOutlined',
            onClick: () => {
                //   router.push(`/iot-card/Platform/detail/${data.id}`);
                menuStory.jumpPage('iot-card/Platform/Detail', { id: data.id });
            },
        },
        {
            key: 'action',
            text: data.state.value === 'enabled' ? t('iot-card.Platform.index.5rgbkt23jrg0') : t('iot-card.Platform.index.5rgbkt23jng0'),
            tooltip: {
                title: data.state.value === 'enabled' ? t('iot-card.Platform.index.5rgbkt23jrg0') : t('iot-card.Platform.index.5rgbkt23jng0'),
            },
            icon:
                data.state.value === 'enabled'
                    ? 'StopOutlined'
                    : 'PlayCircleOutlined',
            popConfirm: {
                title: `${t('iot-card.Platform.index.verify') + (data.state.value === 'enabled' ? t('iot-card.Platform.index.5rgbkt23jrg0') : t('iot-card.Platform.index.5rgbkt23jng0'))
                    }？`,
                okText: t('iot-card.Platform.index.confirm'),
                cancelText: t('iot-card.Platform.index.5rgbkt23kcs0'),
                onConfirm: () => {
                    if (data.state.value === 'enabled') {
                        statusUpdate({
                            id: data.id,
                            config: { ...data.config },
                            state: 'disabled',
                            operatorName: data.operatorName,
                        });
                    } else {
                        statusUpdate({
                            id: data.id,
                            config: { ...data.config },
                            state: 'enabled',
                            operatorName: data.operatorName,
                        });
                    }
                },
            },
        },
        {
            key: 'delete',
            text: t('iot-card.Platform.index.5rgbkt23kkc0'),
            tooltip: {
                title:
                    data.state.value !== 'enabled' ? t('iot-card.Platform.index.5rgbkt23kkc0') : t('iot-card.Platform.index.5rgbkt23kpc0'),
            },
            disabled: data.state.value === 'enabled',
            popConfirm: {
                title: t('iot-card.Platform.index.5rgbkt23kts0'),
                okText: t('iot-card.Platform.index.confirm'),
                cancelText: t('iot-card.Platform.index.5rgbkt23kcs0'),
                onConfirm: async () => {
                    const resp: any = await del(data.id);
                    if (resp.status === 200) {
                        onlyMessage(t('iot-card.Platform.index.5rgbkt23l0w0'));
                        platformRef.value?.reload();
                    } else {
                        onlyMessage(t('iot-card.Platform.index.5rgbkt23l9g0'), 'error');
                    }
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
};

const handleSearch = (e: any) => {
    params.value = e;
};

/**
 * {{t('iot-card.Platform.index.5rgbkt23gzo0')}}
 */
const handleAdd = () => {
    menuStory.jumpPage('iot-card/Platform/Detail', { id: ':id' })
};
</script>

<style scoped lang="less"></style>
