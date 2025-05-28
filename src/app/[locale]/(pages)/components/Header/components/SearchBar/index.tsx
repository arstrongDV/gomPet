'use client'
import React, {useEffect, useState} from 'react';
import { Input, useIsMobile } from 'src/components';
import style from './SearchBar.module.scss';
import { searchOrganization } from './slice';
import { useAppDispatch, useAppSelector } from 'src/lib/store/hooks';
import classNames from 'classnames';
import Link from 'next/link';
import OutsideClickHandler from 'react-outside-click-handler';
import { Routes } from 'src/constants/routes';

const SearchBar = () => {
  const [searchValues, setSearchValues] = useState("");
  const [isActive, setIsActive] = useState(false);
  const dispatch = useAppDispatch();
  const searched = useAppSelector((state) => state.search.searchedOrganizations)
  const isMobile = useIsMobile({});

  useEffect(() => {
    dispatch(searchOrganization(searchValues));
  }, [searchValues]);

  return (
    <OutsideClickHandler onOutsideClick={() => setIsActive(false)}>
      <div className={isMobile ? style.searchbarWrapperMobile : style.searchbarWrapper}>
        <Input
          // wrapperStyle={isMobile ? style.searchbarWrapperMobile : style.searchbarWrapper}
          placeholder='Wyszukaj...'
          transparentBg
          onChange={(e) => setSearchValues(e.target.value)}
          value={searchValues}
          onFocus={() => setIsActive(true)}
        />
        <ul className={classNames(style.resultsBar, { [style.resultsBarActive]: isActive &&  searchValues.length !== 0})}>
        {searchValues.length === 0 ? null : (
          searched.length === 0 ? (
            <li className={style.NoSearchedItem}>No results</li>
          ) : (
            searched.map((item) => (
              <Link href={Routes.ORGANIZATION_PROFILE(item.id)}>
                <li className={style.searchItem} key={item.id} onClick={() => {setIsActive(false); setSearchValues('')}}>
                  {item.name}
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
