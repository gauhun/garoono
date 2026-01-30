"use client";
"use client";

import { motion } from "framer-motion";
import HireModal from "./components/HireModal";
import { useState, useRef, useEffect } from "react";
import { getAssetPath } from "../utils/assetPath";
import { getReviewImages } from "../utils/getReviewImages";
import Image from "next/image";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
    },
  },
};
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const projects = [
  {
    id: 1,
    title: "Apna RSS",
    shortDesc:
      "A platform raising awareness about RSS's role in nation-building.",
    fullDesc:
      "Apna RSS has been established with the primary objective of raising awareness among the populace about the vital role that the राष्ट्रीय स्वयंसेवक संघ Sangh (RSS) plays in shaping our nation's trajectory. Serving as the backbone of Aryavrata, the ancient name for our great nation, Apna RSS endeavors to elucidate the multifaceted contributions of the RSS in fostering the growth and unity of our diverse society.",
    playStoreLink:
      "https://play.google.com/store/apps/details?id=com.garoono.apnarss",
    tags: ["Flutter", "Education", "Community"],
    type: "Personal App",
  },
  {
    id: 2,
    title: "Bhakti Dhun",
    shortDesc:
      "A comprehensive devotional app featuring bhajans, aartis, and spiritual content.",
    fullDesc:
      "भक्ति धुन सनातन में आपका स्वागत है, जहां आपको भगवान के भजनों, आरतियों, चालीसाओं और अन्य आध्यात्मिक गीतों का विस्तृत संग्रह मिलेगा। यह ऐप पूरी तरह से स्वतंत्र है और हर भक्त के लिए विशेष रूप से तैयार किया गया है।",
    playStoreLink:
      "https://play.google.com/store/apps/details?id=com.garoono.bhaktidhunsanatan",
    tags: ["Flutter", "Music", "Spiritual"],
    type: "Personal App",
  },
  {
    id: 3,
    title: "SASAI",
    shortDesc:
      "A fintech application for South Africa with digital payments and community features.",
    fullDesc:
      "Developing by Kellton for South Africa company, SASAI is a fintech application akin to Paytm, offering digital payments and financial management. Unique to SASAI is its integrated community platform, enabling users to engage and earn rewards.",
    tags: ["Flutter", "Fintech", "Payments"],
    client: "Kellton",
  },
  {
    id: 4,
    title: "Canara HSBC Life App",
    shortDesc: "Comprehensive insurance services app with 100K+ downloads.",
    fullDesc:
      "This application combines Canara HSBC all services buying journey, its a master app. Over 100K play store downloads user. Available on three platforms (Android, iOS, Web).",
    playStoreLink:
      "https://play.google.com/store/apps/details?id=com.choiceapp.genius",
    tags: ["Flutter", "Insurance", "Multi-platform"],
    downloads: "100K+",
    client: "Kellton",
  },
  {
    id: 5,
    title: "IndoRakshak",
    shortDesc:
      "Temperature tracking and monitoring system with hardware integration.",
    fullDesc:
      "Track person temperature as soon reach office door, capture picture integrated together with hardware, live sync using bluetooth, alert manager if got high temperature, with uploading pictures on drive, alert will be delivered on mail. (Solo developer)",
    tags: ["Flutter", "IoT", "Hardware"],
    type: "Solo Project",
  },
  {
    id: 6,
    title: "AirWatch",
    shortDesc: "IoT device data monitoring and WiFi management system.",
    fullDesc:
      "Show data coming from IoT device via a local network wifi, store wifi and connect automatically in future, show live data coming from device. (Solo developer)",
    tags: ["Flutter", "IoT", "Networking"],
    type: "Solo Project",
  },
  {
    id: 7,
    title: "Logytrack",
    shortDesc: "Driver location tracking and fleet management application.",
    fullDesc:
      "Driver location tracking application, History of tracking, Live, Company all personnel can be looked at with a single application with live color coding (active, stop, moving), selection based searching, graphical data representation.",
    tags: ["Flutter", "Location", "Analytics"],
  },
  {
    id: 8,
    title: "MindSage",
    shortDesc: "Course-based learning platform with subscription plans.",
    fullDesc:
      "Course based app, where user can get any of three plan (silver, gold platinum) and enjoy different courses and content. (Lead 2 developer here on this project)",
    tags: ["Flutter", "Education", "Subscription"],
  },
  {
    id: 9,
    title: "Flutter Fusion UI Kit",
    shortDesc: "Comprehensive UI template available on CodeCanyon.",
    fullDesc:
      "I have made this template for personal use afterwards I realised this can be helpful for others as well. So, I decided to make it available on code canyon.",
    link: "https://codecanyon.net/item/flutter-fusion/54039287",
    tags: ["Flutter", "UI Kit", "Template"],
    type: "Personal Project",
  },
];

