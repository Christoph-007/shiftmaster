import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

const SearchBar = ({
  placeholder = 'Search...',
  value: propValue,
  onChange,
  onSearch,
  debounce = true,
  debounceMs = 400,
  className = '',
  showClear = true,
}) => {
  const [inputValue, setInputValue] = useState(propValue || '');
  const debouncedValue = useDebounce(inputValue, debounceMs);

  useEffect(() => {
    if (debounce && onSearch) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, debounce, onSearch]);

  useEffect(() => {
    if (propValue !== undefined && propValue !== inputValue) {
      setInputValue(propValue);
    }
  }, [propValue]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
    if (!debounce && onSearch) {
      onSearch(newValue);
    }
  };

  const handleClear = () => {
    setInputValue('');
    if (onChange) {
      onChange('');
    }
    if (onSearch) {
      onSearch('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(inputValue);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Search className="w-5 h-5" />
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent transition-all"
      />
      {showClear && inputValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </form>
  );
};

export default SearchBar;
