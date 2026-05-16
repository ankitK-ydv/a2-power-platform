import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import PricingPage from './components/PricingPage';
import ProjectDetailsForm from './components/ProjectDetailsForm';
import CheckoutPage from './components/CheckoutPage';
import LiveDemoPage from './components/LiveDemoPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/live-demo" element={<LiveDemoPage />} />
        <Route path="/form" element={<ProjectDetailsForm />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </Router>
  );
}
