import React, { useState, useEffect, useContext } from 'react';
import apios from '../../utils/apios';
import { GoalOut } from '../../api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import GoalBoard from './GoalBoard';

export enum GBoardTypes {
  demo = 'demo',
  default = 'default',
  archived = 'archived',
  snapshot = 'snapshot',
}

const GoalsPage: React.FC<{ boardType: string }> = ({ boardType }) => {
  const [goals, setGoals] = useState<GoalOut[]>([]);
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const archived = boardType === GBoardTypes.archived;

  useEffect(() => {
    if (!localStorage.getItem('token') || (!auth?.userLoading && !auth?.user)) {
      navigate('/login');
      return;
    }

    const fetchGoals = async () => {
      try {
        const response = await apios.get('/goals?archived=' + archived);
        setGoals(response.data);
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          auth.logout();
          navigate('/login');
        }
      }
    };

    fetchGoals();
  }, [auth, navigate]);

  return <GoalBoard goals={goals} setGoals={setGoals} boardType={boardType} />;
};

export default GoalsPage;
