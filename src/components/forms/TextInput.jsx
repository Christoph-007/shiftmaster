import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

const TextInput = forwardRef(({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  helperText,
  className = '',
  icon: Icon,
  ...props
}, ref) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 border rounded-lg transition-all focus:outline-none
            ${Icon ? 'pl-11' : ''}
            ${error 
              ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
              : 'border-gray-300 focus:ring-2 focus:ring-[#C8E636] focus:border-transparent'
            }
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          `}
          {...props}
        />
      </div>
      {error && (
        <div className="flex items-center gap-1 mt-1">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-sm text-red-500">{error}</span>
        </div>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

TextInput.displayName = 'TextInput';

export default TextInput;
