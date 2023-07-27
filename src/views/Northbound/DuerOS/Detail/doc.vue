<template>
  <div class="doc">
    <div class="url">
      {{ t('DuerOS.Detail.doc.5rg4fahrxhk0') }}
      <a href="https://dueros.baidu.com/dbp/bot/index#/iotopenplatform" target="_blank" rel="noopener noreferrer">
        https://dueros.baidu.com/dbp/bot/index#/iotopenplatform
      </a>
    </div>
    <h1>1. {{ t('DuerOS.Detail.doc.5rg4fahryk00') }}</h1>
    <div>
      {{ t('DuerOS.Detail.doc.summarize') }}
    </div>
    <h1>2. {{ t('DuerOS.Detail.doc.5rg4fahrywg0') }}</h1>
    <div>
      <h2>1、{{ t('DuerOS.Detail.doc.step1') }}</h2>
      <div class="image">
        <j-image width="100%" :src="getImage('/cloud/dueros-doc.jpg')" />
      </div>
      <h1>{{ t('DuerOS.Detail.doc.5rg4fahrz2k0') }}</h1>
      <div>{{ t('DuerOS.Detail.doc.5rg4fahrz940') }}</div>
      <div>{{ t('DuerOS.Detail.doc.copyFilling') }} https://{location.host}/#/user/login</div>
      <h1>Client_Id</h1>
      <div>{{ t('DuerOS.Detail.doc.5rg4fahrzfw0') }}</div>
      <div class="image">
        <j-image width="100%" :src="getImage('/cloud/dueros-doc1.png')" />
      </div>
      <h1>{{ t('DuerOS.Detail.doc.5rg4fahrzl80') }}</h1>
      <div>{{ t('DuerOS.Detail.doc.5rg4fahrzrk0') }}</div>
      <div class="image">
        <j-image width="100%" :src="getImage('/cloud/dueros-doc2.png')" />
      </div>
      <h1>{{ t('DuerOS.Detail.doc.token') }}</h1>
      <div>{{ t('DuerOS.Detail.doc.copyFilling') }}HTTPS://{location.host}/api/v1/token</div>
      <h1>ClientSecret</h1>
      <div>{{ t('DuerOS.Detail.doc.5rg4fahrzy00') }}</div>
      <div class="image">
        <j-image width="100%" :src="getImage('/cloud/dueros-doc3.png')" />
      </div>
      <div></div>
      <h1>WebService</h1>
      <div>{{ t('DuerOS.Detail.doc.5rg4fahs06c0') }}</div>
      <h2>2、{{ t('DuerOS.Detail.doc.step2') }}</h2>
      <h2>
        3、{{ t('DuerOS.Detail.doc.step3') }}
      </h2>
    </div>
    <h1>3. {{ t('DuerOS.Detail.doc.5rg4fahs0bo0') }}</h1>
    <div>
      <h2>
        1、{{ t('DuerOS.Detail.doc.explain') }}
      </h2>
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
      word-wrap: break-word;
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