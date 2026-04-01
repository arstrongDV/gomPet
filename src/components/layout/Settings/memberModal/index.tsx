'use client'
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { OrganizationsApi } from 'src/api';
import { IUser } from 'src/constants/types';

import Avatar from '../../Avatar';
import Button from '../../Buttons/Button';
import Card from '../../Card';
import Input from '../../Forms/Input';
import List from '../../List';

import style from './memberModal.module.scss';

type MemberModalProps = {
    organizationId?: number;
    setShowModal?: (e: boolean) => void;
}

type OrganizationMember = {
    id: number;
    role: string;
    user: IUser;
    organization: {
        user: number;
    };
};

const MemberModal = ({ organizationId, setShowModal }: MemberModalProps) => {
    const [searchName, setSearchName] = useState<string>("");
    const [allMembers, setAllMembers] = useState<OrganizationMember[]>([]);
    const [members, setMembers] = useState<OrganizationMember[]>([]);

    const [userId, setUserId] = useState<number>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    if(!organizationId) return null;

    const getOrganizationMembers = async () => {
        setIsLoading(true);
        try {
          const res = await OrganizationsApi.getOrganizationMembers(organizationId, { page: 1 });
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
            setShowModal?.(false);
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
            {members.map((member: OrganizationMember) => (
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
            disabled={isLoading || !userId}
            onClick={changeCreator}
        />
    </Card>
  )
}

export default MemberModal
