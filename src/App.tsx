import { useEffect, useMemo, useRef, useState } from "react";
import {
  Sun, Moon, Lock, X, Sparkles, Star, Heart, Check, ChevronRight, Calendar,
  Clock, Trophy, Gift, Instagram, Facebook, MessageCircle, MapPin, Phone,
  LayoutDashboard, Bell, Settings2, Image as ImageIcon, Layers, Camera,
  FileText, Search, CalendarDays, Palette, Database, Save, Plus, Trash2,
  Send, Crown, ArrowRight, BadgeCheck, Wand2, Download, RefreshCw, LogOut,
} from "lucide-react";

type Service = { name: string; desc: string; price: string; tag: string; color: string; image?: string };
type ResultItem = { caption: string; sub: string; art: string; size: string; image?: string; beforeImage?: string };
type Post = { title: string; date: string; excerpt: string; content: string; art: string; image?: string };
type CompetitionRequirement = {
  id: string;
  type: "follow_ig" | "follow_fb" | "follow_snap" | "like_post" | "comment" | "share" | "tag_friends";
  label: string;
  enabled: boolean;
  url?: string;
  keyword?: string;
  count?: number;
};
type Booking = { id?: string; name: string; service: string; phone: string; date: string; status: string; finalDate: string; finalTime: string };

interface BarConfig { active: boolean; message: string; linkText: string; linkUrl: string; }
interface GeneralConfig { whatsapp: string; instagram: string; facebook: string; snapchat: string; address: string; }
interface HeroConfig { kicker: string; titleA: string; titleAccent: string; titleB: string; subtitle: string; art: string; image: string; statA: string; statALabel: string; statB: string; statBLabel: string; statC: string; statCLabel: string; }
interface CompConfig { title: string; desc: string; endDate: string; prizeArt: string; prizeImage: string; wins: string; winnerText: string; likeCount: number; isActive: boolean; requirements: CompetitionRequirement[]; }
interface SeoConfig { title: string; description: string; keywords: string; canonical: string; }
interface AppearanceConfig { defaultTheme: string; rose: string; gold: string; }

interface SiteConfig {
  bar: BarConfig;
  general: GeneralConfig;
  hero: HeroConfig;
  services: Service[];
  results: ResultItem[];
  posts: Post[];
  comp: CompConfig;
  seo: SeoConfig;
  appearance: AppearanceConfig;
}

function safeLoad(key: string, fallback: any) {
  try { const v = localStorage.getItem(key); if (v) return JSON.parse(v); } catch {}
  return fallback;
}

