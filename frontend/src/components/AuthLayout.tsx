import { useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

interface AuthLayoutProps {
  children: ReactNode;
  authentication: boolean;
}

function AuthLayout({ children, authentication }: AuthLayoutProps) {
  const { user, isLoading } = useContext(UserContext);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (authentication && !user) {
    navigate("/sign-in");
    return null;
  } else if (!authentication && user) {
    navigate("/");
    return null;
  }

  return children;
}

export default AuthLayout;
