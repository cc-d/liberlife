import React, { createContext, useState, useContext } from 'react';
import { GoalOut } from '../api';

export const NavBarContext = createContext({
  goals: [] as GoalOut[],
  setGoals: (goals: GoalOut[]) => {},
});

export const useNavBarContext = () => useContext(NavBarContext);

export const NavBarProvider: React.FC<any> = ({ children }) => {
  const [showArchived, setShowArchived] = useState(false);
  const [goals, setGoals] = useState<GoalOut[]>([]); // Define state for goals

  return (
    <NavBarContext.Provider value={{ goals, setGoals }}>
      {children}
    </NavBarContext.Provider>
  );
};
