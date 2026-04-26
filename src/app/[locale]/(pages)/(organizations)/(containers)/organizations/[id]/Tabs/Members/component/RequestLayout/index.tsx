'use client'

import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import { OrganizationsApi } from "src/api";
import { Avatar, Button, Card } from "src/components";
import { IOrganization, IUser } from "src/constants/types";
import { getDaysAgo } from "src/utils/helpers";

import style from './requestElementStyle.module.scss'

type DataElements = {
    id: number;
    invitation_confirmed: boolean;
    invitation_message: string;
    organization: IOrganization;
    user: IUser;
    joined_at: string
}

type RequestElementProps = {
    data: DataElements;
    onDelete: (e: number) => void;
    onRequestApproved: (id: number, e: any) => void;
}

const RequestElement = ({ data, onDelete, onRequestApproved }: RequestElementProps) => {
    const {
      id,
      invitation_confirmed,
      invitation_message,
      organization,
      user,
      joined_at,
    } = data;
    const date = getDaysAgo(joined_at, true);
    const t = useTranslations('pages.organizations.requestCard');

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const DeleteUserRequest = async () => {
        try {
            await OrganizationsApi.deleteUserInvitation(id);
            toast.success(t('invitationRemoved'));
            onDelete(id);
        } catch (err) {
            toast.error(t('errorMessage'));
        } finally {
            setIsLoading(false);
        }
    }

    const ApproveUserRequest = async () => {
        setIsLoading(true)
        try {
            const res = await OrganizationsApi.approveUserInvitation(id, {
                invitation_confirmed: true
            });
            toast.success(t('memberAdded'));
            onDelete(id);
            onRequestApproved(id, data);
        } catch (err) {
            toast.error(t('errorMessage'));
        } finally {
            setIsLoading(false);
        }
    }

    return (
      <Card className={style.container} key={id}>
        <div className={style.wrrapper}>
          <Avatar
            className={style.image}
            profile={user}
            src={user.image ? user.image : undefined}
          />

          <div className={style.header}>
            <div className={style.info}>
              <span className={style.name}>{user?.first_name || '-'}</span>
              <span className={style.date}>{date}</span>
            </div>
          </div>
        </div>
        <div className={style.content}>
            <p className={style.text}>{invitation_message ? invitation_message : t('noMessage')}</p>
        </div>

        {invitation_confirmed ? (
            <div>
                {t('added')}
            </div>
        ) : (
            <div className={style.btns}>
                <Button
                    className={style.submitButton}
                    label={t('add')}
                    icon='plus'
                    onClick={ApproveUserRequest}
                    disabled={isLoading}
                />
                <Button
                    className={style.deleteButton}
                    label={t('remove')}
                    onClick={DeleteUserRequest}
                    disabled={isLoading}
                />
            </div>
        )}
      </Card>
    );
  };


export default RequestElement;
