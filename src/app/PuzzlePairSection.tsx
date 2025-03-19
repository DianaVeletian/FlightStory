"use client";

import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 1.0 },
  },
};

const pieceVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 2.0 } },
};

const finalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1.5 } },
};

export default function FinalPuzzleShowcase() {
  const [showFinal, setShowFinal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const puzzleImages = [
    { id: "1", src: "dataskills.png", label: "Data Skills" },
    { id: "2", src: "arima.png", label: "Arima & Plotly" },
    { id: "3", src: "frontend.png", label: "Front-End Skills" },
    { id: "4", src: "html.png", label: "HTML/CSS/React" },
    { id: "5", src: "vc.png", label: "Version Control" },
    { id: "6", src: "git.png", label: "Git" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFinal(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const slides = [
    { id: 0, type: "html", title: "Arima & Plotly", src: "/arimaPlotly.html" },
    {
      id: 1,
      type: "link",
      title: "Git Repository: LinkedIn Auto Message",
      link: "https://github.com/DianaVeletian/FlightStory.git",
    },
    {
      id: 2,
      type: "image",
      title: "My GitHub Screenshot",
      src: "/myGitHub.png",
      note: "Needs a lot of maintenance",
    },
  ];

  const handleNext = () => setCurrentSlide((p) => (p + 1) % slides.length);
  const handlePrev = () => setCurrentSlide((p) => (p - 1 + slides.length) % slides.length);

  const PIECE_SIZE = 250;

  return (
    <div style={{ minHeight: "100vh", padding: "2rem", backgroundColor: "#f9fafb" }}>
      <h1
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          fontSize: "2.5rem",
          fontWeight: "bold",
        }}
      >
        Your Requirements & My Skills
      </h1>

      {!showFinal && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "2rem",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {puzzleImages.map((img) => (
            <motion.div
              key={img.id}
              variants={pieceVariants}
              style={{
                position: "relative",
                width: `${PIECE_SIZE}px`,
                height: `${PIECE_SIZE}px`,
                backgroundColor: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <Image
                src={`/${img.src}`}
                alt={img.label}
                fill
                style={{ objectFit: "contain" }}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {showFinal && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={finalVariants}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "2rem",
          }}
        >
          <Image
            src="/final.png"
            alt="Final Puzzle"
            width={600}
            height={400}
            style={{ objectFit: "contain", marginBottom: "1.5rem" }}
          />
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#333",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1.125rem",
            }}
          >
            See Project
          </button>
        </motion.div>
      )}

      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              position: "relative",
              backgroundColor: "#fff",
              padding: "2rem",
              borderRadius: "12px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
              maxWidth: "900px",
              width: "90%",
              height: "80vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "transparent",
                border: "none",
                fontSize: "2rem",
                cursor: "pointer",
                color: "#333",
              }}
            >
              &times;
            </button>
            <h2 style={{ marginBottom: "1rem", fontSize: "1.75rem" }}>
              {slides[currentSlide].title}
            </h2>
            <div
              style={{
                position: "relative",
                width: "100%",
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <button
                onClick={handlePrev}
                style={{
                  position: "absolute",
                  left: "0",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  border: "none",
                  color: "#fff",
                  fontSize: "2rem",
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                  borderTopRightRadius: "4px",
                  borderBottomRightRadius: "4px",
                }}
              >
                &#10094;
              </button>
              <div style={{ width: "100%", height: "100%" }}>
                {slides[currentSlide].type === "html" && (
                  <iframe
                    src={slides[currentSlide].src}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                      objectFit: "contain",
                    }}
                    title={slides[currentSlide].title}
                  />
                )}
                {slides[currentSlide].type === "link" && (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      padding: "1rem",
                    }}
                  >
                    <p style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
                      {slides[currentSlide].title}
                    </p>
                    <a
                      href={slides[currentSlide].link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: "1.125rem",
                        color: "#007bff",
                        textDecoration: "underline",
                      }}
                    >
                      {slides[currentSlide].link}
                    </a>
                  </div>
                )}
                {slides[currentSlide].type === "image" && (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "1rem",
                    }}
                  >
                    <Image
                      src={slides[currentSlide].src ?? ""}
                      alt={slides[currentSlide].title ?? "Slide"}
                      width={800}
                      height={600}
                      style={{ objectFit: "contain" }}
                    />
                    <p style={{ marginTop: "1rem", fontSize: "1rem", color: "#666" }}>
                      {slides[currentSlide].note}
                    </p>
                  </div>
                )}
              </div>
              <button
                onClick={handleNext}
                style={{
                  position: "absolute",
                  right: "0",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  border: "none",
                  color: "#fff",
                  fontSize: "2rem",
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                  borderTopLeftRadius: "4px",
                  borderBottomLeftRadius: "4px",
                }}
              >
                &#10095;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
