// import './index.less';
import { useI18n } from 'vue-i18n'
const DingTalkRebot = () => {
  const b = '{name}';
  const { t } = useI18n()
  return (
    <div class="doc">
      <div class="url">
        {t('pages.iot.notice.template.dingdingOpnen')}
        <a href="https://open-dev.dingtalk.com" target="_blank" rel="noopener noreferrer">
          https://open-dev.dingtalk.com
        </a>
      </div>
      <h1>1. {t('common.summarize')}</h1>
      <div>
        {t('pages.iot.notice.template.summarize')}
      </div>
      <div>
        {t('pages.iot.notice.template.ddRobotSumm')}
      </div>
      <h1>2.{t('pages.iot.notice.template.temDisDes')}</h1>
      <div>
        <h2> 1、{t('pages.iot.notice.template.bindConfig')}</h2>
        <div> {t('pages.iot.notice.template.configTip')}</div>
        <h2> 2、{t('pages.iot.notice.template.messageType')}</h2>
        <div>  {t('pages.iot.notice.template.messageTypeTip')}</div>
        <h2> 3、{t('pages.iot.notice.template.temContent')}</h2>
        <div>
          {t('pages.iot.notice.template.ddRTemplateContent')}
        </div>
      </div>
    </div>
  );
};
export default DingTalkRebot;
