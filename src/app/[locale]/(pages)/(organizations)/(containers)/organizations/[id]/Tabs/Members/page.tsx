'use client'
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { OrganizationsApi } from 'src/api'
import { Card, LabelLink, List, SectionHeader } from 'src/components';
import RequestElement from './component/RequestLayout';
import style from './RequestList.module.scss'
import classNames from 'classnames';
import MemberCard from './component/MemberCardLayout';

const Members = () => {
    const params = useParams();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showNewRequests, setShowNewRequests]= useState<boolean>(false);
    const [showMembers, setShowMembers]= useState<boolean>(true);

    const [members, setMembers] = useState([]);
    const [userRequests, setUserRequests] = useState([]);

    useEffect(() => {
      const getReguestsList = async() => {
          setIsLoading(true)
          try{
              const res = await OrganizationsApi.getUsersRequests(Number(params.id))
              setUserRequests(res.data.results);
              setIsLoading(false)
          }catch(err){
              console.log(err);
              setIsLoading(false)
          }
      }
      getReguestsList();
  }, [params.id])

    useEffect(() => {
        const getMembersList = async() => {
            setIsLoading(true)
            try{
                const res = await OrganizationsApi.getOrganizationMembers(Number(params.id))
                setMembers(res.data.results);
                setIsLoading(false)
            }catch(err){
                console.log(err);
                setIsLoading(false)
            }
        }
        getMembersList();
    }, [params.id])

    const onMemberDelete = (id: number) => {
      setMembers((prev) => prev.filter((m: any) => m.id !== id));
    }
    const onRequestDelete = (id: number) => {
      setUserRequests((prev) => prev.filter((m: any) => m.id !== id));
    }

    const onRequestApproved = (id: number, request: any) => {
      onRequestDelete(id);
    
      const newMember = {
        id: request.id,              // albo res.data.id
        role: 'MEMBER',               // domyślna rola
        joined_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: request.user,           // 👈 TERAZ OK
      };
    
      setMembers(prev => [...prev, newMember]);
    };

  return (
    <div className={style.container}>
      <div className={style.requestLabel}>
        <LabelLink 
          label={showNewRequests ? 'Schowaj nowe requesty od uzytkownikow' : 'Zobacz nowe requesty od uzytkownikow'}
          onClick={() => setShowNewRequests((prev) => !prev)}
          icon={showNewRequests ? 'chevronUp' : 'chevronDown'}
          color='black'
        />
        {userRequests.length > 0 && (
          <p className={style.newLabel}>( Nowe )</p>
        )}
      </div>

      <div className={classNames(style.requestsList, { [style.show]: showNewRequests })}>
        <SectionHeader
          title={'Zobacz nadeslane requesty do was'}
          subtitle={'Zwiekszajcie wasza organizacje'}
          margin
        />

        <List 
            isLoading={isLoading}
            className={style.list}
        >  
            {userRequests.map(request => (
                <RequestElement data={request} onDelete={onRequestDelete} onRequestApproved={onRequestApproved} />
            ))}
        </List> 
      </div>

      <LabelLink 
        label={showMembers ? 'Showaj memberow waszej organizacji' : 'Pokaz memberow waszej organizacji'}
        onClick={() => setShowMembers((prev) => !prev)}
        icon={showMembers ? 'chevronUp' : 'chevronDown'}
      />

      <div className={classNames(style.membersList, { [style.show]: showMembers })}>
        <SectionHeader
          title={'Zobacz waszych memberow'}
          subtitle={'Zwiekszajcie wasza organizacje'}
          margin
        />

        <List 
            isLoading={isLoading}
            className={style.list}
        >  
            {members.map(request => (
                <MemberCard data={request} onDelete={onMemberDelete} />
            ))}
        </List> 
      </div>
    </div>
  )
}

export default Members;