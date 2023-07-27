import { getImage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

export const headerImgMap = new Map();
headerImgMap.set('loading', getImage('/diagnose/loading-2.png'));
headerImgMap.set('error', getImage('/diagnose/error.png'));
headerImgMap.set('success', getImage('/diagnose/success.png'));

export const headerColorMap = new Map();
headerColorMap.set('loading', 'linear-gradient(89.95deg, #E6F5FF 0.03%, #E9EAFF 99.95%)');
headerColorMap.set(
  'error',
  'linear-gradient(89.95deg, rgba(231, 173, 86, 0.1) 0.03%, rgba(247, 111, 93, 0.1) 99.95%)',
);
headerColorMap.set('success', 'linear-gradient(89.95deg, #E8F8F7 0.03%, #EBEFFA 99.95%)');


export const getHeaderTitleMap = (t:any) => {
  const headerTitleMap = new Map();
  headerTitleMap.set('loading', t('Detail.Diagnose.util.diagnosing'));
  headerTitleMap.set('error', t('Detail.Diagnose.util.connectErr'));
  headerTitleMap.set('success', t('Detail.Diagnose.util.connectSuc'));
  return headerTitleMap
}

export const getHeaderDescMap = (t:any) => {
  const headerDescMap = new Map();
  headerDescMap.set('loading',  t('Detail.Diagnose.util.diagnosed'));
  headerDescMap.set('error', t('Detail.Diagnose.util.dealErr'));
  headerDescMap.set('success', t('Detail.Diagnose.util.debugChannel'));
  return headerDescMap
}

export const progressMap = new Map();
progressMap.set('loading', '#597EF7');
progressMap.set('error', '#FAB247');
progressMap.set('success', '#32D4A4');
