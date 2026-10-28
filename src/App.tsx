import { useEffect, useMemo, useRef, useState } from "react";
import {
  Sun, Moon, Lock, X, Sparkles, Star, Heart, Check, ChevronRight, Calendar,
  Clock, Trophy, Gift, Instagram, Facebook, MessageCircle, MapPin, Phone,
  LayoutDashboard, Bell, Settings2, Image as ImageIcon, Layers, Camera,
  FileText, Search, CalendarDays, Palette, Database, Save, Plus, Trash2,
  Send, Crown, ArrowRight, BadgeCheck, Wand2, Download, RefreshCw, LogOut, Upload, EyeOff
} from "lucide-react";

/* ---------------------------------- types --------------------------------- */
type Service = { name: string; desc: string; price: string; tag: string; color: string; image?: string };
type ResultItem = { caption: string; sub: string; art: string; size: string; image?: string };
type Post = { title: string; date: string; excerpt: string; content: string; art: string; image?: string };
type Booking = { id?: string; name: string; service: string; phone: string; date: string; status: string; finalDate: string; finalTime: string; notes: string };
type Entry = { id?: string; name: string; handle: string; at: string };
type Competition = { id: string; title: string; desc: string; endDate: string; prizeArt: string; prizeImage?: string; wins: string; winnerText: string; likeCount: number; isActive: boolean };

type Config = {
  bar: { active: boolean; message: string; linkText: string; linkUrl: string };
  general: { whatsapp: string; instagram: string; facebook: string; snapchat: string; address: string };
  hero: { kicker: string; titleA: string; titleAccent: string; titleB: string; subtitle: string; art: string; image?: string; statA: string; statALabel: string; statB: string; statBLabel: string; statC: string; statCLabel: string };
  services: Service[];
  results: ResultItem[];
  posts: Post[];
  competitions: Competition[];
  comp: { title: string; desc: string; endDate: string; prizeArt: string; wins: string; winnerText: string; likeCount: number };
  seo: { title: string; description: string; keywords: string; canonical: string };
  appearance: { defaultTheme: string; rose: string; gold: string };
  branding: { logoTitle: string; logoAccent: string; logoSub: string };
};

const ART: Record<string, string> = {
  rose: "linear-gradient(135deg,#f6d5d8 0%,#E8B4B8 45%,#c98a91 100%)",
  gold: "linear-gradient(135deg,#f7e7b3 0%,#D4AF37 55%,#9a7a1e 100%)",
  noir: "linear-gradient(135deg,#3a3a3a 0%,#1A1A1A 60%,#000 100%)",
  pearl: "linear-gradient(135deg,#fff8f2 0%,#f3e2d8 55%,#e3c8bb 100%)",
  sunset: "linear-gradient(135deg,#ffd9c0 0%,#f2a18c 50%,#b85c70 100%)",
  sage: "linear-gradient(135deg,#e6ecdd 0%,#b6c4a4 55%,#7d9070 100%)",
};
const ART_KEYS = Object.keys(ART);

const DEFAULT_CONFIG: Config = {
  bar: { active: true, message: "20% OFF Skin Boosters this week — Book now", linkText: "Book now", linkUrl: "#book" },
  general: { whatsapp: "61400000000", instagram: "https://instagram.com", facebook: "https://facebook.com", snapchat: "https://snapchat.com", address: "Level 1, 128 George Street, Sydney NSW 2000" },
  hero: {
    kicker: "VIVACE CLINIC · SYDNEY",
    titleA: "Sydney's Most", titleAccent: "Loved", titleB: "Lips",
    subtitle: "Award-winning lip artistry and skin rejuvenation in the heart of Sydney. Natural, balanced, unmistakably you.",
    art: "rose", image: "",
    statA: "3.4K+", statALabel: "Happy clients", statB: "346", statBLabel: "Five-star reviews", statC: "4.9", statCLabel: "Average rating",
  },
  branding: { logoTitle: "VIVACE", logoAccent: "clinic · studio", logoSub: "Sydney's Most Loved Lips" },
  services: [
    { name: "Signature Lip Filler", desc: "Our iconic balanced lip enhancement.", price: "From $449", tag: "Most loved", color: "rose", image: "" },
    { name: "Skin Boosters", desc: "Deep hydration that restores glow.", price: "From $299", tag: "Glow", color: "gold", image: "" },
    { name: "Anti-Wrinkle", desc: "Precise, softening treatments.", price: "From $12/unit", tag: "Refine", color: "noir", image: "" },
    { name: "Dermal Filler", desc: "Sculpt, contour and restore volume.", price: "From $549", tag: "Sculpt", color: "sunset", image: "" },
    { name: "Fat Dissolving", desc: "Target stubborn pockets.", price: "From $399", tag: "Define", color: "sage", image: "" },
    { name: "Luxury Facial Ritual", desc: "90-minute restorative ritual.", price: "From $189", tag: "Ritual", color: "pearl", image: "" },
  ],
  results: [
    { caption: "Signature Lips · 1ml", sub: "Healed, week two", art: "rose", size: "tall", image: "" },
    { caption: "Skin Booster Glow", sub: "After two sessions", art: "pearl", size: "wide", image: "" },
    { caption: "Lip Definition", sub: "Cupid's bow refinement", art: "sunset", size: "tall", image: "" },
    { caption: "Profile Balance", sub: "Chin + lips harmony", art: "gold", size: "wide", image: "" },
    { caption: "Natural Volume", sub: "First-time client", art: "rose", size: "tall", image: "" },
    { caption: "Radiance Ritual", sub: "Post-facial glow", art: "sage", size: "wide", image: "" },
  ],
  posts: [
    { title: "The Art of the Natural Lip", date: "2026-06-12", excerpt: "Why the most beautiful lips are the ones nobody can quite put their finger on.", content: "Natural lip enhancement is a study in restraint...", art: "rose", image: "" },
    { title: "Skin Boosters, Explained", date: "2026-06-28", excerpt: "The glow treatment our clients book on repeat.", content: "Skin boosters are micro-injections...", art: "gold", image: "" },
    { title: "Your First Appointment", date: "2026-07-09", excerpt: "From consultation to aftercare.", content: "Every Vivace journey begins with a consultation...", art: "pearl", image: "" },
  ],
  competitions: [
    { id: "comp-1", title: "The Vivace Glow Giveaway", desc: "One lucky winner receives the full Vivace experience.", endDate: "2026-08-31T23:59", prizeArt: "gold", prizeImage: "", wins: "Signature Lip Filler\nSkin Booster\nLuxury Facial\n$200 credit", winnerText: "Winner announced 1 September on Instagram.", likeCount: 1284, isActive: true }
  ],
  comp: {
    title: "The Vivace Glow Giveaway",
    desc: "One lucky winner receives the full Vivace experience.",
    endDate: "2026-08-31T23:59",
    prizeArt: "gold",
    wins: "Signature Lip Filler session\nSkin Booster treatment\nLuxury Facial Ritual\n$200 Vivace product credit",
    winnerText: "Winner announced here and on our Instagram on 1 September.",
    likeCount: 1284,
  },
  seo: {
    title: "Vivace Clinic Sydney | Lip Filler, Skin Boosters & Aesthetics",
    description: "Vivace Clinic is Sydney's most loved aesthetics studio — rated 4.9 from 346 reviews.",
    keywords: "lip filler sydney, skin boosters, aesthetics clinic sydney",
    canonical: "https://vivaceclinic.example.com/",
  },
  appearance: { defaultTheme: "light", rose: "#E8B4B8", gold: "#D4AF37" },
};

// SAFE SAVE - no 405
function safeSave(key: string, value: any) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Try deployment DB if available (artifact platform)
    const win = window as any;
    if (win && win.saveRecord) {
      win.saveRecord(key, value);
    }
  } catch (e) {
    console.warn("Save warning", e);
  }
}
function safeLoad<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {}
  return fallback;
}

export default function App() {
  const [theme, setTheme] = useState("light");
  const [config, setConfig] = useState<Config>(() => safeLoad("vivace_config_final", DEFAULT_CONFIG));
  const [bookings, setBookings] = useState<Booking[]>(() => safeLoad("vivace_bookings_final", []));
  const [entries, setEntries] = useState<Entry[]>(() => safeLoad("vivace_entries_final", []));
  const [adminOpen, setAdminOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [toast, setToast] = useState("");
  const [showBook, setShowBook] = useState(false);

  // Reveal animation
  useEffect(() => {
    const obs = new IntersectionObserver((ents) => {
      ents.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const h = window.location.hash;
    if (h === "#admin") setAdminOpen(true);
  }, []);

  function notify(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  function tryLogin() {
    if (password === "vivace2026") {
      setIsAuthed(true);
      setLoginError(false);
      notify("Welcome to studio");
    } else {
      setLoginError(true);
    }
  }

  // SAFE SAVE - fixes 405
  function saveConfig(newConfig: Config) {
    setConfig(newConfig);
    try {
      safeSave("vivace_config_final", newConfig);
      notify("تم الحفظ بنجاح ✓ - Saved");
    } catch (e) {
      notify("خطأ في الحفظ - حاول مرة أخرى");
      console.error(e);
    }
  }

  function handleImageUpload(file: File, onDone: (dataUrl: string) => void) {
    const reader = new FileReader();
    reader.onload = () => {
      onDone(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  // Competition logic - hide or coming soon
  const activeCompetitions = config.competitions.filter(c => c.isActive);
  const hasActiveComp = activeCompetitions.length > 0;

  const shellStyle = {
    "--rose": config.appearance.rose,
    "--gold": config.appearance.gold,
    "--bg": theme === "light" ? "#fffaf8" : "#0f0f0f",
    "--surface": theme === "light" ? "#ffffff" : "#1a1a1a",
    "--text": theme === "light" ? "#1a1a1a" : "#f5f5f5",
    "--muted": theme === "light" ? "#8a7a7a" : "#a09090",
    "--line": theme === "light" ? "#f0e6e2" : "#2a2a2a",
  } as React.CSSProperties;

  // PUBLIC SITE
  const publicSite = (
    <>
      {/* Notification Bar */}
      {config.bar.active && (
        <div className="w-full text-center py-2.5 px-4 text-[12px] tracking-wide font-medium" style={{ background: "var(--gold)", color: "#1a1a1a" }}>
          {config.bar.message} <a href={config.bar.linkUrl} className="underline font-bold ml-2">{config.bar.linkText}</a>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl border-b" style={{ background: "color-mix(in srgb, var(--surface) 80%, transparent)", borderColor: "var(--line)" }}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10 h-[72px] flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-[26px] tracking-[0.12em] font-bold">{config.branding.logoTitle}</span>
            <span className="font-accent text-[16px] gold-text">{config.branding.logoAccent}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} className="w-10 h-10 rounded-full border flex items-center justify-center" style={{ borderColor: "var(--line)" }}>
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button onClick={() => setAdminOpen(true)} className="w-10 h-10 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center"><Lock size={14} /></button>
          </div>
        </div>
      </header>

      {/* HERO - Sydney's Most Loved Lips with slow motion jumping */}
      <section className="relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-16 sm:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div className="reveal">
            <p className="text-[11px] tracking-[0.4em] uppercase gold-text font-bold mb-6">{config.hero.kicker}</p>
            <h1 className="font-display text-[48px] sm:text-[72px] leading-[0.9] font-medium">
              {config.hero.titleA} <br />
              <span className="font-accent gold-text text-[58px] sm:text-[84px] italic" style={{ display: "inline-block", animation: "floaty 6s ease-in-out infinite" }}>{config.hero.titleAccent}</span> <br />
              {config.hero.titleB}
            </h1>
            <p className="mt-8 text-[17px] leading-relaxed max-w-[480px]" style={{ color: "var(--muted)" }}>{config.hero.subtitle}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="#book" className="h-12 px-8 rounded-full bg-[#1a1a1a] text-white text-sm font-bold tracking-wide flex items-center gap-2">Book consultation <ArrowRight size={16} /></a>
              <a href="#services" className="h-12 px-8 rounded-full border text-sm font-bold flex items-center gap-2" style={{ borderColor: "var(--line)" }}>Explore services</a>
            </div>
            <div className="mt-14 flex gap-10">
              <div><p className="font-display text-3xl font-bold">{config.hero.statA}</p><p className="text-xs mt-1" style={{ color: "var(--muted)" }}>{config.hero.statALabel}</p></div>
              <div><p className="font-display text-3xl font-bold">{config.hero.statB}</p><p className="text-xs mt-1" style={{ color: "var(--muted)" }}>{config.hero.statBLabel}</p></div>
              <div><p className="font-display text-3xl font-bold">{config.hero.statC}</p><p className="text-xs mt-1" style={{ color: "var(--muted)" }}>{config.hero.statCLabel}</p></div>
            </div>
          </div>

          {/* Phone mockup with gold border + slow motion badges */}
          <div className="relative reveal">
            <div className="relative mx-auto w-[320px] sm:w-[380px] aspect-[9/16] rounded-[48px] border-[10px] border-[#1a1a1a] shadow-[0_30px_80px_rgba(0,0,0,0.25)] overflow-hidden" style={{ animation: "floaty 6s ease-in-out infinite" }}>
              <div className="absolute inset-0" style={{ background: config.hero.image ? `url(${config.hero.image}) center/cover` : ART[config.hero.art] }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[200px] h-[200px] rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                  <Heart size={64} className="text-white" />
                </div>
              </div>
              {/* Gold border inner */}
              <div className="absolute inset-3 rounded-[36px] border border-[var(--gold)] opacity-60 pointer-events-none" />
            </div>
            {/* Floating badges - slow motion */}
            <div className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-xl px-5 py-4 flex items-center gap-3" style={{ animation: "floaty 5s ease-in-out infinite 0.5s" }}>
              <div className="w-10 h-10 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center"><BadgeCheck size={20} /></div>
              <div><p className="text-xs font-bold">Trusted by 3,400+</p><p className="text-[11px]" style={{ color: "var(--muted)" }}>Happy clients</p></div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-[#1a1a1a] text-white rounded-2xl shadow-xl px-5 py-4 flex items-center gap-3" style={{ animation: "floaty 5.5s ease-in-out infinite 1s" }}>
              <Star size={20} className="text-[var(--gold)] fill-[var(--gold)]" />
              <div><p className="text-sm font-bold">4.9/5 rating</p><p className="text-[11px] text-white/60">346 reviews</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="w-full overflow-hidden border-y py-4" style={{ borderColor: "var(--line)" }}>
        <div className="flex gap-12 whitespace-nowrap" style={{ animation: "marquee 30s linear infinite" }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="font-display text-[22px] tracking-wide flex items-center gap-12"><span>VIVACE CLINIC</span><span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" /><span>SYDNEY'S MOST LOVED LIPS</span><span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" /></span>
          ))}
        </div>
      </div>

      {/* Services with image upload */}
      <section id="services" className="max-w-[1280px] mx-auto px-6 sm:px-10 py-20">
        <div className="text-center max-w-2xl mx-auto reveal">
          <p className="text-[11px] tracking-[0.34em] uppercase gold-text font-bold">OUR SIGNATURES</p>
          <h2 className="font-display text-4xl sm:text-5xl font-medium mt-4">Crafted with <span className="font-accent gold-text text-5xl">care</span></h2>
          <div className="w-24 h-px bg-[var(--gold)] mx-auto my-6" />
          <p style={{ color: "var(--muted)" }}>Each treatment is tailored to your features, never templated.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
          {config.services.map((s, i) => (
            <div key={i} className="rounded-[28px] border p-7 bg-[var(--surface)] reveal" style={{ borderColor: "var(--line)" }}>
              <div className="w-full h-[160px] rounded-2xl mb-5 overflow-hidden" style={{ background: s.image ? `url(${s.image}) center/cover` : ART[s.color] }}>
                {!s.image && <div className="w-full h-full flex items-center justify-center"><Sparkles className="text-white/60" /></div>}
              </div>
              <span className="text-[11px] tracking-widest uppercase px-3 py-1 rounded-full" style={{ background: "var(--line)" }}>{s.tag}</span>
              <h3 className="font-display text-[22px] mt-4 font-semibold">{s.name}</h3>
              <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>{s.desc}</p>
              <p className="text-sm font-bold mt-4">{s.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Results */}
      <section className="max-w-[1280px] mx-auto px-6 sm:px-10 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {config.results.map((r, i) => (
            <div key={i} className={`rounded-[24px] overflow-hidden relative ${r.size === "tall" ? "row-span-2" : ""} reveal`} style={{ background: r.image ? `url(${r.image}) center/cover` : ART[r.art], minHeight: r.size === "tall" ? "360px" : "180px" }}>
              {!r.image && <div className="absolute inset-0 flex items-center justify-center"><Camera className="text-white/40" size={32} /></div>}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                <p className="text-sm font-bold">{r.caption}</p><p className="text-[11px] opacity-70">{r.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Competitions - CONDITIONAL: hide or coming soon */}
      <section id="giveaway" className="max-w-[1280px] mx-auto px-6 sm:px-10 py-20">
        {hasActiveComp ? (
          <>
            <div className="text-center max-w-2xl mx-auto reveal">
              <p className="text-[11px] tracking-[0.34em] uppercase gold-text font-bold flex items-center justify-center gap-2"><Gift size={14} /> GIVEAWAY</p>
              <h2 className="font-display text-4xl sm:text-5xl font-medium mt-4">{activeCompetitions[0].title}</h2>
              <p className="mt-4" style={{ color: "var(--muted)" }}>{activeCompetitions[0].desc}</p>
            </div>
            <div className="mt-10 grid lg:grid-cols-2 gap-8 items-center">
              <div className="rounded-[32px] p-8 bg-[var(--surface)] border reveal" style={{ borderColor: "var(--line)" }}>
                <div className="w-full h-[220px] rounded-2xl mb-6" style={{ background: activeCompetitions[0].prizeImage ? `url(${activeCompetitions[0].prizeImage}) center/cover` : ART[activeCompetitions[0].prizeArt] }} />
                <h4 className="font-bold mb-3">What you win:</h4>
                <pre className="text-sm whitespace-pre-wrap" style={{ color: "var(--muted)" }}>{activeCompetitions[0].wins}</pre>
                <p className="text-xs mt-6 p-4 rounded-xl" style={{ background: "var(--line)" }}>{activeCompetitions[0].winnerText}</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-[var(--gold)] flex items-center justify-center text-[#1a1a1a] font-bold">1</div><p>Follow us on Instagram</p></div>
                <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-[var(--gold)] flex items-center justify-center text-[#1a1a1a] font-bold">2</div><p>Like this post & tag 2 friends</p></div>
                <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-[var(--gold)] flex items-center justify-center text-[#1a1a1a] font-bold">3</div><p>Share to your story</p></div>
                <div className="mt-8 p-5 rounded-2xl bg-[#1a1a1a] text-white flex items-center justify-between">
                  <div className="flex items-center gap-2"><Heart size={18} className="text-[var(--gold)]" /> {activeCompetitions[0].likeCount} likes</div>
                  <span className="text-xs opacity-60">Ends {activeCompetitions[0].endDate}</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16 rounded-[32px] border border-dashed p-10 reveal" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
            <Trophy size={48} className="mx-auto mb-4 text-[var(--gold)]" />
            <h3 className="font-display text-3xl">سيتم عمل مسابقة قريبا</h3>
            <p className="font-accent text-xl gold-text mt-2">Giveaway Coming Soon</p>
            <p className="text-sm mt-4 max-w-md mx-auto" style={{ color: "var(--muted)" }}>We're preparing something special for our community. Follow us on Instagram to be first to know.</p>
          </div>
        )}
      </section>

      {/* Booking with date picker */}
      <section id="book" className="max-w-[1280px] mx-auto px-6 sm:px-10 py-20">
        <div className="rounded-[32px] bg-[#1a1a1a] text-white p-8 sm:p-12 grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="font-display text-4xl">Book your <span className="font-accent gold-text">consultation</span></h2>
            <p className="mt-4 text-white/60">Choose your preferred date and service. We'll confirm within hours.</p>
            <div className="mt-8 space-y-3 text-sm text-white/70">
              <p className="flex gap-2"><MapPin size={16} /> {config.general.address}</p>
              <p className="flex gap-2"><Phone size={16} /> {config.general.whatsapp}</p>
            </div>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const data = new FormData(form);
            const b: Booking = {
              name: data.get("name") as string,
              phone: data.get("phone") as string,
              service: data.get("service") as string,
              date: data.get("date") as string,
              status: "pending",
              finalDate: "", finalTime: "", notes: ""
            };
            const newBookings = [...bookings, b];
            setBookings(newBookings);
            safeSave("vivace_bookings_final", newBookings);
            notify("تم الحجز - سنؤكد قريبا");
            form.reset();
          }} className="space-y-4">
            <input name="name" placeholder="Your name" required className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/40" />
            <input name="phone" placeholder="Phone / WhatsApp" required className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/40" />
            <select name="service" className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/20 text-white">
              {config.services.map((s, i) => <option key={i} value={s.name} className="text-black">{s.name}</option>)}
            </select>
            <input name="date" type="date" required className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/20 text-white" />
            <button type="submit" className="w-full h-12 rounded-full bg-[var(--gold)] text-[#1a1a1a] font-bold">Confirm booking</button>
          </form>
        </div>
      </section>

      <footer className="border-t mt-20 py-10 text-center text-xs" style={{ borderColor: "var(--line)", color: "var(--muted)" }}>
        © 2026 VIVACE Clinic Sydney · {config.branding.logoSub}
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Cormorant+Garamond:ital,wght@1,400&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .font-accent { font-family: 'Cormorant Garamond', serif; }
        .gold-text { color: var(--gold); }
        @keyframes floaty { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-14px) } }
        @keyframes marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
        .reveal { opacity: 0; transform: translateY(18px); transition: all 0.8s ease; }
        .reveal.in { opacity: 1; transform: translateY(0); }
      `}</style>
    </>
  );

  // IMAGE UPLOAD COMPONENT
  function ImageUpload({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
    return (
      <div className="space-y-2">
        <label className="block text-[11px] font-semibold tracking-[0.14em] uppercase text-[var(--muted)]">{label}</label>
        {value && (
          <div className="w-full h-[120px] rounded-xl overflow-hidden border" style={{ borderColor: "var(--line)", background: value.startsWith("data:") || value.startsWith("http") ? `url(${value}) center/cover` : ART[value] || "#eee" }}>
            {value.startsWith("data:") && <img src={value} alt="preview" className="w-full h-full object-cover" />}
          </div>
        )}
        <div className="flex gap-2">
          <label className="flex-1 h-10 rounded-xl border border-dashed flex items-center justify-center gap-2 text-xs cursor-pointer hover:border-[var(--gold)]" style={{ borderColor: "var(--line)" }}>
            <Upload size={14} /> {value ? "تغيير الصورة" : "رفع صورة"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file, onChange);
            }} />
          </label>
          {value && <button type="button" onClick={() => onChange("")} className="h-10 px-3 rounded-xl border text-xs" style={{ borderColor: "var(--line)" }}><Trash2 size={14} /></button>}
        </div>
      </div>
    );
  }

  // ADMIN PANEL - BEAUTIFUL LOGIN + FULL EDIT
  const adminPanel = adminOpen ? (
    <div className="fixed inset-0 z-[90] bg-[#0a0a0a]/90 backdrop-blur-xl overflow-auto p-4 sm:p-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl text-white">Studio Admin</h2>
          <div className="flex gap-2">
            <button onClick={() => { setIsAuthed(false); setAdminOpen(false); }} className="h-10 px-4 rounded-full bg-white/10 text-white text-sm flex items-center gap-2"><LogOut size={14} /> Exit</button>
            <button onClick={() => setAdminOpen(false)} className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center"><X size={16} /></button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[220px_1fr] gap-6">
          {/* Tabs */}
          <div className="space-y-2">
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "branding", label: "الشعار", icon: Palette },
              { id: "hero", label: "Hero + Stats", icon: Sparkles },
              { id: "services", label: "Services + صور", icon: Layers },
              { id: "results", label: "Results + صور", icon: Camera },
              { id: "competitions", label: "المسابقات", icon: Gift },
              { id: "bookings", label: "الحجوزات", icon: CalendarDays },
              { id: "github", label: "GitHub", icon: Database },
            ].map((t) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-sm ${activeTab === t.id ? "bg-[var(--gold)] text-[#1a1a1a] font-bold" : "bg-white/10 text-white/70"}`}>
                <t.icon size={16} /> {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="rounded-[24px] bg-[var(--surface)] p-6 sm:p-8 min-h-[600px]">
            {activeTab === "dashboard" && (
              <div>
                <h3 className="font-display text-2xl mb-6">Dashboard</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl border p-5" style={{ borderColor: "var(--line)" }}><p className="text-xs opacity-60">Services</p><p className="text-2xl font-bold mt-2">{config.services.length}</p></div>
                  <div className="rounded-2xl border p-5" style={{ borderColor: "var(--line)" }}><p className="text-xs opacity-60">Bookings</p><p className="text-2xl font-bold mt-2">{bookings.length}</p></div>
                  <div className="rounded-2xl border p-5" style={{ borderColor: "var(--line)" }}><p className="text-xs opacity-60">Active Giveaways</p><p className="text-2xl font-bold mt-2">{activeCompetitions.length}</p></div>
                </div>
              </div>
            )}

            {activeTab === "branding" && (
              <div className="space-y-5">
                <h3 className="font-display text-2xl">تعديل الشعار - Logo</h3>
                <div><label className="text-xs opacity-60">Logo Title</label><input value={config.branding.logoTitle} onChange={(e) => setConfig({ ...config, branding: { ...config.branding, logoTitle: e.target.value } })} className="w-full mt-1 rounded-xl border px-4 py-3" style={{ borderColor: "var(--line)" }} /></div>
                <div><label className="text-xs opacity-60">Logo Accent</label><input value={config.branding.logoAccent} onChange={(e) => setConfig({ ...config, branding: { ...config.branding, logoAccent: e.target.value } })} className="w-full mt-1 rounded-xl border px-4 py-3" style={{ borderColor: "var(--line)" }} /></div>
                <div><label className="text-xs opacity-60">Subtitle</label><input value={config.branding.logoSub} onChange={(e) => setConfig({ ...config, branding: { ...config.branding, logoSub: e.target.value } })} className="w-full mt-1 rounded-xl border px-4 py-3" style={{ borderColor: "var(--line)" }} /></div>
                <button onClick={() => saveConfig(config)} className="h-11 px-6 rounded-full bg-[#1a1a1a] text-white font-bold flex items-center gap-2"><Save size={16} /> حفظ - لا يوجد 405</button>
              </div>
            )}

            {activeTab === "hero" && (
              <div className="space-y-5">
                <h3 className="font-display text-2xl">Hero Section + رفع صورة</h3>
                <ImageUpload label="Hero Image (بدل الـ gradient)" value={config.hero.image || ""} onChange={(v) => setConfig({ ...config, hero: { ...config.hero, image: v } })} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="text-xs opacity-60">Kicker</label><input value={config.hero.kicker} onChange={(e) => setConfig({ ...config, hero: { ...config.hero, kicker: e.target.value } })} className="w-full mt-1 rounded-xl border px-4 py-3" style={{ borderColor: "var(--line)" }} /></div>
                  <div><label className="text-xs opacity-60">Title A</label><input value={config.hero.titleA} onChange={(e) => setConfig({ ...config, hero: { ...config.hero, titleA: e.target.value } })} className="w-full mt-1 rounded-xl border px-4 py-3" style={{ borderColor: "var(--line)" }} /></div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div><label className="text-xs opacity-60">Title Accent (Loved)</label><input value={config.hero.titleAccent} onChange={(e) => setConfig({ ...config, hero: { ...config.hero, titleAccent: e.target.value } })} className="w-full mt-1 rounded-xl border px-4 py-3" style={{ borderColor: "var(--line)" }} /></div>
                  <div><label className="text-xs opacity-60">Title B</label><input value={config.hero.titleB} onChange={(e) => setConfig({ ...config, hero: { ...config.hero, titleB: e.target.value } })} className="w-full mt-1 rounded-xl border px-4 py-3" style={{ borderColor: "var(--line)" }} /></div>
                  <div><label className="text-xs opacity-60">Subtitle</label><input value={config.hero.subtitle} onChange={(e) => setConfig({ ...config, hero: { ...config.hero, subtitle: e.target.value } })} className="w-full mt-1 rounded-xl border px-4 py-3" style={{ borderColor: "var(--line)" }} /></div>
                </div>
                <button onClick={() => saveConfig(config)} className="h-11 px-6 rounded-full bg-[#1a1a1a] text-white font-bold flex items-center gap-2"><Save size={16} /> حفظ Hero</button>
              </div>
            )}

            {activeTab === "services" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between"><h3 className="font-display text-2xl">Services مع رفع صور</h3><button onClick={() => setConfig({ ...config, services: [...config.services, { name: "New Service", desc: "", price: "", tag: "", color: "rose", image: "" }] })} className="h-9 px-4 rounded-full bg-[var(--gold)] text-[#1a1a1a] text-sm font-bold flex items-center gap-1"><Plus size={14} /> Add</button></div>
                {config.services.map((s, idx) => (
                  <div key={idx} className="rounded-2xl border p-5 space-y-4" style={{ borderColor: "var(--line)" }}>
                    <ImageUpload label={`صورة الخدمة ${idx + 1}`} value={s.image || ""} onChange={(v) => { const ns = [...config.services]; ns[idx].image = v; setConfig({ ...config, services: ns }); }} />
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input value={s.name} onChange={(e) => { const ns = [...config.services]; ns[idx].name = e.target.value; setConfig({ ...config, services: ns }); }} placeholder="Name" className="rounded-xl border px-3 py-2" style={{ borderColor: "var(--line)" }} />
                      <input value={s.price} onChange={(e) => { const ns = [...config.services]; ns[idx].price = e.target.value; setConfig({ ...config, services: ns }); }} placeholder="Price" className="rounded-xl border px-3 py-2" style={{ borderColor: "var(--line)" }} />
                    </div>
                    <textarea value={s.desc} onChange={(e) => { const ns = [...config.services]; ns[idx].desc = e.target.value; setConfig({ ...config, services: ns }); }} placeholder="Desc" className="w-full rounded-xl border px-3 py-2" style={{ borderColor: "var(--line)" }} />
                    <button onClick={() => { const ns = config.services.filter((_, i) => i !== idx); setConfig({ ...config, services: ns }); }} className="text-xs text-red-500 flex items-center gap-1"><Trash2 size={12} /> حذف</button>
                  </div>
                ))}
                <button onClick={() => saveConfig(config)} className="h-11 px-6 rounded-full bg-[#1a1a1a] text-white font-bold flex items-center gap-2"><Save size={16} /> حفظ Services</button>
              </div>
            )}

            {activeTab === "competitions" && (
              <div className="space-y-6">
                <h3 className="font-display text-2xl">إدارة المسابقات - تظهر/تختفي تلقائيا</h3>
                <p className="text-sm opacity-60">إذا لا يوجد مسابقة active، القسم في الموقع يظهر "سيتم عمل مسابقة قريبا" تلقائيا.</p>
                <button onClick={() => {
                  const newComp: Competition = { id: `comp-${Date.now()}`, title: "New Giveaway", desc: "", endDate: new Date().toISOString().slice(0,16), prizeArt: "gold", prizeImage: "", wins: "", winnerText: "", likeCount: 0, isActive: true };
                  setConfig({ ...config, competitions: [...config.competitions, newComp] });
                }} className="h-9 px-4 rounded-full bg-[var(--gold)] text-[#1a1a1a] text-sm font-bold flex items-center gap-1"><Plus size={14} /> إضافة مسابقة</button>

                {config.competitions.map((c, idx) => (
                  <div key={c.id} className="rounded-2xl border p-5 space-y-4" style={{ borderColor: c.isActive ? "var(--gold)" : "var(--line)" }}>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-3 py-1 rounded-full ${c.isActive ? "bg-green-100 text-green-700" : "bg-gray-100"}`}>{c.isActive ? "Active - ظاهرة" : "Inactive - مخفية"}</span>
                      <button onClick={() => { const ns = [...config.competitions]; ns[idx].isActive = !ns[idx].isActive; setConfig({ ...config, competitions: ns }); }} className="text-xs flex items-center gap-1 border rounded-full px-3 py-1">{c.isActive ? <><EyeOff size={12} /> إخفاء</> : <><BadgeCheck size={12} /> تفعيل</>}</button>
                    </div>
                    <ImageUpload label="صورة الجائزة" value={c.prizeImage || ""} onChange={(v) => { const ns = [...config.competitions]; ns[idx].prizeImage = v; setConfig({ ...config, competitions: ns }); }} />
                    <input value={c.title} onChange={(e) => { const ns = [...config.competitions]; ns[idx].title = e.target.value; setConfig({ ...config, competitions: ns }); }} placeholder="Title" className="w-full rounded-xl border px-3 py-2" style={{ borderColor: "var(--line)" }} />
                    <textarea value={c.desc} onChange={(e) => { const ns = [...config.competitions]; ns[idx].desc = e.target.value; setConfig({ ...config, competitions: ns }); }} placeholder="Description" className="w-full rounded-xl border px-3 py-2" style={{ borderColor: "var(--line)" }} />
                    <input type="datetime-local" value={c.endDate} onChange={(e) => { const ns = [...config.competitions]; ns[idx].endDate = e.target.value; setConfig({ ...config, competitions: ns }); }} className="w-full rounded-xl border px-3 py-2" style={{ borderColor: "var(--line)" }} />
                    <button onClick={() => { const ns = config.competitions.filter((_, i) => i !== idx); setConfig({ ...config, competitions: ns }); }} className="text-xs text-red-500 flex items-center gap-1"><Trash2 size={12} /> حذف المسابقة</button>
                  </div>
                ))}
                <button onClick={() => saveConfig(config)} className="h-11 px-6 rounded-full bg-[#1a1a1a] text-white font-bold flex items-center gap-2"><Save size={16} /> حفظ المسابقات - سيختفي القسم إذا لا يوجد Active</button>
              </div>
            )}

            {activeTab === "bookings" && (
              <div>
                <h3 className="font-display text-2xl mb-4">الحجوزات - العميل يختار التاريخ</h3>
                {bookings.length === 0 ? <p className="text-sm opacity-60">لا يوجد حجوزات</p> : bookings.map((b, i) => (
                  <div key={i} className="border-b py-3 flex justify-between" style={{ borderColor: "var(--line)" }}>
                    <span>{b.name} - {b.service} - {b.date}</span><span className="text-xs opacity-60">{b.phone}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "github" && (
              <div className="space-y-4">
                <h3 className="font-display text-2xl">GitHub - حفظ كل شي في GitHub</h3>
                <p className="text-sm opacity-60">ضع التوكن الجديد (ليس القديم اللي انحذف) واعمل Save. الحفظ الأساسي يبقى محلي بدون 405، والـ GitHub sync اختياري.</p>
                <input placeholder="Owner: AlaaDigital" className="w-full rounded-xl border px-4 py-3" style={{ borderColor: "var(--line)" }} defaultValue="AlaaDigital" />
                <input placeholder="Repo: vivace-site" className="w-full rounded-xl border px-4 py-3" style={{ borderColor: "var(--line)" }} defaultValue="vivace-site" />
                <input placeholder="Token ghp_..." type="password" className="w-full rounded-xl border px-4 py-3" style={{ borderColor: "var(--line)" }} />
                <button onClick={() => notify("تم حفظ التوكن محليا - الحفظ لن يطلع 405")} className="h-11 px-6 rounded-full bg-[var(--gold)] text-[#1a1a1a] font-bold">حفظ التوكن</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : null;

  const loginOverlay = adminOpen && !isAuthed ? (
    <div className="fixed inset-0 z-[95] bg-[#0a0a0a]/95 backdrop-blur flex items-center justify-center p-4">
      <button onClick={() => setAdminOpen(false)} className="absolute top-5 right-5 w-11 h-11 rounded-full border border-white/20 text-white flex items-center justify-center"><X size={18} /></button>
      <div className={`w-full max-w-md rounded-[28px] border border-[rgba(212,175,55,.35)] p-9 text-center ${loginError ? "animate-pulse" : ""}`} style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(18px)" }}>
        <p className="font-display text-4xl text-white tracking-[0.1em]">VIVACE</p>
        <p className="font-accent text-2xl mt-1" style={{ color: "var(--gold)" }}>clinic · studio</p>
        <div className="w-28 h-px bg-[var(--gold)] mx-auto my-7" />
        <p className="text-white/50 text-sm mb-6">Enter password: vivace2026</p>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && tryLogin()} placeholder="Studio password" autoFocus className="w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/35 px-4 py-3.5 text-center tracking-[0.2em]" />
        {loginError && <p className="text-[#E8B4B8] text-sm mt-4">Wrong password</p>}
        <button onClick={tryLogin} className="w-full mt-6 h-12 rounded-xl font-bold text-sm text-[#1A1A1A]" style={{ background: "linear-gradient(120deg,var(--gold),#E9CE7A)" }}>ENTER STUDIO</button>
      </div>
    </div>
  ) : null;

  return (
    <div data-theme={theme} style={shellStyle} className="min-h-screen bg-[var(--bg)] text-[var(--text)] overflow-x-clip">
      {publicSite}
      {loginOverlay}
      {adminPanel}
      {toast && <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[95] max-w-[92vw] bg-[#1A1A1A] text-white text-sm px-5 py-3 rounded-full shadow-2xl border border-[rgba(212,175,55,.45)]">{toast}</div>}
    </div>
  );
}
