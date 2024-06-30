import React from "react";
import { Stack } from "expo-router";

const PrintLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="saveToExcelFile"
        options={{ title: "Save Products to Excel" }}
      />
      <Stack.Screen
        name="saveBySupplier"
        options={{ title: "Pick Supplier" }}
      />
    </Stack>
  );
};

export default PrintLayout;
