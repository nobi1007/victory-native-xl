import * as React from "react";
import type { SkPath } from "@shopify/react-native-skia";
import {
  useDerivedValue,
  useSharedValue,
  withSpring,
  type WithSpringConfig,
  withTiming,
  type WithTimingConfig,
} from "react-native-reanimated";
import { usePrevious } from "../utils/usePrevious";
import { Skia } from "@shopify/react-native-skia";

export const useAnimatedPath = (
  path: SkPath,
  animConfig:
    | ({ type: "timing" } & WithTimingConfig)
    | { type: "spring" & WithSpringConfig } = { type: "timing", duration: 300 },
) => {
  const t = useSharedValue(0);
  const prevPath = usePrevious(path);

  React.useEffect(() => {
    const { type, ...rest } = animConfig;
    t.value = 0;
    t.value = (type === "timing" ? withTiming : withSpring)(1, rest);
  }, [path]);

  return useDerivedValue<SkPath>(() => {
    if (t.value !== 1 && path.isInterpolatable(prevPath)) {
      return path.interpolate(prevPath, t.value) || Skia.Path.Make();
    }
    return path;
  });
};