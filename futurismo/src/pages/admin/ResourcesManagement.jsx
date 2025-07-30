import React, { useState, useRef, useEffect } from 'react';
import {
  UserGroupIcon,
  TruckIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CameraIcon,
  PhoneIcon,
  StarIcon,
  LanguageIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
  IdentificationIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  CheckBadgeIcon,
  EnvelopeIcon,
  ClockIcon,
  EllipsisVerticalIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ResourcesManagement = () => {
  const [activeTab, setActiveTab] = useState('guides');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list for desktop

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Estados para los recursos
  const [guides, setGuides] = useState([
    {
      id: '1',
      name: 'Carlos Mendoza',
      phone: '+51 987 654 321',
      email: 'carlos.mendoza@email.com',
      license: 'GTL-12345',
      rating: 4.8,
      specialties: ['Historia', 'Arqueología', 'Cultura'],
      languages: ['Español', 'Inglés', 'Portugués'],
      experience: 8,
      photo: 'https://i.pravatar.cc/150?img=1',
      status: 'active',
      joinDate: '2020-01-15',
      totalTours: 145,
      availability: 'available'
    },
    {
      id: '2',
      name: 'Ana Rodríguez',
      phone: '+51 912 345 678',
      email: 'ana.rodriguez@email.com',
      license: 'GTL-54321',
      rating: 4.9,
      specialties: ['Arte', 'Cultura', 'Gastronomía'],
      languages: ['Español', 'Inglés', 'Francés'],
      experience: 10,
      photo: 'https://i.pravatar.cc/150?img=2',
      status: 'active',
      joinDate: '2018-06-20',
      totalTours: 234,
      availability: 'busy'
    }
  ]);

  const [drivers, setDrivers] = useState([
    {
      id: '1',
      name: 'José Ramírez',
      phone: '+51 923 456 789',
      email: 'jose.ramirez@email.com',
      license: 'A2A-98765',
      experience: 15,
      certifications: ['Transporte Turístico', 'Primeros Auxilios', 'Manejo Defensivo'],
      photo: 'https://i.pravatar.cc/150?img=4',
      status: 'active',
      joinDate: '2019-05-10',
      totalTrips: 892,
      safetyRating: 5.0
    },
    {
      id: '2',
      name: 'Luis García',
      phone: '+51 945 678 901',
      email: 'luis.garcia@email.com',
      license: 'B3B-12345',
      experience: 8,
      certifications: ['Transporte Turístico', 'Primeros Auxilios'],
      photo: 'https://i.pravatar.cc/150?img=5',
      status: 'active',
      joinDate: '2021-03-15',
      totalTrips: 456,
      safetyRating: 4.8
    }
  ]);

  const [vehicles, setVehicles] = useState([
    {
      id: '1',
      brand: 'Toyota',
      model: 'Hiace',
      plate: 'ABC-123',
      year: 2022,
      color: 'Blanco',
      capacity: 15,
      features: ['Aire Acondicionado', 'Cinturones de Seguridad', 'GPS', 'Wi-Fi'],
      photo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&h=200&fit=crop',
      status: 'active',
      lastMaintenance: '2024-01-10',
      nextMaintenance: '2024-04-10',
      insurance: 'Vigente hasta 2024-12-31',
      soat: 'Vigente hasta 2024-12-31',
      mileage: 45000,
      fuelType: 'Diesel'
    },
    {
      id: '2',
      brand: 'Mercedes-Benz',
      model: 'Sprinter',
      plate: 'XYZ-789',
      year: 2023,
      color: 'Plateado',
      capacity: 20,
      features: ['Aire Acondicionado', 'Asientos Reclinables', 'GPS', 'Wi-Fi', 'USB'],
      photo: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=300&h=200&fit=crop',
      status: 'active',
      lastMaintenance: '2024-02-15',
      nextMaintenance: '2024-05-15',
      insurance: 'Vigente hasta 2025-01-31',
      soat: 'Vigente hasta 2025-01-31',
      mileage: 12000,
      fuelType: 'Diesel'
    }
  ]);

  // Estado del formulario
  const [formData, setFormData] = useState({
    // Campos comunes
    name: '',
    phone: '',
    email: '',
    photo: '',
    status: 'active',
    
    // Campos de guía
    license: '',
    rating: 5,
    specialties: [],
    languages: [],
    experience: 0,
    
    // Campos de chofer
    certifications: [],
    
    // Campos de vehículo
    brand: '',
    model: '',
    plate: '',
    year: new Date().getFullYear(),
    color: '',
    capacity: 0,
    features: [],
    lastMaintenance: '',
    nextMaintenance: '',
    insurance: '',
    soat: ''
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor selecciona una imagen válida');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen no debe superar los 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (activeTab === 'guides') {
      if (editingItem) {
        setGuides(prev => prev.map(g => g.id === editingItem.id ? { ...formData, id: g.id } : g));
        toast.success('Guía actualizado correctamente');
      } else {
        setGuides(prev => [...prev, { ...formData, id: Date.now().toString(), joinDate: new Date().toISOString().split('T')[0] }]);
        toast.success('Guía agregado correctamente');
      }
    } else if (activeTab === 'drivers') {
      if (editingItem) {
        setDrivers(prev => prev.map(d => d.id === editingItem.id ? { ...formData, id: d.id } : d));
        toast.success('Chofer actualizado correctamente');
      } else {
        setDrivers(prev => [...prev, { ...formData, id: Date.now().toString(), joinDate: new Date().toISOString().split('T')[0] }]);
        toast.success('Chofer agregado correctamente');
      }
    } else if (activeTab === 'vehicles') {
      if (editingItem) {
        setVehicles(prev => prev.map(v => v.id === editingItem.id ? { ...formData, id: v.id } : v));
        toast.success('Vehículo actualizado correctamente');
      } else {
        setVehicles(prev => [...prev, { ...formData, id: Date.now().toString() }]);
        toast.success('Vehículo agregado correctamente');
      }
    }

    handleCloseModal();
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setImagePreview(item.photo);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('¿Estás seguro de eliminar este recurso?')) {
      if (activeTab === 'guides') {
        setGuides(prev => prev.filter(g => g.id !== id));
        toast.success('Guía eliminado');
      } else if (activeTab === 'drivers') {
        setDrivers(prev => prev.filter(d => d.id !== id));
        toast.success('Chofer eliminado');
      } else if (activeTab === 'vehicles') {
        setVehicles(prev => prev.filter(v => v.id !== id));
        toast.success('Vehículo eliminado');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setImagePreview('');
    setFormData({
      name: '',
      phone: '',
      email: '',
      photo: '',
      status: 'active',
      license: '',
      rating: 5,
      specialties: [],
      languages: [],
      experience: 0,
      certifications: [],
      brand: '',
      model: '',
      plate: '',
      year: new Date().getFullYear(),
      color: '',
      capacity: 0,
      features: [],
      lastMaintenance: '',
      nextMaintenance: '',
      insurance: '',
      soat: ''
    });
  };

  const renderGuideForm = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Licencia *
          </label>
          <input
            type="text"
            required
            value={formData.license}
            onChange={(e) => setFormData(prev => ({ ...prev, license: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono *
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Años de experiencia
          </label>
          <input
            type="number"
            min="0"
            value={formData.experience}
            onChange={(e) => setFormData(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Calificación
          </label>
          <input
            type="number"
            min="1"
            max="5"
            step="0.1"
            value={formData.rating}
            onChange={(e) => setFormData(prev => ({ ...prev, rating: parseFloat(e.target.value) || 5 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Idiomas (separados por coma)
        </label>
        <input
          type="text"
          value={formData.languages?.join(', ') || ''}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            languages: e.target.value.split(',').map(l => l.trim()).filter(l => l)
          }))}
          placeholder="Español, Inglés, Portugués"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Especialidades (separadas por coma)
        </label>
        <input
          type="text"
          value={formData.specialties?.join(', ') || ''}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            specialties: e.target.value.split(',').map(s => s.trim()).filter(s => s)
          }))}
          placeholder="Historia, Arqueología, Cultura"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </>
  );

  const renderDriverForm = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Licencia de conducir *
          </label>
          <input
            type="text"
            required
            value={formData.license}
            onChange={(e) => setFormData(prev => ({ ...prev, license: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono *
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Años de experiencia
          </label>
          <input
            type="number"
            min="0"
            value={formData.experience}
            onChange={(e) => setFormData(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Certificaciones (separadas por coma)
        </label>
        <input
          type="text"
          value={formData.certifications?.join(', ') || ''}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            certifications: e.target.value.split(',').map(c => c.trim()).filter(c => c)
          }))}
          placeholder="Transporte Turístico, Primeros Auxilios, Manejo Defensivo"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </>
  );

  const renderVehicleForm = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marca *
          </label>
          <input
            type="text"
            required
            value={formData.brand}
            onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Modelo *
          </label>
          <input
            type="text"
            required
            value={formData.model}
            onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Placa *
          </label>
          <input
            type="text"
            required
            value={formData.plate}
            onChange={(e) => setFormData(prev => ({ ...prev, plate: e.target.value.toUpperCase() }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Año
          </label>
          <input
            type="number"
            min="2000"
            max={new Date().getFullYear() + 1}
            value={formData.year}
            onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color
          </label>
          <input
            type="text"
            value={formData.color}
            onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Capacidad (pasajeros)
          </label>
          <input
            type="number"
            min="1"
            value={formData.capacity}
            onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Último mantenimiento
          </label>
          <input
            type="date"
            value={formData.lastMaintenance}
            onChange={(e) => setFormData(prev => ({ ...prev, lastMaintenance: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Próximo mantenimiento
          </label>
          <input
            type="date"
            value={formData.nextMaintenance}
            onChange={(e) => setFormData(prev => ({ ...prev, nextMaintenance: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Seguro (vencimiento)
          </label>
          <input
            type="text"
            value={formData.insurance}
            onChange={(e) => setFormData(prev => ({ ...prev, insurance: e.target.value }))}
            placeholder="Vigente hasta 2024-12-31"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SOAT (vencimiento)
          </label>
          <input
            type="text"
            value={formData.soat}
            onChange={(e) => setFormData(prev => ({ ...prev, soat: e.target.value }))}
            placeholder="Vigente hasta 2024-12-31"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Características (separadas por coma)
        </label>
        <input
          type="text"
          value={formData.features?.join(', ') || ''}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            features: e.target.value.split(',').map(f => f.trim()).filter(f => f)
          }))}
          placeholder="Aire Acondicionado, GPS, Wi-Fi, Cinturones de Seguridad"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </>
  );

  // Filter functions
  const getFilteredItems = () => {
    let items = activeTab === 'guides' ? guides : activeTab === 'drivers' ? drivers : vehicles;
    
    // Filter by search query
    if (searchQuery) {
      items = items.filter(item => {
        const searchLower = searchQuery.toLowerCase();
        if (activeTab === 'vehicles') {
          return (
            item.brand?.toLowerCase().includes(searchLower) ||
            item.model?.toLowerCase().includes(searchLower) ||
            item.plate?.toLowerCase().includes(searchLower)
          );
        }
        return (
          item.name?.toLowerCase().includes(searchLower) ||
          item.email?.toLowerCase().includes(searchLower) ||
          item.phone?.includes(searchQuery)
        );
      });
    }
    
    // Filter by status
    if (filterStatus !== 'all') {
      items = items.filter(item => item.status === filterStatus);
    }
    
    return items;
  };

  // Mobile Components
  const MobileResourceCard = ({ item, type }) => {
    if (type === 'guide') {
      return (
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <img
                src={item.photo || 'https://via.placeholder.com/60'}
                alt={item.name}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center">
                    <StarIcon className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs text-gray-600 ml-0.5">{item.rating}</span>
                  </div>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            </div>
            <button className="p-1.5 text-gray-400 hover:text-gray-600">
              <EllipsisVerticalIcon className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center text-gray-600">
              <PhoneIcon className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
              <span>{item.phone}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <IdentificationIcon className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
              <span>Licencia: {item.license}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <LanguageIcon className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
              <span className="truncate">{item.languages.slice(0, 2).join(', ')}</span>
            </div>
          </div>
          
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => handleEdit(item)}
              className="flex-1 px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Editar
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="px-3 py-1.5 border border-red-300 text-red-600 rounded hover:bg-red-50"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
    }
    
    if (type === 'driver') {
      return (
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <img
                src={item.photo || 'https://via.placeholder.com/60'}
                alt={item.name}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                <p className="text-xs text-gray-600">{item.experience} años exp.</p>
                <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                  item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {item.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
            <button className="p-1.5 text-gray-400 hover:text-gray-600">
              <EllipsisVerticalIcon className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-1.5 text-xs mb-3">
            <div className="flex items-center text-gray-600">
              <PhoneIcon className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
              <span>{item.phone}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <IdentificationIcon className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
              <span>Licencia: {item.license}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {item.certifications.slice(0, 2).map((cert, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                {cert}
              </span>
            ))}
            {item.certifications.length > 2 && (
              <span className="text-xs text-gray-500">+{item.certifications.length - 2}</span>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(item)}
              className="flex-1 px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Editar
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="px-3 py-1.5 border border-red-300 text-red-600 rounded hover:bg-red-50"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
    }
    
    // Vehicle card
    return (
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="relative">
          <img
            src={item.photo || 'https://via.placeholder.com/300x150'}
            alt={`${item.brand} ${item.model}`}
            className="w-full h-32 object-cover"
          />
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 text-xs font-medium rounded ${
              item.status === 'active' ? 'bg-green-100 text-green-800' : 
              item.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {item.status === 'active' ? 'Activo' : 
               item.status === 'maintenance' ? 'Mantenimiento' : 'Inactivo'}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-900">
            {item.brand} {item.model}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
            <span>Placa: {item.plate}</span>
            <span>•</span>
            <span>{item.capacity} pax</span>
          </div>
          
          <div className="mt-3 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Próx. Mant.:</span>
              <span className="font-medium">
                {new Date(item.nextMaintenance).toLocaleDateString('es-PE')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Kilometraje:</span>
              <span className="font-medium">{item.mileage?.toLocaleString()} km</span>
            </div>
          </div>
          
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => handleEdit(item)}
              className="flex-1 px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Editar
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="px-3 py-1.5 border border-red-300 text-red-600 rounded hover:bg-red-50"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Mobile Filters Modal
  const MobileFilters = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-2xl max-h-[70vh] overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Filtros</h3>
          <button onClick={() => setShowMobileFilters(false)}>
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        <div className="p-4 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
              {activeTab === 'vehicles' && <option value="maintenance">En mantenimiento</option>}
            </select>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setFilterStatus('all');
                setShowMobileFilters(false);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg"
            >
              Limpiar
            </button>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGuideCard = (guide) => (
    <div key={guide.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <img
              src={guide.photo || 'https://via.placeholder.com/100'}
              alt={guide.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{guide.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm text-gray-600">{guide.rating}</span>
                <span className="text-sm text-gray-500">• {guide.experience} años exp.</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleEdit(guide)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleDelete(guide.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <PhoneIcon className="w-4 h-4 mr-2" />
            {guide.phone}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <IdentificationIcon className="w-4 h-4 mr-2" />
            Licencia: {guide.license}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <LanguageIcon className="w-4 h-4 mr-2" />
            {guide.languages.join(', ')}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t">
          <div className="flex flex-wrap gap-1">
            {guide.specialties.map((specialty, idx) => (
              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {specialty}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDriverCard = (driver) => (
    <div key={driver.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <img
              src={driver.photo || 'https://via.placeholder.com/100'}
              alt={driver.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{driver.name}</h3>
              <p className="text-sm text-gray-600">{driver.experience} años de experiencia</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleEdit(driver)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleDelete(driver.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <PhoneIcon className="w-4 h-4 mr-2" />
            {driver.phone}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <IdentificationIcon className="w-4 h-4 mr-2" />
            Licencia: {driver.license}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CalendarDaysIcon className="w-4 h-4 mr-2" />
            Desde: {new Date(driver.joinDate).toLocaleDateString('es-PE')}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t">
          <div className="flex flex-wrap gap-1">
            {driver.certifications.map((cert, idx) => (
              <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                {cert}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderVehicleCard = (vehicle) => (
    <div key={vehicle.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={vehicle.photo || 'https://via.placeholder.com/300x200'}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={() => handleEdit(vehicle)}
            className="p-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg shadow-md transition-colors"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDelete(vehicle.id)}
            className="p-2 bg-white text-red-600 hover:bg-red-50 rounded-lg shadow-md transition-colors"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {vehicle.brand} {vehicle.model}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-gray-600">Placa: {vehicle.plate}</span>
            <span className="text-sm text-gray-600">• {vehicle.year}</span>
            <span className="text-sm text-gray-600">• {vehicle.color}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <UsersIcon className="w-4 h-4 mr-2" />
            Capacidad: {vehicle.capacity} pasajeros
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <WrenchScrewdriverIcon className="w-4 h-4 mr-2" />
            Mantenim.: {new Date(vehicle.nextMaintenance).toLocaleDateString('es-PE')}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <ShieldCheckIcon className="w-4 h-4 mr-2" />
            {vehicle.insurance}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t">
          <div className="flex flex-wrap gap-1">
            {vehicle.features.map((feature, idx) => (
              <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Gestión de Recursos
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Administra guías turísticos, choferes y vehículos
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Guías</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{guides.length}</p>
                </div>
                <UserGroupIcon className="w-6 sm:w-8 h-6 sm:h-8 text-blue-500 opacity-20" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Choferes</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{drivers.length}</p>
                </div>
                <TruckIcon className="w-6 sm:w-8 h-6 sm:h-8 text-green-500 opacity-20" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4 col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Vehículos</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{vehicles.length}</p>
                </div>
                <TruckIcon className="w-6 sm:w-8 h-6 sm:h-8 text-purple-500 opacity-20" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-4 sm:mb-6 overflow-hidden">
            <div className="flex border-b overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab('guides')}
                className={`flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap min-w-[100px] ${
                  activeTab === 'guides'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <UserGroupIcon className="w-4 sm:w-5 h-4 sm:h-5" />
                <span className="hidden sm:inline">Guías Turísticos</span>
                <span className="sm:hidden">Guías</span>
                <span className="text-xs">({guides.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('drivers')}
                className={`flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap min-w-[100px] ${
                  activeTab === 'drivers'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <TruckIcon className="w-4 sm:w-5 h-4 sm:h-5" />
                <span>Choferes</span>
                <span className="text-xs">({drivers.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('vehicles')}
                className={`flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap min-w-[100px] ${
                  activeTab === 'vehicles'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <TruckIcon className="w-4 sm:w-5 h-4 sm:h-5" />
                <span>Vehículos</span>
                <span className="text-xs">({vehicles.length})</span>
              </button>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={`Buscar ${activeTab === 'guides' ? 'guías' : activeTab === 'drivers' ? 'choferes' : 'vehículos'}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              
              {/* Actions */}
              <div className="flex gap-2">
                {isMobile && (
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FunnelIcon className="w-4 h-4" />
                    <span className="text-sm">Filtros</span>
                  </button>
                )}
                
                {!isMobile && (
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todos</option>
                    <option value="active">Activos</option>
                    <option value="inactive">Inactivos</option>
                    {activeTab === 'vehicles' && <option value="maintenance">En mantenimiento</option>}
                  </select>
                )}
                
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  <PlusIcon className="w-4 sm:w-5 h-4 sm:h-5" />
                  <span className="hidden sm:inline">
                    Agregar {activeTab === 'guides' ? 'Guía' : activeTab === 'drivers' ? 'Chofer' : 'Vehículo'}
                  </span>
                  <span className="sm:hidden">Agregar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          {isMobile ? (
            <div className="grid grid-cols-1 gap-3">
              {activeTab === 'guides' && getFilteredItems().map(guide => (
                <MobileResourceCard key={guide.id} item={guide} type="guide" />
              ))}
              {activeTab === 'drivers' && getFilteredItems().map(driver => (
                <MobileResourceCard key={driver.id} item={driver} type="driver" />
              ))}
              {activeTab === 'vehicles' && getFilteredItems().map(vehicle => (
                <MobileResourceCard key={vehicle.id} item={vehicle} type="vehicle" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {activeTab === 'guides' && getFilteredItems().map(guide => renderGuideCard(guide))}
              {activeTab === 'drivers' && getFilteredItems().map(driver => renderDriverCard(driver))}
              {activeTab === 'vehicles' && getFilteredItems().map(vehicle => renderVehicleCard(vehicle))}
            </div>
          )}

          {/* Empty state */}
          {getFilteredItems().length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                {activeTab === 'guides' ? (
                  <UserGroupIcon className="w-6 h-6 text-gray-400" />
                ) : activeTab === 'drivers' ? (
                  <TruckIcon className="w-6 h-6 text-gray-400" />
                ) : (
                  <TruckIcon className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <p className="text-gray-500 text-sm sm:text-base">
                {searchQuery || filterStatus !== 'all' ? (
                  <>No se encontraron {activeTab === 'guides' ? 'guías' : activeTab === 'drivers' ? 'choferes' : 'vehículos'}</>
                ) : (
                  <>No hay {activeTab === 'guides' ? 'guías' : activeTab === 'drivers' ? 'choferes' : 'vehículos'} registrados</>
                )}
              </p>
              {(searchQuery || filterStatus !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterStatus('all');
                  }}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-700"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters */}
      {showMobileFilters && <MobileFilters />}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-lg w-full ${isMobile ? 'max-w-full' : 'max-w-2xl'} max-h-[90vh] overflow-y-auto`}>
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-semibold">
                {editingItem ? 'Editar' : 'Agregar'} {activeTab === 'guides' ? 'Guía' : activeTab === 'drivers' ? 'Chofer' : 'Vehículo'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6">
              {/* Image upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className={`${activeTab === 'vehicles' ? 'w-32 h-24' : 'w-24 h-24'} object-cover rounded-lg`}
                      />
                    ) : (
                      <div className={`${activeTab === 'vehicles' ? 'w-32 h-24' : 'w-24 h-24'} bg-gray-200 rounded-lg flex items-center justify-center`}>
                        <CameraIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="text-center sm:text-left">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      Seleccionar imagen
                    </button>
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG o GIF. Máximo 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Form fields based on active tab */}
              {activeTab === 'guides' && renderGuideForm()}
              {activeTab === 'drivers' && renderDriverForm()}
              {activeTab === 'vehicles' && renderVehicleForm()}

              {/* Status */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="maintenance">En mantenimiento</option>
                </select>
              </div>

              {/* Submit buttons */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingItem ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ResourcesManagement;