import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Sparkles, 
  Upload, 
  Save, 
  Briefcase, 
  Palette, 
  Trash2,
  Loader2,
  Cat
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generatePurrfessional } from './services/gemini';
import { cn } from '@/lib/utils';
import { resizeAndNormalizeImage } from './lib/image';
import InvestorRelations from './components/InvestorRelations';
import HowItWorks from './components/HowItWorks';

// Constants
const PROFESSIONS = [
  { id: 'astronaut', label: 'Astronaut', icon: '🚀' },
  { id: 'professor', label: 'Professor', icon: '🎓' },
  { id: 'judge', label: 'Judge', icon: '⚖️' },
  { id: 'wizard', label: 'Wizard', icon: '🧙' },
  { id: 'chef', label: 'Chef', icon: '👨‍🍳' },
  { id: 'detective', label: 'Detective', icon: '🔍' },
  { id: 'doctor', label: 'Doctor', icon: '🩺' },
  { id: 'artist', label: 'Artist', icon: '🎨' },
];

const STYLES = [
  { id: 'realistic', label: 'Realistic Photo' },
  { id: 'pixar', label: 'Pixar Animation' },
  { id: 'oil-painting', label: 'Oil Painting' },
  { id: 'sketch', label: 'Pencil Sketch' },
  { id: 'retro', label: 'Retro 8-bit' },
  { id: 'cyberpunk', label: 'Cyberpunk' },
  { id: 'studio', label: 'Studio Portrait' },
];

