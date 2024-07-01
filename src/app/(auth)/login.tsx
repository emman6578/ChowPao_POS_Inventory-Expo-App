import { TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { Text, View } from "@/src/components/Themed";
import React, { useState } from "react";

import { Stack, useRouter } from "expo-router";
import { login } from "@/libraries/API/auth/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const onLogin = async () => {
    console.log("Pressed");

    try {
      await login({ email });
      router.push({ pathname: "/authenticate", params: { email } });
    } catch (error: any) {
      Alert.alert("System Message", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Stack screenOptions={{ title: "Login" }} />
      <View style={styles.containerSignIn}>
        <Text style={styles.label}>Sign in or create an account</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <Pressable style={styles.button} onPress={onLogin}>
          <Text style={styles.buttonText}>Sign in</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  containerSignIn: { backgroundColor: "white", padding: 10, borderRadius: 15 },
  label: {
    color: "black",
    fontSize: 24,
    marginVertical: 5,
  },
  error: {
    marginVertical: 5,
    color: "red",
  },
  input: {
    borderColor: "gray",
    borderWidth: StyleSheet.hairlineWidth,
    padding: 10,
    fontSize: 20,
    marginVertical: 5,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#050A12",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginVertical: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Login;
