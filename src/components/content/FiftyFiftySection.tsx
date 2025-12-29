import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import heroLeft from "@/assets/hero-left.JPG";
import heroRight from "@/assets/hero-right.JPG";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const FiftyFiftySection = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <section className="w-full relative px-0 mb-0">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          <CarouselItem className="pl-0 basis-full md:basis-1/2">
            <Link to="/category/earrings" className="block w-full h-full">
              <div className="w-full h-[60vh] md:h-[90vh] relative overflow-hidden">
                <img
                  src={heroLeft}
                  alt="Earrings collection"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10 md:bg-transparent" />
              </div>
            </Link>
          </CarouselItem>

          <CarouselItem className="pl-0 basis-full md:basis-1/2">
            <Link to="/category/bracelets" className="block w-full h-full">
              <div className="w-full h-[60vh] md:h-[90vh] relative overflow-hidden">
                <img
                  src={heroRight}
                  alt="Chain link bracelet"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10 md:bg-transparent" />
              </div>
            </Link>
          </CarouselItem>
        </CarouselContent>
      </Carousel>

      {/* Overlay Content with staggered animations */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 pointer-events-none">
        <div className="text-3xl md:text-5xl lg:text-6xl text-white font-serif mb-6 drop-shadow-md tracking-wide px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            CRAFTING BEAUTY
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            WITH PURPOSE
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Button
            className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-6 text-lg pointer-events-auto"
          >
            Discover
          </Button>
        </motion.div>
      </div>

      {/* Mobile Pagination Dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20 md:hidden">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all bg-white/50",
              current === index + 1 && "bg-white w-3 h-3"
            )}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default FiftyFiftySection;