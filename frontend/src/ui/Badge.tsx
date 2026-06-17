type BadgeProps = {
  label: string;
  bgColor: string;
  color: string;
  maxWidth: string;
};

export default function Badge({ label, bgColor, color, maxWidth }: BadgeProps) {
  return (
    <div
      className="mx-1 my-1 block w-full truncate rounded-3xl px-2 py-1 text-center text-xs font-medium sm:text-sm xl:px-4 xl:py-1.5 xl:text-base" //sm:max-w-52  sm:text-sm lg:max-w-sm lg:px-10 xl:max-w-xl 2xl:max-w-4xl px-4
      style={{ backgroundColor: bgColor, color: color, maxWidth: maxWidth }}
    >
      {label}
    </div>
  );
}
