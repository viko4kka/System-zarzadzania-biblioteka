type ButtonProps = {
  text: string;
  bgColor?: string;
  textColor?: string;
  onClick?: () => void;
};

export default function Button({
  text,
  bgColor = "rgb(59, 130, 246)", // niebieski domyślny
  textColor = "white",
  onClick,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        px-5 py-2
        rounded-xl
        font-medium
        shadow-md
        hover:shadow-lg
        transition
        active:scale-95
        select-none
      "
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {text}
    </button>
  );
}