import React, { useState } from 'react';
import { 
  StarIcon as Star, 
  UserIcon as User, 
  TrophyIcon as Award, 
  ChatBubbleLeftRightIcon as MessageCircle, 
  ArrowTrendingUpIcon as TrendingUp, 
  ClockIcon as Clock, 
  CheckCircleIcon as CheckCircle 
} from '@heroicons/react/24/outline';

const StaffEvaluation = ({ staffMember, onEvaluationSubmit, existingEvaluation = null }) => {
  const [evaluation, setEvaluation] = useState({
    performance: existingEvaluation?.performance || 0,
    communication: existingEvaluation?.communication || 0,
    professionalism: existingEvaluation?.professionalism || 0,
    knowledge: existingEvaluation?.knowledge || 0,
    punctuality: existingEvaluation?.punctuality || 0,
    teamwork: existingEvaluation?.teamwork || 0
  });

  const [feedback, setFeedback] = useState({
    strengths: existingEvaluation?.feedback?.strengths || '',
    improvements: existingEvaluation?.feedback?.improvements || '',
    generalComments: existingEvaluation?.feedback?.generalComments || ''
  });

  const [recommendation, setRecommendation] = useState(
    existingEvaluation?.recommendation || 'highly_recommend'
  );

  const evaluationCriteria = [
    {
      key: 'performance',
      label: 'Desempeño General',
      icon: TrendingUp,
      description: 'Calidad del trabajo y cumplimiento de objetivos'
    },
    {
      key: 'communication',
      label: 'Comunicación',
      icon: MessageCircle,
      description: 'Habilidades de comunicación con clientes y equipo'
    },
    {
      key: 'professionalism',
      label: 'Profesionalismo',
      icon: Award,
      description: 'Actitud profesional y presentación personal'
    },
    {
      key: 'knowledge',
      label: 'Conocimiento Técnico',
      icon: User,
      description: 'Dominio de conocimientos y habilidades técnicas'
    },
    {
      key: 'punctuality',
      label: 'Puntualidad',
      icon: Clock,
      description: 'Cumplimiento de horarios y compromisos'
    },
    {
      key: 'teamwork',
      label: 'Trabajo en Equipo',
      icon: CheckCircle,
      description: 'Colaboración y apoyo al equipo de trabajo'
    }
  ];

  const recommendationOptions = [
    { value: 'highly_recommend', label: 'Muy Recomendado', color: 'text-green-600' },
    { value: 'recommend', label: 'Recomendado', color: 'text-blue-600' },
    { value: 'satisfactory', label: 'Satisfactorio', color: 'text-yellow-600' },
    { value: 'needs_improvement', label: 'Necesita Mejoras', color: 'text-orange-600' },
    { value: 'not_recommend', label: 'No Recomendado', color: 'text-red-600' }
  ];

  const handleRatingChange = (criterion, rating) => {
    setEvaluation(prev => ({
      ...prev,
      [criterion]: rating
    }));
  };

  const handleFeedbackChange = (type, value) => {
    setFeedback(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleSubmit = () => {
    const evaluationData = {
      staffMemberId: staffMember.id,
      evaluation,
      feedback,
      recommendation,
      timestamp: new Date().toISOString(),
      averageRating: Object.values(evaluation).reduce((sum, rating) => sum + rating, 0) / Object.values(evaluation).length,
      evaluatedBy: 'current_user_id' // Should be replaced with actual user ID
    };
    
    onEvaluationSubmit(evaluationData);
  };

  const renderStars = (criterion, currentRating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRatingChange(criterion, star)}
            className={`transition-colors ${
              star <= currentRating
                ? 'text-yellow-400 hover:text-yellow-500'
                : 'text-gray-300 hover:text-gray-400'
            }`}
          >
            <Star
              size={18}
              fill={star <= currentRating ? 'currentColor' : 'none'}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {currentRating > 0 ? `${currentRating}/5` : 'Sin evaluar'}
        </span>
      </div>
    );
  };

  const isComplete = Object.values(evaluation).every(rating => rating > 0);
  const averageRating = Object.values(evaluation).reduce((sum, rating) => sum + rating, 0) / Object.values(evaluation).length;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            <User className="text-blue-600" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Evaluación de Personal
            </h2>
            <p className="text-gray-600">
              {staffMember.name} - {staffMember.role}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {evaluationCriteria.map((criterion) => {
          const IconComponent = criterion.icon;
          return (
            <div key={criterion.key} className="border rounded-lg p-4">
              <div className="flex items-center mb-2">
                <IconComponent className="text-blue-600 mr-2" size={18} />
                <h3 className="font-medium text-gray-800">{criterion.label}</h3>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{criterion.description}</p>
              
              <div>
                {renderStars(criterion.key, evaluation[criterion.key])}
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fortalezas Identificadas
          </label>
          <textarea
            value={feedback.strengths}
            onChange={(e) => handleFeedbackChange('strengths', e.target.value)}
            placeholder="Describe las principales fortalezas del empleado..."
            className="w-full p-3 border rounded-md resize-none"
            rows={3}
            maxLength={500}
          />
          <div className="text-xs text-gray-500 mt-1">
            {feedback.strengths.length}/500 caracteres
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Áreas de Mejora
          </label>
          <textarea
            value={feedback.improvements}
            onChange={(e) => handleFeedbackChange('improvements', e.target.value)}
            placeholder="Sugiere áreas donde el empleado puede mejorar..."
            className="w-full p-3 border rounded-md resize-none"
            rows={3}
            maxLength={500}
          />
          <div className="text-xs text-gray-500 mt-1">
            {feedback.improvements.length}/500 caracteres
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comentarios Generales
          </label>
          <textarea
            value={feedback.generalComments}
            onChange={(e) => handleFeedbackChange('generalComments', e.target.value)}
            placeholder="Comentarios adicionales sobre el desempeño..."
            className="w-full p-3 border rounded-md resize-none"
            rows={3}
            maxLength={500}
          />
          <div className="text-xs text-gray-500 mt-1">
            {feedback.generalComments.length}/500 caracteres
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Recomendación General
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {recommendationOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setRecommendation(option.value)}
              className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                recommendation === option.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <span className={option.color}>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {isComplete && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-green-800">Resumen de Evaluación</h4>
              <p className="text-green-600">
                Promedio: {averageRating.toFixed(1)}/5 - {recommendationOptions.find(opt => opt.value === recommendation)?.label}
              </p>
            </div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}
                  fill={star <= Math.round(averageRating) ? 'currentColor' : 'none'}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          onClick={handleSubmit}
          disabled={!isComplete}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            isComplete
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Guardar Evaluación
        </button>
      </div>
    </div>
  );
};

export default StaffEvaluation;