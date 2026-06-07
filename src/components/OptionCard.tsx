import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface OptionCardProps {
  icon: string;
  label: string;
  selected: boolean;
  onClick: () => void;
  description?: string;
  disabled?: boolean;
}

export function OptionCard({
  icon,
  label,
  selected,
  onClick,
  description,
  disabled = false,
}: OptionCardProps) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onClick}
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      animate={selected ? { scale: [1, 1.05, 1] } : {}}
      transition={{
        scale: {
          duration: 0.4,
          times: [0, 0.5, 1],
          ease: 'easeInOut',
        },
      }}
      className={cn(
        'relative p-4 rounded-2xl border-2 transition-all duration-300',
        'flex flex-col items-center justify-center gap-2',
        'min-h-[100px] cursor-pointer group',
        selected
          ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20'
          : 'border-border bg-card hover:border-primary/50 hover:bg-card/80',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <span
        className={cn(
          'text-3xl transition-transform duration-300',
          selected && 'scale-110'
        )}
      >
        {icon}
      </span>
      <span
        className={cn(
          'font-medium text-sm',
          selected ? 'text-primary' : 'text-foreground'
        )}
      >
        {label}
      </span>
      {description && (
        <span className="text-xs text-muted-foreground text-center">
          {description}
        </span>
      )}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs"
        >
          ✓
        </motion.div>
      )}
    </motion.button>
  );
}
