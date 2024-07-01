import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { authenticate } from "@/libraries/API/auth/auth";
import { useAuth } from "@/src/Context/AuthContext";

const Authenticate = () => {
  const [code, setCode] = useState("");
  const { email } = useLocalSearchParams();

  const { updateAuthToken } = useAuth();

  const onConfirm = async () => {
    console.log("Confirmed: ", email, code);
    if (typeof email !== "string") {
      return;
    }

    try {
      const res = await authenticate({ email, emailToken: code });

      updateAuthToken(res.authToken);
    } catch (error: any) {
      Alert.alert("System Message", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Stack screenOptions={{ title: "Confirm" }} />
      <View style={styles.containerSignIn}>
        <Text style={styles.label}>Confirm with code</Text>

        <TextInput
          placeholder="Code"
          value={code}
          onChangeText={setCode}
          style={styles.input}
          keyboardType="numeric"
        />

        <Pressable style={styles.button} onPress={onConfirm}>
          <Text style={styles.buttonText}>Confirm</Text>
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

export default Authenticate;
