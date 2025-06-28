import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon, DocumentCheckIcon, CalendarIcon, ClockIcon, PlusIcon, TrashIcon, MapPinIcon, UserGroupIcon, DocumentTextIcon, ArrowDownTrayIcon, MagnifyingGlassIcon, FunnelIcon, CheckCircleIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import useProvidersStore from '../../stores/providersStore';
import pdfService from '../../services/pdfService';

const ProviderAssignment = ({ onClose, existingAssignment = null }) => {
  const {
    locations,
    categories,
    actions
  } = useProvidersStore();

  const [selectedTour, setSelectedTour] = useState(existingAssignment?.tourId || '');
  const [selectedDate, setSelectedDate] = useState(existingAssignment?.date || '');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [assignedProviders, setAssignedProviders] = useState(existingAssignment?.providers || []);
  const [availableProviders, setAvailableProviders] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    defaultValues: {
      tourId: existingAssignment?.tourId || '',
      tourName: existingAssignment?.tourName || '',
      date: existingAssignment?.date || '',
      notes: existingAssignment?.notes || ''
    }
  });

  // Tours disponibles (mock data)
  const availableTours = [
    { id: 'tour_ica_fullday', name: 'Ica Full Day' },
    { id: 'tour_cusco_city', name: 'City Tour Cusco' },
    { id: 'tour_machu_picchu', name: 'Machu Picchu Full Day' },
    { id: 'tour_valle_sagrado', name: 'Valle Sagrado' },
    { id: 'tour_lima_centro', name: 'Lima Centro Histórico' }
  ];

  // Cargar proveedores disponibles cuando cambian los filtros
  useEffect(() => {
    let providers = actions.searchProviders(searchQuery);

    if (selectedLocation) {
      providers = providers.filter(p => p.location === selectedLocation);
    }

    if (selectedCategory) {
      providers = providers.filter(p => p.category === selectedCategory);
    }

    // Excluir proveedores ya asignados
    const assignedIds = assignedProviders.map(ap => ap.providerId);
    providers = providers.filter(p => !assignedIds.includes(p.id));

    setAvailableProviders(providers);
  }, [searchQuery, selectedLocation, selectedCategory, assignedProviders, actions]);

  const handleAddProvider = (provider) => {
    const newAssignment = {
      providerId: provider.id,
      providerName: provider.name,
      providerCategory: provider.category,
      providerLocation: provider.location,
      startTime: '09:00',
      endTime: '10:00',
      service: provider.services[0] || '',
      notes: ''
    };

    setAssignedProviders([...assignedProviders, newAssignment]);
  };

  const handleRemoveProvider = (index) => {
    setAssignedProviders(assignedProviders.filter((_, i) => i !== index));
  };

  const handleProviderTimeChange = (index, field, value) => {
    const updated = [...assignedProviders];
    updated[index] = { ...updated[index], [field]: value };
    setAssignedProviders(updated);
  };

  const handleSaveAssignment = (data) => {
    const assignmentData = {
      ...data,
      providers: assignedProviders,
      status: 'draft'
    };

    if (existingAssignment) {
      actions.updateAssignment(existingAssignment.id, assignmentData);
    } else {
      actions.createAssignment(assignmentData);
    }

    onClose();
  };

  const handleGeneratePDF = async (pdfType = 'both') => {
    if (!selectedTour || !selectedDate || assignedProviders.length === 0) {
      alert('Por favor completa toda la información antes de generar el PDF');
      return;
    }

    try {
      // Crear datos para el PDF con información completa de proveedores
      const pdfData = {
        id: 'temp_' + Date.now(),
        tourId: selectedTour,
        tourName: availableTours.find(t => t.id === selectedTour)?.name || '',
        date: selectedDate,
        providers: assignedProviders.map(ap => {
          const provider = availableProviders.find(p => p.id === ap.providerId) || 
                          actions.searchProviders('').find(p => p.id === ap.providerId);
          const category = categories.find(c => c.id === provider?.category);
          const location = locations.find(l => l.id === provider?.location);

          return {
            ...ap,
            providerInfo: provider,
            categoryInfo: category,
            locationInfo: location
          };
        })
      };

      if (pdfType === 'agency') {
        pdfService.downloadPDF(pdfData, `agencia_${pdfData.tourName.replace(/[^a-zA-Z0-9]/g, '_')}_${pdfData.date}.pdf`);
      } else if (pdfType === 'guide') {
        const guidePDF = pdfService.generateProviderAssignmentPDF(pdfData, {
          forAgency: false,
          forGuide: true,
          includeContactDetails: true,
          includeNotes: true
        });
        guidePDF.save(`guia_${pdfData.tourName.replace(/[^a-zA-Z0-9]/g, '_')}_${pdfData.date}.pdf`);
      } else {
        // Generar ambos PDFs
        const { agencyPDF, guidePDF } = pdfService.generateBothPDFs(pdfData);
        
        agencyPDF.save(`agencia_${pdfData.tourName.replace(/[^a-zA-Z0-9]/g, '_')}_${pdfData.date}.pdf`);
        
        // Pequeña pausa para evitar conflictos de descarga
        setTimeout(() => {
          guidePDF.save(`guia_${pdfData.tourName.replace(/[^a-zA-Z0-9]/g, '_')}_${pdfData.date}.pdf`);
        }, 1000);
      }

    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF. Por favor intenta nuevamente.');
    }
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.icon || '📦';
  };

  const getLocationName = (locationId) => {
    const location = locations.find(l => l.id === locationId);
    return location?.name || '';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {existingAssignment ? 'Editar Asignación' : 'Asignar Proveedores a Tour'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6">
            {/* Información del tour */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2 text-blue-500" />
                Información del Tour
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar Tour *
                  </label>
                  <select
                    {...register('tourId', { required: 'El tour es requerido' })}
                    onChange={(e) => {
                      setSelectedTour(e.target.value);
                      const tour = availableTours.find(t => t.id === e.target.value);
                      setValue('tourName', tour?.name || '');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar tour</option>
                    {availableTours.map(tour => (
                      <option key={tour.id} value={tour.id}>
                        {tour.name}
                      </option>
                    ))}
                  </select>
                  {errors.tourId && (
                    <p className="mt-1 text-sm text-red-600">{errors.tourId.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha del Tour *
                  </label>
                  <input
                    type="date"
                    {...register('date', { required: 'La fecha es requerida' })}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas Generales
                  </label>
                  <input
                    type="text"
                    {...register('notes')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Notas adicionales del tour"
                  />
                </div>
              </div>
            </div>

            {/* Proveedores asignados */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2 text-green-500" />
                Proveedores Asignados ({assignedProviders.length})
              </h3>

              {assignedProviders.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No hay proveedores asignados
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Comienza agregando proveedores desde la lista de disponibles.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignedProviders.map((assignment, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Proveedor
                            </label>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">
                                {getCategoryIcon(assignment.providerCategory)}
                              </span>
                              <div>
                                <p className="font-medium text-gray-900">{assignment.providerName}</p>
                                <p className="text-sm text-gray-600">
                                  {getLocationName(assignment.providerLocation)}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Hora Inicio
                            </label>
                            <input
                              type="time"
                              value={assignment.startTime}
                              onChange={(e) => handleProviderTimeChange(index, 'startTime', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Hora Fin
                            </label>
                            <input
                              type="time"
                              value={assignment.endTime}
                              onChange={(e) => handleProviderTimeChange(index, 'endTime', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Servicio
                            </label>
                            <input
                              type="text"
                              value={assignment.service}
                              onChange={(e) => handleProviderTimeChange(index, 'service', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Especificar servicio"
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemoveProvider(index)}
                          className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remover proveedor"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Notas Específicas
                        </label>
                        <input
                          type="text"
                          value={assignment.notes}
                          onChange={(e) => handleProviderTimeChange(index, 'notes', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Notas específicas para este proveedor"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Proveedores disponibles */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <PlusIcon className="w-5 h-5 mr-2 text-blue-500" />
                Proveedores Disponibles
              </h3>

              {/* Filtros */}
              <div className="mb-4 flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Buscar proveedores..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Todas las ubicaciones</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lista de proveedores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableProviders.map(provider => (
                  <div key={provider.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">
                          {getCategoryIcon(provider.category)}
                        </span>
                        <div>
                          <h4 className="font-medium text-gray-900">{provider.name}</h4>
                          <p className="text-sm text-gray-600">
                            {getLocationName(provider.location)} • {provider.contact.contactPerson}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>★ {provider.rating}</span>
                            {provider.capacity && (
                              <span>• {provider.capacity} personas</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddProvider(provider)}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        title="Agregar proveedor"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1">
                        {provider.services.slice(0, 3).map((service, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                          >
                            {service}
                          </span>
                        ))}
                        {provider.services.length > 3 && (
                          <span className="inline-block px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
                            +{provider.services.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {availableProviders.length === 0 && (
                  <div className="col-span-2 text-center py-8">
                    <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No se encontraron proveedores
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Ajusta los filtros de búsqueda para encontrar más proveedores.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          {/* Botones de PDF */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleGeneratePDF('agency')}
              disabled={!selectedTour || !selectedDate || assignedProviders.length === 0}
              className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              <span>PDF Agencia</span>
            </button>
            
            <button
              onClick={() => handleGeneratePDF('guide')}
              disabled={!selectedTour || !selectedDate || assignedProviders.length === 0}
              className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <DocumentTextIcon className="w-4 h-4" />
              <span>PDF Guía</span>
            </button>
            
            <button
              onClick={() => handleGeneratePDF('both')}
              disabled={!selectedTour || !selectedDate || assignedProviders.length === 0}
              className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <EnvelopeIcon className="w-4 h-4" />
              <span>Ambos PDFs</span>
            </button>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit(handleSaveAssignment)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <DocumentCheckIcon className="w-4 h-4" />
              <span>{existingAssignment ? 'Actualizar' : 'Guardar'} Asignación</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderAssignment;