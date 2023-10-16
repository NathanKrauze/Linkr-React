import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext({});

export default function AuthProvider({ children }) {
  const lsUser = JSON.parse(localStorage.getItem("user"));
  const [token, setToken] = useState(lsUser !== null ? lsUser.token : "");
  const [idUser, setIdUser] = useState(lsUser !== null ? lsUser.idUser : "");
  const [username, setUsername] = useState(
    lsUser !== null ? lsUser.username : ""
  );
  const [pictureUrl, setPictureUrl] = useState(
    lsUser !== null ? lsUser.pictureUrl : ""
  );
  const navigate = useNavigate();

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        idUser,
        setIdUser,
        username,
        setUsername,
        pictureUrl,
        setPictureUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
