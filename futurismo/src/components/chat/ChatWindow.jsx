import { useState, useRef, useEffect } from 'react';
import { 
  Send, Paperclip, Smile, MoreVertical, Phone, Video, 
  Info, Image as ImageIcon, FileText, MapPin, Clock,
  Check, CheckCheck, X, Users
} from 'lucide-react';
import { formatters } from '../../utils/formatters';
import { useAuthStore } from '../../stores/authStore';

const ChatWindow = ({ chat, onClose }) => {
  const { user } = useAuthStore();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Datos mock de mensajes
  const getInitialMessages = () => {
    if (chat?.isFromAgenda) {
      return [
        {
          id: '1',
          senderId: 'system',
          senderName: 'Sistema',
          content: `Chat de coordinación iniciado con ${chat.name}`,
          timestamp: new Date(),
          type: 'system',
          status: 'read'
        }
      ];
    }
    
    return [
      {
        id: '1',
        senderId: chat?.id,
        senderName: chat?.name,
        content: 'Hola, ¿cómo están todos?',
        timestamp: new Date(Date.now() - 3600000),
        type: 'text',
        status: 'read'
      },
    {
      id: '2',
      senderId: 'current-user',
      senderName: 'Tú',
      content: 'Hola! Todo bien, ya estamos listos para el tour de mañana',
      timestamp: new Date(Date.now() - 3000000),
      type: 'text',
      status: 'read'
    },
    {
      id: '3',
      senderId: chat?.id,
      senderName: chat?.name,
      content: 'Perfecto! Les recuerdo que el punto de encuentro es en la Plaza de Armas a las 9:00 AM',
      timestamp: new Date(Date.now() - 2400000),
      type: 'text',
      status: 'read'
    },
    {
      id: '4',
      senderId: chat?.id,
      senderName: chat?.name,
      content: 'location',
      timestamp: new Date(Date.now() - 2340000),
      type: 'location',
      location: {
        name: 'Plaza de Armas de Lima',
        address: 'Cercado de Lima 15001',
        lat: -12.0464,
        lng: -77.0428
      },
      status: 'read'
    },
    {
      id: '5',
      senderId: 'current-user',
      senderName: 'Tú',
      content: 'Entendido, ahí estaremos',
      timestamp: new Date(Date.now() - 1800000),
      type: 'text',
      status: 'delivered'
    },
    {
      id: '6',
      senderId: chat?.id,
      senderName: chat?.name,
      content: 'Les comparto el itinerario del tour',
      timestamp: new Date(Date.now() - 600000),
      type: 'text',
      status: 'read'
    },
    {
      id: '7',
      senderId: chat?.id,
      senderName: chat?.name,
      content: 'document',
      timestamp: new Date(Date.now() - 540000),
      type: 'document',
      document: {
        name: 'Itinerario_City_Tour_Lima.pdf',
        size: '2.5 MB'
      },
      status: 'read'
    },
    {
      id: '8',
      senderId: 'current-user',
      senderName: 'Tú',
      content: chat?.typing ? '' : 'Ya estamos saliendo del hotel',
      timestamp: new Date(Date.now() - 300000),
      type: 'text',
      status: 'sent'
    }
    ];
  };

  const [messages, setMessages] = useState(() => getInitialMessages());

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: 'current-user',
      senderName: 'Tú',
      content: message,
      timestamp: new Date(),
      type: 'text',
      status: 'sent'
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Simular cambio de estado del mensaje
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
      ));
    }, 2000);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simular envío de archivo
      console.log('Archivo seleccionado:', file.name);
    }
  };

  const renderMessage = (msg) => {
    const isCurrentUser = msg.senderId === 'current-user';
    const isSystemMessage = msg.type === 'system';

    if (isSystemMessage) {
      return (
        <div key={msg.id} className="flex justify-center mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 max-w-md">
            <p className="text-sm text-blue-800 text-center">{msg.content}</p>
            <div className="text-xs text-blue-600 text-center mt-1">
              {formatters.formatTime(msg.timestamp)}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        key={msg.id}
        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? 'order-2' : 'order-1'}`}>
          {!isCurrentUser && chat?.type === 'group' && (
            <p className="text-xs text-gray-500 mb-1 ml-2">{msg.senderName}</p>
          )}
          
          <div className={`relative rounded-lg px-4 py-2 ${
            isCurrentUser 
              ? 'bg-primary-500 text-white' 
              : 'bg-gray-100 text-gray-900'
          }`}>
            {msg.type === 'text' && (
              <p className="text-sm">{msg.content}</p>
            )}

            {msg.type === 'location' && (
              <div className="cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium text-sm">{msg.location.name}</span>
                </div>
                <p className="text-xs opacity-90">{msg.location.address}</p>
                <div className="mt-2 h-32 bg-gray-200 rounded overflow-hidden">
                  <img 
                    src={`https://maps.googleapis.com/maps/api/staticmap?center=${msg.location.lat},${msg.location.lng}&zoom=15&size=300x150&markers=${msg.location.lat},${msg.location.lng}&key=YOUR_API_KEY`}
                    alt="Mapa"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {msg.type === 'document' && (
              <div className="flex items-center gap-3 cursor-pointer">
                <FileText className="w-8 h-8" />
                <div>
                  <p className="text-sm font-medium">{msg.document.name}</p>
                  <p className="text-xs opacity-90">{msg.document.size}</p>
                </div>
              </div>
            )}

            {msg.type === 'image' && (
              <div className="cursor-pointer">
                <img 
                  src={msg.image.url} 
                  alt="Imagen" 
                  className="rounded max-w-full"
                />
              </div>
            )}

            <div className={`flex items-center gap-1 mt-1 ${
              isCurrentUser ? 'justify-end' : 'justify-start'
            }`}>
              <span className="text-xs opacity-75">
                {formatters.formatTime(msg.timestamp)}
              </span>
              {isCurrentUser && (
                <span className="ml-1">
                  {msg.status === 'sent' && <Check className="w-3 h-3" />}
                  {msg.status === 'delivered' && <CheckCheck className="w-3 h-3" />}
                  {msg.status === 'read' && <CheckCheck className="w-3 h-3 text-blue-300" />}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const emojis = ['😊', '👍', '❤️', '😂', '🎉', '👏', '🙏', '😍', '🤔', '👋'];

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Selecciona una conversación para comenzar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header del chat */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {chat.type === 'group' ? (
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-600" />
            </div>
          ) : (
            <div className="relative">
              <img
                src={chat.avatar}
                alt={chat.name}
                className="w-10 h-10 rounded-full"
              />
              {chat.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
          )}
          
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{chat.name}</h3>
              {chat.isFromAgenda && (
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                  Coordinación
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {chat.isFromAgenda ? (
                'Chat iniciado desde agenda de coordinación'
              ) : chat.typing && chat.typingUser ? (
                <span className="text-primary-600">{chat.typingUser}</span>
              ) : chat.online ? (
                'En línea'
              ) : (
                `Última vez ${formatters.formatRelativeTime(chat.lastMessageTime)}`
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Solo agencias y admins pueden hacer llamadas */}
          {(user?.role === 'agency' || user?.role === 'admin') && (
            <>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Video className="w-5 h-5" />
              </button>
            </>
          )}
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Info className="w-5 h-5" />
          </button>
          <button 
            onClick={onClose}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {messages.map(renderMessage)}
        
        {chat.typing && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input de mensaje */}
      <form onSubmit={handleSendMessage} className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-end gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
          />

          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            
            {showEmojiPicker && (
              <div className="absolute bottom-full mb-2 bg-white rounded-lg shadow-lg p-2 grid grid-cols-5 gap-1">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setMessage(message + emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Smile className="w-5 h-5" />
          </button>

          <button
            type="submit"
            disabled={!message.trim()}
            className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;