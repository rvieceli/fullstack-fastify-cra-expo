import { useCallback, useEffect } from "react";
import { AppState, AppStateStatus, Platform, View } from "react-native";
import FlashMessage from "react-native-flash-message";
import NetInfo from "@react-native-community/netinfo";

import {
  QueryClient,
  QueryClientProvider,
  focusManager,
  onlineManager,
} from "@tanstack/react-query";

import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import colors from "tailwindcss/colors";

import { useLoadFonts } from "./src/hooks/useLoadFonts";
import { Routes } from "./src/routes";
import { queryClient } from "./src/lib/queryClient";

SplashScreen.preventAutoHideAsync();

if (__DEV__) {
  require("./ReactotronConfig");
}

FlashMessage.setColorTheme({
  danger: colors.red[500],
  info: colors.violet[500],
  success: colors.green[500],
  warning: colors.yellow[500],
});

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
});

export default function App() {
  const isFontsLoaded = useLoadFonts();

  const onLayoutRootView = useCallback(async () => {
    if (isFontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [isFontsLoaded]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => subscription.remove();
  }, []);

  if (!isFontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <QueryClientProvider client={queryClient}>
        <Routes />
        <StatusBar translucent style="light" backgroundColor="#09090a" />
      </QueryClientProvider>
      <FlashMessage duration={3_000} color={colors.white} floating />
    </View>
  );
}
