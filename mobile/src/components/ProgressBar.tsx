import classNames from "classnames";
import { useEffect } from "react";
import { View, ViewProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  interpolateColor,
} from "react-native-reanimated";
import colors  from "tailwindcss/colors";

interface ProgressBarProps extends ViewProps {
  max: number;
  value: number;
}

export function ProgressBar({
  max,
  value,
  className,
  ...props
}: ProgressBarProps) {
  const progress = useSharedValue(0);

  const style = useAnimatedStyle(() => {
    return {
      width: `${progress.value}%`,
      backgroundColor: interpolateColor(
        progress.value,
        [0, 100],
        [colors.violet[800], colors.violet[500]]
      ),
    };
  });

  useEffect(() => {
    progress.value = withTiming(max > 0 ? (value / max) * 100 : 0, {
      duration: 500,
      easing: Easing.bezier(0.65, 0, 0.35, 1),
    });
  }, [max, value]);

  return (
    <View
      className={classNames("w-full h-3 rounded-xl bg-zinc-700", className)}
      {...props}
    >
      <Animated.View className="h-3 rounded-xl bg-violet-600" style={style} />
    </View>
  );
}
