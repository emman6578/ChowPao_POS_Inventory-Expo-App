import React, { useState } from "react";
import { Alert, Button, StyleSheet, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Text } from "@/src/components/Themed";

import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface FileObject {
  uri: string;
  name: string;
  mimeType?: string;
}

const CreateProductsFromExcel = () => {
  const { CreateProductFromExcel } = useProtectedRoutesApi();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (formData: any) => CreateProductFromExcel(formData),
    onSuccess: () => {
      Alert.alert("Success", "Product Created Successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => {
      Alert.alert("Error", "Failed to upload the Excel file: \n " + error);
    },
  });

  const [selectedFile, setSelectedFile] = useState<FileObject>({
    uri: "",
    name: "",
    mimeType: "",
  });

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      if (!result.canceled) {
        const file = result.assets![0];
        setSelectedFile({
          uri: file.uri,
          name: file.name,
          mimeType: file.mimeType,
        });
      } else {
        console.log("Document picking cancelled.");
      }
    } catch (err) {
      console.log("Error picking file:", err);
      Alert.alert("Error", "Failed to pick the Excel file. Please try again.");
    }
  };

  const handleFileUpload = async () => {
    const formData = {
      uri: selectedFile.uri,
      name: selectedFile.name,
      type: selectedFile.mimeType,
    };

    mutation.mutateAsync(formData);
  };

  return (
    <View style={styles.container}>
      <Button title="Select Excel File" onPress={pickFile} />
      {selectedFile.name ? (
        <View style={styles.fileInfo}>
          <Text style={styles.fileName}>{selectedFile.name}</Text>
          <Button title="Create Product" onPress={handleFileUpload} />
        </View>
      ) : null}
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
  fileInfo: {
    marginTop: 20,
    alignItems: "center",
  },
  fileName: {
    marginBottom: 10,
    fontSize: 16,
  },
});

export default CreateProductsFromExcel;
