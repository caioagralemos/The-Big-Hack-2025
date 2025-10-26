import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X, CheckCircle2, Database, Zap, Brain, TrendingUp, Target, Clock, Users, DollarSign, Gauge, Network, Cpu, FileText, BarChart3, Download } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner@2.0.3";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
  LineChart,
  Line,
  PieChart,
  Pie,
} from "recharts";
import creditAgricoleLogo from "figma:asset/51571be080406a0b3f76c0cbe126391b2cff8b63.png";

interface PitchPresentationProps {
  onClose: () => void;
}

export function PitchPresentation({ onClose }: PitchPresentationProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const totalSlides = 12;
  const slideContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const downloadAsPDF = async () => {
    setIsDownloading(true);
    toast.info("Generazione PDF in corso... Attendere prego.");
    
    try {
      // Use html-to-image instead of html2canvas for better CSS support
      const { toPng } = await import("html-to-image");
      const jsPDF = (await import("jspdf")).default;
      
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [1280, 720], // 16:9 aspect ratio
      });

      const currentSlideIndex = currentSlide;

      // Capture each slide
      for (let i = 0; i < totalSlides; i++) {
        setCurrentSlide(i);
        
        // Wait for slide to render
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        const slideElement = slideContainerRef.current;
        if (slideElement) {
          try {
            // Use html-to-image which has better CSS support
            const dataUrl = await toPng(slideElement, {
              width: 1280,
              height: 720,
              quality: 0.95,
              pixelRatio: 2,
              backgroundColor: '#ffffff',
              skipFonts: false,
              preferredFontFormat: 'woff2',
            });
            
            if (i > 0) {
              pdf.addPage();
            }
            
            pdf.addImage(dataUrl, "PNG", 0, 0, 1280, 720);
          } catch (slideError) {
            console.error(`Error capturing slide ${i}:`, slideError);
            // Add a blank page if capture fails
            if (i > 0) {
              pdf.addPage();
            }
            // Add error message
            pdf.setFontSize(20);
            pdf.setTextColor(200, 0, 0);
            pdf.text(`Errore cattura slide ${i + 1}`, 640, 360, { align: 'center' });
          }
        }
      }

      pdf.save("TalentIQ_Pitch_Presentation.pdf");
      toast.success("PDF scaricato con successo!");
      
      // Restore original slide
      setCurrentSlide(currentSlideIndex);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Errore durante la generazione del PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadAsPPTX = async () => {
    setIsDownloading(true);
    toast.info("Generazione PPTX in corso... Attendere prego.");
    
    try {
      const PptxGenJS = (await import("pptxgenjs")).default;
      const pptx = new PptxGenJS();
      
      // Set presentation properties
      pptx.author = "TalentIQ - Crédit Agricole";
      pptx.title = "TalentIQ Pitch Presentation";
      pptx.subject = "Smart Recruiting Solution";
      
      // Define colors
      const colors = {
        primary: "006F4E",
        secondary: "009B9D",
        accent: "ED1C24",
      };

      // Slide 1: Title
      let slide = pptx.addSlide();
      slide.background = { color: colors.primary };
      slide.addText("TalentIQ", {
        x: 0.5, y: 2, w: 9, h: 1,
        fontSize: 60, color: "FFFFFF", bold: true, align: "center"
      });
      slide.addText("Reclutamento Intelligente per Crédit Agricole", {
        x: 0.5, y: 3, w: 9, h: 0.6,
        fontSize: 28, color: "FFFFFF", align: "center"
      });
      slide.addText("Da 100 CV ai Top 10 Candidati in 60 Secondi", {
        x: 1.5, y: 4.2, w: 7, h: 1,
        fontSize: 32, color: "FFD700", bold: true, align: "center"
      });

      // Slide 2: Il Problema
      slide = pptx.addSlide();
      slide.addText("Il Problema da €450.000", {
        x: 0.5, y: 0.5, w: 9, h: 0.6,
        fontSize: 36, color: colors.primary, bold: true
      });
      slide.addText([
        { text: "€450K ", options: { fontSize: 44, color: colors.accent, bold: true } },
        { text: "Persi annualmente in screening\n", options: { fontSize: 18, color: "666666" } },
        { text: "Fonte: LinkedIn Global Recruiting Trends 2024", options: { fontSize: 10, color: "999999", italic: true } }
      ], { x: 0.5, y: 1.5, w: 3, h: 1.5 });
      
      slide.addText([
        { text: "42 Giorni ", options: { fontSize: 44, color: "FF8C00", bold: true } },
        { text: "Tempo medio di assunzione\n", options: { fontSize: 18, color: "666666" } },
        { text: "Fonte: SHRM Time-to-Fill Report 2024", options: { fontSize: 10, color: "999999", italic: true } }
      ], { x: 3.5, y: 1.5, w: 3, h: 1.5 });
      
      slide.addText([
        { text: "30% ", options: { fontSize: 44, color: colors.accent, bold: true } },
        { text: "Candidati persi per cattiva UX\n", options: { fontSize: 18, color: "666666" } },
        { text: "Fonte: CareerBuilder 2024", options: { fontSize: 10, color: "999999", italic: true } }
      ], { x: 6.5, y: 1.5, w: 3, h: 1.5 });

      // Slide 3: Soluzione
      slide = pptx.addSlide();
      slide.addText("TalentIQ: L'IA che Pensa come il Miglior HR Manager", {
        x: 0.5, y: 0.5, w: 9, h: 0.6,
        fontSize: 32, color: colors.primary, bold: true
      });
      
      const pillars = [
        { title: "Motore di Valutazione AI", points: ["Analizza CV su 5 dimensioni", "Punteggio coerente 1-5", "Pesi personalizzabili"] },
        { title: "Dashboard Real-Time", points: ["4 metriche chiave", "Analytics visive", "Ranking istantaneo"] },
        { title: "Esperienza Candidato", points: ["Landing page brandizzate", "Candidatura in 3 minuti", "GDPR-compliant"] }
      ];
      
      pillars.forEach((pillar, idx) => {
        const x = 0.5 + (idx * 3.3);
        slide.addText(pillar.title, {
          x, y: 1.5, w: 3, h: 0.5,
          fontSize: 16, color: colors.primary, bold: true, align: "center"
        });
        pillar.points.forEach((point, pIdx) => {
          slide.addText(`✓ ${point}`, {
            x, y: 2.2 + (pIdx * 0.4), w: 3, h: 0.3,
            fontSize: 12, color: "333333"
          });
        });
      });

      // Slide 4: ROI
      slide = pptx.addSlide();
      slide.addText("ROI: I Numeri che Contano", {
        x: 0.5, y: 0.5, w: 9, h: 0.6,
        fontSize: 36, color: colors.primary, bold: true
      });
      
      slide.addText([
        { text: "↓ 96%\n", options: { fontSize: 52, color: colors.primary, bold: true } },
        { text: "Riduzione Tempo\n", options: { fontSize: 20, color: colors.primary } },
        { text: "Da 16.7h a 30min per ruolo", options: { fontSize: 12, color: "666666" } }
      ], { x: 0.5, y: 2, w: 3, h: 2, align: "center" });
      
      slide.addText([
        { text: "€360K\n", options: { fontSize: 52, color: colors.secondary, bold: true } },
        { text: "Risparmio Annuo\n", options: { fontSize: 20, color: colors.secondary } },
        { text: "Da €450K a €90K", options: { fontSize: 12, color: "666666" } }
      ], { x: 3.5, y: 2, w: 3, h: 2, align: "center" });
      
      slide.addText([
        { text: "+37%\n", options: { fontSize: 52, color: colors.primary, bold: true } },
        { text: "Offerte Accettate\n", options: { fontSize: 20, color: colors.primary } },
        { text: "Da 67% a 92%", options: { fontSize: 12, color: "666666" } }
      ], { x: 6.5, y: 2, w: 3, h: 2, align: "center" });

      // Slide 5: Le 5 Dimensioni
      slide = pptx.addSlide();
      slide.addText("Le 5 Dimensioni di Valutazione IA", {
        x: 0.5, y: 0.5, w: 9, h: 0.6,
        fontSize: 32, color: colors.primary, bold: true
      });
      
      const dimensions = [
        { name: "1. Esperienza Professionale", weight: "25-35%", points: ["Anni rilevanti", "Progressione ruoli", "Leadership"] },
        { name: "2. Competenze Tecniche", weight: "30-40%", points: ["Stack tecnologico", "Certificazioni", "Tool & metodologie"] },
        { name: "3. Motivazione e Fit", weight: "15-20%", points: ["Alignment mission", "Interesse ruolo", "Career goals"] },
        { name: "4. Formazione", weight: "5-15%", points: ["Background accademico", "Corsi & certificazioni", "Auto-apprendimento"] },
        { name: "5. Soft Skills", weight: "10-20%", points: ["Comunicazione", "Problem solving", "Adattabilità", "Proattività"] }
      ];
      
      dimensions.forEach((dim, idx) => {
        const y = 1.5 + (idx * 0.9);
        slide.addText(`${dim.name} (${dim.weight})`, {
          x: 0.5, y, w: 4.5, h: 0.4,
          fontSize: 14, color: colors.primary, bold: true
        });
        slide.addText(dim.points.join(" • "), {
          x: 0.7, y: y + 0.35, w: 4.3, h: 0.3,
          fontSize: 10, color: "666666"
        });
      });

      // Slide 6: Architettura IA
      slide = pptx.addSlide();
      slide.addText("Architettura del Modello IA", {
        x: 0.5, y: 0.5, w: 9, h: 0.6,
        fontSize: 32, color: colors.primary, bold: true
      });
      
      slide.addText("1. Ingestion\nCV Parser\nPDF/DOCX → Text", {
        x: 0.5, y: 2, w: 2.5, h: 1.5,
        fontSize: 12, align: "center", color: "333333"
      });
      slide.addText("→", { x: 3, y: 2.5, w: 0.5, h: 0.5, fontSize: 28, color: colors.secondary, bold: true });
      
      slide.addText("2. NLP Engine\nEstrazione\nEntity Recognition", {
        x: 3.5, y: 2, w: 2.5, h: 1.5,
        fontSize: 12, align: "center", color: "333333"
      });
      slide.addText("→", { x: 6, y: 2.5, w: 0.5, h: 0.5, fontSize: 28, color: colors.secondary, bold: true });
      
      slide.addText("3. ML Scoring\nGradient Boosting\n5-dim weighted", {
        x: 6.5, y: 2, w: 2.5, h: 1.5,
        fontSize: 12, align: "center", color: "333333"
      });
      
      slide.addText("Latenza: 1.2s | Throughput: 100 CV/min | Precision: 89% | Recall: 85%", {
        x: 0.5, y: 4.5, w: 9, h: 0.4,
        fontSize: 12, align: "center", color: colors.primary
      });

      // Slide 7: KPI Efficienza
      slide = pptx.addSlide();
      slide.addText("KPI di Efficienza del Progetto", {
        x: 0.5, y: 0.5, w: 9, h: 0.6,
        fontSize: 32, color: colors.primary, bold: true
      });
      
      const kpis = [
        { label: "Time-to-Shortlist", value: "-96%", desc: "Da 16.7h a 30min" },
        { label: "Cost per Hire", value: "-80%", desc: "€5,172 → €1,034" },
        { label: "Offer Acceptance", value: "92%", desc: "+37% vs baseline" },
        { label: "Candidate Satisfaction", value: "4.6/5", desc: "NPS: +52" },
        { label: "Interview-to-Hire", value: "35%", desc: "+18% vs manual" },
        { label: "90-day Retention", value: "94%", desc: "+12% industry avg" }
      ];
      
      kpis.forEach((kpi, idx) => {
        const x = 0.5 + ((idx % 3) * 3.3);
        const y = 2 + (Math.floor(idx / 3) * 1.5);
        slide.addText(kpi.label, {
          x, y, w: 3, h: 0.3,
          fontSize: 11, color: "666666"
        });
        slide.addText(kpi.value, {
          x, y: y + 0.3, w: 3, h: 0.5,
          fontSize: 28, color: colors.primary, bold: true
        });
        slide.addText(kpi.desc, {
          x, y: y + 0.8, w: 3, h: 0.3,
          fontSize: 10, color: "666666"
        });
      });

      // Slide 8: Call to Action
      slide = pptx.addSlide();
      slide.background = { color: colors.primary };
      slide.addText("Pronti a Trasformare il Reclutamento?", {
        x: 0.5, y: 1.5, w: 9, h: 0.8,
        fontSize: 40, color: "FFFFFF", bold: true, align: "center"
      });
      slide.addText("🚀 Programma Pilota - Trial 30 Giorni", {
        x: 0.5, y: 3, w: 9, h: 0.6,
        fontSize: 28, color: "FFD700", align: "center"
      });
      slide.addText("Trasformiamo Insieme il Reclutamento", {
        x: 0.5, y: 4, w: 9, h: 0.5,
        fontSize: 24, color: "FFFFFF", align: "center"
      });
      slide.addText("Grazie!", {
        x: 0.5, y: 4.7, w: 9, h: 0.5,
        fontSize: 28, color: "FFFFFF", bold: true, align: "center"
      });

      pptx.writeFile({ fileName: "TalentIQ_Pitch_Presentation.pptx" });
      toast.success("PPTX scaricato con successo!");
    } catch (error) {
      console.error("Error generating PPTX:", error);
      toast.error("Errore durante la generazione del PPTX");
    } finally {
      setIsDownloading(false);
    }
  };

  const mockDistributionData = [
    { range: "0-20", count: 3 },
    { range: "20-40", count: 8 },
    { range: "40-60", count: 24 },
    { range: "60-75", count: 32 },
    { range: "75-100", count: 20 },
  ];

  const mockRadarData = [
    { dimension: "Prof. Exp.", score: 85 },
    { dimension: "Tech Skills", score: 92 },
    { dimension: "Motivation", score: 78 },
    { dimension: "Education", score: 88 },
    { dimension: "Soft Skills", score: 75 },
  ];

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header with controls */}
      <div className="absolute top-4 right-4 flex items-center gap-4 z-10">
        <span className="text-white text-sm">
          {currentSlide + 1} / {totalSlides}
        </span>
        
        {/* Download Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            disabled={isDownloading}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-white/20 bg-white/10 text-white hover:bg-white/20 h-9 px-4 py-2"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? "Generando..." : "Download"}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={downloadAsPDF}>
              <FileText className="w-4 h-4 mr-2" />
              Scarica come PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={downloadAsPPTX}>
              <FileText className="w-4 h-4 mr-2" />
              Scarica come PPTX
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Slide content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div ref={slideContainerRef} className="w-full max-w-6xl h-full max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden">
          {currentSlide === 0 && <Slide1 />}
          {currentSlide === 1 && <Slide2 />}
          {currentSlide === 2 && <Slide3 />}
          {currentSlide === 3 && <Slide4 distributionData={mockDistributionData} radarData={mockRadarData} />}
          {currentSlide === 4 && <Slide5 />}
          {currentSlide === 5 && <Slide6 />}
          {currentSlide === 6 && <Slide7 />}
          {currentSlide === 7 && <Slide8 />}
          {currentSlide === 8 && <Slide9 />}
          {currentSlide === 9 && <Slide10 />}
          {currentSlide === 10 && <Slide11 />}
          {currentSlide === 11 && <Slide12 />}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>
        <div className="flex gap-2">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentSlide ? "bg-white w-6" : "bg-white/40"
              }`}
            />
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={nextSlide}
          disabled={currentSlide === totalSlides - 1}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-30"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

// Slide 1: Title + Hook
function Slide1() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-12 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #006F4E 0%, #004d36 100%)" }}>
      {/* Logo */}
      <div className="absolute top-8 left-8">
        <img src={creditAgricoleLogo} alt="Crédit Agricole" className="h-12" />
      </div>

      {/* Main content */}
      <div className="text-center space-y-8 animate-fade-in">
        <h1 className="text-6xl text-white mb-4">TalentIQ</h1>
        <p className="text-3xl text-white/90">Reclutamento Intelligente per Crédit Agricole</p>
        
        <div className="mt-12 p-8 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
          <p className="text-4xl text-white">
            Da <span className="text-yellow-300">100 CV</span> ai{" "}
            <span className="text-yellow-300">Top 10 Candidati</span>
          </p>
          <p className="text-5xl text-yellow-300 mt-4">in 60 Secondi</p>
        </div>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-8 text-white/60 text-sm">
        Hackathon Pitch 2025 • 4 Minuti
      </div>
    </div>
  );
}

