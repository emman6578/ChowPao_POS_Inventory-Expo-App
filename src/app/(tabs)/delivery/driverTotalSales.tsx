import React from "react";
import { View, Text } from "@/src/components/Themed"; // Assuming Themed components include StyleSheet
import { Stack, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";
import { StyleSheet } from "react-native";

const DriverTotalSales = () => {
  const { id, totalLoadProducts } = useLocalSearchParams();
  const { GetDriverSales } = useProtectedRoutesApi();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["driverSales"],
    queryFn: () => GetDriverSales(id as string),
  });

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error loading data</Text>;

  const { fullname, email } = data?.data.driver || {};
  const {
    totalRetailSales,
    totalWholesaleSales,
    totalUnpaidBalance,
    totalQuantity,
  } = data?.data.totals || {};

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `${fullname} Sales` }} />
      <Text style={styles.header}>{fullname}</Text>
      <Text style={styles.email}>{email}</Text>

      <View style={styles.totalsContainer}>
        <Text style={styles.totalItem}>
          Total Retail Sales: &#8369;
          {totalRetailSales.toFixed(2)}
        </Text>
        <Text style={styles.totalItem}>
          Total Wholesale Sales: &#8369;
          {totalWholesaleSales.toFixed(2)}
        </Text>
        <Text style={styles.totalItem}>
          Total Unpaid Balance: &#8369;{totalUnpaidBalance.toFixed(2)}
        </Text>
        <Text style={styles.totalItem}>
          Total Quantity Sold: {totalQuantity}
        </Text>
        <Text style={styles.totalItem}>
          Quantity Remaining in Truck: {totalLoadProducts - totalQuantity}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
    marginBottom: 20,
  },
  totalsContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    width: "100%",
  },
  totalItem: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default DriverTotalSales;
