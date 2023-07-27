<template>
  <div class="doc">
    <div className="url">
      {{ t('AliCloud.Detail.doc.5rg4h2e76rk0') }}
      <a :style="{ wordBreak: 'break-all' }" href="https://help.aliyun.com/document_detail/87368.html" target="_blank"
        rel="noreferrer">
        https://help.aliyun.com/document_detail/87368.html
      </a>
    </div>
    <h1>1. {{ t('AliCloud.Detail.doc.5rg4h2e79980') }}</h1>
    <div>
      {{ t('AliCloud.Detail.doc.5rg4h2e79o00') }}
    </div>
    <div class="image">
      <j-image width="100%" :src="getImage('/northbound/aliyun2.png')" />
    </div>
    <h1>2. {{ t('AliCloud.Detail.doc.disposition') }}</h1>
    <div>
      <h2> 1、{{ t('AliCloud.Detail.doc.service') }}</h2>
      <div>
        {{ t('AliCloud.Detail.doc.5rg4h2e7a200') }}
      </div>
      <div>{{ t('AliCloud.Detail.doc.5rg4h2e7a7o0') }}</div>
      <div class="image">
        <j-image width="100%" :src="getImage('/northbound/aliyun3.png')" />
      </div>
      <h2> 2、AccesskeyID/Secret</h2>
      <div>
        {{ t('AliCloud.Detail.doc.5rg4h2e7ai80') }}
      </div>
      <div class="image">
        <j-image width="100%" :src="getImage('/northbound/aliyun1.jpg')" />
      </div>
      <h2> 3. {{ t('AliCloud.Detail.doc.5rg4h2e7as00') }}</h2>
      <div>
        {{ t('AliCloud.Detail.doc.5rg4h2e7axg0') }}
      </div>
      <h2> 4. {{ t('AliCloud.Detail.doc.5rg4h2e7b6s0') }}</h2>
      <div>
        {{ t('AliCloud.Detail.doc.5rg4h2e7bcg0') }}
      </div>
      <div class="image">
        <j-image width="100%" :src="getImage('/northbound/aliyun4.png')" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getImage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style lang="less" scoped>
.doc {
  height: 100%;
  padding: 24px;
  overflow-y: auto;
  color: rgba(#000, 0.8);
  font-size: 14px;
  background-color: #fafafa;

  .url {
    padding: 8px 16px;
    color: #2f54eb;
    background-color: rgba(#a7bdf7, 0.2);
  }

  h1 {
    margin: 16px 0;
    color: rgba(#000, 0.85);
    font-weight: bold;
    font-size: 14px;

    &:first-child {
      margin-top: 0;
    }
  }

  h2 {
    margin: 6px 0;
    color: rgba(0, 0, 0, 0.8);
    font-size: 14px;
  }

  .image {
    margin: 16px 0;
  }
}
</style>