import {
  eachDayOfInterval,
  format,
  startOfWeek,
  subDays,
  max,
  isAfter,
  isSameDay,
  differenceInDays,
} from "date-fns";
import {
  FlatList,
  ListRenderItem,
  RefreshControl,
  Text,
  View,
} from "react-native";
import {
  DayGraph,
  DAY_GRAPH_SIZE,
  DAY_GRAPH_GAP,
} from "../components/DayGraph";
import { Header } from "../components/Header";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Loading } from "../components/Loading";
import { useCallback, useReducer, useState } from "react";
import { useGetSummary } from "../hooks/useGetSummary";
import colors from "tailwindcss/colors";
import chunk from "lodash.chunk";
import { DateItem, generateDates } from "../utils/generateDates";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const NUM_COLUMNS = 7;

type CalendarReducerAction =
  | {
      type: "LOAD";
    }
  | {
      type: "LOAD_MORE";
      payload: {
        base: Date;
        interval: number;
      };
    };

type CalendarState = {
  dates: DateItem[];
  isEndReached: boolean;
};

function calendarReducer(state: CalendarState, action: CalendarReducerAction) {
  switch (action.type) {
    case "LOAD":
      return generateDates();
    case "LOAD_MORE": {
      const { base, interval } = action.payload;

      const { dates, isEndReached } = generateDates(base, interval);

      return {
        dates: [...state.dates, ...dates],
        isEndReached,
      };
    }
  }
}

export function Home() {
  const { bottom } = useSafeAreaInsets();
  const { navigate } = useNavigation();
  const { isLoading, data, refetch, isRefetching } = useGetSummary();

  const [calendar, dispatch] = useReducer(calendarReducer, undefined, () =>
    generateDates()
  );

  const renderItem = useCallback<ListRenderItem<DateItem>>(
    ({ item }) => {
      if (!item.date) {
        return (
          <View
            className="bg-zinc-800 rounded-lg border-2 border-zinc-800 m-1 opacity-40"
            style={{
              width: DAY_GRAPH_SIZE,
              height: DAY_GRAPH_SIZE,
            }}
          />
        );
      }

      const summary = data?.summary[item.date];

      return (
        <DayGraph
          date={item.date}
          total={summary?.total}
          completed={summary?.completed}
          onPress={() => item.date && navigate("Habit", { date: item.date })}
          isLoading={isLoading}
        />
      );
    },
    [data, isLoading]
  );

  function renderFooter() {
    if (!calendar.isEndReached) {
      return null;
    }

    return (
      <View className="flex-1 items-center justify-center mt-4">
        <Text className="text-lg">🚀</Text>
        <Text className="text-white font-semibold mt-2">
          You've started your journey here!
        </Text>
      </View>
    );
  }

  function handleLoadMore() {
    const { dates, isEndReached } = calendar;

    const lastDate = dates[dates.length - 1];
    if (!isEndReached && lastDate?.date) {
      const dayBeforeLastDay = subDays(new Date(lastDate.date), 7);

      dispatch({
        type: "LOAD_MORE",
        payload: {
          base: dayBeforeLastDay,
          interval: 180,
        },
      });
    }
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />
      <View className="flex-row mt-4">
        {weekDays.map((day) => (
          <View key={day} className="flex-1 items-center justify-center  my-2">
            <Text className="text-zinc-400 text-sm font-regular">{day}</Text>
          </View>
        ))}
      </View>
      <FlatList
        data={calendar.dates}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={{ paddingBottom: bottom + 16 }}
        refreshControl={
          <RefreshControl
            onRefresh={refetch}
            refreshing={isRefetching}
            tintColor={colors.violet[300]}
            title="Getting fresh data..."
            titleColor={colors.violet[100]}
            colors={[colors.violet[300]]}
          />
        }
        onEndReachedThreshold={0.9}
        onEndReached={handleLoadMore}
        initialNumToRender={20} // 20 weeks
        getItemLayout={(data, index) => ({
          length: DAY_GRAPH_SIZE + DAY_GRAPH_GAP,
          offset:
            (DAY_GRAPH_SIZE + DAY_GRAPH_GAP) * Math.floor(index / NUM_COLUMNS),
          index,
        })}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
}
