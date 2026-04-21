import { cva, type VariantProps } from "class-variance-authority";

const button = cva("button", {
  variants: {
    intent: {
      primary: [
        "bg-main-blue ",
        "text-white",
        "border-transparent font-display rounded-xl shadow-xl hover:bg-main-blue-hover cursor-pointer transition-all duration-300",
      ],
      secondary: [
        "bg-main-navy-blue",
        "text-white",
        "border-transparent font-display rounded-xl shadow-xl hover:bg-main-navy-blue-hover cursor-pointer transition-all duration-300",
      ],
      third: [
        "bg-white",
        "text-main-navy-blue",
        "border-transparent font-display rounded-xl hover:bg-zinc-100 shadow-xl tracking-wide cursor-pointer transition-all duration-300",
      ],
      login: [
        "bg-main-blue",
        "text-white",
        "border-transparent font-display rounded-3xl shadow-xl hover:bg-main-blue-hover cursor-pointer transition-all duration-300",
      ],
      lightButton: [
        "bg-main-light-blue",
        "text-main-navy-blue",
        "border-transparent font-display rounded-xl shadow-xl hover:bg-main-light-blue-hover cursor-pointer transition-all duration-300",
      ],
    },
    size: {
      small: ["text-sm", "py-1", "px-4"],
      medium: ["text-base", "py-1.5", "px-8", "font-medium"],
    },
    disabled: {
      false: null,
      true: [
        "opacity-50",
        "bg-disable",
        "cursor-not-allowed",
        "rounded-xl",
        "text-main-navy-blue/50",
      ],
    },
  },
});

export interface ButtonProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled">,
    VariantProps<typeof button> {}

export const Button: React.FC<ButtonProps> = ({
  className,
  intent,
  size,
  disabled,
  ...props
}) => (
  <button
    className={button({ intent, size, disabled, className })}
    disabled={disabled || undefined}
    {...props}
  />
);
