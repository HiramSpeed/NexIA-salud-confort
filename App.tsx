
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Shield, Truck, Calendar, MessageCircle, Heart, CheckCircle, Info, Upload, ChevronLeft, ChevronRight, Filter, MapPin, Clock, Building2, Zap, Phone, Mail, Send, Facebook, Instagram, Lock, Eye, UserCheck, ShieldAlert, Sparkles, FileText, X, Bot, User, RotateCcw, Menu as MenuIcon } from 'lucide-react';
import { CATALOG } from './constants';
import { MedicalEquipment, ComplianceState } from './types';
import { streamAIRecommendation, ChatMessage } from './services/geminiService';

const CATEGORIES = [
  'Todos',
  'Sillas de Ruedas',
  'Camas Hospitalarias',
  'Oxígeno y Respiratorio',
  'Rehabilitación',
  'Movilidad',
  'Accesorios'
];

const COBERTURA = [
  { ciudad: 'Celaya (Centro)', tiempo: '1-2 Horas', costo: 'Gratis', color: 'bg-blue-600' },
  { ciudad: 'Cortazar', tiempo: '2-3 Horas', costo: '$150 MXN', color: 'bg-indigo-600' },
  { ciudad: 'Villagrán', tiempo: '2-3 Horas', costo: '$150 MXN', color: 'bg-indigo-600' },
  { ciudad: 'Apaseo el Grande', tiempo: '3-4 Horas', costo: '$200 MXN', color: 'bg-slate-700' },
  { ciudad: 'Apaseo el Alto', tiempo: '4-5 Horas', costo: '$300 MXN', color: 'bg-slate-700' },
  { ciudad: 'Comonfort', tiempo: '4-5 Horas', costo: '$300 MXN', color: 'bg-slate-700' },
];

const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  const cleanText = text.split('[ACTION:')[0];
  const parts = cleanText.split(/(\*\*.*?\*\*)/g);
  return (
    <span className="whitespace-pre-wrap leading-relaxed">
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-black text-slate-900">{part.slice(2, -2)}</strong>;
        }
        return part;
      })}
    </span>
  );
};

