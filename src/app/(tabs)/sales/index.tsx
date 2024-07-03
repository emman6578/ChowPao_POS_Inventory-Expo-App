import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";
import { View, Text } from "@/src/components/Themed";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "expo-router";
import React, { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

type Product = {
  name: string;
};

type Customer = {
  name: string;
  address: string;
};

type Sale = {
  id: string;
  Product: Product;
  quantity: number;
  sales: number;
  saleType: string;
  status: string;
  paymentOptions: string;
  paymentStatus: string;
  balance: number;
  Customer: Customer;
};

type Pagination = {
  page: number;
  totalPages: number;
  total: number;
};

type SalesResponse = {
  data: Sale[];
  pagination: Pagination;
};

const Sales = () => {
  const { GetAllSales } = useProtectedRoutesApi();

  const [page, setPage] = useState(1);
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    sortField: "balance", // Default sort field
    sortOrder: "desc", // Default sort order
    paymentOptions: "", // Initially empty, will hold selected options
    paymentStatus: "",
  });

  const paymentOptions = ["CASH", "GCASH", "PAY_LATER"];
  const paymentStatus = ["PAID", "UNPAID", "PROCESSING"];
  const scrollViewRef = useRef<ScrollView>(null);

  const { data, isLoading, error, isFetching, refetch } =
    useQuery<SalesResponse>({
      queryKey: ["sales", params],
      queryFn: () => GetAllSales(params),
    });

  useEffect(() => {
    if (data) {
      // Combine both paymentOptions and paymentStatus filtering
      const filteredData = data.data.filter(
        (sale) =>
          (params.paymentOptions === "" ||
            sale.paymentOptions === params.paymentOptions) &&
          (params.paymentStatus === "" ||
            sale.paymentStatus === params.paymentStatus)
      );
      setSalesData(filteredData);
    }
  }, [data, params.paymentOptions, params.paymentStatus]);

  useEffect(() => {
    setParams((prevParams) => ({ ...prevParams, page }));
  }, [page]);

  useEffect(() => {
    refetch();
  }, [params, refetch]);

  useEffect(() => {
    if (scrollViewRef.current) {
      const selectedPageIndex = page - 1;
      const offset = selectedPageIndex * 60; // Adjust the offset based on your button width and margin
      scrollViewRef.current.scrollTo({ x: offset, animated: true });
    }
  }, [page]);

  const loadMore = () => {
    if (data?.pagination.page! < data?.pagination.totalPages!) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePaymentOptionClick = (option: string) => {
    const newPaymentOptions = params.paymentOptions === option ? "" : option;

    // Reset page to 1 and set limit to original value
    setParams((prevParams) => ({
      ...prevParams,
      paymentOptions: newPaymentOptions,
    }));
  };

  const handlePaymentStatusClick = (option: string) => {
    const newPaymentStatus = params.paymentStatus === option ? "" : option;

    // Reset page to 1 and set limit to original value
    setParams((prevParams) => ({
      ...prevParams,
      paymentStatus: newPaymentStatus,
    }));
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error loading sales data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "All Sales",
          headerRight: () => (
            <Text style={{ fontWeight: "900" }}>
              Total Sales: {data?.pagination.total}
            </Text>
          ),
        }}
      />

      <View>
        <ScrollView contentContainerStyle={styles.scrollContainer} horizontal>
          {paymentOptions.map((option, index) => (
            <TouchableOpacity
              key={`${option}-${index}`} // Ensure keys are unique by combining option and index
              style={[
                styles.optionButton,
                params.paymentOptions === option && styles.selectedOption,
              ]}
              onPress={() => handlePaymentOptionClick(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}

          {paymentStatus.map((option, index) => (
            <TouchableOpacity
              key={`${option}-${index}`} // Ensure keys are unique by combining option and index
              style={[
                styles.optionButton,
                params.paymentStatus === option && styles.selectedOption,
              ]}
              onPress={() => handlePaymentStatusClick(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={salesData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.productName}>Product: {item.Product.name}</Text>
            <Text style={styles.text}>Quantity: {item.quantity}</Text>
            <Text style={styles.text}>
              Amount: &#8369;{item.sales.toFixed(2)}
            </Text>
            <Text style={styles.text}>Sale Type: {item.saleType}</Text>
            <Text style={styles.text}>
              Balance: &#8369;{item.balance.toFixed(2)}
            </Text>

            <Text style={styles.text}>
              Payment Options: {item.paymentOptions}
            </Text>
            <Text style={styles.text}>
              Payment Status: {item.paymentStatus}
            </Text>

            <Text style={styles.text}>
              Customer: {item.Customer.name}, {item.Customer.address}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
      {isFetching && (
        <ActivityIndicator size="large" style={styles.loadingIndicator} />
      )}
      <View style={{ alignItems: "center" }}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          contentContainerStyle={styles.paginationContainer}
          showsHorizontalScrollIndicator={false}
        >
          {[...Array(data?.pagination.totalPages).keys()].map((pageNumber) => (
            <TouchableOpacity
              key={pageNumber}
              style={[
                styles.pageButton,
                page === pageNumber + 1 && styles.currentPageButton,
              ]}
              onPress={() => setPage(pageNumber + 1)}
            >
              <Text style={styles.pageButtonText}>{pageNumber + 1}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  listContent: {
    padding: 16,
  },
  card: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
  },
  loadingIndicator: {
    marginVertical: 16,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
  },
  pageButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f0f0f0",
  },
  currentPageButton: {
    backgroundColor: "#4CAF50", // Example of selected page background color
    borderColor: "#4CAF50", // Example of selected page border color
  },
  pageButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  scrollContainer: {
    margin: 10,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f0f0f0",
  },
  selectedOption: {
    backgroundColor: "#4CAF50", // Example of selected option background color
    borderColor: "#4CAF50", // Example of selected option border color
  },
  optionText: {
    fontSize: 16,
    color: "black",
    fontWeight: "900",
  },
});

export default Sales;
