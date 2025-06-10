// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
  const userData = JSON.parse(localStorage.getItem("userProfile")); // suponiendo que guardaste user completo
  const isAuthorized = userData && userData.tipousuario === allowedRole;

  return isAuthorized ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
