import Canvas from "./canvas/Canvas";

function Waterfall() {
  const draw = (context: CanvasRenderingContext2D, count: number) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = "#0E2F44";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = "#00abb4";
    const d = count % 400;
    context.fillRect(10 + d, 10, 100, 100);
  };

  return (
    <>
      <Canvas draw={draw} width="1144" height="300" />
    </>
  );
}

export default Waterfall;
