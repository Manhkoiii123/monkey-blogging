import { auth, db } from "firebase-app/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { createContext } from "react";

const authContext = createContext();
function AuthProvider(props) {
  const [userInfo, setUserInfo] = useState({});
  const value = { userInfo, setUserInfo };
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const docRef = query(
          collection(db, "users"),
          where("email", "==", user.email)
        );
        onSnapshot(docRef, (snapshot) => {
          snapshot.forEach((doc) => {
            setUserInfo({
              ...user,
              ...doc.data(),
            });
          });
        });
        // setUserInfo(user);
      } else {
        setUserInfo(null);
      }
    });
  }, []);
  return <authContext.Provider value={value} {...props}></authContext.Provider>;
}

function useAuth() {
  const context = useContext(authContext);
  if (typeof context === "undefined")
    throw new Error("useAuth must be used in AuthProvider");
  return context;
}
export { AuthProvider, useAuth };
