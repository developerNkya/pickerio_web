"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight, Sparkles } from "lucide-react"

interface OnboardingProps {
  onComplete: () => void
}

const slides = [
  {
    id: 1,
    title: "See the World",
    subtitle: "in Color",
    description: "Every surface, every shadow, every ray of light holds a story told through color.",
    accent: "#E63946",
    secondary: "#F4A261",
    illustration: "eye",
  },
  {
    id: 2,
    title: "Capture",
    subtitle: "Any Moment",
    description: "Snap a photo or choose from your gallery. Your canvas awaits discovery.",
    accent: "#2A9D8F",
    secondary: "#264653",
    illustration: "camera",
  },
  {
    id: 3,
    title: "Touch to",
    subtitle: "Discover",
    description: "Simply tap anywhere on your image. Watch as colors reveal their true identity.",
    accent: "#9B5DE5",
    secondary: "#F15BB5",
    illustration: "touch",
  },
  {
    id: 4,
    title: "Build Your",
    subtitle: "Palette",
    description: "Create stunning color collections. Learn the art and science behind every hue.",
    accent: "#F4A261",
    secondary: "#E9C46A",
    illustration: "palette",
  },
]

function EyeIllustration({ accent, secondary }: { accent: string; secondary: string }) {
  return (
    <div className="relative w-64 h-64">
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-30"
        style={{ background: `radial-gradient(circle, ${accent}, transparent)` }}
      />

      {/* Main eye shape */}
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id="eye-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={accent} />
            <stop offset="100%" stopColor={secondary} />
          </linearGradient>
          <filter id="eye-shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Eye outline */}
        <path
          d="M100 50 Q150 100 100 150 Q50 100 100 50"
          fill="none"
          stroke="url(#eye-gradient)"
          strokeWidth="3"
          filter="url(#eye-shadow)"
          className="animate-pulse"
        />

        {/* Iris */}
        <circle cx="100" cy="100" r="35" fill={accent} opacity="0.9" />

        {/* Pupil */}
        <circle cx="100" cy="100" r="18" fill="#1a1a2e" />

        {/* Light reflection */}
        <circle cx="108" cy="92" r="6" fill="white" opacity="0.9" />
        <circle cx="94" cy="104" r="3" fill="white" opacity="0.6" />

        {/* Color spectrum around iris */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <circle
            key={i}
            cx={100 + 45 * Math.cos((angle * Math.PI) / 180)}
            cy={100 + 45 * Math.sin((angle * Math.PI) / 180)}
            r="5"
            fill={["#E63946", "#F4A261", "#E9C46A", "#2A9D8F", "#264653", "#9B5DE5", "#F15BB5", "#00BBF9"][i]}
            className="animate-pulse"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </svg>
    </div>
  )
}

function CameraIllustration({ accent, secondary }: { accent: string; secondary: string }) {
  return (
    <div className="relative w-64 h-64">
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-20"
        style={{ background: `radial-gradient(circle, ${accent}, transparent)` }}
      />

      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id="cam-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={accent} />
            <stop offset="100%" stopColor={secondary} />
          </linearGradient>
        </defs>

        {/* Camera body */}
        <rect x="35" y="65" width="130" height="90" rx="12" fill="url(#cam-gradient)" opacity="0.9" />

        {/* Top bump */}
        <rect x="70" y="50" width="40" height="20" rx="4" fill={secondary} />

        {/* Lens outer ring */}
        <circle cx="100" cy="110" r="38" fill="#1a1a2e" />
        <circle cx="100" cy="110" r="32" fill="#2a2a4e" />

        {/* Lens inner with color reflection */}
        <circle cx="100" cy="110" r="25" fill="#1a1a2e">
          <animate attributeName="r" values="25;27;25" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Rainbow reflection on lens */}
        <ellipse cx="108" cy="102" rx="12" ry="8" fill="url(#cam-gradient)" opacity="0.4" transform="rotate(-30 108 102)" />

        {/* Flash */}
        <rect x="130" y="72" width="20" height="12" rx="2" fill="#E9C46A" opacity="0.8">
          <animate attributeName="opacity" values="0.8;1;0.8" dur="1s" repeatCount="indefinite" />
        </rect>

        {/* Shutter button */}
        <circle cx="145" cy="58" r="8" fill={accent} />

        {/* Photos flying out */}
        {[
          { x: 25, y: 40, rotate: -20, delay: "0s" },
          { x: 160, y: 35, rotate: 15, delay: "0.3s" },
          { x: 170, y: 140, rotate: 25, delay: "0.6s" },
        ].map((photo, i) => (
          <g key={i} style={{ animation: `float 3s ease-in-out infinite`, animationDelay: photo.delay }}>
            <rect
              x={photo.x}
              y={photo.y}
              width="24"
              height="30"
              rx="2"
              fill="white"
              transform={`rotate(${photo.rotate} ${photo.x + 12} ${photo.y + 15})`}
            />
            <rect
              x={photo.x + 3}
              y={photo.y + 3}
              width="18"
              height="14"
              rx="1"
              fill={["#E63946", "#2A9D8F", "#F4A261"][i]}
              transform={`rotate(${photo.rotate} ${photo.x + 12} ${photo.y + 15})`}
            />
          </g>
        ))}
      </svg>
    </div>
  )
}

