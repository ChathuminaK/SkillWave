// Utility to extract a user-friendly error message from axios or generic errors
export function extractErrorMessage(error) {
  if (!error) return 'An unknown error occurred.';

  // Axios error with response from backend
  if (error.response && error.response.data) {
    if (typeof error.response.data === 'string') {
      return error.response.data;
    }
    if (error.response.data.message) {
      return error.response.data.message;
    }
    if (error.response.data.error) {
      return error.response.data.error;
    }
    // Fallback to JSON string
    return JSON.stringify(error.response.data);
  }

  // Axios error with message
  if (error.message) {
    return error.message;
  }

  // Fallback
  return 'An unexpected error occurred.';
}
