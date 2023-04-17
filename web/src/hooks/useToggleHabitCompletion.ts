import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GetDay, GetSummary, toggleHabitCompletion } from "../lib/api";
import { useCallback } from "react";
import produce from "immer";
import { Flip, cssTransition, toast, Zoom } from "react-toastify";

const FlipInZoomOut = cssTransition({
  enter: `Toastify--animate Toastify__flip-enter`,
  exit: `Toastify--animate Toastify__zoom-exit`,
  appendPosition: false,
});

export function useToggleHabitCompletion(date: string) {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(
    ["toggleHabit"],
    toggleHabitCompletion,
    {
      onMutate(variables) {
        queryClient.cancelQueries(["day", date]);
        const previous = queryClient.getQueryData<GetDay>(["day", date]);
        if (!previous) {
          return;
        }
        queryClient.setQueryData(["day", date], {
          ...previous,
          habits: previous.habits.map((habit: any) => {
            if (habit.id === variables.habitId) {
              return { ...habit, completed: !habit.completed };
            }
            return habit;
          }),
        });

        return { previous };
      },
      onSuccess(data, variables, context) {
        queryClient.cancelQueries(["summary"]);

        const previous = queryClient.getQueryData<GetSummary>(["summary"]);

        if (!previous) {
          return;
        }

        queryClient.setQueryData<GetSummary>(
          ["summary"],
          produce(previous, (draft) => {
            if (!draft.summary[date]) {
              draft.summary[date] = {
                ...data.day,
                total: context?.previous.habits.length || 0,
                completed: 0,
              };
            }

            draft.summary[date].completed += data.completed ? 1 : -1;
          })
        );
      },
      onError(_, __, context) {
        if (context?.previous) {
          queryClient.setQueryData(["day", date], context.previous);
        } else {
          queryClient.invalidateQueries(["day", date]);
        }
      },
    }
  );

  const handleToggleCompletion = useCallback(
    (habit: GetDay["habits"][number]) => {
      toast.promise(
        mutateAsync({ habitId: habit.id, date }),
        {
          pending: "Saving...",
          success: {
            render: "Well done 🎉",
            transition: FlipInZoomOut,
            delay: 500,
          },
          error: {
            render: "Something went wrong.",
            transition: FlipInZoomOut,
            delay: 500,
          },
        },
        { toastId: habit.id }
      );
    },
    [date, mutateAsync]
  );

  return { handleToggleCompletion, isLoading };
}
