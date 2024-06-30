import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";
import { Text, View } from "@/src/components/Themed";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Button,
  ScrollView, // Import Button component from react-native
} from "react-native";

const SelectDriver = () => {
  const { GetDrivers, AddToDelivery } = useProtectedRoutesApi();

  const queryClient = useQueryClient();

  const { productIds } = useLocalSearchParams();

  let productIdsArray: string[] = [];
  if (typeof productIds === "string") {
    productIdsArray = productIds.split(",");
  } else if (Array.isArray(productIds)) {
    productIdsArray = productIds;
  }

  const DeliveryMutation = useMutation({
    mutationFn: ({
      driverId,
      productInCartIds,
    }: {
      driverId: string;
      productInCartIds: string[];
    }) => AddToDelivery(driverId, productInCartIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
    },
    onError: (err) => {
      Alert.alert("Error", "Failed To add to delivery\n" + err);
    },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["drivers"],
    queryFn: GetDrivers,
  });

  const [selectedDriver, setSelectedDriver] = useState<any>(null); // State to track selected driver

  const handleSelectDriver = (driver: any) => {
    // Toggle selection
    if (selectedDriver === driver) {
      setSelectedDriver(null); // Deselect if already selected
    } else {
      setSelectedDriver(driver); // Select if not already selected
    }
  };

  const handleConfirmSelection = () => {
    if (selectedDriver) {
      DeliveryMutation.mutate({
        driverId: selectedDriver.id,
        productInCartIds: productIdsArray,
      });

      Alert.alert("Success", "Product added to delivery");

      router.replace("/products/");
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  if (error) {
    Alert.alert("Error", "Error Displaying Drivers" + error);
  }

  const drivers = data?.data;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Select A Driver" }} />

      <ScrollView>
        {drivers.map((driver: any, id: any) => (
          <TouchableOpacity
            key={id}
            style={[
              styles.driverItem,
              selectedDriver === driver && styles.selectedDriverItem,
            ]}
            onPress={() => handleSelectDriver(driver)}
          >
            <Text>{driver.fullname}</Text>
            <Text>{driver.email}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedDriver && (
        // <Button title="Confirm Selection" onPress={handleConfirmSelection} />
        <TouchableOpacity
          onPress={handleConfirmSelection}
          style={{ padding: 20, backgroundColor: "red", borderRadius: 20 }}
        >
          <Text style={{ fontWeight: "900" }}>Confirm Selection</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  driverItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
    width: "100%",
    maxWidth: 300,
    alignItems: "center",
  },
  selectedDriverItem: {
    backgroundColor: "orange",
  },
});

export default SelectDriver;
