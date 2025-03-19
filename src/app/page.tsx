"use client";

import { useState, useEffect, MouseEvent } from "react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import Image from "next/image";
import PuzzlePairSection from "./PuzzlePairSection";

export default function Home() {
  const [showTopNav, setShowTopNav] = useState(true);
  const [navOpen, setNavOpen] = useState(false);
  const [scrollDir, setScrollDir] = useState<"down" | "up">("down");
  const [flipped, setFlipped] = useState(false);
  const [photoTilt, setPhotoTilt] = useState({ rotateX: 0, rotateY: 0 });
  const { scrollY } = useScroll();
  const planeY = useTransform(scrollY, [0, 2000], [0, 600]);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopNav(window.scrollY < window.innerHeight);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleDirection = () => {
      const currentScrollY = window.scrollY;
      setScrollDir(currentScrollY > lastScrollY ? "down" : "up");
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleDirection);
    return () => window.removeEventListener("scroll", handleDirection);
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const ty = ((x - cx) / cx) * 10;
    const tx = -((y - cy) / cy) * 10;
    setPhotoTilt({ rotateX: tx, rotateY: ty });
  };

  const handleMouseLeave = () => {
    setPhotoTilt({ rotateX: 0, rotateY: 0 });
  };

  const bobVariants: Variants = {
    bob: {
      y: [0, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
    still: { y: 0 },
  };

  const rotateYFront = flipped ? 180 + photoTilt.rotateY : photoTilt.rotateY;
  const rotateYBack = flipped ? photoTilt.rotateY : -180 + photoTilt.rotateY;
  const rotateXVal = photoTilt.rotateX;

  return (
    <main className="relative w-screen min-h-screen bg-white">
      {showTopNav && (
        <header className="fixed top-0 w-full flex items-center justify-between px-6 py-3 border-b border-black bg-white z-50">
          <h1 className="font-bold text-2xl">M.D.V. Portfolio</h1>
          <nav className="flex space-x-4">
            <a href="#about" className="text-xl hover:underline">
              About Me
            </a>
            <a href="#fit" className="text-xl hover:underline">
              Are We a Good Fit?
            </a>
            <a href="#contact" className="text-xl hover:underline">
              Contact
            </a>
          </nav>
        </header>
      )}
      <div className="fixed top-16 right-6 z-50">
        <div
          onMouseEnter={() => setNavOpen(true)}
          onMouseLeave={() => setNavOpen(false)}
        >
          <motion.div
            style={{ y: planeY }}
            animate={{ rotate: scrollDir === "down" ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Image src="/plane.png" alt="Paper Plane" width={48} height={48} />
          </motion.div>
          {navOpen && (
            <motion.nav
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-14 right-0 bg-white p-4 rounded-lg shadow-sm border border-gray-200"
            >
              <ul className="space-y-3 text-xl font-semibold">
                <li>
                  <a href="#about" className="hover:underline">
                    About Me
                  </a>
                </li>
                <li>
                  <a href="#fit" className="hover:underline">
                    Are We a Good Fit?
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:underline">
                    Contact
                  </a>
                </li>
              </ul>
            </motion.nav>
          )}
        </div>
      </div>
      <section
        id="about"
        className="min-h-screen flex flex-col md:flex-row items-center justify-center px-8 py-12 gap-8 border-b border-gray-300"
      >
        <div className="w-full md:w-1/2 flex justify-center">
          <motion.div
            className="relative w-[600px] h-[600px] border-4 border-gray-300 shadow-2xl"
            style={{ perspective: "1000px" }}
            variants={bobVariants}
            initial="bob"
            whileHover="still"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={() => setFlipped(true)}
            onMouseOut={() => setFlipped(false)}
          >
            <motion.div
              className="absolute inset-0"
              animate={{ rotateY: rotateYFront, rotateX: rotateXVal }}
              transition={{ duration: 0.6 }}
              style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
            >
              <Image
                src="/my-photo.jpg"
                alt="My Photo Front"
                className="object-cover w-full h-full"
                width={600}
                height={600}
              />
            </motion.div>
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-white p-6"
              animate={{ rotateY: rotateYBack, rotateX: rotateXVal }}
              transition={{ duration: 0.6 }}
              style={{
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <p className="text-center text-lg text-gray-900 leading-relaxed">
                Beyond coding, I love baking, exploring nature,
                and sewing. As well as attending lectures on various topics, lately maths.
                I have started to post about these on my LinkedIn.
              </p>
            </motion.div>
          </motion.div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-start p-4">
          <h2 className="text-5xl font-bold mb-4">Hi, I am Diana</h2>
          <p className="text-lg text-gray-900 leading-relaxed mb-6">
            I am driven by a deep fascination with how programming works at its core.
            As an active participant in AI camp, I’ve joined hands-on workshops at Google Cloud
            (exploring RIG-RAG techniques and Gemini’s evolution), Weaviate (vector databases),
            and HPE (robotics and Formula 1 simulations). Software development isn’t just code—
            it’s about problem solving and creating versatile tools that make life more efficient,
            engaging, or entertaining. The instant feedback loop is especially rewarding,
            as each new feature or fix can immediately impact people’s lives in a tangible way.
          </p>
          <a
            href="/my-cv.pdf"
            download
            className="text-xl text-gray-800 hover:underline"
          >
            Download My CV
          </a>
        </div>
      </section>
      <section
        id="fit"
        className="min-h-screen flex justify-center bg-gray-50 px-8 border-b border-gray-300"
      >
        <PuzzlePairSection />
      </section>
      <section
        id="contact"
        className="min-h-screen flex flex-col items-center justify-center px-8 bg-white"
      >
        <h2 className="text-5xl font-semibold mb-12">Contact Me</h2>
        <div className="flex items-center justify-center space-x-24">
          <div className="relative group flex flex-col items-center cursor-pointer">
            <Image
              src="/email.png"
              alt="Email"
              width={128}
              height={128}
              className="object-contain transition duration-300 group-hover:opacity-80"
            />
            <div className="absolute top-full mt-3 px-3 py-1 bg-white text-black text-lg font-medium rounded shadow opacity-0 group-hover:opacity-100 transition duration-300">
              dianaveletian@gmail.com
            </div>
          </div>
          <div className="relative group flex flex-col items-center cursor-pointer">   
            <a
              href="https://www.linkedin.com/in/diana-veletian-04137b14b"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/linkedin.png"
                alt="LinkedIn"
                width={128}
                height={128}
                className="object-contain transition duration-300 group-hover:opacity-80"
              />
            </a>
            <div className="absolute top-full mt-3 px-3 py-1 bg-white text-black text-lg font-medium rounded shadow opacity-0 group-hover:opacity-100 transition duration-300">
              <a
                href="https://www.linkedin.com/in/diana-veletian-04137b14b"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                linkedin.com/in/diana-veletian-04137b14b
              </a>
            </div>
          </div>
          <div className="relative group flex flex-col items-center cursor-pointer">
            <Image
              src="/telephone.png"
              alt="Phone"
              width={128}
              height={128}
              className="object-contain transition duration-300 group-hover:opacity-80"
            />
            <div className="absolute top-full mt-3 px-3 py-1 bg-white text-black text-lg font-medium rounded shadow opacity-0 group-hover:opacity-100 transition duration-300">
              07909285605
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

