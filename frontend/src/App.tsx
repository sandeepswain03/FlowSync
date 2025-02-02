import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "./components/AuthLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Project from "./pages/Project/Project";
import SignIn from "./pages/Sign-In/Sign-In";
import SignUp from "./pages/Sign-Up/Sign-Up";


function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AuthLayout authentication={true}>
            <Dashboard />
          </AuthLayout>
        }
      />
      <Route
        path="/sign-in"
        element={
          <AuthLayout authentication={false}>
            <SignIn />
          </AuthLayout>
        }
      />
      <Route
        path="/sign-up"
        element={
          <AuthLayout authentication={false}>
            <SignUp />
          </AuthLayout>
        }
      />
      <Route
        path="/project"
        element={
          <AuthLayout authentication={true}>
            <Project />
          </AuthLayout>
        }
      />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
