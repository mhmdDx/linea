import { ArrowUpRight, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import FadeIn from "@/components/animations/FadeIn";

const EditorialSection = () => {
  return (
    <FadeIn>
      <section id="contact" className="w-full mb-20 px-6 py-16 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center space-y-10">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-serif text-black tracking-tight">
              Join The Linea Community
            </h2>
            <p className="text-base font-light text-gray-600 leading-relaxed max-w-lg mx-auto">
              Follow us for daily style inspiration, behind-the-scenes content, and early access to new drops.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-2xl mx-auto">

            {/* Instagram */}
            <Button variant="outline" className="w-full h-14 bg-white border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all duration-300 group rounded-none" asChild>
              <a
                href="https://www.instagram.com/linea.accessories_?igsh=b2l1ZWpsMnZsM2tm&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-6"
              >
                <div className="flex items-center gap-3">
                  <Instagram size={20} className="stroke-[1.5]" />
                  <span className="font-medium tracking-wide">Instagram</span>
                </div>
                <ArrowUpRight size={18} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </a>
            </Button>

            {/* TikTok */}
            <Button variant="outline" className="w-full h-14 bg-white border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all duration-300 group rounded-none" asChild>
              <a
                href="https://www.tiktok.com/@linea.accessories_?_r=1&_t=ZS-92iqJfiuW3u"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-6"
              >
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-video"
                  >
                    <path d="M16 8l5-3v14l-5-3" />
                    <path d="M21 12H3" />
                    <path d="M3 5v14" />
                  </svg>
                  <span className="font-medium tracking-wide">TikTok</span>
                </div>
                <ArrowUpRight size={18} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </a>
            </Button>

            {/* Facebook */}
            <Button variant="outline" className="w-full h-14 bg-white border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all duration-300 group rounded-none" asChild>
              <a
                href="https://www.facebook.com/share/1AJ5P2P3Vo/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-6"
              >
                <div className="flex items-center gap-3">
                  <Facebook size={20} className="stroke-[1.5]" />
                  <span className="font-medium tracking-wide">Facebook</span>
                </div>
                <ArrowUpRight size={18} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </a>
            </Button>

          </div>
        </div>
      </section>
    </FadeIn>
  );
};

export default EditorialSection;