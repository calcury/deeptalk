import React, { useEffect } from 'react';
import { X } from 'lucide-react';

// `fill` keeps the body from scrolling itself — used when a child manages its own
// fixed-height / scroll layout (e.g. the settings panel with its side navigation).
export default function Modal({ title, eyebrow, description, onClose, children, footer, size, fill }) {
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const classes = ['modal', size && 'modal-' + size, fill && 'modal-fill'].filter(Boolean).join(' ');

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={classes} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-head">
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h2>{title}</h2>}
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        {description && <p className="modal-description">{description}</p>}
        <div className={'modal-body' + (fill ? ' fill' : '')}>{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}
