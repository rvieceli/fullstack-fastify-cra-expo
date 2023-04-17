import {
  Dimensions,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import classnames from "classnames";
import { isToday } from "date-fns";
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";
import { interpolateColor } from "react-native-reanimated";
import colors from "tailwindcss/colors";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const NUM_DAYS = 7;
const width = Dimensions.get("screen").width;
export const HORIZONTAL_PADDING = 32;
export const DAY_GRAPH_GAP = 8;
const GAPS = DAY_GRAPH_GAP * (NUM_DAYS - 0);
export const DAY_GRAPH_SIZE =
  (width - GAPS - HORIZONTAL_PADDING * 2) / NUM_DAYS;

interface DayGraphProps extends TouchableOpacityProps {
  date: string;
  total?: number;
  completed?: number;
  isLoading?: boolean;
}

function between(x: number, min: number, max: number) {
  return x > min && x <= max;
}

export function DayGraph({
  date,
  total = 0,
  completed = 0,
  className,
  isLoading = false,
  ...props
}: DayGraphProps) {
  const progress = total ? (completed / total) * 100 : 0;
  const today = isToday(new Date(date));

  const animation = useSharedValue(0);

  useEffect(() => {
    animation.value = withRepeat(
      withTiming(1, {
        duration: Math.max(2_000, Math.random() * 5_000),
        easing: Easing.bezier(0.4, 0, 0.6, 1),
      }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    if (!isLoading) {
      return {
        opacity: 1,
      };
    }

    return {
      opacity: interpolate(
        animation.value,
        [0, 1],
        [1, 0.2],
        Extrapolate.CLAMP
      ),
    };
  });

  return (
    <AnimatedTouchableOpacity
      className={classnames(
        "rounded-lg border-2 m-1 justify-center items-center",
        className,
        {
          "bg-zinc-900 border-2 border-zinc-800": progress === 0,
          "bg-violet-900 border-violet-700": between(progress, 0, 20),
          "bg-violet-800 border-violet-600": between(progress, 20, 40),
          "bg-violet-700 border-violet-500": between(progress, 40, 60),
          "bg-violet-600 border-violet-500": between(progress, 60, 80),
          "bg-violet-500 border-violet-400": between(progress, 80, 100),
          "border-white": today,
        }
      )}
      activeOpacity={0.7}
      style={[
        {
          width: DAY_GRAPH_SIZE,
          height: DAY_GRAPH_SIZE,
        },
        animatedStyle,
      ]}
      {...props}
    />
  );
}
