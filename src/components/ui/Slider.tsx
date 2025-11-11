
import React, { useState } from 'react';

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onValueChange'> {
    value: number[];
    onValueChange: (value: number[]) => void;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(({ className, value, onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => {
    const [internalValue, setInternalValue] = useState(value[0]);
    const progress = ((internalValue - (min as number)) / ((max as number) - (min as number))) * 100;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(event.target.value);
        setInternalValue(newValue);
    };

    const handleMouseUp = () => {
        onValueChange([internalValue]);
    };
     const handleTouchEnd = () => {
        onValueChange([internalValue]);
    };


    return (
        <div className="relative flex items-center select-none touch-none w-full h-5">
            <input
                ref={ref}
                type="range"
                min={min}
                max={max}
                step={step}
                value={internalValue}
                onChange={handleChange}
                onMouseUp={handleMouseUp}
                onTouchEnd={handleTouchEnd}
                className={`w-full h-2 bg-transparent appearance-none group ${className || ''}`}
                style={{
                    background: `linear-gradient(to right, hsl(var(--primary)) ${progress}%, hsl(var(--secondary)) ${progress}%)`,
                    borderRadius: '9999px',
                    height: '0.5rem'
                }}
                {...props}
            />
        </div>
    );
});
Slider.displayName = 'Slider';

export { Slider };
