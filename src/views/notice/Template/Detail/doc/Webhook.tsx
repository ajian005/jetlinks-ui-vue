// import './index.less';
import { useI18n } from 'vue-i18n'
const Webhook = () => {
  const { t } = useI18n()
  return (
    <div class="doc">
      <h1>1. {t('common.summarize')}</h1>
      <div>
        {t('pages.iot.notice.template.summarize')}
      </div>
      <h1>2.{t('pages.iot.notice.template.temDisDes')}</h1>
      <div>
        1、{t('pages.iot.notice.template.webhookReq')}
      </div>
    </div>
  );
};
export default Webhook;
