'use client'
import React, { useEffect, useState } from 'react'
import Card from '../../Card'
import style from './memberModal.module.scss'
import Input from '../../Forms/Input'
import { OrganizationsApi } from 'src/api'
import { IUser } from 'src/constants/types'
import OutsideClickHandler from 'react-outside-click-handler'
import List from '../../List'
import Avatar from '../../Avatar'
import Button from '../../Buttons/Button'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'

type MemberModalProps = {
    organizationId?: number;
    setShowModal?: (e: boolean) => void;
}

const MemberModal = ({ organizationId, setShowModal }: MemberModalProps) => {
    const [searchName, setSearchName] = useState<string>("");
    const [allMembers, setAllMembers] = useState<IUser[]>([]);
    const [members, setMembers] = useState<IUser[]>([]);

    const [userId, setUserId] = useState<number>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    if(!organizationId) return;

    const getOrganizationMembers = async () => {
        setIsLoading(true);
        try {
          const res = await OrganizationsApi.getOrganizationMembers(organizationId);
          setAllMembers(res.data.results);
          setMembers(res.data.results);
        } catch (err) {
          console.log(err);
          setAllMembers([]);
          setMembers([]);
        } finally {
          setIsLoading(false);
        }
      };
    useEffect(() => {
        getOrganizationMembers();
    }, [])

    useEffect(() => {
        const value = searchName.toLowerCase().trim();
      
        if (!value) {
          setMembers(allMembers);
          return;
        }
      
        const filtered = allMembers.filter(member =>
          member.user.full_name?.toLowerCase().includes(value)
        );
      
        setMembers(filtered);
      }, [searchName, allMembers]);


    const changeCreator = async() => {
        try{
            await OrganizationsApi.changeOrganizationOwner(organizationId, {
                user: userId
            })
            setShowModal(false);
            toast.success("Organizacja zostala przekazana")
        }catch(err){
            console.log(err)
            toast.error("Blad przekazania organizacji")
        }
    }

  return (
    <Card className={style.container}>
        <Input
            id='search-animal'
            name='search-animal'
            label={'Wyszukaj membera'}
            placeholder={'Wpisz nazwę...'}
            value={searchName}
            onChangeText={setSearchName}
        />

        <List
            isLoading={isLoading}
            className={style.list}
        >
            {members.map((member: IUser) => (
                member.user.id !== member.organization.user && (
                    <div
                        key={member.user.id}
                        className={`${style.item} ${userId === member.user.id ? style.selected : ''}`}
                        onClick={() => setUserId(member.user.id)}
                    >
                        <Avatar
                            className={style.image}
                            profile={member.user}
                            src={member.user.image ?? undefined}
                        />

                        <div className={style.InfoSide}>
                            <p>
                            <span className={style.name}>
                                {member.user.full_name || '-'}
                            </span>
                            </p>
                            <p>Role: {member.role}</p>
                        </div>
                    </div>
                )
            ))}
        </List>
        <Button 
            label={'Przekaz organizacje'}
            onClick={changeCreator}
        />
    </Card>
  )
}

export default MemberModal
