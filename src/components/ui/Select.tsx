
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
);


interface SelectContextType {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  displayValue: React.ReactNode;
  setDisplayValue: (node: React.ReactNode) => void;
}

const SelectContext = createContext<SelectContextType | null>(null);

const useSelectContext = () => {
  const context = useContext(SelectContext);
  if (!context) throw new Error("Select components must be used within a Select provider");
  return context;
};

const Select: React.FC<{ children: React.ReactNode; value: string; onValueChange: (value: string) => void; }> = ({ children, value, onValueChange }) => {
  const [open, setOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState<React.ReactNode>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node) && contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen, triggerRef, displayValue, setDisplayValue }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
};

const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({ children, className = '', ...props }, ref) => {
    const { open, setOpen, triggerRef, displayValue } = useSelectContext();
    const handleRef = useCallback(
        (node: HTMLButtonElement | null) => {
            triggerRef.current = node;
            if (typeof ref === 'function') {
                ref(node);
            } else if (ref) {
                (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
            }
        },
        [ref, triggerRef]
    );
    return (
        <button
            ref={handleRef}
            onClick={() => setOpen(!open)}
            className={`flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            {...props}
        >
            {displayValue || children}
            <ChevronDownIcon className={`h-4 w-4 opacity-50 transform transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
    )
});
SelectTrigger.displayName = "SelectTrigger";

const SelectValue: React.FC<{ placeholder?: string }> = ({ placeholder }) => {
    const { value, displayValue } = useSelectContext();
    if (!value && placeholder) return <span className="text-muted-foreground">{placeholder}</span>
    return <>{displayValue}</>;
};

const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ children, className, ...props }, ref) => {
    const { open } = useSelectContext();
    if (!open) return null;
    return (
        <div 
            ref={ref}
            className={`absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 ${className}`}
            {...props}
        >
            <div className="p-1">{children}</div>
        </div>
    )
});
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value: string; }>(({ children, className, value, ...props }, ref) => {
    const { value: selectedValue, onValueChange, setOpen, setDisplayValue } = useSelectContext();
    const isSelected = selectedValue === value;

    useEffect(() => {
        if(isSelected) {
            setDisplayValue(children);
        }
    }, [isSelected, children, setDisplayValue]);
    
    return (
        <div
            ref={ref}
            onClick={() => {
                onValueChange(value);
                setOpen(false);
            }}
            className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent ${className}`}
            {...props}
        >
            {isSelected && (
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    <CheckIcon className="h-4 w-4" />
                </span>
            )}
            {children}
        </div>
    )
});
SelectItem.displayName = "SelectItem";

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };

