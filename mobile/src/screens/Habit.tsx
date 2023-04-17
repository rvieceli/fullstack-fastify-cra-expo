import { ScrollView, Text, View } from "react-native";
import { BackButton } from "../components/BackButton";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../routes/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProgressBar } from "../components/ProgressBar";
import { Checkbox } from "../components/Checkbox";
import { Loading } from "../components/Loading";
import { useGetDay } from "../hooks/useGetDay";
import { useToggleHabitCompletion } from "../hooks/useToggleHabitCompletion";
import { Fragment, useEffect, useState } from "react";
import { useRefreshOnFocus } from "../hooks/useRefreshOnFocus";
import { Fireworks } from "react-native-fiesta";
import colors from "tailwindcss/colors";

const weekDayFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
}).format;

const monthDayFormatter = new Intl.DateTimeFormat(undefined, {
  month: "long",
  day: "numeric",
}).format;

export function Habit({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "Habit">) {
  const [showFireworks, setShowFireworks] = useState(false);
  const { bottom } = useSafeAreaInsets();
  const date = new Date(route.params.date);

  const { isLoading, data, refetch } = useGetDay(route.params.date);
  const { handleToggleCompletion } = useToggleHabitCompletion(
    route.params.date
  );

  useRefreshOnFocus(refetch);

  const habitCount = data?.habits?.length ?? 0;
  const completedHabitCount =
    data?.habits?.reduce((acc, item) => acc + (item.completed ? 1 : 0), 0) ?? 0;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowFireworks(
        completedHabitCount > 0 && completedHabitCount === habitCount
      );
    }, 1000);

    return () => clearTimeout(timeout);
  }, [habitCount, completedHabitCount]);

  const weekDay = weekDayFormatter(date);
  const monthDay = monthDayFormatter(date);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <BackButton />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: bottom + 16,
        }}
      >
        <Text className="mt-6 font-semibold text-zinc-400 text-base lowercase">
          {weekDay}
        </Text>
        <Text className="mt-1 font-extrabold text-white text-3xl">
          {monthDay}
        </Text>

        <ProgressBar
          max={habitCount}
          value={completedHabitCount}
          className="mt-4"
        />

        <View className="mt-6">
          {data?.habits?.map((habit) => {
            return (
              <Checkbox
                key={habit.id}
                className="mb-2"
                isChecked={habit.completed}
                onPress={() => handleToggleCompletion(habit)}
              >
                {habit.title}
              </Checkbox>
            );
          })}

          {habitCount === 0 && (
            <Fragment>
              <Text className="text-zinc-400 text-base mt-6">
                There is not habit for this date.
              </Text>
              <Text
                className="text-violet-500 text-base underline active:text-violet-400 mt-1"
                onPress={() => navigation.navigate("New")}
              >
                Why don't you add one?
              </Text>
            </Fragment>
          )}
        </View>
      </ScrollView>
      {showFireworks && (
        <Fireworks
          autoPlay
          autoHide
          color={colors.violet[500]}
          numberOfFireworks={14}
          numberOfParticles={40}
          fireworkRadius={400}
        />
      )}
    </View>
  );
}
