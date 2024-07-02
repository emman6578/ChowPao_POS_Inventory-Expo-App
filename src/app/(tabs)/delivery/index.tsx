import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Touchable,
  TouchableOpacity,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import React from "react";

const Delivery = () => {
  const { GetDeliveries } = useProtectedRoutesApi();
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["deliveries"],
    queryFn: GetDeliveries,
  });

  if (isLoading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error.message}</Text>;
  }

  const handleSelectDriver = (driverId: string, loadProducts: number) => {
    router.push({
      pathname: "delivery/driverTotalSales",
      params: {
        id: driverId,
        totalLoadProducts: loadProducts,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Delivery" }} />

      <ScrollView contentContainerStyle={styles.scrollView}>
        {data?.data?.map((delivery: any) => (
          <TouchableOpacity
            key={delivery.id}
            style={styles.deliveryCard}
            onPress={() =>
              handleSelectDriver(
                delivery.driver?.id,
                delivery.total_load_products
              )
            }
          >
            <Text style={styles.driverName}>
              Driver: {delivery.driver?.fullname}
            </Text>
            <Text style={styles.driverEmail}>
              Email: {delivery.driver?.email}
            </Text>
            <Text style={styles.status}>Status: {delivery.status}</Text>
            <Text style={styles.totalLoadProducts}>
              Total Load Products:{" "}
              {delivery.total_load_products === null
                ? 0
                : delivery.total_load_products}
            </Text>
            <Text style={styles.expectedSales}>
              Expected Sales: &#8369;
              {delivery.expected_sales === null
                ? 0
                : delivery.expected_sales.toFixed(2)}
            </Text>
            <Text style={styles.expectedSalesWholesale}>
              Expected Sales Wholesale: &#8369;
              {delivery.expected_sales_wholesale === null
                ? 0
                : delivery.expected_sales_wholesale.toFixed(2)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },

  scrollView: {
    paddingBottom: 20,
  },
  deliveryCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  driverName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 5,
  },
  driverEmail: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  status: {
    fontSize: 16,
    color: "#888",
    marginBottom: 5,
  },
  totalLoadProducts: {
    fontSize: 16,
    color: "#888",
    marginBottom: 5,
  },
  expectedSales: {
    fontSize: 16,
    color: "#888",
    marginBottom: 5,
  },
  expectedSalesWholesale: {
    fontSize: 16,
    color: "#888",
    marginBottom: 10,
  },

  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    color: "red",
    marginTop: 20,
  },
});

export default Delivery;
