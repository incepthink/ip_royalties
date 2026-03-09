import axios from "axios";
import Cookies from "js-cookie";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const axiosOwner = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

axiosOwner.interceptors.request.use(
  (config) => {
    const token = Cookies.get("ipchain_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const axiosManufacturer = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

axiosManufacturer.interceptors.request.use(
  (config) => {
    const userStr = Cookies.get("ipchain_user");
    if (userStr) {
      const user = JSON.parse(userStr);
      config.params = { ...config.params, user_id: user.id };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

type UploadImageResponse = {
  success: boolean;
  imageUrl: string;
};

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const { data } = await axiosOwner.post<UploadImageResponse>(
      "/user/upload/image",
      formData,
    );

    if (!data.success || !data.imageUrl) {
      throw new Error("Image upload returned an unexpected response");
    }

    return data.imageUrl;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Image upload failed";
    throw new Error(message);
  }
}
