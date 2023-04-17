import AsyncStorage from "@react-native-async-storage/async-storage";
import Reactotron from "reactotron-react-native";
import {
  QueryClientManager,
  reactotronReactQuery,
} from "reactotron-react-query";
import { queryClient } from "./src/lib/queryClient";

const queryClientManager = new QueryClientManager({
  queryClient: queryClient as any,
});

Reactotron.setAsyncStorageHandler?.(AsyncStorage)
  .configure({
    name: "Habits app",
  })
  .useReactNative()
  .use(reactotronReactQuery(queryClientManager))
  .configure({
    onDisconnect: () => {
      queryClientManager.unsubscribe();
    },
  })
  .connect();
