import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import OutsideClickHandler from 'react-outside-click-handler';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { OrganizationsApi, PostsApi } from 'src/api';
import { Button, Card, Icon, Input, LabelLink, OrganizationTypeName } from 'src/components';
import FollowingButton from 'src/components/layout/PostCard/components/FollowingButton';
import SettingsButton from 'src/components/layout/Settings';
import { Routes } from 'src/constants/routes';
import { IOrganization } from 'src/constants/types';
import { toNumberFormat } from 'src/utils/helpers';

import style from './BusinessCard.module.scss';

type BusinessCardProps = {
  organization: IOrganization;
  className?: string;
  variant?: 'horizontal' | 'vertical';
};

const BusinessCard = ({ organization, variant = 'horizontal' }: BusinessCardProps) => {
  const { name, image, phone, email, address, id } = organization;
  const t = useTranslations();
  const { push } = useRouter();

  const [invitationMessage, setInvitationMessage] = useState<string>('Chce dolaczyc');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [followedAuthors, setFollowedAuthors] = useState<Record<number, number>>({});
  const [followers, setFollowers] = useState<number>(0);

  const session = useSession();

  const organizationId = Number(session.data?.user.id);
  const isOwner = organizationId === organization.user;

  const [isMobile, setIsMobile] = useState(false);
  const currentVariant = isMobile ? "vertical" : variant;

  useEffect(() => {
    const media = window.matchMedia('(max-width: 600px)');

    const listener = () => setIsMobile(media.matches);

    listener();
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, []);

  const getOrganizationFollowers = async (target_id: number) => {
    try {
      const organizationFollowersRes = await PostsApi.Following(
        'users.organization',
        target_id
      );
      setFollowers(organizationFollowersRes.data.followers_count);
    } catch (err) {
      setFollowers(0);
    }
  };
  
  useEffect(() => {
    getOrganizationFollowers(id);
  }, [id]);

  const sendJoinRequest = () => {
    try {
      const res = OrganizationsApi.postJoinRequest({
        user: session.data?.user.id,
        organization: id,
        role: "VOLUNTEER",
        invitation_message: invitationMessage
      })
      console.log(res)
      toast.success("Request was sended");
      setShowModal(false);
    } catch (err) {
      console.log(err);
      toast.success("Nie udalo sie nadeslac ...")
    }
  }

  const deleteOrganization = async() => {
    try {
      const res_delete = await OrganizationsApi.deleteOrganizationProfile(id);
      console.log(res_delete);
      push('/my-animals')
      toast.success("Organizacja usunieta")
    } catch (err) {
      console.log(err);
      toast.error("Nie udalo sie usunac organizacje")
    }
  }

  const handleUpdateClick = () => {
    push(Routes.ORGANIZATION_EDIT(id))
  };

  const vertical = (
    <>
      <header className={style.header}>
        <div className={style.dataHeader}>
          <OrganizationTypeName type={organization.type} />
          <h1 className={style.name}>{name}</h1>
        </div>

        {isOwner && (
        <>
          <div className={style.settingsContainer}>
            <SettingsButton 
              authId={organization.user} 
              onDelete={deleteOrganization}
              onEdit={handleUpdateClick}
              organizationId={id}
            />
          </div>
      </>
      )}
      </header>

      {image && (
        <img
          src={image}
          alt={name}
          className={style.logo}
        />
      )}

      <div className={style.location}>
        <Icon
          className={style.icon}
          name='mapPin'
        />
        <span className={style.text}>
          {address?.street} {address?.house_number}, {address?.zip_code} {address?.city || t('common.noLocation')}
        </span>
      </div>

      <div className={style.contact}>
        {isOwner ? (
          <span className={style.followers}>{followers ?? 0} <Icon name='people' /></span>
        ) : (
          <div className={style.subscribtion}>
            <span className={style.followers}>{followers ?? 0} <Icon name='people' /></span>
            <FollowingButton 
              target_type="users.organization" 
              authorId={id} 
              followedAuthors={followedAuthors}
              setFollowedAuthors={setFollowedAuthors}
            />
          </div>
        )}

        {phone && (
          <Button
            icon='phone'
            label={toNumberFormat(phone)}
            hrefOutside={`tel:${phone}`}
          />
        )}
        {email && (
          <Button
            icon='mail'
            label={'Napisz do nas'}
            hrefOutside={`mailto:${email}`}
            empty
          />
        )}
        {!isOwner && session.status === 'authenticated' && (
          <LabelLink 
            className={style.link} 
            onClick={() => setShowModal(prev => !prev)}
            label={'Dolacz do nas'}
            icon='arrowRight'
          />
        )}

      </div>
    </>
  );

  const horizontal = (
    <>
      <header className={style.header}>
        <div className={style.dataHeader}>
          <OrganizationTypeName type={organization.type} />
          <h1 className={style.name}>{name}</h1>
        </div>

      {isOwner && (
        <>
          <div className={style.settingsContainer}>
            <SettingsButton 
              authId={organization.user} 
              onDelete={deleteOrganization}
              onEdit={handleUpdateClick}
              organizationId={id}
            />
          </div>
      </>
      )}
      </header>

      <div className={style.row}>
        {image && (
          <img
            src={image}
            alt={name}
            className={style.logo}
          />
        )}

        <div className={style.contact}>
          {isOwner ? (
            <span className={style.followers}>{followers ?? 0} <Icon name='people' /></span>
          ) : (
            <div className={style.subscribtion}>
              <span className={style.followers}>{followers ?? 0} <Icon name='people' /></span>
              <FollowingButton 
                target_type="users.organization" 
                authorId={id} 
                followedAuthors={followedAuthors}
                setFollowedAuthors={setFollowedAuthors}
              />
          </div>
          )}

          {phone && (
            <Button
              icon='phone'
              label={toNumberFormat(phone)}
              hrefOutside={`tel:${phone}`}
            />
          )}
          {email && (
            <Button
              icon='mail'
              label={'Napisz do nas'}
              hrefOutside={`mailto:${email}`}
              empty
            />
          )}
          {!isOwner && session.status === 'authenticated' && (
            <LabelLink 
              className={style.link} 
              onClick={() => setShowModal(prev => !prev)}
              label={'Dolacz do nas'}
              icon='arrowRight'
            />
          )}

            {/* <Button
              icon='plus'
              label={'Dolacz do nas'}
              onClick={sendJoinRequest}
              empty
            /> */}
        </div>
      </div>

      <div className={style.location}>
        <Icon
          className={style.icon}
          name='mapPin'
        />
        <span className={style.text}>
          {address?.street} {address?.house_number}, {address?.zip_code} {address?.city || t('common.noLocation')}
        </span>
      </div>
    </>
  );

  return (
    <Card className={classNames(style.container, style[variant])}>
      {/* {variant === 'horizontal' && horizontal}
      {variant === 'vertical' && vertical} */}
      {currentVariant === 'horizontal' && horizontal}
      {currentVariant === 'vertical' && vertical}

      {showModal && (
        <OutsideClickHandler onOutsideClick={() => setShowModal(false)}>
          <Card className={style.modal}>
            <Input 
              id="message"
              name="message"
              className={style.inputs}
              label="Wiadomość z zaproszeniem"
              placeholder='Wpis czemu chces dolaczyc' 
              value={invitationMessage}
              onChangeText={setInvitationMessage}
              required
            />

            <Button 
              label="Nadeslac"
              onClick={sendJoinRequest}
              icon='arrowRight'
            />
          </Card>
        </OutsideClickHandler>
      )}
    </Card>
  );
};

export default BusinessCard;