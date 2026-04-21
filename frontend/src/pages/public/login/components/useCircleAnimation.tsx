import { useEffect, useState } from "react";
import { motion } from "motion/react";

export const CIRCLES = 50;

const initPosition = Array.from({ length: CIRCLES }, () => ({
  x: Math.random() * 300,
  y: Math.random() * 300,
}));

function useCircleAnimation(index: number) {
  const [isDragging, setIsDragging] = useState(false);
  const [circlesPosition, setCirclesPosition] = useState(initPosition[index]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging) {
        setCirclesPosition({
          x: Math.random() * 300,
          y: Math.random() * 100,
        });
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isDragging]);

  return { isDragging, setIsDragging, circlesPosition };
}

function FloatingCircle({ index }: { index: number }) {
  const { isDragging, setIsDragging, circlesPosition } =
    useCircleAnimation(index);

  return (
    <motion.div
      initial={{ ...initPosition[index], opacity: 0 }}
      animate={{ ...circlesPosition, opacity: 1 }}
      transition={{ duration: 8, ease: "linear" }}
      drag
      dragTransition={{ bounceStiffness: 300, bounceDamping: 50 }}
      dragConstraints={{ left: 0, right: 300, top: 50, bottom: 480 }}
      dragElastic={1}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      className="800:flex absolute hidden h-8 w-12 items-center justify-center"
    >
      <span className="from-main-blue to-main-light-blue rounded-full bg-transparent bg-linear-to-r p-3" />
    </motion.div>
  );
}

export default FloatingCircle;
