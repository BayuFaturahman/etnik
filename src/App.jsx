import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Heart,
  ShoppingBag,
  Star,
  MapPin,
  Leaf,
  Sparkles,
  X,
} from "lucide-react";




const PRODUCTS = [
  {
    id: "jw-001",
    name: "Java Collection Bustier",
    price: 850000,
    location: "Jawa",
    category: "Bustier",
    tags: ["Timeless", "Elegant"],
    rating: 4.8,
    eco: true,
    stock: 7,
    story:
      "Java Collection Bustier menghadirkan interpretasi modern dari keanggunan budaya Jawa melalui siluet bustier yang feminin dan tegas. Terinspirasi dari filosofi kelembutan dan keteguhan perempuan Jawa, koleksi ini memadukan detail motif tradisional dengan potongan modern yang mempertegas bentuk tubuh secara elegan.\n\nPemilihan warna-warna hangat dan klasik menciptakan kesan anggun, berkelas, sekaligus timeless. Bustier dalam Java Collection dirancang untuk perempuan yang ingin tampil percaya diri, berkarakter, dan tetap membawa nilai budaya dalam setiap tampilan.",
    materials: ["Fabric premium", "Detail motif tradisional"],
    // public/img/jawa-1.jpg -> akses via "/img/jawa-1.jpg"
    image: "/img/jawa-1.jpg",
    images: [
      "/img/jawa-1.jpg",
      "/img/jawa-2.jpg",
      "/img/jawa-3.jpg",
      "/img/jawa-4.jpg",
      "/img/jawa-5.jpg",
      "/img/jawa-6.jpg",
    ],
  },
  {
    id: "bl-002",
    name: "Bali Collection Bustier",
    price: 850000,
    location: "Bali",
    category: "Bustier",
    tags: ["Bold", "Artistic"],
    rating: 4.7,
    eco: true,
    stock: 7,
    story:
      "Bali Collection Bustier terinspirasi dari keindahan alam dan kekayaan budaya Bali yang penuh ekspresi dan spiritualitas. Mengangkat elemen motif khas Bali yang dinamis, koleksi ini diwujudkan dalam siluet bustier yang tegas namun tetap lembut, mencerminkan harmoni antara kekuatan dan keanggunan perempuan.\n\nDetail desain yang artistik dipadukan dengan pilihan warna yang hangat dan eksotis, menghadirkan kesan berani, feminin, dan penuh karakter. Bali Collection dirancang untuk perempuan yang ingin tampil menonjol, percaya diri, dan mengekspresikan jiwa bebasnya tanpa meninggalkan nilai budaya Nusantara.",
    materials: ["Fabric premium", "Detail motif khas Bali"],
    // public/img/bali-1.png -> akses via "/img/bali-1.png"
    image: "/img/bali-1.png",
    images: [
      "/img/bali-1.png",
      "/img/bali-2.png",
      "/img/bali-3.png",
      "/img/bali-4.png",
      "/img/bali-5.png",
    ],
  },
];

const CATEGORIES = ["Semua", "Bustier"];

const SORTS = [
  { id: "reco", label: "Rekomendasi" },
  { id: "price_asc", label: "Harga: rendah → tinggi" },
  { id: "price_desc", label: "Harga: tinggi → rendah" },
  { id: "rating_desc", label: "Rating tertinggi" },
  { id: "stock_desc", label: "Stok terbanyak" },
];



function buildWhatsAppMessage(items, total) {
  const lines = items.map((it, idx) => {
    const subtotal = it.price * (it.qty || 1);
    return `${idx + 1}. ${it.name} x${it.qty} = ${formatIDR(subtotal)}`;
  });

  return [
    "Halo, saya mau pesan produk berikut:",
    "",
    ...lines,
    "",
    `Total: ${formatIDR(total)}`,
    "",
    "Mohon info ketersediaan & ongkir ya. Terima kasih 🙏",
  ].join("\n");
}

