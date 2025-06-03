import axios from 'axios';
import conf from '../../../conf.js';

/**
 * The basis for this code came from https://mihai-andrei.com/blog/jwt-authentication-using-axios-interceptors/
 */

class AxiosInterceptor
{
    #axiosInstance;
    #isRefreshing = false;
    #refreshSubscribers = [];
    #ttl;

    constructor(config = {})
    {
        this.#axiosInstance = axios.create({...config});
        this.#isRefreshing = false;
        this.#refreshSubscribers = [];

        this.#axiosInstance.interceptors.request.use(
            (config)=>{
                const accessToken = this.accessToken;
                if(accessToken)
                {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
                return config;
            },
            (error)=>Promise.reject(error),
        );

        this.#axiosInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                if (
                    error.response &&
                    error.response.status === 401 &&
                    error.response.data.message === "TokenExpiredError" &&
                    !originalRequest._retry
                ) {
                    if (!this.#isRefreshing) {
                        this.#isRefreshing = true;

                        try {
                            const newTokens = await this.refreshTokens();
                            this.accessToken = newTokens.accessToken;
                            this.refreshToken = newTokens.refreshToken;

                            this.#refreshSubscribers.forEach((callback) =>
                                callback(newTokens.accessToken),
                            );
                            this.#refreshSubscribers = [];

                            return this.#axiosInstance(originalRequest);
                        } catch (refreshError) {
                            this.#refreshSubscribers = []; // Clear the queue in case of failure
                            this.clearTokens();
                            return Promise.reject(refreshError);
                        } finally {
                            this.#isRefreshing = false;
                        }
                    }

                    return new Promise((resolve) => {
                        this.#refreshSubscribers.push((newAccessToken) => {
                            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                            originalRequest._retry = true;
                            resolve(this.#axiosInstance(originalRequest));
                        });
                    });
                }

                return Promise.reject(error);
            },
        );

        // Bind instance methods for convenience
        /**
         * Makes a GET request.
         * @type {import('axios').AxiosInstance['get']}
         */
        this.get = this.#axiosInstance.get.bind(this.#axiosInstance);

        /**
         * Makes a POST request.
         * @type {import('axios').AxiosInstance['post']}
         */
        this.post = this.#axiosInstance.post.bind(this.#axiosInstance);

        /**
         * Makes a PUT request.
         * @type {import('axios').AxiosInstance['put']}
         */
        this.put = this.#axiosInstance.put.bind(this.#axiosInstance);

        /**
         * Makes a DELETE request.
         * @type {import('axios').AxiosInstance['delete']}
         */
        this.delete = this.#axiosInstance.delete.bind(this.#axiosInstance);

        /**
         * Makes a PATCH request.
         * @type {import('axios').AxiosInstance['patch']}
         */
        this.patch = this.#axiosInstance.patch.bind(this.#axiosInstance);
    }

    clearTokens()
    {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
    }

    async getUser() {
        const now = Date.now();
        const seconds = (now - this.#ttl) / 1000;

        if (seconds > 3600) {
            console.log("Trying a token refresh")
            if (!this.#isRefreshing) {
                this.#isRefreshing = true;

                return this.refreshTokens()
                    .then((newTokens) => {
                        this.accessToken = newTokens.accessToken;
                        this.refreshToken = newTokens.refreshToken;
                        this.#isRefreshing = false;
                        this.#ttl = Date.now();
                        return JSON.parse(localStorage.getItem('user'));
                    })
                    .catch((error) => {
                        this.clearTokens();
                        this.#isRefreshing = false;
                        throw error;
                    });
            }

            // If already refreshing, return a promise that resolves when it's done
            return new Promise((resolve) => {
                this.#refreshSubscribers.push(() => {
                    resolve(JSON.parse(localStorage.getItem('user')));
                });
            });
        }

        return JSON.parse(localStorage.getItem('user'));
    }

    set user(user)
    {
        localStorage.setItem('user', JSON.stringify(user));
    }

    get accessToken()
    {
        return localStorage.getItem("accessToken");
    }

    set accessToken(accessToken)
    {
        if(accessToken)
        {
            localStorage.setItem("accessToken", accessToken);
        }
        else
        {
            localStorage.removeItem("accessToken");
        }

    }

    get refreshToken()
    {
        return localStorage.getItem("refreshToken");
    }

    set refreshToken(refreshToken)
    {
        if(refreshToken)
        {
            localStorage.setItem("refreshToken", refreshToken);
        }
        else
        {
            localStorage.removeItem("refreshToken");
        }
    }

    async refreshTokens() {
        const refreshToken = this.refreshToken;
        if (!refreshToken) {
            throw new Error("No refresh token available");
        }

        const response = await this.#axiosInstance.post("/users/refreshToken", {refreshToken});
        this.#ttl = Date.now();
        return response.data; // Expecting { accessToken: string, refreshToken: string }
    }

    async login(username, password) {
        const response = await this.#axiosInstance.post(
            '/users/login',
            { username, password },
            { headers: { 'Content-Type': 'application/json' } }
        );
        const { accessToken, refreshToken, user } = response.data;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.user = user;
        return user;
    }
}

export const client = new AxiosInterceptor({
    baseURL: conf.express.url,
});