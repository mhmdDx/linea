import heroImage from "@/assets/hero-image.png";
import { Button } from "@/components/ui/button";
import FadeIn from "@/components/animations/FadeIn";
import { motion } from "framer-motion";

const LargeHero = () => {
  return (
    <FadeIn>
      <section className="w-full mb-16 relative">
        <div className="w-full h-[60vh] md:h-[80vh] relative overflow-hidden">
          <img
            src={heroImage}
            alt="Modern jewelry collection"
            className="w-full h-full object-cover object-[90%_50%] md:object-center"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20" />

          {/* Content with staggered animations */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-6xl font-serif text-white mb-4 tracking-wide drop-shadow-lg"
            >
              Modern Heritage
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-base md:text-lg font-light text-white/90 max-w-md mx-auto mb-8 drop-shadow-md"
            >
              Contemporary jewelry crafted with timeless elegance
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <Button
                className="bg-white text-black hover:bg-white/90 rounded-none px-8 py-6 text-sm tracking-widest uppercase transition-all duration-300 hover:scale-105"
              >
                Explore Collection
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </FadeIn>
  );
};

export default LargeHero;