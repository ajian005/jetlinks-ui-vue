// import './index.less';
import { Image } from 'ant-design-vue';
import { getImage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const WeixinApp = () => {
    const { t } = useI18n()
    const appId = getImage('/notice/doc/config/weixin-official/01-AppID.jpg');
    const appSecret = getImage(
        '/notice/doc/config/weixin-official/02-AppSecret.jpg',
    );

    return (
        <div class={'doc'}>
            <div class={'url'}>
                {t('pages.iot.notice.config.wx')}
                <a
                    href="https://mp.weixin.qq.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    https://mp.weixin.qq.com/
                </a>
            </div>
            <h1>1. {t('common.summarize')}</h1>
            <div>
                {t('common.summarizeContent')}
            </div>
            <h1>2.{t('common.noticonfigdes')}</h1>
            <div>
                <h2>1、AppID</h2>
                <div> {t('pages.iot.notice.config.AppID')}</div>
                <div>
                    {t('pages.iot.notice.config.getAppID')}
                </div>
                <div class={'image'}>
                    <Image width="100%" src={appId} />
                </div>
            </div>
            <h2>2、AppSecret</h2>
            <div>
                <div>{t('pages.iot.notice.config.WxAppSecret')}</div>
                <div>
                    {t('pages.iot.notice.config.getAppID')}
                </div>
                <div class={'image'}>
                    <Image width="100%" src={appSecret} />
                </div>
            </div>
        </div>
    );
};
export default WeixinApp;
