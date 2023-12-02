import React, { useState, useEffect, useContext } from 'react';
import apios from '../../utils/apios';
import { GoalOut } from '../../api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import GoalBoard from './GoalBoard';

const GoalsPage: React.FC<{ archived: boolean }> = ({ archived }) => {
  const [goals, setGoals] = useState<GoalOut[]>([]);
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

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

  return <GoalBoard goals={goals} setGoals={setGoals} archived={archived} />;
};

export default GoalsPage;