const GITHUB_OWNER = (import.meta as any).env?.VITE_GITHUB_OWNER || "AlaaDigital";
const GITHUB_REPO = (import.meta as any).env?.VITE_GITHUB_REPO || "vivace-site";
const GITHUB_BRANCH = (import.meta as any).env?.VITE_GITHUB_BRANCH || "main";
const GITHUB_TOKEN = (import.meta as any).env?.VITE_GITHUB_TOKEN || "";
const GITHUB_CONFIG_PATH = (import.meta as any).env?.VITE_GITHUB_CONFIG_PATH || "public/config.json";
const GITHUB_RAW_URL = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${GITHUB_CONFIG_PATH}`;

const ART: Record<string, string> = {
  rose: "linear-gradient(135deg,#f6d5d8 0%,#E8B4B8 45%,#c98a91 100%)",
  gold: "linear-gradient(135deg,#f7e7b3 0%,#D4AF37 55%,#9a7a1e 100%)",
  noir: "linear-gradient(135deg,#3a3a3a 0%,#1A1A1A 60%,#000 100%)",
  beige: "linear-gradient(135deg,#f5ebe0 0%,#e6ccb2 100%)",
  blush: "linear-gradient(135deg,#fff1f2 0%,#fecdd3 100%)",
  sage: "linear-gradient(135deg,#e7f0e7 0%,#a8c5a8 100%)",
};

const DEFAULT_REQUIREMENTS: CompetitionRequirement[] = [
  { id: "r1", type: "follow_ig", label: "Follow us on Instagram", enabled: true, url: "https://instagram.com/vivace.sydney" },
  { id: "r2", type: "like_post", label: "Like this post", enabled: true, url: "" },
  { id: "r3", type: "comment", label: "Comment with keyword LOVE", enabled: true, keyword: "LOVE" },
  { id: "r4", type: "tag_friends", label: "Tag 2 friends", enabled: true, count: 2 },
  { id: "r5", type: "share", label: "Share to story", enabled: false },
];

const DEFAULT_CONFIG: SiteConfig = {
  bar: { active: true, message: "Winter Glow Special — 20% off Signature Lips", linkText: "Book Now", linkUrl: "#booking" },
  general: { whatsapp: "61400000000", instagram: "https://instagram.com/vivace.sydney", facebook: "https://facebook.com", snapchat: "https://snapchat.com", address: "Sydney, NSW 2000" },
  hero: { kicker: "Sydney's Most Loved Lips", titleA: "Your", titleAccent: "signature", titleB: "look.", subtitle: "Natural, balanced, undetectable. Lips that feel like you - only softer, more defined, more you.", art: "rose", image: "", statA: "5000+", statALabel: "lips perfected", statB: "4.9", statBLabel: "Google rating", statC: "2024", statCLabel: "Best Clinic NSW" },
  services: [
    { name: "Signature Lips • 1ml", desc: "Our hero treatment. Natural volume, crisp border, soft finish.", price: "$550", tag: "Most loved", color: "rose" },
    { name: "Soft Blush • 0.5ml", desc: "A touch of hydration and shape. Perfect first time.", price: "$350", tag: "First timer", color: "blush" },
    { name: "Luxe Rebalance • 1.2ml", desc: "For symmetry and structure that lasts.", price: "$650", tag: "Correction", color: "beige" },
  ],
  results: [
    { caption: "Signature Lips • 1ml", sub: "Healed, week two", art: "rose", size: "Tall", beforeImage: "", image: "" },
    { caption: "Soft Blush • 0.5ml", sub: "Fresh, day one", art: "beige", size: "Medium", beforeImage: "", image: "" },
    { caption: "Luxe Rebalance", sub: "Healed, month one", art: "blush", size: "Tall", beforeImage: "", image: "" },
  ],
  posts: [
    { title: "How we design your signature lip", date: "Oct 2026", excerpt: "Border, body, balance - our 3B method.", content: "We start with border definition, then body hydration, then balance check. Every face is different.", art: "rose", image: "" },
    { title: "Aftercare that actually matters", date: "Oct 2026", excerpt: "What to do first 48 hours.", content: "No kissing, no gym, no hot drinks for 24h. Sleep elevated. Balm only.", art: "beige", image: "" },
  ],
  comp: { title: "Loved Lips Giveaway", desc: "Win 1ml Signature Lips + aftercare kit", endDate: "2026-11-30", prizeArt: "gold", prizeImage: "", wins: "1 winner", winnerText: "Winner announced on IG story", likeCount: 342, isActive: true, requirements: DEFAULT_REQUIREMENTS },
  seo: { title: "VIVACE — Sydney's Most Loved Lips", description: "Natural, balanced, undetectable lips in Sydney.", keywords: "lip filler Sydney, VIVACE", canonical: "https://vivace-site-cst.pages.dev" },
  appearance: { defaultTheme: "light", rose: "#E8B4B8", gold: "#D4AF37" },
};

async function loadFromGitHub(): Promise<any | null> {
  try {
    const r = await fetch(GITHUB_RAW_URL + "?t=" + Date.now());
    if (!r.ok) return null;
    const txt = await r.text();
    if (!txt || txt.trim() === "{}" || txt.trim() === "") return null;
    return JSON.parse(txt);
  } catch { return null; }
}

async function saveToGitHub(data: any): Promise<boolean> {
  if (!GITHUB_TOKEN) return false;
  try {
    const getUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_CONFIG_PATH}`;
    let sha: string | undefined;
    try {
      const res = await fetch(getUrl + `?ref=${GITHUB_BRANCH}`, { headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } });
      if (res.ok) { const j = await res.json(); sha = j.sha; }
    } catch {}
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
    const putRes = await fetch(getUrl, {
      method: "PUT",
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json", "Content-Type": "application/json" },
      body: JSON.stringify({ message: `Update config ${new Date().toISOString()}`, content, sha, branch: GITHUB_BRANCH }),
    });
    return putRes.ok;
  } catch { return false; }
}

function ImageUpload({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-2">
      <div className="text-[10px] uppercase tracking-[0.15em] font-semibold opacity-60">{label}</div>
      <div className="flex gap-2">
        <div className="flex-1 h-[88px] rounded-xl border border-dashed border-black/15 dark:border-white/15 overflow-hidden flex items-center justify-center bg-black/[0.02] dark:bg-white/[0.03]">
          {value ? <img src={value} className="w-full h-full object-cover" alt="" /> : <span className="text-[11px] opacity-50">No image</span>}
        </div>
        <div className="flex flex-col gap-1.5 w-[110px]">
          <button onClick={() => inputRef.current?.click()} className="h-9 rounded-xl border border-black/10 dark:border-white/15 text-[12px] font-medium hover:bg-black/[0.03] flex items-center justify-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" /> {value ? "تغيير" : "رفع"}
          </button>
          {value && <button onClick={() => onChange("")} className="h-8 rounded-xl text-[11px] text-red-500 hover:bg-red-50">حذف</button>}
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
        const f = e.target.files?.[0]; if (!f) return;
        const reader = new FileReader();
        reader.onload = () => onChange(reader.result as string);
        reader.readAsDataURL(f);
      }} />
    </div>
  );
}

