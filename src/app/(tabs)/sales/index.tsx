import { View, Text } from "@/src/components/Themed";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import moment from "moment";

const Sales = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { GetAllTotalSalesDriver, ProductSold, ConfirmSales } =
    useProtectedRoutesApi();

  const [selectedSaleType, setSelectedSaleType] = useState("");
  const [selectedPaymentOption, setSelectedPaymentOption] = useState("");

  const driverTotalSales = useQuery({
    queryKey: ["totalSales"],
    queryFn: GetAllTotalSalesDriver,
  });

  const total = driverTotalSales.data?.data?.totals;

  const ProductSoldByDriver = useQuery({
    queryKey: ["productSold"],
    queryFn: ProductSold,
  });

  const productSold = ProductSoldByDriver.data?.data;

  const Confirm = useMutation({
    mutationFn: ConfirmSales,
    onSuccess: () => {
      Alert.alert("Success", "Successfully Confirmed Sales for Today!");
      queryClient.invalidateQueries({ queryKey: ["totalSales"] });
      queryClient.invalidateQueries({ queryKey: ["productSold"] });
    },
    onError: (err) => {
      Alert.alert("Error", `Failed to confirm` + err);
    },
  });

  const handleConfirm = () => {
    Confirm.mutate();
  };

  const filteredProducts = productSold?.filter((item: any) => {
    const saleTypeMatch = selectedSaleType
      ? item.saleType === selectedSaleType
      : true;
    const paymentOptionMatch = selectedPaymentOption
      ? item.paymentOptions === selectedPaymentOption
      : true;
    return saleTypeMatch && paymentOptionMatch;
  });

  const renderProductItem = ({ item }: any) => (
    <View style={styles.productItem}>
      <Text style={styles.productText}>Customer: {item.Customer?.name}</Text>
      <Text style={styles.productText}>Sales: &#8369;{item.sales}</Text>
      <Text style={styles.productText}>Quantity: {item.quantity}</Text>
      <Text style={styles.productText}>Product: {item.Product?.name}</Text>
      <Text style={styles.productText}>Sale Type: {item.saleType}</Text>
      <Text style={styles.productText}>
        Payment Options: {item.paymentOptions}
      </Text>
      <Text style={styles.productText}>
        Payment Status: {item.paymentStatus}
      </Text>
      <Text style={styles.productText}>Balance: {item.balance}</Text>
    </View>
  );

  const [isButtonActive, setIsButtonActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(moment().format("LTS"));

  useEffect(() => {
    const checkTime = () => {
      const now = moment();
      const targetTime = moment().set({
        hour: 17,
        minute: 0,
      });

      setCurrentTime(now.format("LTS")); // Update current time

      if (now.isSameOrAfter(targetTime)) {
        setIsButtonActive(true);
      } else {
        setIsButtonActive(false);
      }
    };

    // Check the time every second
    const interval = setInterval(checkTime, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Total Sales" }} />
      {total && (
        <>
          <Text style={styles.totalText}>
            Total Retail Sales:{" "}
            <Text style={styles.totalValue}>
              &#8369; {total.totalRetailSales.toFixed(2)}
            </Text>
          </Text>
          <Text style={styles.totalText}>
            Total Wholesale Sales:{" "}
            <Text style={styles.totalValue}>
              &#8369; {total.totalWholesaleSales.toFixed(2)}
            </Text>
          </Text>
          <Text style={styles.totalText}>
            Total Unpaid Balance:{" "}
            <Text style={styles.totalValue}>
              &#8369; {total.totalUnpaidBalance.toFixed(2)}
            </Text>
          </Text>
          <Text style={styles.totalText}>
            Total Quantity Sold:{" "}
            <Text style={styles.totalValue}>{total.totalQuantity}</Text>
          </Text>
        </>
      )}

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedSaleType === "RETAIL" && styles.selectedFilter,
            ]}
            onPress={() =>
              setSelectedSaleType((prev) => (prev === "RETAIL" ? "" : "RETAIL"))
            }
          >
            <Text
              style={[
                styles.filterText,
                selectedSaleType === "RETAIL" && styles.selectedFilterText,
              ]}
            >
              Retail
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedSaleType === "WHOLESALE" && styles.selectedFilter,
            ]}
            onPress={() =>
              setSelectedSaleType((prev) =>
                prev === "WHOLESALE" ? "" : "WHOLESALE"
              )
            }
          >
            <Text
              style={[
                styles.filterText,
                selectedSaleType === "WHOLESALE" && styles.selectedFilterText,
              ]}
            >
              Wholesale
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedPaymentOption === "CASH" && styles.selectedFilter,
            ]}
            onPress={() =>
              setSelectedPaymentOption((prev) =>
                prev === "CASH" ? "" : "CASH"
              )
            }
          >
            <Text
              style={[
                styles.filterText,
                selectedPaymentOption === "CASH" && styles.selectedFilterText,
              ]}
            >
              Cash
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedPaymentOption === "GCASH" && styles.selectedFilter,
            ]}
            onPress={() =>
              setSelectedPaymentOption((prev) =>
                prev === "GCASH" ? "" : "GCASH"
              )
            }
          >
            <Text
              style={[
                styles.filterText,
                selectedPaymentOption === "GCASH" && styles.selectedFilterText,
              ]}
            >
              GCash
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedPaymentOption === "PAY_LATER" && styles.selectedFilter,
            ]}
            onPress={() =>
              setSelectedPaymentOption((prev) =>
                prev === "PAY_LATER" ? "" : "PAY_LATER"
              )
            }
          >
            <Text
              style={[
                styles.filterText,
                selectedPaymentOption === "PAY_LATER" &&
                  styles.selectedFilterText,
              ]}
            >
              Pay Later
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {filteredProducts && (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
        />
      )}

      <TouchableOpacity
        style={{
          alignItems: "center",
          padding: 5,
          backgroundColor: !isButtonActive ? "gray" : "teal",
          borderRadius: 20,
          marginTop: 5,
        }}
        onPress={handleConfirm}
        disabled={!isButtonActive}
      >
        <Text style={{ color: "white", fontWeight: "900" }}>
          CONFIRM ALL SALES
        </Text>
      </TouchableOpacity>
      {!isButtonActive && (
        <Text style={{ fontSize: 8, alignSelf: "center", color: "red" }}>
          The button will activate only at 5 PM. {<Text>{currentTime}</Text>}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  totalText: {
    fontSize: 15,
    marginVertical: 5,
    textAlign: "center",
  },
  totalValue: {
    fontWeight: "bold",
    color: "#2e86de",
  },
  productItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginTop: 5,
    backgroundColor: "lightgray",
    borderRadius: 20,
  },
  productText: {
    fontSize: 13,
    color: "black",
  },
  filterContainer: {
    height: 70,
  },
  scrollViewContent: {
    paddingVertical: 10,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    marginRight: 10,
  },
  filterText: {
    fontSize: 16,
    color: "black",
    fontWeight: "500",
  },
  selectedFilter: {
    backgroundColor: "#2e86de",
  },
  selectedFilterText: {
    color: "white",
  },
});

export default Sales;
