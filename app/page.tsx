'use client';

import React from "react";
import CircuitBackground from "@/app/customs/CircuitBackground";
import HomePage from "@/app/home/page";

export default function EntryPage() {
  return (
    <div className="relative min-h-screen overflow-visible">
      {/* Animated Circuit Board Background */}
      <CircuitBackground />
      <HomePage></HomePage>
    </div>
  );
}
