import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import moment from "moment";

import { Text, View } from "@/src/components/Themed";

import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { API_URL } from "@/libraries/API/config/config";

const DownloadExcelFileProducts = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { GetFilesFromServer } = useProtectedRoutesApi();

  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["files"],
    queryFn: GetFilesFromServer,
  });

  const handleDownload = (filename: string, token: string) => {
    // Construct the download URL
    const downloadUrl = `${API_URL}/print/download/${filename}?token=${token}`;
    // Use Linking to open the URL which should trigger the file download
    Linking.openURL(downloadUrl).catch((err) =>
      console.error("Failed to open URL: ", err)
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>
          Error fetching files: {error.message}
        </Text>
      </View>
    );
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Sort files by timestamp
  const sortedFiles = data?.files.sort((a: any, b: any) => {
    // Extract timestamp from filename
    const getTimestamp = (filename: any) => {
      const parts = filename.split("_");
      if (parts.length < 3) return null; // Invalid filename format

      const dateString = parts.slice(-2).join(" ").replace(".xlsx", "");
      return moment(dateString, "YYYY-MM-DD HH-mm-ss", true); // Use strict parsing
    };

    const timestampA: any = getTimestamp(a);
    const timestampB: any = getTimestamp(b);

    if (!timestampA || !timestampB) return 0; // Handle invalid filenames

    return timestampB - timestampA;
  });

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={sortedFiles}
        keyExtractor={(item, index) => `file_${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleDownload(item, data.downloadToken)}
          >
            <View style={styles.fileInfo}>
              <Text style={styles.fileName}>{item}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.center}>
            <Text style={styles.emptyText}>No files available</Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  fileInfo: {
    backgroundColor: "gray",
    marginVertical: 10,
    borderBottomWidth: 1,
    borderRadius: 20,
    padding: 20,
  },
  fileName: {
    fontSize: 15,
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  emptyText: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#666666",
  },
});

export default DownloadExcelFileProducts;