function TouchIllustration({ accent, secondary }: { accent: string; secondary: string }) {
  return (
    <div className="relative w-64 h-64">
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-20"
        style={{ background: `radial-gradient(circle, ${accent}, transparent)` }}
      />

      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id="touch-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={accent} />
            <stop offset="100%" stopColor={secondary} />
          </linearGradient>
          <radialGradient id="ripple-gradient">
            <stop offset="0%" stopColor={accent} stopOpacity="0.5" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ripple effects */}
        <circle cx="100" cy="100" r="20" fill="none" stroke={accent} strokeWidth="2" opacity="0.6">
          <animate attributeName="r" values="20;60" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="100" cy="100" r="20" fill="none" stroke={accent} strokeWidth="2" opacity="0.6">
          <animate attributeName="r" values="20;60" dur="1.5s" repeatCount="indefinite" begin="0.5s" />
          <animate attributeName="opacity" values="0.6;0" dur="1.5s" repeatCount="indefinite" begin="0.5s" />
        </circle>
        <circle cx="100" cy="100" r="20" fill="none" stroke={accent} strokeWidth="2" opacity="0.6">
          <animate attributeName="r" values="20;60" dur="1.5s" repeatCount="indefinite" begin="1s" />
          <animate attributeName="opacity" values="0.6;0" dur="1.5s" repeatCount="indefinite" begin="1s" />
        </circle>

        {/* Center touch point */}
        <circle cx="100" cy="100" r="15" fill="url(#touch-gradient)">
          <animate attributeName="r" values="15;18;15" dur="1s" repeatCount="indefinite" />
        </circle>

        {/* Hand/finger */}
        <path
          d="M95 85 Q100 70 105 85 L108 130 Q100 140 92 130 L95 85"
          fill="url(#touch-gradient)"
          opacity="0.9"
          transform="translate(0 -5)"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 -5;0 0;0 -5"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>

        {/* Color particles bursting */}
        {[
          { angle: 0, color: "#E63946", r: 50 },
          { angle: 45, color: "#F4A261", r: 55 },
          { angle: 90, color: "#E9C46A", r: 48 },
          { angle: 135, color: "#2A9D8F", r: 52 },
          { angle: 180, color: "#264653", r: 50 },
          { angle: 225, color: "#9B5DE5", r: 54 },
          { angle: 270, color: "#F15BB5", r: 49 },
          { angle: 315, color: "#00BBF9", r: 53 },
        ].map((particle, i) => (
          <circle
            key={i}
            cx={100 + particle.r * Math.cos((particle.angle * Math.PI) / 180)}
            cy={100 + particle.r * Math.sin((particle.angle * Math.PI) / 180)}
            r="6"
            fill={particle.color}
          >
            <animate
              attributeName="r"
              values="4;8;4"
              dur="1.5s"
              repeatCount="indefinite"
              begin={`${i * 0.1}s`}
            />
            <animate
              attributeName="opacity"
              values="1;0.5;1"
              dur="1.5s"
              repeatCount="indefinite"
              begin={`${i * 0.1}s`}
            />
          </circle>
        ))}
      </svg>
    </div>
  )
}

