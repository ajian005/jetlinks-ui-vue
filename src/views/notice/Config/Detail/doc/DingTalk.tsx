// import './index.less';
import { Image } from 'jetlinks-ui-components';
import { getImage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const DingTalk = () => {
    const { t } = useI18n()
    const appKey = getImage(
        '/notice/doc/config/dingTalk-message/01-AppKey.jpg',
    );
    const appSecret = getImage(
        '/notice/doc/config/dingTalk-message/02-AppSecret.jpg',
    );

    return (
        <div class={'doc'}>
            <div class={'url'}>
                {t('pages.iot.notice.config.dingding')}
                <a
                    href="https://open-dev.dingtalk.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    https://open-dev.dingtalk.com
                </a>
            </div>
            <h1>1.{t('common.summarize')}</h1>
            <div>
                {t('common.summarizeContent')}
            </div>
            <h1>2.{t('common.noticonfigdes')}</h1>
            <div>
                <h2>1、AppKey</h2>
                <div>
                    {t('pages.iot.notice.config.appKeyContent1')}
                </div>
                <div>{t('pages.iot.notice.config.appKeyContent2')}</div>
                <div class={'image'}>
                    <Image width="100%" src={appKey} />
                </div>
            </div>
            <h2>2、AppSecret</h2>
            <div>
                <div>{t('pages.iot.notice.config.AppSecret')}</div>
                <div>{t('pages.iot.notice.config.appKeyContent2')}</div>
                <div class={'image'}>
                    <Image width="100%" src={appSecret} />
                </div>
            </div>
        </div>
    );
};
export default DingTalk;