const SAMPLE_CAT_LIBRARY = [
  { id: 'cosette-official', url: 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?auto=format&fit=crop&q=80&w=800&h=800', name: 'Cosette' },
  { id: 'siamese-cat', url: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=800&h=800', name: 'Siamese Sample' },
  { id: 'orange-cat', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800&h=800', name: 'Orange Sample' },
];

export default function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [profession, setProfession] = useState('astronaut');
  const [customProfession, setCustomProfession] = useState('');
  const [style, setStyle] = useState('realistic');
  const [intensity, setIntensity] = useState([0.5]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [history, setHistory] = useState<{id: string, url: string, profession: string}[]>([]);
  const [activeTab, setActiveTab] = useState('studio');
  const [view, setView] = useState<'studio' | 'investors' | 'how-it-works'>('studio');
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file processing
  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const rawDataUrl = event.target?.result as string;
        try {
          // Normalize and resize image before storing in state
          // This fixes mobile upload issues and ensures standard JPEG format
          const normalizedImage = await resizeAndNormalizeImage(rawDataUrl);
          setSelectedImage(normalizedImage);
          setActiveTab('studio');
        } catch (error) {
          console.error("Image normalization failed:", error);
          // Fallback to raw if normalization fails
          setSelectedImage(rawDataUrl);
          setActiveTab('studio');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setResultImage(null);
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;

    setIsGenerating(true);
    setResultImage(null);

    try {
      const finalProfession = customProfession || profession;
      const generatedUrl = await generatePurrfessional({
        imageData: selectedImage,
        mimeType: 'image/jpeg', 
        profession: finalProfession,
        style,
        intensity: intensity[0],
      });

      setResultImage(generatedUrl);
      setHistory(prev => [{
        id: Date.now().toString(),
        url: generatedUrl,
        profession: finalProfession
      }, ...prev]);
    } catch (error: any) {
      console.error("Generation failed:", error);
      // Detailed error for developers, simple message for users
      const errorMessage = error?.message || "Unknown error";
      console.log(`Detailed error trace: ${errorMessage}`);
      alert(`Oops! Cosette got a bit shy. Try another profession or style. (Hint: check your connection or image size)`);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `purr-fessional-${profession}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] text-[#2D2A26] font-sans selection:bg-[#EBDCCB]">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-[#FDFCF9]/80 backdrop-blur-md border-b border-[#EBDCCB] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => setView('studio')}
          >
            <div className="bg-[#2D2A26] p-2 rounded-xl group-hover:scale-110 transition-transform">
              <Cat className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight font-serif italic text-[#2D2A26]">Purr-fessional</h1>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button 
              onClick={() => {
                setView('how-it-works');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-primary transition-colors bg-transparent border-none cursor-pointer p-0 font-medium"
            >
              How it works
            </button>
            <Button variant="outline" className="rounded-full border-[#EBDCCB]">V1.0 Beta</Button>
          </div>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {view === 'investors' ? (
          <InvestorRelations onBack={() => setView('studio')} />
        ) : view === 'how-it-works' ? (
          <HowItWorks onBack={() => setView('studio')} />
        ) : (
          <motion.main 
            key="studio"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto px-6 py-12"
          >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Input & Controls */}
          <div className="lg:col-span-12 xl:col-span-12 2xl:col-span-5 space-y-8">
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-serif font-medium tracking-tight">The Cat Lab</h2>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-muted-foreground hover:bg-[#EBDCCB]"
                  >
                    <Upload className="w-3 h-3 mr-1" /> Upload New
                  </Button>
                </div>
              </div>
              <p className="text-muted-foreground text-sm max-w-md">
                Select a cat photo to start their training. Use the sample library or upload your own muse.
              </p>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-[#F5F2ED] rounded-lg p-1">
                  <TabsTrigger value="studio" className="data-[state=active]:bg-white rounded-md transition-all">My Studio</TabsTrigger>
                  <TabsTrigger value="library" className="data-[state=active]:bg-white rounded-md transition-all">Sample Cat Library</TabsTrigger>
                </TabsList>
                
                <TabsContent value="studio" className="mt-4 flex justify-center">
                  {selectedImage ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative rounded-2xl overflow-hidden border-2 border-[#EBDCCB] group shadow-xl max-h-[25vh] aspect-auto w-fit"
                    >
                      <img 
                        src={selectedImage} 
                        alt="Target cat" 
                        className="h-full w-auto object-contain max-h-[25vh]" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                          Replace
                        </Button>
                        <Button variant="destructive" size="sm" onClick={clearImage}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={cn(
                        "border-2 border-dashed rounded-2xl h-32 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group w-full",
                        isDragging 
                          ? "border-[#2D2A26] bg-[#F5F2ED] scale-[1.02]" 
                          : "border-[#EBDCCB] hover:bg-[#F5F2ED]"
                      )}
                    >
                      <div className={cn(
                        "p-3 rounded-full transition-transform shadow-inner",
                        isDragging ? "bg-[#2D2A26] text-white scale-110" : "bg-[#F5F2ED] text-[#2D2A26] group-hover:scale-110"
                      )}>
                        <Camera className="w-5 h-5" />
                      </div>
                      <div className="text-center px-6">
                        <p className="text-xs font-medium">
                          {isDragging ? "Drop your muse here" : "Click or drag cat photo here"}
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="library" className="mt-4">
                  <div className="grid grid-cols-3 gap-4">
                    {SAMPLE_CAT_LIBRARY.map((sample) => (
                      <div 
                        key={sample.id}
                        onClick={() => {
                          setSelectedImage(sample.url);
                          setActiveTab('studio');
                        }}
                        className={cn(
                          "cursor-pointer rounded-xl overflow-hidden border-2 transition-all hover:scale-[1.05]",
                          selectedImage === sample.url ? "border-[#2D2A26] ring-2 ring-[#2D2A26]/10" : "border-[#EBDCCB]"
                        )}
                      >
                        <img 
                          src={sample.url} 
                          alt={sample.name} 
                          className="w-full aspect-square object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept="image/*"
              />
            </section>

            <Separator className="bg-[#EBDCCB]" />

            <section className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> Profession
                  </Label>
                  <Select value={profession} onValueChange={(val) => {
                    setProfession(val);
                    if (val !== 'custom') setCustomProfession('');
                  }}>
                    <SelectTrigger className="bg-white border-[#EBDCCB]">
                      <SelectValue placeholder="Select a career" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROFESSIONS.map(p => (
                        <SelectItem key={p.id} value={p.id}>
                          <span className="mr-2">{p.icon}</span> {p.label}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">✨ Custom Career...</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {profession === 'custom' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
                      <input 
                        type="text"
                        placeholder="e.g. Space Pirate, CEO of Tuna"
                        className="w-full mt-2 p-2 text-sm bg-white border border-[#EBDCCB] rounded-md focus:ring-1 focus:ring-[#2D2A26] outline-none"
                        value={customProfession}
                        onChange={(e) => setCustomProfession(e.target.value)}
                      />
                    </motion.div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Palette className="w-4 h-4" /> Art Style
                  </Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger className="bg-white border-[#EBDCCB]">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      {STYLES.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4" /> AI Transformation Intensity
                  </Label>
                  <span className="text-[10px] font-mono text-muted-foreground bg-[#F5F2ED] px-2 py-0.5 rounded uppercase tracking-tighter">
                    {intensity[0] < 0.3 ? "Subtle" : intensity[0] < 0.7 ? "Moderate" : "Complete Reimagine"}
                  </span>
                </div>
                <Slider 
                  value={intensity} 
                  onValueChange={setIntensity} 
                  max={1} 
                  step={0.05} 
                  className="py-4"
                />
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={!selectedImage || isGenerating}
                className="w-full py-10 text-lg rounded-2xl bg-[#2D2A26] hover:bg-black text-white shadow-xl shadow-black/5 disabled:opacity-50 group overflow-hidden relative"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-white/50" />
                    <span>Processing Purr-mits...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    <span className="font-serif italic font-medium tracking-tight">Generate Purr-fessional</span>
                  </div>
                )}
                {isGenerating && (
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
                  />
                )}
              </Button>
            </section>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-12 xl:col-span-12 2xl:col-span-7">
            <Card className="bg-white border-[#EBDCCB] shadow-2xl rounded-3xl overflow-hidden min-h-[600px] flex flex-col border-none">
              <CardHeader className="bg-[#FDFCF9] border-b border-[#EBDCCB] px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="font-serif text-3xl italic tracking-tight">The Result</CardTitle>
                    <CardDescription className="text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
                       Verification Status: 
                       <span className="text-green-600 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Certified
                       </span>
                    </CardDescription>
                  </div>
                  {resultImage && (
                    <Button variant="outline" size="sm" onClick={downloadImage} className="rounded-full gap-2 text-xs border-[#EBDCCB]">
                      <Save className="w-4 h-4" /> Save Portrait
                    </Button>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col items-center justify-center p-8 bg-[#F5F2ED]/30 relative overflow-hidden min-h-[500px]">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
                  <div className="grid grid-cols-8 gap-8 transform rotate-12 -translate-x-10 -translate-y-10">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <Cat key={i} className="w-20 h-20" />
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {isGenerating ? (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      className="flex flex-col items-center gap-8 z-10"
                    >
                      <div className="relative">
                        <div className="w-32 h-32 rounded-full border-[1px] border-[#EBDCCB] border-t-[#2D2A26] animate-[spin_2s_linear_infinite]" />
                        <motion.div 
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute inset-0 m-auto w-12 h-12 bg-[#2D2A26] text-white flex items-center justify-center rounded-full shadow-lg"
                        >
                          <Cat className="w-6 h-6" />
                        </motion.div>
                      </div>
                      <div className="text-center space-y-3">
                        <h3 className="text-xl font-serif italic text-[#2D2A26] animate-pulse">Drafting employment contracts...</h3>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-bold">Training specialized whiskers</p>
                        
                        <div className="flex gap-1 justify-center mt-6">
                           {[0, 1, 2].map(i => (
                             <motion.div 
                               key={i}
                               animate={{ opacity: [0.3, 1, 0.3] }}
                               transition={{ delay: i * 0.2, duration: 1, repeat: Infinity }}
                               className="w-1.5 h-1.5 rounded-full bg-[#2D2A26]"
                             />
                           ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : resultImage ? (
                    <motion.div 
                      key="result"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', damping: 20 }}
                      className="w-full flex flex-col items-center gap-8 z-10"
                    >
                      <div className="relative group/result">
                        <div className="relative w-full max-w-lg aspect-square rounded-[2rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(45,42,38,0.3)] ring-1 ring-black/5">
                          <img 
                            src={resultImage} 
                            alt="Purrfessional Cat" 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        
                        {/* Decorative Badge */}
                        <div className="absolute -bottom-4 -right-4 bg-white p-1 rounded-full shadow-lg">
                          <div className="bg-[#2D2A26] text-white w-16 h-16 rounded-full flex flex-col items-center justify-center border-4 border-white">
                            <span className="text-[10px] font-bold uppercase leading-none">Job</span>
                            <span className="text-[10px] font-bold uppercase leading-none italic">Done</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center space-y-2 pointer-events-none">
                        <motion.h3 
                          initial={{ y: 20, opacity: 0 }} 
                          animate={{ y: 0, opacity: 1 }} 
                          className="text-4xl font-serif font-bold italic tracking-tight"
                        >
                          The {customProfession || profession}
                        </motion.h3>
                        <p className="text-sm text-muted-foreground/80 italic font-medium">"My resume is finally purr-fect."</p>
                      </div>

                      <div className="flex gap-4 w-full max-w-sm pt-4">
                        <Button className="flex-1 bg-[#2D2A26] text-white rounded-full h-14 text-sm font-bold shadow-xl shadow-black/10 hover:shadow-black/20 transition-all font-serif italic" onClick={downloadImage}>
                          Export Portrait
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center space-y-8 max-w-xs z-10"
                    >
                      <div className="relative mx-auto w-fit">
                        <div className="bg-white p-10 rounded-full shadow-[inset_0_4px_12px_rgba(0,0,0,0.05)] border border-[#EBDCCB]">
                          <Briefcase className="w-20 h-20 text-[#EBDCCB]" />
                        </div>
                        <div className="absolute -top-2 -right-2 bg-[#2D2A26] text-white p-2 rounded-full shadow-lg rotate-12">
                          <Sparkles className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-2xl font-serif font-medium italic">Ready for Hires?</h4>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold leading-relaxed">
                          Your feline awaits their new career path.
                        </p>
                      </div>
                      <div className="flex flex-wrap justify-center gap-2 pt-6">
                        {PROFESSIONS.slice(0, 4).map(p => (
                          <div key={p.id} className="px-4 py-1.5 bg-white border border-[#EBDCCB] rounded-full text-[10px] uppercase font-black tracking-widest text-[#2D2A26]/40">
                            {p.label}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
              
              {history.length > 0 && (
                <div className="bg-white border-t border-[#EBDCCB] p-8 py-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase font-black tracking-[0.2em] text-[#2D2A26]/30">Credential History</span>
                    <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold tracking-widest h-auto p-0 opacity-40 hover:opacity-100 hover:bg-transparent" onClick={() => setHistory([])}>Clear Records</Button>
                  </div>
                  <ScrollArea className="w-full">
                    <div className="flex gap-5 pb-2">
                      {history.map((item) => (
                        <motion.div 
                          key={item.id}
                          layoutId={item.id}
                          className="flex-shrink-0 w-24 space-y-3 cursor-pointer group"
                          onClick={() => setResultImage(item.url)}
                        >
                          <div className="aspect-[3/4] rounded-xl overflow-hidden border border-[#EBDCCB] group-hover:scale-105 transition-all shadow-sm group-hover:shadow-md ring-0 group-hover:ring-4 ring-[#EBDCCB]/30 grayscale-[50%] group-hover:grayscale-0">
                            <img src={item.url} alt="Past generation" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <p className="text-[9px] uppercase font-black truncate text-center opacity-40 group-hover:opacity-100 transition-opacity tracking-widest">{item.profession}</p>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </Card>
          </div>
        </div>
        
        {/* Footer info bars */}
        <div className="mt-24 border-t border-[#EBDCCB] pt-8 flex flex-col md:flex-row items-center justify-between text-[10px] uppercase font-bold tracking-[0.3em] text-[#2D2A26]/40 gap-4">
           <div>Model: Gemini-2.5-Flash-Image</div>
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> System: Optimal
           </div>
           <div>Region: Global Cloud</div>
        </div>
      </motion.main>
    )}
  </AnimatePresence>

  <footer className="mt-32 bg-[#2D2A26] text-white px-6 py-24">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-10">
          <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-xl">
             <Cat className="w-10 h-10" />
          </div>
          <div className="space-y-4 max-w-xl">
            <h2 className="text-4xl font-serif font-bold italic tracking-tight">Every cat deserves a career.</h2>
            <p className="text-[#FDFCF9]/60 leading-relaxed">
              We believe in the untapped potential of household mousers. Whether it's deep sea exploration or quantum physics Research, Purr-fessional is here to build the bridge.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
             <a 
               href="https://mailchi.mp/a6d2b4673a49/purr-fessional-waitlist" 
               target="_blank" 
               rel="noopener noreferrer"
               className={cn(
                 buttonVariants(),
                 "rounded-full h-14 px-8 bg-white text-[#2D2A26] hover:bg-white/90 border-none shadow-lg transition-transform hover:scale-105 flex items-center justify-center font-bold no-underline"
               )}
             >
               Join the Waitlist
             </a>
             <Button 
               className="rounded-full h-14 px-8 bg-white text-[#2D2A26] hover:bg-white/90 border-none shadow-lg transition-transform hover:scale-105"
               onClick={() => {
                 setView('investors');
                 window.scrollTo({ top: 0, behavior: 'smooth' });
               }}
             >
               Investor Relations
             </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
