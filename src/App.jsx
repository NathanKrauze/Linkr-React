import { Route, Routes } from "react-router-dom";
import styled from "styled-components";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import TimelinePage from "./pages/TimelinePage";
import AuthProvider from "./contexts/authContext";

export default function App() {
  return (
    <PagesContainer>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
        </Routes>
      </AuthProvider>
    </PagesContainer>
  );
}

const PagesContainer = styled.main`
  width: 100%;
  max-height: 100vh;
`;
