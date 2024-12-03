"use client";

import React, { useEffect } from "react";
import { tailChase } from "ldrs";
import dynamic from "next/dynamic";

// Ensure the web component is registered
if (!customElements.get("l-tail-chase")) {
  tailChase.register();
}

const Loader = () => {
  return (
    <div className="flex justify-center items-center">
      {/* Set attributes directly in JSX */}
      <l-tail-chase size="40" speed="1.75" color="#982B1C" />
    </div>
  );
};

export default dynamic(() => Promise.resolve(Loader), { ssr: false });