function openWhatsApp(phoneNumber, text) {
  const clean = String(phoneNumber || "").replace(/[^0-9]/g, "");
  const url = `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}


function CartDrawer({
  open,
  onClose,
  items,
  onInc,
  onDec,
  onRemove,
  onClear,
  waNumber,
}) {
  const total = items.reduce((s, it) => s + it.price * (it.qty || 1), 0);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-5 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xl font-semibold">Keranjang</div>
            <div className="text-sm text-slate-500">
              {items.length ? `${items.length} produk` : "Masih kosong"}
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-2xl border hover:bg-slate-50 grid place-items-center"
            aria-label="Tutup keranjang"
          >
            <X className="h-4 w-4 text-slate-600" />
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {items.length === 0 ? (
            <div className="rounded-3xl border bg-white p-6 text-sm text-slate-600">
              Belum ada item. Tambahkan produk dulu ya.
            </div>
          ) : (
            items.map((it) => (
              <div
                key={it.id}
                className="rounded-3xl border bg-white p-3 flex gap-3"
              >
                <div className="h-16 w-16 rounded-2xl overflow-hidden bg-slate-100 border shrink-0">
                  <img
                    src={it.image}
                    alt={it.name}
                    className="h-16 w-16 object-cover"
                    onError={(e) => (e.currentTarget.src = placeholderDataUri(it.name))}
                  />
                </div>

                <div className="flex-1">
                  <div className="font-semibold leading-snug">{it.name}</div>
                  <div className="text-sm text-slate-600">{formatIDR(it.price)}</div>

                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => onDec(it.id)}
                      className="h-9 w-9 rounded-2xl border hover:bg-slate-50"
                      aria-label="Kurangi qty"
                      type="button"
                    >
                      −
                    </button>
                    <div className="min-w-10 text-center font-medium">{it.qty}</div>
                    <button
                      onClick={() => onInc(it.id)}
                      className="h-9 w-9 rounded-2xl border hover:bg-slate-50"
                      aria-label="Tambah qty"
                      type="button"
                    >
                      +
                    </button>

                    <button
                      onClick={() => onRemove(it.id)}
                      className="ml-auto rounded-2xl border px-3 py-2 text-sm hover:bg-slate-50"
                      type="button"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length ? (
          <>
            <div className="mt-4 rounded-3xl border bg-white p-4 flex items-center justify-between">
              <div className="text-sm text-slate-600">Total</div>
              <div className="text-xl font-semibold">{formatIDR(total)}</div>
            </div>

            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  const msg = buildWhatsAppMessage(items, total);
                  openWhatsApp(waNumber, msg);
                }}
                className="flex-1 rounded-2xl bg-brand-wine text-white py-2 hover:bg-brand-maroon flex items-center justify-center gap-2"
                type="button"
              >
                <span className="font-semibold">Checkout via WhatsApp</span>
              </button>

              <button
                onClick={onClear}
                className="rounded-2xl border bg-white px-4 py-2 hover:bg-slate-50"
                type="button"
              >
                Kosongkan
              </button>
            </div>


          </>
        ) : null}
      </div>
    </Modal>
  );
}

/* ===================== UTIL ===================== */

function formatIDR(n) {
  try {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `Rp ${String(n)}`;
  }
}

function clamp01(x) {
  return Math.min(1, Math.max(0, x));
}

function ratingStars(r) {
  const full = Math.floor(r);
  const half = r - full >= 0.5 ? 1 : 0;
  const empty = Math.max(0, 5 - full - half);
  return { full, half, empty };
}

function placeholderDataUri(title = "EtnikKatalog") {
  // SVG placeholder biar 100% tampil walau gambar gagal load
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#F2E6CC"/>
        <stop offset="0.5" stop-color="#F2D98B" stop-opacity="0.35"/>
        <stop offset="1" stop-color="#D6A7BA" stop-opacity="0.35"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="800" fill="url(#g)"/>
    <circle cx="180" cy="180" r="90" fill="#881F2B" opacity="0.16"/>
    <circle cx="980" cy="620" r="140" fill="#690022" opacity="0.12"/>
    <text x="80" y="430" font-family="ui-sans-serif, system-ui" font-size="56" fill="#0f172a" opacity="0.85">${escapeXml(
    title
  )}</text>
    <text x="80" y="500" font-family="ui-sans-serif, system-ui" font-size="26" fill="#334155" opacity="0.7">Gambar tidak tersedia (fallback)</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function escapeXml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function useLocalStorageState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return initialValue;
      return JSON.parse(raw);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [key, state]);

  return [state, setState];
}

/* ===================== UI ATOMS ===================== */

function Badge({ children, variant = "default" }) {
  const base = "inline-flex items-center rounded-full px-2 py-0.5 text-xs border";
  const styles =
    variant === "soft"
      ? "bg-brand-champagne/70 border-black/10 text-slate-700"
      : variant === "eco"
        ? "bg-brand-rose/30 border-brand-rose/60 text-brand-wine"
        : "bg-white/70 border-black/10 text-slate-700";
  return <span className={`${base} ${styles}`}>{children}</span>;
}


function StarRow({ rating }) {
  const { full, half, empty } = ratingStars(rating);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}
      {half ? (
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 opacity-70" />
      ) : null}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e${i}`} className="h-4 w-4 text-slate-300" />
      ))}
      <span className="ml-1 text-xs text-slate-500">{rating.toFixed(1)}</span>
    </div>
  );
}


