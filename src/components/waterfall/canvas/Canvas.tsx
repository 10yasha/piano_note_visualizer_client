import useCanvas from "./useCanvas";

function Canvas(props: any) {
  const { draw, ...rest } = props;
  const ref = useCanvas(draw);

  return <canvas ref={ref} {...rest} />;
}

export default Canvas;
