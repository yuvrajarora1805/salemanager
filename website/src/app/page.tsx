"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

/* ═══════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════ */

const heroSlides = [
  {
    image: "/images/hero1.png",
    badge: "Authorised Franchise of Nayara Energy",
    title: "Powering Your Journey.",
    highlight: "Every Mile.",
    subtitle:
      "Experience premium fuel quality and exceptional service at Goyal Filling Station. We are committed to fueling your drive with the highest standards.",
  },
  {
    image: "/images/hero2.png",
    badge: "Quality You Can Trust",
    title: "Pure Fuel.",
    highlight: "Peak Performance.",
    subtitle:
      "100% adulteration-free petrol and diesel sourced directly from Nayara Energy's state-of-the-art refinery — one of India's largest private refineries.",
  },
  {
    image: "/images/hero3.png",
    badge: "Beyond Just Fuel",
    title: "Complete Care.",
    highlight: "One Stop.",
    subtitle:
      "From premium lubricants to free air & water, digital payments to clean restrooms — we provide a complete fueling experience for every traveler.",
  },
];

const services = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
    title: "Premium Quality Fuels",
    desc: "High-performance Petrol (MS) and High-Speed Diesel (HSD) sourced directly from Nayara Energy's world-class Vadinar refinery.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Fast & Efficient Service",
    desc: "Multiple high-speed dispensing units ensure minimal wait times. Our trained staff delivers quick, accurate fueling every time.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
    title: "Digital Payments",
    desc: "Accept all major UPI apps (PhonePe, GPay, Paytm), credit/debit cards, fleet cards, and FASTag-linked wallets.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
    title: "Lubricants & Engine Oils",
    desc: "Wide range of high-quality engine oils, gear oils, and specialty lubricants for all vehicle types — two-wheelers to heavy commercial vehicles.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
      </svg>
    ),
    title: "Free Air & Water",
    desc: "Complimentary tyre pressure checking and calibrated air filling. Fresh RO purified drinking water available for all customers.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Clean & Safe Facilities",
    desc: "Hygienic restrooms, well-lit forecourt, 24/7 CCTV surveillance, and fire safety equipment maintained to the highest standards.",
  },
];

const fallbackGalleryImages = [
  { src: "/images/hero1.png", category: "Station", caption: "Station at Sunset" },
  { src: "/images/hero2.png", category: "Station", caption: "Aerial View" },
  { src: "/images/hero3.png", category: "Station", caption: "Fuel Dispensing" },
  { src: "/images/gallery1.png", category: "Station", caption: "Station Front View" },
  { src: "/images/gallery2.png", category: "Team", caption: "Our Dedicated Team" },
  { src: "/images/gallery3.png", category: "Events", caption: "Inauguration Ceremony" },
];

const stats = [
  { number: "10+", label: "Years of Service" },
  { number: "50K+", label: "Happy Customers" },
  { number: "24/7", label: "Quality Assured" },
  { number: "100%", label: "Pure Fuel" },
];

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About Us" },
  { href: "#services", label: "Services" },
  { href: "#gallery", label: "Gallery" },
  { href: "#offers", label: "Offers" },
  { href: "#contact", label: "Contact" },
];

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */

