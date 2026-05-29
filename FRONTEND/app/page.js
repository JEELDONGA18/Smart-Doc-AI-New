import Navbar from "./components/landing/Navbar";
import HeroSection from "./components/landing/HeroSection";
import FeaturesSection from "./components/landing/FeaturesSection";
import DashboardShowcase from "./components/landing/DashboardShowcase";
import HowItWorks from "./components/landing/HowItWorks";
import SecuritySection from "./components/landing/SecuritySection";
import CTASection from "./components/landing/CTASection";
import Footer from "./components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <DashboardShowcase />
      <HowItWorks />
      <SecuritySection />
      <CTASection />
      <Footer />
    </>
  );
}
