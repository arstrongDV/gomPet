'use client'

import { Button, Card } from "src/components";
import style from './Banner.module.scss';
import image from '../../../../../../assets/banner.png';
import { useRouter } from "next/navigation";
import { Routes } from "src/constants/routes";
import { useTranslations } from "next-intl";

const Banner = () => {
const { push } = useRouter()
const t = useTranslations('pages.landing.banner')
  // const cardStyles = {
  //   backgroundImage: `
  //     linear-gradient(
  //       90deg,
  //       rgba(0, 0, 0, 0.0) 10%,
  //       rgba(0, 0, 0, 0.5) 35%,
  //       rgba(0, 0, 0, 0.7) 50%,
  //       rgba(0, 0, 0, 0.5) 65%,
  //       rgba(0, 0, 0, 0.0) 90%
  //     ),
  //     url(${image.src})
  //   `
  // };

  return (
    <Card className={style.baner} >
        <div className={style.container}>
            {/* <h1>Znajdź swojego nowego <span className={style.greenText}>przyjaciela</span></h1> */}
            <h1>
              {t.rich('findYourFriend', {
                highlight: (chunks) => <span className={style.greenText}>{chunks}</span>
              })}
            </h1>
            <p>
              {t(`findFriendBannerText`)}
            </p>
            <Button className={style.buttonCard} icon="paw" label={t('findYourFriendBtn')} onClick={() => push(Routes.ANIMALS)} />
        </div>
    </Card>
  );
};

export default Banner;
