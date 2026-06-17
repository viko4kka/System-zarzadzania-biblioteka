type ColoredBoxProps = {
  text: string;
  color?: string;
};

export default function ColoredBox({
  text,
  color = "rgb(59, 130, 246)", // domyślnie niebieski
}: ColoredBoxProps) {
  return (
    <div
      className="
        inline-flex
        items-center
        justify-center
        px-5 py-2
        rounded-2xl
        text-black
        font-thin 
        font-medium
        select-none
        my-[1%]
        mx-[1%]
        ml-[0%]
      "
      style={{ backgroundColor: color }}
    >
      {text}
    </div>
  );
}