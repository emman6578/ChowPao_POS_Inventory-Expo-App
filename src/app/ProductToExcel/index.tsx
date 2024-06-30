import React, { useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { Text } from "@/src/components/Themed";
import { Stack, useRouter } from "expo-router";

const CreateOrUpdate = () => {
  const router = useRouter();

  const handleCreate = () => {
    router.push("ProductToExcel/create");
  };

  const handleUpdate = () => {
    router.push("ProductToExcel/update");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Product" }} />
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleCreate}>
        <Text style={styles.buttonText}>Create</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  button: {
    padding: 20,
    backgroundColor: "green",
    marginHorizontal: 20,

    borderRadius: 20,
  },
  buttonText: {
    fontSize: 20,
  },
});

export default CreateOrUpdate;
