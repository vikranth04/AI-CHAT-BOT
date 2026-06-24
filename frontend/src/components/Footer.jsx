import React from "react";
import { motion } from "framer-motion";
import "./Footer.css";

export default function Footer() {
  return (
    <motion.footer 
      className="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="footer-content">
        <div className="footer-branding">
          <h4>LingoLift</h4>
          <p>AI-Powered Language Learning Partner</p>
        </div>
        <div className="footer-details">
          <p>Vikranth Butti</p>
          <p>Built for GENAI Internship - Milestone 2</p>
          <span className="footer-copyright">
            &copy; 2026 LingoLift. All Rights Reserved.
          </span>
        </div>
      </div>
    </motion.footer>
  );
}
