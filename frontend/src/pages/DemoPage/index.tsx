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
  TaskStatus,
} from '../../api';
import { useNavBarContext } from '../../contexts/NavBarContext';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeContext } from '../../contexts/ThemeContext';
import GoalBoard from '../../pages/GoalsPage/GoalBoard';
import GoalsPage, { GBoardTypes } from '../GoalsPage';

import { FakeGoals } from './data';

export const DemoPage: React.FC = () => {
  return <GoalsPage boardType={GBoardTypes.demo} boardGoals={FakeGoals} />;
};

export default DemoPage;
