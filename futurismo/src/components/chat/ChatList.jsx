import { useState } from 'react';
import { Search, MessageSquare, Circle, Check, CheckCheck, Users } from 'lucide-react';
import { formatters } from '../../utils/formatters';

const ChatList = ({ onSelectChat, selectedChatId }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Datos mock de conversaciones
  const mockChats = [
    {
      id: '1',
      type: 'guide',
      name: 'Carlos Mendoza',
      avatar: 'https://i.pravatar.cc/150?img=1',
      lastMessage: 'Ya estamos saliendo del hotel',
      lastMessageTime: new Date(Date.now() - 300000),
      unreadCount: 2,
      online: true,
      typing: false
    },
    {
      id: '2',
      type: 'guide',
      name: 'María García',
      avatar: 'https://i.pravatar.cc/150?img=2',
      lastMessage: 'Perfecto, nos vemos mañana',
      lastMessageTime: new Date(Date.now() - 3600000),
      unreadCount: 0,
      online: true,
      typing: false
    },
    {
      id: '3',
      type: 'client',
      name: 'Juan Pérez',
      avatar: 'https://i.pravatar.cc/150?img=3',
      lastMessage: '¿El tour incluye almuerzo?',
      lastMessageTime: new Date(Date.now() - 7200000),
      unreadCount: 1,
      online: false,
      typing: false
    },
    {
      id: '4',
      type: 'group',
      name: 'Grupo Tour Machu Picchu',
      avatar: null,
      members: 8,
      lastMessage: 'Ana: Gracias por la información',
      lastMessageTime: new Date(Date.now() - 14400000),
      unreadCount: 5,
      online: true,
      typing: true,
      typingUser: 'Pedro está escribiendo...'
    },
    {
      id: '5',
      type: 'guide',
      name: 'Pedro Sánchez',
      avatar: 'https://i.pravatar.cc/150?img=5',
      lastMessage: 'Tour completado sin novedades',
      lastMessageTime: new Date(Date.now() - 86400000),
      unreadCount: 0,
      online: false,
      typing: false
    }
  ];

  const filteredChats = mockChats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (chat) => {
    if (chat.type === 'group') return null;
    return (
      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
        chat.online ? 'bg-green-500' : 'bg-gray-400'
      }`} />
    );
  };

  const getMessageStatus = (chat) => {
    if (chat.unreadCount > 0) return null;
    if (chat.type === 'client' || chat.type === 'group') return null;
    
    // Simular estado de mensaje enviado/leído
    const isRead = Math.random() > 0.5;
    return isRead ? (
      <CheckCheck className="w-4 h-4 text-blue-500" />
    ) : (
      <Check className="w-4 h-4 text-gray-400" />
    );
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header con búsqueda */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar conversación..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Lista de chats */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No se encontraron conversaciones</p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedChatId === chat.id ? 'bg-primary-50 border-l-4 border-primary-500' : ''
              }`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {chat.type === 'group' ? (
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary-600" />
                  </div>
                ) : (
                  <>
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      className="w-12 h-12 rounded-full"
                    />
                    {getStatusIcon(chat)}
                  </>
                )}
              </div>

              {/* Contenido */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900 truncate">
                    {chat.name}
                    {chat.type === 'group' && (
                      <span className="text-xs text-gray-500 ml-2">
                        ({chat.members} miembros)
                      </span>
                    )}
                  </h4>
                  <div className="flex items-center gap-2">
                    {getMessageStatus(chat)}
                    <span className="text-xs text-gray-500">
                      {formatters.formatRelativeTime(chat.lastMessageTime)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 truncate">
                    {chat.typing && chat.typingUser ? (
                      <span className="text-primary-600 italic">{chat.typingUser}</span>
                    ) : (
                      chat.lastMessage
                    )}
                  </p>
                  {chat.unreadCount > 0 && (
                    <span className="bg-primary-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer con estadísticas */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>{filteredChats.length} conversaciones</span>
          <span>
            {filteredChats.filter(c => c.unreadCount > 0).length} sin leer
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatList;