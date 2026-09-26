import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaAward, FaExternalLinkAlt, 
  FaCode, FaGraduationCap, FaDatabase, FaChartLine, FaCheckCircle, 
  FaTimes, FaBriefcase, FaTimesCircle, FaChevronRight, FaCogs, FaChartPie, 
  FaPaperPlane as FaSend, FaBars, FaFileDownload
} from 'react-icons/fa';

// Web Audio API Click Sound
const playClickSound = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(250, audioCtx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.04);
  } catch (e) {}
};

const Portfolio = () => {
  const mountRef = useRef(null);
  const [activeModal, setActiveModal] = useState(null);
  const [activeSection, setActiveSection] = useState('about');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMapNode, setActiveMapNode] = useState(0);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'tia', text: "Hi! I'm Tia, Anjali's Portfolio AI Assistant. Ask me anything about her skills, experience, education, or projects!" }
  ]);
  const [userInput, setUserInput] = useState('');
  const chatEndRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [formErrors, setFormErrors] = useState({ email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Scroll Tracking
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'experience', 'skills', 'projects', 'education', 'contact'];
      const scrollPosition = window.scrollY + 180;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatOpen]);

  // Three.js Minimal Ambient Particle Background
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const particlesCount = 450;
    const posArray = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.03,
      color: 0x0071E3,
      transparent: true,
      opacity: 0.3
    });
    const particlesMesh = new THREE.Points(particleGeo, particleMat);
    scene.add(particlesMesh);

    camera.position.z = 6;

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.3;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.3;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      particlesMesh.rotation.y += 0.0008;
      particlesMesh.rotation.x += 0.0004;
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) mountRef.current.innerHTML = '';
    };
  }, []);

  // AI Agent Logic
  const handleSendMessage = (textToSend) => {
    const rawInput = textToSend || userInput;
    const query = rawInput.trim().toLowerCase();
    if (!query) return;

    playClickSound();
    const newMessages = [...chatMessages, { sender: 'user', text: rawInput }];
    setChatMessages(newMessages);
    if (!textToSend) setUserInput('');

    setTimeout(() => {
      let botResponse = "";
      const currentHour = new Date().getHours();
      let timeGreeting = "good morning";
      if (currentHour >= 12 && currentHour < 17) {
        timeGreeting = "good afternoon";
      } else if (currentHour >= 17 || currentHour < 4) {
        timeGreeting = "good evening";
      }

      if (query === 'hii' || query === 'hi' || query === 'hello' || query === 'hey' || query.startsWith('hii ') || query.startsWith('hi ') || query.startsWith('hello ')) {
        botResponse = `Hii, I am Tia! ${timeGreeting.charAt(0).toUpperCase() + timeGreeting.slice(1)}! How can I assist you with Anjali's portfolio today?`;
      } else if (query === 'bye' || query === 'goodbye' || query.includes('bye') || query.includes('see you')) {
        botResponse = "Bye, Visit again!";
      } else if (query.includes('churn') || query.includes('customer intelligence')) {
        botResponse = "Project 01: AI Customer Intelligence & Churn Prediction.\n• Tools Used: Python (Pandas, Scikit-Learn), SQL, Power BI, GenAI.\n• Details: Analyzed 20,000+ customer records to identify churn drivers and built predictive ML models with executive Power BI dashboards.\n• GitHub: https://github.com/AnjaliAnalytics/customer-churn-intelligence";
      } else if (query.includes('demand') || query.includes('forecasting') || query.includes('e-commerce demand')) {
        botResponse = "Project 02: E-Commerce Demand Forecasting.\n• Tools Used: Python, SQL, Time Series Analysis, Machine Learning, Power BI.\n• Details: Built automated time-series forecasting models to optimize safety stock inventory levels and reduce stockouts across multi-category e-commerce catalog items.\n• GitHub: https://github.com/AnjaliAnalytics/ecommerce-demand-forecasting";
      } else if (query.includes('copilot') || query.includes('ai analytics copilot') || query.includes('ollama')) {
        botResponse = "Project 03: AI Analytics Copilot.\n• Tools Used: n8n, Ollama, NocoDB, QuickChart, Docker, Python, SQL.\n• Details: Created an AI-powered conversational analytics agent that translates natural language questions into executable SQL queries and dynamically generates visual chart URLs.\n• GitHub: https://github.com/AnjaliAnalytics/ai-analytics-copilot";
      } else if (query.includes('ga4') || query.includes('marketing') || query.includes('google analytics')) {
        botResponse = "Project 04: GA4 Product & Marketing Analytics Platform.\n• Tools Used: BigQuery, Event Analytics, Looker Studio, A/B Testing, GenAI.\n• Details: Processed 140K+ event logs in BigQuery to evaluate user funnels, cohort retention heatmaps, and Z-test statistical significance for digital marketing campaigns.\n• GitHub: https://github.com/AnjaliAnalytics/product-marketing-analytics";
      } else if (query.includes('project') || query.includes('work') || query.includes('portfolio projects') || query.includes('elaborate')) {
        botResponse = "Anjali has built 6 primary data analytics projects:\n1. AI Customer Intelligence & Churn (Python, SQL, Power BI)\n2. E-Commerce Demand Forecasting (Python, ML, Time Series)\n3. AI Analytics Copilot (n8n, Ollama, Docker, SQL)\n4. GA4 Product & Marketing Platform (BigQuery, Looker Studio)\n5. Global E-Commerce Sales Analytics (SQL, Excel, Power BI)\n6. Enterprise Data Quality Platform (SQL, Python, Power Query)\n\nExplore her GitHub repository: https://github.com/AnjaliAnalytics";
      } else if (query.includes('hackerrank') || query.includes('badge') || query.includes('gold')) {
        botResponse = "Anjali holds a 5-Star Gold Badge in SQL & Python on HackerRank: https://www.hackerrank.com/profile/anjaliyadavpers1";
      } else if (query.includes('linkedin')) {
        botResponse = "Connect with Anjali on LinkedIn: https://linkedin.com/in/anjali-yadav-dev";
      } else if (query.includes('github') || query.includes('git')) {
        botResponse = "Explore all of Anjali's open-source analytics code repositories on GitHub: https://github.com/AnjaliAnalytics";
      } else if (query.includes('contact') || query.includes('email') || query.includes('phone') || query.includes('reach') || query.includes('gmail')) {
        botResponse = "Contact Anjali:\n• Email: anjaliyadavpersonal2001@gmail.com\n• Phone: +91-9845483651\n• LinkedIn: https://linkedin.com/in/anjali-yadav-dev\n• GitHub: https://github.com/AnjaliAnalytics";
      } else if (query.includes('resume') || query.includes('cv')) {
        botResponse = "You can view and download Anjali's official resume using this link: ./resume.pdf";
      } else if (query.includes('experience') || query.includes('iqvia') || query.includes('background') || query.includes('job') || query.includes('role')) {
        botResponse = "Professional Background:\n• Senior Production Associate at IQVIA (Jul 2025 – Mar 2026) in Bangalore, India.\n• Specialization: Operational data analysis, MIS reporting automation using Advanced Excel VBA, Power Query, and reconciliation workflows.\n• Academic: MCA at IIT Patna (8.4 CGPA) & BCA at Kristu Jayanti College (7.9 CGPA).";
      } else if (query.includes('skill') || query.includes('tool') || query.includes('python') || query.includes('sql') || query.includes('power bi')) {
        botResponse = "Core Technical Tools & Stack:\n• Languages & Databases: Python (Pandas, NumPy, Scikit-learn), SQL (BigQuery, MySQL).\n• Visualization & BI: Power BI (DAX), Looker Studio, Tableau, Advanced Excel & VBA.\n• Frameworks & Ecosystems: Power Query ETL, Git, Docker, Local LLM Workflows.";
      } else {
        botResponse = "Anjali is a Data Analyst skilled in Python, BigQuery SQL, Power BI, and MIS automation. Contact: anjaliyadavpersonal2001@gmail.com or GitHub: https://github.com/AnjaliAnalytics";
      }

      setChatMessages(prev => [...prev, { sender: 'tia', text: botResponse }]);
    }, 400);
  };

  const handleToggleChat = () => {
    playClickSound();
    if (isChatOpen) {
      setIsChatOpen(false);
      setChatMessages([
        { sender: 'tia', text: "Hi! I'm Tia, Anjali's Portfolio AI Assistant. Ask me anything about her skills, experience, education, or projects!" }
      ]);
    } else {
      setIsChatOpen(true);
    }
  };

  const triggerModal = (data) => {
    playClickSound();
    setActiveModal(data);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    playClickSound();

    let errors = { email: '', phone: '' };
    let isValid = true;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid email address';
      isValid = false;
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      errors.phone = 'Invalid phone number (must be 10 digits)';
      isValid = false;
    }

    setFormErrors(errors);
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('https://formsubmit.co/ajax/anjaliyadavpersonal2001@gmail.com', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Name: formData.name,
          Email: formData.email,
          Phone: formData.phone,
          Subject: formData.subject,
          Message: formData.message,
          _subject: `Portfolio Inquiry from ${formData.name}: ${formData.subject}`
        })
      });

      if (response.ok) {
        setFormSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setFormErrors({ email: '', phone: '' });
        setTimeout(() => setFormSubmitted(false), 5000);
      } else {
        alert("Failed to send message. Please contact anjaliyadavpersonal2001@gmail.com directly.");
      }
    } catch (error) {
      alert("Error sending message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const mapNodes = [
    { id: 1, name: "Node 01: Multi-Source Ingestion", desc: "Ingesting event streams via BigQuery SQL & Python pipelines.", icon: <FaDatabase /> },
    { id: 2, name: "Node 02: Automated ETL", desc: "Executing VBA Macros and Power Query routines for automated processing.", icon: <FaCogs /> },
    { id: 3, name: "Node 03: Data Quality", desc: "Rigorous auditing, duplicate elimination, and trend anomaly profiling.", icon: <FaCheckCircle /> },
    { id: 4, name: "Node 04: Executive Analytics", desc: "DAX-powered Power BI dashboards, Looker Studio reports, & GenAI insights.", icon: <FaChartPie /> }
  ];

  return (
    <div className="bg-[#F5F5F7] text-[#1D1D1F] min-h-screen font-sans relative overflow-x-hidden selection:bg-[#0071E3] selection:text-white text-base md:text-lg tracking-tight">
      {/* 3D Background */}
      <div ref={mountRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-40" />

      {/* Apple Navbar */}
      <nav className="fixed top-0 w-full z-40 backdrop-blur-md bg-[#F5F5F7]/80 border-b border-[#E5E5EA] px-4 md:px-8 py-3 md:py-4 flex justify-between items-center max-w-7xl left-1/2 -translate-x-1/2">
        <a 
          href="#about" 
          onClick={playClickSound}
          className="text-xl md:text-2xl font-semibold tracking-tight text-[#1D1D1F] hover:opacity-80 transition"
        >
          Anjali Yadav
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#86868B]">
          {[
            { id: 'about', label: 'About' },
            { id: 'experience', label: 'Experience' },
            { id: 'skills', label: 'Skills' },
            { id: 'projects', label: 'Projects' },
            { id: 'education', label: 'Education' },
            { id: 'contact', label: 'Contact' }
          ].map((item) => (
            <a 
              key={item.id}
              href={`#${item.id}`} 
              onClick={playClickSound} 
              className={`transition ${
                activeSection === item.id 
                  ? 'text-[#1D1D1F] font-semibold' 
                  : 'hover:text-[#1D1D1F]'
              }`}
            >
              {item.label}
            </a>
          ))}

          {/* Apple Pill Resume Button */}
          <a 
            href="./resume.pdf" 
            target="_blank" 
            rel="noreferrer"
            onClick={playClickSound}
            className="px-4 py-1.5 bg-[#0071E3] text-white font-medium text-xs rounded-full hover:bg-[#0077ED] transition shadow-xs flex items-center gap-2"
          >
            <FaFileDownload /> Resume
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="md:hidden text-[#1D1D1F] text-xl p-2 focus:outline-none"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#F5F5F7] border-b border-[#E5E5EA] p-6 flex flex-col gap-4 text-center md:hidden shadow-lg">
            {[
              { id: 'about', label: 'About' },
              { id: 'experience', label: 'Experience' },
              { id: 'skills', label: 'Skills' },
              { id: 'projects', label: 'Projects' },
              { id: 'education', label: 'Education' },
              { id: 'contact', label: 'Contact' }
            ].map((item) => (
              <a 
                key={item.id}
                href={`#${item.id}`} 
                onClick={() => { playClickSound(); setIsMobileMenuOpen(false); }} 
                className={`text-base font-medium py-1.5 ${
                  activeSection === item.id ? 'text-[#0071E3] font-semibold' : 'text-[#86868B]'
                }`}
              >
                {item.label}
              </a>
            ))}

            <a 
              href="./resume.pdf" 
              target="_blank" 
              rel="noreferrer"
              onClick={() => { playClickSound(); setIsMobileMenuOpen(false); }}
              className="mt-2 py-2.5 bg-[#0071E3] text-white font-medium text-sm rounded-full shadow-xs flex items-center justify-center gap-2"
            >
              <FaFileDownload /> Download Resume
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="about" className="relative z-10 pt-28 md:pt-40 pb-16 md:pb-28 px-4 md:px-8 max-w-7xl mx-auto min-h-screen flex flex-col justify-center">
        <div className="text-center mb-6 md:mb-10">
          <p className="text-xl md:text-2xl font-normal text-[#86868B]">Hey, there</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-center">
          <div className="lg:col-span-3 text-center lg:text-left space-y-3">
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#1D1D1F] leading-tight">
              I AM<br /><span className="text-[#0071E3]">ANJALI</span>
            </h1>
          </div>

          {/* Profile Image Card */}
          <div className="lg:col-span-6 flex justify-center my-4 lg:my-0">
            <div className="relative group w-72 sm:w-80 md:w-[26rem] h-[22rem] sm:h-[26rem] md:h-[30rem] rounded-3xl overflow-hidden border border-[#E5E5EA] shadow-lg hover:scale-102 transition duration-500 bg-white">
              <img 
                src="./photo.png" 
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"; }}
                alt="Anjali Yadav Profile" 
                className="w-full h-full object-cover object-top filter brightness-100 contrast-100"
              />
            </div>
          </div>

          <div className="lg:col-span-3 text-center lg:text-right space-y-3 md:space-y-4">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-[#1D1D1F] leading-tight">
              DATA<br /><span className="text-[#0071E3]">ANALYST</span>
            </h2>
            <p className="text-[#86868B] text-sm md:text-base leading-relaxed font-normal">
              Specialized in Python, SQL (BigQuery), Power BI, and Predictive Analytics. Experienced in building automated data workflows and executive dashboards.
            </p>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="relative z-10 py-16 md:py-28 px-4 md:px-8 max-w-7xl mx-auto border-t border-[#E5E5EA]">
        <h2 className="text-3xl sm:text-5xl font-semibold text-[#1D1D1F] mb-8 tracking-tight">
          Professional Experience
        </h2>

        {/* Workflow Grid */}
        <div className="mb-8 md:mb-12 bg-white/70 border border-[#E5E5EA] rounded-3xl p-4 md:p-8 shadow-xs backdrop-blur-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 relative">
            {mapNodes.map((node, nIdx) => (
              <div 
                key={node.id} 
                onClick={() => { playClickSound(); setActiveMapNode(nIdx); }}
                className={`p-5 md:p-6 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden group ${
                  activeMapNode === nIdx 
                    ? 'bg-[#F5F5F7] border-[#0071E3] shadow-xs scale-102' 
                    : 'bg-white border-[#E5E5EA] hover:border-[#86868B]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl text-xl md:text-2xl ${activeMapNode === nIdx ? 'bg-[#0071E3] text-white' : 'bg-[#F5F5F7] text-[#0071E3]'}`}>
                    {node.icon}
                  </div>
                  <span className="text-xs font-mono font-semibold text-[#86868B]">0{node.id}</span>
                </div>
                <h4 className="text-sm md:text-base font-semibold text-[#1D1D1F] mb-1.5">{node.name}</h4>
                <p className="text-[#86868B] text-xs leading-relaxed">{node.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Details */}
        <div className="bg-white border border-[#E5E5EA] hover:border-[#0071E3] rounded-3xl p-6 md:p-12 transition-all duration-300 shadow-sm group">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
            <div>
              <span className="px-3.5 py-1 bg-[#F5F5F7] text-[#1D1D1F] border border-[#E5E5EA] rounded-full text-xs font-mono inline-block mb-3 font-semibold">
                JUL 2025 – MAR 2026
              </span>
              <h3 className="text-2xl sm:text-4xl font-semibold text-[#1D1D1F] group-hover:text-[#0071E3] transition">Senior Production Associate</h3>
              <p className="text-[#0071E3] text-lg md:text-xl font-medium mt-1">IQVIA • Bangalore, India</p>
            </div>
            <div className="p-4 md:p-5 bg-[#F5F5F7] border border-[#E5E5EA] rounded-2xl text-[#1D1D1F] hidden sm:block">
              <FaBriefcase className="text-2xl md:text-3xl text-[#0071E3]" />
            </div>
          </div>

          <div className="space-y-4 text-[#1D1D1F] text-base md:text-lg leading-relaxed font-normal">
            <p className="font-semibold text-[#1D1D1F] text-lg md:text-xl mb-3">
              Operational Data Analysis, MIS Automation & Analytics Execution:
            </p>
            <ul className="space-y-3 md:space-y-4 list-disc list-inside text-sm md:text-lg text-[#86868B]">
              <li><span className="text-[#1D1D1F]">Engineered automated Excel VBA macros</span> to streamline multi-source operational reporting, increasing workflow efficiency and reducing turnaround time.</li>
              <li><span className="text-[#1D1D1F]">Reconciled and validated operational datasets</span> using Power Query, Pivot Tables, and lookup formulas to guarantee 100% precision.</li>
              <li><span className="text-[#1D1D1F]">Executed exploratory data analysis</span>, trend identification, and anomaly profiling to resolve recurring operational discrepancies.</li>
              <li><span className="text-[#1D1D1F]">Partnered with cross-functional stakeholders</span> to translate reporting requirements into structured automated workflows.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="relative z-10 py-16 md:py-28 px-4 md:px-8 max-w-7xl mx-auto border-t border-[#E5E5EA]">
        <h2 className="text-3xl sm:text-5xl font-semibold text-[#1D1D1F] mb-8 md:mb-12 tracking-tight">
          Technical Skills & Competencies
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            { cat: "Python & Analytics", icon: <FaCode className="text-[#0071E3] text-2xl" />, skills: [{ name: "Python (Pandas, NumPy)", level: 95 }, { name: "Exploratory Data Analysis (EDA)", level: 90 }, { name: "Trend & Anomaly Detection", level: 88 }, { name: "Scikit-Learn (Predictive ML)", level: 82 }] },
            { cat: "SQL & Databases", icon: <FaDatabase className="text-[#0071E3] text-2xl" />, skills: [{ name: "SQL (MySQL, BigQuery)", level: 95 }, { name: "CTEs & Window Functions", level: 92 }, { name: "Subqueries & Aggregations", level: 90 }, { name: "Data Profiling & Auditing", level: 88 }] },
            { cat: "Business Intelligence", icon: <FaChartLine className="text-[#0071E3] text-2xl" />, skills: [{ name: "Power BI & DAX Modeling", level: 92 }, { name: "Tableau & Looker Studio", level: 85 }, { name: "KPI Dashboards", level: 90 }, { name: "SAP SAC & Metabase", level: 80 }] },
            { cat: "Excel & Automation", icon: <FaCheckCircle className="text-[#0071E3] text-2xl" />, skills: [{ name: "Advanced Excel (Pivot, XLOOKUP)", level: 98 }, { name: "VBA / Macro Automation", level: 90 }, { name: "Power Query ETL", level: 92 }, { name: "MIS & Operational Reporting", level: 95 }] },
            { cat: "Data Quality & Analysis", icon: <FaCheckCircle className="text-[#0071E3] text-2xl" />, skills: [{ name: "Data Validation & Reconciliation", level: 95 }, { name: "Root Cause Analysis", level: 90 }, { name: "KPI Definition & Tracking", level: 88 }, { name: "What-If Analysis", level: 85 }] },
            { cat: "Tools & Ecosystems", icon: <FaCode className="text-[#0071E3] text-2xl" />, skills: [{ name: "Git & GitHub Workflow", level: 90 }, { name: "Docker & Local LLM Workflows", level: 82 }, { name: "Apache Spark / Hadoop", level: 75 }, { name: "Process Digitalization", level: 88 }] }
          ].map((group, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-[#E5E5EA] rounded-3xl p-6 md:p-8 hover:border-[#0071E3] transition-all duration-300 shadow-xs"
            >
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 pb-3 border-b border-[#E5E5EA]">
                {group.icon}
                <h3 className="text-xl md:text-2xl font-semibold text-[#1D1D1F]">{group.cat}</h3>
              </div>
              <div className="space-y-3 md:space-y-4">
                {group.skills.map((s, sIdx) => (
                  <div key={sIdx}>
                    <div className="flex justify-between text-xs md:text-sm font-medium mb-1">
                      <span className="text-[#1D1D1F]">{s.name}</span>
                      <span className="text-[#0071E3] font-semibold">{s.level}%</span>
                    </div>
                    <div className="w-full bg-[#F5F5F7] rounded-full h-2 overflow-hidden">
                      <div className="bg-[#0071E3] h-2 rounded-full" style={{ width: `${s.level}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative z-10 py-16 md:py-28 px-4 md:px-8 max-w-7xl mx-auto border-t border-[#E5E5EA]">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl sm:text-5xl font-semibold text-[#1D1D1F] tracking-tight">Recent Projects</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            { num: "01", title: "AI Customer Intelligence & Churn", tags: ["SQL", "Python", "Scikit-Learn", "Power BI", "GenAI"], desc: "Analyzed 20,000+ customer records using SQL/Python. Built classification-based churn prediction models.", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800", link: "https://github.com/AnjaliAnalytics/customer-churn-intelligence" },
            { num: "02", title: "E-Commerce Demand Forecasting", tags: ["Python", "SQL", "Time Series", "Machine Learning", "Power BI"], desc: "Built demand forecasting workflows on e-commerce transactions using time-series features and safety stock logic.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800", link: "https://github.com/AnjaliAnalytics/ecommerce-demand-forecasting" },
            { num: "03", title: "AI Analytics Copilot", tags: ["n8n", "Ollama", "NocoDB", "QuickChart", "Docker", "Python/SQL"], desc: "Developed a conversational copilot converting natural language into SQL queries and automated charts.", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800", link: "https://github.com/AnjaliAnalytics/ai-analytics-copilot" },
            { num: "04", title: "GA4 Product & Marketing Platform", tags: ["BigQuery", "Event Analytics", "Looker Studio", "A/B Testing", "GenAI"], desc: "Analyzed 140K+ GA4 events in BigQuery. Built conversion funnels, cohort retention heatmaps, and Z-test A/B specs.", img: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=800", link: "https://github.com/AnjaliAnalytics/product-marketing-analytics" },
            { num: "05", title: "Global E-Commerce Sales Analytics", tags: ["SQL", "Python", "Advanced Excel", "Power BI"], desc: "Analyzed multi-region sales transactions to surface profitability drivers and customer purchase behaviors.", img: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800", link: "https://github.com/AnjaliAnalytics/ecommerce-sales-analytics" },
            { num: "06", title: "Enterprise Data Quality Platform", tags: ["SQL", "Python", "Advanced Excel", "Power BI"], desc: "Developed automated data reconciliation pipelines and data profiling checks for enterprise reporting validation.", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800", link: "https://github.com/AnjaliAnalytics/telco-customer-churn-intelligence-suite" }
          ].map((proj, idx) => (
            <div 
              key={idx} 
              onClick={() => triggerModal({ title: proj.title, subtitle: proj.tags.join(" • "), content: proj.desc, link: proj.link, img: proj.img })}
              className="bg-white border border-[#E5E5EA] rounded-3xl overflow-hidden hover:border-[#0071E3] transition-all duration-300 cursor-pointer group flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="relative h-40 md:h-48 overflow-hidden bg-[#F5F5F7]">
                  <img src={proj.img} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500 filter brightness-95" />
                  <span className="absolute top-3 left-3 text-2xl md:text-3xl font-mono font-semibold text-[#0071E3]">{proj.num}</span>
                </div>

                <div className="p-5 md:p-6">
                  <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
                    {proj.tags.map((t, tIdx) => (
                      <span key={tIdx} className="px-2.5 py-0.5 bg-[#F5F5F7] text-[#1D1D1F] text-[10px] md:text-xs font-mono rounded-full font-medium border border-[#E5E5EA]">{t}</span>
                    ))}
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold text-[#1D1D1F] mb-2 group-hover:text-[#0071E3] transition">{proj.title}</h3>
                  <p className="text-[#86868B] text-xs md:text-sm leading-relaxed mb-4 md:mb-6">{proj.desc}</p>
                </div>
              </div>

              <div className="px-5 md:px-6 pb-5 md:pb-6">
                <a 
                  href={proj.link} 
                  target="_blank" 
                  rel="noreferrer" 
                  onClick={(e) => e.stopPropagation()} 
                  className="inline-flex items-center gap-2 text-[#0071E3] text-xs md:text-sm font-medium hover:underline"
                >
                  View project <FaGithub className="text-sm" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education & Achievements */}
      <section id="education" className="relative z-10 py-16 md:py-28 px-4 md:px-8 max-w-7xl mx-auto border-t border-[#E5E5EA]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 md:mb-8 text-[#1D1D1F] flex items-center gap-3 tracking-tight">
              <FaGraduationCap className="text-[#0071E3]" /> Education
            </h2>
            <div className="space-y-4 md:space-y-6">
              <div className="bg-white border border-[#E5E5EA] p-6 md:p-8 rounded-3xl hover:border-[#0071E3] transition duration-300 shadow-xs">
                <h3 className="font-semibold text-[#1D1D1F] text-xl md:text-2xl">Master of Computer Applications (MCA)</h3>
                <p className="text-[#0071E3] text-base md:text-lg font-medium mt-1">IIT Patna | 2025 – 2027</p>
                <p className="text-[#86868B] text-xs md:text-sm mt-2 font-mono font-medium">CGPA: 8.4 / 10</p>
              </div>
              <div className="bg-white border border-[#E5E5EA] p-6 md:p-8 rounded-3xl hover:border-[#0071E3] transition duration-300 shadow-xs">
                <h3 className="font-semibold text-[#1D1D1F] text-xl md:text-2xl">Bachelor of Computer Applications (BCA)</h3>
                <p className="text-[#0071E3] text-base md:text-lg font-medium mt-1">Kristu Jayanti College, Bangalore | 2022 – 2025</p>
                <p className="text-[#86868B] text-xs md:text-sm mt-2 font-mono font-medium">CGPA: 7.9 / 10</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 md:mb-8 text-[#1D1D1F] flex items-center gap-3 tracking-tight">
              <FaAward className="text-[#0071E3]" /> Certifications & Badges
            </h2>
            <div className="bg-white border border-[#E5E5EA] p-6 md:p-8 rounded-3xl space-y-4 md:space-y-6 hover:border-[#0071E3] transition duration-300 shadow-xs">
              <div className="flex items-center gap-4 pb-4 border-b border-[#E5E5EA]">
                <span className="text-[#0071E3] font-semibold text-3xl md:text-4xl">5★</span>
                <div>
                  <h4 className="text-[#1D1D1F] font-semibold text-base md:text-lg">HackerRank Gold Badge in SQL & Python</h4>
                  <a 
                    href="https://www.hackerrank.com/profile/anjaliyadavpers1" 
                    target="_blank" 
                    rel="noreferrer" 
                    onClick={playClickSound}
                    className="inline-flex items-center gap-1.5 text-xs md:text-sm text-[#0071E3] font-medium hover:underline mt-1"
                  >
                    HackerRank Profile <FaExternalLinkAlt className="text-xs" />
                  </a>
                </div>
              </div>
              <ul className="space-y-2.5 md:space-y-3 text-xs md:text-sm text-[#86868B] font-normal">
                <li>• SQL Advanced — HackerRank</li>
                <li>• Introduction to Data Analysis Using Python — Google</li>
                <li>• Data Analytics Essentials — Cisco</li>
                <li>• Power BI for Beginners — Simplilearn (powered by Microsoft)</li>
                <li>• Business Analytics with Excel — Simplilearn (powered by Microsoft)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-16 md:py-28 px-4 md:px-8 max-w-7xl mx-auto border-t border-[#E5E5EA]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          <div className="lg:col-span-5 space-y-4 md:space-y-6">
            <h2 className="text-4xl sm:text-6xl font-semibold text-[#1D1D1F] tracking-tight">Get in touch</h2>
            
            <div className="space-y-4 md:space-y-6 pt-2 md:pt-4">
              <div>
                <p className="text-xs font-mono text-[#86868B] uppercase font-semibold">Email</p>
                <a href="mailto:anjaliyadavpersonal2001@gmail.com" className="text-base sm:text-xl font-medium text-[#0071E3] hover:underline break-all">
                  anjaliyadavpersonal2001@gmail.com
                </a>
              </div>

              <div>
                <p className="text-xs font-mono text-[#86868B] uppercase font-semibold">Phone</p>
                <a href="tel:+919845483651" className="text-base sm:text-xl font-medium text-[#0071E3] hover:underline">
                  +91-9845483651
                </a>
              </div>

              <div>
                <p className="text-xs font-mono text-[#86868B] uppercase mb-3 font-semibold">Connect</p>
                <div className="flex gap-4">
                  <a href="https://linkedin.com/in/anjali-yadav-dev" target="_blank" rel="noreferrer" className="p-3.5 bg-white border border-[#E5E5EA] text-[#1D1D1F] rounded-full hover:border-[#0071E3] hover:text-[#0071E3] transition shadow-xs">
                    <FaLinkedin className="text-xl" />
                  </a>
                  <a href="https://github.com/AnjaliAnalytics" target="_blank" rel="noreferrer" className="p-3.5 bg-white border border-[#E5E5EA] text-[#1D1D1F] rounded-full hover:border-[#0071E3] hover:text-[#0071E3] transition shadow-xs">
                    <FaGithub className="text-xl" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white border border-[#E5E5EA] rounded-3xl p-6 md:p-10 shadow-xs">
            <form onSubmit={handleFormSubmit} className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="text-xs font-medium text-[#1D1D1F] block mb-1.5">Your Name (Max 50 chars)</label>
                  <input 
                    type="text" 
                    required
                    maxLength={50}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full bg-[#F5F5F7] border border-[#E5E5EA] rounded-xl px-4 py-3 text-sm text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#1D1D1F] block mb-1.5">Email address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                    }}
                    placeholder="john@example.com"
                    className={`w-full bg-[#F5F5F7] border ${formErrors.email ? 'border-red-500' : 'border-[#E5E5EA]'} rounded-xl px-4 py-3 text-sm text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]`}
                  />
                  {formErrors.email && <p className="text-red-500 text-xs font-mono mt-1">{formErrors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="text-xs font-medium text-[#1D1D1F] block mb-1.5">Phone (10 Digits)</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' });
                    }}
                    placeholder="+91 0000000000"
                    className={`w-full bg-[#F5F5F7] border ${formErrors.phone ? 'border-red-500' : 'border-[#E5E5EA]'} rounded-xl px-4 py-3 text-sm text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]`}
                  />
                  {formErrors.phone && <p className="text-red-500 text-xs font-mono mt-1">{formErrors.phone}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-[#1D1D1F] block mb-1.5">Subject</label>
                  <input 
                    type="text" 
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Data Analytics Opportunity"
                    className="w-full bg-[#F5F5F7] border border-[#E5E5EA] rounded-xl px-4 py-3 text-sm text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#1D1D1F] block mb-1.5">Message</label>
                <textarea 
                  rows="4"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Hello Anjali, I reviewed your analytics portfolio..."
                  className="w-full bg-[#F5F5F7] border border-[#E5E5EA] rounded-xl px-4 py-3 text-sm text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#0071E3] text-white font-medium text-base rounded-xl hover:bg-[#0077ED] transition duration-300 shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'} <FaSend />
              </button>

              {formSubmitted && (
                <p className="text-[#0071E3] text-sm font-mono text-center animate-bounce font-medium">
                  Thank you! Your message has been sent.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Detail Pop-Up Modal */}
      {activeModal && (
        <div 
          onClick={() => { playClickSound(); setActiveModal(null); }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/40 backdrop-blur-xs"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-white border border-[#E5E5EA] rounded-3xl p-6 md:p-10 max-w-2xl w-full shadow-xl relative animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto"
          >
            <button 
              onClick={() => { playClickSound(); setActiveModal(null); }}
              className="absolute top-4 right-4 text-[#86868B] hover:text-[#1D1D1F] text-2xl transition"
            >
              <FaTimesCircle />
            </button>

            {activeModal.img && (
              <img src={activeModal.img} alt={activeModal.title} className="w-full h-36 md:h-44 object-cover rounded-2xl mb-4 md:mb-6 border border-[#E5E5EA]" />
            )}

            <span className="text-xs font-mono text-[#0071E3] uppercase font-semibold">// DETAILS</span>
            <h3 className="text-2xl md:text-3xl font-semibold text-[#1D1D1F] mt-1 mb-2">{activeModal.title}</h3>
            <p className="text-xs md:text-sm font-mono text-[#86868B] mb-4 md:mb-6">{activeModal.subtitle}</p>
            <p className="text-[#86868B] text-sm md:text-base leading-relaxed mb-6 md:mb-8">{activeModal.content}</p>
            
            {activeModal.link && (
              <a 
                href={activeModal.link}
                target="_blank"
                rel="noreferrer"
                onClick={playClickSound}
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#0071E3] text-white font-medium text-sm rounded-xl hover:bg-[#0077ED] transition"
              >
                View project GitHub link <FaGithub className="text-base" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Tia AI Assistant */}
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
        {!isChatOpen ? (
          <button 
            onClick={handleToggleChat}
            className="flex items-center gap-3 px-5 py-3 bg-[#0071E3] text-white font-medium rounded-full shadow-lg hover:bg-[#0077ED] transition duration-300 text-sm md:text-base"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden border border-white bg-[#F5F5F7]">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" 
                alt="Tia AI Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            Ask Tia AI
          </button>
        ) : (
          <div className="w-[calc(100vw-2rem)] sm:w-88 md:w-[26rem] bg-white border border-[#E5E5EA] rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[28rem] md:h-[32rem] animate-in slide-in-from-bottom-5 duration-300">
            {/* Header */}
            <div className="bg-[#F5F5F7] p-4 border-b border-[#E5E5EA] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-[#0071E3]">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" 
                    alt="Tia AI Avatar" 
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-[#1D1D1F] text-sm md:text-base">Tia</h4>
                  <span className="text-[10px] md:text-xs text-[#0071E3] font-mono">Portfolio AI Assistant</span>
                </div>
              </div>
              <button onClick={handleToggleChat} className="text-[#86868B] hover:text-[#1D1D1F] text-lg">
                <FaTimes />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs md:text-sm">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl max-w-[85%] whitespace-pre-line ${msg.sender === 'user' ? 'bg-[#0071E3] text-white font-medium' : 'bg-[#F5F5F7] border border-[#E5E5EA] text-[#1D1D1F]'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="p-2 bg-[#F5F5F7]/60 border-t border-[#E5E5EA] flex gap-2 overflow-x-auto text-[11px]">
              {['Experience', 'Education', 'Skills', 'Contact', 'Projects', 'Resume'].map((chip, cIdx) => (
                <button 
                  key={cIdx} 
                  onClick={() => handleSendMessage(`Tell me about her ${chip}`)}
                  className="px-3 py-1 bg-white border border-[#E5E5EA] text-[#1D1D1F] rounded-full hover:border-[#0071E3] font-medium whitespace-nowrap"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="p-3 bg-[#F5F5F7] border-t border-[#E5E5EA] flex gap-2">
              <input 
                type="text" 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask Tia a question..."
                className="flex-1 bg-white border border-[#E5E5EA] rounded-xl px-3 py-2 text-xs md:text-sm text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]"
              />
              <button type="submit" className="p-2.5 bg-[#0071E3] text-white rounded-xl hover:bg-[#0077ED] transition">
                <FaSend className="text-xs" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-8 md:py-12 border-t border-[#E5E5EA] text-center text-xs md:text-sm text-[#86868B] font-mono tracking-normal px-4">
        "In God we trust; all others must bring data." — W. Edwards Deming
      </footer>
    </div>
  );
};

export default Portfolio;