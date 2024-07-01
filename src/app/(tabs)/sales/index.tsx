import { View, Text } from "@/src/components/Themed";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";
import { useQuery } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";

const Sales = () => {
  const router = useRouter();
  const { GetAllTotalSalesDriver, ProductSold } = useProtectedRoutesApi();

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  totalText: {
    fontSize: 20,
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
    marginTop: 20,
    backgroundColor: "lightgray",
    borderRadius: 20,
  },
  productText: {
    fontSize: 16,
    color: "black",
  },
  filterContainer: {
    height: 60,
    marginBottom: 10,
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
  },
  selectedFilter: {
    backgroundColor: "#2e86de",
  },
  selectedFilterText: {
    color: "white",
  },
});

export default Sales;
