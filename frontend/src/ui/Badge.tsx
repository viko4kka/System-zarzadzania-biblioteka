type BadgeProps = {
  label: string;
  bgColor: string;
  color: string;
  maxWidth: string;
  size?: string;
};

export default function Badge({
  label,
  bgColor,
  color,
  maxWidth,
  size,
}: BadgeProps) {
  return (
    <div
      className="lg:text-md mx-1 my-1 block w-full truncate rounded-3xl px-4 py-1.5 text-center text-xs font-medium sm:text-sm" //sm:max-w-52  sm:text-sm lg:max-w-sm lg:px-10 xl:max-w-xl 2xl:max-w-4xl px-4
      style={{ backgroundColor: bgColor, color: color, maxWidth: maxWidth }}
    >
      {label}
    </div>
  );
}
