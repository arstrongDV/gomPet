import React from 'react';

import { Input } from 'src/components';

import style from './SearchBar.module.scss';

const SearchBar = () => {
  return (
    <Input
      wrapperStyle={style.searchbarWrapper}
      placeholder='Wyszukaj...'
      transparentBg
    />
  );
};

export default SearchBar;
