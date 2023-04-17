import { Fragment } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import colors from "tailwindcss/colors";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";
import { createHabit } from "../lib/api";
import { RootStackParamList } from "../routes/types";
import { showMessage } from "react-native-flash-message";
import classNames from "classnames";

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const CreateHabitSchema = z.object({
  title: z.string().trim().min(1, { message: "Title is required." }),
  recurrence: z
    .array(z.number().int().min(0).max(6))
    .min(1, "At least one day is required."),
});

type FormValues = z.infer<typeof CreateHabitSchema>;

const toggleSelect = (recurrence: number[], index: number) => {
  if (recurrence.includes(index)) {
    return recurrence.filter((item) => item !== index);
  } else {
    return [...recurrence, index];
  }
};

export function New({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "New">) {
  const { bottom } = useSafeAreaInsets();

  const { control, reset, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      title: "",
      recurrence: [],
    },
    resolver: zodResolver(CreateHabitSchema),
  });

  const queryClient = useQueryClient();
  const mutation = useMutation(createHabit, {
    onSuccess(data) {
      queryClient.invalidateQueries(["summary"]);

      reset();

      showMessage({
        message: `Habit "${data.title}" created successfully.`,
        type: "success",
      });

      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    },
    onError(error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";

      showMessage({
        message,
        type: "danger",
      });
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    await mutation.mutateAsync(values);
  };

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <BackButton />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottom + 16 }}
      >
        <Text className="mt-6 text-white font-extrabold text-3xl">
          Create Habit
        </Text>

        <Text className="mt-6 text-white font-semibold text-base">
          What is your commitment?
        </Text>

        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Fragment>
              <TextInput
                className={classNames(
                  "h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600",
                  {
                    "border-red-400": !!error,
                  }
                )}
                placeholder="E.g.: Drink water, work out, etc..."
                placeholderTextColor={colors.zinc[400]}
                value={value}
                onChangeText={onChange}
              />

              {error && (
                <Text className="text-red-400 text-xs font-regular mt-1">
                  {error.message}
                </Text>
              )}
            </Fragment>
          )}
        />

        <Text className="mt-6 text-white font-semibold text-base">
          What is the recurrence?
        </Text>

        <Controller
          control={control}
          name="recurrence"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Fragment>
              {error && (
                <Text className="text-red-400 text-xs font-regular mt-1">
                  {error.message}
                </Text>
              )}
              {weekDays.map((weekDay, index) => (
                <Checkbox
                  key={weekDay}
                  isChecked={value.includes(index)}
                  onPress={() => onChange(toggleSelect(value, index))}
                  className="mt-1"
                >
                  {weekDay}
                </Checkbox>
              ))}
            </Fragment>
          )}
        />

        <TouchableOpacity
          activeOpacity={0.7}
          className="h-12 mt-6 flex-row justify-center items-center bg-green-600 rounded-lg"
          onPress={handleSubmit(onSubmit)}
        >
          <Feather name="check" size={20} color={colors.white} />
          <Text className="text-white font-semibold text-base ml-2">
            Confirm
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
