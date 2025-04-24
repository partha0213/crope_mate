import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, CircularProgress, Box } from '@mui/material';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy load components
const Home = lazy(() => import('./components/Home'));
const ProductList = lazy(() => import('./components/products/ProductList'));
const ProductDetails = lazy(() => import('./components/products/ProductDetails'));
const Cart = lazy(() => import('./components/cart/Cart'));
const Login = lazy(() => import('./components/auth/Login'));
const Register = lazy(() => import('./components/auth/Register'));
const Profile = lazy(() => import('./components/user/Profile'));
const AIDashboard = lazy(() => import('./components/ai/AIDashboard'));
const DiseaseDetection = lazy(() => import('./components/ai/DiseaseDetection'));
const SoilAnalysis = lazy(() => import('./components/ai/SoilAnalysis'));
const SmartRecommendations = lazy(() => import('./components/ai/SmartRecommendations'));
const PricePrediction = lazy(() => import('./components/ai/PricePrediction'));
const WeatherRecommendations = lazy(() => import('./components/ai/WeatherRecommendations'));
const PlantingCalendar = lazy(() => import('./components/ai/PlantingCalendar'));
const ChatbotAssistant = lazy(() => import('./components/ai/ChatbotAssistant'));

// Loading component
const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Header />
        <main className="py-3">
          <Container>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                
                {/* AI Feature Routes */}
                <Route path="/ai" element={<AIDashboard />} />
                <Route path="/ai/disease-detection" element={<DiseaseDetection />} />
                <Route path="/ai/soil-analysis" element={<SoilAnalysis />} />
                <Route path="/ai/recommendations" element={<SmartRecommendations />} />
                <Route path="/ai/price-prediction" element={<PricePrediction />} />
                <Route path="/ai/weather" element={<WeatherRecommendations />} />
                <Route path="/ai/planting-calendar" element={<PlantingCalendar />} />
                <Route path="/ai/chatbot" element={<ChatbotAssistant />} />
              </Routes>
            </Suspense>
          </Container>
        </main>
        <Footer />
      </ErrorBoundary>
    </Router>
  );
}

export default App;