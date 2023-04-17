import { NavigationContainer } from "@react-navigation/native";
import { View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "../screens/Home";
import { Habit } from "../screens/Habit";
import { New } from "../screens/New";
import { RootStackParamList } from "./types";

const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>();

export function Routes() {
  return (
    <View className="flex-1 bg-background">
      <NavigationContainer>
        <Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Screen name="Home" component={Home} />
          <Screen name="Habit" component={Habit} />
          <Screen name="New" component={New} />
        </Navigator>
      </NavigationContainer>
    </View>
  );
}
