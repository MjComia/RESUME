import React from "react";
import { AxisDivider } from "@/components/AxisDivider";
import { BlogSection } from "@/components/BlogSection";
import { ContactSection } from "@/components/ContactSection";
import { HeroWorkbench } from "@/components/HeroWorkbench";
import { Navbar } from "@/components/Navbar";
import { ProfileSection } from "@/components/ProfileSection";
import { ProjectsSection } from "@/components/ProjectsSection";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full min-w-0">
        <HeroWorkbench />
        <AxisDivider coordinate="axis.01 / profile & stack" accent="code" />
        <ProfileSection />
        <AxisDivider coordinate="axis.02 / selected projects" accent="data" />
        <ProjectsSection />
        <AxisDivider coordinate="axis.03 / engineering & data notes" accent="code" />
        <BlogSection />
      </main>
      <ContactSection />
    </div>
  );
}

