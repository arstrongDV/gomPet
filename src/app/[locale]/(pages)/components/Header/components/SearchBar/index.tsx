import React from 'react';

import { Input } from 'src/components';

import style from './SearchBar.module.scss';

const SearchBar = () => {
  return (
    <Input
      className={style.searchbar}
      placeholder='Szukaj...'
      transparentBg
    />
  );
};

export default SearchBar;
