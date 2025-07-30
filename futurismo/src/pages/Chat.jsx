import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ChatContainer from '../components/chat/ChatContainer';
import ChatMobile from './ChatMobile';

const Chat = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return <ChatMobile />;
  }
  const [searchParams] = useSearchParams();
  const guideName = searchParams.get('name');
  const isFromAgenda = searchParams.get('guide');

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Chat</h1>
        <p className="text-gray-600 mt-2">
          {isFromAgenda && guideName ? 
            `Coordinación con ${decodeURIComponent(guideName)}` :
            'Comunícate con guías turísticos y clientes en tiempo real'
          }
        </p>
      </div>
      
      <div className="flex-1 min-h-0">
        <ChatContainer />
      </div>
    </div>
  );
};

export default Chat;