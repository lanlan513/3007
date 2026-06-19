import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useFanStore } from '@/store/useFanStore';

interface SearchBarProps {
  isOpen?: boolean;
  onClose?: () => void;
  variant?: 'header' | 'hero';
}

export default function SearchBar({ isOpen, onClose, variant = 'hero' }: SearchBarProps) {
  const { searchKeyword, setSearchKeyword } = useFanStore();
  const [localValue, setLocalValue] = useState(searchKeyword);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchKeyword(localValue.trim());
  };

  const handleClear = () => {
    setLocalValue('');
    setSearchKeyword('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && onClose) {
      onClose();
    }
  };

  if (variant === 'header' && !isOpen) {
    return null;
  }

  if (variant === 'hero') {
    return (
      <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-vermilion-500 to-gold-500 rounded-2xl opacity-20 group-focus-within:opacity-40 blur transition-opacity duration-500" />

          <div className="relative flex items-center bg-white/90 backdrop-blur-sm rounded-2xl shadow-elegant overflow-hidden transition-all duration-300 focus-within:shadow-gold-glow">
            <div className="pl-5 text-ink-400">
              <Search size={20} />
            </div>

            <input
              ref={inputRef}
              type="text"
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="搜索扇子名称、类型、标签..."
              className="flex-1 px-4 py-4 bg-transparent text-ink-800 placeholder-ink-300 font-sans-sc text-base outline-none"
            />

            {localValue && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 mr-2 text-ink-400 hover:text-ink-600 transition-colors"
                aria-label="清除"
              >
                <X size={18} />
              </button>
            )}

            <button
              type="submit"
              className="h-full px-6 bg-vermilion-500 text-white font-serif-sc hover:bg-vermilion-600 active:bg-vermilion-700 transition-colors"
            >
              搜索
            </button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute top-full left-0 right-0 bg-paper-100/95 backdrop-blur-md border-b border-paper-300 p-4 animate-fade-in-down"
    >
      <div className="container mx-auto max-w-xl">
        <div className="relative flex items-center bg-white rounded-xl shadow-sm">
          <div className="pl-4 text-ink-400">
            <Search size={18} />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="搜索扇子..."
            className="flex-1 px-3 py-3 bg-transparent text-ink-800 placeholder-ink-300 outline-none"
            autoFocus
          />

          {localValue && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 text-ink-400 hover:text-ink-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 mr-1 text-ink-400 hover:text-ink-600 transition-colors"
              aria-label="关闭"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
