import React, { useCallback, useState } from "react";
import { Alert, Button, StyleSheet, TouchableOpacity } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Text, View } from "@/src/components/Themed";
import { Stack, useRouter } from "expo-router";
import DownloadExcelFileProducts from "./downloadAll";
import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const SaveToExcel = () => {
  const router = useRouter();

  const { PrintAllProducts } = useProtectedRoutesApi();
  const queryClient = useQueryClient();

  const printAllMutation = useMutation({
    mutationFn: PrintAllProducts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });

  const handleSaveAll = () => {
    printAllMutation.mutate();
    Alert.alert("Success", "Saved all products");
  };

  const handleSaveBySupplier = () => {
    router.push("/print/saveBySupplier");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleSaveAll}>
        <Text style={styles.buttonText}>Save all Products</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSaveBySupplier}>
        <Text style={styles.buttonText}>Save Products by Supplier</Text>
      </TouchableOpacity>

      <Text style={styles.downloadText}>List of files click to download</Text>
      {/* display here the files to be downloaded */}
      <DownloadExcelFileProducts />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "green",
    marginVertical: 10,

    borderRadius: 20,
  },
  buttonText: {
    alignSelf: "center",
    fontSize: 15,
    fontWeight: "bold",
  },

  downloadText: {
    marginTop: 20,
    alignSelf: "flex-start",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default SaveToExcel;
