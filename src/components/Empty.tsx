import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';

interface EmptyProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
}

export default function Empty({
  icon,
  title = '暂无数据',
  description,
  onRetry,
  retryText = '重新加载',
  className,
}: EmptyProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-6', className)}>
      {icon && (
        <div className="mb-4 text-paper-400">
          {icon}
        </div>
      )}
      <h3 className="font-serif-sc text-lg font-bold text-ink-600 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-ink-400 text-center mb-4 max-w-md">{description}</p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-vermilion-50 text-vermilion-600 rounded-xl hover:bg-vermilion-100 transition-colors text-sm font-medium"
        >
          <RefreshCw size={16} />
          {retryText}
        </button>
      )}
    </div>
  );
}
