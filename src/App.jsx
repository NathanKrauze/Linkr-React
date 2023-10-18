import { Route, Routes } from "react-router-dom";
import styled from "styled-components";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import TimelinePage from "./pages/TimelinePage.jsx";
import HashtagPage from "./pages/HashtagPage.jsx";
import AuthProvider from "./contexts/authContext.jsx";
import { AuthContext } from "./contexts/authContext.jsx";
import { PostContext } from "./contexts/postContext.jsx";
import { useContext, useState } from "react";

export default function App() {
  const [statusModal, setStatusModal] = useState(false);
  const [idPost, setIdPost] = useState(0);
  const [reRenderTimeline, setReRenderTimeline] = useState();
  
  return (
    <PagesContainer>
      <AuthProvider>
        <PostContext.Provider
          value={{ statusModal, setStatusModal, idPost, setIdPost, reRenderTimeline, setReRenderTimeline }}
        >
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/hashtag/:hashtag" element={<HashtagPage />} />
          </Routes>
        </PostContext.Provider>
      </AuthProvider>
    </PagesContainer>
  );
}

const PagesContainer = styled.main`
  width: 100%;
  max-height: 100vh;
`;