const ProductCarousel: React.FC<{ images: string[]; name: string }> = ({ images, name }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const nextSlide = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1)); };
  const prevSlide = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1)); };

  return (
    <div className="relative h-56 overflow-hidden group/carousel">
      <div className="flex transition-transform duration-500 ease-out h-full" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((img, idx) => (
          <img key={idx} src={img} alt={`${name} - Vista ${idx + 1}`} loading="lazy" className="w-full h-full object-cover shrink-0" />
        ))}
      </div>
      <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-slate-800 opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-white shadow-md z-10">
        <ChevronLeft size={18} />
      </button>
      <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-slate-800 opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-white shadow-md z-10">
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'catalogo' | 'bajio' | 'contacto'>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MedicalEquipment | null>(null);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [compliance, setCompliance] = useState<ComplianceState>({ hasConsentedPrivacy: false, documentsUploaded: false });
  const [showComplianceModal, setShowComplianceModal] = useState(false);
  const [showLawModal, setShowLawModal] = useState(false);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [pendingImage, setPendingImage] = useState<{data: string, mimeType: string} | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'Todos') return CATALOG;
    return CATALOG.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [view]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setPendingImage({ data: base64, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIQuery = async () => {
    if (!aiInput.trim() && !pendingImage) return;

    const userMsg: ChatMessage = { 
      role: 'user', 
      text: aiInput || "Analiza esta receta médica.", 
      image: pendingImage || undefined 
    };
    
    setMessages(prev => [...prev, userMsg]);
    setAiInput('');
    setPendingImage(null);
    setIsTyping(true);

    let fullResponse = '';
    const newMsgIndex = messages.length + 1;

    try {
      await streamAIRecommendation([...messages, userMsg], (chunk) => {
        fullResponse += chunk;
        setMessages(prev => {
          const updated = [...prev];
          if (updated[newMsgIndex]) {
            updated[newMsgIndex] = { role: 'model', text: fullResponse };
          } else {
            updated.push({ role: 'model', text: fullResponse });
          }
          return updated;
        });
      });

      const actionMatch = fullResponse.match(/\[ACTION:FILTER_CATEGORY:(.+?)\]/);
      if (actionMatch) {
        const category = actionMatch[1].trim();
        if (CATEGORIES.includes(category)) {
          setTimeout(() => {
            setActiveCategory(category);
            setView('catalogo');
            window.scrollTo({ top: document.getElementById('catalogo-top')?.offsetTop || 0, behavior: 'smooth' });
          }, 1500);
        }
      }
    } finally {
      setIsTyping(false);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setAiInput('');
    setPendingImage(null);
    setIsTyping(false);
  };

  const handleRentClick = (product: MedicalEquipment) => {
    setSelectedProduct(product);
    setShowComplianceModal(true);
  };

  const handleWhatsAppRedirect = () => {
    if (!selectedProduct) return;
    const msg = encodeURIComponent(`Hola NexIA Salud & Confort, me interesa rentar el equipo: ${selectedProduct.name}. Ya acepté el aviso LFPDPPP.`);
    window.open(`https://wa.me/524611807955?text=${msg}`, '_blank');
  };

  const navLinks = [
    { id: 'home', label: 'Inicio' },
    { id: 'catalogo', label: 'Catálogo' },
    { id: 'bajio', label: 'Celaya & Bajío' },
    { id: 'contacto', label: 'Contacto' }
  ];

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setView('home')}>
            <Heart className="text-blue-600 fill-blue-600 group-hover:scale-110 transition-transform" />
            <h1 className="font-bold text-lg sm:text-xl tracking-tight text-slate-800">
              NexIA <span className="text-blue-600">Salud & Confort</span>
            </h1>
          </div>

          <nav className="hidden lg:flex gap-8 text-sm font-semibold text-slate-600 uppercase tracking-wide">
            {navLinks.map(link => (
              <button 
                key={link.id}
                onClick={() => setView(link.id as any)} 
                className={`transition-colors relative py-1 ${view === link.id ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600' : 'hover:text-blue-600'}`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
             <button onClick={() => setShowLawModal(true)} className="hidden sm:flex text-[10px] bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full items-center gap-1.5 font-bold uppercase tracking-widest border border-blue-100 hover:bg-blue-600 hover:text-white transition-all">
               <Shield size={12} /> LFPDPPP
             </button>
             <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all active:scale-90">
               {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
             </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-16 z-[90] animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsMenuOpen(false)}></div>
            <nav className="absolute right-0 top-0 h-[calc(100vh-4rem)] w-3/4 max-w-sm bg-white shadow-2xl p-8 flex flex-col gap-6 animate-in slide-in-from-right duration-500">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Navegación</div>
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => setView(link.id as any)}
                  className={`flex items-center justify-between text-lg font-black uppercase tracking-tighter py-4 px-6 rounded-2xl transition-all ${
                    view === link.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                  {view === link.id && <ChevronRight size={20} />}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      <div className="flex-1">
        {view === 'home' && (
          <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 py-12 md:py-20 px-4 relative overflow-hidden min-h-[700px] flex items-center">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start w-full">
              <div className="text-white z-10 animate-in fade-in slide-in-from-left duration-700 pt-8 lg:pt-12 text-center lg:text-left">
                <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-6 inline-block">Calidad Grado Médico</span>
                <h2 className="text-4xl md:text-6xl font-black mb-6 leading-[1.1] tracking-tight">Equipamiento que cuida a <span className="text-blue-300">quienes amas.</span></h2>
                <p className="text-blue-100 text-base md:text-lg mb-8 max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed">Renta de equipo certificado en Celaya con logística de proximidad y cumplimiento legal AES-256.</p>
                <button onClick={() => setView('catalogo')} className="bg-white text-blue-700 px-8 py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl inline-flex items-center gap-3">
                  Ver Catálogo <ChevronRight size={18} />
                </button>
              </div>

              <div className="relative z-10 animate-in fade-in slide-in-from-right duration-700">
                <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 flex flex-col h-[550px] md:h-[600px]">
                  <div className="bg-slate-900 p-6 flex items-center justify-between text-white shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center animate-pulse shadow-lg shadow-blue-500/20">
                        <Bot size={22} />
                      </div>
                      <div>
                        <h4 className="font-black uppercase text-[10px] md:text-xs tracking-widest">Concierge Médico</h4>
                        <p className="text-[10px] text-blue-400 font-bold uppercase">NexIA AI Enabled</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={resetChat} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/5 group" title="Nueva Conversación">
                        <RotateCcw size={18} className="text-blue-400 group-hover:rotate-[-45deg] transition-transform" />
                      </button>
                      <Sparkles className="text-blue-500" size={20} />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 bg-slate-50/50 scroll-smooth">
                    {messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center px-8 opacity-40">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                          <MessageCircle size={40} className="text-slate-300" />
                        </div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                          Hola, soy tu asistente experto de NexIA.<br/>¿En qué equipo médico puedo ayudarte hoy?
                        </p>
                      </div>
                    ) : (
                      messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
                          <div className={`max-w-[90%] p-5 rounded-3xl text-sm font-medium ${
                            msg.role === 'user' 
                            ? 'bg-blue-600 text-white rounded-tr-none shadow-md' 
                            : 'bg-white text-slate-700 shadow-sm border border-slate-200 rounded-tl-none'
                          }`}>
                            {msg.image && (
                              <img src={`data:${msg.image.mimeType};base64,${msg.image.data}`} className="mb-4 rounded-xl max-h-48 w-full object-cover border border-white/20 shadow-sm" alt="Receta" />
                            )}
                            <FormattedText text={msg.text} />
                          </div>
                        </div>
                      ))
                    )}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white p-5 rounded-3xl rounded-tl-none shadow-sm border border-slate-200">
                          <div className="flex gap-1.5">
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  <div className="p-4 bg-white border-t border-slate-100">
                    {pendingImage && (
                      <div className="mb-3 px-4 py-2 bg-blue-50 rounded-2xl flex items-center justify-between border border-blue-100">
                        <div className="flex items-center gap-2">
                          <FileText size={14} className="text-blue-600" />
                          <span className="text-[10px] font-black uppercase text-blue-700">Receta Cargada</span>
                        </div>
                        <button onClick={() => setPendingImage(null)} className="text-blue-400 hover:text-red-500"><X size={16} /></button>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button onClick={() => fileInputRef.current?.click()} className="bg-slate-50 p-4 rounded-2xl text-slate-400 hover:bg-blue-50 transition-all border border-slate-200">
                        <FileText size={20} />
                      </button>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                      <input 
                        type="text" 
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 md:px-6 py-4 text-sm font-medium outline-none focus:ring-2 ring-blue-500/20"
                        placeholder="Ej: Necesito oxígeno 24/7..."
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAIQuery()}
                      />
                      <button onClick={handleAIQuery} className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg active:scale-95">
                        <Send size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {view === 'catalogo' && (
          <main id="catalogo-top" className="max-w-7xl mx-auto px-4 py-12 md:py-20 flex-1 w-full animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div className="max-w-xl text-center md:text-left">
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter mb-3">Catálogo de Equipos</h3>
                <p className="text-slate-500 font-medium">Equipos certificados y sanitizados listos para entrega inmediata en el Bajío.</p>
              </div>
            </div>

            <div className="flex overflow-x-auto pb-4 mb-10 gap-2 no-scrollbar -mx-4 px-4 scrollbar-hide">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all border ${
                    activeCategory === cat 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-105' 
                    : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col">
                  <ProductCarousel images={product.images} name={product.name} />
                  <div className="p-8 flex flex-col flex-1">
                    <h4 className="text-xl font-black text-slate-900 uppercase mb-4 tracking-tight">{product.name}</h4>
                    <p className="text-slate-500 text-sm mb-8 line-clamp-3 font-medium leading-relaxed">{product.description}</p>
                    <button 
                      onClick={() => handleRentClick(product)}
                      className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all"
                    >
                      Rentar Equipo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        )}

        {view === 'bajio' && (
          <main className="max-w-7xl mx-auto px-4 py-12 md:py-20 flex-1 w-full animate-in slide-in-from-right duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-blue-600 font-black text-xs uppercase tracking-[0.3em] mb-4">
                  <MapPin size={16} /> Cobertura Local Bajío
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-8 leading-[1.1]">
                  Estamos donde nos <span className="text-blue-600">necesites</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm text-center lg:text-left">
                    <div className="bg-blue-100 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 mb-4 mx-auto lg:mx-0">
                      <Zap size={24} fill="currentColor" />
                    </div>
                    <h4 className="font-black text-slate-900 uppercase text-sm mb-2">Entrega Express</h4>
                    <p className="text-xs text-slate-500 font-medium">Instalación en menos de 2 horas en Celaya.</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900 rounded-[3rem] p-8 md:p-10 relative overflow-hidden shadow-2xl">
                <h3 className="text-white font-black uppercase tracking-widest text-sm mb-8 flex items-center gap-2">
                  <Clock size={18} className="text-blue-500" /> Tiempos de Entrega
                </h3>
                <div className="space-y-4">
                  {COBERTURA.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                      <span className="text-white font-bold text-sm">{item.ciudad}</span>
                      <span className="text-blue-400 font-black text-[10px] md:text-xs uppercase">{item.tiempo}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        )}

        {view === 'contacto' && (
          <main className="max-w-7xl mx-auto px-4 py-12 md:py-20 flex-1 w-full animate-in slide-in-from-bottom duration-500">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-4">Ponte en Contacto</h2>
              <p className="text-slate-500 font-medium">Atención inmediata para emergencias y consultas médicas NexIA.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                  <div className="flex gap-3 mb-6">
                    <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center text-blue-600 transition-transform group-hover:scale-110"><Phone size={28} /></div>
                    <div className="bg-green-50 w-14 h-14 rounded-2xl flex items-center justify-center text-green-600 transition-transform group-hover:scale-110 delay-75"><MessageCircle size={28} /></div>
                  </div>
                  <h4 className="font-black text-slate-900 uppercase text-sm tracking-widest mb-2">Atención Directa</h4>
                  <p className="text-slate-700 font-bold text-lg md:text-xl">+52 (461) 180 7955</p>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Llamadas & WhatsApp 24/7</p>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-700"></div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
                  <h4 className="font-black uppercase text-xs tracking-widest mb-4 text-blue-400">Nuestra Ubicación</h4>
                  <p className="text-sm font-medium leading-relaxed mb-6">Zona Centro, Celaya, Guanajuato.<br/>Cobertura en todo el Bajío.</p>
                  <div className="flex gap-4">
                    <div className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors cursor-pointer"><Facebook size={20} /></div>
                    <div className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors cursor-pointer"><Instagram size={20} /></div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-xl relative">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nombre Completo</label>
                        <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-blue-500/20 font-medium" placeholder="Juan Pérez" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Correo Electrónico</label>
                        <input type="email" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-blue-500/20 font-medium" placeholder="juan@ejemplo.com" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Teléfono / WhatsApp del Solicitante</label>
                      <div className="relative">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-green-600"><MessageCircle size={18} /></div>
                        <input type="tel" className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 outline-none focus:ring-2 ring-green-500/20 font-medium" placeholder="+52 (461) 180 7955" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Mensaje o Equipo de Interés</label>
                      <textarea className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 h-40 outline-none focus:ring-2 ring-blue-500/20 resize-none font-medium" placeholder="Cuéntanos qué equipo necesitas o describe la situación..."></textarea>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95">
                      <Send size={20} /> Enviar Solicitud
                    </button>
                    <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Tus datos están protegidos bajo la normativa LFPDPPP 2025</p>
                  </form>
                </div>
              </div>
            </div>
          </main>
        )}
      </div>

      <footer className="bg-slate-900 text-slate-400 py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center justify-center md:justify-start gap-3 text-white mb-6">
              <Heart className="text-blue-600" fill="currentColor" size={24} />
              <span className="font-black text-xl uppercase tracking-tighter">NexIA Salud & <span className="text-blue-500">Confort</span></span>
            </div>
            <p className="text-sm font-medium mb-8 max-w-sm mx-auto md:mx-0">Especialistas en la salud del Bajío. Renta de equipo médico certificado con logística de proximidad inteligente.</p>
          </div>
          <div>
            <h5 className="text-white font-black mb-6 uppercase text-xs tracking-widest text-center md:text-left">Contacto</h5>
            <ul className="space-y-3 text-sm font-bold">
              <li className="flex items-center justify-center md:justify-start gap-2 text-blue-400"><Phone size={14} /> 461 180 7955</li>
              <li className="flex items-center justify-center md:justify-start gap-2 text-green-400"><MessageCircle size={14} /> WhatsApp Directo</li>
            </ul>
          </div>
        </div>
      </footer>

      {showLawModal && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl p-8 md:p-12 shadow-2xl animate-in zoom-in-95">
             <div className="flex items-center gap-4 mb-8">
                <Shield size={40} className="text-blue-600 shrink-0" />
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">Normativa LFPDPPP 2025</h3>
             </div>
             <p className="text-slate-600 font-medium mb-10 leading-relaxed italic">Toda su información médica y personal es cifrada mediante el protocolo AES-256 en servidores locales aislados de NexIA, cumpliendo con la normativa vigente en México.</p>
             <button onClick={() => setShowLawModal(false)} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl">Entendido</button>
          </div>
        </div>
      )}

      {showComplianceModal && selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-[150] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] w-full max-w-2xl overflow-hidden animate-in zoom-in-95 my-auto">
            <div className="bg-blue-600 p-8 md:p-10 text-white flex justify-between items-center font-black uppercase tracking-tight">
              <h3 className="text-lg md:text-xl">Renta de {selectedProduct.name}</h3>
              <button onClick={() => setShowComplianceModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
            </div>
            <div className="p-8 md:p-12 space-y-8">
              <label className="flex gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer">
                 <input type="checkbox" checked={compliance.hasConsentedPrivacy} onChange={e => setCompliance(p => ({...p, hasConsentedPrivacy: e.target.checked}))} className="w-6 h-6 mt-1" />
                 <span className="text-sm font-bold">Autorizo el tratamiento de mis datos personales según la LFPDPPP para NexIA Salud & Confort.</span>
              </label>
              <div className="border-4 border-dashed border-slate-200 rounded-[2.5rem] p-10 text-center relative group">
                 <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={() => setCompliance(p => ({...p, documentsUploaded: true}))} />
                 <Upload className="mx-auto mb-4 text-blue-600 group-hover:scale-110 transition-transform" size={40} />
                 <span className="font-black uppercase text-xs md:text-sm">Subir Identificación Vigente (INE/Pasaporte)</span>
                 {compliance.documentsUploaded && <div className="absolute inset-0 bg-white/95 flex items-center justify-center rounded-[2.5rem] animate-in fade-in"><CheckCircle className="text-green-600 mr-2" /> <span className="font-black uppercase">Documento Verificado</span></div>}
              </div>
              <button 
                disabled={!compliance.hasConsentedPrivacy || !compliance.documentsUploaded} 
                onClick={handleWhatsAppRedirect} 
                className={`w-full py-6 rounded-2xl font-black uppercase tracking-widest transition-all ${compliance.hasConsentedPrivacy && compliance.documentsUploaded ? 'bg-green-600 text-white shadow-xl hover:bg-green-700' : 'bg-slate-100 text-slate-400'}`}
              >
                Confirmar y Continuar por WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
