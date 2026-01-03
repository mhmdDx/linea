import { Link, useSearchParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface CategoryHeaderProps {
  category: string;
}

const CategoryHeader = ({ category }: CategoryHeaderProps) => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');

  const displayTitle = searchQuery
    ? `Search Results: ${searchQuery}`
    : category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <section className="w-full px-6 mb-8">
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{searchQuery ? 'Search' : displayTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div>
        <h1 className="text-3xl md:text-4xl font-light text-foreground">
          {displayTitle}
        </h1>
      </div>
    </section>
  );
};

export default CategoryHeader;