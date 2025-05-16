/**
 * Debug utility for tracing API calls and responses
 */
export const setupAPIDebugging = () => {
  // Store the original fetch function
  const originalFetch = window.fetch;

  // Override the fetch function to add debugging
  window.fetch = async (...args) => {
    const [resource, config] = args;
    
    // Log request details
    console.group(`🌐 API Request: ${config?.method || 'GET'} ${resource}`);
    console.log('Request config:', config);
    
    try {
      // Call the original fetch function
      const response = await originalFetch(...args);
      
      // Clone the response to be able to read its body multiple times
      const clonedResponse = response.clone();
      
      try {
        // Try to parse response as JSON
        const data = await clonedResponse.json();
        console.log('Response data:', data);
      } catch (e) {
        // If response is not JSON, log it as text
        const text = await clonedResponse.text();
        console.log('Response text:', text);
      }
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      console.groupEnd();
      
      return response;
    } catch (error) {
      console.error('Request failed:', error);
      console.groupEnd();
      throw error;
    }
  };

  // Log any unhandled errors
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
  });

  console.log('API debugging initialized');
};

export const testBackendConnection = async () => {
  try {
    console.log('Testing backend connection...');
    const response = await fetch('http://localhost:8080/api/test/ping', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Connection test response:', response.status);
    
    if (response.ok) {
      const data = await response.text();
      console.log('Connection successful:', data);
      return { success: true, message: data };
    } else {
      console.error('Connection failed with status:', response.status);
      return { success: false, status: response.status };
    }
  } catch (error) {
    console.error('Connection test error:', error);
    return { success: false, error: error.message };
  }
};
