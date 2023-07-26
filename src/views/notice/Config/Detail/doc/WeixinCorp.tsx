// import './index.less';
import { Image } from 'ant-design-vue';
import { getImage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const WeixinCorp = () => {
    const corpId = getImage(
        '/notice/doc/config/weixin-corp/01-corpId.jpg',
    );
    const corpSecret = getImage(
        '/notice/doc/config/weixin-corp/02-corpSecret.jpg',
    );
    return (
        <div class={'doc'}>
            <div class={'url'}>
                {t('pages.iot.notice.common.weixinPlatform')}
                <a
                    href="https://work.weixin.qq.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    https://work.weixin.qq.com
                </a>
            </div>
            <h1>1. {t('common.summarize')}</h1>
            <div>
                {t('common.summarizeContent')}
            </div>
            <h1>2.{t('common.noticonfigdes')}</h1>
            <div>
                <h2>1、corpId</h2>
                <div>{t('pages.iot.notice.config.corpId')}</div>
                <div>{t('pages.iot.notice.config.getCorpId')}</div>
                <div class={'image'}>
                    <Image width="100%" src={corpId} />
                </div>
            </div>

            <h2>2、corpSecret</h2>
            <div>
                <div>{t('pages.iot.notice.config.corpSecret')}</div>
                <div>
                    {t('pages.iot.notice.config.getCorpSecret')}
                </div>
                <div class={'image'}>
                    <Image width="100%" src={corpSecret} />
                </div>
            </div>
        </div>
    );
};
export default WeixinCorp;
