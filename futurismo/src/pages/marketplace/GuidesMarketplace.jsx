import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Este componente redirige a la nueva estructura del marketplace
const GuidesMarketplace = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/marketplace', { replace: true });
  }, [navigate]);

  return null;
};

export default GuidesMarketplace;