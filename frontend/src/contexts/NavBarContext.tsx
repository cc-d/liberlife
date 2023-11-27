import React, { createContext, useState, useContext } from 'react';

export const NavBarContext = createContext({
  showArchived: false,
  setShowArchived: (show: boolean) => {},
});

export const useNavBarContext = () => useContext(NavBarContext);

export const NavBarProvider: React.FC<any> = ({ children }) => {
  const [showArchived, setShowArchived] = useState(false);

  return (
    <NavBarContext.Provider value={{ showArchived, setShowArchived }}>
      {children}
    </NavBarContext.Provider>
  );
};
