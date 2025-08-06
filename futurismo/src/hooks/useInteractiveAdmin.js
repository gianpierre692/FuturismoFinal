import { useState, useCallback } from 'react';
import useToastStore from '../stores/toastStore';
import Logger from '../utils/logger';

const useInteractiveAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const toast = useToastStore();

  // Función para mostrar confirmaciones elegantes
  const showConfirm = useCallback((options) => {
    return new Promise((resolve) => {
      setConfirmDialog({
        ...options,
        onConfirm: async () => {
          try {
            setIsLoading(true);
            await options.onConfirm?.();
            resolve(true);
          } catch (error) {
            Logger.error('Error en confirmación:', error);
            toast.error(error.message || 'Ha ocurrido un error');
            resolve(false);
          } finally {
            setIsLoading(false);
            setConfirmDialog(null);
          }
        },
        onCancel: () => {
          setConfirmDialog(null);
          resolve(false);
        }
      });
    });
  }, [toast]);

  // Función para eliminar con confirmación elegante
  const confirmDelete = useCallback(async (itemName, deleteAction) => {
    return showConfirm({
      type: 'delete',
      title: `Eliminar ${itemName}`,
      message: `¿Estás seguro de que deseas eliminar "${itemName}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      destructive: true,
      details: 'Todos los datos relacionados también serán eliminados permanentemente.',
      onConfirm: async () => {
        await deleteAction();
        toast.success(`${itemName} eliminado exitosamente`);
      }
    });
  }, [showConfirm, toast]);

  // Función para operaciones asíncronas con loading
  const handleAsyncOperation = useCallback(async (operation, options = {}) => {
    const {
      loadingMessage = 'Procesando...',
      successMessage = 'Operación completada exitosamente',
      errorMessage = 'Ha ocurrido un error'
    } = options;

    try {
      setIsLoading(true);
      const loadingToastId = toast.loading(loadingMessage);
      
      const result = await operation();
      
      toast.removeToast(loadingToastId);
      toast.success(successMessage);
      
      return result;
    } catch (error) {
      Logger.error('Error en operación:', error);
      toast.error(error.message || errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Función para crear/editar con feedback
  const handleSave = useCallback(async (saveAction, itemName = 'elemento', isEdit = false) => {
    return handleAsyncOperation(
      saveAction,
      {
        loadingMessage: `${isEdit ? 'Actualizando' : 'Creando'} ${itemName}...`,
        successMessage: `${itemName} ${isEdit ? 'actualizado' : 'creado'} exitosamente`,
        errorMessage: `Error al ${isEdit ? 'actualizar' : 'crear'} ${itemName}`
      }
    );
  }, [handleAsyncOperation]);

  // Función para exportar con feedback
  const handleExport = useCallback(async (exportAction, format = 'Excel') => {
    return handleAsyncOperation(
      exportAction,
      {
        loadingMessage: `Generando archivo ${format}...`,
        successMessage: `Archivo ${format} generado exitosamente`,
        errorMessage: `Error al generar archivo ${format}`
      }
    );
  }, [handleAsyncOperation]);

  // Función para importar con feedback
  const handleImport = useCallback(async (importAction, fileName) => {
    return handleAsyncOperation(
      importAction,
      {
        loadingMessage: `Importando ${fileName}...`,
        successMessage: 'Datos importados exitosamente',
        errorMessage: 'Error al importar datos'
      }
    );
  }, [handleAsyncOperation]);

  // Función para operaciones masivas
  const handleBulkOperation = useCallback(async (operation, selectedItems, actionName) => {
    const count = selectedItems.length;
    if (count === 0) {
      toast.warning('No hay elementos seleccionados');
      return false;
    }

    return showConfirm({
      type: 'warning',
      title: `${actionName} elementos`,
      message: `¿Estás seguro de que deseas ${actionName.toLowerCase()} ${count} elemento${count > 1 ? 's' : ''}?`,
      confirmText: actionName,
      onConfirm: async () => {
        await handleAsyncOperation(
          () => operation(selectedItems),
          {
            loadingMessage: `Procesando ${count} elemento${count > 1 ? 's' : ''}...`,
            successMessage: `${count} elemento${count > 1 ? 's' : ''} procesado${count > 1 ? 's' : ''} exitosamente`,
            errorMessage: `Error al procesar elementos`
          }
        );
      }
    });
  }, [showConfirm, handleAsyncOperation, toast]);

  // Función para notificaciones rápidas
  const notify = useCallback({
    success: (message, options) => toast.success(message, options),
    error: (message, options) => toast.error(message, options),
    warning: (message, options) => toast.warning(message, options),
    info: (message, options) => toast.info(message, options),
    loading: (message, options) => toast.loading(message, options)
  }, [toast]);

  return {
    // Estados
    isLoading,
    confirmDialog,
    
    // Funciones principales
    showConfirm,
    confirmDelete,
    handleAsyncOperation,
    handleSave,
    handleExport,
    handleImport,
    handleBulkOperation,
    
    // Notificaciones
    notify,
    
    // Acceso directo al store de toast
    toast,
    
    // Función para cerrar dialog
    closeConfirmDialog: () => setConfirmDialog(null)
  };
};

export default useInteractiveAdmin;