export default function App() {
  const [cfg, setCfg] = useState<SiteConfig>(() => {
    const local = safeLoad("vivace_config_v6", null);
    return local || DEFAULT_CONFIG;
  });
  const [theme, setTheme] = useState<"light" | "dark">(() => (safeLoad("vivace_theme", "light") as any));
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminTab, setAdminTab] = useState("dashboard");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [pwd, setPwd] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [storeStatus, setStoreStatus] = useState("Checking...");
  const [bookings, setBookings] = useState<Booking[]>(() => safeLoad("vivace_bookings", []));
  const [newBooking, setNewBooking] = useState<Booking>({ name: "", service: DEFAULT_CONFIG.services[0].name, phone: "", date: "", status: "pending", finalDate: "", finalTime: "" });
  const [giveawayEntries, setGiveawayEntries] = useState<any[]>(() => safeLoad("vivace_giveaway", []));

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#admin") { setShowAdminLogin(true); }
    const checkHash = () => { if (window.location.hash === "#admin") setShowAdminLogin(true); };
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);

  useEffect(() => { localStorage.setItem("vivace_config_v6", JSON.stringify(cfg)); }, [cfg]);
  useEffect(() => { localStorage.setItem("vivace_theme", JSON.stringify(theme)); }, [theme]);
  useEffect(() => { localStorage.setItem("vivace_bookings", JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { localStorage.setItem("vivace_giveaway", JSON.stringify(giveawayEntries)); }, [giveawayEntries]);

  useEffect(() => {
    (async () => {
      const gh = await loadFromGitHub();
      if (gh && gh.services) {
        setCfg((prev) => ({ ...DEFAULT_CONFIG, ...gh, bar: { ...DEFAULT_CONFIG.bar, ...(gh.bar||{}) }, general: { ...DEFAULT_CONFIG.general, ...(gh.general||{}) }, hero: { ...DEFAULT_CONFIG.hero, ...(gh.hero||{}) }, comp: { ...DEFAULT_CONFIG.comp, ...(gh.comp||{}), requirements: gh.comp?.requirements || DEFAULT_CONFIG.comp.requirements }, seo: { ...DEFAULT_CONFIG.seo, ...(gh.seo||{}) }, appearance: { ...DEFAULT_CONFIG.appearance, ...(gh.appearance||{}) } }));
        setStoreStatus("GitHub connected ✓ - يظهر للكل");
      } else {
        setStoreStatus(GITHUB_TOKEN ? "GitHub ready - في انتظار أول حفظ" : "Database connected (local)");
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true); setSaveMsg("");
    const ok = await saveToGitHub(cfg);
    setSaving(false);
    if (ok) { setSaveMsg("Saved to GitHub ✓ يظهر للكل"); setStoreStatus("GitHub connected ✓ - يظهر للكل"); }
    else if (!GITHUB_TOKEN) { setSaveMsg("تم الحفظ محليا - أضف Token واعمل Redeploy"); }
    else { setSaveMsg("Saved locally ✓ - GitHub error, check token"); }
    setTimeout(() => setSaveMsg(""), 3500);
  };

  const isDark = theme === "dark";
  const activeRequirements = cfg.comp.requirements?.filter(r => r.enabled) || [];

  return (
    <div className={isDark ? "dark" : ""}>
      <div className={`min-h-screen font-sans antialiased ${isDark ? "bg-[#0a0a0a] text-[#f5f5f0]" : "bg-[#fdfbf7] text-[#1a1a1a]"} transition-colors`}>
        {/* Notification Bar */}
        {cfg.bar.active && (
          <div className="w-full bg-black text-white text-[12px] py-2 px-4 flex items-center justify-center gap-3">
            <span>{cfg.bar.message}</span>
            <a href={cfg.bar.linkUrl} className="underline font-semibold">{cfg.bar.linkText}</a>
          </div>
        )}

        {/* Header */}
        <header className="sticky top-0 z-30 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.06] bg-white/70 dark:bg-black/60">
          <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-[64px] flex items-center justify-between">
            <div className="flex items-center gap-2 font-serif text-[20px] tracking-[0.2em] font-bold">VIVACE</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setTheme(isDark ? "light" : "dark")} className="w-9 h-9 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center">{isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}</button>
              <a href="#booking" className="h-9 px-5 rounded-full bg-black text-white dark:bg-white dark:text-black text-[13px] font-medium flex items-center gap-1.5">Book <ArrowRight className="w-3.5 h-3.5" /></a>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="max-w-[1280px] mx-auto px-6 md:px-10 pt-10 md:pt-16 pb-10 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] opacity-60 mb-4"><Sparkles className="w-3.5 h-3.5" />{cfg.hero.kicker}</div>
            <h1 className="font-serif text-[48px] md:text-[64px] leading-[0.95] tracking-[-0.02em]">{cfg.hero.titleA} <span className="italic font-light" style={{ color: cfg.appearance.rose }}>{cfg.hero.titleAccent}</span> {cfg.hero.titleB}</h1>
            <p className="mt-5 text-[15px] leading-6 opacity-70 max-w-[420px]">{cfg.hero.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <div className="px-4 py-2 rounded-full bg-black text-white text-[12px]">{cfg.hero.statA} {cfg.hero.statALabel}</div>
              <div className="px-4 py-2 rounded-full border border-black/10 text-[12px] flex items-center gap-1"><Star className="w-3 h-3 fill-black" />{cfg.hero.statB} {cfg.hero.statBLabel}</div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-[32px] overflow-hidden relative" style={{ background: ART[cfg.hero.art] || ART.rose }}>
              {cfg.hero.image ? <img src={cfg.hero.image} className="absolute inset-0 w-full h-full object-cover" alt="" /> : <div className="absolute inset-0 flex items-center justify-center text-white/80 text-[12px]">Hero Image</div>}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-black/70 backdrop-blur rounded-2xl p-3 flex justify-between text-[11px]">
                <div><div className="font-bold text-[14px]">{cfg.hero.statA}</div><div className="opacity-60">{cfg.hero.statALabel}</div></div>
                <div><div className="font-bold text-[14px]">{cfg.hero.statB}</div><div className="opacity-60">{cfg.hero.statBLabel}</div></div>
                <div><div className="font-bold text-[14px]">{cfg.hero.statC}</div><div className="opacity-60">{cfg.hero.statCLabel}</div></div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="max-w-[1280px] mx-auto px-6 md:px-10 py-12">
          <h2 className="font-serif text-[32px] mb-6">Services</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {cfg.services.map((s, i) => (
              <div key={i} className="rounded-[24px] border border-black/[0.06] dark:border-white/[0.06] overflow-hidden bg-white dark:bg-white/[0.03]">
                <div className="h-[160px]" style={{ background: ART[s.color] || ART.rose }}>
                  {s.image && <img src={s.image} className="w-full h-full object-cover" alt="" />}
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2"><span className="text-[11px] uppercase tracking-widest opacity-60">{s.tag}</span><span className="font-semibold">{s.price}</span></div>
                  <div className="font-serif text-[18px]">{s.name}</div>
                  <div className="text-[13px] opacity-60 mt-1">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Before / After */}
        <section className="max-w-[1280px] mx-auto px-6 md:px-10 py-12">
          <h2 className="font-serif text-[32px] mb-6">Before / After</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {cfg.results.map((r, i) => (
              <div key={i} className="rounded-[24px] border border-black/[0.06] dark:border-white/[0.06] overflow-hidden bg-white dark:bg-white/[0.03]">
                <div className="grid grid-cols-2 h-[180px]">
                  <div className="relative overflow-hidden bg-black/5"><span className="absolute top-2 left-2 text-[9px] bg-black text-white px-2 py-0.5 rounded-full">BEFORE</span>{r.beforeImage ? <img src={r.beforeImage} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full" style={{ background: ART[r.art] || ART.rose, opacity: 0.5 }} />}</div>
                  <div className="relative overflow-hidden bg-black/5"><span className="absolute top-2 left-2 text-[9px] bg-white text-black px-2 py-0.5 rounded-full">AFTER</span>{r.image ? <img src={r.image} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full" style={{ background: ART[r.art] || ART.rose }} />}</div>
                </div>
                <div className="p-4"><div className="text-[14px] font-medium">{r.caption}</div><div className="text-[12px] opacity-60">{r.sub}</div></div>
              </div>
            ))}
          </div>
        </section>

        {/* Competition */}
        <section className="max-w-[1280px] mx-auto px-6 md:px-10 py-12">
          {cfg.comp.isActive ? (
            <div className="rounded-[28px] p-6 md:p-8 border border-black/[0.06] dark:border-white/[0.06] bg-gradient-to-br from-[#fff7ed] to-[#fde68a] dark:from-[#1a1a0a] dark:to-[#2a2000] flex flex-col md:flex-row gap-6 items-center">
              <div className="w-[120px] h-[120px] rounded-[20px] overflow-hidden flex-shrink-0" style={{ background: ART[cfg.comp.prizeArt] || ART.gold }}>{cfg.comp.prizeImage ? <img src={cfg.comp.prizeImage} className="w-full h-full object-cover" alt="" /> : null}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1"><Trophy className="w-4 h-4" /><span className="text-[11px] uppercase tracking-widest font-bold">{cfg.comp.wins} • Ends {cfg.comp.endDate}</span></div>
                <h3 className="font-serif text-[24px]">{cfg.comp.title}</h3>
                <p className="text-[13px] opacity-70 mt-1">{cfg.comp.desc}</p>
                <div className="mt-3 flex flex-wrap gap-2">{activeRequirements.map(r => <span key={r.id} className="text-[11px] px-3 py-1 rounded-full bg-black text-white">{r.label}</span>)}</div>
              </div>
              <button onClick={() => { const name = prompt("Your Instagram @?"); if (name) { setGiveawayEntries([...giveawayEntries, { name, date: new Date().toISOString() }]); alert("Entered ✓"); } }} className="h-11 px-6 rounded-full bg-black text-white dark:bg-white dark:text-black text-[13px] font-medium">Enter Giveaway</button>
            </div>
          ) : (
            <div className="rounded-[28px] p-10 border border-dashed border-black/15 dark:border-white/15 text-center"><Gift className="w-8 h-8 mx-auto mb-3 opacity-40" /><div className="font-serif text-[20px]">Giveaway Coming Soon</div><div className="text-[13px] opacity-60 mt-1">Follow us on Instagram to be first to know</div></div>
          )}
        </section>

        {/* Blog */}
        <section className="max-w-[1280px] mx-auto px-6 md:px-10 py-12">
          <h2 className="font-serif text-[32px] mb-6">Journal</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {cfg.posts.map((p, i) => (
              <div key={i} className="rounded-[24px] border border-black/[0.06] dark:border-white/[0.06] p-5 bg-white dark:bg-white/[0.03] flex gap-4">
                <div className="w-[72px] h-[72px] rounded-[14px] overflow-hidden flex-shrink-0" style={{ background: ART[p.art] || ART.rose }}>{p.image && <img src={p.image} className="w-full h-full object-cover" alt="" />}</div>
                <div><div className="text-[11px] opacity-60">{p.date}</div><div className="font-serif text-[16px]">{p.title}</div><div className="text-[12px] opacity-60 mt-1 line-clamp-2">{p.excerpt}</div></div>
              </div>
            ))}
          </div>
        </section>

        {/* Booking */}
        <section id="booking" className="max-w-[1280px] mx-auto px-6 md:px-10 py-16">
          <div className="rounded-[32px] bg-black text-white dark:bg-white dark:text-black p-8 md:p-10 grid md:grid-cols-2 gap-10">
            <div><h2 className="font-serif text-[36px] leading-[0.95]">Ready for<br />your signature?</h2><p className="text-[13px] opacity-70 mt-4">Choose service, leave your number. We confirm final date/time.</p><div className="mt-6 flex items-center gap-2 text-[12px]"><Phone className="w-4 h-4" />{cfg.general.whatsapp}</div></div>
            <div className="bg-white dark:bg-black rounded-[20px] p-5 text-black dark:text-white">
              <div className="grid gap-3">
                <input value={newBooking.name} onChange={e => setNewBooking({ ...newBooking, name: e.target.value })} placeholder="Your name" className="h-11 rounded-xl border border-black/10 px-4 text-[13px]" />
                <select value={newBooking.service} onChange={e => setNewBooking({ ...newBooking, service: e.target.value })} className="h-11 rounded-xl border border-black/10 px-4 text-[13px]">{cfg.services.map(s => <option key={s.name}>{s.name}</option>)}</select>
                <input value={newBooking.phone} onChange={e => setNewBooking({ ...newBooking, phone: e.target.value })} placeholder="WhatsApp" className="h-11 rounded-xl border border-black/10 px-4 text-[13px]" />
                <input type="date" value={newBooking.date} onChange={e => setNewBooking({ ...newBooking, date: e.target.value })} className="h-11 rounded-xl border border-black/10 px-4 text-[13px]" />
                <button onClick={() => { if (!newBooking.name || !newBooking.phone) return alert("Name & phone required"); setBookings([...bookings, { ...newBooking, id: Date.now().toString(), status: "pending", finalDate: "", finalTime: "" }]); setNewBooking({ name: "", service: cfg.services[0].name, phone: "", date: "", status: "pending", finalDate: "", finalTime: "" }); alert("Booking sent ✓ We'll confirm date/time"); }} className="h-11 rounded-xl bg-black text-white dark:bg-white dark:text-black text-[13px] font-medium">Request booking</button>
              </div>
            </div>
          </div>
        </section>

        <footer className="max-w-[1280px] mx-auto px-6 md:px-10 py-10 text-[11px] opacity-60 flex justify-between"><span>© VIVACE Sydney</span><span>{cfg.general.address}</span></footer>

        {/* Admin Login Modal */}
        {showAdminLogin && !isAdmin && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur flex items-center justify-center p-6">
            <div className="w-full max-w-[360px] rounded-[20px] bg-white dark:bg-[#151515] p-6 border border-black/10 dark:border-white/10">
              <div className="flex items-center justify-between mb-5"><div className="flex items-center gap-2 font-bold"><Lock className="w-4 h-4" />Studio admin</div><button onClick={() => { setShowAdminLogin(false); window.location.hash = ""; }} className="w-8 h-8 rounded-full border flex items-center justify-center"><X className="w-4 h-4" /></button></div>
              <input type="password" value={pwd} onChange={e => setPwd(e.target.value)} placeholder="Password" className="w-full h-11 rounded-xl border border-black/10 dark:border-white/10 px-4 text-[13px] bg-transparent" />
              <button onClick={() => { if (pwd === "vivace2026") { setIsAdmin(true); setShowAdminLogin(false); } else alert("Wrong password"); }} className="w-full mt-3 h-11 rounded-xl bg-black text-white dark:bg-white dark:text-black text-[13px]">Enter studio</button>
              <div className="mt-3 text-[11px] opacity-60">{storeStatus}</div>
            </div>
          </div>
        )}

        {/* Admin Panel */}
        {isAdmin && (
          <div className="fixed inset-0 z-[90] bg-[#f8f6f2] dark:bg-[#0a0a0a] flex">
            <div className="w-[220px] border-r border-black/10 dark:border-white/10 p-4 flex flex-col gap-2 overflow-auto bg-[#121212] text-white">
              <div className="font-serif text-[18px] tracking-widest mb-4">VIVACE<br /><span className="text-[12px] opacity-60">studio admin</span></div>
              {[["dashboard","Dashboard"],["bar","Notification Bar"],["general","General"],["hero","Hero"],["services","Services"],["results","Before / After"],["blog","Blog"],["comp","Competition"]].map(([id,label]) => (
                <button key={id} onClick={() => setAdminTab(id)} className={`text-left px-3 py-2 rounded-xl text-[13px] flex items-center gap-2 ${adminTab===id?"bg-white text-black":"opacity-70 hover:bg-white/10"}`}><LayoutDashboard className="w-4 h-4" />{label}</button>
              ))}
              <div className="mt-auto flex flex-col gap-2">
                <button onClick={handleSave} disabled={saving} className="h-11 rounded-xl bg-[#d4b86a] text-black font-medium text-[13px] flex items-center justify-center gap-2">{saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{saving?"Saving...":"Save all changes"}</button>
                <button onClick={() => { setIsAdmin(false); window.location.hash=""; }} className="h-10 rounded-xl border border-white/15 text-[12px] flex items-center justify-center gap-2"><LogOut className="w-4 h-4" />Exit studio</button>
                <div className="text-[10px] opacity-60 mt-2">{storeStatus}</div>
                {saveMsg && <div className="text-[11px] px-3 py-2 rounded-xl bg-[#d4b86a] text-black mt-1">{saveMsg}</div>}
              </div>
            </div>
            <div className="flex-1 overflow-auto p-6 md:p-10">
              <div className="max-w-[820px] mx-auto space-y-8">
                {adminTab==="dashboard" && (
                  <div className="grid gap-4">
                    <div className="rounded-[16px] border p-5 bg-white dark:bg-white/[0.03]">Bookings: {bookings.length} • Giveaway: {giveawayEntries.length}</div>
                    <div className="rounded-[16px] border p-5 bg-white dark:bg-white/[0.03]">{storeStatus}</div>
                  </div>
                )}
                {adminTab==="bar" && (
                  <div className="space-y-4">
                    <h2 className="font-serif text-[22px]">Notification Bar</h2>
                    <label className="flex items-center gap-2 text-[13px]"><input type="checkbox" checked={cfg.bar.active} onChange={e=>setCfg({...cfg, bar:{...cfg.bar, active:e.target.checked}})} />Active</label>
                    <input value={cfg.bar.message} onChange={e=>setCfg({...cfg, bar:{...cfg.bar, message:e.target.value}})} className="w-full h-11 rounded-xl border px-4 text-[13px]" placeholder="Message" />
                    <div className="grid grid-cols-2 gap-3"><input value={cfg.bar.linkText} onChange={e=>setCfg({...cfg, bar:{...cfg.bar, linkText:e.target.value}})} className="h-11 rounded-xl border px-4 text-[13px]" placeholder="Link text" /><input value={cfg.bar.linkUrl} onChange={e=>setCfg({...cfg, bar:{...cfg.bar, linkUrl:e.target.value}})} className="h-11 rounded-xl border px-4 text-[13px]" placeholder="#booking" /></div>
                  </div>
                )}
                {adminTab==="general" && (
                  <div className="space-y-4"><h2 className="font-serif text-[22px]">General</h2>
                    <input value={cfg.general.whatsapp} onChange={e=>setCfg({...cfg, general:{...cfg.general, whatsapp:e.target.value}})} className="w-full h-11 rounded-xl border px-4 text-[13px]" placeholder="WhatsApp 614..." />
                    <input value={cfg.general.instagram} onChange={e=>setCfg({...cfg, general:{...cfg.general, instagram:e.target.value}})} className="w-full h-11 rounded-xl border px-4 text-[13px]" placeholder="Instagram URL" />
                    <input value={cfg.general.address} onChange={e=>setCfg({...cfg, general:{...cfg.general, address:e.target.value}})} className="w-full h-11 rounded-xl border px-4 text-[13px]" placeholder="Address" />
                  </div>
                )}
                {adminTab==="hero" && (
                  <div className="space-y-4"><h2 className="font-serif text-[22px]">Hero</h2>
                    <ImageUpload label="Hero phone mockup image" value={cfg.hero.image} onChange={v=>setCfg({...cfg, hero:{...cfg.hero, image:v}})} />
                    <input value={cfg.hero.kicker} onChange={e=>setCfg({...cfg, hero:{...cfg.hero, kicker:e.target.value}})} className="w-full h-11 rounded-xl border px-4 text-[13px]" placeholder="Kicker" />
                    <div className="grid grid-cols-3 gap-3"><input value={cfg.hero.titleA} onChange={e=>setCfg({...cfg, hero:{...cfg.hero, titleA:e.target.value}})} className="h-11 rounded-xl border px-4 text-[13px]" /><input value={cfg.hero.titleAccent} onChange={e=>setCfg({...cfg, hero:{...cfg.hero, titleAccent:e.target.value}})} className="h-11 rounded-xl border px-4 text-[13px]" /><input value={cfg.hero.titleB} onChange={e=>setCfg({...cfg, hero:{...cfg.hero, titleB:e.target.value}})} className="h-11 rounded-xl border px-4 text-[13px]" /></div>
                    <textarea value={cfg.hero.subtitle} onChange={e=>setCfg({...cfg, hero:{...cfg.hero, subtitle:e.target.value}})} className="w-full h-20 rounded-xl border p-3 text-[13px]" />
                  </div>
                )}
                {adminTab==="services" && (
                  <div className="space-y-4"><h2 className="font-serif text-[22px]">Services</h2>
                    {cfg.services.map((s,i)=>(
                      <div key={i} className="rounded-[16px] border p-4 bg-white dark:bg-white/[0.03] space-y-3">
                        <div className="flex justify-between"><span className="text-[12px] font-semibold">Service {i+1}</span><button onClick={()=>setCfg({...cfg, services: cfg.services.filter((_,j)=>j!==i)})} className="text-[11px] text-red-500">حذف</button></div>
                        <ImageUpload label="Service image" value={s.image||""} onChange={v=>{ const arr=[...cfg.services]; arr[i]={...arr[i], image:v}; setCfg({...cfg, services:arr}); }} />
                        <input value={s.name} onChange={e=>{ const arr=[...cfg.services]; arr[i]={...arr[i], name:e.target.value}; setCfg({...cfg, services:arr}); }} className="w-full h-10 rounded-xl border px-3 text-[13px]" />
                        <input value={s.desc} onChange={e=>{ const arr=[...cfg.services]; arr[i]={...arr[i], desc:e.target.value}; setCfg({...cfg, services:arr}); }} className="w-full h-10 rounded-xl border px-3 text-[13px]" />
                        <div className="grid grid-cols-3 gap-2"><input value={s.price} onChange={e=>{ const arr=[...cfg.services]; arr[i]={...arr[i], price:e.target.value}; setCfg({...cfg, services:arr}); }} className="h-10 rounded-xl border px-3 text-[13px]" /><input value={s.tag} onChange={e=>{ const arr=[...cfg.services]; arr[i]={...arr[i], tag:e.target.value}; setCfg({...cfg, services:arr}); }} className="h-10 rounded-xl border px-3 text-[13px]" /><select value={s.color} onChange={e=>{ const arr=[...cfg.services]; arr[i]={...arr[i], color:e.target.value}; setCfg({...cfg, services:arr}); }} className="h-10 rounded-xl border px-3 text-[13px]"><option value="rose">Rose</option><option value="blush">Blush</option><option value="beige">Beige</option><option value="gold">Gold</option></select></div>
                      </div>
                    ))}
                    <button onClick={()=>setCfg({...cfg, services:[...cfg.services, { name:"New Service", desc:"Description", price:"$500", tag:"New", color:"rose"}]})} className="h-10 px-4 rounded-xl border text-[13px]">+ Add service</button>
                  </div>
                )}
                {adminTab==="results" && (
                  <div className="space-y-4"><h2 className="font-serif text-[22px]">Before / After - مع رفع الصور</h2>
                    {cfg.results.map((r,i)=>(
                      <div key={i} className="rounded-[16px] border p-4 bg-white dark:bg-white/[0.03] space-y-3">
                        <div className="flex justify-between"><span className="text-[12px] font-semibold">Result {i+1}</span><button onClick={()=>setCfg({...cfg, results: cfg.results.filter((_,j)=>j!==i)})} className="text-[11px] text-red-500">حذف</button></div>
                        <div className="grid grid-cols-2 gap-3">
                          <ImageUpload label="Before photo" value={r.beforeImage||""} onChange={v=>{ const arr=[...cfg.results]; arr[i]={...arr[i], beforeImage:v}; setCfg({...cfg, results:arr}); }} />
                          <ImageUpload label="After photo" value={r.image||""} onChange={v=>{ const arr=[...cfg.results]; arr[i]={...arr[i], image:v}; setCfg({...cfg, results:arr}); }} />
                        </div>
                        <div className="grid grid-cols-2 gap-2"><input value={r.caption} onChange={e=>{ const arr=[...cfg.results]; arr[i]={...arr[i], caption:e.target.value}; setCfg({...cfg, results:arr}); }} className="h-10 rounded-xl border px-3 text-[13px]" placeholder="Caption" /><input value={r.sub} onChange={e=>{ const arr=[...cfg.results]; arr[i]={...arr[i], sub:e.target.value}; setCfg({...cfg, results:arr}); }} className="h-10 rounded-xl border px-3 text-[13px]" placeholder="Sub" /></div>
                      </div>
                    ))}
                    <button onClick={()=>setCfg({...cfg, results:[...cfg.results, { caption:"New", sub:"Healed", art:"rose", size:"Medium", beforeImage:"", image:""}]})} className="h-10 px-4 rounded-xl border text-[13px]">+ Add result</button>
                  </div>
                )}
                {adminTab==="blog" && (
                  <div className="space-y-4"><h2 className="font-serif text-[22px]">Blog / Journal</h2>
                    {cfg.posts.map((p,i)=>(
                      <div key={i} className="rounded-[16px] border p-4 bg-white dark:bg-white/[0.03] space-y-3">
                        <div className="flex justify-between"><span className="text-[12px] font-semibold">Post {i+1}</span><button onClick={()=>setCfg({...cfg, posts: cfg.posts.filter((_,j)=>j!==i)})} className="text-[11px] text-red-500">حذف</button></div>
                        <ImageUpload label="Post image" value={p.image||""} onChange={v=>{ const arr=[...cfg.posts]; arr[i]={...arr[i], image:v}; setCfg({...cfg, posts:arr}); }} />
                        <input value={p.title} onChange={e=>{ const arr=[...cfg.posts]; arr[i]={...arr[i], title:e.target.value}; setCfg({...cfg, posts:arr}); }} className="w-full h-10 rounded-xl border px-3 text-[13px]" />
                        <textarea value={p.excerpt} onChange={e=>{ const arr=[...cfg.posts]; arr[i]={...arr[i], excerpt:e.target.value}; setCfg({...cfg, posts:arr}); }} className="w-full h-16 rounded-xl border p-3 text-[13px]" />
                      </div>
                    ))}
                    <button onClick={()=>setCfg({...cfg, posts:[...cfg.posts, { title:"New post", date:"Oct 2026", excerpt:"Excerpt", content:"Content", art:"rose", image:""}]})} className="h-10 px-4 rounded-xl border text-[13px]">+ Add post</button>
                  </div>
                )}
                {adminTab==="comp" && (
                  <div className="space-y-4"><h2 className="font-serif text-[22px]">Competition</h2>
                    <label className="flex items-center gap-2 text-[13px]"><input type="checkbox" checked={cfg.comp.isActive} onChange={e=>setCfg({...cfg, comp:{...cfg.comp, isActive:e.target.checked}})} />Active - إذا غير مفعل يظهر Coming Soon</label>
                    <ImageUpload label="Prize image" value={cfg.comp.prizeImage} onChange={v=>setCfg({...cfg, comp:{...cfg.comp, prizeImage:v}})} />
                    <input value={cfg.comp.title} onChange={e=>setCfg({...cfg, comp:{...cfg.comp, title:e.target.value}})} className="w-full h-11 rounded-xl border px-4 text-[13px]" placeholder="Title" />
                    <textarea value={cfg.comp.desc} onChange={e=>setCfg({...cfg, comp:{...cfg.comp, desc:e.target.value}})} className="w-full h-20 rounded-xl border p-3 text-[13px]" placeholder="Description" />
                    <div className="space-y-3"><div className="font-semibold text-[13px]">Requirements - المتطلبات</div>
                      {cfg.comp.requirements.map((req,i)=>(
                        <div key={req.id} className="rounded-xl border p-3 bg-white dark:bg-white/[0.03] flex flex-col gap-2">
                          <div className="flex items-center justify-between"><label className="flex items-center gap-2 text-[12px]"><input type="checkbox" checked={req.enabled} onChange={e=>{ const arr=[...cfg.comp.requirements]; arr[i]={...arr[i], enabled:e.target.checked}; setCfg({...cfg, comp:{...cfg.comp, requirements:arr}}); }} />{req.type}</label><button onClick={()=>setCfg({...cfg, comp:{...cfg.comp, requirements: cfg.comp.requirements.filter((_,j)=>j!==i)}})} className="text-[11px] text-red-500">حذف</button></div>
                          <input value={req.label} onChange={e=>{ const arr=[...cfg.comp.requirements]; arr[i]={...arr[i], label:e.target.value}; setCfg({...cfg, comp:{...cfg.comp, requirements:arr}}); }} className="h-9 rounded-xl border px-3 text-[12px]" placeholder="Label" />
                          <div className="grid grid-cols-2 gap-2">
                            <input value={req.url||""} onChange={e=>{ const arr=[...cfg.comp.requirements]; arr[i]={...arr[i], url:e.target.value}; setCfg({...cfg, comp:{...cfg.comp, requirements:arr}}); }} className="h-9 rounded-xl border px-3 text-[11px]" placeholder="URL (IG/FB/Snap)" />
                            <input value={req.keyword||""} onChange={e=>{ const arr=[...cfg.comp.requirements]; arr[i]={...arr[i], keyword:e.target.value}; setCfg({...cfg, comp:{...cfg.comp, requirements:arr}}); }} className="h-9 rounded-xl border px-3 text-[11px]" placeholder="Keyword or count" />
                          </div>
                        </div>
                      ))}
                      <button onClick={()=>setCfg({...cfg, comp:{...cfg.comp, requirements:[...cfg.comp.requirements, { id:Date.now().toString(), type:"follow_ig", label:"New requirement", enabled:true}]}})} className="h-9 px-4 rounded-xl border text-[12px]">+ Add requirement</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
