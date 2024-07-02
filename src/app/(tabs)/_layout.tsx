import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

import Colors from "@/src/constants/Colors";
import { useColorScheme } from "@/src/components/useColorScheme";
import { useClientOnlyValue } from "@/src/components/useClientOnlyValue";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,

        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />

      <Tabs.Screen
        name="products"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          title: "Orders",
          tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
        }}
      />

      <Tabs.Screen
        name="delivery"
        options={{
          headerShown: false,
          title: "Delivery",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="truck-fast" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="sales"
        options={{
          headerShown: false,
          title: "Sales",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="peso-sign" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="sale_summary"
        options={{
          headerShown: false,
          title: "Sales Report",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="files-o" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
