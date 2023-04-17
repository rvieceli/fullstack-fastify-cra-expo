import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import { useNavigation } from "@react-navigation/native";

export function BackButton() {
  const { canGoBack, goBack,  } = useNavigation();

  if (!canGoBack()) {
    return null;
  }

  return (
    <TouchableOpacity onPress={() => goBack()} activeOpacity={0.7}>
      <Feather name="arrow-left" size={32} color={colors.zinc[400]} />
    </TouchableOpacity>
  );
}
