import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();
const MenuContext = createContext();

export const useSearch = () => useContext(SearchContext);
export const useMenuContext = ()=> useContext(MenuContext);

export const SearchProvider = (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const[menuFilter , setMenuFilter] = useState('All');

  const setSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <SearchContext.Provider value={{ searchQuery, setSearch ,menuFilter, setMenuFilter}}>
      <MenuContext.Provider value={{ menuFilter, setMenuFilter}}>
      {props.children}
      </MenuContext.Provider>
    </SearchContext.Provider>
  );
};
