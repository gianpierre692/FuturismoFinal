import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ChevronLeftIcon,
  PhoneIcon,
  VideoCameraIcon,
  InformationCircleIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  MicrophoneIcon,
  CheckIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import useAuthStore from '../stores/authStore';

const ChatMobile = () => {
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // Mock data - En producción vendría del store
  const mockChats = [
    {
      id: 1,
      type: 'guide',
      name: 'Carlos Mendoza',
      avatar: 'https://i.pravatar.cc/150?img=1',
      lastMessage: 'Perfecto, nos vemos en el punto de encuentro',
      lastMessageTime: '10:30',
      unreadCount: 2,
      online: true,
      typing: false
    },
    {
      id: 2,
      type: 'client',
      name: 'María García',
      avatar: 'https://i.pravatar.cc/150?img=2',
      lastMessage: '¿A qué hora es el tour de mañana?',
      lastMessageTime: '9:45',
      unreadCount: 1,
      online: true,
      typing: false
    },
    {
      id: 3,
      type: 'guide',
      name: 'Ana López',
      avatar: 'https://i.pravatar.cc/150?img=3',
      lastMessage: 'He actualizado el itinerario del tour',
      lastMessageTime: 'Ayer',
      unreadCount: 0,
      online: false,
      typing: false
    },
    {
      id: 4,
      type: 'group',
      name: 'Equipo Valle Sagrado',
      avatar: null,
      members: ['Carlos', 'Ana', 'Luis'],
      lastMessage: 'Luis: Todo listo para mañana',
      lastMessageTime: 'Ayer',
      unreadCount: 5,
      online: true,
      typing: false
    }
  ];

  const mockMessages = [
    {
      id: 1,
      sender: 'Carlos Mendoza',
      content: 'Hola, ¿cómo estás?',
      time: '10:00',
      isMe: false,
      status: 'read'
    },
    {
      id: 2,
      sender: 'Me',
      content: 'Hola Carlos! Todo bien, preparando el tour de mañana',
      time: '10:05',
      isMe: true,
      status: 'read'
    },
    {
      id: 3,
      sender: 'Carlos Mendoza',
      content: 'Excelente! ¿Cuántos turistas tenemos confirmados?',
      time: '10:10',
      isMe: false,
      status: 'read'
    },
    {
      id: 4,
      sender: 'Me',
      content: 'Tenemos 12 turistas confirmados. 4 hablan inglés y el resto español',
      time: '10:15',
      isMe: true,
      status: 'read'
    },
    {
      id: 5,
      sender: 'Carlos Mendoza',
      content: 'Perfecto, nos vemos en el punto de encuentro',
      time: '10:30',
      isMe: false,
      status: 'read'
    }
  ];

  // Cargar chat desde parámetros de URL
  useEffect(() => {
    const guideId = searchParams.get('guide');
    const guideName = searchParams.get('name');
    
    if (guideId && guideName) {
      const guideChat = {
        id: `guide-${guideId}`,
        type: 'guide',
        name: decodeURIComponent(guideName),
        avatar: `https://i.pravatar.cc/150?img=${parseInt(guideId)}`,
        lastMessage: 'Coordinación desde agenda',
        lastMessageTime: 'Ahora',
        unreadCount: 0,
        online: true,
        typing: false,
        isFromAgenda: true
      };
      
      setSelectedChat(guideChat);
      setMessages(mockMessages);
    }
  }, [searchParams]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'Me',
        content: message,
        time: new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
        status: 'sent'
      };

      setMessages([...messages, newMessage]);
      setMessage('');

      // Simular respuesta
      setIsTyping(true);
      setTimeout(() => {
        const response = {
          id: messages.length + 2,
          sender: selectedChat.name,
          content: 'Mensaje recibido!',
          time: new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }),
          isMe: false,
          status: 'read'
        };
        setMessages(prev => [...prev, response]);
        setIsTyping(false);
      }, 2000);
    }
  };

  const getMessageStatus = (status) => {
    if (status === 'sent') return <CheckIcon className="w-4 h-4 text-gray-400" />;
    if (status === 'delivered') return <CheckIcon className="w-4 h-4 text-gray-600" />;
    if (status === 'read') return <CheckCircleIcon className="w-4 h-4 text-blue-600" />;
    return null;
  };

  const filteredChats = mockChats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Vista de chat individual
  if (selectedChat) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Header del chat */}
        <div className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setSelectedChat(null);
                setSearchParams({});
              }}
              className="p-1"
            >
              <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            {selectedChat.type === 'group' ? (
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-primary-600" />
              </div>
            ) : (
              <div className="relative">
                <img 
                  src={selectedChat.avatar} 
                  alt={selectedChat.name}
                  className="w-10 h-10 rounded-full"
                />
                {selectedChat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{selectedChat.name}</h3>
              <p className="text-xs text-gray-500">
                {isTyping ? 'Escribiendo...' : 
                 selectedChat.online ? 'En línea' : 'Desconectado'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <PhoneIcon className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <VideoCameraIcon className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <InformationCircleIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {selectedChat.isFromAgenda && (
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-sm text-blue-800">
                Chat iniciado desde la agenda para coordinar el tour
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] ${msg.isMe ? 'order-2' : 'order-1'}`}>
                <div className={`rounded-2xl px-4 py-2 ${
                  msg.isMe ? 'bg-primary-600 text-white' : 'bg-white'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                </div>
                <div className={`flex items-center gap-1 mt-1 ${
                  msg.isMe ? 'justify-end' : 'justify-start'
                }`}>
                  <span className="text-xs text-gray-500">{msg.time}</span>
                  {msg.isMe && getMessageStatus(msg.status)}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl px-4 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input de mensaje */}
        <div className="bg-white border-t border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <PaperClipIcon className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Escribe un mensaje..."
              className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {message ? (
              <button 
                onClick={handleSendMessage}
                className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            ) : (
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <MicrophoneIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Vista de lista de chats
  return (
    <div className="fixed inset-0 top-14 flex flex-col bg-gray-50">
      {/* Search Bar */}
      <div className="bg-white shadow-sm z-20 flex-shrink-0">
        <div className="px-4 py-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar conversaciones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lista de chats */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {filteredChats.length === 0 ? (
          <div className="text-center py-12">
            <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No se encontraron conversaciones</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => {
                  setSelectedChat(chat);
                  setMessages(mockMessages);
                }}
                className="bg-white rounded-lg p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
              >
                {/* Avatar */}
                {chat.type === 'group' ? (
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <ChatBubbleLeftRightIcon className="w-6 h-6 text-primary-600" />
                  </div>
                ) : (
                  <div className="relative flex-shrink-0">
                    <img 
                      src={chat.avatar} 
                      alt={chat.name}
                      className="w-12 h-12 rounded-full"
                    />
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                    <span className="text-xs text-gray-500">{chat.lastMessageTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">
                      {chat.typing ? (
                        <span className="text-primary-600 font-medium">Escribiendo...</span>
                      ) : (
                        chat.lastMessage
                      )}
                    </p>
                    {chat.unreadCount > 0 && (
                      <span className="min-w-[20px] h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center px-1">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                  {chat.type === 'group' && (
                    <p className="text-xs text-gray-500 mt-1">
                      {chat.members.join(', ')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default ChatMobile;