import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import braceletImage from "@/assets/catogary/bercelet.PNG";
import necklaceImage from "@/assets/catogary/neckless.PNG";
import earringImage from "@/assets/catogary/earings.PNG";
import ringImage from "@/assets/catogary/rings.PNG";
import watchImage from "@/assets/catogary/WATCHES.JPG";
import FadeIn from "@/components/animations/FadeIn";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const ShopByCollectionSection = () => {
    const collections = [
        {
            title: "Bracelets",
            image: braceletImage,
            link: "/category/bracelets",
        },
        {
            title: "Necklaces",
            image: necklaceImage,
            link: "/category/necklaces",
        },
        {
            title: "Earrings",
            image: earringImage,
            link: "/category/earrings",
        },
        {
            title: "Rings",
            image: ringImage,
            link: "/category/rings",
        },
        {
            title: "Watches",
            image: watchImage,
            link: "/category/watches",
        },
    ];

    return (
        <FadeIn>
            <section className="w-full mb-24 mt-20 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-10 px-2">
                        <h2 className="text-3xl md:text-4xl font-serif text-foreground">
                            Shop by Collection
                        </h2>
                        <Link
                            to="/category/shop"
                            className="text-sm font-medium border-b border-foreground pb-0.5 hover:text-muted-foreground hover:border-muted-foreground transition-all"
                        >
                            View All
                        </Link>
                    </div>

                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        plugins={[
                            Autoplay({
                                delay: 2000,
                                stopOnInteraction: false,
                            }),
                        ]}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4">
                            {collections.map((collection, index) => (
                                <CarouselItem
                                    key={`${collection.title}-${index}`}
                                    className="pl-4 basis-[70%] sm:basis-[45%] md:basis-[30%] lg:basis-[25%]"
                                >
                                    <Link
                                        to={collection.link}
                                        className="group block h-full"
                                    >
                                        <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-muted/20">
                                            <img
                                                src={collection.image}
                                                alt={collection.title}
                                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

                                            {/* Overlay Content - Optional style, keeping it clean below for now but adding an icon overlay */}
                                            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                                <ArrowRight className="w-5 h-5 text-black" />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between px-1">
                                            <span className="text-lg font-medium font-serif tracking-wide group-hover:text-muted-foreground transition-colors">
                                                {collection.title}
                                            </span>
                                        </div>
                                    </Link>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <div className="hidden md:block">
                            <CarouselPrevious className="-left-4 lg:-left-12" />
                            <CarouselNext className="-right-4 lg:-right-12" />
                        </div>
                    </Carousel>
                </div>
            </section>
        </FadeIn>
    );
};

export default ShopByCollectionSection;

