"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const router = useRouter();

  return (
    <div className="relative h-[80vh]">
    
      <div className="absolute inset-0">
        <Image
          src="/landing-splash.jpg"
          alt="Rentiful Rental Platform Hero Section"
          fill
          className="object-cover object-center"
          priority
        />
       
        <div className="absolute inset-0 bg-black/60"></div> 
      </div>
      
     
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center justify-center h-full" 
      >
        <div className="max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Start your journey to finding the perfect place to call home
          </h1>
          <p className="text-lg sm:text-xl text-white mb-8">
            Explore our wide range of rental properties tailored to fit your
            lifestyle and needs!
          </p>

          <Button
            onClick={() => router.push('/properties')}
            className="bg-secondary-500 hover:bg-secondary-600 text-white text-lg py-6 px-8 rounded-xl transition-colors duration-300"
          >
            Browse Properties
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;