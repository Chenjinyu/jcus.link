// frontend/app/page.tsx (Final Version with Animation)
'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import CircuitBackground from "@/app/customs/CircuitBackground";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Circuit Board Background */}
      <CircuitBackground />

      {/* Main Content */}
      <div className="relative container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8 animate-fade-in">
            <div className="relative h-32 w-32">
              <Image
                src="/logo_black_no_radius.png"
                alt="JCUS.link Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in-up">
            <span className="text-gray-400">JCUS.LINK</span>
          </h1>

          {/* Subtitle */}
          <div className="animate-fade-in-up animation-delay-200">
            <p className="text-3xl md:text-4xl text-gray-300 font-light mb-2">
              YOUR GATEWAY
            </p>
            <p className="text-3xl md:text-4xl text-gray-300 font-light mb-12">
              TO MY KNOWLEDGE
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20 animate-fade-in-up animation-delay-400">
            <Link
              href="/article"
              className="px-8 py-3 border-2 border-gray-400 text-gray-400 rounded-lg hover:bg-gray-100 hover:text-gray-700 hover:border-gray-700 transition-all duration-300 min-w-[200px] font-medium"
            >
              READ ARTICLES
            </Link>
            <Link
              href="/chat"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 min-w-[200px] font-medium shadow-lg hover:shadow-xl"
            >
              ASK ME ANYTHING
            </Link>
          </div>

          {/* Articles Section Title */}
          <div className="mt-32 animate-fade-in-up animation-delay-600">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-300 tracking-widest">
              ARTICLES
            </h2>
          </div>
        </div>
      </div>

      {/* Add these styles in your globals.css */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-in;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}