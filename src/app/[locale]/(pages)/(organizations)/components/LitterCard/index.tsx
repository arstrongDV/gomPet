import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { OrganizationsApi } from 'src/api';
import { Card } from 'src/components';
import SettingsButton from 'src/components/layout/Settings';
import { Routes } from 'src/constants/routes';
import { ILitter } from 'src/constants/types';

import style from './LitterCard.module.scss';

type LitterCardProps = {
  litter: ILitter;
  organizationUser: number;
  onDelete?: (id: number) => void;
};

const LitterCard = ({ litter, organizationUser, onDelete }: LitterCardProps) => {
  const t = useTranslations('pages');
  const session = useSession();
  const myId = Number(session.data?.user.id)
  const route = useRouter();
  const { push } = route;

  const deleteLitter = async() => {
    try {
      const res = await OrganizationsApi.deleteOrganizationLitters(litter.id);
  
      if (!res || (res.status && res.status >= 400)) {
        console.error("API returned an error:", res);
        toast.error("Błąd usunięcia");
        return;
      }
      onDelete?.(litter.id);
      toast.success("Miot został usunięty");
    } catch (err) {
      console.error("Delete litter error:", err);
      // toast.error("Błąd usunięcia");
    }
  };

  const updateLitter = () => {
    push(Routes.LITTER_EDIT(litter.id));
  }
  
  const isAfter = new Date(litter.birth_date) > new Date();
  return (
    <Card className={style.litter}>
      <div className={style.modalSettings}>
        <SettingsButton 
            onEdit={updateLitter}
            onDelete={deleteLitter}
            authId={organizationUser} 
            align="right"
          />
      </div>

      <h3>{litter.title}</h3>

      <div className={style.group}>
      <span className={style.label}>
        {t(`animals.species.${litter.species?.label?.toLowerCase?.() || 'unknown'}`)}
      </span>
        <span className={style.text}>{litter.breed?.label}</span>
      </div>

      <div className={style.group}>
        <span className={style.label}>
          {isAfter ? t('organizations.litters.litterDate') : t('organizations.litters.anticipatedDate')}
        </span>
        <span className={style.text}>{new Date(litter.birth_date).toLocaleDateString()}</span>
      </div>

      <div className={classNames(style.status, style[litter.status])}>
        {t(`organizations.litters.status.${litter.status}`)}
      </div>
      <p className={style.description}>{litter.description}</p>
    </Card>
  );
};

export default LitterCard;
