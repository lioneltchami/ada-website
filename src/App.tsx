import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import NewsletterPopup from './components/NewsletterPopup';
import ScrollProgress from './components/ScrollProgress';
import FloatingElements from './components/FloatingElements';
import PageTransition from './components/PageTransition';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Team from './pages/Team';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import Gallery from './pages/Gallery';
import GetInvolved from './pages/GetInvolved';

function AnimatedRoutes() {
  const location = useLocation();

  const handleEmailRequest = (email: string, subject: string, message: string) => {
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoLink;
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 relative">
        <ScrollProgress />
        <FloatingElements />
        <Header />
        <main className="relative z-10">
          <ErrorBoundary>
            <AnimatePresence mode="wait" initial={false}>
              <Routes location={location}>
                <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                <Route path="/about" element={<PageTransition><About /></PageTransition>} />
                <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
                <Route path="/projects/:id" element={<PageTransition><ProjectDetail /></PageTransition>} />
                <Route path="/team" element={<PageTransition><Team /></PageTransition>} />
                <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
                <Route path="/donate" element={<PageTransition><Donate /></PageTransition>} />
                <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
                <Route path="/get-involved" element={<PageTransition><GetInvolved /></PageTransition>} />
              </Routes>
            </AnimatePresence>
          </ErrorBoundary>
        </main>
        <Footer />
        <Chatbot onEmailRequest={handleEmailRequest} />
        <NewsletterPopup />
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;