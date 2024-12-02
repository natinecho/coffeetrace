"use client";

import React, { useEffect } from "react";
import { tailChase } from "ldrs";

// Ensure the web component is registered
tailChase.register();

const Loader = () => {
  useEffect(() => {
    const loaderElement = document.querySelector("l-tail-chase");
    if (loaderElement) {
      loaderElement.setAttribute("size", "40");
      loaderElement.setAttribute("speed", "1.75");
      loaderElement.setAttribute("color", "#982B1C");
    }
  }, []);

  return (
    <div className="flex justify-center items-center">
      <l-tail-chase />
    </div>
  );
};

export default Loader;
