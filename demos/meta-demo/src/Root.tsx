import { Composition } from "remotion";
import { MetaDemo } from "./MetaDemo";

export const Root = () => {
  return (
    <Composition
      id="MetaDemo"
      component={MetaDemo}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
