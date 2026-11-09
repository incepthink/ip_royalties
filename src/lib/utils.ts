import axios from "axios";
import Cookies from "js-cookie";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// VITE_HASHCASE_API_URL takes priority: VITE_API_URL on Vercel still points at
// the expired api.hashcase.co and can't be edited without email verification.
export const API_URL: string =
  import.meta.env.VITE_HASHCASE_API_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000";

// IP royalty products are minted as ERC-1155 tokens on Base Sepolia
export const txExplorerUrl = (hash: string) => `https://sepolia.basescan.org/tx/${hash}`;

export const formatDate = (value?: string | null) => {
  if (!value) return "";
  const d = new Date(value);
  return isNaN(d.getTime())
    ? String(value)
    : d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

export const axiosOwner = axios.create({
  baseURL: API_URL,
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
  baseURL: API_URL,
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
