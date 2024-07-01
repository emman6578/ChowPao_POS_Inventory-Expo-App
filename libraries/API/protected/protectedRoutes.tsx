import { createContext, PropsWithChildren, useContext } from "react";
import { API_URL } from "../config/config";
import { useAuth } from "@/src/Context/AuthContext";

interface ProtectedRoutesType {
  GetDriverLoggedIn: () => Promise<any>;
  GetDeliveryLoad: () => Promise<any>;
  GetDeliveryProducts: () => Promise<any>;
  GetCustomers: () => Promise<any>;
  AddToSales: (data: any) => Promise<any>;
  GetAllTotalSalesDriver: () => Promise<any>;
  ProductSold: () => Promise<any>;
}

const ProtectedRoutesContext = createContext<ProtectedRoutesType | undefined>(
  undefined
);

export const ProtectedRoutesContextProvider = ({
  children,
}: PropsWithChildren) => {
  //the authtoken is getting from auth context provider
  const { authToken } = useAuth();

  const GetDriverLoggedIn = async () => {
    const res = await fetch(`${API_URL}/driver/delivery`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      // Check if response is not OK (status code not in range 200-299)
      let errorMessage = "Failed to get logged in driver";
      const responseBody = await res.json(); // Attempt to parse response body as JSON

      // Check if response body has an error message from the backend
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }

      throw new Error(errorMessage);
    }

    return await res.json();
  };

  const GetDeliveryLoad = async () => {
    const res = await fetch(`${API_URL}/driver/delivery/load`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      // Check if response is not OK (status code not in range 200-299)
      let errorMessage = "Failed to get all the delivery load";
      const responseBody = await res.json(); // Attempt to parse response body as JSON

      // Check if response body has an error message from the backend
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }

      throw new Error(errorMessage);
    }

    return await res.json();
  };

  const GetDeliveryProducts = async () => {
    const res = await fetch(`${API_URL}/driver/delivery/products/forsale`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      // Check if response is not OK (status code not in range 200-299)
      let errorMessage = "Failed to get delivery products";
      const responseBody = await res.json(); // Attempt to parse response body as JSON

      // Check if response body has an error message from the backend
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }

      throw new Error(errorMessage);
    }

    return await res.json();
  };

  const GetCustomers = async () => {
    const res = await fetch(`${API_URL}/driver/customer`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      // Check if response is not OK (status code not in range 200-299)
      let errorMessage = "Failed to get delivery products";
      const responseBody = await res.json(); // Attempt to parse response body as JSON

      // Check if response body has an error message from the backend
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }

      throw new Error(errorMessage);
    }

    return await res.json();
  };

  const AddToSales = async (data: any) => {
    const res = await fetch(`${API_URL}/driver/delivery/products/addtosale`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      // Check if response is not OK (status code not in range 200-299)
      let errorMessage = "Failed to get delivery products";
      const responseBody = await res.json(); // Attempt to parse response body as JSON

      // Check if response body has an error message from the backend
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }

      throw new Error(errorMessage);
    }

    return await res.json();
  };

  const GetAllTotalSalesDriver = async () => {
    const res = await fetch(`${API_URL}/driver/sales/total`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      // Check if response is not OK (status code not in range 200-299)
      let errorMessage = "Failed to get all total delivery sales by driver";
      const responseBody = await res.json(); // Attempt to parse response body as JSON

      // Check if response body has an error message from the backend
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }

      throw new Error(errorMessage);
    }

    return await res.json();
  };

  const ProductSold = async () => {
    const res = await fetch(`${API_URL}/driver/sales/driverSales`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      // Check if response is not OK (status code not in range 200-299)
      let errorMessage = "Failed to get all total delivery sales by driver";
      const responseBody = await res.json(); // Attempt to parse response body as JSON

      // Check if response body has an error message from the backend
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }

      throw new Error(errorMessage);
    }

    return await res.json();
  };

  return (
    <ProtectedRoutesContext.Provider
      value={{
        GetDriverLoggedIn,
        GetDeliveryLoad,
        GetDeliveryProducts,
        GetCustomers,
        AddToSales,
        GetAllTotalSalesDriver,
        ProductSold,
      }}
    >
      {children}
    </ProtectedRoutesContext.Provider>
  );
};

export const useProtectedRoutesApi = (): ProtectedRoutesType => {
  const context = useContext(ProtectedRoutesContext);
  if (context === undefined) {
    throw new Error(
      "useProductsApi must be used within a ProductApiContextProvider"
    );
  }
  return context;
};
