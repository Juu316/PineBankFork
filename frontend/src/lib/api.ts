import { axiosInstance } from "@/lib/addedAxiosInstance";
export const fetchTransactions = async (
  accountNumber: string,
  token: string
) => {
  try {
    const response = await axiosInstance.post(
      `/transaction/get`,
      { accountNumber },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export const getUserProfile = async (token: string) => {
  try {
    const response = await axiosInstance.get(`/users`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.user.userProfile;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export const createProfile = async (
  token: string,
  userProfile: {
    image?: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    userId: string;
  }
) => {
  try {
    const response = await axiosInstance.post(`/profile`, userProfile, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const errText =
      error.response?.data || error.message || "Failed to create profile";
    throw new Error(errText);
  }
};

export const createBankAccount = async (token: string) => {
  try {
    const response = await axiosInstance.post(
      `/account`,
      { balance: 10000 },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const errText =
      error.response?.data || error.message || "Failed to create bank account";
    throw new Error(errText);
  }
};

export const deleteDesign = async (designId: string, token: string) => {
  try {
    const response = await axiosInstance.delete(`/design`, {
      data: { designId },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const errText =
      error.response?.data || error.message || "Failed to delete design";
    throw new Error(errText);
  }
};
