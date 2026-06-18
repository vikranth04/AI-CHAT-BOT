import React from "react";
import { motion } from "framer-motion";
import "./ProjectDescription.css";

export default function ProjectDescription() {
  return (
    <motion.section 
      className="description-section"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="description-card">
        <h2>About LingoLift</h2>
        <p className="description-text">
          LingoLift helps users improve language skills through vocabulary building, grammar correction, translations, pronunciation guidance, conversation practice, synonyms & antonyms, daily phrases, and word-of-the-day learning.
        </p>
      </div>
    </motion.section>
  );
}
