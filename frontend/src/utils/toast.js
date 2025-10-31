import toast from 'react-hot-toast';

export const showSuccess = (message) => {
  toast.success(message, {
    duration: 3000,
    position: 'top-right',
    style: {
      background: '#10b981',
      color: '#fff',
    },
  });
};

export const showError = (message) => {
  toast.error(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#ef4444',
      color: '#fff',
    },
  });
};

export const showInfo = (message) => {
  toast(message, {
    duration: 3000,
    position: 'top-right',
    icon: 'ℹ️',
  });
};


