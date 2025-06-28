import { useState } from 'react';
import { XMarkIcon, PlusIcon, PencilIcon, TrashIcon, DocumentCheckIcon, ArchiveBoxIcon, CheckCircleIcon, ExclamationTriangleIcon, MagnifyingGlassIcon, FunnelIcon, EyeIcon, ArrowDownTrayIcon, PrinterIcon, ShareIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { useForm, useFieldArray } from 'react-hook-form';
import useEmergencyStore from '../../stores/emergencyStore';

const MaterialsManager = ({ onClose, isAdmin = false }) => {
  const { materials, categories, actions } = useEmergencyStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [expandedMaterial, setExpandedMaterial] = useState(null);
  const [showOnlyMandatory, setShowOnlyMandatory] = useState(false);

  // Filtrar materiales
  const filteredMaterials = materials.filter(material => {
    const matchesSearch = !searchQuery || 
      material.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !filterCategory || material.category === filterCategory;
    const matchesMandatory = !showOnlyMandatory || material.mandatory;
    
    return matchesSearch && matchesCategory && matchesMandatory;
  });

  const MaterialForm = ({ material, onSave, onCancel }) => {
    const {
      register,
      handleSubmit,
      control,
      formState: { errors }
    } = useForm({
      defaultValues: {
        name: material?.name || '',
        category: material?.category || '',
        mandatory: material?.mandatory || false,
        items: material?.items?.map(item => ({ name: item })) || [{ name: '' }]
      }
    });

    const {
      fields: itemFields,
      append: appendItem,
      remove: removeItem
    } = useFieldArray({
      control,
      name: 'items'
    });

    const onSubmit = (data) => {
      const materialData = {
        name: data.name,
        category: data.category,
        mandatory: data.mandatory,
        items: data.items.map(item => item.name).filter(name => name.trim() !== '')
      };

      onSave(materialData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {material ? 'Editar Material' : 'Nuevo Material'}
            </h3>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Material *
                  </label>
                  <input
                    {...register('name', { required: 'El nombre es requerido' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Botiquín Básico de Primeros Auxilios"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría *
                  </label>
                  <select
                    {...register('category', { required: 'La categoría es requerida' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>
              </div>

              {/* Obligatorio */}
              <div className="flex items-center space-x-3">
                <input
                  {...register('mandatory')}
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Material obligatorio para todos los tours
                </label>
              </div>

              {/* Lista de elementos */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    Elementos del Material
                  </h4>
                  <button
                    type="button"
                    onClick={() => appendItem({ name: '' })}
                    className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Agregar Elemento</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {itemFields.map((field, index) => (
                    <div key={field.id} className="flex items-center space-x-3">
                      <div className="flex-1">
                        <input
                          {...register(`items.${index}.name`)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ej: Vendas elásticas (2 rollos)"
                        />
                      </div>
                      {itemFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </div>

          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <DocumentCheckIcon className="w-4 h-4" />
              <span>Guardar</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleSaveMaterial = (materialData) => {
    if (editingMaterial) {
      actions.updateMaterial(editingMaterial.id, materialData);
    } else {
      actions.addMaterial(materialData);
    }
    setIsEditing(false);
    setEditingMaterial(null);
  };

  const handleEditMaterial = (material) => {
    setEditingMaterial(material);
    setIsEditing(true);
  };

  const handleDeleteMaterial = (materialId) => {
    if (confirm('¿Estás seguro de eliminar este material?')) {
      actions.deleteMaterial(materialId);
    }
  };

  const handleViewMaterial = (material) => {
    setExpandedMaterial(expandedMaterial?.id === material.id ? null : material);
  };

  const handleCopyMaterialList = (material) => {
    const itemsList = material.items.map((item, index) => `${index + 1}. ${item}`).join('\n');
    const content = `${material.name}\n${'='.repeat(material.name.length)}\nCategoría: ${getCategoryInfo(material.category).name}\nObligatorio: ${material.mandatory ? 'Sí' : 'No'}\n\nElementos:\n${itemsList}`;
    
    navigator.clipboard.writeText(content).then(() => {
      alert('Lista de materiales copiada al portapapeles');
    }).catch(() => {
      alert('Error al copiar la lista');
    });
  };

  const handlePrintMaterial = (material) => {
    const category = getCategoryInfo(material.category);
    const itemsList = material.items.map((item, index) => `${index + 1}. ${item}`).join('\n');
    
    const printContent = `
      <html>
        <head>
          <title>Material: ${material.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .category { color: #666; font-size: 14px; }
            .mandatory { background: #fee; color: #c53030; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
            .items { margin-top: 20px; }
            .item { margin: 5px 0; }
            @media print { 
              .no-print { display: none; }
              @page { margin: 2cm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${category.icon} ${material.name}</h1>
            <div class="category">Categoría: ${category.name}</div>
            ${material.mandatory ? '<div class="mandatory">MATERIAL OBLIGATORIO</div>' : ''}
          </div>
          <div class="items">
            <h3>Elementos necesarios (${material.items.length}):</h3>
            ${material.items.map((item, index) => `<div class="item">${index + 1}. ${item}</div>`).join('')}
          </div>
          <div style="margin-top: 40px; border-top: 1px solid #ccc; padding-top: 20px; text-align: center; color: #666; font-size: 12px;">
            Lista generada por Futurismo Tours - ${new Date().toLocaleDateString('es-ES')}
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    setTimeout(() => printWindow.close(), 1000);
  };

  const handlePrintAllMandatory = () => {
    const mandatoryMaterials = filteredMaterials.filter(m => m.mandatory);
    
    if (mandatoryMaterials.length === 0) {
      alert('No hay materiales obligatorios para imprimir');
      return;
    }

    const printContent = `
      <html>
        <head>
          <title>Materiales Obligatorios - Lista de Verificación</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
            .material { margin-bottom: 30px; page-break-inside: avoid; }
            .material-header { background: #fee; padding: 10px; border-radius: 8px; margin-bottom: 10px; }
            .material-name { font-size: 18px; font-weight: bold; color: #c53030; }
            .category { color: #666; font-size: 14px; }
            .items { margin-left: 20px; }
            .item { margin: 5px 0; }
            .checkbox { margin-right: 10px; }
            @media print { 
              @page { margin: 2cm; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📋 LISTA DE MATERIALES OBLIGATORIOS</h1>
            <p>Lista de verificación para guías - Futurismo Tours</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')} | <strong>Total de materiales:</strong> ${mandatoryMaterials.length}</p>
          </div>
          
          ${mandatoryMaterials.map(material => {
            const category = getCategoryInfo(material.category);
            return `
              <div class="material">
                <div class="material-header">
                  <div class="material-name">${category.icon} ${material.name}</div>
                  <div class="category">Categoría: ${category.name}</div>
                </div>
                <div class="items">
                  ${material.items.map(item => `
                    <div class="item">
                      <input type="checkbox" class="checkbox"> ${item}
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}
          
          <div style="margin-top: 40px; border-top: 1px solid #ccc; padding-top: 20px; text-align: center; color: #666; font-size: 12px;">
            <p><strong>IMPORTANTE:</strong> Verificar todos los elementos antes de cada tour</p>
            <p>Lista generada por Futurismo Tours - ${new Date().toLocaleDateString('es-ES')}</p>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    setTimeout(() => printWindow.close(), 1000);
  };

  const handleCopyAllMandatory = () => {
    const mandatoryMaterials = filteredMaterials.filter(m => m.mandatory);
    
    if (mandatoryMaterials.length === 0) {
      alert('No hay materiales obligatorios para copiar');
      return;
    }

    const content = [
      'LISTA DE MATERIALES OBLIGATORIOS',
      '='.repeat(35),
      `Fecha: ${new Date().toLocaleDateString('es-ES')}`,
      `Total de materiales: ${mandatoryMaterials.length}`,
      '',
      ...mandatoryMaterials.map(material => {
        const category = getCategoryInfo(material.category);
        return [
          `${category.icon} ${material.name.toUpperCase()}`,
          `Categoría: ${category.name}`,
          'Elementos:',
          ...material.items.map((item, index) => `  ${index + 1}. [ ] ${item}`),
          ''
        ].join('\n');
      }),
      'IMPORTANTE: Verificar todos los elementos antes de cada tour',
      '',
      'Lista generada por Futurismo Tours'
    ].join('\n');
    
    navigator.clipboard.writeText(content).then(() => {
      alert('Lista de materiales obligatorios copiada al portapapeles');
    }).catch(() => {
      alert('Error al copiar la lista');
    });
  };

  const getCategoryInfo = (categoryId) => {
    return categories.find(c => c.id === categoryId) || { 
      name: categoryId, 
      icon: '📦', 
      color: '#6B7280' 
    };
  };

  if (isEditing) {
    return (
      <MaterialForm
        material={editingMaterial}
        onSave={handleSaveMaterial}
        onCancel={() => {
          setIsEditing(false);
          setEditingMaterial(null);
        }}
      />
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <ArchiveBoxIcon className="w-8 h-8 mr-3 text-purple-500" />
            Gestión de Materiales
          </h1>
          <p className="text-gray-600 mt-1">
            Administra los materiales y equipos necesarios para emergencias
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {isAdmin && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Nuevo Material</span>
            </button>
          )}
          
          <button
            onClick={() => handlePrintAllMandatory()}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
          >
            <PrinterIcon className="w-4 h-4" />
            <span>Imprimir Obligatorios</span>
          </button>

          <button
            onClick={() => handleCopyAllMandatory()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <DocumentDuplicateIcon className="w-4 h-4" />
            <span>Copiar Obligatorios</span>
          </button>
          
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen de Materiales</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => setFilterCategory('')}>
            <div className="flex items-center space-x-3">
              <ArchiveBoxIcon className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{materials.length}</p>
                <p className="text-sm text-blue-700">Total Materiales</p>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg cursor-pointer hover:bg-red-100 transition-colors" onClick={() => {
            setShowOnlyMandatory(!showOnlyMandatory);
            setFilterCategory('');
            setSearchQuery('');
          }}>
            <div className="flex items-center space-x-3">
              <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-600">{materials.filter(m => m.mandatory).length}</p>
                <p className="text-sm text-red-700">Obligatorios</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg cursor-pointer hover:bg-green-100 transition-colors" onClick={() => setFilterCategory('')}>
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">{categories.length}</p>
                <p className="text-sm text-green-700">Categorías</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors" onClick={() => setFilterCategory('')}>
            <div className="flex items-center space-x-3">
              <FunnelIcon className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-600">{filteredMaterials.length}</p>
                <p className="text-sm text-purple-700">Filtrados</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar materiales..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FunnelIcon className="w-4 h-4 text-gray-500" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
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

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="mandatory-filter"
                checked={showOnlyMandatory}
                onChange={(e) => setShowOnlyMandatory(e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label htmlFor="mandatory-filter" className="text-sm font-medium text-gray-700">
                Solo obligatorios
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de materiales */}
      {filteredMaterials.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <ArchiveBoxIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No se encontraron materiales
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Ajusta los filtros de búsqueda o crea un nuevo material.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map(material => {
            const category = getCategoryInfo(material.category);
            return (
              <div
                key={material.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => handleViewMaterial(material)}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                        style={{ backgroundColor: category.color + '20' }}
                      >
                        {category.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 line-clamp-2">
                          {material.name}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-600">{category.name}</span>
                          {material.mandatory && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 border border-red-200">
                              OBLIGATORIO
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lista de elementos */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-700">
                        Elementos ({material.items.length})
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewMaterial(material);
                        }}
                        className="text-blue-500 hover:text-blue-600 text-xs"
                      >
                        {expandedMaterial?.id === material.id ? 'Ver menos' : 'Ver todos'}
                      </button>
                    </div>
                    <div className={`${expandedMaterial?.id === material.id ? 'max-h-64' : 'max-h-32'} overflow-y-auto transition-all duration-200`}>
                      {(expandedMaterial?.id === material.id ? material.items : material.items.slice(0, 4)).map((item, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                          <CheckCircleIcon className="w-3 h-3 text-green-500" />
                          <span className="line-clamp-1">{item}</span>
                        </div>
                      ))}
                      {material.items.length > 4 && expandedMaterial?.id !== material.id && (
                        <div className="text-sm text-gray-500">
                          +{material.items.length - 4} elementos más
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center space-x-2">
                    {isAdmin ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditMaterial(material);
                          }}
                          className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                        >
                          <PencilIcon className="w-4 h-4" />
                          <span>Editar</span>
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMaterial(material.id);
                          }}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          title="Eliminar material"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyMaterialList(material);
                          }}
                          className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          title="Copiar lista al portapapeles"
                        >
                          <DocumentDuplicateIcon className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrintMaterial(material);
                          }}
                          className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          title="Imprimir lista"
                        >
                          <PrinterIcon className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewMaterial(material);
                          }}
                          className="flex-1 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center space-x-2"
                        >
                          <EyeIcon className="w-4 h-4" />
                          <span>{expandedMaterial?.id === material.id ? 'Colapsar' : 'Ver detalle'}</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Resumen de materiales obligatorios */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-900 mb-2">
              Materiales Obligatorios
            </h3>
            <p className="text-yellow-800 text-sm mb-3">
              Los siguientes materiales son obligatorios para todos los tours:
            </p>
            <div className="space-y-1">
              {filteredMaterials.filter(m => m.mandatory).map(material => (
                <div key={material.id} className="flex items-center space-x-2 text-yellow-800">
                  <CheckCircleIcon className="w-4 h-4" />
                  <span className="font-medium">{material.name}</span>
                  <span className="text-sm">({material.items.length} elementos)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialsManager;