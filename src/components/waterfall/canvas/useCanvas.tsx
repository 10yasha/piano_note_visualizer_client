import { useRef, useEffect } from "react";

const useCanvas = (
  draw: (context: CanvasRenderingContext2D, count: number) => void
) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (ref.current) {
      const context = ref.current.getContext("2d");
      if (context) {
        let count = 0;
        let animationId: number;

        const renderer = () => {
          count++;
          draw(context, count);
          animationId = window.requestAnimationFrame(renderer);
        };
        renderer();

        return () => {
          window.cancelAnimationFrame(animationId);
        };
      }
    }
  }, [draw]);

  return ref;
};

export default useCanvas;
