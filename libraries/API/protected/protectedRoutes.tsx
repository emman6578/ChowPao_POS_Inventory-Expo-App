import { createContext, PropsWithChildren, useContext } from "react";
import { API_URL } from "../config/config";
import { useAuth } from "@/src/Context/AuthContext";

interface ProtectedRoutesType {
  ProductList: () => Promise<any>;
  OneProduct: (id: string) => Promise<any>;
  AddToCart: (product_id: string, quantity: number) => Promise<any>;
  UpdateCartQuantity: (quantity: number, id: string) => Promise<any>;
  UpdateCart: () => Promise<any>;
  GetCart: () => Promise<any>;
  DeleteOnCart: (productInCartIds: string[]) => Promise<any>;
  CreateOrder: (productInCartIds: string[]) => Promise<any>;
  GetOrders: () => Promise<any>;
  CreateProductFromExcel: (file: string) => Promise<any>;
  UpdateProductFromExcel: (file: string) => Promise<any>;
  GetFilesFromServer: () => Promise<any>;
  PrintAllProducts: () => Promise<any>;
  PrintProductsBySupplier: (supplier: string) => Promise<any>;
  GetDrivers: () => Promise<any>;
  AddToDelivery: (driverId: string, productInCartIds: string[]) => Promise<any>;
  GetDeliveries: () => Promise<any>;
  GetAllSales: (params: {
    page?: number;
    limit?: number;
    sortField?: string;
    sortOrder?: string;
    paymentOptions?: string;
    paymentStatus?: string;
    minBalance?: number;
  }) => Promise<any>;
  GetDriverSales: (id: string) => Promise<any>;
  SalesReport: () => Promise<any>;
}

const ProtectedRoutesContext = createContext<ProtectedRoutesType | undefined>(
  undefined
);