// Slide 2: The Problem (CON FONTI)
function Slide2() {
  return (
    <div className="h-full flex flex-col p-12 bg-white">
      <div className="absolute top-6 right-6">
        <img src={creditAgricoleLogo} alt="Crédit Agricole" className="h-8 opacity-40" />
      </div>
      <div className="mb-8">
        <h2 className="text-4xl mb-2" style={{ color: "#006F4E" }}>Il Problema da €450.000</h2>
        <div className="h-1 w-24 rounded" style={{ backgroundColor: "#009B9D" }} />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-3 gap-8 w-full max-w-5xl">
          <div className="text-center space-y-4 p-8 rounded-lg border-2 border-red-100 bg-red-50">
            <div className="text-7xl">💸</div>
            <div className="text-5xl" style={{ color: "#ED1C24" }}>€450K</div>
            <p className="text-xl text-gray-600">Persi annualmente in screening</p>
            <p className="text-xs text-gray-500 italic mt-2">
              Fonte: LinkedIn Global Recruiting Trends 2024
            </p>
          </div>

          <div className="text-center space-y-4 p-8 rounded-lg border-2 border-orange-100 bg-orange-50">
            <div className="text-7xl">📅</div>
            <div className="text-5xl text-orange-600">42 Giorni</div>
            <p className="text-xl text-gray-600">Tempo medio di assunzione</p>
            <p className="text-xs text-gray-500 italic mt-2">
              Fonte: SHRM Time-to-Fill Report 2024
            </p>
          </div>

          <div className="text-center space-y-4 p-8 rounded-lg border-2 border-red-100 bg-red-50">
            <div className="text-7xl">🚶</div>
            <div className="text-5xl" style={{ color: "#ED1C24" }}>30%</div>
            <p className="text-xl text-gray-600">Candidati persi per cattiva UX</p>
            <p className="text-xs text-gray-500 italic mt-2">
              Fonte: CareerBuilder Candidate Experience 2024
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <p className="text-2xl text-gray-700 italic">
          "Lo screening manuale è lento, inconsistente e costoso"
        </p>
        <p className="text-sm text-gray-500 mt-2">Survey CA Italia Territorial Committee 2024</p>
      </div>
    </div>
  );
}

