// UserContext.js

import React, {createContext, useState, useContext} from 'react';

// Create a new context
const UserContext = createContext();

// Create a custom hook to access the user context
export const useUser = () => useContext(UserContext);

// Create a provider component to wrap your app with
export const UserProvider = ({children}) => {
  // State to hold user data
  const [userData, setUserData] = useState(null);

  // Function to update user data
  const updateUserData = newData => {
    setUserData(newData);
  };

  return (
    <UserContext.Provider value={{userData, updateUserData}}>
      {children}
    </UserContext.Provider>
  );
};
