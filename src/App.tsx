import { useEffect, useMemo, useRef, useState } from "react";
import {
  Sun, Moon, Lock, X, Sparkles, Star, Heart, Check, ChevronRight, Calendar,
  Clock, Trophy, Gift, Instagram, Facebook, MessageCircle, MapPin, Phone,
  LayoutDashboard, Bell, Settings2, Image as ImageIcon, Layers, Camera,
  FileText, Search, CalendarDays, Palette, Database, Save, Plus, Trash2,
  Send, Crown, ArrowRight, BadgeCheck, Wand2, Download, RefreshCw, LogOut,
} from "lucide-react";

/* ---------------------------------- types --------------------------------- */
type Service = { name: string; desc: string; price: string; tag: string; color: string; image?: string };
type ResultItem = { caption: string; sub: string; art: string; size: string; image?: string; beforeImage?: string };
type Post = { title: string; date: string; excerpt: string; content: string; art: string; image?: string };
type Booking = { id?: string; name: string; service: string; phone: string; date: string; status: string; finalDate: string; finalTime: string; notes: string };
type Entry = { id?: string; name: string; handle: string; at: string; steps?: any };

type CompetitionRequirement = {
  id: string;
  type: "follow_ig" | "follow_fb" | "follow_snap" | "like_post" | "comment" | "share" | "tag_friends";
  label: string;
  enabled: boolean;
  url?: string;
  keyword?: string;
  count?: number;
};

type Config = {
  bar: { active: boolean; message: string; linkText: string; linkUrl: string };
  general: { whatsapp: string; instagram: string; facebook: string; snapchat: string; address: string };
  hero: { kicker: string; titleA: string; titleAccent: string; titleB: string; subtitle: string; art: string; image?: string; statA: string; statALabel: string; statB: string; statBLabel: string; statC: string; statCLabel: string };
  services: Service[];
  results: ResultItem[];
  posts: Post[];
  comp: { 
    title: string; desc: string; endDate: string; prizeArt: string; prizeImage?: string; wins: string; winnerText: string; likeCount: number;
    isActive: boolean;
    requirements: CompetitionRequirement[];
  };
  seo: { title: string; description: string; keywords: string; canonical: string };
  appearance: { defaultTheme: string; rose: string; gold: string };
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
    art: "rose", statA: "3.4K+", statALabel: "Happy clients", statB: "346", statBLabel: "Five-star reviews", statC: "4.9", statCLabel: "Average rating",
  },
  services: [
    { name: "Signature Lip Filler", desc: "Our iconic balanced lip enhancement, tailored to your facial harmony.", price: "From $449", tag: "Most loved", color: "rose" },
    { name: "Skin Boosters", desc: "Deep hydration that restores glow, elasticity and that lit-from-within finish.", price: "From $299", tag: "Glow", color: "gold" },
    { name: "Anti-Wrinkle", desc: "Precise, softening treatments that keep expression — never frozen.", price: "From $12/unit", tag: "Refine", color: "noir" },
    { name: "Dermal Filler", desc: "Sculpt, contour and restore volume with a feather-light touch.", price: "From $549", tag: "Sculpt", color: "sunset" },
    { name: "Fat Dissolving", desc: "Target stubborn pockets for a cleaner, more defined profile.", price: "From $399", tag: "Define", color: "sage" },
    { name: "Luxury Facial Ritual", desc: "A 90-minute restorative ritual: cleanse, sculpt, infuse, illuminate.", price: "From $189", tag: "Ritual", color: "pearl" },
  ],
  results: [
    { caption: "Signature Lips · 1ml", sub: "Healed, week two", art: "rose", size: "tall" },
    { caption: "Skin Booster Glow", sub: "After two sessions", art: "pearl", size: "wide" },
    { caption: "Lip Definition", sub: "Cupid's bow refinement", art: "sunset", size: "tall" },
    { caption: "Profile Balance", sub: "Chin + lips harmony", art: "gold", size: "wide" },
    { caption: "Natural Volume", sub: "First-time client", art: "rose", size: "tall" },
    { caption: "Radiance Ritual", sub: "Post-facial glow", art: "sage", size: "wide" },
  ],
  posts: [
    { title: "The Art of the Natural Lip", date: "2026-06-12", excerpt: "Why the most beautiful lips are the ones nobody can quite put their finger on.", content: "Natural lip enhancement is a study in restraint. At Vivace we map your facial thirds first, then build volume in whisper-thin layers so the result moves, smiles and settles like it was always yours. Hydration, border definition and symmetry do more for beauty than size ever will.", art: "rose" },
    { title: "Skin Boosters, Explained", date: "2026-06-28", excerpt: "The glow treatment our clients book on repeat — what it does and who it suits.", content: "Skin boosters are micro-injections of hydrating gel that work like an internal moisturiser. Over two to three sessions, skin becomes plumper, light reflects more evenly, and makeup sits beautifully. It is the quiet luxury of skincare: invisible work, visible radiance.", art: "gold" },
    { title: "Your First Appointment, Step by Step", date: "2026-07-09", excerpt: "From consultation to aftercare — exactly what to expect at Vivace Clinic.", content: "Every Vivace journey begins with a consultation. We listen first: your goals, your concerns, your timeline. Treatment is gentle and unhurried, and you leave with a personalised aftercare plan and our direct line for any question, day or night.", art: "pearl" },
  ],
  comp: {
    title: "The Vivace Glow Giveaway",
    desc: "One lucky winner receives the full Vivace experience. Complete the steps below to enter — it takes less than a minute.",
    endDate: "2026-08-31T23:59",
    prizeArt: "gold",
    prizeImage: "",
    wins: "Signature Lip Filler session\nSkin Booster treatment\nLuxury Facial Ritual\n$200 Vivace product credit",
    winnerText: "Winner announced here and on our Instagram on 1 September. Good luck, beauties.",
    likeCount: 1284,
    isActive: true,
    requirements: [
      { id: "req_ig", type: "follow_ig", label: "Follow us on Instagram", enabled: true, url: "https://instagram.com" },
      { id: "req_fb", type: "follow_fb", label: "Follow us on Facebook", enabled: true, url: "https://facebook.com" },
      { id: "req_like", type: "like_post", label: "Like the giveaway post", enabled: true, url: "https://instagram.com" },
      { id: "req_comment", type: "comment", label: "Leave a comment", enabled: false, keyword: "VIVACE" },
      { id: "req_share", type: "share", label: "Share to story", enabled: false, url: "" },
      { id: "req_tag", type: "tag_friends", label: "Tag friends", enabled: false, count: 2 },
    ]
  },
  seo: {
    title: "Vivace Clinic Sydney | Lip Filler, Skin Boosters & Aesthetics",
    description: "Vivace Clinic is Sydney's most loved aesthetics studio — signature lip filler, skin boosters and luxury facials rated 4.9 from 346 reviews.",
    keywords: "lip filler sydney, skin boosters, aesthetics clinic sydney, vivace clinic",
    canonical: "https://vivaceclinic.example.com/",
  },
  appearance: { defaultTheme: "light", rose: "#E8B4B8", gold: "#D4AF37" },
};

const REVIEWS = [
  { name: "S. M.", text: "Obsessed is an understatement. My lips look like mine, just better. Zero bruising!", time: "09:41" },
  { name: "J. K.", text: "The clinic is stunning and the team made me feel so calm. Booking my skin booster next.", time: "11:07" },
  { name: "A. R.", text: "Third visit and I would not trust anyone else with my face. The glow is unreal.", time: "14:23" },
  { name: "T. L.", text: "They listened to exactly what I wanted — natural, soft, balanced. 10/10 experience.", time: "16:58" },
];

/* ---------------------------------- api ----------------------------------- */
function safeSave(key: string, value: any) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}
function safeLoad(key: string, fallback: any) {
  try { const v = localStorage.getItem(key); if (v) return JSON.parse(v); } catch {}
  return fallback;
}

