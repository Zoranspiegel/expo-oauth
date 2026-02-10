import { AuthContextProvider } from "@/context/auth";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <Stack />
    </AuthContextProvider>
  );
}
