import { createPortal } from 'react-dom';
import ToastNotification from './ToastNotification';
import useToastStore from '../../stores/toastStore';

const ToastContainer = ({ position = 'top-right' }) => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed inset-0 pointer-events-none z-50">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className="pointer-events-auto"
          style={{
            transform: `translateY(${index * 80}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        >
          <ToastNotification
            toast={toast}
            onClose={removeToast}
            position={position}
          />
        </div>
      ))}
    </div>,
    document.body
  );
};

export default ToastContainer;