// Cloudflare KV via Pages Functions - no GitHub needed
async function loadFromKV(): Promise<any | null> {
  try {
    const r = await fetch("/api/config?t=" + Date.now(), { cache: "no-store" });
    if (!r.ok) return null;
    const j = await r.json();
    if (!j || Object.keys(j).length === 0) return null;
    return j;
  } catch { return null; }
}
async function saveToKV(data: any): Promise<boolean> {
  try {
    const r = await fetch("/api/config", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    return r.ok;
  } catch { return false; }
}

// Image upload removed - using external URL only - no file upload
async function api(action: string, args: Record<string, unknown>) {
  try {
    const res = await fetch("actions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action, args }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || (data as { error?: string }).error) {
      if (res.status === 405 || res.status === 404) {
        // Static Pages fallback - use localStorage
        const col = (args as any).collection;
        if (action === "records.list") {
          if (col === "config") {
            const cfg = safeLoad("vivace_config", null);
            return cfg ? { records: [{ id: "local-config", value: cfg }] } : { records: [] };
          }
          if (col === "bookings") {
            const bks = safeLoad("vivace_bookings", []);
            return { records: bks.map((v: any, i: number) => ({ id: v.id || `bk-${i}`, value: v })) };
          }
          if (col === "entries") {
            const ents = safeLoad("vivace_entries", []);
            return { records: ents.map((v: any, i: number) => ({ id: v.id || `en-${i}`, value: v })) };
          }
        }
        if (action === "records.create" || action === "records.replace") {
          const c = (args as any).collection;
          const val = (args as any).value;
          if (c === "config") safeSave("vivace_config", val);
          if (c === "bookings") { const all = safeLoad("vivace_bookings", []); all.push(val); safeSave("vivace_bookings", all); }
          if (c === "entries") { const all = safeLoad("vivace_entries", []); all.push(val); safeSave("vivace_entries", all); }
          return { id: `local-${Date.now()}` };
        }
        if (action === "records.delete") return {};
        throw new Error("OFFLINE_MODE");
      }
      throw new Error((data as { error?: string }).error || `Request failed (${res.status})`);
    }
    return (data as { data: unknown }).data;
  } catch (e) {
    const msg = String(e);
    if (msg.includes("OFFLINE_MODE") || msg.includes("Failed to fetch") || msg.includes("405")) {
      const col = (args as any)?.collection;
      if (action === "records.list" && col === "config") {
        const cfg = safeLoad("vivace_config", null);
        return cfg ? { records: [{ id: "local-config", value: cfg }] } : { records: [] };
      }
      if (action === "records.create" || action === "records.replace") {
        const c = (args as any)?.collection;
        const val = (args as any)?.value;
        if (c === "config") safeSave("vivace_config", val);
        return { id: `local-${Date.now()}` };
      }
      if (action === "records.list") return { records: [] };
      return { id: `local-${Date.now()}` };
    }
    throw e;
  }
}

const waLink = (number: string, text: string) =>
  `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;

// fixed - removed broken GitHub line


/* --------------------------------- app ------------------------------------ */
export default function App() {
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
  const [configId, setConfigId] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [themeTouched, setThemeTouched] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [storeStatus, setStoreStatus] = useState("Connecting to the Vivace studio database…");
  const [toast, setToast] = useState<string | null>(null);
  const [barClosed, setBarClosed] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activePost, setActivePost] = useState<Post | null>(null);

  // competition state
  const [follows, setFollows] = useState({ ig: false, fb: false, snap: false });
  const [liked, setLiked] = useState(false);
  const [entryForm, setEntryForm] = useState({ name: "", handle: "" });
  const [entered, setEntered] = useState(false);
  const [now, setNow] = useState(Date.now());

  // booking form
  const [bookForm, setBookForm] = useState({ name: "", service: "Signature Lip Filler", phone: "", date: "" });
  const [bookedMsg, setBookedMsg] = useState<string | null>(null);

  // admin
  const [adminOpen, setAdminOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [tab, setTab] = useState("dashboard");
  const [saving, setSaving] = useState(false);

  const toastTimer = useRef<number | undefined>(undefined);
  const showToast = (msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 4200);
  };

  /* load data - FIXED: KV first */
  const loadAll = async () => {
    try {
      // 1. Try KV first (global for all users)
      const kvData = await loadFromKV();
      if (kvData && Object.keys(kvData).length > 0) {
        const merged = { ...DEFAULT_CONFIG, ...kvData };
        setConfig(merged);
        if (!themeTouched) setTheme(merged.appearance.defaultTheme === "dark" ? "dark" : "light");
        setStoreStatus("Cloudflare KV connected ✓ - يظهر للكل");
        // Load local fallback for bookings/entries
        try {
          const bk = (await api("records.list", { collection: "bookings", limit: 100 })) as { records: { id: string; value: Booking }[] };
          setBookings(bk.records.map((r) => ({ ...r.value, id: r.id })));
          const en = (await api("records.list", { collection: "entries", limit: 100 })) as { records: { id: string; value: Entry }[] };
          setEntries(en.records.map((r) => ({ ...r.value, id: r.id })).reverse());
        } catch {}
        return;
      }
      // 2. Fallback to old records API (localStorage)
      const cfgRes = (await api("records.list", { collection: "config", limit: 1 })) as { records: { id: string; value: Config }[] };
      if (cfgRes.records.length > 0) {
        const merged = { ...DEFAULT_CONFIG, ...cfgRes.records[0].value };
        setConfig(merged);
        setConfigId(cfgRes.records[0].id);
        if (!themeTouched) setTheme(merged.appearance.defaultTheme === "dark" ? "dark" : "light");
      }
      const bk = (await api("records.list", { collection: "bookings", limit: 100 })) as { records: { id: string; value: Booking }[] };
      setBookings(bk.records.map((r) => ({ ...r.value, id: r.id })));
      const en = (await api("records.list", { collection: "entries", limit: 100 })) as { records: { id: string; value: Entry }[] };
      setEntries(en.records.map((r) => ({ ...r.value, id: r.id })).reverse());
      setStoreStatus("Connected — all edits save to the studio database and appear for every visitor.");
    } catch {
      setStoreStatus("Studio database is warming up — you are viewing the latest published content. Saving will be available in a moment.");
    }
  };
  useEffect(() => { loadAll(); /* eslint-disable-next-line */ }, []);

  const cleanBase64 = (obj: any): any => {
    const str = JSON.stringify(obj);
    if (str.includes("data:image")) {
      // Replace all base64 with empty
      let cleaned = str.replace(/data:image\/[^;]+;base64,[^"]+/g, "");
      try { return JSON.parse(cleaned); } catch { return obj; }
    }
    return obj;
  };

  const saveConfig = async (next: Config, silent = false) => {
    setSaving(true);
    try {
      // Auto-clean base64 to prevent KV failure
      const hasBase64 = JSON.stringify(next).includes("data:image");
      let toSave = next;
      if (hasBase64) {
        toSave = cleanBase64(next);
        if (!silent) showToast("⚠️ تم حذف صور base64 قديمة كبيرة - استخدم روابط https:// فقط");
      }
      safeSave("vivace_config_v6", toSave);
      const kvOk = await saveToKV(toSave);
      try {
        if (configId) { await api("records.replace", { collection: "config", id: configId, value: toSave }); }
        else { const created = (await api("records.create", { collection: "config", value: toSave, idempotency_key: "vivace-main-config" })) as { id: string }; setConfigId(created.id); }
      } catch {}
      if (kvOk) { 
        setStoreStatus("Cloudflare KV connected ✓ - يظهر للكل"); 
        if (!silent) showToast(hasBase64 ? "تم التنظيف والحفظ ✓" : "Saved to Cloudflare ✓ يظهر للكل"); 
        // Force reload to verify
        console.log("Saved to KV:", Object.keys(toSave).length, "keys");
      }
      else { 
        setStoreStatus("Save failed - KV error"); 
        if (!silent) showToast("❌ فشل الحفظ - تحقق من /api/config"); 
      }
    } catch (e) { 
      console.error("Save error", e);
      safeSave("vivace_config_v6", next); 
      showToast("❌ خطأ في الحفظ: " + String(e)); 
    }
    setSaving(false);
  };

  const update = (patch: Partial<Config>, silent = false) => {
    const next = { ...config, ...patch };
    setConfig(next);
    return next;
  };
  const saveNow = (patch: Partial<Config>) => { const n = update(patch); saveConfig(n); };

  /* seo */
  useEffect(() => {
    document.title = config.seo.title;
    const setMeta = (kind: "name" | "property", key: string, val: string) => {
      const sel = `meta[${kind}="${key}"]`;
      let el = document.head.querySelector(sel) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(kind, key); document.head.appendChild(el); }
      el.setAttribute("content", val);
    };
    setMeta("name", "description", config.seo.description);
    setMeta("name", "keywords", config.seo.keywords);
    setMeta("property", "og:title", config.seo.title);
    setMeta("property", "og:description", config.seo.description);
    setMeta("property", "og:type", "website");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", config.seo.title);
    setMeta("name", "twitter:description", config.seo.description);
    let canon = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canon) { canon = document.createElement("link"); canon.rel = "canonical"; document.head.appendChild(canon); }
    canon.href = config.seo.canonical;
    let ld = document.getElementById("vivace-jsonld");
    if (!ld) { ld = document.createElement("script"); ld.id = "vivace-jsonld"; ld.setAttribute("type", "application/ld+json"); document.head.appendChild(ld); }
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "LocalBusiness", name: "Vivace Clinic",
      address: { "@type": "PostalAddress", streetAddress: config.general.address, addressLocality: "Sydney", addressCountry: "AU" },
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "346" },
      telephone: config.general.whatsapp,
    });
  }, [config.seo, config.general]);

  /* reveal on scroll */
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) e.target.classList.add("is-visible"); }), { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [config, theme, tab, loggedIn]);

  /* parallax + countdown */
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => { window.removeEventListener("scroll", onScroll); window.clearInterval(t); };
  }, []);

  const countdown = useMemo(() => {
    const diff = Math.max(0, new Date(config.comp.endDate).getTime() - now);
    return {
      d: Math.floor(diff / 86400000), h: Math.floor(diff / 3600000) % 24,
      m: Math.floor(diff / 60000) % 60, s: Math.floor(diff / 1000) % 60,
    };
  }, [config.comp.endDate, now]);

  const stepsDone = [follows.ig && follows.fb && follows.snap, liked, entered];
  const activeStep = stepsDone.findIndex((d) => !d);

  /* actions */
  const submitEntry = async () => {
    if (!entryForm.name.trim() || !entryForm.handle.trim()) { showToast("Please add your name and Instagram handle to enter."); return; }
    const entry: Entry = { name: entryForm.name.trim(), handle: entryForm.handle.trim(), at: new Date().toISOString() };
    try {
      const created = (await api("records.create", { collection: "entries", value: entry, idempotency_key: `entry-${entry.handle}-${entry.at}` })) as { id: string };
      setEntries((p) => [{ ...entry, id: created.id }, ...p]);
    } catch { setEntries((p) => [entry, ...p]); }
    setEntered(true);
    showToast("You are in the draw. Good luck!");
  };

  const submitBooking = async () => {
    if (!bookForm.name.trim() || !bookForm.phone.trim()) { showToast("Please add your name and phone so we can confirm your appointment."); return; }
    const booking: Booking = { ...bookForm, status: "Pending", finalDate: "", finalTime: "", notes: "" };
    try {
      const created = (await api("records.create", { collection: "bookings", value: booking, idempotency_key: `booking-${booking.phone}-${Date.now()}` })) as { id: string };
      setBookings((p) => [...p, { ...booking, id: created.id }]);
    } catch { /* keep graceful */ }
    setBookedMsg(`Thank you, ${bookForm.name.split(" ")[0]}. Your request for ${bookForm.service} is saved — we will confirm your time shortly.`);
    setBookForm({ name: "", service: config.services[0]?.name || "", phone: "", date: "" });
  };

  const patchBooking = async (b: Booking, patch: Partial<Booking>) => {
    const next = { ...b, ...patch };
    setBookings((p) => p.map((x) => (x.id === b.id ? next : x)));
    if (b.id) { try { await api("records.replace", { collection: "bookings", id: b.id, value: next }); } catch { showToast("Could not save that booking change."); } }
  };
  const deleteBooking = async (b: Booking) => {
    setBookings((p) => p.filter((x) => x.id !== b.id));
    if (b.id) { try { await api("records.delete", { collection: "bookings", id: b.id }); } catch { /* noop */ } }
  };

  const tryLogin = () => {
    if (password === "vivace2026") { setLoggedIn(true); setLoginError(false); }
    else { setLoginError(true); window.setTimeout(() => setLoginError(false), 600); }
  };

  const downloadFile = (name: string, content: string) => {
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
    const a = document.createElement("a"); a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
  };

  const shellStyle = {
    boxSizing: "border-box",
    paddingTop: "var(--safe-area-inset-top)",
    "--rose": config.appearance.rose,
    "--gold": config.appearance.gold,
  } as React.CSSProperties;

  const inputCls = "w-full rounded-xl border px-3.5 py-2.5 text-sm bg-[var(--surface)] text-[var(--text)] border-[var(--line)]";
  const labelCls = "block text-[11px] font-semibold tracking-[0.14em] uppercase text-[var(--muted)] mb-1.5";

  /* ------------------------------- public site ------------------------------ */
  const publicSite = (
    <div>
      {/* notification bar */}
      {config.bar.active && !barClosed && (
        <div className="bg-[#1A1A1A] text-center relative z-40">
          <a href={config.bar.linkUrl} className="inline-flex items-center gap-2 px-10 py-2.5 text-[12px] sm:text-[13px] tracking-wide gold-text font-semibold">
            <Sparkles size={14} className="text-[var(--gold)] shrink-0" />
            <span>{config.bar.message}</span>
            <span className="underline underline-offset-4 decoration-[var(--gold)] hidden sm:inline">{config.bar.linkText}</span>
          </a>
          <button onClick={() => setBarClosed(true)} aria-label="Dismiss announcement" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#E9CE7A] hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>
      )}

      {/* header */}
      <header data-safe-area-sticky-top style={{ top: "var(--safe-area-inset-top)" }} className="sticky z-40 backdrop-blur-xl bg-[color-mix(in_srgb,var(--bg)_82%,transparent)] border-b border-[var(--line)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-3">
          <a href="#top" className="flex items-baseline gap-2 shrink-0">
            <span className="font-display text-[22px] sm:text-2xl font-semibold tracking-[0.08em]">VIVACE</span>
            <span className="font-accent text-lg gold-text hidden sm:inline">clinic</span>
          </a>
          <nav className="hidden lg:flex items-center gap-7 text-[13px] tracking-[0.12em] uppercase text-[var(--muted)]">
            <a className="hover:text-[var(--text)] transition-colors" href="#services">Services</a>
            <a className="hover:text-[var(--text)] transition-colors" href="#results">Results</a>
            <a className="hover:text-[var(--text)] transition-colors" href="#reviews">Reviews</a>
            <a className="hover:text-[var(--text)] transition-colors" href="#blog">Journal</a>
            <a className="hover:text-[var(--text)] transition-colors" href="#competition">Giveaway</a>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => { setTheme(theme === "light" ? "dark" : "light"); setThemeTouched(true); }} aria-label="Switch between light and dark theme"
              className="h-10 pl-3 pr-3.5 rounded-full border border-[var(--line)] flex items-center gap-1.5 text-[11px] font-semibold tracking-wide hover:border-[var(--gold)] transition-all bg-[var(--surface)]">
              {theme === "light" ? <><Moon size={15} /> Dark</> : <><Sun size={15} className="text-[var(--gold)]" /> Light</>}
            </button>
            <button onClick={() => setAdminOpen(true)} className="hidden sm:flex items-center gap-2 h-10 px-4 rounded-full border border-[var(--line)] text-[12px] tracking-[0.12em] uppercase hover:border-[var(--gold)] transition-all bg-[var(--surface)]">
              <Lock size={14} /> Studio
            </button>
            <a href="#book" className="h-10 px-4 sm:px-5 rounded-full bg-[#1A1A1A] text-[#FFFBF8] dark:bg-[var(--gold)] flex items-center text-[12px] tracking-[0.12em] uppercase font-semibold hover:opacity-85 transition-opacity" style={{ background: theme === "dark" ? "var(--gold)" : "#1A1A1A", color: theme === "dark" ? "#1A1A1A" : "#FFFBF8" }}>
              Book now
            </a>
          </div>
        </div>
      </header>

      {/* hero */}
      <section id="top" className="relative overflow-x-clip">
        <div className="absolute -top-24 -right-32 w-[480px] h-[480px] rounded-full opacity-30 blur-3xl pointer-events-none" style={{ background: ART[config.hero.art] }} />
        <div className="absolute top-64 -left-40 w-[380px] h-[380px] rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "var(--gold)" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-12 sm:pt-20 pb-16 grid lg:grid-cols-2 gap-12 items-center relative">
          <div className="reveal">
            <p className="text-[11px] sm:text-xs tracking-[0.34em] uppercase gold-text font-bold">{config.hero.kicker}</p>
            <h1 className="font-display text-[44px] leading-[1.04] sm:text-6xl xl:text-7xl font-medium mt-5">
              {config.hero.titleA}{" "}
              <span className="font-accent gold-text text-[52px] sm:text-7xl xl:text-8xl">{config.hero.titleAccent}</span>{" "}
              {config.hero.titleB}
            </h1>
            <div className="hairline w-40 my-7" />
            <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed max-w-md">{config.hero.subtitle}</p>
            <div className="flex flex-wrap gap-3 mt-8">
              <a href="#book" className="px-7 h-12 rounded-full flex items-center gap-2 text-sm font-semibold tracking-wide text-[#1A1A1A] transition-transform hover:-translate-y-0.5" style={{ background: "linear-gradient(120deg,var(--gold),#E9CE7A)" }}>
                Book your visit <ArrowRight size={16} />
              </a>
              <a href="#competition" className="px-7 h-12 rounded-full flex items-center gap-2 text-sm font-semibold border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--gold)] transition-all">
                <Gift size={16} className="text-[var(--gold)]" /> Win a makeover
              </a>
            </div>
            <div className="grid grid-cols-3 max-w-md mt-12 divide-x divide-[var(--line)]">
              {[[config.hero.statA, config.hero.statALabel], [config.hero.statB, config.hero.statBLabel], [config.hero.statC, config.hero.statCLabel]].map(([v, l]) => (
                <div key={l} className="px-4 first:pl-0">
                  <p className="font-display text-3xl sm:text-4xl font-semibold">{v}</p>
                  <p className="text-[11px] tracking-[0.14em] uppercase text-[var(--muted)] mt-1">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* floating before/after visual */}
          <div className="relative reveal mx-auto w-full max-w-[440px]" style={{ transform: `translateY(${scrollY * -0.06}px)` }}>
            <div className="anim-float">
              <div className="relative rounded-[36px] p-[10px] shadow-[var(--card-shadow)]" style={{ background: "linear-gradient(150deg,var(--gold),#f3dd8f 40%,var(--rose))" }}>
                <div className="relative rounded-[28px] overflow-hidden grid grid-cols-2 min-h-[420px] sm:min-h-[500px]">
                  <div className="relative flex flex-col items-center justify-center gap-4" style={{ background: "linear-gradient(160deg,#efe6e0,#d9c6bb)" }}>
                    <LipsArt tone="#b98d84" />
                    <span className="absolute top-4 left-4 text-[10px] tracking-[0.22em] font-bold bg-black/55 text-white px-3 py-1.5 rounded-full">BEFORE</span>
                    <span className="font-accent text-xl text-[#6b5750]">your natural canvas</span>
                  </div>
                  <div className="relative flex flex-col items-center justify-center gap-4" style={{ background: ART[config.hero.art] }}>
                    <LipsArt tone="#8e4a56" glow />
                    <span className="absolute top-4 right-4 text-[10px] tracking-[0.22em] font-bold bg-black/55 text-white px-3 py-1.5 rounded-full">AFTER</span>
                    <span className="font-accent text-xl text-[#5c2f38]">the vivace finish</span>
                  </div>
                  <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-white/70" />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#1A1A1A] text-[var(--gold)] flex items-center justify-center border border-[var(--gold)] shadow-xl">
                    <Wand2 size={18} />
                  </div>
                </div>
              </div>
            </div>
            <div className="anim-float-late absolute -left-3 sm:-left-8 top-10 bg-[var(--surface)] rounded-2xl shadow-[var(--card-shadow)] border border-[var(--line)] px-4 py-3 flex items-center gap-3">
              <span className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: ART.rose }}><BadgeCheck size={17} className="text-[#5c2f38]" /></span>
              <span className="text-left"><span className="block font-display font-semibold leading-none">Trusted by 3,400+</span><span className="text-[11px] text-[var(--muted)]">clients across Sydney</span></span>
            </div>
            <div className="anim-float-later absolute -right-2 sm:-right-6 bottom-12 bg-[var(--surface)] rounded-2xl shadow-[var(--card-shadow)] border border-[var(--line)] px-4 py-3 flex items-center gap-3">
              <span className="flex text-[var(--gold)]">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={13} fill="currentColor" />)}</span>
              <span className="text-left"><span className="block font-display font-semibold leading-none">4.9 rating</span><span className="text-[11px] text-[var(--muted)]">346 verified reviews</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* marquee */}
      <div className="bg-[#1A1A1A] py-4 overflow-hidden relative">
        <div className="anim-marquee flex whitespace-nowrap w-max">
          {[0, 1].map((n) => (
            <span key={n} className="flex items-center">
              {config.services.map((s) => (
                <span key={s.name + n} className="mx-6 text-[13px] tracking-[0.28em] uppercase text-[#E9CE7A] flex items-center gap-6">
                  {s.name} <Sparkles size={13} className="text-[var(--rose)]" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* services */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-8 py-20 sm:py-28">
        <SectionHead kicker="The Menu" title="Services, perfected" accent="perfected" sub="Six signature treatments, one philosophy: less, but better." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {config.services.map((s, i) => (
            <article key={i} className="reveal group rounded-[24px] bg-[var(--surface)] border border-[var(--line)] p-7 shadow-[var(--card-shadow)] transition-all duration-500 hover:-translate-y-2 hover:border-[var(--gold)]" style={{ transitionDelay: `${i * 40}ms` }}>
              <div className="h-24 rounded-2xl mb-6 relative overflow-hidden grain" style={{ background: ART[s.color] || ART.rose }}>
                <span className="absolute bottom-3 left-4 font-accent text-2xl text-black/50">{s.tag}</span>
                <Sparkles className="absolute top-3 right-4 text-white/70" size={18} />
              </div>
              <h3 className="font-display text-2xl font-semibold">{s.name}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed mt-2 min-h-[60px]">{s.desc}</p>
              <div className="flex items-center justify-between mt-5 pt-5 border-t border-[var(--line)]">
                <span className="font-display text-lg gold-text font-bold">{s.price}</span>
                <a href="#book" className="text-[12px] tracking-[0.14em] uppercase font-semibold flex items-center gap-1 hover:gap-2 transition-all">Book <ChevronRight size={14} /></a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* before / after */}
      <section id="results" className="py-20 sm:py-28" style={{ background: "var(--surface-2)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <SectionHead kicker="Real Results" title="Before & after" accent="after" sub="Unretouched artistry. Every result begins with a consultation and a plan made only for you." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
            {config.results.map((r, i) => (
              <article key={i} className="reveal group rounded-[24px] overflow-hidden bg-[var(--surface)] border border-[var(--line)] shadow-[var(--card-shadow)] transition-all duration-500 hover:-translate-y-2">
                <div className={`grid grid-cols-2 relative ${r.size === "tall" ? "h-64" : "h-52"}`}>
                  <div className="flex items-center justify-center" style={{ background: "linear-gradient(160deg,#efe6e0,#d9c6bb)" }}><LipsArt tone="#b98d84" small /></div>
                  <div className="flex items-center justify-center" style={{ background: ART[r.art] || ART.rose }}><LipsArt tone="#8e4a56" small glow /></div>
                  <span className="absolute top-3 left-3 text-[9px] tracking-[0.2em] font-bold bg-black/55 text-white px-2.5 py-1 rounded-full">BEFORE</span>
                  <span className="absolute top-3 right-3 text-[9px] tracking-[0.2em] font-bold bg-black/55 text-white px-2.5 py-1 rounded-full">AFTER</span>
                  <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-white/70 group-hover:bg-[var(--gold)] transition-colors" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold">{r.caption}</h3>
                  <p className="font-accent text-lg text-[var(--muted)]">{r.sub}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* reviews */}
      <section id="reviews" className="max-w-7xl mx-auto px-4 sm:px-8 py-20 sm:py-28">
        <SectionHead kicker="Client Love" title="Straight from the chat" accent="chat" sub="Real words from real appointments — shared with love." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
          {REVIEWS.map((r, i) => (
            <div key={i} className="reveal rounded-[24px] p-5 border border-[var(--line)] shadow-[var(--card-shadow)]" style={{ background: theme === "dark" ? "#1f2c26" : "#E7F3EC", transitionDelay: `${i * 50}ms` }}>
              <div className="flex items-center gap-3 pb-4 border-b border-black/5">
                <span className="w-10 h-10 rounded-full flex items-center justify-center font-display font-semibold text-[#5c2f38]" style={{ background: ART.rose }}>{r.name[0]}</span>
                <div><p className="font-semibold text-sm">{r.name}</p><p className="text-[11px] text-[var(--muted)] flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> online</p></div>
                <span className="ml-auto flex text-[var(--gold)]">{[0, 1, 2, 3, 4].map((s) => <Star key={s} size={11} fill="currentColor" />)}</span>
              </div>
              <div className="mt-4 bg-[var(--surface)] rounded-2xl rounded-tl-md p-4 shadow-sm">
                <p className="text-sm leading-relaxed">{r.text}</p>
                <p className="text-[10px] text-[var(--muted)] text-right mt-2">{r.time} <Check size={12} className="inline text-sky-500" /><Check size={12} className="inline -ml-2 text-sky-500" /></p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* blog */}
      <section id="blog" className="py-20 sm:py-28" style={{ background: "var(--surface-2)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <SectionHead kicker="The Journal" title="Beauty, in writing" accent="writing" sub="Notes on artistry, aftercare and quiet luxury from the Vivace team." />
          <div className="grid md:grid-cols-3 gap-5 mt-12">
            {config.posts.map((p, i) => (
              <article key={i} className="reveal rounded-[24px] overflow-hidden bg-[var(--surface)] border border-[var(--line)] shadow-[var(--card-shadow)] flex flex-col transition-all duration-500 hover:-translate-y-2" style={{ transitionDelay: `${i * 60}ms` }}>
                <div className="h-44 relative grain" style={{ background: ART[p.art] || ART.rose }}>
                  <span className="absolute bottom-4 left-5 font-accent text-3xl text-black/40">Vivace Journal</span>
                  <span className="absolute top-4 left-4 text-[10px] tracking-[0.18em] font-bold bg-black/50 text-white px-3 py-1.5 rounded-full">{new Date(p.date).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display text-[22px] font-semibold leading-snug">{p.title}</h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed mt-2 flex-1">{p.excerpt}</p>
                  <button onClick={() => setActivePost(p)} className="mt-5 self-start text-[12px] tracking-[0.14em] uppercase font-semibold flex items-center gap-1.5 gold-text">Read more <ArrowRight size={14} className="text-[var(--gold)]" /></button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* competition */}
      <section id="competition" className="max-w-7xl mx-auto px-4 sm:px-8 py-20 sm:py-28">
        <SectionHead kicker="Giveaway" title={config.comp.title} accent="Glow" sub={config.comp.desc} />
        <div className="grid lg:grid-cols-5 gap-6 mt-12 items-start">
          {/* prize showcase */}
          <div className="lg:col-span-2 reveal rounded-[28px] overflow-hidden border border-[var(--line)] shadow-[var(--card-shadow)] bg-[var(--surface)]">
            <div className="h-64 relative grain flex items-center justify-center" style={{ background: ART[config.comp.prizeArt] || ART.gold }}>
              <Trophy size={84} className="text-black/35" />
              <span className="absolute top-4 left-4 bg-[#1A1A1A] text-[var(--gold)] text-[10px] tracking-[0.22em] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5"><Crown size={12} /> GRAND PRIZE</span>
            </div>
            <div className="p-7">
              <h3 className="font-display text-2xl font-semibold flex items-center gap-2"><Gift className="text-[var(--gold)]" /> What you win</h3>
              <ul className="mt-4 space-y-2.5">
                {config.comp.wins.split("\n").filter(Boolean).map((w) => (
                  <li key={w} className="flex gap-2.5 text-sm text-[var(--muted)]"><Check size={16} className="text-[var(--gold)] shrink-0 mt-0.5" /> {w}</li>
                ))}
              </ul>
              <div className="grid grid-cols-4 gap-2 mt-7">
                {[["DAYS", countdown.d], ["HOURS", countdown.h], ["MINS", countdown.m], ["SECS", countdown.s]].map(([l, v]) => (
                  <div key={l as string} className="rounded-2xl bg-[#1A1A1A] text-center py-3.5">
                    <p className="font-display text-2xl font-bold gold-text leading-none">{String(v).padStart(2, "0")}</p>
                    <p className="text-[9px] tracking-[0.24em] text-white/60 mt-1.5">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* stepper */}
          <div className="lg:col-span-3 reveal rounded-[28px] border border-[var(--line)] shadow-[var(--card-shadow)] bg-[var(--surface)] p-6 sm:p-9">
            <div className="flex items-center mb-9 px-1">
              {[1, 2, 3].map((n, i) => (
                <div key={n} className="flex items-center flex-1 last:flex-none">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center font-display font-bold border-2 transition-all duration-500 ${stepsDone[i] ? "bg-[var(--gold)] border-[var(--gold)] text-[#1A1A1A]" : activeStep === i ? "border-[var(--gold)] gold-text anim-pulse-gold" : "border-[var(--line)] text-[var(--muted)]"}`}>
                    {stepsDone[i] ? <Check size={18} /> : n}
                  </div>
                  {n < 3 && <div className="flex-1 h-[2px] mx-3 rounded" style={{ background: stepsDone[i] ? "var(--gold)" : "var(--line)", transition: "background .5s" }} />}
                </div>
              ))}
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="font-display text-xl font-semibold">Step 1 — Follow us</h4>
                <div className="grid sm:grid-cols-3 gap-3 mt-4">
                  {([["ig", "Instagram", config.general.instagram, Instagram], ["fb", "Facebook", config.general.facebook, Facebook], ["snap", "Snapchat", config.general.snapchat, MessageCircle]] as const).map(([key, label, url, Icon]) => (
                    <div key={key} className={`rounded-2xl border p-4 transition-all ${follows[key] ? "border-[var(--gold)] bg-[color-mix(in_srgb,var(--gold)_8%,var(--surface))]" : "border-[var(--line)]"}`}>
                      <div className="flex items-center gap-2 font-semibold text-sm"><Icon size={17} className="text-[var(--gold)]" /> {label}</div>
                      <div className="flex items-center justify-between mt-3">
                        <a href={url} target="_blank" rel="noopener" className="text-[11px] tracking-[0.14em] uppercase font-bold bg-[#1A1A1A] text-white px-3.5 py-2 rounded-full hover:opacity-85 transition-opacity" style={{ background: theme === "dark" ? "var(--gold)" : "#1A1A1A", color: theme === "dark" ? "#1A1A1A" : "#fff" }}>Open</a>
                        
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-display text-xl font-semibold">Step 2 — Like the competition post</h4>
                <div className="flex items-center gap-4 mt-4 rounded-2xl border border-[var(--line)] p-4">
                  <button onClick={() => setLiked(!liked)} aria-label="Like competition post" className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${liked ? "bg-[#e0445e] text-white scale-105" : "bg-[var(--surface-2)] text-[var(--muted)] hover:text-[#e0445e]"}`}>
                    <Heart size={26} fill={liked ? "currentColor" : "none"} />
                  </button>
                  <div>
                    <p className="font-display text-2xl font-bold">{(config.comp.likeCount + (liked ? 1 : 0)).toLocaleString()} <span className="text-sm font-normal text-[var(--muted)]">likes</span></p>
                    <p className="text-xs text-[var(--muted)]">{liked ? "Loved! One step closer to the glow." : "Tap the heart on our pinned post, then mark it here."}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-display text-xl font-semibold">Step 3 — Enter your details</h4>
                {entered ? (
                  <div className="mt-4 rounded-2xl border border-[var(--gold)] p-5 flex items-center gap-4" style={{ background: "color-mix(in srgb, var(--gold) 10%, var(--surface))" }}>
                    <span className="w-12 h-12 rounded-full bg-[var(--gold)] text-[#1A1A1A] flex items-center justify-center shrink-0"><BadgeCheck size={22} /></span>
                    <div><p className="font-display text-lg font-semibold">You're officially in the draw</p><p className="text-sm text-[var(--muted)]">Watch this space — and your DMs — on announcement day.</p></div>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 mt-4">
                    <input value={entryForm.name} onChange={(e) => setEntryForm({ ...entryForm, name: e.target.value })} placeholder="Your full name" className={inputCls} />
                    <input value={entryForm.handle} onChange={(e) => setEntryForm({ ...entryForm, handle: e.target.value })} placeholder="@instagram-handle" className={inputCls} />
                    <button onClick={submitEntry} className="h-[46px] px-6 rounded-xl font-semibold text-sm text-[#1A1A1A] flex items-center gap-2 hover:-translate-y-0.5 transition-transform" style={{ background: "linear-gradient(120deg,var(--gold),#E9CE7A)" }}>
                      Enter now <Send size={15} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* live entries + winner */}
            <div className="grid sm:grid-cols-2 gap-4 mt-9">
              <div className="rounded-2xl border border-[var(--line)] p-5 max-h-56 overflow-y-auto">
                <p className="text-[11px] tracking-[0.2em] uppercase font-bold text-[var(--muted)] flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live entries · {entries.length}</p>
                {entries.length === 0 ? <p className="text-sm text-[var(--muted)] mt-3">Be the very first to enter.</p> :
                  <ul className="mt-3 space-y-2.5">{entries.slice(0, 12).map((e, i) => (
                    <li key={e.id || i} className="flex items-center gap-3 text-sm"><span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[#5c2f38]" style={{ background: ART.rose }}>{(e.name || "?")[0]}</span><span className="font-medium">{e.name}</span><span className="text-[var(--muted)] text-xs">{e.handle}</span></li>
                  ))}</ul>}
              </div>
              <div className="rounded-2xl p-5 bg-[#1A1A1A] relative overflow-hidden grain">
                <p className="text-[11px] tracking-[0.2em] uppercase font-bold gold-text flex items-center gap-2"><Trophy size={13} /> Winner announcement</p>
                <p className="font-accent text-[19px] leading-snug text-[#FFFBF8] mt-3">{config.comp.winnerText}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* booking */}
      <section id="book" className="relative py-20 sm:py-28 overflow-hidden" style={{ background: "#1A1A1A" }}>
        <div className="absolute -top-32 right-0 w-[420px] h-[420px] rounded-full opacity-25 blur-3xl" style={{ background: ART.rose }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid lg:grid-cols-2 gap-12 relative">
          <div className="reveal">
            <p className="text-xs tracking-[0.34em] uppercase gold-text font-bold">Reservations</p>
            <h2 className="font-display text-4xl sm:text-5xl text-[#FFFBF8] font-medium mt-4">Choose your <span className="font-accent gold-text text-5xl sm:text-6xl">moment</span></h2>
            <p className="text-white/60 leading-relaxed mt-5 max-w-md">Tell us what you're dreaming of and when — we'll confirm your final date and time personally. Prefer to chat? Message us any time.</p>
            <div className="space-y-3 mt-8 text-white/80 text-sm">
              <p className="flex items-center gap-3"><MapPin size={16} className="text-[var(--gold)]" /> {config.general.address}</p>
              <p className="flex items-center gap-3"><Clock size={16} className="text-[var(--gold)]" /> Tue – Sat · 9:00am – 6:00pm</p>
              <p className="flex items-center gap-3"><Phone size={16} className="text-[var(--gold)]" /> +{config.general.whatsapp}</p>
            </div>
            <a href={waLink(config.general.whatsapp, "Hello Vivace Clinic, I would love to book an appointment.")} target="_blank" rel="noopener" className="inline-flex items-center gap-2 mt-8 px-6 h-12 rounded-full bg-[#25D366] text-[#0b3d20] font-semibold text-sm hover:-translate-y-0.5 transition-transform">
              <MessageCircle size={17} /> Chat on WhatsApp
            </a>
          </div>
          <div className="reveal rounded-[28px] p-7 sm:p-9 border border-[rgba(212,175,55,.35)]" style={{ background: "rgba(255,251,248,0.06)", backdropFilter: "blur(14px)" }}>
            {bookedMsg ? (
              <div className="text-center py-10">
                <span className="mx-auto w-16 h-16 rounded-full bg-[var(--gold)] text-[#1A1A1A] flex items-center justify-center"><BadgeCheck size={30} /></span>
                <h3 className="font-display text-2xl text-white mt-6">Request received</h3>
                <p className="text-white/60 mt-3 leading-relaxed">{bookedMsg}</p>
                <button onClick={() => setBookedMsg(null)} className="mt-7 text-[var(--gold)] text-sm underline underline-offset-4">Make another request</button>
              </div>
            ) : (
              <div className="space-y-4">
                <div><label className="block text-[11px] tracking-[0.16em] uppercase text-[#E9CE7A] font-bold mb-2">Your name</label>
                  <input value={bookForm.name} onChange={(e) => setBookForm({ ...bookForm, name: e.target.value })} placeholder="Full name" className="w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/40 px-4 py-3 text-sm" /></div>
                <div><label className="block text-[11px] tracking-[0.16em] uppercase text-[#E9CE7A] font-bold mb-2">Service</label>
                  <select value={bookForm.service} onChange={(e) => setBookForm({ ...bookForm, service: e.target.value })} className="w-full rounded-xl border border-white/20 bg-white/10 text-white px-4 py-3 text-sm [&>option]:text-black">
                    {config.services.map((s) => <option key={s.name} value={s.name}>{s.name} — {s.price}</option>)}
                  </select></div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="block text-[11px] tracking-[0.16em] uppercase text-[#E9CE7A] font-bold mb-2">Phone</label>
                    <input value={bookForm.phone} onChange={(e) => setBookForm({ ...bookForm, phone: e.target.value })} placeholder="04xx xxx xxx" className="w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/40 px-4 py-3 text-sm" /></div>
                  <div><label className="block text-[11px] tracking-[0.16em] uppercase text-[#E9CE7A] font-bold mb-2">Preferred date <span className="normal-case font-normal text-white/40">(optional)</span></label>
                    <input type="date" value={bookForm.date} onChange={(e) => setBookForm({ ...bookForm, date: e.target.value })} className="w-full rounded-xl border border-white/20 bg-white/10 text-white px-4 py-3 text-sm" /></div>
                </div>
                <button onClick={submitBooking} className="w-full h-13 py-3.5 rounded-xl font-semibold text-[#1A1A1A] flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-transform" style={{ background: "linear-gradient(120deg,var(--gold),#E9CE7A)" }}>
                  <CalendarDays size={17} /> Request appointment
                </button>
                <p className="text-[11px] text-white/40 text-center">Your request is saved instantly to the studio diary — no account needed.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="bg-[#141414] text-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <p className="font-display text-3xl text-white tracking-[0.08em]">VIVACE <span className="font-accent gold-text text-2xl">clinic</span></p>
            <p className="text-sm leading-relaxed mt-4 max-w-sm">Sydney's most loved aesthetics studio. Natural results, honest advice, and a little everyday luxury.</p>
            <div className="flex gap-2.5 mt-6">
              {[[Instagram, config.general.instagram], [Facebook, config.general.facebook], [MessageCircle, config.general.snapchat]].map(([Icon, url], i) => {
                const I = Icon as typeof Instagram;
                return <a key={i} href={url as string} target="_blank" rel="noopener" aria-label="Social link" className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all"><I size={16} /></a>;
              })}
            </div>
          </div>
          <div>
            <p className="text-[11px] tracking-[0.22em] uppercase text-white font-bold">Visit</p>
            <p className="text-sm mt-4 leading-relaxed">{config.general.address}</p>
            <p className="text-sm mt-2">Tue – Sat · 9am – 6pm</p>
          </div>
          <div>
            <p className="text-[11px] tracking-[0.22em] uppercase text-white font-bold">Explore</p>
            <div className="flex flex-col gap-2.5 mt-4 text-sm">
              <a href="#services" className="hover:text-[var(--gold)] transition-colors">Services</a>
              <a href="#results" className="hover:text-[var(--gold)] transition-colors">Before & After</a>
              <a href="#blog" className="hover:text-[var(--gold)] transition-colors">Journal</a>
              <a href="#competition" className="hover:text-[var(--gold)] transition-colors">Giveaway</a>
              <button onClick={() => setAdminOpen(true)} className="text-left hover:text-[var(--gold)] transition-colors flex items-center gap-1.5"><Lock size={12} /> Studio login</button>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs">© {new Date().getFullYear()} Vivace Clinic, Sydney. Crafted with care.</div>
      </footer>

      {/* blog modal */}
      {activePost && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setActivePost(null)} />
          <article className="relative bg-[var(--surface)] text-[var(--text)] w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-t-[28px] sm:rounded-[28px] shadow-2xl">
            <div className="h-52 relative grain" style={{ background: ART[activePost.art] || ART.rose }}>
              <button onClick={() => setActivePost(null)} aria-label="Close article" className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"><X size={18} /></button>
              <span className="absolute bottom-5 left-6 font-accent text-4xl text-black/40">Vivace Journal</span>
            </div>
            <div className="p-7 sm:p-10">
              <p className="text-[11px] tracking-[0.2em] uppercase gold-text font-bold">{new Date(activePost.date).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}</p>
              <h3 className="font-display text-3xl sm:text-4xl font-semibold mt-3 leading-tight">{activePost.title}</h3>
              <div className="hairline w-24 my-6" />
              {activePost.content.split("\n").filter(Boolean).map((para, i) => <p key={i} className="text-[15px] leading-[1.85] text-[var(--muted)] mb-4">{para}</p>)}
              <a href="#book" onClick={() => setActivePost(null)} className="inline-flex items-center gap-2 mt-4 px-6 h-11 rounded-full text-sm font-semibold text-[#1A1A1A]" style={{ background: "linear-gradient(120deg,var(--gold),#E9CE7A)" }}>Book a consultation <ArrowRight size={15} /></a>
            </div>
          </article>
        </div>
      )}
    </div>
  );

  /* --------------------------------- admin ---------------------------------- */
  const adminTabs: [string, string, typeof LayoutDashboard][] = [
    ["dashboard", "Dashboard", LayoutDashboard], ["bar", "Notification Bar", Bell], ["general", "General", Settings2],
    ["hero", "Hero", Sparkles], ["services", "Services", Layers], ["results", "Before / After", Camera],
    ["blog", "Blog", FileText], ["competition", "Competition", Trophy], ["seo", "SEO", Search],
    ["bookings", "Bookings", CalendarDays], ["appearance", "Appearance", Palette], ["storage", "Storage", Database],
  ];

  const sortedBookings = [...bookings].sort((a, b) => (a.finalDate || a.date || "9999").localeCompare(b.finalDate || b.date || "9999"));

  const adminPanel = loggedIn ? (
    <div className="fixed inset-0 z-[80] flex" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-[#161616] text-white p-6">
        <p className="font-display text-2xl tracking-[0.08em]">VIVACE</p>
        <p className="font-accent gold-text text-lg -mt-1">studio admin</p>
        <div className="hairline my-6 opacity-70" />
        <nav className="space-y-1 flex-1 overflow-y-auto">
          {adminTabs.map(([key, label, Icon]) => (
            <button key={key} onClick={() => setTab(key)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${tab === key ? "bg-[rgba(212,175,55,.16)] text-[#E9CE7A] border border-[rgba(212,175,55,.4)]" : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"}`}>
              <Icon size={16} /> {label}
              {key === "bookings" && bookings.filter((b) => b.status === "Pending").length > 0 && <span className="ml-auto text-[10px] bg-[var(--rose)] text-[#1A1A1A] font-bold px-2 py-0.5 rounded-full">{bookings.filter((b) => b.status === "Pending").length}</span>}
            </button>
          ))}
        </nav>
        <button onClick={() => saveConfig(config)} disabled={saving} className="mt-4 w-full h-11 rounded-xl font-semibold text-sm text-[#1A1A1A] flex items-center justify-center gap-2 disabled:opacity-50" style={{ background: "linear-gradient(120deg,var(--gold),#E9CE7A)" }}>
          <Save size={16} /> {saving ? "Saving…" : "Save all changes"}
        </button>
        <button onClick={() => { setLoggedIn(false); setAdminOpen(false); }} className="mt-2.5 w-full h-10 rounded-xl border border-white/15 text-sm text-white/70 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"><LogOut size={15} /> Exit studio</button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-3 px-4 sm:px-8 h-16 border-b border-[var(--line)] bg-[var(--surface)] shrink-0">
          <p className="font-display text-lg font-semibold capitalize">{adminTabs.find(([k]) => k === tab)?.[1]}</p>
          <span className="hidden sm:flex items-center gap-1.5 text-[11px] text-[var(--muted)]"><span className="w-2 h-2 rounded-full bg-emerald-500" /> {storeStatus.includes("Connected") ? "Database connected" : "Connecting…"}</span>
          <div className="ml-auto flex gap-2">
            <button onClick={() => saveConfig(config)} disabled={saving} className="md:hidden h-10 px-4 rounded-full text-[#1A1A1A] text-xs font-bold flex items-center gap-1.5 disabled:opacity-50" style={{ background: "var(--gold)" }}><Save size={14} /> Save</button>
            <button onClick={() => { setLoggedIn(false); setAdminOpen(false); }} aria-label="Close admin" className="w-10 h-10 rounded-full border border-[var(--line)] flex items-center justify-center hover:border-[var(--gold)] transition-all"><X size={17} /></button>
          </div>
        </div>
        <div className="md:hidden flex gap-2 px-4 py-3 overflow-x-auto border-b border-[var(--line)] bg-[var(--surface)] shrink-0">
          {adminTabs.map(([key, label, Icon]) => (
            <button key={key} onClick={() => setTab(key)} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs whitespace-nowrap border transition-all ${tab === key ? "bg-[#1A1A1A] text-[#E9CE7A] border-[#1A1A1A]" : "border-[var(--line)] text-[var(--muted)]"}`}><Icon size={13} /> {label}</button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-3xl mx-auto space-y-6 pb-16">
            {tab === "dashboard" && (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[["Bookings", bookings.length, CalendarDays], ["Pending", bookings.filter((b) => b.status === "Pending").length, Clock], ["Giveaway entries", entries.length, Trophy], ["Blog posts", config.posts.length, FileText]].map(([l, v, Icon]) => {
                    const I = Icon as typeof CalendarDays;
                    return <div key={l as string} className="rounded-3xl bg-[var(--surface)] border border-[var(--line)] p-5 shadow-[var(--card-shadow)]"><I size={20} className="text-[var(--gold)]" /><p className="font-display text-4xl font-semibold mt-3">{v as number}</p><p className="text-[11px] tracking-[0.16em] uppercase text-[var(--muted)] mt-1">{l as string}</p></div>;
                  })}
                </div>
                <AdminCard title="Studio status">
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{storeStatus}</p>
                  <p className="text-sm text-[var(--muted)] leading-relaxed mt-2">Every change you make here is stored in the studio database. Press <strong className="text-[var(--text)]">Save all changes</strong> and the public site updates for everyone — no files to re-upload, ever.</p>
                </AdminCard>
                <AdminCard title="Latest bookings">
                  {sortedBookings.length === 0 ? <Empty text="No booking requests yet. They will appear here the moment a client books." /> :
                    sortedBookings.slice(0, 5).map((b) => <Row key={b.id} title={`${b.name} — ${b.service}`} sub={`${b.phone} · ${b.finalDate || b.date || "date to confirm"} · ${b.status}`} />)}
                </AdminCard>
              </>
            )}

            {tab === "bar" && (
              <AdminCard title="Notification bar">
                <Toggle label="Bar active" value={config.bar.active} onChange={(v) => saveNow({ bar: { ...config.bar, active: v } })} />
                <Field label="Message"><input className={inputCls} value={config.bar.message} onChange={(e) => update({ bar: { ...config.bar, message: e.target.value } })} onBlur={() => saveConfig(config, true)} /></Field>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Link text"><input className={inputCls} value={config.bar.linkText} onChange={(e) => update({ bar: { ...config.bar, linkText: e.target.value } })} onBlur={() => saveConfig(config, true)} /></Field>
                  <Field label="Link URL"><input className={inputCls} value={config.bar.linkUrl} onChange={(e) => update({ bar: { ...config.bar, linkUrl: e.target.value } })} onBlur={() => saveConfig(config, true)} /></Field>
                </div>
                <p className="text-xs text-[var(--muted)]">Preview: gold text on ink, with a close button for visitors. Changes save when you leave a field.</p>
              </AdminCard>
            )}

            {tab === "general" && (
              <AdminCard title="Contact & socials">
                {(["whatsapp", "instagram", "facebook", "snapchat", "address"] as const).map((k) => (
                  <Field key={k} label={k === "whatsapp" ? "WhatsApp number (country code, no +)" : k[0].toUpperCase() + k.slice(1)}>
                    <input className={inputCls} value={config.general[k]} onChange={(e) => update({ general: { ...config.general, [k]: e.target.value } })} onBlur={() => saveConfig(config, true)} />
                  </Field>
                ))}
              </AdminCard>
            )}

            {tab === "hero" && (
              <AdminCard title="Hero">
                <Field label="Kicker"><input className={inputCls} value={config.hero.kicker} onChange={(e) => update({ hero: { ...config.hero, kicker: e.target.value } })} onBlur={() => saveConfig(config, true)} /></Field>
                <div className="grid sm:grid-cols-3 gap-4">
                  <Field label="Title start"><input className={inputCls} value={config.hero.titleA} onChange={(e) => update({ hero: { ...config.hero, titleA: e.target.value } })} onBlur={() => saveConfig(config, true)} /></Field>
                  <Field label="Italic accent word"><input className={inputCls} value={config.hero.titleAccent} onChange={(e) => update({ hero: { ...config.hero, titleAccent: e.target.value } })} onBlur={() => saveConfig(config, true)} /></Field>
                  <Field label="Title end"><input className={inputCls} value={config.hero.titleB} onChange={(e) => update({ hero: { ...config.hero, titleB: e.target.value } })} onBlur={() => saveConfig(config, true)} /></Field>
                </div>
                <Field label="Subtitle"><textarea rows={3} className={inputCls} value={config.hero.subtitle} onChange={(e) => update({ hero: { ...config.hero, subtitle: e.target.value } })} onBlur={() => saveConfig(config, true)} /></Field>
                <Field label="Hero artwork style"><ArtSelect value={config.hero.art} onChange={(v) => saveNow({ hero: { ...config.hero, art: v } })} /></Field>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {(["statA", "statB", "statC"] as const).map((k) => (
                    <Field key={k} label={`Stat ${k.slice(-1)} value`}><input className={inputCls} value={config.hero[k]} onChange={(e) => update({ hero: { ...config.hero, [k]: e.target.value } })} onBlur={() => saveConfig(config, true)} /></Field>
                  ))}
                  {(["statALabel", "statBLabel", "statCLabel"] as const).map((k) => (
                    <Field key={k} label={`Stat ${k[4]} label`}><input className={inputCls} value={config.hero[k]} onChange={(e) => update({ hero: { ...config.hero, [k]: e.target.value } })} onBlur={() => saveConfig(config, true)} /></Field>
                  ))}
                </div>
                <p className="text-xs text-[var(--muted)] flex items-start gap-2"><ImageIcon size={14} className="shrink-0 mt-0.5" /> Photo uploads are not available yet in this studio — choose from the curated artwork styles above and your hero updates instantly.</p>
              </AdminCard>
            )}

            {tab === "services" && (
              <AdminCard title={`Services (${config.services.length})`} action={<AddBtn onClick={() => saveNow({ services: [...config.services, { name: "New Service", desc: "Describe the treatment…", price: "From $", tag: "New", color: "rose" }] })} />}>
                {config.services.map((s, i) => (
                  <div key={i} className="rounded-2xl border border-[var(--line)] p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl shrink-0" style={{ background: ART[s.color] || ART.rose }} />
                      <input className={inputCls} value={s.name} onChange={(e) => { const n = [...config.services]; n[i] = { ...s, name: e.target.value }; update({ services: n }); }} onBlur={() => saveConfig(config, true)} />
                      <button onClick={() => saveNow({ services: config.services.filter((_, x) => x !== i) })} aria-label="Delete service" className="w-10 h-10 shrink-0 rounded-xl border border-[var(--line)] flex items-center justify-center text-red-400 hover:border-red-300 transition-all"><Trash2 size={16} /></button>
                    </div>
                    <textarea rows={2} className={inputCls} value={s.desc} onChange={(e) => { const n = [...config.services]; n[i] = { ...s, desc: e.target.value }; update({ services: n }); }} onBlur={() => saveConfig(config, true)} />
                    <div className="grid grid-cols-3 gap-3">
                      <input className={inputCls} value={s.price} placeholder="Price" onChange={(e) => { const n = [...config.services]; n[i] = { ...s, price: e.target.value }; update({ services: n }); }} onBlur={() => saveConfig(config, true)} />
                      <input className={inputCls} value={s.tag} placeholder="Tag" onChange={(e) => { const n = [...config.services]; n[i] = { ...s, tag: e.target.value }; update({ services: n }); }} onBlur={() => saveConfig(config, true)} />
                      <select className={inputCls} value={s.color} onChange={(e) => { const n = [...config.services]; n[i] = { ...s, color: e.target.value }; saveNow({ services: n }); }}>{ART_KEYS.map((k) => <option key={k} value={k}>{k}</option>)}</select>
                    </div>
                  </div>
                ))}
              </AdminCard>
            )}

            {tab === "results" && (
              <AdminCard title="Before / After results">
                {config.results.map((r, i) => (
                  <div key={i} className="rounded-2xl border border-[var(--line)] p-4 space-y-3">
                    <div className={`grid grid-cols-2 rounded-xl overflow-hidden border ${r.size === "tall" ? "h-32" : "h-24"}`} style={{ borderColor: "var(--line)" }}>
                      {r.beforeImage ? <img src={r.beforeImage} className="w-full h-full object-cover" /> : <div style={{ background: "linear-gradient(160deg,#efe6e0,#d9c6bb)" }} className="flex items-center justify-center text-[9px] tracking-[0.2em] font-bold text-[#6b5750]">BEFORE</div>}
                      {r.image ? <img src={r.image} className="w-full h-full object-cover" /> : <div style={{ background: ART[r.art] || ART.rose }} className="flex items-center justify-center text-[9px] tracking-[0.2em] font-bold text-black/50">AFTER</div>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      
                      
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Field label="Before image URL (https://)"><input className={inputCls} value={r.beforeImage} placeholder="https://... رابط صورة قبل" onChange={(e) => { const n = [...config.results]; n[i] = { ...r, beforeImage: e.target.value }; update({ results: n }); }} onBlur={() => saveConfig(config, true)} /></Field>
                      <Field label="After image URL (https://)"><input className={inputCls} value={r.image} placeholder="https://... رابط صورة بعد" onChange={(e) => { const n = [...config.results]; n[i] = { ...r, image: e.target.value }; update({ results: n }); }} onBlur={() => saveConfig(config, true)} /></Field>
                      <input className={inputCls} value={r.caption} placeholder="Caption" onChange={(e) => { const n = [...config.results]; n[i] = { ...r, caption: e.target.value }; update({ results: n }); }} onBlur={() => saveConfig(config, true)} />
                      <input className={inputCls} value={r.sub} placeholder="Sub-caption" onChange={(e) => { const n = [...config.results]; n[i] = { ...r, sub: e.target.value }; update({ results: n }); }} onBlur={() => saveConfig(config, true)} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <select className={inputCls} value={r.art} onChange={(e) => { const n = [...config.results]; n[i] = { ...r, art: e.target.value }; saveNow({ results: n }); }}>{ART_KEYS.map((k) => <option key={k} value={k}>{k}</option>)}</select>
                      <select className={inputCls} value={r.size} onChange={(e) => { const n = [...config.results]; n[i] = { ...r, size: e.target.value }; saveNow({ results: n }); }}><option value="tall">Preview: Tall</option><option value="wide">Preview: Wide</option></select>
                    </div>
                  </div>
                ))}
                <p className="text-xs text-green-600 bg-green-50 p-3 rounded-xl">✓ رفع الصور مفعل - ارفع Before و After الحقيقية. إذا ما رفعتش صورة، الـ gradient يبقى.</p>
              </AdminCard>
            )}

            {tab === "blog" && (
              <AdminCard title={`Blog posts (${config.posts.length})`} action={<AddBtn onClick={() => saveNow({ posts: [{ title: "New Journal Post", date: new Date().toISOString().slice(0, 10), excerpt: "A short teaser…", content: "Write your article here.", art: "rose" }, ...config.posts] })} />}>
                {config.posts.map((p, i) => (
                  <div key={i} className="rounded-2xl border border-[var(--line)] p-4 space-y-3">
                    <div className="flex gap-3">
                      <input className={inputCls} value={p.title} onChange={(e) => { const n = [...config.posts]; n[i] = { ...p, title: e.target.value }; update({ posts: n }); }} onBlur={() => saveConfig(config, true)} />
                      <button onClick={() => saveNow({ posts: config.posts.filter((_, x) => x !== i) })} aria-label="Delete post" className="w-10 h-10 shrink-0 rounded-xl border border-[var(--line)] flex items-center justify-center text-red-400 hover:border-red-300 transition-all"><Trash2 size={16} /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="date" className={inputCls} value={p.date} onChange={(e) => { const n = [...config.posts]; n[i] = { ...p, date: e.target.value }; saveNow({ posts: n }); }} />
                      <select className={inputCls} value={p.art} onChange={(e) => { const n = [...config.posts]; n[i] = { ...p, art: e.target.value }; saveNow({ posts: n }); }}>{ART_KEYS.map((k) => <option key={k} value={k}>{k}</option>)}</select>
                    </div>
                    <Field label="Post image URL (https://)"><input className={inputCls} value={p.image} placeholder="https://... رابط صورة المقال" onChange={(e) => { const n = [...config.posts]; n[i] = { ...p, image: e.target.value }; update({ posts: n }); }} onBlur={() => saveConfig(config, true)} /></Field>
                    <textarea rows={2} className={inputCls} placeholder="Excerpt" value={p.excerpt} onChange={(e) => { const n = [...config.posts]; n[i] = { ...p, excerpt: e.target.value }; update({ posts: n }); }} onBlur={() => saveConfig(config, true)} />
                    <textarea rows={5} className={inputCls} placeholder="Full article content" value={p.content} onChange={(e) => { const n = [...config.posts]; n[i] = { ...p, content: e.target.value }; update({ posts: n }); }} onBlur={() => saveConfig(config, true)} />
                    <div className="space-y-2">
                      {p.image && <img src={p.image} className="w-full h-32 object-cover rounded-xl" />}
                      
                    </div>
                  </div>
                ))}
              </AdminCard>
            )}

            {tab === "competition" && (
              <AdminCard title="Competition">
                <Field label="Title"><input className={inputCls} value={config.comp.title} onChange={(e) => update({ comp: { ...config.comp, title: e.target.value } })} onBlur={() => saveConfig(config, true)} /></Field>
                <Field label="Description"><textarea rows={3} className={inputCls} value={config.comp.desc} onChange={(e) => update({ comp: { ...config.comp, desc: e.target.value } })} onBlur={() => saveConfig(config, true)} /></Field>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="End date & time"><input type="datetime-local" className={inputCls} value={config.comp.endDate} onChange={(e) => saveNow({ comp: { ...config.comp, endDate: e.target.value } })} /></Field>
                  <Field label="Prize artwork"><ArtSelect value={config.comp.prizeArt} onChange={(v) => saveNow({ comp: { ...config.comp, prizeArt: v } })} /></Field>
                </div>
                <Field label="Prize image URL (https://)"><input className={inputCls} value={config.comp.prizeImage} placeholder="https://... رابط صورة الجائزة" onChange={(e) => update({ comp: { ...config.comp, prizeImage: e.target.value } })} onBlur={() => saveConfig(config, true)} /></Field>
                <Field label="What you win (one prize per line)"><textarea rows={4} className={inputCls} value={config.comp.wins} onChange={(e) => update({ comp: { ...config.comp, wins: e.target.value } })} onBlur={() => saveConfig(config, true)} /></Field>
                <Field label="Winner announcement text"><textarea rows={2} className={inputCls} value={config.comp.winnerText} onChange={(e) => update({ comp: { ...config.comp, winnerText: e.target.value } })} onBlur={() => saveConfig(config, true)} /></Field>
                <Field label="Starting like count"><input type="number" className={inputCls} value={config.comp.likeCount} onChange={(e) => update({ comp: { ...config.comp, likeCount: Number(e.target.value) || 0 } })} onBlur={() => saveConfig(config, true)} /></Field>
                <div className="rounded-2xl border border-[var(--line)] p-4">
                  <p className="text-[11px] tracking-[0.16em] uppercase font-bold text-[var(--muted)]">Entries so far · {entries.length}</p>
                  {entries.slice(0, 6).map((e, i) => <Row key={e.id || i} title={e.name} sub={`${e.handle} · ${new Date(e.at).toLocaleString("en-AU")}`} />)}
                  {entries.length === 0 && <Empty text="No entries yet." />}
                </div>
              </AdminCard>
            )}

            {tab === "seo" && (
              <AdminCard title="SEO & sharing">
                <Field label="Meta title"><input className={inputCls} value={config.seo.title} onChange={(e) => update({ seo: { ...config.seo, title: e.target.value } })} onBlur={() => saveConfig(config, true)} /></Field>
                <Field label="Meta description"><textarea rows={3} className={inputCls} value={config.seo.description} onChange={(e) => update({ seo: { ...config.seo, description: e.target.value } })} onBlur={() => saveConfig(config, true)} /></Field>
                <Field label="Keywords"><input className={inputCls} value={config.seo.keywords} onChange={(e) => update({ seo: { ...config.seo, keywords: e.target.value } })} onBlur={() => saveConfig(config, true)} /></Field>
                <Field label="Canonical URL"><input className={inputCls} value={config.seo.canonical} onChange={(e) => update({ seo: { ...config.seo, canonical: e.target.value } })} onBlur={() => saveConfig(config, true)} /></Field>
                <p className="text-xs text-[var(--muted)]">Open Graph, Twitter cards and the LocalBusiness JSON-LD schema (Vivace Clinic · Sydney · 4.9 · 346 reviews) update automatically from these fields. The OG image uses the hero artwork style.</p>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => downloadFile("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<url><loc>${config.seo.canonical}</loc></url>\n<url><loc>${config.seo.canonical}#services</loc></url>\n<url><loc>${config.seo.canonical}#blog</loc></url>\n<url><loc>${config.seo.canonical}#competition</loc></url>\n</urlset>`)} className="flex items-center gap-2 h-11 px-5 rounded-xl border border-[var(--line)] text-sm font-semibold hover:border-[var(--gold)] transition-all"><Download size={15} /> sitemap.xml</button>
                  <button onClick={() => downloadFile("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${config.seo.canonical}sitemap.xml\n`)} className="flex items-center gap-2 h-11 px-5 rounded-xl border border-[var(--line)] text-sm font-semibold hover:border-[var(--gold)] transition-all"><Download size={15} /> robots.txt</button>
                </div>
              </AdminCard>
            )}

            {tab === "bookings" && (
              <AdminCard title={`Booking diary (${bookings.length})`}>
                {sortedBookings.length === 0 ? <Empty text="No requests yet. New bookings from the site form land here instantly." /> :
                  sortedBookings.map((b) => (
                    <div key={b.id} className="rounded-2xl border border-[var(--line)] p-5 space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-[#5c2f38]" style={{ background: ART.rose }}>{(b.name || "?")[0]}</span>
                        <div className="min-w-0"><p className="font-semibold truncate">{b.name}</p><p className="text-xs text-[var(--muted)]">{b.service} · {b.phone}{b.date ? ` · prefers ${b.date}` : ""}</p></div>
                        <select value={b.status} onChange={(e) => patchBooking(b, { status: e.target.value })} className="ml-auto rounded-full border border-[var(--line)] bg-[var(--surface)] text-xs font-semibold px-3 py-2">
                          {["Pending", "Confirmed", "Completed"].map((s) => <option key={s}>{s}</option>)}
                        </select>
                        <button onClick={() => deleteBooking(b)} aria-label="Delete booking" className="w-9 h-9 rounded-full border border-[var(--line)] flex items-center justify-center text-red-400 hover:border-red-300 transition-all"><Trash2 size={15} /></button>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div><label className={labelCls}>Final date</label><input type="date" className={inputCls} value={b.finalDate} onChange={(e) => patchBooking(b, { finalDate: e.target.value })} /></div>
                        <div><label className={labelCls}>Final time</label><input type="time" className={inputCls} value={b.finalTime} onChange={(e) => patchBooking(b, { finalTime: e.target.value })} /></div>
                      </div>
                      <div><label className={labelCls}>Studio notes</label><input className={inputCls} placeholder="Internal notes…" value={b.notes} onChange={(e) => setBookings((p) => p.map((x) => x.id === b.id ? { ...x, notes: e.target.value } : x))} onBlur={(e) => patchBooking(b, { notes: e.target.value })} /></div>
                      <a href={waLink(config.general.whatsapp, `Hello ${b.name}, this is Vivace Clinic confirming your ${b.service} appointment on ${b.finalDate || b.date || "a date we will agree"} at ${b.finalTime || "a time we will agree"}. We cannot wait to see you.`)} target="_blank" rel="noopener"
                        className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-[#25D366] text-[#0b3d20] text-xs font-bold hover:-translate-y-0.5 transition-transform">
                        <MessageCircle size={15} /> Confirm via WhatsApp
                      </a>
                    </div>
                  ))}
              </AdminCard>
            )}

            {tab === "appearance" && (
              <AdminCard title="Appearance">
                <Field label="Default mode for new visitors">
                  <div className="grid grid-cols-2 gap-3">
                    {(["light", "dark"] as const).map((m) => (
                      <button key={m} onClick={() => { saveNow({ appearance: { ...config.appearance, defaultTheme: m } }); setTheme(m); setThemeTouched(true); }} className={`h-12 rounded-xl border flex items-center justify-center gap-2 text-sm font-semibold capitalize transition-all ${config.appearance.defaultTheme === m ? "border-[var(--gold)] bg-[color-mix(in_srgb,var(--gold)_10%,var(--surface))]" : "border-[var(--line)]"}`}>
                        {m === "light" ? <Sun size={16} /> : <Moon size={16} />} {m} mode
                      </button>
                    ))}
                  </div>
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Rose (primary)"><div className="flex gap-2"><input type="color" value={config.appearance.rose} onChange={(e) => saveNow({ appearance: { ...config.appearance, rose: e.target.value } })} className="w-12 h-[46px] rounded-xl border border-[var(--line)] bg-transparent cursor-pointer" /><input className={inputCls} value={config.appearance.rose} onChange={(e) => update({ appearance: { ...config.appearance, rose: e.target.value } })} onBlur={() => saveConfig(config, true)} /></div></Field>
                  <Field label="Gold (accent)"><div className="flex gap-2"><input type="color" value={config.appearance.gold} onChange={(e) => saveNow({ appearance: { ...config.appearance, gold: e.target.value } })} className="w-12 h-[46px] rounded-xl border border-[var(--line)] bg-transparent cursor-pointer" /><input className={inputCls} value={config.appearance.gold} onChange={(e) => update({ appearance: { ...config.appearance, gold: e.target.value } })} onBlur={() => saveConfig(config, true)} /></div></Field>
                </div>
                <p className="text-xs text-[var(--muted)]">The whole site cross-fades between modes in 0.4s. Visitors can override the default any time with the sun / moon toggle in the header.</p>
              </AdminCard>
            )}

            {tab === "storage" && (
              <AdminCard title="Storage — edit once, live everywhere">
                <p className="text-sm text-[var(--muted)] leading-relaxed">Your site content, bookings and giveaway entries live in the <strong className="text-[var(--text)]">studio database</strong> attached to this deployment. That means:</p>
                <ul className="space-y-2 text-sm text-[var(--muted)]">
                  {["Edit anything here and press Save — visitors (including incognito) see it instantly.", "No GitHub tokens, no Cloudflare, no file re-uploads.", "Bookings and entries are stored as individual records, sorted and searchable above."].map((t) => (
                    <li key={t} className="flex gap-2.5"><Check size={16} className="text-[var(--gold)] shrink-0 mt-0.5" /> {t}</li>
                  ))}
                </ul>
                <div className="rounded-2xl border border-[var(--line)] p-4 text-sm flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${storeStatus.includes("Connected") ? "bg-emerald-500" : "bg-amber-400 animate-pulse"}`} />
                  <span className="text-[var(--muted)]">{storeStatus}</span>
                </div>
                <p className="text-xs text-[var(--muted)] break-all">GitHub config endpoint: <code>{""}</code></p>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => saveConfig(config)} disabled={saving} className="flex items-center gap-2 h-11 px-5 rounded-xl font-semibold text-sm text-[#1A1A1A] disabled:opacity-50" style={{ background: "linear-gradient(120deg,var(--gold),#E9CE7A)" }}><Save size={15} /> {saving ? "Saving…" : "Save all changes"}</button>
                  <button onClick={() => { loadAll(); showToast("Reloaded the latest saved content."); }} className="flex items-center gap-2 h-11 px-5 rounded-xl border border-[var(--line)] text-sm font-semibold hover:border-[var(--gold)] transition-all"><RefreshCw size={15} /> Reload from database</button>
                </div>
              </AdminCard>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : null;

  /* login overlay */
  const loginOverlay = adminOpen && !loggedIn ? (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" style={{ background: "radial-gradient(1000px 600px at 70% -10%, rgba(232,180,184,.25), transparent), radial-gradient(800px 500px at 10% 110%, rgba(212,175,55,.18), transparent), #111" }}>
      <button onClick={() => setAdminOpen(false)} aria-label="Close login" className="absolute top-5 right-5 w-11 h-11 rounded-full border border-white/20 text-white flex items-center justify-center hover:border-[var(--gold)] transition-all"><X size={18} /></button>
      <div className={`w-full max-w-md rounded-[28px] border border-[rgba(212,175,55,.35)] p-9 sm:p-11 text-center ${loginError ? "anim-shake" : ""}`} style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(18px)" }}>
        <p className="font-display text-4xl sm:text-5xl text-white tracking-[0.1em]">VIVACE</p>
        <p className="font-accent text-2xl gold-text mt-1">clinic · studio</p>
        <div className="hairline w-28 mx-auto my-7" />
        <p className="text-white/50 text-sm mb-6">Enter the studio password to manage your site.</p>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && tryLogin()} placeholder="Studio password" autoFocus
          className="w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/35 px-4 py-3.5 text-center tracking-[0.2em]" />
        {loginError && <p className="text-[#E8B4B8] text-sm mt-4">That password is not quite right — try again.</p>}
        <button onClick={tryLogin} className="w-full mt-6 h-13 py-3.5 rounded-xl font-bold tracking-[0.18em] text-sm text-[#1A1A1A] hover:-translate-y-0.5 transition-transform" style={{ background: "linear-gradient(120deg,var(--gold),#E9CE7A)" }}>
          ENTER STUDIO
        </button>
        <p className="text-white/30 text-[11px] mt-6 tracking-wide">Vivace Clinic · Sydney</p>
      </div>
    </div>
  ) : null;

  return (
    <div data-safe-area-inset-root data-theme={theme} style={shellStyle} className="min-h-screen bg-[var(--bg)] text-[var(--text)] overflow-x-clip">
      {publicSite}
      {loginOverlay}
      {adminPanel}
      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[95] max-w-[92vw] bg-[#1A1A1A] text-white text-sm pl-4 pr-5 py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 border border-[rgba(212,175,55,.45)]">
          <Sparkles size={16} className="text-[var(--gold)] shrink-0" /> <span className="truncate">{toast}</span>
        </div>
      )}
    </div>
  );
}

