import { axiosInstance } from "@/lib/addedAxiosInstance";

export const updateUserProfile = async (
  profileId: string,
  token: string,
  profileData: { phone: string; address: string }
): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await axiosInstance.put(
      `/profile/${profileId}`,
      profileData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status >= 200 && response.status < 300) {
      return { success: true };
    } else {
      return {
        success: false,
        message:
          response.data?.message || "An error occurred while updating profile.",
      };
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return {
      success: false,
      message:
        err.response?.data?.message ||
        (err instanceof Error ? err.message : "An unexpected error occurred."),
    };
  }
};
