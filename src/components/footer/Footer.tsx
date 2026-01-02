import { Facebook, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-white text-black pt-8 pb-2 px-6 border-t border-[#e5e5e5] mt-48">
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8">
          {/* Brand - Left side */}
          <div>
            <img
              src="/Linea_Jewelry_Inc-2.svg"
              alt="Linea Jewelry Inc."
              className="mb-4 h-6 w-auto"
            />
            <p className="text-sm font-light text-black/70 leading-relaxed max-w-md mb-6">
              Minimalist jewelry crafted for the modern individual
            </p>

            <div className="flex gap-4">
              <a href="https://www.facebook.com/share/1AJ5P2P3Vo/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-black/70 hover:text-black transition-colors">
                <Facebook size={20} strokeWidth={1.5} />
              </a>
              <a href="https://www.instagram.com/linea.accessories_?igsh=b2l1ZWpsMnZsM2tm&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-black/70 hover:text-black transition-colors">
                <Instagram size={20} strokeWidth={1.5} />
              </a>
              <a href="https://www.tiktok.com/@linea.accessories_?_r=1&_t=ZS-92iqJfiuW3u" target="_blank" rel="noopener noreferrer" className="text-black/70 hover:text-black transition-colors">
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
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
            </div>

            {/* Contact Information */}

          </div>

          {/* Link lists - Right side */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Shop */}
            <div>
              <h4 className="text-sm font-normal mb-4">Shop</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm font-light text-black/70 hover:text-black transition-colors">New In</a></li>
                <li><a href="#" className="text-sm font-light text-black/70 hover:text-black transition-colors">Rings</a></li>
                <li><a href="#" className="text-sm font-light text-black/70 hover:text-black transition-colors">Earrings</a></li>
                <li><a href="#" className="text-sm font-light text-black/70 hover:text-black transition-colors">Bracelets</a></li>
                <li><a href="#" className="text-sm font-light text-black/70 hover:text-black transition-colors">Necklaces</a></li>
              </ul>
            </div>


            {/* Connect */}
            <div>
              <h4 className="text-sm font-normal mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="https://www.instagram.com/linea.accessories_?igsh=b2l1ZWpsMnZsM2tm&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-sm font-light text-black/70 hover:text-black transition-colors">Instagram</a></li>
                <li><a href="#" className="text-sm font-light text-black/70 hover:text-black transition-colors">Pinterest</a></li>
                <li><a href="#" className="text-sm font-light text-black/70 hover:text-black transition-colors">Newsletter</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section - edge to edge separator */}
      <div className="border-t border-[#e5e5e5] -mx-6 px-6 pt-2">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm font-light text-black mb-1 md:mb-0">
            © 2026 Linea. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="/privacy-policy" className="text-sm font-light text-black hover:text-black/70 transition-colors">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="text-sm font-light text-black hover:text-black/70 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;