import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { CalendarGraph } from "./components/CalendarGraph";
import { Header } from "./components/Header";
import { ToastContainer, Zoom } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./styles/global.css";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="w-full max-w-5xl px-6 flex flex-col gap-16">
          <Header />
          <CalendarGraph />
        </div>
      </div>
      <ToastContainer
        autoClose={2_000}
        hideProgressBar
        icon={false}
        // closeButton={false}
        theme="colored"
        transition={Zoom}
        limit={2}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