// Add this interface before the ProjectCard component
interface Project {
  id: number;
  title: string;
  shortDesc: string;
  fullDesc: string;
  playStoreLink?: string;
  link?: string;
  tags: string[];
  downloads?: string;
  client?: string;
  type?: string;
}

// Add this array at the top level with your other constants
const techLogos = [
  { name: "GitHub", icon: getAssetPath("/logos/github.png") },
  { name: "Firebase", icon: getAssetPath("/logos/firebase.png") },
  { name: "Flutter", icon: getAssetPath("/logos/flutter.png") },
  // { name: "Dart", icon: getAssetPath("/logos/dart.png") },
  // { name: "Zeplin", icon: getAssetPath("/logos/zeplin.png") },
  // { name: "Figma", icon: getAssetPath("/logos/figma.png") },
  // { name: "YouTube", icon: getAssetPath("/logos/youtube.png") },
  // { name: "Node.js", icon: getAssetPath("/logos/nodejs.png") },
  { name: "Bhakti Dhun", icon: getAssetPath("/logos/bhakti_dhun_logo.png") },
  { name: "FocusOn", icon: getAssetPath("/logos/focuson_icon.png") },
  { name: "HabiTide", icon: getAssetPath("/logos/habitide_logo.png") },
  { name: "Apna RSS", icon: getAssetPath("/logos/rss_transparent.png") },
  { name: "XLSheet Ai", icon: getAssetPath("/logos/app_logo_compressed.png") },
];



