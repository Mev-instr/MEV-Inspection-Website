import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, CheckCircle2, ChevronRight, ArrowRight, ShieldCheck, Globe, Clock, MapPin, 
  Eye, Target, ClipboardCheck, GraduationCap, Award, AlertTriangle, Weight, 
  Factory, Building2, Ship, Zap, Wrench, FileText, Search, Phone, Mail, 
  Linkedin, Facebook, Instagram, Plus, Star, Map, FileSignature, MonitorCheck,
  Check, Sliders, Atom, Settings2
} from 'lucide-react';

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = ['home', 'about', 'services', 'training', 'industries', 'contact'];
    
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'training', label: 'Training' },
    { id: 'industries', label: 'Industries' },
    { id: 'verification', label: 'Verification', static: true },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-neutral-dark">
      {/* Navigation */}
      <header className="bg-navy sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <img 
                src="https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0459155438.firebasestorage.app/o/Branding%2FHorizonal%20MEV%20logo.png?alt=media&token=6fd9c05f-5c66-4c31-94b5-06ff4cb6c980" 
                alt="MEV Inspection & Training Logo" 
                className="h-10 w-auto object-contain filter brightness-0 invert"
              />
            </div>

            {/* Desktop Menu */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a 
                  key={link.id}
                  href={`#${link.id}`} 
                  onClick={(e) => link.static && e.preventDefault()}
                  className={`text-sm font-medium transition-all ${
                    activeSection === link.id && !link.static
                      ? 'text-white' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center">
              <a href="#contact" className="bg-primary text-white px-5 py-2.5 rounded text-sm font-medium hover:bg-primary/90 transition-all flex items-center gap-2 shadow-sm shadow-primary/20">
                Contact Us
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-primary transition-colors p-2"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-navy border-t border-white/10 px-4 pt-2 pb-6 space-y-2 shadow-2xl absolute top-20 left-0 w-full overflow-hidden"
            >
              {navLinks.map((link) => (
                <a 
                  key={link.id}
                  href={`#${link.id}`} 
                  onClick={(e) => {
                    if (link.static) e.preventDefault();
                    setIsMobileMenuOpen(false);
                  }} 
                  className={`block px-3 py-2 font-medium ${
                    activeSection === link.id && !link.static
                      ? 'text-white border-l-4 border-primary pl-2' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 px-3">
                <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="w-full bg-primary text-white px-5 py-3 rounded text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                  Contact Us
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section id="home" className="relative bg-[#0b1120] overflow-hidden pt-12 pb-24 lg:pt-24 lg:pb-32 min-h-[600px] flex items-center">
          {/* Background image overlay */}
          <div className="absolute inset-0 bg-[url('https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0459155438.firebasestorage.app/o/Website%2FHero%20Bg.webp?alt=media&token=cf663455-b6e3-4459-80f0-2d4df537d08e')] bg-cover bg-[position:75%_center] md:bg-[position:95%_center] lg:bg-center bg-no-repeat"></div>
          <div className="absolute inset-0 bg-black/60 md:bg-black/30 lg:hidden"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              {/* Left Content */}
              <div className="max-w-2xl pt-10">
                <p className="text-primary font-bold tracking-widest text-xs mb-4 uppercase">
                  Inspection. Training. Safety.
                </p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
                  Your Partner in<br />
                  Safety, Excellence,<br />
                  and <span className="text-primary">Success</span>
                </h1>
                <p className="text-gray-300 text-base mb-8 max-w-lg leading-relaxed">
                  Certified lifting equipment inspections and operator training solutions that help your business stay safe, compliant, and ahead of the standard.
                </p>
                
                <div className="flex flex-wrap gap-4 mb-16">
                  <a href="#contact" className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-md font-medium transition-all flex items-center group shadow-lg shadow-primary/30">
                    Get Inspection
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a href="#training" className="bg-transparent border border-white hover:bg-white/10 text-white px-8 py-3.5 rounded-md font-medium transition-all flex items-center group">
                    Explore Training
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs text-gray-300 font-medium">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary stroke-2" />
                    <span>Certified Inspectors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary stroke-2" />
                    <span>International Standards</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary stroke-2" />
                    <span>Fast Reporting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary stroke-2" />
                    <span>Saudi Arabia</span>
                  </div>
                </div>
              </div>

              {/* Right Content / Image Removed */}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="rounded-2xl overflow-hidden shadow-xl h-[500px]">
                <img 
                  src="https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0459155438.firebasestorage.app/o/Website%2FAbout%20us%20img.webp?alt=media&token=601cb523-ee37-48a8-9a0c-1d9ce2c9ab99" 
                  alt="About MEV Inspection" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div>
                <p className="text-primary font-bold text-sm tracking-widest uppercase mb-3">About MEV</p>
                <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                  Setting the Standard<br />in Safety & Excellence
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  MEV-Inspections and Training is a trusted leader in lifting equipment inspection and operator training. With certified engineers, advanced tools, and a commitment to international standards, we help businesses operate safely, stay compliant, and achieve more.
                </p>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <Eye className="text-primary w-8 h-8 mb-4" />
                    <h3 className="font-bold text-navy mb-2">OUR VISION</h3>
                    <p className="text-sm text-gray-600">
                      To be the leading inspection and training provider in the region, setting benchmarks for safety, quality, and professionalism.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <Target className="text-primary w-8 h-8 mb-4" />
                    <h3 className="font-bold text-navy mb-2">OUR MISSION</h3>
                    <p className="text-sm text-gray-600">
                      To deliver reliable inspection services and practical training that empower people, ensure compliance, and create safer workplaces.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-navy uppercase">
                Our <span className="text-primary">Services</span>
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: ClipboardCheck, title: "Inspection Services", desc: "Thorough inspection of lifting equipment and tools to ensure safety, reliability, and compliance." },
                { icon: GraduationCap, title: "Training Programs", desc: "Operator training and assessment programs designed to build skills, confidence, and safety awareness." },
                { icon: Award, title: "Certification Support", desc: "Assistance with certification and regulatory compliance to keep your operations audit-ready." },
                { icon: AlertTriangle, title: "Risk Assessment", desc: "Identify potential risks and implement effective control measures for safer workplaces." },
                { icon: Weight, title: "Load Testing", desc: "Safe and accurate load testing to verify equipment strength and performance under actual conditions." },
                { icon: ShieldCheck, title: "Safety Audits", desc: "Comprehensive safety audits to improve performance and ensure regulatory compliance." }
              ].map((service, i) => (
                <div key={i} className="bg-white p-8 rounded-xl border border-gray-100 hover:shadow-lg transition-all group flex flex-col items-start text-left cursor-pointer">
                  <div className="w-12 h-12 rounded-lg bg-primary/5 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                    <service.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-3">{service.title}</h3>
                  <p className="text-gray-500 text-sm mb-6 flex-grow">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Our Training Section */}
        <section id="training" className="py-24 bg-white relative overflow-hidden">
          {/* Subtle Technical Watermark */}
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="20" cy="20" r="40" fill="none" stroke="currentColor" strokeWidth="0.1" />
              <circle cx="20" cy="20" r="30" fill="none" stroke="currentColor" strokeWidth="0.1" />
              <line x1="20" y1="-20" x2="20" y2="60" stroke="currentColor" strokeWidth="0.1" />
              <line x1="-20" y1="20" x2="60" y2="20" stroke="currentColor" strokeWidth="0.1" />
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-navy uppercase">
                Why Choose <span className="text-primary">Our Training</span>
              </h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-center">
              {/* Left Side Features */}
              <div className="space-y-16 lg:text-right">
                <div className="flex flex-col lg:flex-row-reverse items-center lg:items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
                    <Sliders className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-navy mb-3">Expert Instructors</h3>
                    <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                      Our training programs are delivered by experienced instructors who possess extensive industry knowledge and practical experience in their respective fields.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row-reverse items-center lg:items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
                    <Atom className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-navy mb-3">Comprehensive Curriculum</h3>
                    <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                      We offer comprehensive training curricula developed in accordance with industry standards and regulations, ensuring that participants receive up-to-date and relevant training.
                    </p>
                  </div>
                </div>
              </div>

              {/* Center Image */}
              <div className="flex justify-center py-8 lg:py-0">
                <div className="relative w-full max-w-[500px]">
                  <img 
                    src="https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0459155438.firebasestorage.app/o/Website%2Fwhy-us-img.png?alt=media&token=0d737cab-be77-45ba-9942-7f617e746e4b" 
                    alt="Why Choose MEV Training" 
                    className="w-full h-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Right Side Features */}
              <div className="space-y-16">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-navy mb-3">Hands-on Experience</h3>
                    <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                      We prioritize hands-on learning experiences to allow participants to apply theoretical knowledge in real-world scenarios, enhancing retention and skill development.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
                    <Settings2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-navy mb-3">Flexible Delivery Options</h3>
                    <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                      Our training programs can be delivered onsite at client facilities, at our training centers, or online, providing flexibility and convenience to accommodate diverse training needs and scheduling preferences.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Training Programs */}
        <section className="py-20 bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-navy uppercase">
                Training <span className="text-primary">Programs</span>
              </h2>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-center">
              {/* Image Left */}
              <div className="lg:w-1/3 rounded-xl overflow-hidden shadow-lg h-64 lg:h-auto">
                <img 
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1000&auto=format&fit=crop" 
                  alt="Training session" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Programs Grid */}
              <div className="lg:w-2/3 grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
                {[
                  { icon: GraduationCap, title: "Operator Training", duration: "1-5 Days" },
                  { icon: Building2, title: "Crane Operator Training", duration: "2-5 Days" },
                  { icon: Wrench, title: "Forklift Training", duration: "1-3 Days" },
                  { icon: Award, title: "Rigging & Lifting", duration: "1-3 Days" },
                ].map((prog, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-xl p-6 flex flex-col items-center text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <prog.icon className="w-10 h-10 text-primary mb-4 stroke-1" />
                    <h3 className="font-bold text-navy text-xs mb-2 h-8">{prog.title}</h3>
                    <span className="text-xs text-primary font-medium">{prog.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA specific for training/inspection inline */}
            <div className="mt-8 bg-primary rounded-xl p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-xl">
              <div className="mb-6 md:mb-0 md:mr-8 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">Need Equipment Inspection or Training?</h3>
                <p className="text-white/80 text-sm">
                  Let our experts help you ensure safety, compliance, and operational excellence.
                </p>
              </div>
              <a href="#contact" className="bg-white text-primary px-8 py-3 rounded font-bold text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-md">
                Contact Us Today <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Industries Section */}
        <section id="industries" className="py-20 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="lg:w-1/3">
                <h2 className="text-3xl font-bold text-navy mb-4 uppercase">
                  Industries<br />We Serve
                </h2>
                <div className="w-12 h-1 bg-primary mb-6"></div>
                <p className="text-gray-600 mb-8">
                  Delivering inspection and training solutions across a wide range of industries.
                </p>
              </div>
              
              <div className="lg:w-2/3 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                {[
                  { icon: Factory, name: "Oil & Gas" },
                  { icon: Building2, name: "Construction" },
                  { icon: Ship, name: "Marine" },
                  { icon: Zap, name: "Industrial Plants" },
                  { icon: Factory, name: "Warehouses" },
                  { icon: Map, name: "Infrastructure" },
                  { icon: Wrench, name: "Manufacturing" },
                  { icon: Zap, name: "Power Plants" }
                ].map((industry, i) => (
                  <div key={i} className="flex flex-col items-center text-center p-6 border border-gray-100 rounded-lg hover:border-primary/50 hover:shadow-md transition-all group cursor-pointer">
                    <industry.icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform stroke-1" />
                    <span className="text-xs font-bold text-navy">{industry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-navy uppercase">
                Our <span className="text-primary">Inspection Process</span>
              </h2>
            </div>

            <div className="relative">
              <div className="hidden md:block absolute top-8 left-0 w-full h-[2px] bg-gray-200 z-0"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-6 gap-8 relative z-10">
                {[
                  { num: "01", icon: FileText, title: "Request", desc: "Submit your inspection request." },
                  { num: "02", icon: MapPin, title: "Site Visit", desc: "Our team visits your location." },
                  { num: "03", icon: Search, title: "Inspection", desc: "Thorough inspection by certified experts." },
                  { num: "04", icon: MonitorCheck, title: "Testing", desc: "Load and functional testing as required." },
                  { num: "05", icon: CheckCircle2, title: "Certification", desc: "Approve and certify the equipment." },
                  { num: "06", icon: FileSignature, title: "Digital Report", desc: "Detailed digital report delivered." }
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white border-2 border-primary rounded-full flex items-center justify-center mb-4 relative shadow-sm">
                      <div className="absolute -top-2 -left-2 w-6 h-6 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                        {step.num}
                      </div>
                      <step.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-bold text-navy mb-1 text-sm">{step.title}</h3>
                    <p className="text-gray-500 text-[11px] px-2">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Contact Section & Footer */}
      <footer id="contact" className="bg-navy text-gray-300 pt-20 pb-10 border-t-[8px] border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 lg:gap-24 mb-16 items-start">
            
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white uppercase mb-6">
                Get In <span className="text-primary">Touch</span>
              </h2>
              <p className="text-gray-400 mb-10 max-w-md text-sm leading-relaxed">
                Ready to ensure safety and compliance for your equipment? Contact our team of certified experts today to schedule an inspection or training session.
              </p>
              <ul className="space-y-8">
                <li className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 text-primary">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Our Location</h4>
                    <span className="text-sm text-gray-400">Jeddah, Saudi Arabia</span>
                  </div>
                </li>
                <li className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 text-primary">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Phone Numbers</h4>
                    <span className="text-sm text-gray-400 block mb-1">+966 53 404 3543</span>
                    <span className="text-sm text-gray-400 block">+966 55 448 1920</span>
                  </div>
                </li>
                <li className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 text-primary">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Email & Web</h4>
                    <span className="text-sm text-gray-400 block mb-1">info@mev-ins.com</span>
                    <span className="text-sm text-gray-400 block">www.mev-ins.com</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Request a Quote Form */}
            <div className="bg-[#142338] p-8 sm:p-10 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] rounded-full"></div>
              <h3 className="text-2xl font-bold text-white mb-8 uppercase tracking-wider relative z-10">Request A Quote</h3>
              <form className="space-y-5 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <input type="text" placeholder="Your Name" className="w-full bg-[#0E1B2D] text-white placeholder-gray-500 px-4 py-3.5 text-sm rounded-lg border border-white/5 focus:border-primary focus:outline-none transition-colors" />
                  <input type="text" placeholder="Company Name" className="w-full bg-[#0E1B2D] text-white placeholder-gray-500 px-4 py-3.5 text-sm rounded-lg border border-white/5 focus:border-primary focus:outline-none transition-colors" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <input type="tel" placeholder="Phone Number" className="w-full bg-[#0E1B2D] text-white placeholder-gray-500 px-4 py-3.5 text-sm rounded-lg border border-white/5 focus:border-primary focus:outline-none transition-colors" />
                  <div className="relative">
                    <select className="w-full bg-[#0E1B2D] text-gray-400 px-4 py-3.5 text-sm rounded-lg border border-white/5 focus:border-primary focus:outline-none appearance-none h-full transition-colors">
                      <option value="">Equipment Type</option>
                      <option value="crane">Cranes</option>
                      <option value="forklift">Forklifts</option>
                      <option value="mewp">MEWP</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <textarea placeholder="Message" rows={4} className="w-full bg-[#0E1B2D] text-white placeholder-gray-500 px-4 py-3.5 text-sm rounded-lg border border-white/5 focus:border-primary focus:outline-none resize-none transition-colors"></textarea>
                <button type="button" className="w-full bg-primary hover:bg-primary/90 text-white px-6 py-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-primary/20">
                  Send Request <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col justify-center items-center text-xs text-gray-500 text-center">
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0459155438.firebasestorage.app/o/Branding%2FHorizonal%20MEV%20logo.png?alt=media&token=6fd9c05f-5c66-4c31-94b5-06ff4cb6c980" 
              alt="MEV Inspection & Training" 
              className="h-7 w-auto mb-5 filter brightness-0 invert opacity-30"
            />
            <p>&copy; {new Date().getFullYear()} MEV-Inspections and Training. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
