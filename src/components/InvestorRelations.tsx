import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Users, 
  Globe, 
  Zap, 
  ArrowLeft,
  DollarSign,
  PieChart,
  Target
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface InvestorRelationsProps {
  onBack: () => void;
}

export default function InvestorRelations({ onBack }: InvestorRelationsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto px-6 py-12 space-y-16"
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
          Investor Relations
        </h1>
        <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
          The $100B pet industry meets Generative AI. We're building the future of feline career progression.
        </p>
      </header>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { 
            icon: <TrendingUp className="w-6 h-6" />, 
            title: "Exponential Growth", 
            description: "Generating 10,000+ AI-enhanced portraits daily with a week-over-week growth rate of 15%." 
          },
          { 
            icon: <Users className="w-6 h-6" />, 
            title: "Unrivaled Retention", 
            description: "98% of cats return for a second career path. High emotional engagement and word-of-mouth vitality." 
          },
          { 
            icon: <Zap className="w-6 h-6" />, 
            title: "Whisker-Thin Latency", 
            description: "Optimized pipelines using Gemini-2.5-Flash ensure results in under 5 seconds." 
          },
          { 
            icon: <Globe className="w-6 h-6" />, 
            title: "Global Reach", 
            description: "Active users in 45 countries. The love for professional cats transcends borders." 
          }
        ].map((item, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="p-8 bg-white border border-[#EBDCCB] rounded-3xl shadow-sm space-y-4"
          >
            <div className="bg-[#F5F2ED] w-12 h-12 rounded-2xl flex items-center justify-center text-[#2D2A26]">
              {item.icon}
            </div>
            <h3 className="text-2xl font-serif font-bold italic">{item.title}</h3>
            <p className="text-[#2D2A26]/70 leading-relaxed">{item.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Strategy Section */}
      <section className="bg-[#2D2A26] text-white rounded-[3rem] p-12 space-y-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        
        <div className="max-w-2xl space-y-6 relative z-10">
          <h2 className="text-4xl font-serif font-bold italic">Strategy & Future</h2>
          <p className="text-white/70 text-lg">
            Our Series A will fund the development of "Purr-sonality V2"—the first video-based career generator for cats.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative z-10">
          <div className="space-y-2">
            <DollarSign className="w-8 h-8 text-[#EBDCCB]" />
            <h4 className="font-bold text-2xl">$25M ARR</h4>
            <p className="text-sm text-white/50 uppercase tracking-widest font-bold">Projected 2027</p>
          </div>
          <div className="space-y-2">
            <PieChart className="w-8 h-8 text-[#EBDCCB]" />
            <h4 className="font-bold text-2xl">40% Margin</h4>
            <p className="text-sm text-white/50 uppercase tracking-widest font-bold">Whisker-thin overhead</p>
          </div>
          <div className="space-y-2">
            <Target className="w-8 h-8 text-[#EBDCCB]" />
            <h4 className="font-bold text-2xl">1B Cats</h4>
            <p className="text-sm text-white/50 uppercase tracking-widest font-bold">Total Addressable Market</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <footer className="text-center py-12 space-y-8">
        <div className="space-y-2">
          <h3 className="text-3xl font-serif font-bold italic">Ready to invest in whiskers?</h3>
          <p className="text-muted-foreground italic">Serious inquiries only. Casual tuna fans welcome.</p>
        </div>
      </footer>
    </motion.div>
  );
}
