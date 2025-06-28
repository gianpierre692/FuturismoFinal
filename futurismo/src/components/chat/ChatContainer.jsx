import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const ChatContainer = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    if (window.innerWidth < 1024) {
      setIsMobileView(true);
    }
  };

  const handleCloseChat = () => {
    setIsMobileView(false);
    // Limpiar parámetros de URL al cerrar chat
    setSearchParams({});
  };

  // Efecto para manejar parámetros de URL (cuando viene desde agenda)
  useEffect(() => {
    const guideId = searchParams.get('guide');
    const guideName = searchParams.get('name');
    
    if (guideId && guideName) {
      // Crear un chat temporal para el guía (en una app real, esto vendría del backend)
      const guideChat = {
        id: `guide-${guideId}`,
        type: 'guide',
        name: decodeURIComponent(guideName),
        avatar: `https://i.pravatar.cc/150?img=${parseInt(guideId)}`,
        lastMessage: 'Coordinación desde agenda',
        lastMessageTime: new Date(),
        unreadCount: 0,
        online: true,
        typing: false,
        isFromAgenda: true // Marcar que viene desde agenda
      };
      
      setSelectedChat(guideChat);
      if (window.innerWidth < 1024) {
        setIsMobileView(true);
      }
    }
  }, [searchParams]);

  return (
    <div className="flex h-full bg-gray-50">
      {/* Lista de chats - oculta en móvil cuando hay chat seleccionado */}
      <div className={`w-full lg:w-80 ${isMobileView ? 'hidden lg:block' : 'block'}`}>
        <ChatList 
          onSelectChat={handleSelectChat} 
          selectedChatId={selectedChat?.id}
        />
      </div>

      {/* Ventana de chat - visible en móvil cuando hay chat seleccionado */}
      <div className={`flex-1 ${!isMobileView && !selectedChat ? 'hidden lg:flex' : 'flex'}`}>
        {selectedChat ? (
          <ChatWindow 
            chat={selectedChat} 
            onClose={handleCloseChat}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Bienvenido al Chat de Futurismo
              </h3>
              <p className="text-gray-500 max-w-sm">
                Selecciona una conversación de la lista para comenzar a chatear con guías y clientes
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatContainer;