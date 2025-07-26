import React, { useState, useRef } from 'react';
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
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ResourcesManagement = () => {
  const [activeTab, setActiveTab] = useState('guides');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

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
      joinDate: '2020-01-15'
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
      joinDate: '2019-05-10'
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
      soat: 'Vigente hasta 2024-12-31'
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
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Gestión de Recursos
            </h1>
            <p className="text-gray-600">
              Administra guías turísticos, choferes y vehículos
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('guides')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'guides'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <UserGroupIcon className="w-5 h-5" />
                Guías Turísticos ({guides.length})
              </button>
              <button
                onClick={() => setActiveTab('drivers')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'drivers'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <TruckIcon className="w-5 h-5" />
                Choferes ({drivers.length})
              </button>
              <button
                onClick={() => setActiveTab('vehicles')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'vehicles'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <TruckIcon className="w-5 h-5" />
                Vehículos ({vehicles.length})
              </button>
            </div>
          </div>

          {/* Action button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Agregar {activeTab === 'guides' ? 'Guía' : activeTab === 'drivers' ? 'Chofer' : 'Vehículo'}
            </button>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'guides' && guides.map(guide => renderGuideCard(guide))}
            {activeTab === 'drivers' && drivers.map(driver => renderDriverCard(driver))}
            {activeTab === 'vehicles' && vehicles.map(vehicle => renderVehicleCard(vehicle))}
          </div>

          {/* Empty state */}
          {((activeTab === 'guides' && guides.length === 0) ||
            (activeTab === 'drivers' && drivers.length === 0) ||
            (activeTab === 'vehicles' && vehicles.length === 0)) && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No hay {activeTab === 'guides' ? 'guías' : activeTab === 'drivers' ? 'choferes' : 'vehículos'} registrados
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {editingItem ? 'Editar' : 'Agregar'} {activeTab === 'guides' ? 'Guía' : activeTab === 'drivers' ? 'Chofer' : 'Vehículo'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Image upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto
                </label>
                <div className="flex items-center gap-4">
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
                  <div>
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
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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