export const ProtectedRoutesContextProvider = ({
  children,
}: PropsWithChildren) => {
  //the authtoken is getting from auth context provider
  const { authToken } = useAuth();

  const ProductList = async () => {
    const res = await fetch(`${API_URL}/product`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      // Check if response is not OK (status code not in range 200-299)
      let errorMessage = "Failed to list all the products";
      const responseBody = await res.json(); // Attempt to parse response body as JSON

      // Check if response body has an error message from the backend
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }

      throw new Error(errorMessage);
    }

    return await res.json();
  };

  const OneProduct = async (id: string) => {
    const res = await fetch(`${API_URL}/product/${id}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      // Check if response is not OK (status code not in range 200-299)
      let errorMessage = "Failed to get one product";
      const responseBody = await res.json(); // Attempt to parse response body as JSON

      // Check if response body has an error message from the backend
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }

      throw new Error(errorMessage);
    }

    return await res.json();
  };

  const AddToCart = async (product_id: string, quantity: number) => {
    const data = {
      products: [
        {
          product_id,
          quantity,
        },
      ],
    };

    try {
      const res = await fetch(`${API_URL}/cart`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        // Check if response is not OK (status code not in range 200-299)
        let errorMessage = "Failed to add to cart";
        const responseBody = await res.json(); // Attempt to parse response body as JSON

        // Check if response body has an error message from the backend
        if (responseBody && responseBody.message) {
          errorMessage = responseBody.message;
        }

        throw new Error(errorMessage);
      }

      return await res.json();
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  const UpdateCartQuantity = async (quantity: number, id: string) => {
    const data = {
      quantity,
    };

    try {
      const res = await fetch(`${API_URL}/cart/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        // Check if response is not OK (status code not in range 200-299)
        let errorMessage = "Failed to update cart product quantity";
        const responseBody = await res.json(); // Attempt to parse response body as JSON

        // Check if response body has an error message from the backend
        if (responseBody && responseBody.message) {
          errorMessage = responseBody.message;
        }

        throw new Error(errorMessage);
      }

      return await res.json();
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  const UpdateCart = async () => {
    try {
      const res = await fetch(`${API_URL}/cart`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        // Check if response is not OK (status code not in range 200-299)
        let errorMessage = "Failed to update";
        const responseBody = await res.json(); // Attempt to parse response body as JSON

        // Check if response body has an error message from the backend
        if (responseBody && responseBody.message) {
          errorMessage = responseBody.message;
        }

        throw new Error(errorMessage);
      }

      return await res.json();
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  const GetCart = async () => {
    const res = await fetch(`${API_URL}/cart`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      // Check if response is not OK (status code not in range 200-299)
      let errorMessage = "Failed to get cart";
      const responseBody = await res.json(); // Attempt to parse response body as JSON

      // Check if response body has an error message from the backend
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }

      throw new Error(errorMessage);
    }

    const data = await res.json();

    // Sort the ProductInCart array by updatedAt
    if (data.data && data.data.ProductInCart) {
      data.data.ProductInCart.sort(
        (a: { updatedAt: string }, b: { updatedAt: string }) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }

    return data;
  };

  const DeleteOnCart = async (productInCartIds: string[]) => {
    const data = {
      productInCartIds: productInCartIds,
    };

    const res = await fetch(`${API_URL}/cart`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      // Check if response is not OK (status code not in range 200-299)
      let errorMessage = "Failed to delete products in cart";
      const responseBody = await res.json(); // Attempt to parse response body as JSON

      // Check if response body has an error message from the backend
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }

      throw new Error(errorMessage);
    }

    return await res.json();
  };

  const CreateOrder = async (productInCartIds: string[]) => {
    const data = {
      productInCartIds: productInCartIds,
      address: "123 Main St, Anytown, USA",
    };

    const res = await fetch(`${API_URL}/order`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      // Check if response is not OK (status code not in range 200-299)
      let errorMessage = "Failed to create order";
      const responseBody = await res.json(); // Attempt to parse response body as JSON

      // Check if response body has an error message from the backend
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }

      throw new Error(errorMessage);
    }

    return await res.json();
  };

  const GetOrders = async () => {
    const res = await fetch(`${API_URL}/order`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      // Check if response is not OK (status code not in range 200-299)
      let errorMessage = "Failed to get orders";
      const responseBody = await res.json(); // Attempt to parse response body as JSON

      // Check if response body has an error message from the backend
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }

      throw new Error(errorMessage);
    }

    return await res.json();
  };

  const CreateProductFromExcel = async (formdData: any): Promise<any> => {
    try {
      const formData = new FormData();
      formData.append("file", formdData);

      const res = await fetch(`${API_URL}/print/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!res.ok) {
        // Check if response is not OK (status code not in range 200-299)
        let errorMessage = "Failed to create product";
        const responseBody = await res.json(); // Attempt to parse response body as JSON

        // Check if response body has an error message from the backend
        if (responseBody && responseBody.message) {
          errorMessage = responseBody.message;
        }

        throw new Error(errorMessage);
      }

      return await res.json();
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const UpdateProductFromExcel = async (formdData: any): Promise<any> => {
    try {
      const formData = new FormData();
      formData.append("file", formdData);

      const res = await fetch(`${API_URL}/print`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!res.ok) {
        // Check if response is not OK (status code not in range 200-299)
        let errorMessage = "Failed to update product";
        const responseBody = await res.json(); // Attempt to parse response body as JSON

        // Check if response body has an error message from the backend
        if (responseBody && responseBody.message) {
          errorMessage = responseBody.message;
        }

        throw new Error(errorMessage);
      }

      return await res.json();
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const GetFilesFromServer = async () => {
    const res = await fetch(`${API_URL}/print/files`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      // Check if response is not OK (status code not in range 200-299)
      let errorMessage = "Failed to get files from server";
      const responseBody = await res.json(); // Attempt to parse response body as JSON

      // Check if response body has an error message from the backend
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }

      throw new Error(errorMessage);
    }

    return await res.json();
  };

  const PrintAllProducts = async () => {
    const res = await fetch(`${API_URL}/print`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      // Check if response is not OK (status code not in range 200-299)
      let errorMessage = "Failed to print all products";
      const responseBody = await res.json(); // Attempt to parse response body as JSON

      // Check if response body has an error message from the backend
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }

      throw new Error(errorMessage);
    }

    return await res.json();
  };

  const PrintProductsBySupplier = async (supplier: string) => {
    const res = await fetch(`${API_URL}/print/supplier?supplier=${supplier}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      // Check if response is not OK (status code not in range 200-299)
      let errorMessage = "Failed to print products by supplier";
      const responseBody = await res.json(); // Attempt to parse response body as JSON

      // Check if response body has an error message from the backend
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }

      throw new Error(errorMessage);
    }

    return await res.json();
  };

  const GetDrivers = async () => {
    const res = await fetch(`${API_URL}/delivery/drivers`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      // Check if response is not OK (status code not in range 200-299)
      let errorMessage = "Failed to get all drivers";
      const responseBody = await res.json(); // Attempt to parse response body as JSON

      // Check if response body has an error message from the backend
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }

      throw new Error(errorMessage);
    }

    return await res.json();
  };

  const AddToDelivery = async (
    driverId: string,
    productInCartIds: string[]
  ) => {
    const data = {
      driverId,
      productInCartIds,
    };

    const res = await fetch(`${API_URL}/delivery`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log(data);

    if (!res.ok) {
      // Check if response is not OK (status code not in range 200-299)
      let errorMessage = "Failed to add to delivery";
      const responseBody = await res.json(); // Attempt to parse response body as JSON

      // Check if response body has an error message from the backend
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }

      throw new Error(errorMessage);
    }

    return await res.json();
  };

  const GetDeliveries = async () => {
    const res = await fetch(`${API_URL}/delivery`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      // Check if response is not OK (status code not in range 200-299)
      let errorMessage = "Failed to add to delivery";
      const responseBody = await res.json(); // Attempt to parse response body as JSON

      // Check if response body has an error message from the backend
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }

      throw new Error(errorMessage);
    }

    return await res.json();
  };

  const GetAllSales = async (params: {
    page?: number;
    limit?: number;
    sortField?: string;
    sortOrder?: string;
    paymentOptions?: string;
    paymentStatus?: string;
    minBalance?: number;
  }) => {
    const queryParams = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_URL}/delivery/sales?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      // Check if response is not OK (status code not in range 200-299)
      let errorMessage = "Failed to get sales";
      const responseBody = await res.json(); // Attempt to parse response body as JSON

      // Check if response body has an error message from the backend
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }

      throw new Error(errorMessage);
    }

    return res.json();
  };

  const GetDriverSales = async (id: string) => {
    const res = await fetch(`${API_URL}/delivery/${id}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      // Check if response is not OK (status code not in range 200-299)
      let errorMessage = "Failed to get driver total sales";
      const responseBody = await res.json(); // Attempt to parse response body as JSON

      // Check if response body has an error message from the backend
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }

      throw new Error(errorMessage);
    }

    return res.json();
  };

  const SalesReport = async () => {
    const res = await fetch(`${API_URL}/report`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      // Check if response is not OK (status code not in range 200-299)
      let errorMessage = "Failed to get driver total sales";
      const responseBody = await res.json(); // Attempt to parse response body as JSON

      // Check if response body has an error message from the backend
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }

      throw new Error(errorMessage);
    }

    return res.json();
  };

  return (
    <ProtectedRoutesContext.Provider
      value={{
        ProductList,
        OneProduct,
        AddToCart,
        UpdateCartQuantity,
        UpdateCart,
        GetCart,
        DeleteOnCart,
        CreateOrder,
        GetOrders,
        CreateProductFromExcel,
        UpdateProductFromExcel,
        GetFilesFromServer,
        PrintAllProducts,
        PrintProductsBySupplier,
        GetDrivers,
        AddToDelivery,
        GetDeliveries,
        GetAllSales,
        GetDriverSales,
        SalesReport,
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
