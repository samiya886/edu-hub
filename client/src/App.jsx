import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import PapersPage from "./pages/PapersPage";
import SubjectsPage from "./pages/SubjectsPage";
import NotesPage from "./pages/Notes";
import DepartmentsPage from "./pages/DepartmentsPage";
import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Auth from "./pages/Auth";
import AdminLogin from "./pages/AdminLogin";
import { AuthProvider } from "./contexts/AuthContext";


function Layout() {
  const location = useLocation();

  // Hide public navbar/footer on full-screen app pages.
 const hideLayout =
  location.pathname.startsWith("/admin") ||
  location.pathname.startsWith("/teacher") ||
  location.pathname.startsWith("/student") ||
  location.pathname.startsWith("/admin-login") ||
  location.pathname.startsWith("/auth");

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/papers" element={<PapersPage />} />
        <Route path="/subjects" element={<SubjectsPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/admin/*" element={<ProtectedRoute requiredRole={'admin'} redirectTo="/admin-login"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/teacher/*" element={<ProtectedRoute requiredRole={'teacher'}><TeacherDashboard /></ProtectedRoute>} />
        <Route path="/student/*" element={<ProtectedRoute requiredRole={'student'}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/auth" element={<Auth />} />

      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, search]);

  return null;
}

export default function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Layout />
      </BrowserRouter>
    </AuthProvider>
  );
}