function Toast({ open, title, description, onClose }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="w-[92vw] max-w-md rounded-2xl border bg-white shadow-lg p-4 flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-brand-rose/30 border border-brand-rose/60 grid place-items-center">
              <ShoppingBag className="h-4 w-4 text-brand-wine" />
            </div>

            <div className="flex-1">
              <div className="font-semibold text-slate-900">{title}</div>
              {description ? (
                <div className="text-sm text-slate-600 mt-0.5">{description}</div>
              ) : null}
            </div>
            <button
              onClick={onClose}
              className="h-9 w-9 rounded-xl hover:bg-slate-50 grid place-items-center"
              aria-label="Tutup notifikasi"
            >
              <X className="h-4 w-4 text-slate-500" />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Modal({ open, onClose, children }) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
          >
            <div
              className="w-full max-w-3xl rounded-3xl bg-white border shadow-xl overflow-hidden"
              role="dialog"
              aria-modal="true"
            >
              {children}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

/* ===================== APP ===================== */

export default function App() {
  const prices = useMemo(() => PRODUCTS.map((p) => p.price), []);
  const absoluteMin = Math.min(...prices);
  const absoluteMax = Math.max(...prices);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [sortId, setSortId] = useState("reco");
  const [ecoOnly, setEcoOnly] = useState(false);
  const WA_NUMBER = "6289638233061";
  const [openCart, setOpenCart] = useState(false);
  const [priceRange, setPriceRange] = useState({
    min: absoluteMin,
    max: absoluteMax,
  });

  const [favIds, setFavIds] = useLocalStorageState("etnik:favs", []);
  const [cart, setCart] = useLocalStorageState("etnik:cart", []);

  const [openDetail, setOpenDetail] = useState(false);
  const [selected, setSelected] = useState(null);

  const [toast, setToast] = useState({ open: false, title: "", description: "" });
  const [activeImg, setActiveImg] = useState(0);


  function incCart(id) {
    setCart((prev) =>
      prev.map((it) => (it.id === id ? { ...it, qty: it.qty + 1 } : it))
    );
  }

  function decCart(id) {
    setCart((prev) =>
      prev
        .map((it) => (it.id === id ? { ...it, qty: Math.max(1, it.qty - 1) } : it))
        .filter(Boolean)
    );
  }

  function removeCart(id) {
    setCart((prev) => prev.filter((it) => it.id !== id));
  }

  function clearCart() {
    setCart([]);
  }


  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let arr = PRODUCTS.filter((p) => {
      const inCat = category === "Semua" ? true : p.category === category;
      const inEco = ecoOnly ? !!p.eco : true;
      const inPrice = p.price >= priceRange.min && p.price <= priceRange.max;
      const inQuery = !q
        ? true
        : [p.name, p.location, p.category, ...(p.tags || [])]
          .join(" ")
          .toLowerCase()
          .includes(q);
      return inCat && inEco && inPrice && inQuery;
    });

    arr = arr.sort((a, b) => {
      switch (sortId) {
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "rating_desc":
          return b.rating - a.rating;
        case "stock_desc":
          return b.stock - a.stock;
        case "reco":
        default:
          return (
            b.rating +
            (b.eco ? 0.2 : 0) +
            Math.min(0.2, b.stock / 100) -
            (a.rating + (a.eco ? 0.2 : 0) + Math.min(0.2, a.stock / 100))
          );
      }
    });

    return arr;
  }, [query, category, sortId, ecoOnly, priceRange.min, priceRange.max]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const avg = total ? filtered.reduce((s, p) => s + p.rating, 0) / total : 0;
    const ecoCount = filtered.filter((p) => p.eco).length;
    return { total, avg, ecoCount };
  }, [filtered]);

  function toggleFav(id) {
    setFavIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function addToCart(p) {
    setCart((prev) => {
      const found = prev.find((it) => it.id === p.id);
      if (found) return prev.map((it) => (it.id === p.id ? { ...it, qty: it.qty + 1 } : it));
      return [...prev, { id: p.id, name: p.name, price: p.price, qty: 1, image: p.image }];
    });

    setToast({ open: true, title: "Ditambahkan ke keranjang", description: p.name });
    window.clearTimeout(window.__etnik_toast_timer);
    window.__etnik_toast_timer = window.setTimeout(() => {
      setToast((t) => ({ ...t, open: false }));
    }, 1800);
  }

  function openProduct(p) {
    setSelected(p);
    setActiveImg(0);
    setOpenDetail(true);
  }


  function resetAll() {
    setQuery("");
    setCategory("Semua");
    setSortId("reco");
    setEcoOnly(false);
    setPriceRange({ min: absoluteMin, max: absoluteMax });
  }

  const cartCount = cart.reduce((s, it) => s + (it.qty || 0), 0);
  const cartTotal = cart.reduce((s, it) => s + it.price * (it.qty || 1), 0);

  return (
    <div className="min-h-screen bg-brand-champagne text-slate-900">
      {/* TOP BAR */}
      <div className="sticky top-0 z-30 bg-brand-champagne/80 backdrop-blur border-b border-black/5">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-brand-sand via-brand-champagne to-brand-rose border border-black/5 grid place-items-center">
                <Sparkles className="h-5 w-5 text-slate-800" />
              </div>
              <div className="leading-tight">
                <div className="font-semibold tracking-tight">Ravanti.Studio</div>
                <div className="text-xs text-slate-500">Katalog budaya yang mudah dipakai</div>
              </div>
            </div>


            <button
              onClick={() => setOpenCart(true)}
            >
              <ShoppingBag className="h-4 w-4" />
              Keranjang
              {cartCount ? (
                <span className="ml-1 rounded-full bg-slate-900 text-white text-xs px-2 py-0.5">
                  {cartCount}
                </span>
              ) : null}
            </button>

          </div>

          {/* FILTER ROW */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-6 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari batik, tenun, ukiran…"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-black/10 bg-white focus:outline-none focus:ring-2 focus:ring-brand-rose"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-2xl border border-black/10 bg-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-rose"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                className="rounded-2xl border bg-white px-3 py-2 text-sm hover:bg-slate-50 flex items-center gap-2"
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={sortId}
                onChange={(e) => setSortId(e.target.value)}
                className="w-full rounded-2xl border bg-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-300"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={ecoOnly}
                onChange={(e) => setEcoOnly(e.target.checked)}
                className="h-4 w-4 accent-brand-wine"
              />
              Tampilkan Eco saja
            </label>

            <div className="flex items-center gap-3">
              <div className="text-xs text-slate-500">
                {stats.total} item • rating rata-rata {stats.total ? stats.avg.toFixed(1) : "—"} • eco{" "}
                {stats.ecoCount}
              </div>
              <button
                onClick={resetAll}
                className="rounded-2xl border bg-white px-3 py-2 text-sm hover:bg-slate-50"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* HERO */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <section className="rounded-3xl border border-black/5 bg-gradient-to-br from-brand-champagne via-brand-sand/40 to-brand-rose/40 p-6">
         
          <div className="text-sm text-slate-600 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Koleksi budaya Nusantara
          </div>
          <div className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
            Temukan kerajinan Nusantara dengan cepat — tiap produk punya cerita, asal daerah, dan nilai budaya yang autentik.
          </div>

        </section>

        {/* GRID */}
        <section className="mt-6">
          {filtered.length === 0 ? (
            <div className="rounded-3xl border bg-white p-10 text-center">
              <div className="text-lg font-semibold">Tidak ada produk yang cocok</div>
              <div className="text-sm text-slate-500 mt-1">
                Coba ubah kata kunci / kategori / harga.
              </div>
              <button
                onClick={resetAll}
                className="mt-5 rounded-2xl bg-brand-wine text-white px-4 py-2 hover:bg-brand-maroon"
              >
                Reset filter
              </button>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {filtered.map((p) => {
                  const isFav = favIds.includes(p.id);
                  return (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 14 }}
                      className="rounded-3xl border bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <button
                        onClick={() => openProduct(p)}
                        className="block w-full text-left"
                        aria-label={`Buka detail ${p.name}`}
                      >
                        <div className="relative">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-48 w-full object-cover bg-slate-100"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = placeholderDataUri(p.name);
                            }}
                          />

                          <div className="absolute left-3 top-3 flex gap-2">
                            {p.eco ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-white/85 border border-black/10 px-2 py-0.5 text-xs text-brand-wine">
                                <Leaf className="h-3.5 w-3.5" /> Eco
                              </span>
                            ) : null}
                            {p.stock <= 5 ? (
                              <span className="inline-flex items-center rounded-full bg-white/85 border px-2 py-0.5 text-xs text-slate-700">
                                Limited
                              </span>
                            ) : null}
                          </div>

                          <div className="absolute right-3 top-3">
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={(ev) => {
                                ev.preventDefault();
                                ev.stopPropagation();
                                toggleFav(p.id);
                              }}
                              onKeyDown={(ev) => {
                                if (ev.key === "Enter" || ev.key === " ") {
                                  ev.preventDefault();
                                  ev.stopPropagation();
                                  toggleFav(p.id);
                                }
                              }}
                              className="h-9 w-9 rounded-2xl bg-white/85 border border-black/10 grid place-items-center hover:bg-white cursor-pointer"
                              aria-label={isFav ? "Hapus favorit" : "Tambah favorit"}
                            >
                              <Heart
                                className={
                                  "h-4 w-4 " +
                                  (isFav ? "fill-rose-500 text-rose-500" : "text-slate-600")
                                }
                              />
                            </div>
                          </div>

                        </div>
                      </button>

                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <button
                            onClick={() => openProduct(p)}
                            className="text-left"
                            aria-label={`Lihat detail ${p.name}`}
                          >
                            <div className="font-semibold leading-snug line-clamp-2">{p.name}</div>
                            <div className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {p.location}
                            </div>
                          </button>
                          <div className="text-right">
                            <div className="font-semibold">{formatIDR(p.price)}</div>
                            <div className="mt-1">
                              <StarRow rating={p.rating} />
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge>{p.category}</Badge>
                          {(p.tags || []).slice(0, 2).map((t) => (
                            <Badge key={t} variant="soft">
                              {t}
                            </Badge>
                          ))}
                        </div>

                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => addToCart(p)}
                            disabled={p.stock <= 0}
                            className="flex-1 rounded-2xl bg-brand-wine text-white py-2 hover:bg-brand-maroon disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            <ShoppingBag className="h-4 w-4" />
                            {p.stock > 0 ? "Tambah" : "Habis"}
                          </button>
                          <button
                            onClick={() => openProduct(p)}
                            className="rounded-2xl border bg-white px-3 py-2 hover:bg-slate-50"
                          >
                            Detail
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </section>

        <footer className="mt-10 pb-8 text-sm text-slate-500">
          © {new Date().getFullYear()} Ravanti.Studio — Produk katalog etnik.
        </footer>
      </main>

      {/* DETAIL MODAL */}
      <Modal
        open={openDetail}
        onClose={() => {
          setOpenDetail(false);
          setSelected(null);
        }}
      >
        {selected ? (
          <div className="p-5 md:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xl font-semibold">{selected.name}</div>
                <div className="mt-1 text-sm text-slate-600 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {selected.location}
                  </span>
                  <span className="text-slate-300">•</span>
                  <StarRow rating={selected.rating} />
                </div>
              </div>
              <button
                onClick={() => {
                  setOpenDetail(false);
                  setSelected(null);
                }}
                className="h-10 w-10 rounded-2xl border hover:bg-slate-50 grid place-items-center"
                aria-label="Tutup"
              >
                <X className="h-4 w-4 text-slate-600" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* LEFT: IMAGE + THUMBNAILS */}
              <div>
                <div className="rounded-3xl overflow-hidden border bg-slate-100">
                  <img
                    src={selected.images?.[activeImg] || selected.image}
                    alt={selected.name}
                    className="w-full h-72 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = placeholderDataUri(selected.name);
                    }}
                  />
                </div>

                {/* Thumbnails */}
                {(selected.images?.length || 0) > 1 ? (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {selected.images.map((src, idx) => (
                      <button
                        key={`${src}-${idx}`}
                        type="button"
                        onClick={() => setActiveImg(idx)}
                        className={
                          "h-16 w-16 rounded-2xl overflow-hidden border shrink-0 " +
                          (idx === activeImg
                            ? "border-brand-wine ring-2 ring-brand-rose"
                            : "border-black/10 hover:border-black/20")
                        }
                        aria-label={`Lihat foto ${idx + 1}`}
                      >
                        <img
                          src={src}
                          alt={`${selected.name} foto ${idx + 1}`}
                          className="h-16 w-16 object-cover"
                          onError={(e) => {
                            e.currentTarget.src = placeholderDataUri(selected.name);
                          }}
                        />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              {/* RIGHT: DETAILS */}
              <div className="space-y-4">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <div className="text-sm text-slate-500">Harga</div>
                    <div className="text-2xl font-semibold">{formatIDR(selected.price)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500">Stok</div>
                    <div className="font-medium">{selected.stock} pcs</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge>{selected.category}</Badge>
                  {selected.eco ? <Badge variant="eco">Eco</Badge> : null}
                  {(selected.tags || []).map((t) => (
                    <Badge key={t} variant="soft">
                      {t}
                    </Badge>
                  ))}
                </div>

                <div className="rounded-3xl border bg-white p-4">
                  <div className="font-semibold">Cerita singkat</div>
                  <div className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {selected.story}
                  </div>
                </div>

                <div className="rounded-3xl border bg-white p-4">
                  <div className="font-semibold">Bahan</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(selected.materials || []).map((m) => (
                      <Badge key={m}>{m}</Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => addToCart(selected)}
                    disabled={selected.stock <= 0}
                    className="flex-1 rounded-2xl bg-brand-wine text-white py-2 hover:bg-brand-maroon disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="h-4 w-4" /> Tambah ke Keranjang
                  </button>

                  <button
                    onClick={() => toggleFav(selected.id)}
                    className="rounded-2xl border bg-white px-4 py-2 hover:bg-slate-50 flex items-center justify-center gap-2"
                  >
                    <Heart
                      className={
                        "h-4 w-4 " +
                        (favIds.includes(selected.id)
                          ? "fill-rose-500 text-rose-500"
                          : "text-slate-700")
                      }
                    />
                    {favIds.includes(selected.id) ? "Favorit" : "Simpan"}
                  </button>
                </div>

              
              </div>
            </div>

          </div>
        ) : null}
      </Modal>

      {/* CartDrawer */}

      <CartDrawer
        open={openCart}
        onClose={() => setOpenCart(false)}
        items={cart}
        onInc={incCart}
        onDec={decCart}
        onRemove={removeCart}
        onClear={clearCart}
        waNumber={WA_NUMBER}
      />
      {/* TOAST */}
      <Toast
        open={toast.open}
        title={toast.title}
        description={toast.description}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />
    </div>
  );
}
