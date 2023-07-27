<!-- 视频设备 - 播放 -->
<template>
    <j-modal
        v-model:visible="_vis"
        :title="t('Channel.Live.index.5rg8a90dcq80')"
        :cancelText="t('Channel.Live.index.5rg8a90ddmg0')"
        :okText="t('Channel.Live.index.5rg8a90ddrs0')"
        width="800px"
        :maskClosable="false"
        @ok="_vis = false"
        @cancel="_vis = false"
    >
        <div class="media-live">
            <div class="media-live-video">
                <div :class="mediaToolClass" @mouseleave='mouseleave' @mouseenter='showTool = true' >
                  <div class="tool-item" >
                    <template v-if='isRecord === 0'>
                      <j-dropdown trigger='click' @visibleChange='visibleChange' @click='showToolLock = true'>
                        <div>
                          {{t('Channel.Live.index.5rg8a90ddwg0')}}
                        </div>
                        <template #overlay>
                          <j-menu @click="recordStart">
                            <j-menu-item key='true' v-if='route.query.type !== "fixed-media"'>
                              <span style='padding-right: 12px;'>{{t('Channel.Live.index.5rg8a90de0g0')}}</span>
                              <j-tooltip :title="t('Channel.Live.index.5rg8a90de4s0')">
                                <a-icon type='QuestionCircleOutlined' />
                              </j-tooltip>
                            </j-menu-item>
                            <j-menu-item key='false'>
                              <span style='padding-right: 12px;'>{{t('Channel.Live.index.5rg8a90de8g0')}}</span>
                              <j-tooltip :title="t('Channel.Live.index.5rg8a90dec00')">
                                <a-icon type='QuestionCircleOutlined' />
                              </j-tooltip>
                            </j-menu-item>
                          </j-menu>
                        </template>
                      </j-dropdown>
                    </template>
                    <div v-else-if='isRecord === 1'>
                      {{t('Channel.Live.index.5rg8a90dehc0')}}
                    </div>
                    <div v-else-if='isRecord === 2' @click.stop="recordStop">
                      {{t('Channel.Live.index.5rg8a90deks0')}}
                    </div>
                  </div>



                    <div class="tool-item" @click.stop="handleRefresh">
                        {{t('Channel.Live.index.5rg8a90deoc0')}}
                    </div>
                    <div class="tool-item">
                        <j-popconfirm
                            :title="t('Channel.Live.index.5rg8a90des00')"
                            @confirm="handleReset"
                        >
                            {{t('Channel.Live.index.5rg8a90dev80')}}
                        </j-popconfirm>
                    </div>
                </div>
                <LivePlayer
                    ref="player"
                    :live="true"
                    :url="url"
                    :protocol="mediaType"
                    autoplay
                />
            </div>
            <MediaTool
                @onMouseDown="handleMouseDown"
                @onMouseUp="handleMouseUp"
            />
        </div>
        <div class="media-live-tool">
            <j-radio-group
                v-model:value="mediaType"
                button-style="solid"
                @change="mediaStart"
            >
                <j-radio-button value="mp4">MP4</j-radio-button>
                <j-radio-button value="flv">FLV</j-radio-button>
                <j-radio-button value="m3u8">HLS</j-radio-button>
            </j-radio-group>
        </div>
    </j-modal>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import LivePlayer from '@/components/Player/index.vue';
import MediaTool from '@/components/Player/mediaTool.vue';
import channelApi from '@/api/media/channel';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
type Emits = {
    (e: 'update:visible', data: boolean): void;
};
const emit = defineEmits<Emits>();

const props = defineProps({
    visible: { type: Boolean, default: false },
    data: {
        type: Object as PropType<Partial<Record<string, any>>>,
        default: () => ({}),
    },
});

const route = useRoute();

const _vis = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val),
});

// 播放器
const player = ref();
// 视频地址
const url = ref('');
// 视频类型
const mediaType = ref<'mp4' | 'flv' | 'hls'>('mp4');
const showTool = ref(false)
const showToolLock = ref(false)

const mouseleave = () => {
  if (!showToolLock.value) {
    showTool.value = false
  }
}

const visibleChange = (v: boolean) => {
  showTool.value = v
}

const getPopupContainer = (trigger: HTMLElement) => {
  return trigger?.parentNode || document.body
}

const mediaToolClass = computed(() => {
  return {
    'media-tool': true,
    'media-tool-show': showTool.value
  }
})

/**
 * 媒体开始播放
 */
const mediaStart = () => {
    url.value = channelApi.ptzStart(
        props.data.deviceId,
        props.data.channelId,
        mediaType.value,
    )
};

// 录像状态
const isRecord = ref(0); // 0：停止录像； 1：请求录像中； 2：开始录像
/**
 * 查询录像状态
 */
const getIsRecord = async () => {
    const { result } = await channelApi.ptzIsRecord(
        props.data.deviceId,
        props.data.channelId,
    );
    isRecord.value = result ? 2 : 0;
};

/**
 * {{t('Channel.Live.index.5rg8a90ddwg0')}}
 */
const recordStart = async ({ key }: { key: string}) => {
  showToolLock.value = false
  showTool.value = false
  isRecord.value = 1;
  const local = key === 'true'
  const res = await channelApi.recordStart(
    props.data.deviceId,
    props.data.channelId,
    { local },
  ).catch(() => ({ success: false }))
  if (res.success) {
    isRecord.value = 2;
  } else {
    isRecord.value = 0;
  }
}

/**
 * {{t('Channel.Live.index.5rg8a90deks0')}}
 */
const recordStop = async () => {
  const res = await channelApi.recordStop(
    props.data.deviceId,
    props.data.channelId
  );
  if (res.success) {
    isRecord.value = 0;
  }
}


/**
 * {{t('Channel.Live.index.5rg8a90deoc0')}}
 */
const handleRefresh = () => {
    // player.value.play();
    url.value = '';
    setTimeout(() => {
        mediaStart();
    }, 500);
};

/**
 * {{t('Channel.Live.index.5rg8a90dev80')}}
 */
const handleReset = async () => {
    channelApi.mediaStop(props.data.deviceId, props.data.channelId);
};

/**
 * 点击控制按钮
 * @param type 控制类型
 */
const handleMouseDown = (type: string) => {
    channelApi.ptzTool(props.data.deviceId, props.data.channelId, type);
};
const handleMouseUp = () => {
    channelApi.ptzStop(props.data.deviceId, props.data.channelId);
};

watch(
    () => _vis.value,
    (val: boolean) => {
        if (val) {
            mediaStart();
            getIsRecord();
        } else {
            // url置空, 即销毁播放器
            url.value = '';
        }
    },
);
</script>
<style lang="less" scoped>
@import './index.less';
:deep(.live-player-stretch-btn){
  display: none;
}
:deep(.vjs-icon-spinner){
  display: none;
}
</style>
