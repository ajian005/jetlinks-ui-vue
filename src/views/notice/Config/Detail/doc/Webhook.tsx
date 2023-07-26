// import './index.less';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const Webhook = () => {
    return (
        <div class={'doc'}>
            <h1>1. {t('common.summarize')}</h1>
            <div>
                {t('pages.iot.notice.config.webhook')}
            </div>
            <h1>2.{t('common.noticonfigdes')}</h1>
            <h2>1、Webhook</h2>
            <div> {t('pages.iot.notice.config.webhookAddr')}</div>

            <h2>2、{t('common.reqHeader')}</h2>
            <div>
                {t('pages.iot.notice.config.reqHeader')}
            </div>
        </div>
    );
};
export default Webhook;
