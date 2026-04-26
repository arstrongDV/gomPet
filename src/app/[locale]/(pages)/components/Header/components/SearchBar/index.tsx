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
import { useTranslations } from 'next-intl';

const SearchBar = () => {
  const [searchValues, setSearchValues] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [organizations, setOrganizations] = useState<IOrganization[]>([]);
  const isMobile = useIsMobile({});
  const [debouncedValue, setDebouncedValue] = useState("");
  const t = useTranslations('header.searchBar')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValues(e.target.value);
  };

    const getOrganizations = async (searchValues: string) => {
      try {
        const res = await OrganizationsApi.getOrganizations({
          name: searchValues.trim()
        });
        const organizationData = res.data?.results || [];
        console.log(organizationData)
        setOrganizations(organizationData);
      } catch (error: any) {
        console.log(error);
      }
    };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchValues);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValues]);

  useEffect(() => {
    if(!debouncedValue || debouncedValue.length <= 3) {
      return;
    }

    getOrganizations(debouncedValue);
  }, [debouncedValue]);

  return (
    <OutsideClickHandler onOutsideClick={() => setIsActive(false)}>
      <div className={isMobile ? style.searchbarWrapperMobile : style.searchbarWrapper}>
        <Input
          placeholder={t('search')}
          transparentBg
          onChange={handleChange}
          value={searchValues}
          onFocus={() => setIsActive(true)}
        />
        <ul className={classNames(style.resultsBar, { 
          [style.resultsBarActive]: isActive && searchValues.length >= 4 
        })}>
          {searchValues.length <= 3 ? null : (
            organizations.length === 0 ? (
              <li className={style.NoSearchedItem}>No results</li>
            ) : (
              organizations.map((item) => (
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