export default function Home() {
  /* ─── State ─── */
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isNavSolid, setIsNavSolid] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [galleryFilter, setGalleryFilter] = useState("All");
  const [galleryImages, setGalleryImages] = useState(fallbackGalleryImages);
  const [offers, setOffers] = useState<any[]>([]);

  const heroTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  /* ─── Fetch gallery images from DB ─── */
  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setGalleryImages(
            data.map((img: { image_url: string; category: string; caption: string }) => ({
              src: img.image_url,
              category: img.category,
              caption: img.caption,
            }))
          );
        }
      })
      .catch(() => { /* keep fallback images */ });
      
    fetch("/api/offers")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOffers(data);
        }
      })
      .catch(() => {});
  }, []);

  /* ─── Derived gallery categories ─── */
  const galleryCategories = ["All", ...Array.from(new Set(galleryImages.map((img) => img.category)))];

  /* ─── Filtered gallery ─── */
  const filteredGallery =
    galleryFilter === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === galleryFilter);

  /* ─── Hero carousel auto-rotation ─── */
  const startHeroTimer = useCallback(() => {
    if (heroTimerRef.current) clearInterval(heroTimerRef.current);
    heroTimerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
  }, []);

  useEffect(() => {
    startHeroTimer();
    return () => {
      if (heroTimerRef.current) clearInterval(heroTimerRef.current);
    };
  }, [startHeroTimer]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    startHeroTimer();
  };

  /* ─── Scroll-based navbar ─── */
  useEffect(() => {
    const handleScroll = () => setIsNavSolid(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ─── Intersection Observer for section reveal ─── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("section-hidden");
            entry.target.classList.add("section-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  /* ─── Lightbox keyboard controls ─── */
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") setLightboxIndex((prev) => (prev !== null ? (prev + 1) % filteredGallery.length : null));
      if (e.key === "ArrowLeft") setLightboxIndex((prev) => (prev !== null ? (prev - 1 + filteredGallery.length) % filteredGallery.length : null));
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [lightboxIndex, filteredGallery.length]);

  /* ─── Lock body scroll on mobile menu ─── */
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const addSectionRef = (index: number) => (el: HTMLElement | null) => {
    sectionRefs.current[index] = el;
  };

  /* ═══════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════ */
  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* ────────────────── NAVBAR ────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isNavSolid ? "navbar-solid" : "navbar-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-lg p-1.5 shadow-sm">
              <Image
                src="/images/nayara_logo.jpg"
                alt="Nayara Energy Logo"
                width={100}
                height={35}
                className="mix-blend-multiply"
                unoptimized
              />
            </div>
            <div className="hidden md:block h-8 w-px bg-white/30" />
            <h1 className="hidden md:block text-white text-lg font-semibold tracking-wide">
              Goyal Filling Station
            </h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-white/85 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="ml-4 bg-[#0099D8] text-white text-sm font-bold py-2.5 px-6 rounded-lg hover:bg-[#007AB0] transition-all duration-300 shadow-lg shadow-[#0099D8]/25"
            >
              Locate Us
            </a>
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* ────────────────── MOBILE DRAWER ────────────────── */}
      <div
        className={`mobile-drawer-overlay ${isMobileMenuOpen ? "open" : ""}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <div className={`mobile-drawer ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-10">
            <div className="bg-white rounded-lg p-1.5">
              <Image
                src="/images/nayara_logo.jpg"
                alt="Nayara Energy Logo"
                width={90}
                height={30}
                className="mix-blend-multiply"
                unoptimized
              />
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white/60 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white/80 hover:text-white text-lg font-medium py-3 px-4 rounded-lg hover:bg-white/10 transition-all border-b border-white/5"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-4 bg-[#0099D8] text-white text-center font-bold py-3.5 px-6 rounded-lg hover:bg-[#007AB0] transition-all"
            >
              Get Directions
            </a>
          </nav>
        </div>
      </div>

      {/* ────────────────── HERO CAROUSEL ────────────────── */}
      <section id="home" className="relative h-screen min-h-[650px] max-h-[900px] overflow-hidden">
        {/* Slides */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentSlide ? "active" : ""}`}
          >
            {/* Background Image */}
            <div className="hero-bg absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
            </div>
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A2240]/90 via-[#0A2240]/70 to-[#0A2240]/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A2240]/60 via-transparent to-transparent" />
          </div>
        ))}

        {/* Content */}
        <div className="relative z-10 h-full flex items-center pt-24 md:pt-32">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-2xl">
              <div
                key={`badge-${currentSlide}`}
                className="animate-fade-in-down inline-block bg-[#0099D8]/20 text-[#0099D8] font-semibold px-5 py-2 rounded-full text-xs md:text-sm mb-6 border border-[#0099D8]/30 backdrop-blur-sm"
              >
                {heroSlides[currentSlide].badge}
              </div>
              <h2
                key={`title-${currentSlide}`}
                className="animate-fade-in-up text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] tracking-tight text-white"
              >
                {heroSlides[currentSlide].title}
                <br />
                <span className="gradient-text">{heroSlides[currentSlide].highlight}</span>
              </h2>
              <p
                key={`sub-${currentSlide}`}
                className="animate-fade-in-up delay-200 text-base md:text-lg mb-10 text-gray-300 max-w-xl font-light leading-relaxed"
              >
                {heroSlides[currentSlide].subtitle}
              </p>
              <div className="animate-fade-in-up delay-400 flex flex-col sm:flex-row gap-4">
                <a
                  href="#contact"
                  className="bg-[#0099D8] text-white font-bold py-4 px-8 rounded-lg shadow-lg shadow-[#0099D8]/30 hover:bg-[#007AB0] hover:shadow-xl hover:shadow-[#0099D8]/40 transition-all duration-300 text-center"
                >
                  Get Directions
                </a>
                <a
                  href="#services"
                  className="bg-white/10 backdrop-blur-sm border border-white/25 text-white font-bold py-4 px-8 rounded-lg hover:bg-white hover:text-[#0A2240] transition-all duration-300 text-center"
                >
                  Our Services
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all duration-500 ${
                index === currentSlide
                  ? "w-10 h-3 bg-[#0099D8]"
                  : "w-3 h-3 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 right-8 z-20 hidden md:flex flex-col items-center gap-2 text-white/50">
          <span className="text-xs tracking-widest uppercase" style={{ writingMode: "vertical-rl" }}>
            Scroll
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ────────────────── STATS BAR ────────────────── */}
      <section className="relative -mt-1 z-20">
        <div className="max-w-5xl mx-auto px-6">
          <div
            className="bg-gradient-to-r from-[#0A2240] to-[#0F2D52] rounded-2xl shadow-2xl grid grid-cols-2 md:grid-cols-4"
            ref={addSectionRef(0)}
          >
            {stats.map((stat, i) => (
              <div key={i} className="stat-item py-6 md:py-8">
                <div className="text-3xl md:text-4xl font-black text-[#0099D8] mb-1">{stat.number}</div>
                <div className="text-white/60 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────── ABOUT US ────────────────── */}
      <section
        id="about"
        className="py-24 md:py-32 px-6 bg-white section-hidden"
        ref={addSectionRef(1)}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text Side */}
            <div>
              <span className="text-[#0099D8] font-bold tracking-wider text-sm uppercase">
                Who We Are
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-[#0A2240] mt-3 mb-6 leading-tight">
                Your Trusted Energy Partner Since Day One
              </h2>
              <div className="section-divider mb-8" />
              <p className="text-[#555770] text-lg leading-relaxed mb-6">
                <strong className="text-[#0A2240]">Goyal Filling Station</strong> is a proud authorized
                franchise of <strong className="text-[#0099D8]">Nayara Energy</strong>, one of India&apos;s
                leading private-sector petroleum companies. Backed by the world-class Vadinar refinery
                — India&apos;s second-largest single-site refinery — we deliver fuel that meets the highest
                international quality standards.
              </p>
              <p className="text-[#555770] text-lg leading-relaxed mb-8">
                Our commitment goes beyond fuel. We believe in building lasting relationships with our
                community through transparent operations, fair pricing, and a customer-first approach
                that has earned us the trust of thousands of travelers and fleet operators.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-3 mb-8">
                {["ISO Certified", "100% Pure Fuel", "Digital Ready", "Eco-Friendly"].map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#0099D8]/10 text-[#0099D8] text-sm font-semibold px-4 py-2 rounded-full border border-[#0099D8]/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-[#0A2240] text-white font-bold py-3.5 px-8 rounded-lg hover:bg-[#0099D8] transition-all duration-300 shadow-lg"
              >
                Learn More
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>

            {/* Image Side */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <Image
                  src="/images/gallery1.png"
                  alt="Goyal Filling Station"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* Floating accent card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-5 shadow-xl border border-gray-100 hidden md:flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#0099D8] to-[#00B4A0] rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[#0A2240] font-bold text-lg">Certified Quality</div>
                  <div className="text-[#8E90A6] text-sm">Nayara Energy Standard</div>
                </div>
              </div>
              {/* Decorative element */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#0099D8]/10 rounded-2xl -z-10 hidden md:block" />
              <div className="absolute -bottom-4 right-8 w-16 h-16 bg-[#00B4A0]/10 rounded-full -z-10 hidden md:block" />
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── SERVICES ────────────────── */}
      <section
        id="services"
        className="py-24 md:py-32 px-6 bg-[#F5F7FA] section-hidden"
        ref={addSectionRef(2)}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#0099D8] font-bold tracking-wider text-sm uppercase">
              What We Offer
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0A2240] mt-3 mb-4">
              Premium Amenities For A Better Stop
            </h2>
            <div className="section-divider mx-auto" />
            <p className="text-[#555770] mt-6 text-lg">
              We go beyond fuel to provide a complete, comfortable experience for every driver and passenger.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <div key={i} className="service-card group">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0099D8]/10 to-[#00B4A0]/10 rounded-xl flex items-center justify-center text-[#0099D8] mb-6 group-hover:bg-gradient-to-br group-hover:from-[#0099D8] group-hover:to-[#00B4A0] group-hover:text-white transition-all duration-500">
                  {service.icon}
                </div>
                <h4 className="text-xl font-bold text-[#0A2240] mb-3">{service.title}</h4>
                <p className="text-[#555770] leading-relaxed text-[15px]">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────── GALLERY ────────────────── */}
      <section
        id="gallery"
        className="py-24 md:py-32 px-6 bg-white section-hidden"
        ref={addSectionRef(3)}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[#0099D8] font-bold tracking-wider text-sm uppercase">
              Our Gallery
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0A2240] mt-3 mb-4">
              A Glimpse of Our Station
            </h2>
            <div className="section-divider mx-auto" />
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center flex-wrap gap-3 mb-12">
            {galleryCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setGalleryFilter(cat);
                  setLightboxIndex(null);
                }}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  galleryFilter === cat
                    ? "bg-[#0099D8] text-white shadow-lg shadow-[#0099D8]/25"
                    : "bg-[#F5F7FA] text-[#555770] hover:bg-[#0099D8]/10 hover:text-[#0099D8]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((img, i) => (
              <div
                key={`${img.src}-${i}`}
                className="gallery-item"
                onClick={() => setLightboxIndex(i)}
              >
                <Image
                  src={img.src}
                  alt={img.caption}
                  width={600}
                  height={450}
                  className="w-full h-full object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="gallery-item-overlay">
                  <div>
                    <p className="text-white font-bold text-lg">{img.caption}</p>
                    <p className="text-white/60 text-sm">{img.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Hint text */}
          <p className="text-center text-[#8E90A6] text-sm mt-8">
            Click on any image to view in full screen • Use arrow keys to navigate
          </p>
        </div>
      </section>

      {/* ────────────────── LIGHTBOX ────────────────── */}
      {lightboxIndex !== null && (
        <div className="lightbox-overlay" onClick={() => setLightboxIndex(null)}>
          <button className="lightbox-close" onClick={() => setLightboxIndex(null)} aria-label="Close">
            ✕
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <Image
              src={filteredGallery[lightboxIndex].src}
              alt={filteredGallery[lightboxIndex].caption}
              width={1200}
              height={800}
              className="rounded-xl"
              sizes="90vw"
            />
            <div className="text-center mt-4">
              <p className="text-white font-semibold text-lg">
                {filteredGallery[lightboxIndex].caption}
              </p>
              <p className="text-white/50 text-sm mt-1">
                {lightboxIndex + 1} / {filteredGallery.length}
              </p>
            </div>
            <button
              className="lightbox-btn prev"
              onClick={() =>
                setLightboxIndex(
                  (lightboxIndex - 1 + filteredGallery.length) % filteredGallery.length
                )
              }
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              className="lightbox-btn next"
              onClick={() =>
                setLightboxIndex((lightboxIndex + 1) % filteredGallery.length)
              }
              aria-label="Next"
            >
              ›
            </button>
          </div>
        </div>
      )}



      {/* ────────────────── OFFERS ────────────────── */}
      <section
        id="offers"
        className="py-24 md:py-32 px-6 bg-white section-hidden"
        ref={addSectionRef(5)}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#0099D8] font-bold tracking-wider text-sm uppercase">
              Promotions
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0A2240] mt-3 mb-4">
              Current Offers & Schemes
            </h2>
            <div className="section-divider mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offers.length > 0 ? (
              offers.map((offer) => (
                <div key={offer.id} className="offer-card group">
                  <div className="h-52 bg-gradient-to-br from-[#0A2240] to-[#0099D8] relative flex items-center justify-center overflow-hidden">
                    {offer.image_url ? (
                      <Image src={offer.image_url} alt={offer.title} fill className="object-cover opacity-60 group-hover:opacity-40 transition-opacity" unoptimized />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-[#0099D8] opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                        <span className="text-6xl group-hover:scale-110 transition-transform duration-500">🎉</span>
                      </>
                    )}
                    <div className="absolute top-4 right-4 bg-[#00B4A0] text-white text-xs font-bold px-3 py-1 rounded-full shadow uppercase tracking-wide animate-pulse-glow">
                      Active
                    </div>
                  </div>
                  <div className="p-8 flex flex-col">
                    <h4 className="text-xl font-bold text-[#0A2240] mb-3">
                      {offer.title}
                    </h4>
                    <p className="text-[#555770] mb-6 text-[15px] leading-relaxed line-clamp-3">
                      {offer.description}
                    </p>
                    <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-auto">
                      <span className="text-xs text-[#8E90A6] font-semibold">
                        {offer.end_date ? `Valid till: ${new Date(offer.end_date).toLocaleDateString()}` : 'Limited Time'}
                      </span>
                      <a 
                        href={`https://wa.me/919814830869?text=Hi, I'm interested in your offer: ${encodeURIComponent(offer.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#25D366] text-white p-2 rounded-full hover:bg-[#128C7E] transition-colors shadow-sm flex items-center justify-center"
                        title="Inquire on WhatsApp"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-10 text-gray-500">
                No active offers at the moment. Check back soon!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ────────────────── CONTACT US ────────────────── */}
      <section
        id="contact"
        className="py-24 md:py-32 px-6 bg-[#F5F7FA] section-hidden"
        ref={addSectionRef(6)}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#0099D8] font-bold tracking-wider text-sm uppercase">
              Get In Touch
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0A2240] mt-3 mb-4">
              Contact Us
            </h2>
            <div className="section-divider mx-auto" />
            <p className="text-[#555770] mt-6 text-lg">
              Have questions, feedback, or need directions? We&apos;d love to hear from you.
            </p>
          </div>

          <div className="flex flex-col gap-10">
            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Info Cards */}
              {[
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  ),
                  label: "Address",
                  value: "Guddardhandi Road, Ferozepur\nGuru Har Sahai, Punjab 152022",
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  ),
                  label: "Phone",
                  value: "098148 30869",
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  label: "Working Hours",
                  value: "Open Daily: 6:00 AM — 11:00 PM",
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  ),
                  label: "Email",
                  value: "info@goyalfilling.com",
                },
              ].map((info, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-5 flex items-start gap-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#0099D8]/20 transition-all"
                >
                  <div className="w-12 h-12 bg-[#0099D8]/10 rounded-xl flex items-center justify-center text-[#0099D8] shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#8E90A6] uppercase tracking-wide mb-1">
                      {info.label}
                    </div>
                    <div className="text-[#0A2240] font-medium whitespace-pre-line">{info.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Google Map */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 h-[400px]">
              <iframe
                title="Google Maps"
                src="https://maps.google.com/maps?q=Goyal+Filling+Station,+Guddardhandi+Road,+Guru+Har+Sahai&hl=en&z=15&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── FOOTER ────────────────── */}
      <footer className="bg-[#0A2240] text-white pt-20 pb-6 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Top CTA Strip */}
          <div className="bg-gradient-to-r from-[#0099D8] to-[#00B4A0] rounded-2xl p-8 md:p-12 -mt-32 mb-16 relative z-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Ready to Fuel Up?
              </h3>
              <p className="text-white/80 text-lg">
                Visit Goyal Filling Station today and experience the difference.
              </p>
            </div>
            <a
              href="#contact"
              className="bg-white text-[#0A2240] font-bold py-3.5 px-8 rounded-lg hover:bg-[#0A2240] hover:text-white transition-all duration-300 shadow-lg shrink-0"
            >
              Get Directions →
            </a>
          </div>

          {/* Footer Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand Column */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white rounded-lg p-1.5">
                  <Image
                    src="/images/nayara_logo.jpg"
                    alt="Nayara Energy Logo"
                    width={90}
                    height={30}
                    className="mix-blend-multiply"
                    unoptimized
                  />
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Goyal Filling Station is committed to providing the highest quality fuels and exceptional customer service. Authorized franchise of Nayara Energy.
              </p>
              {/* Social Icons */}
              <div className="flex gap-3">
                {[
                  { name: "facebook", url: "https://www.facebook.com/EssarGoyal" },
                  { name: "instagram", url: "https://www.instagram.com/goyal_fillingstation_ghs" }
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white/60 hover:bg-[#0099D8] hover:text-white transition-all duration-300"
                    aria-label={social.name}
                  >
                    {social.name === "facebook" && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    )}
                    {social.name === "instagram" && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Quick Links</h4>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-[#0099D8] transition-colors text-sm flex items-center gap-2"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Contact Info</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="flex items-start gap-3">
                  <span className="text-[#0099D8] mt-0.5">📍</span>
                  <a href="https://maps.app.goo.gl/YFNd3aFtWUAdTLZQ8" target="_blank" rel="noopener noreferrer" className="hover:text-[#0099D8] transition-colors cursor-pointer">
                    Guddardhandi Road, Ferozepur<br />Guru Har Sahai, Punjab 152022
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#0099D8]">📞</span>
                  <span>098148 30869</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#0099D8]">✉️</span>
                  <span>info@goyalfilling.com</span>
                </li>
                <li className="flex items-center gap-3 text-[#0099D8] font-semibold">
                  <span>🕒</span>
                  <span>Open Daily: 6:00 AM — 11:00 PM</span>
                </li>
              </ul>
            </div>

            {/* Nayara Energy */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Nayara Energy</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <a href="https://www.nayaraenergy.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#0099D8] transition-colors flex items-center gap-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    Official Website
                  </a>
                </li>
                <li>
                  <a href="https://www.nayaraenergy.com/our-operations/retail" target="_blank" rel="noopener noreferrer" className="hover:text-[#0099D8] transition-colors flex items-center gap-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    Retail Operations
                  </a>
                </li>
                <li>
                  <a href="https://www.nayaraenergy.com/media/gallery" target="_blank" rel="noopener noreferrer" className="hover:text-[#0099D8] transition-colors flex items-center gap-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    Media Gallery
                  </a>
                </li>
                <li>
                  <a href="https://www.nayaraenergy.com/careers" target="_blank" rel="noopener noreferrer" className="hover:text-[#0099D8] transition-colors flex items-center gap-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    Careers
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright Bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
            <p>
              © {new Date().getFullYear()} Goyal Filling Station — Authorised Franchisee of Nayara
              Energy. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Disclaimer</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
