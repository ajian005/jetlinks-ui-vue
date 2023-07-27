// import './index.less';
import { useI18n } from 'vue-i18n'

const AliyunVoice = () => {
  const { t } = useI18n()
  return (
    <div class="doc">
      <div class="url">
        {t('pages.iot.notice.template.aliVoice')}
        <a href="https://account.console.aliyun.com" target="_blank" rel="noopener noreferrer">
          https://account.console.aliyun.com
        </a>
      </div>
      <h1>1. {t('common.summarize')}</h1>
      <div>
        {t('pages.iot.notice.template.summarize') + t('pages.iot.notice.template.aliVoiceSumm')}
      </div>
      <h1>2.{t('pages.iot.notice.template.temDisDes')}</h1>
      <div>
        <h2>1、{t('pages.iot.notice.template.bindConfig')}</h2>
        <div> {t('pages.iot.notice.template.configTip')}</div>
        <h2>2、{t('common.type')}</h2>
        <div> {t('pages.iot.notice.template.aliVoiceType')}</div>
        <h2> 3、{t('pages.iot.notice.template.templateID')}</h2>
        <div> {t('pages.iot.notice.template.aliTemplateIdTip')}</div>
        <h2> 4、{t('pages.iot.notice.template.called')}</h2>
        <div>{t('pages.iot.notice.template.alicalledTip1')}</div>
        <div>{t('pages.iot.notice.template.alicalledTip2')}</div>
        <div>{t('pages.iot.notice.template.alicalledTip3')}</div>
        <h2> 5、{t('pages.iot.notice.template.calledSignal')}</h2>
        <div> {t('pages.iot.notice.template.aliCalledSignal')}</div>
        <h2> 6、{t('pages.iot.notice.template.plays')}</h2>
        <div>{t('pages.iot.notice.template.aliPlays')} </div>
        <h2> 7、{t('pages.iot.notice.template.temContent')}</h2>
        <div>
          {t('pages.iot.notice.template.aliTemplateContent')}
        </div>
      </div>
    </div>
  );
};
export default AliyunVoice;