function PaletteIllustration({ accent, secondary }: { accent: string; secondary: string }) {
  return (
    <div className="relative w-64 h-64">
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-20"
        style={{ background: `radial-gradient(circle, ${accent}, transparent)` }}
      />

      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id="palette-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#faf5f0" />
            <stop offset="100%" stopColor="#f0e6d8" />
          </linearGradient>
        </defs>

        {/* Artist palette shape */}
        <ellipse cx="100" cy="105" rx="70" ry="60" fill="url(#palette-grad)" />

        {/* Thumb hole */}
        <ellipse cx="60" cy="120" rx="15" ry="12" fill="#f9f4ef" stroke="#e0d5c8" strokeWidth="2" />

        {/* Paint blobs */}
        {[
          { cx: 85, cy: 65, r: 14, color: "#E63946" },
          { cx: 115, cy: 60, r: 12, color: "#F4A261" },
          { cx: 140, cy: 75, r: 13, color: "#E9C46A" },
          { cx: 150, cy: 100, r: 11, color: "#2A9D8F" },
          { cx: 140, cy: 125, r: 12, color: "#264653" },
          { cx: 115, cy: 140, r: 10, color: "#9B5DE5" },
        ].map((blob, i) => (
          <circle key={i} cx={blob.cx} cy={blob.cy} r={blob.r} fill={blob.color}>
            <animate
              attributeName="r"
              values={`${blob.r};${blob.r + 2};${blob.r}`}
              dur="2s"
              repeatCount="indefinite"
              begin={`${i * 0.3}s`}
            />
          </circle>
        ))}

        {/* Paint brush */}
        <g className="animate-float" style={{ transformOrigin: "center" }}>
          {/* Brush handle */}
          <rect x="155" y="30" width="8" height="50" rx="2" fill={accent} transform="rotate(45 159 55)" />
          {/* Brush ferrule */}
          <rect x="148" y="70" width="14" height="10" rx="1" fill="#c0c0c0" transform="rotate(45 155 75)" />
          {/* Brush bristles */}
          <ellipse cx="145" cy="88" rx="8" ry="12" fill={secondary} transform="rotate(45 145 88)" />
        </g>

        {/* Color swatches floating */}
        {[
          { x: 20, y: 50, color: "#E63946", delay: "0s" },
          { x: 170, y: 60, color: "#2A9D8F", delay: "0.5s" },
          { x: 30, y: 150, color: "#F4A261", delay: "1s" },
        ].map((swatch, i) => (
          <g key={i} style={{ animation: "float 4s ease-in-out infinite", animationDelay: swatch.delay }}>
            <rect x={swatch.x} y={swatch.y} width="20" height="25" rx="3" fill="white" />
            <rect x={swatch.x + 2} y={swatch.y + 2} width="16" height="12" rx="1" fill={swatch.color} />
          </g>
        ))}
      </svg>
    </div>
  )
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  const slide = slides[currentSlide]

  const renderIllustration = () => {
    switch (slide.illustration) {
      case "eye":
        return <EyeIllustration accent={slide.accent} secondary={slide.secondary} />
      case "camera":
        return <CameraIllustration accent={slide.accent} secondary={slide.secondary} />
      case "touch":
        return <TouchIllustration accent={slide.accent} secondary={slide.secondary} />
      case "palette":
        return <PaletteIllustration accent={slide.accent} secondary={slide.secondary} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20 animate-blob transition-colors duration-1000"
          style={{ backgroundColor: slide.accent }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-15 animate-blob transition-colors duration-1000"
          style={{ backgroundColor: slide.secondary, animationDelay: "2s" }}
        />
      </div>

      {/* Skip button */}
      <div className="relative z-10 flex justify-end p-6">
        <button
          onClick={handleSkip}
          className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium tracking-wide"
        >
          Skip
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
        {/* Illustration */}
        <div
          className="mb-12 transition-all duration-500 ease-out"
          key={currentSlide}
          style={{ animation: "fadeSlideUp 0.6s ease-out" }}
        >
          {renderIllustration()}
        </div>

        {/* Text content */}
        <div
          className="text-center max-w-sm space-y-4"
          key={`text-${currentSlide}`}
          style={{ animation: "fadeSlideUp 0.6s ease-out 0.1s both" }}
        >
          <h2 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-foreground leading-tight">
            {slide.title}
            <br />
            <span className="italic" style={{ color: slide.accent }}>
              {slide.subtitle}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed font-light">{slide.description}</p>
        </div>
      </div>

      {/* Bottom section */}
      <div className="relative z-10 px-8 pb-12 space-y-8">
        {/* Progress dots */}
        <div className="flex justify-center gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className="relative h-2 rounded-full transition-all duration-500 overflow-hidden"
              style={{
                width: index === currentSlide ? "2rem" : "0.5rem",
                backgroundColor: index === currentSlide ? slide.accent : "var(--muted)",
              }}
            >
              {index === currentSlide && (
                <div
                  className="absolute inset-0 opacity-50"
                  style={{
                    background: `linear-gradient(90deg, transparent, white, transparent)`,
                    animation: "shimmer 2s infinite",
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Action button */}
        <Button
          onClick={handleNext}
          size="lg"
          className="w-full h-16 text-lg font-medium rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
          style={{
            backgroundColor: slide.accent,
            color: "white",
            boxShadow: `0 10px 40px -10px ${slide.accent}`,
          }}
        >
          {currentSlide === slides.length - 1 ? (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Start Exploring
            </>
          ) : (
            <>
              Continue
              <ChevronRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  )
}