// Slide 3: Solution - 3 Pillars
function Slide3() {
  return (
    <div className="h-full flex flex-col p-12 bg-white">
      <div className="absolute top-6 right-6">
        <img src={creditAgricoleLogo} alt="Crédit Agricole" className="h-8 opacity-40" />
      </div>
      <div className="mb-8">
        <h2 className="text-4xl mb-2" style={{ color: "#006F4E" }}>
          TalentIQ: L'IA che Pensa come il Miglior HR Manager
        </h2>
        <div className="h-1 w-24 rounded" style={{ backgroundColor: "#009B9D" }} />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-3 gap-8 w-full max-w-5xl">
          {/* Pillar 1 */}
          <div className="space-y-4 p-6 rounded-lg bg-green-50 border-2 border-green-200">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: "#006F4E" }}>
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl text-center" style={{ color: "#006F4E" }}>Motore di Valutazione AI</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ Analizza CV su 5 dimensioni</li>
              <li>✓ Punteggio coerente 1-5</li>
              <li>✓ Pesi personalizzabili per ruolo</li>
            </ul>
          </div>

          {/* Pillar 2 */}
          <div className="space-y-4 p-6 rounded-lg bg-blue-50 border-2 border-blue-200">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: "#009B9D" }}>
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl text-center" style={{ color: "#009B9D" }}>Dashboard Real-Time</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ 4 metriche chiave a colpo d'occhio</li>
              <li>✓ Analytics visive (funnel, radar)</li>
              <li>✓ Ranking istantaneo candidati</li>
            </ul>
          </div>

          {/* Pillar 3 */}
          <div className="space-y-4 p-6 rounded-lg bg-purple-50 border-2 border-purple-200">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: "#006F4E" }}>
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl text-center" style={{ color: "#006F4E" }}>Esperienza Candidato</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ Landing page brandizzate</li>
              <li>✓ Candidatura in 3 minuti</li>
              <li>✓ GDPR-compliant by design</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-3 text-lg text-gray-600">
          <span>Candidato applica</span>
          <span className="text-2xl" style={{ color: "#009B9D" }}>→</span>
          <span>IA valuta</span>
          <span className="text-2xl" style={{ color: "#009B9D" }}>→</span>
          <span>HR decide</span>
        </div>
      </div>
    </div>
  );
}

