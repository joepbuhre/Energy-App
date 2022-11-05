import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
} from "axios";
import router from "../../frontend/src/router";
import { useMain } from "../../frontend/src/store/main";

const api: AxiosInstance = axios.create({
    baseURL: '/api',
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
