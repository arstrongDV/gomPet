'use client'

import { Avatar, Button, Card, Icon } from "src/components";
import { IOrganization, IUser } from "src/constants/types";
import style from './memberCardStyle.module.scss'
import { getDaysAgo } from "src/utils/helpers";
import { useEffect, useState, useTransition } from "react";
import { OrganizationsApi } from "src/api";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import RoleSelector from "./RoleSelector";
import { Role } from "src/components/hooks/useRoles";
import OutsideClickHandler from "react-outside-click-handler";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

type DataElements = {
    id: number;
    invitation_confirmed: boolean;
    invitation_message: string;
    organization: IOrganization;
    user: IUser;
    joined_at: string;
    updated_at: string;
    role: string;
}

type RequestElementProps = {
    data: DataElements;
    onDelete: (e: number) => void;
} 

const MemberCard = ({ data, onDelete }: RequestElementProps) => {
    const {
      id,
      role,
      updated_at,
      user,
      joined_at,
    } = data;
    const date = getDaysAgo(joined_at, true);
    const t = useTranslations();
    const router = useRouter();

    const session = useSession()

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    const [showSelector, setShowSelector] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);

    const MemberDelete = async() => {
        setIsLoading(true)
        try{
            await OrganizationsApi.deleteOrganizationMember(id);
            toast.success("Member zostal usuniety");
            onDelete(id);
            setIsLoading(false);
            setShowModal(false);
        }catch(err: any){
            toast.error("Nie udalo sie usunac membera");
            setIsLoading(false)
        }
        finally{
            setIsLoading(false);
        }
    }

    const MemberUpdate = async() => {
        setIsLoading(true)
        try{
            await OrganizationsApi.updateOrganizationMember(id, {
                role: selectedRole?.value
            });
            setSelectedRole(selectedRole);
            toast.success("Member zostal aktualizowany");
            setIsLoading(false);
            setShowSelector(false);
        }catch(err: any){
            toast.error("Nie udalo sie aktualizowac membera");
            setIsLoading(false)
        }
        finally{
            setIsLoading(false);
        }
    }

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
                    <p>Imie: <span className={style.name}>{user?.first_name || '-'}</span></p>
                    <p>Email: <span className={style.name}>{user?.email || '-'}</span></p>
                    <p>Phone: <span className={style.name}>{user?.phone || '-'}</span></p>
                    <div className={style.roleChange}>
                        <p>Role: 
                            <span className={style.date}>
                                {!showSelector ? t(`common.roles.${selectedRole?.value}`) || t(`common.roles.${role}`) 
                                : 
                                (
                                    <RoleSelector 
                                        selectedRole={selectedRole} 
                                        setSelectedRole={setSelectedRole} 
                                        initialRole={role} 
                                    />
                                )}
                            </span>
                        </p>
                        {user.id !== Number(session.data?.user.id) && (
                            <Icon name="pencil" onClick={() => setShowSelector(prev => !prev)} />
                        )}
                    </div>
                    <p>Dodany dnia: <span className={style.date}>{date}</span></p>
                </div>
            </div>
        </div>

        {user.id !== Number(session.data?.user.id) && (
            <div className={style.btns}>
                <Button 
                    className={style.submitButton}
                    label={"Update"}
                    icon='plus'
                    onClick={MemberUpdate}
                    disabled={isLoading || !showSelector || selectedRole?.value == role}
                />
                <Button 
                    className={style.deleteButton}
                    label={"Delete"}
                    onClick={() => setShowModal(prev => !prev)}
                    disabled={isLoading}
                />
            </div>
        )}

        {showModal && (
            <OutsideClickHandler onOutsideClick={() => setShowModal(false)}>
                <div className={style.drop}>
                    <Card className={style.modalIsAree}>
                        <p>Czy naprawde chcesz usunac membera ze swojej organizacji? </p>
                        <div className={style.btns}>
                            <Button 
                                className={style.btnDel}
                                label={"Tak"}
                                onClick={MemberDelete}
                                disabled={isLoading}
                            />

                            <Button 
                                className={style.btn}
                                label={"Nie"}
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