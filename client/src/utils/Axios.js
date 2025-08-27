import axios from "axios";
import SummaryApi, { baseURL } from "../common/SummaryApi";

// Create a special instance of Axios with some default settings.
const Axios = axios.create({
    baseURL: baseURL, // All requests will automatically use the server address from SummaryApi.js
    withCredentials: true // This allows the browser to send cookies with requests, which is important for authentication.
});

// --- INTERCEPTOR 1: Adding the Access Token to Outgoing Requests ---
// This function runs BEFORE every single request is sent.
Axios.interceptors.request.use(
    async (config) => {
        // Get the access token from the browser's local storage.
        const accessToken = localStorage.getItem('accesstoken');

        // If a token exists...
        if (accessToken) {
            // ...add it to the 'Authorization' header of the request.
            // The 'Bearer' part is a standard way to format this.
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Return the modified request configuration so it can be sent.
        return config;
    },
    (error) => {
        // If there's an error setting up the request, reject the promise.
        return Promise.reject(error);
    }
);

// --- INTERCEPTOR 2: Handling Expired Access Tokens ---
// This is an interceptor for the RESPONSE
Axios.interceptors.response.use( 
    (response) => {
        // If the response is successful (e.g., status 200), just return it.
        return response;
    },
    async (error) => {
        // Get the original request that caused the error.
        const originRequest = error.config;

        // Check if the error was '401 Unauthorized' and that we haven't already tried to retry this request.
        // The '!originRequest.retry' check is crucial to prevent an infinite loop if the refresh token also fails.
        if (error.response.status === 401 && !originRequest.retry) {
            // Mark this request as 'retried' so we don't try again.
            originRequest.retry = true;

            // Try to get a new access token.
            const newAccessToken = await refreshAccessToken(); // Simplified this part

            // If we successfully got a new access token...
            if (newAccessToken) {
                // ...update the header in our original failed request.
                originRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                // ...and send the original request again with the new token.
                return Axios(originRequest);
            }
        }

        // If the error was not 401, or if refreshing the token failed, return the original error.
        return Promise.reject(error);
    }
);

// This helper function specifically asks the server for a new access token.
const refreshAccessToken = async () => {
    try {
        // Get the refresh token from storage.
        const refreshToken = localStorage.getItem("refreshToken");

        // Make a request to the 'refreshToken' endpoint.
        const response = await Axios({
            ...SummaryApi.refreshToken,
            headers: {
                Authorization: `Bearer ${refreshToken}` // Use the refresh token for authorization here
            }
        });

        // Extract the new access token from the server's response.
        const { accessToken } = response.data.data;
        // Save the new token in local storage, replacing the old one.
        localStorage.setItem('accesstoken', accessToken);
        // Return the new token so the interceptor can use it.
        return accessToken;
    } catch (error) {
        console.log("Failed to refresh token", error);
        // If refreshing fails (e.g., refresh token is also invalid), the user will need to log in again.
        // You might want to clear local storage and redirect to the login page here.
    }
};


export default Axios;


// Request Interceptor: Before any message is sent to the server, this rule checks if you have an accesstoken saved. If you do, it attaches it to the message header. This is like showing your ID card every time you enter a building.

// Response Interceptor: After a message comes back from the server, this rule checks for a specific error: a 401 Unauthorized error. This error means your accesstoken (your ID card) has expired. Instead of failing, it automatically uses a refreshToken (a special long-term pass) to get a new accesstoken from the server. Once it gets the new token, it automatically resends the original request that failed. The user never even knows this happened!