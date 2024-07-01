import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";
import { MonoText } from "@/src/components/StyledText";
import { View, Text } from "@/src/components/Themed";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, TextInput, TouchableOpacity } from "react-native";

const RegisterCustomer = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const { CreateCustomer } = useProtectedRoutesApi();
  const queryClient = useQueryClient();
  const router = useRouter();

  const addSales = useMutation({
    mutationFn: CreateCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer"] });
      setName("");
      setAddress("");
    },
    onError: (err) => {
      Alert.alert("Error", `System Message` + err);
    },
  });

  const handleRegister = () => {
    const requestBody = {
      customer: {
        name,
        address,
      },
    };
    addSales.mutate(requestBody);
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <View style={{ alignItems: "center", padding: 10 }}>
        <MonoText style={{ fontSize: 20 }}>Register Customer</MonoText>
      </View>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{
          marginVertical: 10,
          padding: 20,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 5,
          color: "white",
        }}
        placeholderTextColor={"coral"}
      />
      <TextInput
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        style={{
          marginVertical: 10,
          padding: 20,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 5,
          color: "white",
        }}
        placeholderTextColor={"coral"}
      />

      <TouchableOpacity
        style={{
          alignItems: "center",
          padding: 20,
          backgroundColor: "teal",
          borderRadius: 20,
        }}
        onPress={handleRegister}
      >
        <Text>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterCustomer;
