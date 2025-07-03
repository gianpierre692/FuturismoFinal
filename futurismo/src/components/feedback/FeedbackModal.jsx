import React, { useState } from 'react';
import { 
  XMarkIcon as X, 
  ChatBubbleLeftRightIcon as MessageCircle, 
  UserIcon as User, 
  BuildingOffice2Icon as Building 
} from '@heroicons/react/24/outline';
import ServiceAreaFeedback from './ServiceAreaFeedback';
import StaffFeedback from './StaffFeedback';

const FeedbackModal = ({ 
  isOpen, 
  onClose, 
  type = 'service', // 'service' or 'staff'
  data = null,
  onSubmit 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [feedbackData, setFeedbackData] = useState(null);

  if (!isOpen) return null;

  const handleFeedbackSubmit = (submittedData) => {
    setFeedbackData(submittedData);
    console.log('Feedback submitted:', submittedData);
    onSubmit(submittedData);
    handleClose();
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFeedbackData(null);
    onClose();
  };

  const renderModalContent = () => {
    if (type === 'service') {
      return (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Building className="text-blue-600" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Opiniones y Sugerencias
                </h2>
                <p className="text-gray-600">
                  {data?.serviceName || 'Sobre el Servicio'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <ServiceAreaFeedback
            serviceId={data?.serviceId}
            onFeedbackSubmit={handleFeedbackSubmit}
            existingFeedback={data?.existingFeedback}
          />
        </div>
      );
    }

    if (type === 'staff') {
      return (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <User className="text-green-600" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Retroalimentación de Personal
                </h2>
                <p className="text-gray-600">
                  Opiniones y sugerencias sobre el equipo
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <StaffFeedback
            staffMember={data}
            onFeedbackSubmit={handleFeedbackSubmit}
            existingFeedback={data?.existingFeedback}
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {renderModalContent()}
      </div>
    </div>
  );
};

export default FeedbackModal;