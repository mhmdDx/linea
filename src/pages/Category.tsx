import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import CategoryHeader from "../components/category/CategoryHeader";
import FilterSortBar, { FilterState } from "../components/category/FilterSortBar";
import ProductGrid from "../components/category/ProductGrid";

const Category = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRanges: [],
    materials: []
  });
  const [sortBy, setSortBy] = useState<string>("featured");
  const [productCount, setProductCount] = useState<number>(0);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-6">
        <CategoryHeader
          category={category || 'All Products'}
        />

        <FilterSortBar
          filtersOpen={filtersOpen}
          setFiltersOpen={setFiltersOpen}
          itemCount={productCount}
          onFiltersChange={handleFiltersChange}
          onSortChange={handleSortChange}
        />

        <ProductGrid
          categoryHandle={category}
          filters={filters}
          sortBy={sortBy}
          onProductCountChange={setProductCount}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Category;