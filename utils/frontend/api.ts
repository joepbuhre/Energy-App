import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
} from "axios";
import router from "../../frontend/src/router";
import { useMain } from "../../frontend/src/store/main";

const baseURL = (import.meta.env.PROD ? import.meta.env.VITE_PROD_API_URL : import.meta.env.VITE_DEV_API_URL )

const api: AxiosInstance = axios.create({
    baseURL: baseURL,
});

api.interceptors.request.use((config: AxiosRequestConfig) => {
    const main = useMain();
    if (main.getToken !== false && config.headers !== undefined) {
        config.headers["Authorization"] = main.getToken;
    }
    return config;
});

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error?.response?.status === 403) {
            
            console.log(router)
            router.push({
                name: "Login",
            });
        }
    }
);

export { api };
