import { createContext, useContext, useState } from 'react';

const PageContext = createContext();

export function PageProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('Dashboard'); 

  const setPage = (pageName) => {
    setCurrentPage(pageName);
  };

  return (
    <PageContext.Provider value={{ currentPage, setPage }}>
      {children}
    </PageContext.Provider>
  );
}

export function usePage() {
  return useContext(PageContext);
}