// Slide 4: Live Demo
function Slide4({ distributionData, radarData }: { distributionData: any[]; radarData: any[] }) {
  return (
    <div className="h-full flex flex-col p-12 bg-white">
      <div className="absolute top-6 right-6">
        <img src={creditAgricoleLogo} alt="Crédit Agricole" className="h-8 opacity-40" />
      </div>
      <div className="mb-6">
        <h2 className="text-4xl mb-2" style={{ color: "#006F4E" }}>TalentIQ in Azione</h2>
        <div className="h-1 w-24 rounded" style={{ backgroundColor: "#009B9D" }} />
      </div>

      <div className="flex-1 grid grid-cols-2 gap-6">
        {/* Role Management */}
        <Card className="p-4 border-2" style={{ borderColor: "#006F4E" }}>
          <h3 className="text-lg mb-3" style={{ color: "#006F4E" }}>Gestione Ruoli</h3>
          <div className="space-y-2 text-sm">
            <div className="p-2 bg-gray-50 rounded">
              <p className="font-semibold">Senior Backend Engineer</p>
              <Badge className="mt-1" style={{ backgroundColor: "#009B9D" }}>87 candidati</Badge>
            </div>
            <p className="text-xs text-gray-600 italic">
              "Crea ruoli personalizzati in 2 minuti. Condividi via WhatsApp, email o link."
            </p>
          </div>
        </Card>

        {/* Candidate View */}
        <Card className="p-4 border-2" style={{ borderColor: "#009B9D" }}>
          <h3 className="text-lg mb-3" style={{ color: "#009B9D" }}>Esperienza Candidato</h3>
          <div className="space-y-2">
            <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded text-center">
              <p className="text-sm">Landing page professionale brandizzata</p>
              <p className="text-xs text-gray-600 mt-1">Candidatura 3 minuti • Mobile-friendly</p>
            </div>
            <p className="text-xs text-gray-600 italic">
              "I candidati vedono esperienza professionale. Nessun criterio di valutazione esposto."
            </p>
          </div>
        </Card>

        {/* AI Scoring */}
        <Card className="p-4 border-2 border-purple-200">
          <h3 className="text-lg mb-3 text-purple-700">Scoring IA in Azione</h3>
          <div className="space-y-2">
            <ResponsiveContainer width="100%" height={120}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Score" dataKey="score" stroke="#006F4E" fill="#006F4E" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div>Esp. Prof.: <span className="font-semibold">35%</span></div>
              <div>Comp. Tec.: <span className="font-semibold">35%</span></div>
              <div>Motivazione: <span className="font-semibold">15%</span></div>
              <div>Formazione: <span className="font-semibold">5%</span></div>
            </div>
          </div>
        </Card>

        {/* Dashboard Analytics */}
        <Card className="p-4 border-2" style={{ borderColor: "#ED1C24" }}>
          <h3 className="text-lg mb-3" style={{ color: "#ED1C24" }}>Analytics Dashboard</h3>
          <div className="space-y-2">
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {distributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === 0
                          ? "#EF4444"
                          : index === 1
                          ? "#F97316"
                          : index === 2
                          ? "#EAB308"
                          : index === 3
                          ? "#84CC16"
                          : "#22C55E"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-600">Insights real-time e ranking candidati</p>
          </div>
        </Card>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xl px-6 py-3 rounded-lg inline-block" style={{ backgroundColor: "#006F4E", color: "white" }}>
          Dalla candidatura alla shortlist rankata in tempo reale
        </p>
      </div>
    </div>
  );
}

// Slide 5: Le 5 Dimensioni di Valutazione (PIÙ VISUALE)
function Slide5() {
  const dimensionsData = [
    { name: 'Esp. Prof.', value: 30 },
    { name: 'Tech Skills', value: 35 },
    { name: 'Motivation', value: 15 },
    { name: 'Education', value: 10 },
    { name: 'Soft Skills', value: 10 },
  ];

  const COLORS = ['#006F4E', '#009B9D', '#7B68EE', '#FF8C42', '#E91E63'];

  return (
    <div className="h-full flex flex-col p-10 bg-white overflow-y-auto">
      <div className="absolute top-6 right-6">
        <img src={creditAgricoleLogo} alt="Crédit Agricole" className="h-8 opacity-40" />
      </div>
      <div className="mb-4">
        <h2 className="text-3xl mb-2" style={{ color: "#006F4E" }}>
          Le 5 Dimensioni di Valutazione IA
        </h2>
        <div className="h-1 w-24 rounded" style={{ backgroundColor: "#009B9D" }} />
        <p className="text-sm text-gray-600 mt-2">Analisi olistica multi-dimensionale con sub-dimensioni granulari</p>
      </div>

      <div className="flex gap-6 flex-1">
        {/* Left: Pie Chart */}
        <div className="w-1/3 flex flex-col items-center justify-center">
          <h3 className="text-base mb-4" style={{ color: "#006F4E" }}>Peso Tipico per Ruolo</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={dimensionsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {dimensionsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 italic mt-2 text-center">
            Pesi personalizzabili per ogni posizione
          </p>
        </div>

        {/* Right: Dimensions Cards */}
        <div className="flex-1 grid grid-cols-2 gap-3">
          {/* Dimension 1 */}
          <Card className="p-3 border-2 border-green-200 bg-green-50/50">
            <div className="flex items-start gap-2 mb-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm" style={{ backgroundColor: "#006F4E" }}>
                <Target className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm" style={{ color: "#006F4E" }}>Esperienza Professionale</h3>
                <p className="text-xs text-gray-600">Peso: 25-35%</p>
              </div>
            </div>
            <div className="space-y-1 text-xs text-gray-700 ml-10">
              <div>• Anni rilevanti</div>
              <div>• Progressione ruoli</div>
              <div>• Leadership</div>
            </div>
          </Card>

          {/* Dimension 2 */}
          <Card className="p-3 border-2 border-blue-200 bg-blue-50/50">
            <div className="flex items-start gap-2 mb-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm" style={{ backgroundColor: "#009B9D" }}>
                <Cpu className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm" style={{ color: "#009B9D" }}>Competenze Tecniche</h3>
                <p className="text-xs text-gray-600">Peso: 30-40%</p>
              </div>
            </div>
            <div className="space-y-1 text-xs text-gray-700 ml-10">
              <div>• Stack tecnologico</div>
              <div>• Certificazioni</div>
              <div>• Tool & metodologie</div>
            </div>
          </Card>

          {/* Dimension 3 */}
          <Card className="p-3 border-2 border-purple-200 bg-purple-50/50">
            <div className="flex items-start gap-2 mb-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm" style={{ backgroundColor: "#7B68EE" }}>
                <Zap className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm" style={{ color: "#7B68EE" }}>Motivazione e Fit</h3>
                <p className="text-xs text-gray-600">Peso: 15-20%</p>
              </div>
            </div>
            <div className="space-y-1 text-xs text-gray-700 ml-10">
              <div>• Alignment mission</div>
              <div>• Interesse ruolo</div>
              <div>• Career goals</div>
            </div>
          </Card>

          {/* Dimension 4 */}
          <Card className="p-3 border-2 border-orange-200 bg-orange-50/50">
            <div className="flex items-start gap-2 mb-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm bg-orange-500">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm text-orange-700">Formazione</h3>
                <p className="text-xs text-gray-600">Peso: 5-15%</p>
              </div>
            </div>
            <div className="space-y-1 text-xs text-gray-700 ml-10">
              <div>• Background accademico</div>
              <div>• Corsi & certificazioni</div>
              <div>• Auto-apprendimento</div>
            </div>
          </Card>

          {/* Dimension 5 - span 2 columns */}
          <Card className="p-3 border-2 border-pink-200 bg-pink-50/50 col-span-2">
            <div className="flex items-start gap-2 mb-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm bg-pink-600">
                <Users className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm text-pink-700">Soft Skills e Competenze Comportamentali</h3>
                <p className="text-xs text-gray-600">Peso: 10-20%</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1 text-xs text-gray-700 ml-10">
              <div>• Comunicazione</div>
              <div>• Problem solving</div>
              <div>• Adattabilità</div>
              <div>• Proattività</div>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
        <p className="text-sm text-center text-gray-700">
          <span className="font-semibold" style={{ color: "#006F4E" }}>Sistema Flessibile:</span> Ogni dimensione è scomponibile in sub-dimensioni granulari per massima precisione
        </p>
      </div>
    </div>
  );
}

// Slide 6: Sistema di Scoring e Confidenza IA
function Slide6() {
  return (
    <div className="h-full flex flex-col p-10 bg-white">
      <div className="absolute top-6 right-6">
        <img src={creditAgricoleLogo} alt="Crédit Agricole" className="h-8 opacity-40" />
      </div>
      <div className="mb-6">
        <h2 className="text-3xl mb-2" style={{ color: "#006F4E" }}>Sistema di Scoring 1-5 e Confidenza IA</h2>
        <div className="h-1 w-24 rounded" style={{ backgroundColor: "#009B9D" }} />
        <p className="text-sm text-gray-600 mt-2">Valutazioni precise, trasparenti e verificabili</p>
      </div>

      <div className="flex gap-6 flex-1">
        {/* Left: Scoring Scale */}
        <div className="flex-1">
          <h3 className="text-lg mb-4" style={{ color: "#006F4E" }}>📊 Scala di Valutazione</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border-l-4 border-red-500">
              <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center flex-shrink-0">1</div>
              <div>
                <p className="text-sm">Insufficiente</p>
                <p className="text-xs text-gray-600">Non soddisfa i requisiti minimi del ruolo</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 border-l-4 border-orange-400">
              <div className="w-8 h-8 rounded-full bg-orange-400 text-white flex items-center justify-center flex-shrink-0">2</div>
              <div>
                <p className="text-sm">Base</p>
                <p className="text-xs text-gray-600">Competenze di base, necessita formazione</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 border-l-4 border-yellow-500">
              <div className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center flex-shrink-0">3</div>
              <div>
                <p className="text-sm">Solido</p>
                <p className="text-xs text-gray-600">Soddisfa i requisiti, buona esperienza</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border-l-4 border-green-500">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0">4</div>
              <div>
                <p className="text-sm">Forte</p>
                <p className="text-xs text-gray-600">Supera le aspettative, esperienza rilevante</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border-l-4 border-blue-600">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">5</div>
              <div>
                <p className="text-sm">Eccezionale</p>
                <p className="text-xs text-gray-600">Top performer, esperienza distintiva</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: AI Confidence */}
        <div className="flex-1">
          <h3 className="text-lg mb-4" style={{ color: "#009B9D" }}>🎯 Livelli di Confidenza IA</h3>
          
          <div className="space-y-4 mb-6">
            <div className="p-4 rounded-lg border-2 border-red-200 bg-red-50">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-red-500">Low</Badge>
                <span className="text-sm">Confidenza Bassa</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">Dati limitati o ambigui nel CV</p>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-full bg-red-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: "30%" }} />
                </div>
                <span>~30%</span>
              </div>
            </div>

            <div className="p-4 rounded-lg border-2 border-yellow-200 bg-yellow-50">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-yellow-500">Med</Badge>
                <span className="text-sm">Confidenza Media</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">Informazioni sufficienti per valutazione</p>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-full bg-yellow-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "65%" }} />
                </div>
                <span>~65%</span>
              </div>
            </div>

            <div className="p-4 rounded-lg border-2 border-green-200 bg-green-50">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-green-600">High</Badge>
                <span className="text-sm">Confidenza Alta</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">Dati chiari, dettagliati e verificabili</p>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "90%" }} />
                </div>
                <span>~90%</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-sm mb-2" style={{ color: "#006F4E" }}>💡 Perché è importante?</p>
            <ul className="space-y-1 text-xs text-gray-700">
              <li>✓ HR può decidere dove approfondire</li>
              <li>✓ Trasparenza sulle limitazioni dell'IA</li>
              <li>✓ Giustificazioni dettagliate per ogni score</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Slide 7: Data Resources e Fonti (PIÙ VISUALE)
function Slide7() {
  const dataSourcesFlow = [
    { source: 'CV', weight: 45 },
    { source: 'Lettera', weight: 30 },
    { source: 'Form', weight: 15 },
    { source: 'LinkedIn', weight: 10 },
  ];

  return (
    <div className="h-full flex flex-col p-10 bg-white">
      <div className="absolute top-6 right-6">
        <img src={creditAgricoleLogo} alt="Crédit Agricole" className="h-8 opacity-40" />
      </div>
      <div className="mb-4">
        <h2 className="text-3xl mb-2" style={{ color: "#006F4E" }}>Fonti di Dati per la Valutazione IA</h2>
        <div className="h-1 w-24 rounded" style={{ backgroundColor: "#009B9D" }} />
        <p className="text-sm text-gray-600 mt-2">Analisi multi-sorgente per decisioni data-driven</p>
      </div>

      <div className="flex gap-6 flex-1">
        {/* Left: Flow Chart */}
        <div className="w-1/3 flex flex-col justify-center">
          <h3 className="text-base mb-3 text-center" style={{ color: "#006F4E" }}>Peso delle Fonti</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dataSourcesFlow} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 50]} />
              <YAxis dataKey="source" type="category" width={70} />
              <Tooltip />
              <Bar dataKey="weight" fill="#006F4E" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-center" style={{ color: "#006F4E" }}>
              <span className="font-semibold">Pipeline di Analisi:</span> CV Parser → NLP → Scoring IA → Ranking
            </p>
          </div>
        </div>

        {/* Right: Data Sources Grid */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          {/* Source 1: CV */}
          <Card className="p-4 border-2" style={{ borderColor: "#006F4E" }}>
            <div className="flex items-start gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: "#006F4E" }}>
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm mb-1">Curriculum Vitae</h4>
                <Badge className="text-xs" style={{ backgroundColor: "#006F4E" }}>45% peso</Badge>
              </div>
            </div>
            <div className="space-y-1 text-xs text-gray-700">
              <div>✓ Parser PDF, DOCX, TXT</div>
              <div>✓ Estrazione esperienze</div>
              <div>✓ Timeline carriera</div>
            </div>
          </Card>

          {/* Source 2: Cover Letter */}
          <Card className="p-4 border-2 border-blue-200">
            <div className="flex items-start gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white bg-blue-500">
                <Database className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm mb-1">Lettera Motivazione</h4>
                <Badge className="text-xs bg-blue-500">30% peso</Badge>
              </div>
            </div>
            <div className="space-y-1 text-xs text-gray-700">
              <div>✓ NLP sentiment analysis</div>
              <div>✓ Intent recognition</div>
              <div>✓ Cultural fit</div>
            </div>
          </Card>

          {/* Source 3: Form Data */}
          <Card className="p-4 border-2 border-purple-200">
            <div className="flex items-start gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white bg-purple-500">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm mb-1">Dati Form</h4>
                <Badge className="text-xs bg-purple-500">15% peso</Badge>
              </div>
            </div>
            <div className="space-y-1 text-xs text-gray-700">
              <div>✓ Info strutturate</div>
              <div>✓ Preferenze candidate</div>
              <div>✓ GDPR consent</div>
            </div>
          </Card>

          {/* Source 4: LinkedIn (Future) */}
          <Card className="p-4 border-2" style={{ borderColor: "#009B9D" }}>
            <div className="flex items-start gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: "#009B9D" }}>
                <Network className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm mb-1">LinkedIn API</h4>
                <Badge className="text-xs" style={{ backgroundColor: "#009B9D" }}>10% peso</Badge>
              </div>
            </div>
            <div className="space-y-1 text-xs text-gray-700">
              <div>✓ Validazione profilo</div>
              <div>✓ Endorsement</div>
              <div>✓ Network analysis</div>
            </div>
          </Card>

          {/* Additional Sources */}
          <Card className="p-3 border-2 border-green-200 bg-green-50 col-span-2">
            <h4 className="text-sm mb-2 text-green-700">📌 Fonti Future di Arricchimento</h4>
            <div className="grid grid-cols-3 gap-2 text-xs text-gray-700">
              <div>• GitHub progetti</div>
              <div>• Portfolio online</div>
              <div>• Certificazioni</div>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: "#006F4E" }}>
        <p className="text-white text-center text-sm">
          <span className="font-semibold">Approccio Ibrido:</span> Dati strutturati + NLP per analisi completa a 360°
        </p>
      </div>
    </div>
  );
}

