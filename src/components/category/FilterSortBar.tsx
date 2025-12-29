import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export interface FilterState {
  categories: string[];
  priceRanges: string[];
  materials: string[];
}

interface FilterSortBarProps {
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
  itemCount: number;
  onFiltersChange?: (filters: FilterState) => void;
  onSortChange?: (sortBy: string) => void;
}

const FilterSortBar = ({
  filtersOpen,
  setFiltersOpen,
  itemCount,
  onFiltersChange,
  onSortChange
}: FilterSortBarProps) => {
  const [sortBy, setSortBy] = useState("featured");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");

  const categories = ["All", "Earrings", "Bracelets", "Rings", "Necklaces"];
  const materials = ["All", "Gold", "Silver", "Rose Gold", "Platinum"];

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    applyFilters(value, selectedMaterial);
  };

  const handleMaterialChange = (value: string) => {
    setSelectedMaterial(value);
    applyFilters(selectedCategory, value);
  };

  const applyFilters = (category: string, material: string) => {
    if (onFiltersChange) {
      onFiltersChange({
        categories: category && category !== "All" ? [category] : [],
        priceRanges: [],
        materials: material && material !== "All" ? [material] : []
      });
    }
  };

  const handleClearAll = () => {
    setSelectedCategory("");
    setSelectedMaterial("");
    if (onFiltersChange) {
      onFiltersChange({
        categories: [],
        priceRanges: [],
        materials: []
      });
    }
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    if (onSortChange) {
      onSortChange(value);
    }
  };

  return (
    <>
      <section className="w-full px-6 mb-8 border-b border-border pb-4">
        <div className="flex justify-between items-center">
          <p className="text-sm font-light text-muted-foreground">
            {itemCount} items
          </p>

          <div className="flex items-center gap-4">
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-light hover:bg-transparent"
                >
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-background border-none shadow-none">
                <SheetHeader className="mb-6 border-b border-border pb-4">
                  <SheetTitle className="text-lg font-light">Filters</SheetTitle>
                </SheetHeader>

                <div className="space-y-6">
                  {/* Category Filter */}
                  <div>
                    <h3 className="text-sm font-light mb-3 text-foreground">Category</h3>
                    <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className="border-border" />

                  {/* Material Filter */}
                  <div>
                    <h3 className="text-sm font-light mb-3 text-foreground">Material</h3>
                    <Select value={selectedMaterial} onValueChange={handleMaterialChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select material" />
                      </SelectTrigger>
                      <SelectContent>
                        {materials.map((material) => (
                          <SelectItem key={material} value={material}>
                            {material}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className="border-border" />

                  <div className="flex flex-col gap-2 pt-4">
                    <Button
                      onClick={handleClearAll}
                      variant="ghost"
                      size="sm"
                      className="w-full border-none hover:bg-transparent hover:underline font-light text-left justify-start"
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-auto border-none bg-transparent text-sm font-light shadow-none rounded-none pr-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="shadow-none border-none rounded-none bg-background">
                <SelectItem value="featured" className="hover:bg-transparent hover:underline data-[state=checked]:bg-transparent data-[state=checked]:underline pl-2 [&>span:first-child]:hidden">Featured</SelectItem>
                <SelectItem value="price-low" className="hover:bg-transparent hover:underline data-[state=checked]:bg-transparent data-[state=checked]:underline pl-2 [&>span:first-child]:hidden">Price: Low to High</SelectItem>
                <SelectItem value="price-high" className="hover:bg-transparent hover:underline data-[state=checked]:bg-transparent data-[state=checked]:underline pl-2 [&>span:first-child]:hidden">Price: High to Low</SelectItem>
                <SelectItem value="newest" className="hover:bg-transparent hover:underline data-[state=checked]:bg-transparent data-[state=checked]:underline pl-2 [&>span:first-child]:hidden">Newest</SelectItem>
                <SelectItem value="name" className="hover:bg-transparent hover:underline data-[state=checked]:bg-transparent data-[state=checked]:underline pl-2 [&>span:first-child]:hidden">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>
    </>
  );
};

export default FilterSortBar;