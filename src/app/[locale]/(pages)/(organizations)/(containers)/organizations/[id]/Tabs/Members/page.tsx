'use client';
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useParams } from 'next/navigation';

import { OrganizationsApi } from 'src/api';
import { Icon, List, SectionHeader } from 'src/components';
import InfinityScroll from 'src/components/layout/InfinityScroll';

import MemberCard from './component/MemberCardLayout';
import RequestElement from './component/RequestLayout';

import style from './RequestList.module.scss';

const Members = () => {
    const params = useParams();
    const [isRequestLoading, setIsRequestLoading] = useState<boolean>(false);
    const [isMemberLoading, setIsMemberLoading] = useState<boolean>(false);
    const [showNewRequests, setShowNewRequests] = useState<boolean>(false);
    const [showMembers, setShowMembers] = useState<boolean>(true);

    const [members, setMembers] = useState<any[]>([]);
    const [userRequests, setUserRequests] = useState<any[]>([]);

    const requestCurrentPageRef = useRef(1);
    const memberCurrentPageRef = useRef(1);

    const requestListRef = useRef<HTMLDivElement | null>(null);
    const membertListRef = useRef<HTMLDivElement | null>(null);

    const hasRequestNextPageRef = useRef(true);
    const hasMemberNextPageRef = useRef(true);

const getReguestsList = async(id: number, page: number) => {
    try {
        const res = await OrganizationsApi.getUsersRequests(id, {
          page
        });

        return res.data;
    } catch (err) {
        return { results: [], next: null };
    }
};

useEffect(() => {
  requestCurrentPageRef.current = 1;
  setUserRequests([]);
  setIsRequestLoading(true);
  hasRequestNextPageRef.current = true;

  const loadInitial = async () => {
    const data = await getReguestsList(Number(params.id), 1);

    setUserRequests(data.results ?? []);
    hasRequestNextPageRef.current = !!data.next;

    setIsRequestLoading(false);
  };

  loadInitial();
}, [Number(params.id)]);

const getMoreRequests = async () => {
  if (!hasRequestNextPageRef.current) return;

  const nextPage = requestCurrentPageRef.current + 1;
  const data = await getReguestsList(Number(params.id), nextPage);

  if (!data.results.length) {
    hasRequestNextPageRef.current = false;
    return;
  }

  requestCurrentPageRef.current = nextPage;
  setUserRequests(prev => [...prev, ...data.results]);
  hasRequestNextPageRef.current = !!data.next;
};




  const getMembersList = async(id: number, page: number) => {
      // setIsLoading(true);
      try {
          const res = await OrganizationsApi.getOrganizationMembers(id, { page });
          // setMembers(res.data.results);
          // setIsLoading(false);
          return res.data;
      } catch (err) {
          console.log(err);
          // setIsLoading(false);
      }
  };

  useEffect(() => {
    memberCurrentPageRef.current = 1;
    setMembers([]);
    setIsMemberLoading(true);
    hasMemberNextPageRef.current = true;

    const getInitial = async() => {
      const data = await getMembersList(Number(params.id), 1);
      setMembers(data.results ?? []);
      hasMemberNextPageRef.current = !!data.next;
  
      setIsMemberLoading(false);
    };

    getInitial()

  }, [Number(params.id)]);

  const getMoreMembers = async () => {
    if (!hasMemberNextPageRef.current) return;
  
    const nextPage = requestCurrentPageRef.current + 1;
    const data = await getMembersList(Number(params.id), nextPage);
  
    if (!data.results.length) {
      hasMemberNextPageRef.current = false;
      return;
    }
  
    memberCurrentPageRef.current = nextPage;
    setMembers(prev => [...prev, ...data.results]);
    hasMemberNextPageRef.current = !!data.next;
  };



  const onMemberDelete = (id: number) => {
    setMembers((prev) => prev.filter((m: any) => m.id !== id));
  };
  const onRequestDelete = (id: number) => {
    setUserRequests((prev) => prev.filter((m: any) => m.id !== id));
  };

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
        <div className={style.labelContentContainer} onClick={() => setShowNewRequests((prev) => !prev)}>
          <span className={style.labelContent}>
            <h3>
              {showNewRequests ? 'Schowaj nowe requesty od uzytkownikow' : 'Zobacz nowe requesty od uzytkownikow'}
            </h3>

            {userRequests.length > 0 && (
                <span className={style.newLabel}>( Nowe )</span>
            )}
          </span>

          <span>
            <Icon name={showNewRequests ? 'chevronUp' : 'chevronDown'} />
          </span>
        </div>

        {showNewRequests && (
          <div className={classNames(style.requestsList, { [style.show]: showNewRequests })}>
            <SectionHeader
              title={'Zobacz nadeslane requesty do was'}
              subtitle={'Zwiekszajcie wasza organizacje'}
              margin
            />

            <List 
                isLoading={isRequestLoading}
                className={style.list}
                ref={requestListRef}
            >  
            Brak
              <InfinityScroll
                loadMore={getMoreRequests}
                hasNext={hasRequestNextPageRef.current}
                rootRef={requestListRef as React.RefObject<HTMLElement>}
              >
                {userRequests.map(request => (
                      <RequestElement 
                        key={request.id}
                        data={request} 
                        onDelete={onRequestDelete} 
                        onRequestApproved={onRequestApproved} 
                      />
                  ))}
              </InfinityScroll>
            </List> 
          </div>
        )} 
      </div>



      <div className={style.requestLabel}>
        <div className={style.labelContentContainer} onClick={() => setShowMembers((prev) => !prev)}>
          <span className={style.labelContent}>
            <h3>
              {showNewRequests ? 'Showaj memberow waszej organizacji' : 'Pokaz memberow waszej organizacji'}
            </h3>
          </span>

          <span>
            <Icon name={showMembers ? 'chevronUp' : 'chevronDown'} />
          </span>
        </div>

        {showMembers && (
          <div className={classNames(style.requestsList, { [style.show]: showMembers })}>
            <SectionHeader
              title={'Zobacz waszych memberow'}
              subtitle={'Zwiekszajcie wasza organizacje'}
              margin
            />
            <List 
                isLoading={isMemberLoading}
                className={style.list}
                ref={membertListRef}
            >  
              <InfinityScroll
                loadMore={getMoreMembers}
                hasNext={hasMemberNextPageRef.current}
                rootRef={membertListRef as React.RefObject<HTMLElement>}
              >
                {members.map(member => (
                    <MemberCard 
                      key={member.id} 
                      data={member} 
                      onDelete={onMemberDelete} 
                    />
                ))}
              </InfinityScroll>
            </List> 
          </div>
        )}
      </div>

      {/* <LabelLink 
        label={showMembers ? 'Showaj memberow waszej organizacji' : 'Pokaz memberow waszej organizacji'}
        onClick={() => setShowMembers((prev) => !prev)}
        icon={showMembers ? 'chevronUp' : 'chevronDown'}
      /> */}

      {/* <div className={classNames(style.membersList, { [style.show]: showMembers })}>
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
      </div> */}
    </div>
  )
}

export default Members;
