import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const Alert = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-content">
        <AlertCircle size={24} />
        <p className="alert-message">{message}</p>
        <button onClick={onClose} className="alert-close">
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default Alert;