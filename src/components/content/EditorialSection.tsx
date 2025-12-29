import { ArrowUpRight, Instagram, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import FadeIn from "@/components/animations/FadeIn";

const EditorialSection = () => {
  return (
    <FadeIn>
      <section id="contact" className="w-full mb-16 px-6 py-12 bg-muted/20">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-serif text-foreground">
              Connect With Us
            </h2>
            <p className="text-base font-light text-foreground/80 leading-relaxed max-w-lg mx-auto">
              Join our community to stay updated with the latest collections, behind-the-scenes moments, and exclusive offers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="outline" className="w-full sm:w-auto gap-2" asChild>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={18} />
                <span>Follow on Instagram</span>
                <ArrowUpRight size={14} className="ml-0.5 opacity-50" />
              </a>
            </Button>

            <Button variant="outline" className="w-full sm:w-auto gap-2" asChild>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Video size={18} />
                <span>Follow on TikTok</span>
                <ArrowUpRight size={14} className="ml-0.5 opacity-50" />
              </a>
            </Button>
          </div>

          <div className="pt-8 border-t border-border/50">
            <h3 className="text-sm font-medium mb-3 uppercase tracking-wider text-muted-foreground">Get in Touch</h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
              <a href="mailto:hello@linea88.com" className="hover:underline">hello@linea88.com</a>
              <span className="hidden sm:inline text-muted-foreground">•</span>
              <a href="tel:+201234567890" className="hover:underline">+20 123 456 7890</a>
            </div>
          </div>
        </div>
      </section>
    </FadeIn>
  );
};

export default EditorialSection;