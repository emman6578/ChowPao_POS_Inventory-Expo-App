import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "@/src/components/Themed";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";
import { router } from "expo-router";

const SaveBySupplier = () => {
  const { ProductList, PrintProductsBySupplier } = useProtectedRoutesApi();

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: ProductList,
  });

  const products = data?.data;

  const suppliers = products
    ? Array.from(new Set(products.map((product: any) => product.supplier)))
    : [];

  const supplierMutation = useMutation({
    mutationFn: (supplier: string) => {
      return PrintProductsBySupplier(supplier);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });

  const handleSupplierClick = async (supplier: string) => {
    supplierMutation.mutate(supplier);
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {suppliers.length > 0 ? (
        suppliers.map((supplier: any, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => handleSupplierClick(supplier)}
          >
            <Text style={styles.supplier}>{supplier}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noSuppliers}>No suppliers available</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  supplier: {
    fontSize: 15,
    alignSelf: "center",
    color: "black",
    fontWeight: "900",
  },
  noSuppliers: {
    fontSize: 18,
  },
  button: {
    padding: 20,
    backgroundColor: "lightyellow",
    marginVertical: 10,
    width: "75%",
    borderRadius: 10,
  },
});

export default SaveBySupplier;
