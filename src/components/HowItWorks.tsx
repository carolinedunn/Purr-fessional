import React from 'react';
import { motion } from 'motion/react';
import { 
  Camera, 
  Sparkles, 
  Brain, 
  Wand2, 
  ArrowLeft,
  Heart,
  Palette,
  Terminal
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HowItWorksProps {
  onBack: () => void;
}

export default function HowItWorks({ onBack }: HowItWorksProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto px-6 py-12 space-y-20"
    >
      {/* Header */}
      <header className="space-y-6 text-center">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-8 hover:bg-[#F5F2ED] rounded-full"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Studio
        </Button>
        <h1 className="text-5xl md:text-7xl font-serif font-bold italic tracking-tight text-[#2D2A26]">
          How it Works
        </h1>
        <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
          From a simple snapshot to a professional feline career. Here's the magic behind the whiskers.
        </p>
      </header>

      {/* Steps Section */}
      <div className="space-y-16">
        {[
          {
            icon: <Camera className="w-8 h-8" />,
            title: "1. Capture the Subject",
            description: "Upload a clear photo of your cat. Our algorithms look for key features—ear tips, whisker length, and that unique 'purr-sonality' in their eyes."
          },
          {
            icon: <Palette className="w-8 h-8" />,
            title: "2. Choose a Career Path",
            description: "Pick from over 20 professional identities. Whether they aspire to be a CEO, a Painter, or an Astronaut, we have the correct uniform ready."
          },
          {
            icon: <Brain className="w-8 h-8" />,
            title: "3. Generative Magic",
            description: "Using the Gemini-2.5-Flash model, we analyze your photo and merge it with professional aesthetics to create a seamless, high-quality portrait."
          },
          {
            icon: <Wand2 className="w-8 h-8" />,
            title: "4. The Purr-fessional Result",
            description: "Your cat is presented with their new professional headshot, ready for LinkedIn (or the scratching post)."
          }
        ].map((step, i) => (
          <div key={i} className="flex flex-col md:flex-row gap-8 items-start">
            <div className="bg-[#2D2A26] text-white p-4 rounded-2xl shrink-0 shadow-lg">
              {step.icon}
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-serif font-bold italic text-[#2D2A26]">{step.title}</h3>
              <p className="text-lg text-[#2D2A26]/70 leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tech Credits Section */}
      <section className="bg-[#F5F2ED] rounded-[3rem] p-12 text-center space-y-8">
        <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm mb-4">
          <Terminal className="w-6 h-6 text-[#2D2A26]" />
        </div>
        <h2 className="text-3xl font-serif font-bold italic text-[#2D2A26]">Built with Modern Craft</h2>
        <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-[#2D2A26]/60">
          <span className="px-4 py-2 bg-white rounded-full border border-[#EBDCCB]">React 19</span>
          <span className="px-4 py-2 bg-white rounded-full border border-[#EBDCCB]">Google Gemini AI</span>
          <span className="px-4 py-2 bg-white rounded-full border border-[#EBDCCB]">Tailwind CSS</span>
          <span className="px-4 py-2 bg-white rounded-full border border-[#EBDCCB]">Framer Motion</span>
        </div>
        <div className="pt-8 border-t border-[#EBDCCB] max-w-lg mx-auto">
          <p className="text-[#2D2A26] font-medium leading-relaxed">
            Created with passion by <span className="text-[#2D2A26] font-bold">Caroline Dunn</span> & <span className="text-[#2D2A26] font-bold">AI Studio</span>.
          </p>
          <div className="mt-4 flex justify-center gap-2 text-rose-500">
            <Heart className="w-5 h-5 fill-current" />
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="text-center py-12">
        <Button 
          onClick={onBack}
          className="rounded-full h-14 px-8 bg-[#2D2A26] text-white hover:scale-105 transition-transform font-serif italic"
        >
          Back to Cat Lab
        </Button>
      </footer>
    </motion.div>
  );
}
