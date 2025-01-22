"use client";

import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import styles from "../page.module.css";

const SidebarToggle: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    document.querySelector(`.${styles.homeContainer}`)?.classList.toggle(styles.shrink);
    document.querySelector(`.${styles.sidebar}`)?.classList.toggle(styles.open);
  };

  return (
    <button className={styles.sidebarToggle} onClick={toggleSidebar}>
      {isSidebarOpen ? <FaTimes /> : <FaBars />}
    </button>
  );
};

export default SidebarToggle;
