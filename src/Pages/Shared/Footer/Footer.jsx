import Logo from "../../../Component/Logo/Logo";

const Footer = () => {
  return (
    <footer className="py-12 px-4">
      <div className=" bg-black text-[#ffffff] rounded-3xl px-8 py-12 md:px-12 md:py-16 text-center">
        {/* Logo Section */}
        <div>
          <Logo />
        </div>

        {/* Tagline */}
        <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-6">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero
          hassle. From personal packages to business shipments — we deliver on
          time, every time.
        </p>

        {/* Dotted Divider */}
        <div className="border-t border-dotted border-gray-700 my-6"></div>

        {/* Navigation Links */}
        <nav className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mb-6 text-gray-300 text-sm md:text-base">
          <a href="#" className="hover:text-white transition-colors">
            Services
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Coverage
          </a>
          <a href="#" className="hover:text-white transition-colors">
            About Us
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Pricing
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Blog
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Contact
          </a>
        </nav>

        {/* Dotted Divider */}
        <div className="border-t border-dotted border-gray-700 my-6"></div>

        {/* Social Icons */}
        <div className="flex items-center justify-center gap-4">
          {/* LinkedIn */}
          <a
            href="#"
            className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors"
            aria-label="LinkedIn"
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="white"
              className="flex-shrink-0"
            >
              <path d="M4.98 3.5C4.98 4.6 4.12 5.5 3 5.5S1 4.6 1 3.5 1.86 1.5 3 1.5s1.98.9 1.98 2zM.5 24h5V7h-5v17zM9 7v17h5v-9c0-4.97 6-5.37 6 0v9h5V13c0-8.84-9.24-8.5-11-4v-1H9z" />
            </svg>
          </a>

          {/* X/Twitter */}
          <a
            href="#"
            className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors"
            aria-label="X/Twitter"
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="white"
              className="flex-shrink-0"
            >
              <path d="M22 4.01c-.77.35-1.6.58-2.47.69.89-.53 1.57-1.37 1.89-2.38-.83.49-1.74.84-2.71 1.03C18.4 2.5 17.28 2 16.07 2c-1.7 0-3.08 1.37-3.08 3.06 0 .24.03.47.08.69C9.7 5.61 6.13 3.6 3.7.86c-.26.45-.41.98-.41 1.54 0 1.06.54 2 1.36 2.55-.5-.02-.97-.15-1.38-.38v.04c0 1.49 1.06 2.73 2.47 3.02-.46.12-.94.15-1.45.06.41 1.28 1.59 2.21 2.99 2.24C6.6 11.8 4.95 12.5 3.2 12.5c-.31 0-.62-.02-.92-.05 1.71 1.1 3.75 1.74 5.94 1.74 7.12 0 11.02-5.9 11.02-11.02v-.5c.76-.55 1.42-1.24 1.95-2.02-.69.31-1.43.52-2.2.62z" />
            </svg>
          </a>

          {/* Facebook */}
          <a
            href="#"
            className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors"
            aria-label="Facebook"
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="white"
              className="flex-shrink-0"
            >
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 5 3.66 9.13 8.44 9.88v-6.99H7.9v-2.89h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.23 0-1.61.77-1.61 1.56v1.87h2.74l-.44 2.89h-2.3V22C18.34 21.13 22 17 22 12z" />
            </svg>
          </a>

          {/* YouTube */}
          <a
            href="#"
            className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-700 transition-colors"
            aria-label="YouTube"
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="white"
              className="flex-shrink-0"
            >
              <path d="M23.5 6.2a3 3 0 0 0-2.1-2.12C19.8 3.5 12 3.5 12 3.5s-7.8 0-9.4.6A3 3 0 0 0 .5 6.2 31.9 31.9 0 0 0 0 12a31.9 31.9 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.12c1.6.6 9.4.6 9.4.6s7.8 0 9.4-.6A3 3 0 0 0 23.5 17.8 31.9 31.9 0 0 0 24 12a31.9 31.9 0 0 0-.5-5.8zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