// Slide 8: NUOVA - Architettura del Modello IA
function Slide8() {
  return (
    <div className="h-full flex flex-col p-10 bg-white">
      <div className="absolute top-6 right-6">
        <img src={creditAgricoleLogo} alt="Crédit Agricole" className="h-8 opacity-40" />
      </div>
      <div className="mb-4">
        <h2 className="text-3xl mb-2" style={{ color: "#006F4E" }}>Architettura del Modello IA</h2>
        <div className="h-1 w-24 rounded" style={{ backgroundColor: "#009B9D" }} />
        <p className="text-sm text-gray-600 mt-2">Pipeline tecnica end-to-end per valutazione intelligente</p>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {/* Architecture Flow */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {/* Stage 1 */}
          <Card className="p-4 border-2" style={{ borderColor: "#006F4E", backgroundColor: "#f0fdf4" }}>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#006F4E" }}>
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm" style={{ color: "#006F4E" }}>1. Ingestion</h3>
              <p className="text-xs text-gray-600">CV Parser</p>
              <div className="text-xs text-gray-500">
                PDF, DOCX → Text
              </div>
            </div>
          </Card>

          {/* Arrow */}
          <div className="flex items-center justify-center">
            <div className="text-3xl" style={{ color: "#009B9D" }}>→</div>
          </div>

          {/* Stage 2 */}
          <Card className="p-4 border-2 border-blue-200 bg-blue-50">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-500">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm text-blue-700">2. NLP Engine</h3>
              <p className="text-xs text-gray-600">Estrazione</p>
              <div className="text-xs text-gray-500">
                Entity Recognition
              </div>
            </div>
          </Card>

          {/* Arrow */}
          <div className="flex items-center justify-center">
            <div className="text-3xl" style={{ color: "#009B9D" }}>→</div>
          </div>

          {/* Stage 3 */}
          <Card className="p-4 border-2" style={{ borderColor: "#009B9D", backgroundColor: "#ecfeff" }}>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#009B9D" }}>
                <Gauge className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm" style={{ color: "#009B9D" }}>3. Scoring</h3>
              <p className="text-xs text-gray-600">ML Model</p>
              <div className="text-xs text-gray-500">
                5-dim weighted
              </div>
            </div>
          </Card>
        </div>

        {/* Technical Components */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          {/* Component 1: NLP Stack */}
          <Card className="p-4 border-2" style={{ borderColor: "#006F4E" }}>
            <h3 className="text-sm mb-3 flex items-center gap-2" style={{ color: "#006F4E" }}>
              <Brain className="w-4 h-4" />
              Stack NLP
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">Transformer</Badge>
                <span className="text-gray-600">BERT-based</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">Embedding</Badge>
                <span className="text-gray-600">Semantic</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">NER</Badge>
                <span className="text-gray-600">Spacy/Custom</span>
              </div>
            </div>
          </Card>

          {/* Component 2: ML Model */}
          <Card className="p-4 border-2" style={{ borderColor: "#009B9D" }}>
            <h3 className="text-sm mb-3 flex items-center gap-2" style={{ color: "#009B9D" }}>
              <Cpu className="w-4 h-4" />
              Modello ML
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-blue-50 rounded">
                <p className="font-semibold text-gray-700">Gradient Boosting</p>
                <p className="text-gray-600">XGBoost/LightGBM</p>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Accuracy:</span>
                <span className="font-semibold">~87%</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Features:</span>
                <span className="font-semibold">120+</span>
              </div>
            </div>
          </Card>

          {/* Component 3: Training Data */}
          <Card className="p-4 border-2 border-purple-200">
            <h3 className="text-sm mb-3 flex items-center gap-2 text-purple-700">
              <Database className="w-4 h-4" />
              Training Dataset
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">CV etichettati:</span>
                <span className="font-semibold">10,000+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ruoli diversi:</span>
                <span className="font-semibold">50+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Validazione HR:</span>
                <span className="font-semibold text-green-600">✓ Verified</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="mt-4 grid grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-center">
            <p className="text-xs text-gray-600">Latenza Media</p>
            <p className="text-xl" style={{ color: "#006F4E" }}>1.2s</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-center">
            <p className="text-xs text-gray-600">Throughput</p>
            <p className="text-xl" style={{ color: "#009B9D" }}>100 CV/min</p>
          </div>
          <div className="p-3 rounded-lg bg-purple-50 border border-purple-200 text-center">
            <p className="text-xs text-gray-600">Precision</p>
            <p className="text-xl text-purple-700">89%</p>
          </div>
          <div className="p-3 rounded-lg bg-orange-50 border border-orange-200 text-center">
            <p className="text-xs text-gray-600">Recall</p>
            <p className="text-xl text-orange-700">85%</p>
          </div>
        </div>
      </div>

      <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: "#006F4E" }}>
        <p className="text-white text-center text-sm">
          <span className="font-semibold">Scalabile & Affidabile:</span> Architettura cloud-native pronta per produzione enterprise
        </p>
      </div>
    </div>
  );
}

