import React, { useState } from "react";
import { View, Text } from "@/src/components/Themed";
import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";
import { useQuery } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const SalesReport = () => {
  const [refresh, setRefresh] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const { SalesReport } = useProtectedRoutesApi();

  // Fetch sales report data
  const {
    data: salesData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["salesReport"],
    queryFn: SalesReport,
  });

  const onRefresh = () => {
    setRefresh(false);
    refetch();
    setRefresh(false);
  };

  const filteredData =
    salesData?.data?.filter((item: any) => {
      const itemDate = new Date(item.date).toDateString();
      return itemDate === selectedDate.toDateString();
    }) || [];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Sales Summary" }} />
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <Text style={styles.datePickerText}>
          Select Date:{" "}
          {
            <Text
              style={{
                color: "coral",
                fontWeight: "900",
              }}
            >
              {selectedDate.toDateString()}
            </Text>
          }
        </Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowPicker(false);
            if (date) {
              setSelectedDate(date);
            }
          }}
        />
      )}
      {isLoading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          style={styles.list}
          data={filteredData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => {
                router.push({
                  pathname: "sale_summary/productSold",
                  params: { id: item.id },
                });
              }}
            >
              <Text style={styles.date}>
                {new Date(item.date).toLocaleString()}
              </Text>
              <Text>Driver Name: {item.driver?.fullname}</Text>
              <Text>Email: {item.driver?.email}</Text>
              <Text>Total in Retail: &#8369;{item.total_in_retail}</Text>
              <Text>Total in Wholesale: &#8369;{item.total_in_wholesale}</Text>
              <Text>Balance: &#8369;{item.balance}</Text>
              <Text>Quantity Sold: {item.quantity} </Text>
              <Text>Remaining Products: {item.remainingProducts} </Text>
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  datePickerText: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
    backgroundColor: "teal",
    borderRadius: 20,
    padding: 10,
  },
  loadingText: {
    fontSize: 18,
    alignSelf: "center",
    marginTop: 20,
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  date: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
  },
});

export default SalesReport;
