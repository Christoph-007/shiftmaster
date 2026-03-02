import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Modal from './Modal';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'danger',
  isLoading = false,
}) => {
  const confirmClasses = {
    danger: 'bg-red-600 text-white hover:bg-red-700',
    primary: 'bg-[#0B3D2E] text-white hover:bg-[#0a3528]',
    accent: 'bg-[#C8E636] text-[#0B3D2E] hover:bg-[#B5D42F]',
  };

  const handleConfirm = () => {
    onConfirm();
    if (!isLoading) {
      onClose();
    }
  };

  const footer = (
    <div className="flex justify-end gap-3">
      <button
        onClick={onClose}
        disabled={isLoading}
        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        {cancelLabel}
      </button>
      <button
        onClick={handleConfirm}
        disabled={isLoading}
        className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${confirmClasses[confirmVariant]}`}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          confirmLabel
        )}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
      footer={footer}
    >
      <div className="text-center py-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500">{message}</p>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
