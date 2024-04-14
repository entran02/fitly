// import React, { createContext, useState } from 'react';

// export const AuthContext = createContext({
//   isAuthenticated: false, 
//   user: null, 
//   login: (userData) => {}, 
//   logout: () => {}
// });


// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);

//   const login = (userData) => {
//     // Perform login logic, e.g., send login request to server
//     // Update the authentication state and user data
//     setIsAuthenticated(true);
//     setUser(userData);
//   };

//   const logout = () => {
//     // Perform logout logic, e.g., send logout request to server
//     // Update the authentication state and clear user data
//     setIsAuthenticated(false);
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };