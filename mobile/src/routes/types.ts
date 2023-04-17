export type RootStackParamList = {
  Home: undefined;
  Habit: { date: string };
  New: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
