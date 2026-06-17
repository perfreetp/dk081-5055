
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils';
import Button from './Button';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string | number;
  closable?: boolean;
  maskClosable?: boolean;
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  width = 520,
  closable = true,
  maskClosable = true,
  className,
}: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className={cn('absolute inset-0 bg-black/50 transition-opacity', open ? 'opacity-100' : 'opacity-0')}
        onClick={() => maskClosable && onClose()}
      />
      <div
        className={cn(
          'relative bg-white rounded-lg shadow-xl mx-4',
          'transition-all duration-200',
          open ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
          className
        )}
        style={{ width: typeof width === 'number' ? `${width}px` : width }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {closable && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

interface ConfirmModalProps extends Omit<ModalProps, 'footer' | 'children'> {
  content: string;
  confirmText?: string;
  cancelText?: string;
  confirmType?: 'primary' | 'danger';
  onConfirm: () => void;
}

export function ConfirmModal({
  content,
  confirmText = '确认',
  cancelText = '取消',
  confirmType = 'primary',
  onConfirm,
  ...props
}: ConfirmModalProps) {
  return (
    <Modal
      {...props}
      footer={
        <>
          <Button variant="secondary" onClick={props.onClose}>
            {cancelText}
          </Button>
          <Button variant={confirmType} onClick={onConfirm}>
            {confirmText}
          </Button>
        </>
      }
    >
      <p className="text-gray-700">{content}</p>
    </Modal>
  );
}

export default Modal;
