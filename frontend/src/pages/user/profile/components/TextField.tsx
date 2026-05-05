type TextFieldProps = {
  placeholder?: string;
  disabled?: boolean;
  default_value?: string;
};

export default function TextField({ placeholder, disabled = false, default_value }: TextFieldProps) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      disabled={disabled}
      value={default_value}
      className="
        
        px-4 py-2
        rounded-xl
        border-2 border-gray-300
        outline-none
        focus:border-gray-500
        transition
        w-[50%]
        mb-[1%]
      "
    />
  );
}