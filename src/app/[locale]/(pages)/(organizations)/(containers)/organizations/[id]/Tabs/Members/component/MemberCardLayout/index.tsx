'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import OutsideClickHandler from 'react-outside-click-handler';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { OrganizationsApi } from 'src/api';
import { Avatar, Button, Card, Icon } from 'src/components';
import { Role } from 'src/components/hooks/useRoles';
import { IOrganization, IUser } from 'src/constants/types';
import { getDaysAgo } from 'src/utils/helpers';

import RoleSelector from './RoleSelector';

import style from './memberCardStyle.module.scss';

interface IMember {
    id: number;
    role: string;
    joined_at: string;
    updated_at: string;
    user: IUser;
    invitation_confirmed?: boolean;
    invitation_message?: string;
    organization?: IOrganization;
}

type RequestElementProps = {
    data: IMember;
    onDelete: (e: number) => void;
}

const MemberCard = ({ data, onDelete }: RequestElementProps) => {
    const {
      id,
      role,
      user,
      joined_at,
    } = data;
    const date = getDaysAgo(joined_at, true);
    const t = useTranslations('pages.organizations.memberCard');
    const tRoles = useTranslations('common.roles');
    const session = useSession();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [showSelector, setShowSelector] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);

    const MemberDelete = async () => {
        setIsLoading(true);
        try {
            await OrganizationsApi.deleteOrganizationMember(id);
            toast.success(t('deleteSuccess'));
            onDelete(id);
            setShowModal(false);
        } catch (err: any) {
            toast.error(t('deleteError'));
        } finally {
            setIsLoading(false);
        }
    };

    const MemberUpdate = async () => {
        setIsLoading(true);
        try {
            await OrganizationsApi.updateOrganizationMember(id, {
                role: selectedRole?.value
            });
            setSelectedRole(selectedRole);
            toast.success(t('updateSuccess'));
            setShowSelector(false);
        } catch (err: any) {
            toast.error(t('updateError'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (role && !selectedRole) {
            setSelectedRole(null);
        }
    }, [role]);

    return (
      <Card className={style.container} key={id}>
        <div className={style.memberInfocontainer}>
            <Avatar
                className={style.image}
                profile={user}
                src={user.image ? user.image : undefined}
            />

            <div className={style.InfoSide}>
                <div className={style.info}>
                    <p>{t('name')} <span className={style.name}>{user?.first_name || '-'}</span></p>
                    <p>{t('email')} <span className={style.name}>{user?.email || '-'}</span></p>
                    <p>{t('phone')} <span className={style.name}>{user?.phone || '-'}</span></p>
                    <div className={style.roleChange}>
                        <p>{t('role')}
                            <span className={style.date}>
                                {!showSelector
                                    ? (selectedRole?.label ? selectedRole?.label : (role ? tRoles(role) : '-'))
                                    : (
                                        <RoleSelector
                                            selectedRole={selectedRole}
                                            setSelectedRole={setSelectedRole}
                                            initialRole={selectedRole && selectedRole.value ? selectedRole.value : role}
                                        />
                                    )
                                }
                            </span>
                        </p>
                        {user.id !== Number(session.data?.user.id) && (
                            <Icon name='pencil' onClick={() => setShowSelector(prev => !prev)} />
                        )}
                    </div>
                    <p>{t('addedOn')} <span className={style.date}>{date}</span></p>
                </div>
            </div>
        </div>

        {user.id !== Number(session.data?.user.id) && (
            <div className={style.btns}>
                <Button
                    className={style.submitButton}
                    label={t('update')}
                    icon='plus'
                    onClick={MemberUpdate}
                    disabled={isLoading || !showSelector || selectedRole?.value == role}
                />
                <Button
                    className={style.deleteButton}
                    label={t('delete')}
                    onClick={() => setShowModal(prev => !prev)}
                    disabled={isLoading}
                />
            </div>
        )}

        {showModal && (
            <OutsideClickHandler onOutsideClick={() => setShowModal(false)}>
                <div className={style.drop}>
                    <Card className={style.modalIsAree}>
                        <p>{t('deleteConfirm')}</p>
                        <div className={style.btns}>
                            <Button
                                className={style.btnDel}
                                label={t('yes')}
                                onClick={MemberDelete}
                                disabled={isLoading}
                            />
                            <Button
                                className={style.btn}
                                label={t('no')}
                                onClick={() => setShowModal(false)}
                                disabled={isLoading}
                            />
                        </div>
                    </Card>
                </div>
            </OutsideClickHandler>
        )}
      </Card>
    );
  };

export default MemberCard;
