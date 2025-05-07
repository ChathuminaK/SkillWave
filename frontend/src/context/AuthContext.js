// Add this inside the login function or useEffect
console.log('Token in storage:', localStorage.getItem('auth_token'));

// Test the token parsing
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

const token = localStorage.getItem('auth_token');
if (token) {
  const decoded = parseJwt(token);
  console.log('Decoded token:', decoded);
  console.log('Token expiration:', new Date(decoded.exp * 1000).toLocaleString());
}