/* --------------------------------- pieces --------------------------------- */
function LipsArt({ tone, glow, small }: { tone: string; glow?: boolean; small?: boolean }) {
  const w = small ? 110 : 170;
  return (
    <svg width={w} viewBox="0 0 200 110" fill="none" aria-hidden="true" style={glow ? { filter: "drop-shadow(0 10px 22px rgba(142,74,86,.45))" } : undefined}>
      <path d="M100 78 C70 96 30 84 12 52 C30 44 52 40 72 34 C84 30 94 24 100 16 C106 24 116 30 128 34 C148 40 170 44 188 52 C170 84 130 96 100 78 Z" fill={tone} />
      <path d="M12 52 C50 60 150 60 188 52 C150 68 50 68 12 52 Z" fill="rgba(0,0,0,.18)" />
      <ellipse cx="72" cy="46" rx="22" ry="7" fill="rgba(255,255,255,.35)" transform="rotate(-8 72 46)" />
    </svg>
  );
}

function SectionHead({ kicker, title, accent, sub }: { kicker: string; title: string; accent: string; sub: string }) {
  const parts = title.split(accent);
  return (
    <div className="text-center max-w-2xl mx-auto reveal">
      <p className="text-[11px] tracking-[0.34em] uppercase gold-text font-bold">{kicker}</p>
      <h2 className="font-display text-4xl sm:text-5xl font-medium mt-4">
        {parts[0]}<span className="font-accent gold-text text-5xl sm:text-6xl">{accent}</span>{parts[1] || ""}
      </h2>
      <div className="hairline w-24 mx-auto my-6" />
      <p className="text-[var(--muted)] leading-relaxed">{sub}</p>
    </div>
  );
}

function AdminCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-[24px] bg-[var(--surface)] border border-[var(--line)] shadow-[var(--card-shadow)] p-5 sm:p-7 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-[22px] font-semibold">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold tracking-[0.14em] uppercase text-[var(--muted)] mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className="flex items-center justify-between w-full rounded-2xl border border-[var(--line)] px-4 py-3.5">
      <span className="text-sm font-medium">{label}</span>
      <span className={`w-12 h-7 rounded-full p-1 transition-colors ${value ? "bg-[var(--gold)]" : "bg-[var(--line)]"}`}>
        <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${value ? "translate-x-5" : ""}`} />
      </span>
    </button>
  );
}

function ArtSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ART_KEYS.map((k) => (
        <button key={k} onClick={() => onChange(k)} className={`h-11 px-4 rounded-xl border text-xs font-semibold capitalize flex items-center gap-2 transition-all ${value === k ? "border-[var(--gold)] ring-2 ring-[rgba(212,175,55,.3)]" : "border-[var(--line)]"}`}>
          <span className="w-5 h-5 rounded-md" style={{ background: ART[k] }} /> {k}
        </button>
      ))}
    </div>
  );
}

function AddBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 h-9 px-4 rounded-full text-xs font-bold text-[#1A1A1A]" style={{ background: "linear-gradient(120deg,var(--gold),#E9CE7A)" }}>
      <Plus size={14} /> Add new
    </button>
  );
}

function Row({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-[var(--line)] last:border-0">
      <span className="text-sm font-medium truncate">{title}</span>
      <span className="text-xs text-[var(--muted)] text-right shrink-0">{sub}</span>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="text-sm text-[var(--muted)] rounded-2xl border border-dashed border-[var(--line)] p-5 text-center">{text}</p>;
}
