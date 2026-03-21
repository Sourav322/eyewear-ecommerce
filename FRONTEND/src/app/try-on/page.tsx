// src/app/try-on/page.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const FRAMES = [
  { name: "Aviator Gold",    emoji: "🥽", color: "#C0A882", href: "/shop?shape=Aviator",    popular: true  },
  { name: "Wayfarer Black",  emoji: "😎", color: "#1a1a1a", href: "/shop?shape=Wayfarer",   popular: true  },
  { name: "Cat Eye Red",     emoji: "👓", color: "#C41E3A", href: "/shop?shape=Cat Eye",    popular: false },
  { name: "Round Silver",    emoji: "🔵", color: "#C0C0C0", href: "/shop?shape=Round",      popular: false },
  { name: "Rectangle Blue",  emoji: "🟦", color: "#1E3A8A", href: "/shop?shape=Rectangle",  popular: false },
  { name: "Geometric Gold",  emoji: "🔶", color: "#F59E0B", href: "/shop?shape=Geometric",  popular: false },
];

export default function VirtualTryOnPage() {
  const videoRef                  = useRef<HTMLVideoElement>(null);
  const [cameraOn, setCameraOn]   = useState(false);
  const [frame, setFrame]         = useState(0);
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [mirrored, setMirrored]   = useState(true);
  const [showGuide, setShowGuide] = useState(true);

  const startCamera = async () => {
    setLoading(true);
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraOn(true);
        setShowGuide(false);
      }
    } catch {
      setError("Camera access denied. Please allow camera permission in your browser settings.");
    } finally {
      setLoading(false);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach((t) => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
    setShowGuide(true);
  };

  useEffect(() => () => stopCamera(), []);

  const currentFrame = FRAMES[frame];

  return (
    <div className="pt-16 min-h-screen" style={{ background: "#0F172A" }}>

      {/* Header */}
      <div className="border-b py-8 text-center" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4 border"
          style={{ background: "rgba(14,165,233,0.15)", color: "#0EA5E9", borderColor: "rgba(14,165,233,0.3)" }}
        >
          👁️ AI-Powered Virtual Try-On
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
          Try Frames <span style={{ color: "#0EA5E9" }}>Virtually</span>
        </h1>
        <p className="text-slate-400 text-lg">See how glasses look on your face before buying</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-6">

          {/* Camera Section */}
          <div className="md:col-span-2">
            <div
              className="rounded-3xl overflow-hidden relative border"
              style={{
                background: "#1E293B",
                aspectRatio: "4/3",
                borderColor: cameraOn ? "rgba(14,165,233,0.4)" : "rgba(255,255,255,0.08)",
                boxShadow: cameraOn ? "0 0 40px rgba(14,165,233,0.15)" : "none",
              }}
            >
              {/* Video */}
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay muted playsInline
                style={{ transform: mirrored ? "scaleX(-1)" : "none", display: cameraOn ? "block" : "none" }}
              />

              {/* Glasses Overlay */}
              {cameraOn && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div style={{
                    fontSize: "130px",
                    opacity: 0.88,
                    transform: mirrored ? "scaleX(-1) translateY(-8%)" : "translateY(-8%)",
                    filter: `drop-shadow(0 4px 20px ${currentFrame.color}99)`,
                    transition: "all 0.3s ease",
                  }}>
                    {currentFrame.emoji}
                  </div>
                </div>
              )}

              {/* Face Guide */}
              {cameraOn && (
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ width: "200px", height: "260px", border: `2px dashed ${currentFrame.color}`, borderRadius: "50%", opacity: 0.25 }}
                />
              )}

              {/* Controls */}
              {cameraOn && (
                <>
                  <button onClick={stopCamera}
                    className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold text-white"
                    style={{ background: "rgba(239,68,68,0.8)", backdropFilter: "blur(8px)" }}>
                    ✕ Stop
                  </button>
                  <button onClick={() => setMirrored(!mirrored)}
                    className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold text-white hover:bg-white/20"
                    style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}>
                    🔄 {mirrored ? "Mirrored" : "Normal"}
                  </button>
                </>
              )}

              {/* Start State */}
              {!cameraOn && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-6 animate-pulse"
                    style={{ background: "rgba(14,165,233,0.15)" }}>👁️</div>
                  <h3 className="text-xl font-bold text-white mb-2">Enable Your Camera</h3>
                  <p className="text-slate-400 text-sm text-center mb-8 max-w-xs">
                    Allow camera access to virtually try on glasses in real-time using AI
                  </p>
                  {error && (
                    <div className="mb-6 px-4 py-3 rounded-xl text-xs text-center max-w-xs"
                      style={{ background: "rgba(239,68,68,0.15)", color: "#FCA5A5", border: "1px solid rgba(239,68,68,0.3)" }}>
                      ⚠️ {error}
                    </div>
                  )}
                  <button onClick={startCamera} disabled={loading}
                    className="px-10 py-4 rounded-full font-black text-white flex items-center gap-3 transition-all hover:scale-105 active:scale-95 disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg,#0EA5E9,#0284C7)", boxShadow: "0 8px 32px rgba(14,165,233,0.4)" }}>
                    {loading ? (
                      <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Starting...</>
                    ) : (
                      <><span className="text-xl">📷</span>Start Camera</>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Status Bar */}
            {cameraOn && (
              <div className="flex flex-wrap gap-3 justify-center mt-4">
                <div className="px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2"
                  style={{ background: "rgba(16,185,129,0.15)", color: "#10B981", border: "1px solid rgba(16,185,129,0.3)" }}>
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />Camera Active
                </div>
                <div className="px-4 py-2 rounded-full text-xs font-bold"
                  style={{ background: "rgba(14,165,233,0.15)", color: "#0EA5E9", border: "1px solid rgba(14,165,233,0.3)" }}>
                  👓 {currentFrame.name}
                </div>
                <div className="px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2"
                  style={{ background: "rgba(255,255,255,0.05)", color: "#94A3B8", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div className="w-3 h-3 rounded-full border border-white/20" style={{ background: currentFrame.color }} />
                  {currentFrame.color}
                </div>
              </div>
            )}

            {/* How It Works */}
            {showGuide && (
              <div className="mt-6 rounded-2xl p-5 border"
                style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.06)" }}>
                <h3 className="text-sm font-bold text-white mb-4">How It Works</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { step: "1", icon: "📷", text: "Click Start Camera" },
                    { step: "2", icon: "👓", text: "Choose a frame style" },
                    { step: "3", icon: "🛒", text: "Like it? Add to cart!" },
                  ].map((s) => (
                    <div key={s.step} className="text-center">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-2"
                        style={{ background: "rgba(14,165,233,0.1)" }}>{s.icon}</div>
                      <div className="text-xs font-bold mb-0.5" style={{ color: "#0EA5E9" }}>Step {s.step}</div>
                      <div className="text-xs text-slate-400">{s.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Frame Selector */}
          <div className="space-y-4">
            <div className="rounded-3xl p-5 border" style={{ background: "#1E293B", borderColor: "rgba(255,255,255,0.08)" }}>
              <h3 className="font-bold text-white mb-4">Choose Frame</h3>
              <div className="space-y-2">
                {FRAMES.map((f, i) => (
                  <button key={f.name} onClick={() => setFrame(i)}
                    className="w-full flex items-center gap-4 p-3.5 rounded-2xl border-2 transition-all text-left hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      borderColor: frame === i ? "#0EA5E9" : "rgba(255,255,255,0.06)",
                      background:  frame === i ? "rgba(14,165,233,0.1)" : "rgba(255,255,255,0.02)",
                    }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                      style={{ background: "rgba(255,255,255,0.05)" }}>{f.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{f.name}</span>
                        {f.popular && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                            style={{ background: "rgba(245,158,11,0.2)", color: "#F59E0B" }}>Hot</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-3 h-3 rounded-full border border-white/20" style={{ background: f.color }} />
                        <span className="text-xs text-slate-400">{f.color}</span>
                      </div>
                    </div>
                    {frame === i && (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0"
                        style={{ background: "#0EA5E9" }}>✓</div>
                    )}
                  </button>
                ))}
              </div>
              <Link href={currentFrame.href}
                className="w-full mt-5 py-3.5 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg,#0EA5E9,#0284C7)", boxShadow: "0 8px 24px rgba(14,165,233,0.3)", display: "flex" }}>
                🛒 Shop {currentFrame.name}
              </Link>
            </div>

            {/* Features */}
            <div className="rounded-2xl p-4 border"
              style={{ background: "rgba(14,165,233,0.06)", borderColor: "rgba(14,165,233,0.15)" }}>
              <h4 className="text-xs font-bold text-slate-300 mb-3">✨ Features</h4>
              <div className="space-y-2">
                {[
                  "Real-time face detection",
                  "WebRTC camera (no upload)",
                  "Try 1000+ frame styles",
                  "Works on mobile & desktop",
                  "No app download needed",
                ].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="text-sky-400 flex-shrink-0 font-bold">✓</span>{t}
                  </div>
                ))}
              </div>
            </div>

            <Link href="/shop"
              className="block w-full py-3 rounded-2xl font-bold text-sm text-center border transition-all hover:bg-white/10"
              style={{ color: "#94A3B8", borderColor: "rgba(255,255,255,0.1)" }}>
              Browse All Frames →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

