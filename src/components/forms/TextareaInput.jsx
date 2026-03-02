import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

const TextareaInput = forwardRef(({
  label,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  helperText,
  className = '',
  rows = 4,
  maxLength,
  showCount = false,
  ...props
}, ref) => {
  const charCount = value?.length || 0;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`w-full px-4 py-2.5 border rounded-lg transition-all focus:outline-none resize-vertical
          ${error 
            ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
            : 'border-gray-300 focus:ring-2 focus:ring-[#C8E636] focus:border-transparent'
          }
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        `}
        {...props}
      />
      <div className="flex items-center justify-between mt-1">
        {error ? (
          <div className="flex items-center gap-1">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-500">{error}</span>
          </div>
        ) : helperText ? (
          <p className="text-sm text-gray-500">{helperText}</p>
        ) : (
          <div />
        )}
        {showCount && maxLength && (
          <span className={`text-xs ${charCount > maxLength * 0.9 ? 'text-amber-600' : 'text-gray-400'}`}>
            {charCount}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
});

TextareaInput.displayName = 'TextareaInput';

export default TextareaInput;
