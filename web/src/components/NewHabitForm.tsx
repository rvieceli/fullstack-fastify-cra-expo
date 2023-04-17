import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "phosphor-react";
import { Checkbox } from "./Checkbox";
import { Fragment, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createHabit } from "../lib/api";
import { toast } from "react-toastify";
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

interface NewHabitFormProps {
  onSuccess?: () => void;
}

export function NewHabitForm({ onSuccess }: NewHabitFormProps) {
  const { control, register, handleSubmit } = useForm<FormValues>({
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
      toast.success(`Habit "${data.title}" created successfully.`, {
        className: "bg-green-500 text-white p-4 rounded-lg",
      });
      onSuccess?.();
    },
    onError(error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";

      toast.error(message, {
        className: "bg-red-500 text-white p-4 rounded-lg",
      });
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    await mutation.mutateAsync(values);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex flex-col mt-6"
    >
      <label htmlFor="title" className="font-semibold leading-tight">
        What is your commitment?
      </label>

      <Controller
        control={control}
        name="title"
        render={({ field, fieldState: { error } }) => (
          <Fragment>
            <input
              {...field}
              type="text"
              autoFocus
              placeholder="E.g.: Drink water, work out, etc..."
              className={classNames(
                "p-4 mt-3 rounded-lg bg-zinc-900 text-white placeholder:text-zinc-400 border-2 border-zinc-800",
                "focus:outline-none focus:ring-1 focus:ring-violet-800 focus:ring-offset-2 focus:ring-offset-background",
                {
                  "border-red-400": !!error,
                }
              )}
            />

            {error && (
              <span className="text-red-400 text-xs font-regular mt-1">
                {error.message}
              </span>
            )}
          </Fragment>
        )}
      />

      <Controller
        control={control}
        name="recurrence"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Fragment>
            <label htmlFor="" className="font-semibold leading-tight mt-6">
              What is the recurrence?
            </label>
            {error && (
              <span className="text-red-400 text-xs font-regular mt-1">
                {error.message}
              </span>
            )}
            <div className="flex flex-col gap-2 mt-3">
              {weekDays.map((weekDay, index) => (
                <Checkbox
                  key={weekDay}
                  checked={value.includes(index)}
                  onCheckedChange={() => onChange(toggleSelect(value, index))}
                >
                  {weekDay}
                </Checkbox>
              ))}
            </div>
          </Fragment>
        )}
      />

      <button
        type="submit"
        className="mt-6 p-4 flex items-center justify-center gap-3 rounded-lg font-semibold bg-green-600 hover:bg-green-500 transition-colors focus:outline-none focus:ring-1 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-background"
      >
        <Check size={20} weight="bold" />
        Confirm
      </button>
    </form>
  );
}
