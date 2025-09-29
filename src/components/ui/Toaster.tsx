import { useState, useEffect } from 'react';
import { FiX, FiCheck, FiAlertCircle, FiInfo } from 'react-icons/fi';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
  duration?: number;
}

class ToasterService {
  private subscribers: Array<(toasts: Toast[]) => void> = [];
  private toasts: Toast[] = [];

  subscribe(callback: (toasts: Toast[]) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notify() {
    this.subscribers.forEach(callback => callback([...this.toasts]));
  }

  toast(toast: Omit<Toast, 'id'>) {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id, duration: toast.duration || 5000 };
    
    this.toasts.push(newToast);
    this.notify();

    setTimeout(() => {
      this.remove(id);
    }, newToast.duration);

    return id;
  }

  remove(id: string) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.notify();
  }
}

export const toaster = new ToasterService();

// Make toaster available globally for components that need it
if (typeof window !== 'undefined') {
  (window as any).toaster = toaster;
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    return toaster.subscribe(setToasts);
  }, []);

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success': return FiCheck;
      case 'error': return FiAlertCircle;
      case 'warning': return FiAlertCircle;
      case 'info': return FiInfo;
      default: return FiInfo;
    }
  };

  const getColors = (type: Toast['type']) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => {
        const Icon = getIcon(toast.type);
        const colors = getColors(toast.type);
        
        return (
          <div
            key={toast.id}
            className={`max-w-sm w-full shadow-lg rounded-lg border p-4 ${colors} animate-in slide-in-from-right duration-300`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Icon className="h-5 w-5 mt-0.5" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">{toast.title}</p>
                {toast.description && (
                  <p className="mt-1 text-sm opacity-90">{toast.description}</p>
                )}
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  onClick={() => toaster.remove(toast.id)}
                  className="inline-flex text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}