function ProjectCard({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        whileHover={{
          y: -5,
          boxShadow: "0 0 25px rgba(239, 68, 68, 0.4)",
          borderColor: "rgba(239, 68, 68, 0.8)",
        }}
        className="bg-[#0A0A0A] rounded-sm p-6 border border-gray-800 relative group transition-all duration-300 h-full flex flex-col"
      >
        {/* Tech Decor Elements */}
        <div className="absolute top-2 left-2 w-2 h-2 bg-red-500/50 rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-2 right-2 w-2 h-2 bg-red-500/50 rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-2 left-2 w-2 h-2 bg-red-500/50 rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-2 right-2 w-2 h-2 bg-red-500/50 rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />

        <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-start justify-between mb-4 relative z-10">
          <h3 className="text-lg font-bold text-white font-gaming leading-tight group-hover:text-red-400 transition-colors">
            {project.title}
          </h3>
          {project.downloads && (
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-gray-500 font-gaming uppercase">Score</span>
              <span className="text-xs text-red-500 font-gaming">
                {project.downloads.replace('+', '')} XP
              </span>
            </div>
          )}
        </div>

        {/* Tags as Inventory Items */}
        <div className="flex flex-wrap gap-2 mb-4 relative z-10">
          {project.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="bg-gray-900 text-gray-300 border border-gray-700 px-2 py-1 text-[10px] font-gaming uppercase tracking-wider hover:border-red-500 hover:text-red-400 transition-colors cursor-default"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Description */}
        <div className="relative z-10 flex-grow">
          <p className="text-gray-400 text-sm mb-4 font-mono leading-relaxed">
            {expanded ? project.fullDesc : project.shortDesc}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 items-center mt-auto pt-4 border-t border-gray-800 relative z-10">
          {project.playStoreLink && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={project.playStoreLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-500 text-white px-3 py-1.5 text-xs font-gaming uppercase tracking-wider hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
            >
              Play
            </motion.a>
          )}

          {project.link && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 text-white px-3 py-1.5 text-xs font-gaming uppercase tracking-wider hover:bg-gray-700 transition-colors border border-gray-700"
            >
              View
            </motion.a>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-auto text-[10px] font-gaming uppercase text-gray-500 hover:text-white transition-colors"
          >
            {expanded ? "[-] Minimize" : "[+] Expand"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ReviewsSection() {
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const reviewImages = getReviewImages();
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [isLongPress, setIsLongPress] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout>();
  const SCROLL_SPEED = 0.7;

  useEffect(() => {
    const loadImages = async () => {
      const images = reviewImages.map((imagePath: string) => {
        const img = document.createElement("img");
        img.src = getAssetPath(imagePath);
        return new Promise((resolve) => {
          img.onload = () => resolve(imagePath);
        });
      });

      const loadedPaths = (await Promise.all(images)) as string[];
      setLoadedImages([...loadedPaths, ...loadedPaths, ...loadedPaths]);
    };

    loadImages();
  }, [reviewImages]);

  useEffect(() => {
    if (
      !scrollRef.current ||
      loadedImages.length === 0 ||
      isMouseOver ||
      isLongPress
    )
      return;

    const scrollContainer = scrollRef.current;
    let scrollPos = scrollContainer.scrollLeft;
    let animationFrameId: number;

    const scroll = () => {
      scrollPos += SCROLL_SPEED;
      if (scrollPos >= scrollContainer.scrollWidth / 3) {
        scrollPos = 0;
      }
      scrollContainer.scrollLeft = scrollPos;
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [loadedImages, isMouseOver, isLongPress]);

  // Handle long press start
  const handleTouchStart = () => {
    setIsMouseOver(true);
    longPressTimer.current = setTimeout(() => {
      setIsLongPress(true);
    }, 200); // 200ms threshold for long press
  };

  // Handle touch end/cancel
  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    setIsMouseOver(false);
    setIsLongPress(false);
  };

  return (
    <section id="reviews" className="py-20 bg-[#0A0A0A] relative z-20">
      <div className="max-w-7xl mx-auto px-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-12 justify-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white font-gaming glitch text-center" data-text="LEVEL 4: PLAYER FEEDBACK">
            LEVEL 4: PLAYER FEEDBACK
          </h2>
        </motion.div>

        <div className="relative p-1 bg-gradient-to-r from-red-500/20 via-transparent to-red-500/20 rounded-lg">
          {/* Decor corners */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500 z-10" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-500 z-10" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-500 z-10" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500 z-10" />

          <div className="relative overflow-hidden bg-[#111] rounded-md border border-gray-800">
            {/* Scanline overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent opacity-20 pointer-events-none z-20" style={{ backgroundSize: '100% 3px' }} />

            <div
              ref={scrollRef}
              onMouseEnter={() => setIsMouseOver(true)}
              onMouseLeave={() => setIsMouseOver(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
              className="flex gap-4 overflow-x-hidden whitespace-nowrap py-8"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {loadedImages.map((src, index) => (
                <motion.div
                  key={index}
                  className="inline-block flex-shrink-0 w-[280px] md:w-[350px] relative group"
                  whileHover={{ scale: 1.02, zIndex: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-[#1A1A1A] p-2 rounded border border-gray-700 group-hover:border-red-500 transition-colors shadow-lg">
                    <div className="flex items-center gap-2 mb-2 border-b border-gray-800 pb-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] font-mono text-gray-400 uppercase">Incoming Transmission...</span>
                    </div>
                    <Image
                      src={getAssetPath(src)}
                      alt={`Review ${index + 1}`}
                      width={350}
                      height={200}
                      className="rounded opacity-80 group-hover:opacity-100 transition-opacity"
                      style={{ width: "100%", height: "auto" }}
                      draggable={false}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Add this new component before your Home component
function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 z-50"
      style={{ display: isVisible ? "block" : "none" }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </motion.button>
  );
}

// Add this new component for mobile menu
function MobileMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : "100%" }}
      transition={{ duration: 0.3 }}
      className={`fixed inset-0 bg-black/95 z-50 ${isOpen ? "block" : "hidden"
        }`}
    >
      <div className="flex flex-col items-center justify-center h-full gap-8">
        <button onClick={onClose} className="absolute top-6 right-6 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <a
          href="#home"
          onClick={onClose}
          className="text-2xl text-white hover:text-red-500"
        >
          Home
        </a>
        <a
          href="#projects"
          onClick={onClose}
          className="text-2xl text-white hover:text-red-500"
        >
          Projects
        </a>
        <a
          href="#experience"
          onClick={onClose}
          className="text-2xl text-white hover:text-red-500"
        >
          Experience
        </a>
        <a
          href="#reviews"
          onClick={onClose}
          className="text-2xl text-white hover:text-red-500"
        >
          Reviews
        </a>
        <a
          href="#education"
          onClick={onClose}
          className="text-2xl text-white hover:text-red-500"
        >
          Education
        </a>
      </div>
    </motion.div>
  );
}


function GameCard({ children, title, color }: { children: React.ReactNode; title: string; color: string; }) {
  return (
    <div className="relative overflow-hidden group">
      <div className="flex items-center relative z-10 mb-2">
        <span className={`flex items-center ${color} font-bold text-lg`}>
          {title}
        </span>
      </div>
      <div className="space-y-3 relative z-10">{children}</div>
    </div>
  );
}

import "@fontsource/press-start-2p";

interface GameListItemProps {
  name: string;
  link: string;
  stat: string;
  tag?: string;
  color: string;
  logo?: string;
}

function GameListItem({ name, link, stat, tag, color, logo }: GameListItemProps) {
  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 py-1 px-0 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer"
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-2">
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          whileHover={{ opacity: 1, x: 0 }}
          className={`${color} font-bold text-[10px]`}
        >
          ►
        </motion.span>
        {logo && (
          <Image
            src={getAssetPath(logo)}
            alt={name}
            width={20}
            height={20}
            className="rounded-[4px]"
          />
        )}
        <span
          className="text-gray-300 group-hover:text-white transition-colors text-xs"
          style={{ fontFamily: '"Press Start 2P", system-ui' }}
        >
          {name}
        </span>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        {tag && (
          <span className="bg-red-500/20 text-red-500 text-[8px] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">
            {tag}
          </span>
        )}
        <span className="text-gray-500 text-[10px] font-mono group-hover:text-gray-300">
          {stat}
        </span>
      </div>
    </motion.a>
  );
}

export default function Home() {
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-[#0A0A0A] relative min-h-screen">
      <div className="cyber-grid" />
      {/* Navigation */}
      <nav className="fixed w-full bg-[#0A0A0A]/90 backdrop-blur-md z-50 border-b border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.div
            className="text-xl font-bold text-white flex items-center gap-3 font-gaming"
            whileHover={{ textShadow: "0 0 8px rgba(255,255,255,0.5)" }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 blur-md opacity-50 rounded-full"></div>
              <Image
                src={getAssetPath("/logos/circle_garoono_logo.png")}
                alt="Garoono Logo"
                width={40}
                height={40}
                className="rounded-full border-2 border-red-500 relative z-10"
              />
            </div>
            <span className="tracking-tighter">GAROONO</span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 text-gray-300 font-gaming text-xs tracking-wider">
            {["Home", "Projects", "Experience", "Reviews", "Education"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="relative group hover:text-red-400 transition-colors uppercase"
              >
                <span className="group-hover:hidden">{item}</span>
                <span className="hidden group-hover:block glitch" data-text={item}>{item}</span>
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-red-500 group-hover:w-full transition-all duration-300 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <motion.a
              href="https://www.linkedin.com/in/gauhun/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-1.5 rounded-sm hover:bg-red-500 hover:text-white transition-all text-[10px] font-gaming uppercase tracking-wide shadow-[0_0_10px_rgba(239,68,68,0.2)] hover:shadow-[0_0_15px_rgba(239,68,68,0.6)]"
            >
              Let&apos;s Talk
            </motion.a>
            <button
              className="text-white hover:text-red-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>

          {/* Desktop Let's Talk Button */}
          <motion.a
            href="https://www.linkedin.com/in/gauhun/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:block bg-red-500/10 border border-red-500 text-red-500 px-6 py-2 rounded-sm hover:bg-red-500 hover:text-white transition-all font-gaming text-xs uppercase tracking-wide shadow-[0_0_10px_rgba(239,68,68,0.2)] hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]"
          >
            Let&apos;s Talk
          </motion.a>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Hero Section - Make it responsive */}
      <section
        id="home"
        className="min-h-screen pt-32 px-4 sm:px-6 lg:px-8 bg-[#0A0A0A] text-white"
      >
        <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-8">
          <div className="w-full md:max-w-3xl h-auto md:h-[600px] flex items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="w-full pl-0 md:pl-8 text-center md:text-left"
            >
              {/* Popular List Section */}
              <motion.div
                variants={itemVariants}
                className="mt-12 mb-8 p-4 bg-[#1A1A1A] rounded-xl border border-gray-800 relative group"
                whileHover={{
                  boxShadow: "0 0 25px rgba(239, 68, 68, 0.6)",
                  borderColor: "rgba(239, 68, 68, 0.9)",
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/10 opacity-50 rounded-xl" />
                {/* Corner banner for "Popular" */}
                <span
                  className="absolute top-0 right-0"
                  style={{
                    transform: "translate(35%, -35%) rotate(45deg)",
                    zIndex: 20,
                  }}
                >
                  <motion.a
                    href="https://linktr.ee/garoono"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileTap={{ scale: 0.92 }}
                    whileHover={{ scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="bg-red-500 text-white px-6 py-1 shadow-lg text-xs font-bold tracking-wider rounded-md cursor-pointer focus:outline-none"
                    style={{
                      boxShadow: "0 2px 8px rgba(239,68,68,0.15)",
                      display: "inline-block",
                      minWidth: "80px",
                      textAlign: "center",
                      letterSpacing: "0.05em",
                    }}
                  >
                    All Apps
                  </motion.a>
                </span>{" "}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                  {/* Finance Card */}
                  <GameCard
                    title="Finance"
                    color="text-green-400"
                  >
                    <GameListItem
                      name="XlSheet Ai"
                      link="http://linktr.ee/xlsheetai"
                      stat="1.5k+"

                      color="text-green-400"
                      logo="/logos/app_logo_compressed.png"
                    />
                  </GameCard>

                  {/* Productivity Card */}
                  <GameCard
                    title="Productivity"
                    color="text-blue-400"
                  >
                    <GameListItem
                      name="HabiTide"
                      link="https://habitide.in"
                      stat="3K+"
                      color="text-blue-400"
                      logo="/logos/habitide_logo.png"
                    />
                    <GameListItem
                      name="FocusOn"
                      link="https://play.google.com/store/apps/details?id=in.garoono.focuson"
                      stat="1.4k+"
                      color="text-blue-400"
                      logo="/logos/focuson_icon.png"
                    />
                  </GameCard>

                  {/* Regional Card */}
                  <GameCard
                    title="Regional"
                    color="text-amber-500"
                  >
                    <GameListItem
                      name="Apna RSS"
                      link="https://play.google.com/store/apps/details?id=com.garoono.apnarss"
                      stat="15K+"
                      color="text-amber-500"
                      logo="/logos/rss_transparent.png"
                    />
                    <GameListItem
                      name="BhaktiDhun"
                      link="https://play.google.com/store/apps/details?id=com.garoono.bhaktidhunsanatan"
                      stat="2k+"
                      color="text-amber-500"
                      logo="/logos/bhakti_dhun_logo.png"
                    />
                  </GameCard>
                </div>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-4xl md:text-6xl font-bold mb-4 font-gaming tracking-tight"
              >
                <span className="text-red-500 glitch block" data-text="HELLO, SYSTEM">HELLO, SYSTEM</span>
                <span className="text-2xl md:text-4xl block mt-2">I&apos;M GAUTAM</span>
              </motion.h1>
              <motion.h2
                variants={itemVariants}
                className="text-xl md:text-2xl font-bold mb-2 font-mono text-green-400 tracking-widest uppercase"
              >
                &gt; Senior Flutter Developer_
              </motion.h2>
              <motion.h3
                variants={itemVariants}
                className="text-2xl md:text-4xl font-bold mb-4"
              >
                Indie App Developer
              </motion.h3>
              <motion.p
                variants={itemVariants}
                className="text-gray-400 mb-8 max-w-lg mx-auto md:mx-0"
              >
                A Passionate Flutter Developer With More than 5 Years Of
                Experience Who Is Always Excited To Work With You To Creating
                Wonderful Applications!
              </motion.p>
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
              >
                <button
                  onClick={() => setIsHireModalOpen(true)}
                  className="w-full sm:w-auto bg-red-500 text-white px-8 py-3 rounded-full hover:bg-red-600 transition-colors"
                >
                  Hire Me
                </button>
                <a
                  href="https://drive.google.com/file/d/1ttdiSLCrXMSM-LGok-tMgGLb51SxBfe7/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto border border-gray-600 text-white px-8 py-3 rounded-full flex items-center justify-center gap-2 hover:border-gray-500 transition-colors"
                >
                  Download CV <span>→</span>
                </a>
              </motion.div>
            </motion.div>
          </div>

          {/* Tech Circle - Make it responsive */}
          <div className="relative h-[300px] md:h-[600px] flex items-center justify-center w-full md:w-auto">
            <div className="bg-[#0A0A0A] w-[250px] h-[250px] md:w-[400px] md:h-[400px] rounded-full overflow-hidden border-4 border-red-500 flex items-center justify-center relative">
              {/* Enhanced gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 via-red-500/10 to-transparent" />
              {/* Multiple blur layers for better effect */}
              <div className="absolute inset-0 bg-red-500/10 blur-[40px]" />
              <div className="absolute inset-0 bg-red-500/5 blur-[80px]" />
              {/* Add a subtle inner shadow */}
              <div className="absolute inset-0 shadow-inner" />

              {/* Floating logos */}
              {techLogos.map((logo, index) => (
                <motion.img
                  key={logo.name}
                  src={logo.icon}
                  alt={logo.name}
                  className="w-12 h-12 absolute"
                  initial={{
                    x: 0,
                    y: 0,
                    opacity: 0.7,
                  }}
                  animate={{
                    x: [0, Math.sin(index) * 100, 0],
                    y: [0, Math.cos(index) * 100, 0],
                    opacity: [0.7, 1, 0.7],
                    scale: [1.1, 1.5, 1.1],
                  }}
                  transition={{
                    duration: 5 + index,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section >

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-[#0A0A0A] relative z-20">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-12"
          >
            <span className="text-red-500 font-gaming text-4xl hidden md:inline-block animate-pulse">►</span>
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-white font-gaming glitch" data-text="LEVEL 2: PROJECTS">
                LEVEL 2: PROJECTS
              </h2>
              <p className="text-red-500 font-mono mt-1 tracking-widest uppercase text-sm">Select Your Mission</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section - Quest Log */}
      <section
        id="experience"
        className="py-20 md:py-32 bg-[#0A0A0A] px-4 sm:px-6 lg:px-8 relative z-20"
      >
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-16 justify-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white font-gaming glitch text-center" data-text="LEVEL 3: QUEST LOG">
              LEVEL 3: QUEST LOG
            </h2>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-[19px] top-[20px] bottom-0 w-[2px] bg-red-800/50 hidden md:block"></div>

            <div className="space-y-12">
              <motion.div {...fadeIn} className="relative pl-0 md:pl-16 group">
                <div className="hidden md:flex absolute left-0 top-1.5 w-10 h-10 bg-[#0A0A0A] border-2 border-red-500 rounded-sm items-center justify-center z-10 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                  <div className="w-3 h-3 bg-red-500 rounded-sm animate-pulse"></div>
                </div>

                <div className="bg-[#111] p-6 rounded-sm border-l-4 border-red-500 relative overflow-hidden hover:bg-[#161616] transition-colors">
                  <div className="absolute top-0 right-0 bg-red-500/20 text-red-500 text-[10px] font-gaming px-2 py-1 rounded-bl-sm uppercase">
                    Current Mission
                  </div>

                  <h3 className="text-xl font-bold text-white font-gaming mb-1 text-red-400">
                    Senior Software Engineer
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm font-mono text-gray-500 mb-4">
                    <span className="text-gray-300">@ Kellton Tech</span>
                    <span>|</span>
                    <span>June 2022 - Present</span>
                    <span>|</span>
                    <span>Gurugram</span>
                  </div>

                  <ul className="space-y-2">
                    {[
                      "Delivered 3 cross-platform projects (Android/iOS/Web)",
                      "Client Handling: SASAI & Canara HSBC",
                      "Team Lead: 2 Developers",
                      "Achievement: Quick Response Time +30%"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-400 text-sm hover:text-white transition-colors">
                        <span className="text-red-500 mt-1">►</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              <motion.div {...fadeIn} className="relative pl-0 md:pl-16 group">
                <div className="hidden md:flex absolute left-0 top-1.5 w-10 h-10 bg-[#0A0A0A] border-2 border-gray-700 rounded-sm items-center justify-center z-10 group-hover:border-red-500 transition-colors">
                  <div className="w-3 h-3 bg-gray-700 rounded-sm group-hover:bg-red-500 transition-colors"></div>
                </div>

                <div className="bg-[#111] p-6 rounded-sm border-l-4 border-gray-700 relative overflow-hidden hover:border-red-500 transition-colors group-hover:bg-[#161616]">
                  <div className="absolute top-0 right-0 bg-green-500/20 text-green-500 text-[10px] font-gaming px-2 py-1 rounded-bl-sm uppercase opacity-70 group-hover:opacity-100">
                    Mission Complete
                  </div>

                  <h3 className="text-xl font-bold text-white font-gaming mb-1 group-hover:text-red-400 transition-colors">
                    Software Engineer
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm font-mono text-gray-500 mb-4">
                    <span className="text-gray-300">@ Enbake Consultancy</span>
                    <span>|</span>
                    <span>Nov 2020 - May 2022</span>
                    <span>|</span>
                    <span>New Delhi</span>
                  </div>
                  <ul className="space-y-2">
                    {[
                      "Enhanced user engagement by 20%",
                      "Cross-functional team collaboration",
                      "Mentored junior developers"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-400 text-sm hover:text-white transition-colors">
                        <span className="text-gray-600 group-hover:text-red-500 mt-1 transition-colors">►</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              <motion.div {...fadeIn} className="relative pl-0 md:pl-16 group">
                <div className="hidden md:flex absolute left-0 top-1.5 w-10 h-10 bg-[#0A0A0A] border-2 border-gray-700 rounded-sm items-center justify-center z-10 group-hover:border-red-500 transition-colors">
                  <div className="w-3 h-3 bg-gray-700 rounded-sm group-hover:bg-red-500 transition-colors"></div>
                </div>

                <div className="bg-[#111] p-6 rounded-sm border-l-4 border-gray-700 relative overflow-hidden hover:border-red-500 transition-colors group-hover:bg-[#161616]">
                  <div className="absolute top-0 right-0 bg-green-500/20 text-green-500 text-[10px] font-gaming px-2 py-1 rounded-bl-sm uppercase opacity-70 group-hover:opacity-100">
                    Mission Complete
                  </div>

                  <h3 className="text-xl font-bold text-white font-gaming mb-1 group-hover:text-red-400 transition-colors">
                    Software Engineer
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm font-mono text-gray-500 mb-4">
                    <span className="text-gray-300">@ GPS Gateway India</span>
                    <span>|</span>
                    <span>Jan 2020 - Nov 2020</span>
                    <span>|</span>
                    <span>New Delhi</span>
                  </div>
                  <ul className="space-y-2">
                    {[
                      "Applied theoretical knowledge to practical projects",
                      "Full lifecycle development"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-400 text-sm hover:text-white transition-colors">
                        <span className="text-gray-600 group-hover:text-red-500 mt-1 transition-colors">►</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section >

      <ReviewsSection />

      {/* Education Section */}
      <section
        id="education"
        className="py-16 bg-[#0A0A0A] px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            {...fadeIn}
            className="text-3xl font-bold mb-8 md:mb-12 text-center text-white"
          >
            Education
          </motion.h2>
          <div className="space-y-4 md:space-y-8">
            <motion.div
              {...fadeIn}
              className="bg-[#1A1A1A] p-6 rounded-lg border border-gray-800"
            >
              <h3 className="text-xl font-bold text-white">
                Bachelor of Computer Applications (BCA)
              </h3>
              <p className="text-gray-400">
                Indira Gandhi National University, New Delhi
              </p>
              <p className="text-gray-400">2020-2023 | 67%</p>
            </motion.div>
            <motion.div
              {...fadeIn}
              className="bg-[#1A1A1A] p-6 rounded-lg border border-gray-800"
            >
              <h3 className="text-xl font-bold text-white">
                Diploma in Computer Engineering
              </h3>
              <p className="text-gray-400">
                Ambedkar Institute Of Technology, New Delhi
              </p>
              <p className="text-gray-400">2017-2020 | 76%</p>
            </motion.div>
          </div>
        </div>
      </section>

      <HireModal
        isOpen={isHireModalOpen}
        onClose={() => setIsHireModalOpen(false)}
      />

      <ScrollToTopButton />
    </div >
  );
}
