import { useAuth } from "@/context/auth";
import { Button, Text, View } from "react-native";

export default function LoginForm() {
  const { signIn } = useAuth();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text>Login</Text>
      <Button title="Sign in with Google" onPress={signIn} />
    </View>
  );
}
