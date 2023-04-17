import {
  Text,
  TouchableOpacity,
  TextProps,
  View,
  TouchableOpacityProps,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import classNames from "classnames";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";

interface CheckboxProps extends TouchableOpacityProps {
  isChecked?: boolean;
  children?: TextProps["children"];
}

export function Checkbox({
  isChecked = false,
  children,
  className,
  ...props
}: CheckboxProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={classNames("flex-row items-center gap-3", className)}
      {...props}
    >
      {isChecked ? (
        <Animated.View
          className="w-8 h-8 bg-green-500 rounded-lg items-center justify-center"
          entering={ZoomIn}
          exiting={ZoomOut}
        >
          <Feather name="check" size={20} color={colors.white} />
        </Animated.View>
      ) : (
        <View className="w-8 h-8 bg-zinc-900 rounded-lg border-2 border-zinc-800" />
      )}

      <Text className="text-white text-base font-semibold">{children}</Text>
    </TouchableOpacity>
  );
}
