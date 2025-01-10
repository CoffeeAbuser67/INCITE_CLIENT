import { AxiosError } from "axios";
import { toast } from "react-toastify";

// {●} handleAxiosError
const handleAxiosError = (error: unknown) => {
  if (error instanceof AxiosError) {
    if (error.response) {
      // Server responded with a status code other than 2x

      console.error("Response Error:", {
        message: error.message,
        status: error.status,
        data: error.response.data,

        code: error.response.data?.code,
        detail: error.response.data?.detail,
      });

      const MAX_MESSAGE_LENGTH = 100; // Max length for toast messages

      // Define the shape of expected error responses from DRF
      interface DRFErrorResponse {
        detail?: string;
        non_field_errors?: string[];
        [key: string]: unknown; // Handle dynamic field errors like username or password
      }

      // Utility to safely extract the error message
      const getErrorMessage = (data: unknown): string => {
        let message = "An unexpected error occurred."; // Default message

        if (isDRFErrorResponse(data)) {
          if (data.detail) {
            message = data.detail;
          } else if (
            data.non_field_errors &&
            data.non_field_errors.length > 0
          ) {
            message = data.non_field_errors.join(" ");
          } else {
            // Extract first field-specific error message
            const fieldKeys = Object.keys(data);
            const fieldErrors = Object.values(data).flat();
            if (typeof fieldErrors[0] === "string") {
              message = `${fieldKeys[0]} : ${fieldErrors[0]}` ;
            }
          }
        } else if (typeof data === "string") {
          message = data; // Handle plain string responses
        }

        // Truncate if the message is too long
        return message.length > MAX_MESSAGE_LENGTH
          ? message.slice(0, MAX_MESSAGE_LENGTH - 3) + "..."
          : message;
      };

      // Type guard to ensure 'data' is of the expected DRFErrorResponse type
      const isDRFErrorResponse = (data: unknown): data is DRFErrorResponse => {
        return typeof data === "object" && data !== null;
      };

      const message = getErrorMessage(error.response.data);

      switch (error.response.status) {
        case 400:
          toast.error(message || "Invalid Request.");
          break;
        case 401:
          toast.error("Unauthorized. Please log in.");
          break;
        case 403:
          toast.error("Forbidden. You don't have permission.");
          break;
        case 404:
          toast.error("Not Found. The requested resource is missing.");
          break;
        case 500:
          toast.error("Internal Server Error. Please try again later.");
          break;
        default:
          toast.error(`Error: ${message || "Something went wrong."}`);
      }
    } else if (error.request) {
      // Request was made but no response was received (Network or timeout issue)
      if (error.code === "ECONNABORTED") {
        console.error("Network Timeout Error:", error.message);
        toast.error("Request timed out. Please try again.");
      } else if (!navigator.onLine) {
        console.error("Network Error: The device is offline.");
        toast.error("You are offline. Check your network connection.");
      } else {
        console.error("Network Error:", error.request);
        toast.error("Network error. Please try again.");
      }
    } else {
      // Something happened in setting up the request
      console.error("Axios Error:", error.message);
      toast.error("An error occurred. Please try again.");
    }

    // console.error("Request Config:", error.config);
  } else if (error instanceof Error) {
    console.error("Non-Axios Error:", error.message);
    toast.error("An error occurred. Please try again.");
  } else {
    console.error("An unexpected error occurred.");
    toast.error("An unexpected error occurred.");
  }
};

export default handleAxiosError;
