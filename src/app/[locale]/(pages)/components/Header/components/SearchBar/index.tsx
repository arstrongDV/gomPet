'use client'
import React, {useEffect, useState} from 'react';
import { Input, useIsMobile } from 'src/components';
import style from './SearchBar.module.scss';
import classNames from 'classnames';
import Link from 'next/link';
import OutsideClickHandler from 'react-outside-click-handler';
import { Routes } from 'src/constants/routes';
import Image from 'next/image';
import { OrganizationsApi } from 'src/api';
import { IOrganization } from 'src/constants/types';

const SearchBar = () => {
  const [searchValues, setSearchValues] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [organizations, setOrganizations] = useState<IOrganization[]>([]);
  const [searched, setSearched] = useState<IOrganization[]>([]);
  const isMobile = useIsMobile({});

  // Fetch organizations only once on component mount
  useEffect(() => {
    const getOrganizations = async () => {
      try {
        const res = await OrganizationsApi.getOrganizations();
        const organizationData = res.data?.results || [];
        console.log(organizationData)
        setOrganizations(organizationData);
      } catch (error: any) {
        console.log(error);
      }
    };

    getOrganizations();
  }, []); // Empty dependency array = run only once

  // Filter organizations based on search input
  useEffect(() => {
    if (searchValues.trim() === '') {
      setSearched([]);
      return;
    }
    const filteredData = organizations.filter((item) => 
      item.name.toLowerCase().includes(searchValues.toLowerCase())
    );
    setSearched(filteredData);
  }, [searchValues, organizations]); // Re-run when searchValues or organizations change

  return (
    <OutsideClickHandler onOutsideClick={() => setIsActive(false)}>
      <div className={isMobile ? style.searchbarWrapperMobile : style.searchbarWrapper}>
        <Input
          placeholder='Wyszukaj...'
          transparentBg
          onChange={(e) => setSearchValues(e.target.value)}
          value={searchValues}
          onFocus={() => setIsActive(true)}
        />
        <ul className={classNames(style.resultsBar, { 
          [style.resultsBarActive]: isActive && searchValues.length !== 0
        })}>
          {searchValues.length === 0 ? null : (
            searched.length === 0 ? (
              <li className={style.NoSearchedItem}>No results</li>
            ) : (
              searched.map((item) => (
                <Link href={Routes.ORGANIZATION_PROFILE(item.id)} key={item.id}>
                  <li className={style.searchItem} onClick={() => {
                    setIsActive(false); 
                    setSearchValues('');
                  }}>
                    {item.image && (
                      <img className={style.organizationImg} src={item.image} alt='oraganization-image' width={40} height={40} />
                    )}
                    <p>{item.name}</p>
                  </li>
                </Link>
              ))
            )
          )}
        </ul>
      </div>
    </OutsideClickHandler>
  );
};

export default SearchBar;