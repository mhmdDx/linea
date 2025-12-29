import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import LargeHero from "../components/content/LargeHero";
import FiftyFiftySection from "../components/content/FiftyFiftySection";
import OneThirdTwoThirdsSection from "../components/content/OneThirdTwoThirdsSection";
import ProductCarousel from "../components/content/ProductCarousel";
import RestockedSection from "../components/content/RestockedSection";
import ShopByCollectionSection from "../components/content/ShopByCollectionSection";
import EditorialSection from "../components/content/EditorialSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <FiftyFiftySection />
        <ProductCarousel />
        <RestockedSection />
        <ShopByCollectionSection />
        <LargeHero />
        <EditorialSection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
