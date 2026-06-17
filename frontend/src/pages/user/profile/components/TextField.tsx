import { type ChangeEvent } from "react";

type TextFieldProps = {
  placeholder?: string;
  disabled?: boolean;
  default_value?: string;
  type?: "text" | "password"; 
  value?: string;             
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void; 
};

export default function TextField({ 
  placeholder, 
  disabled = false, 
  default_value,
  type = "text", 
  value,
  onChange 
}: TextFieldProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      defaultValue={default_value} 
      value={value}                
      onChange={onChange}          
      className="
        px-3 py-1.5
        text-sm
        rounded-xl
        border-2 border-gray-300
        outline-none
        focus:border-gray-500
        transition
        w-[90%]
        md:w-[50%]
        mb-2
      "
    />
  );
}