// import './index.less';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const Email = () => {
    const { t } = useI18n()
    return (
        <div class={'doc'}>
            <h1>1. {t('common.summarize')}</h1>
            <div>
                {t('common.summarizeContent')}
            </div>
            <h1>2.{t('common.noticonfigdes')}</h1>
            <h2>1、 {t('pages.iot.notice.config.serverAddress')}</h2>
            <div>
                {t('pages.iot.notice.config.serAddContent1')}
            </div>
            <div>
                {t('pages.iot.notice.config.serAddContent2')}
            </div>
            <h2>2、{t('pages.iot.notice.config.addresser')}</h2>
            <div>{t('pages.iot.notice.config.addresserContent')}</div>
            <h2>3、 {t('common.userName')}</h2>
            <div>{t('pages.iot.notice.config.userNameDes')}</div>
            <h2>4、{t('common.pwd')}</h2>
            <div>{t('pages.iot.notice.config.pwdDes')}</div>
        </div>
    );
};
export default Email;
