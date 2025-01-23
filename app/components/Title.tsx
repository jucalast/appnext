"use client";

import React, { useState } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

interface TitleProps {
  // Remova a prop onFirstMessageSent
}

const Title: React.FC<TitleProps> = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleFirstMessage = () => {
    setIsVisible(false);
    // Remova a chamada para onFirstMessageSent
  };

  if (!isVisible) return null;

  return <h1 className={`${poppins.className}`}>Chat'me</h1>;
};

export default Title;