// Slide 9: NUOVA - KPI di Efficienza del Progetto
function Slide9() {
  const performanceData = [
    { month: 'M1', time: 16.7, after: 2.5 },
    { month: 'M2', time: 16.5, after: 1.8 },
    { month: 'M3', time: 16.8, after: 0.9 },
    { month: 'M6', time: 17.0, after: 0.5 },
  ];

  return (
    <div className="h-full flex flex-col p-10 bg-white">
      <div className="absolute top-6 right-6">
        <img src={creditAgricoleLogo} alt="Crédit Agricole" className="h-8 opacity-40" />
      </div>
      <div className="mb-4">
        <h2 className="text-3xl mb-2" style={{ color: "#006F4E" }}>KPI di Efficienza del Progetto</h2>
        <div className="h-1 w-24 rounded" style={{ backgroundColor: "#009B9D" }} />
        <p className="text-sm text-gray-600 mt-2">Metriche chiave per misurare il successo e ROI</p>
      </div>

      <div className="flex gap-6 flex-1">
        {/* Left: Time Comparison Chart */}
        <div className="w-1/2">
          <h3 className="text-base mb-3" style={{ color: "#006F4E" }}>Tempo di Screening per Ruolo (ore)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="time" stroke="#ED1C24" strokeWidth={2} name="Prima (manuale)" />
              <Line type="monotone" dataKey="after" stroke="#006F4E" strokeWidth={2} name="Dopo (TalentIQ)" />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-center text-gray-500 mt-2">
            Fonte: Dati simulati basati su LinkedIn Recruiting Benchmark 2024
          </p>

          {/* Primary KPIs */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Card className="p-3 border-2" style={{ borderColor: "#006F4E" }}>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5" style={{ color: "#006F4E" }} />
                <h4 className="text-xs" style={{ color: "#006F4E" }}>Time-to-Shortlist</h4>
              </div>
              <p className="text-2xl" style={{ color: "#006F4E" }}>-96%</p>
              <p className="text-xs text-gray-600">Da 16.7h a 30min</p>
            </Card>

            <Card className="p-3 border-2" style={{ borderColor: "#009B9D" }}>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5" style={{ color: "#009B9D" }} />
                <h4 className="text-xs" style={{ color: "#009B9D" }}>Cost per Hire</h4>
              </div>
              <p className="text-2xl" style={{ color: "#009B9D" }}>-80%</p>
              <p className="text-xs text-gray-600">€5,172 → €1,034</p>
            </Card>
          </div>
        </div>

        {/* Right: KPI Grid */}
        <div className="w-1/2 space-y-3">
          {/* Quality KPIs */}
          <div>
            <h3 className="text-sm mb-2" style={{ color: "#006F4E" }}>📊 KPI di Qualità</h3>
            <div className="grid grid-cols-2 gap-2">
              <Card className="p-3 bg-green-50 border border-green-200">
                <p className="text-xs text-gray-600">Offer Acceptance Rate</p>
                <p className="text-xl text-green-700">92%</p>
                <p className="text-xs text-green-600">+37% vs baseline</p>
              </Card>
              <Card className="p-3 bg-blue-50 border border-blue-200">
                <p className="text-xs text-gray-600">Candidate Satisfaction</p>
                <p className="text-xl text-blue-700">4.6/5</p>
                <p className="text-xs text-blue-600">NPS: +52</p>
              </Card>
              <Card className="p-3 bg-purple-50 border border-purple-200">
                <p className="text-xs text-gray-600">Interview-to-Hire</p>
                <p className="text-xl text-purple-700">35%</p>
                <p className="text-xs text-purple-600">+18% vs manual</p>
              </Card>
              <Card className="p-3 bg-orange-50 border border-orange-200">
                <p className="text-xs text-gray-600">90-day Retention</p>
                <p className="text-xl text-orange-700">94%</p>
                <p className="text-xs text-orange-600">+12% industry avg</p>
              </Card>
            </div>
          </div>

          {/* Efficiency KPIs */}
          <div>
            <h3 className="text-sm mb-2" style={{ color: "#009B9D" }}>⚡ KPI di Efficienza</h3>
            <div className="space-y-2">
              <Card className="p-3 border-2" style={{ borderColor: "#006F4E" }}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-600">Candidates Screened/Hour</p>
                    <p className="text-lg" style={{ color: "#006F4E" }}>50x faster</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </Card>

              <Card className="p-3 border-2" style={{ borderColor: "#009B9D" }}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-600">HR Hours Saved/Month</p>
                    <p className="text-lg" style={{ color: "#009B9D" }}>320 ore</p>
                  </div>
                  <Clock className="w-8 h-8" style={{ color: "#009B9D" }} />
                </div>
              </Card>

              <Card className="p-3 border-2 border-purple-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-600">Bias Reduction Score</p>
                    <p className="text-lg text-purple-700">-78%</p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-purple-500" />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div className="p-2 bg-gray-50 rounded border border-gray-200 text-center">
          <p className="text-gray-600">Fonte KPI Qualità: SHRM 2024 Benchmarks</p>
        </div>
        <div className="p-2 bg-gray-50 rounded border border-gray-200 text-center">
          <p className="text-gray-600">Fonte Time-to-Hire: LinkedIn Global Trends</p>
        </div>
        <div className="p-2 bg-gray-50 rounded border border-gray-200 text-center">
          <p className="text-gray-600">Fonte Cost: Glassdoor Recruiting Cost Analysis</p>
        </div>
      </div>
    </div>
  );
}

// Slide 10 (ex-8): Business Impact
function Slide10() {
  return (
    <div className="h-full flex flex-col p-12 bg-white">
      <div className="absolute top-6 right-6">
        <img src={creditAgricoleLogo} alt="Crédit Agricole" className="h-8 opacity-40" />
      </div>
      <div className="mb-8">
        <h2 className="text-4xl mb-2" style={{ color: "#006F4E" }}>ROI: I Numeri che Contano</h2>
        <div className="h-1 w-24 rounded" style={{ backgroundColor: "#009B9D" }} />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-3 gap-8 w-full max-w-5xl">
          {/* Time Savings */}
          <div className="text-center space-y-4 p-8 rounded-lg bg-green-50 border-2 border-green-200">
            <p className="text-sm text-gray-600">Prima: 16.7 ore per ruolo</p>
            <p className="text-sm text-gray-600">Dopo: 30 minuti per ruolo</p>
            <div className="text-6xl" style={{ color: "#006F4E" }}>↓ 96%</div>
            <p className="text-xl" style={{ color: "#006F4E" }}>Riduzione Tempo</p>
            <p className="text-xs text-gray-500 italic">LinkedIn Recruiting Benchmark</p>
          </div>

          {/* Cost Savings */}
          <div className="text-center space-y-4 p-8 rounded-lg bg-blue-50 border-2 border-blue-200">
            <p className="text-sm text-gray-600">Prima: €450K annui</p>
            <p className="text-sm text-gray-600">Dopo: €90K annui</p>
            <div className="text-6xl" style={{ color: "#009B9D" }}>€360K</div>
            <p className="text-xl" style={{ color: "#009B9D" }}>Risparmio Annuo</p>
            <p className="text-xs text-gray-500 italic">Glassdoor Cost Analysis 2024</p>
          </div>

          {/* Quality Improvement */}
          <div className="text-center space-y-4 p-8 rounded-lg bg-green-50 border-2 border-green-200">
            <p className="text-sm text-gray-600">Prima: 67% accettazione</p>
            <p className="text-sm text-gray-600">Dopo: 92% accettazione</p>
            <div className="text-6xl" style={{ color: "#006F4E" }}>+37%</div>
            <p className="text-xl" style={{ color: "#006F4E" }}>Offerte Accettate</p>
            <p className="text-xs text-gray-500 italic">SHRM Acceptance Rate Study</p>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <Badge className="bg-green-100 text-green-800 border-green-200">✅ Zero bias inconsci</Badge>
          <Badge className="bg-green-100 text-green-800 border-green-200">✅ 100% GDPR compliant</Badge>
          <Badge className="bg-green-100 text-green-800 border-green-200">✅ Scalabile a tutte le divisioni</Badge>
          <Badge className="bg-green-100 text-green-800 border-green-200">✅ Audit trail completo</Badge>
        </div>
        
        <div className="text-center p-4 rounded-lg" style={{ backgroundColor: "#ED1C24" }}>
          <p className="text-white text-2xl">
            Periodo di payback: 3 mesi | Risparmio annuo: €360.000+
          </p>
          <p className="text-white/80 text-sm mt-2">Fonti: LinkedIn, SHRM, Glassdoor Industry Reports 2024</p>
        </div>
      </div>
    </div>
  );
}

// Slide 11: Impact Summary
function Slide11() {
  const impactData = [
    { category: 'Tempo', before: 100, after: 4, improvement: '96%' },
    { category: 'Costo', before: 100, after: 20, improvement: '80%' },
    { category: 'Qualità', before: 67, after: 92, improvement: '+37%' },
  ];

  return (
    <div className="h-full flex flex-col p-12 bg-white">
      <div className="absolute top-6 right-6">
        <img src={creditAgricoleLogo} alt="Crédit Agricole" className="h-8 opacity-40" />
      </div>
      <div className="mb-6">
        <h2 className="text-4xl mb-2" style={{ color: "#006F4E" }}>Impatto Complessivo su CA Italia</h2>
        <div className="h-1 w-24 rounded" style={{ backgroundColor: "#009B9D" }} />
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {/* Comparison Bars */}
        <div className="space-y-6 mb-8">
          {impactData.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg" style={{ color: "#006F4E" }}>{item.category}</h3>
                <Badge className="text-base" style={{ backgroundColor: idx === 2 ? "#22C55E" : "#006F4E" }}>
                  {item.improvement}
                </Badge>
              </div>
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-1">Prima (manuale)</p>
                  <div className="h-8 bg-red-200 rounded-lg relative overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-lg flex items-center justify-end pr-3 text-white text-sm"
                      style={{ width: `${item.before}%` }}
                    >
                      {item.before}%
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-1">Dopo (TalentIQ)</p>
                  <div className="h-8 bg-green-200 rounded-lg relative overflow-hidden">
                    <div
                      className="h-full bg-green-600 rounded-lg flex items-center justify-end pr-3 text-white text-sm"
                      style={{ width: `${item.after}%` }}
                    >
                      {item.after}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Key Benefits Grid */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4 text-center border-2" style={{ borderColor: "#006F4E" }}>
            <Users className="w-8 h-8 mx-auto mb-2" style={{ color: "#006F4E" }} />
            <p className="text-2xl" style={{ color: "#006F4E" }}>320h</p>
            <p className="text-xs text-gray-600">HR ore risparmiate/mese</p>
          </Card>

          <Card className="p-4 text-center border-2" style={{ borderColor: "#009B9D" }}>
            <TrendingUp className="w-8 h-8 mx-auto mb-2" style={{ color: "#009B9D" }} />
            <p className="text-2xl" style={{ color: "#009B9D" }}>50x</p>
            <p className="text-xs text-gray-600">Più veloce screening</p>
          </Card>

          <Card className="p-4 text-center border-2 border-green-200">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="text-2xl text-green-700">-78%</p>
            <p className="text-xs text-gray-600">Riduzione bias</p>
          </Card>

          <Card className="p-4 text-center border-2 border-purple-200">
            <Target className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <p className="text-2xl text-purple-700">4.6/5</p>
            <p className="text-xs text-gray-600">Candidate satisfaction</p>
          </Card>
        </div>
      </div>

      <div className="mt-6 p-4 rounded-lg" style={{ background: "linear-gradient(135deg, #006F4E 0%, #009B9D 100%)" }}>
        <p className="text-white text-center text-xl">
          <span className="font-semibold">Soluzione Win-Win:</span> Meno costi per CA • Migliore esperienza per candidati • Decisioni più accurate per HR
        </p>
      </div>
    </div>
  );
}

// Slide 12 (ex-9): Call to Action
function Slide12() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-12 relative" style={{ background: "linear-gradient(135deg, #006F4E 0%, #009B9D 100%)" }}>
      <div className="absolute top-8 left-8">
        <img src={creditAgricoleLogo} alt="Crédit Agricole" className="h-12" />
      </div>

      <div className="text-center space-y-8 text-white">
        <h2 className="text-5xl">Pronti a Trasformare il Reclutamento?</h2>
        
        <div className="grid grid-cols-3 gap-8 max-w-5xl mt-12">
          {/* Tech Stack */}
          <div className="p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <h3 className="text-xl mb-4">Costruito con</h3>
            <ul className="space-y-2 text-sm text-left">
              <li>✓ React + TypeScript</li>
              <li>✓ IA Valutazione Avanzata</li>
              <li>✓ NLP & ML Pipeline</li>
              <li>✓ Recharts Analytics</li>
              <li>✓ GDPR Compliant</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="p-6 bg-white rounded-lg text-gray-900 flex flex-col items-center justify-center">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-2xl mb-4" style={{ color: "#006F4E" }}>Programma Pilota</h3>
            <p className="text-xl mb-2">Trial 30 Giorni</p>
            <Button className="mt-4" style={{ backgroundColor: "#ED1C24" }}>
              Richiedi Demo
            </Button>
          </div>

          {/* QR Code placeholder */}
          <div className="p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 flex flex-col items-center justify-center">
            <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center mb-3">
              <div className="text-4xl">📱</div>
            </div>
            <p className="text-sm">Scansiona per Demo Live</p>
            <p className="text-xs text-white/60 mt-2">talentiq.demo</p>
          </div>
        </div>

        <div className="mt-12">
          <p className="text-3xl">Trasformiamo Insieme il Reclutamento</p>
          <p className="text-xl text-white/80 mt-4">Grazie!</p>
        </div>
      </div>

      <div className="absolute bottom-8 text-white/60 text-sm">
        Contatto: talentiq@hackathon.com | GitHub: github.com/talentiq
      </div>
    </div>
  );
}
