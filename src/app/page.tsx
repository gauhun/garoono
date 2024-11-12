"use client";
"use client";

import { motion } from "framer-motion";
import HireModal from './components/HireModal';
import { useState } from "react";

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


function ProjectCard({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        animate={{
          scale: expanded ? 1.02 : 1,
          zIndex: expanded ? 10 : 0,
        }}
        whileHover={{
          y: -5,
          transition: { duration: 0.2 }
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={`bg-[#1A1A1A] rounded-xl p-6 shadow-lg border border-gray-800 
          ${expanded ? "relative" : ""} 
          transition-shadow duration-300
          ${isHovered ? 'shadow-red-500/20 shadow-lg' : ''}`}
      >
        {/* Add a subtle gradient animation on hover */}
        <motion.div
          initial={false}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent rounded-xl"
          style={{ zIndex: -1 }}
        />

        {/* Rest of your existing card content */}
        <div className="flex items-center justify-between mb-4">
          <motion.h3 
            className="text-xl font-bold text-white"
            animate={{ color: isHovered ? "#ef4444" : "#ffffff" }}
            transition={{ duration: 0.2 }}
          >
            {project.title}
          </motion.h3>
          {project.downloads && (
            <motion.span 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm bg-red-500/20 text-red-500 px-3 py-1 rounded-full"
            >
              {project.downloads} Downloads
            </motion.span>
          )}
        </div>

        {/* Animate tags with stagger effect */}
        <motion.div 
          className="flex flex-wrap gap-2 mb-4"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {project.tags.map((tag: string, index: number) => (
            <motion.span
              key={index}
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 }
              }}
              className="bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-sm"
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>

        {/* Animate the description */}
        <motion.p 
          className="text-gray-400 mb-4"
          animate={{ opacity: expanded ? 1 : 0.7 }}
          transition={{ duration: 0.3 }}
        >
          {expanded ? project.fullDesc : project.shortDesc}
        </motion.p>

        {/* Add hover effect to buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 items-center">
          {project.playStoreLink && (
            <motion.a
              whileHover={{ scale: 1.05, x: 5 }}
              href={project.playStoreLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 hover:text-red-400 inline-flex items-center gap-1 w-full sm:w-auto text-center sm:text-left"
            >
              Play Store <span>→</span>
            </motion.a>
          )}

          {project.link && (
            <motion.a
              whileHover={{ scale: 1.05, x: 5 }}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 hover:text-red-400 inline-flex items-center gap-1 w-full sm:w-auto text-center sm:text-left"
            >
              View Project <span>→</span>
            </motion.a>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setExpanded(!expanded)}
            className="text-gray-400 hover:text-gray-300 text-sm underline w-full sm:w-auto text-center sm:text-left"
          >
            {expanded ? "Show Less" : "Read More"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default function Home() {
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);

  return (
    <div className="bg-[#0A0A0A]">
      {/* Navigation */}
      <nav className="fixed w-full bg-[#0A0A0A]/80 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.div className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="bg-red-500 p-2 rounded">GSR</span>
          </motion.div>
          <div className="flex gap-8 text-gray-300">
            <a href="#home" className="hover:text-red-500">
              Home
            </a>
            <a href="#experience" className="hover:text-red-500">
              Experience
            </a>
            <a href="#projects" className="hover:text-red-500">
              Projects
            </a>
            <a href="#education" className="hover:text-red-500">
              Education
            </a>
          </div>
          <motion.a
            href="https://www.linkedin.com/in/gauhun/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            className="bg-transparent border border-red-500 text-red-500 px-6 py-2 rounded-full hover:bg-red-500 hover:text-white transition-colors"
          >
            Let&apos;s Talk
          </motion.a>
        </div>
      </nav>
      {/* Hero Section */}
      <section 
        id="home" 
        className="min-h-screen pt-32 px-4 sm:px-6 lg:px-8 bg-[#0A0A0A] text-white"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="max-w-2xl h-[600px] flex items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="pl-8"
            >
              <motion.h1
                variants={itemVariants}
                className="text-6xl font-bold mb-4"
              >
                <span className="text-red-500">Hello,</span> I&apos;m Gautam
              </motion.h1>
              <motion.h2
                variants={itemVariants}
                className="text-5xl font-bold mb-6"
              >
                Senior Flutter Developer
              </motion.h2>
              <motion.h3
                variants={itemVariants}
                className="text-4xl font-bold mb-8"
              >
                Based in Delhi
              </motion.h3>
              <motion.p
                variants={itemVariants}
                className="text-gray-400 mb-8 max-w-lg"
              >
                A Passionate Flutter Developer With More than 5 Years Of
                Experience Who Is Always Excited To Work With You To Creating
                Wonderful Applications!
              </motion.p>
              <motion.div variants={itemVariants} className="flex gap-4">
                <button 
                  onClick={() => setIsHireModalOpen(true)}
                  className="bg-red-500 text-white px-8 py-3 rounded-full hover:bg-red-600 transition-colors"
                >
                  Hire Me
                </button>
                <a 
                  href="https://drive.google.com/file/d/1sWRkxef8ZJojO1A6MtVOBX9cQjQS_hVh/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="border border-gray-600 text-white px-8 py-3 rounded-full flex items-center gap-2 hover:border-gray-500 transition-colors"
                >
                  Download CV <span>→</span>
                </a>
              </motion.div>
            </motion.div>
          </div>

          <div className="relative h-[600px] flex items-center">
            <div className="bg-[#0A0A0A] w-[400px] h-[400px] rounded-full overflow-hidden border-4 border-red-500 flex items-center justify-center relative">
              {/* Enhanced gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 via-red-500/10 to-transparent" />
              {/* Multiple blur layers for better effect */}
              <div className="absolute inset-0 bg-red-500/10 blur-[40px]" />
              <div className="absolute inset-0 bg-red-500/5 blur-[80px]" />
              {/* Add a subtle inner shadow */}
              <div className="absolute inset-0 shadow-inner" />
              <img
                src="/garoono-logo.png"
                alt="Garoono Logo"
                className="w-[400px] h-[400px] object-contain relative z-10"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Experience Section */}
      <section
        id="experience"
        className="py-32 bg-[#0A0A0A] px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            {...fadeIn}
            className="text-3xl font-bold mb-20 text-center text-white"
          >
            Work Experience
          </motion.h2>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-[19px] top-[20px] bottom-0 w-[2px] bg-red-500"></div>

            <div className="space-y-24">
              <motion.div {...fadeIn} className="relative pl-16">
                <div className="absolute left-0 top-1.5 w-10 h-10 bg-[#0A0A0A] border-4 border-red-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Senior Software Engineer (Flutter)
                </h3>
                <p className="text-gray-400">
                  Kellton Tech • June 2022 - Present • Gurugram
                </p>
                <ul className="mt-4 list-disc list-inside text-gray-400 space-y-2">
                  <li>
                    Delivered three projects for Canara HSBC across Android,
                    iOS, and Web platforms
                  </li>
                  <li>
                    Worked with two major clients, SASAI and Canara HSBC, to
                    deliver high-quality software solutions
                  </li>
                  <li>Led a team of two software developers</li>
                  <li>
                    Implemented bug fixes and new features, enhancing system
                    response time by 30%
                  </li>
                </ul>
              </motion.div>
              <motion.div {...fadeIn} className="relative pl-16">
                <div className="absolute left-0 top-1.5 w-10 h-10 bg-[#0A0A0A] border-4 border-red-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Software Engineer (Flutter)
                </h3>
                <p className="text-gray-400">
                  Enbake Consultancy Pvt Ltd • Nov 2020 - May 2022 • New Delhi
                </p>
                <ul className="mt-4 list-disc list-inside text-gray-400 space-y-2">
                  <li>
                    Developed and maintained multiple applications, enhancing
                    user engagement by 20%
                  </li>
                  <li>
                    Collaborated with cross-functional teams to deliver
                    high-quality software solutions
                  </li>
                  <li>
                    Conducted code reviews and provided mentorship to junior
                    developers
                  </li>
                </ul>
              </motion.div>
              <motion.div {...fadeIn} className="relative pl-16">
                <div className="absolute left-0 top-1.5 w-10 h-10 bg-[#0A0A0A] border-4 border-red-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Software Engineer (Flutter)
                </h3>
                <p className="text-gray-400">
                  GPS Gateway India • Jan 2020 - Nov 2020 • New Delhi
                </p>
                <ul className="mt-4 list-disc list-inside text-gray-400 space-y-2">
                  <li>Applied theoretical knowledge to practical projects</li>
                  <li>
                    Assisted in the deployment of applications, ensuring
                    seamless integration with existing systems
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      {/* Projects Section */}
      <section
        id="projects"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0A0A0A]"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            {...fadeIn}
            className="text-3xl font-bold mb-12 text-center text-white"
          >
            Projects
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>
      {/* Education Section */}
      <section
        id="education"
        className="py-16 bg-[#0A0A0A] px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            {...fadeIn}
            className="text-3xl font-bold mb-12 text-center text-white"
          >
            Education
          </motion.h2>
          <div className="space-y-8">
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
    </div>
  );
}
