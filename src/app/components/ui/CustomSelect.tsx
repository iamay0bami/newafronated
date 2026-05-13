import { useState, useRef, useEffect, useId } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Check } from "lucide-react";
import { useT } from "../../context/ThemeContext";

export interface SelectOption {
  value: string;
  label: string;
  /** Shorter label shown inside the trigger when this option is selected */
  shortLabel?: string;
}

interface CustomSelectProps {
  id?: string;
  name: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  label: string;
}

export function CustomSelect({
  id,
  name,
  options,
  value,
  onChange,
  placeholder = "Select...",
  required,
  label,
}: CustomSelectProps) {
  const T = useT();
  const uid = useId();
  const inputId = id ?? `custom-select-${uid}`;
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value) ?? null;

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    if (!open) return;
    const onOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  // Arrow-key navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((o) => !o);
    }
    if (open && e.key === "ArrowDown") {
      e.preventDefault();
      const idx = options.findIndex((o) => o.value === value);
      const next = options[idx + 1];
      if (next) onChange(next.value);
    }
    if (open && e.key === "ArrowUp") {
      e.preventDefault();
      const idx = options.findIndex((o) => o.value === value);
      const prev = options[idx - 1];
      if (prev) onChange(prev.value);
    }
  };

  const labelCls = `block text-xs font-medium tracking-wider uppercase mb-2 ${T.textFaint}`;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Hidden native input so the value is part of the form */}
      <input type="hidden" name={name} value={value} required={required} />

      <label htmlFor={inputId} className={labelCls}>
        {label}{required && <span className="text-[#ef4444] ml-0.5">*</span>}
      </label>

      {/* Trigger */}
      <button
        type="button"
        id={inputId}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        onKeyDown={handleKeyDown}
        onClick={() => setOpen((o) => !o)}
        className={`
          w-full flex items-center justify-between gap-3
          px-0 py-3 border-b-2 bg-transparent
          text-left text-sm font-medium
          focus:outline-none transition-colors duration-200
          ${open
            ? "border-[#ef4444]"
            : T.isDark
            ? "border-white/20 hover:border-white/40"
            : "border-black/20 hover:border-black/40"
          }
          ${selected
            ? T.isDark ? "text-white" : "text-black"
            : T.isDark ? "text-white/30" : "text-black/30"
          }
        `}
      >
        <span className="truncate flex-1">
          {selected ? (selected.shortLabel ?? selected.label) : placeholder}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 ml-2"
        >
          <ChevronDown
            className={`w-4 h-4 transition-colors duration-200 ${
              open ? "text-[#ef4444]" : T.isDark ? "text-white/40" : "text-black/35"
            }`}
          />
        </motion.span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label={label}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className={`
              absolute left-0 right-0 z-50 mt-2
              rounded-xl border shadow-2xl
              overflow-hidden overflow-y-auto
              max-h-64
              ${T.isDark
                ? "bg-[#0f0f0f] border-white/10 shadow-black/70"
                : "bg-white border-black/10 shadow-black/12"
              }
            `}
          >
            {options.map((option, idx) => {
              const isActive = option.value === value;
              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`
                    relative flex items-start justify-between gap-3
                    px-4 py-3.5 cursor-pointer text-sm leading-snug
                    select-none transition-colors duration-150
                    ${idx !== 0
                      ? T.isDark ? "border-t border-white/[0.05]" : "border-t border-black/[0.05]"
                      : ""
                    }
                    ${isActive
                      ? "bg-[#ef4444]/12 text-[#ef4444]"
                      : T.isDark
                      ? "text-white/75 hover:bg-white/[0.06] hover:text-white"
                      : "text-black/70 hover:bg-black/[0.05] hover:text-black"
                    }
                  `}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#ef4444] rounded-r-full" />
                  )}
                  <span className="flex-1 pl-1">{option.label}</span>
                  {isActive && (
                    <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#ef4444]" />
                  )}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}