import React, { createContext, useState, useContext } from 'react';
import {
  GoalOut,
  GoalTaskOut,
  GoalTaskIn,
  GoalIn,
  GoalTaskUpdate,
  GoalUpdate,
  GoalTemplateDB,
  GoalTemplateIn,
  GoalTemplateUpdate,
} from '../../api';
import { useNavBarContext } from '../../contexts/NavBarContext';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeContext } from '../../contexts/ThemeContext';
import GoalBoard from '../../pages/GoalsPage/GoalBoard';
import { GBoardTypes } from '../GoalsPage';
export const DemoPage: React.FC = () => {
  return (
    <div>
      <GoalBoard boardType={GBoardTypes.demo} goals={[]} setGoals={() => {}} />
    </div>
  );
};

export default DemoPage;
