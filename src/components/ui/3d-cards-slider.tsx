"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

export type CardData = {
  id: string | number;
  title: string;
  subtitle: string;
  description: string;
  imageUrl?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export type ParallaxCardCarouselProps = {
  cards?: CardData[];
  /** Max cards shown at once around the active one; the rest stay reachable via prev/next/dots/autoplay. Defaults to showing all. */
  visibleCount?: number;
  autoplaySpeed?: number;
  enableAutoplay?: boolean;
  cardWidth?: number;
  cardHeight?: number;
  gap?: number;
  perspective?: number;
  maxRotation?: number;
  parallaxFactor?: number;
  backgroundColor?: string;
};

export function ParallaxCardCarousel({
  cards = [],
  visibleCount,
  autoplaySpeed = 5000,
  enableAutoplay = true,
  cardWidth = 320,
  cardHeight = 450,
  gap = 30,
  perspective = 1200,
  maxRotation = 25,
  backgroundColor = "bg-transparent",
}: ParallaxCardCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(enableAutoplay);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartRef = useRef(0);

  const goToNext = () => {
    if (cards.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % cards.length);
  };

  const goToPrev = () => {
    if (cards.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const goToIndex = (index: number) => setActiveIndex(index);

  // Keep the active index in range when the card count changes (e.g. responsive resize).
  const [prevCardsLength, setPrevCardsLength] = useState(cards.length);
  if (cards.length !== prevCardsLength) {
    setPrevCardsLength(cards.length);
    if (activeIndex >= cards.length) setActiveIndex(0);
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return;

    const rect = carouselRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);

    setMousePosition({ x, y });
  };

  useEffect(() => {
    if (isAutoPlaying && !isHovered && cards.length > 0) {
      autoplayTimerRef.current = setTimeout(() => {
        goToNext();
      }, autoplaySpeed);
    }

    return () => {
      if (autoplayTimerRef.current) clearTimeout(autoplayTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: advance on index / play state changes
  }, [activeIndex, isAutoPlaying, isHovered, autoplaySpeed, cards.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards.length]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStartRef.current - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext();
      else goToPrev();
    }
  };

  // Signed offset from the active card: negative = before it, positive = after it.
  const getAdjustedDistance = (index: number) => {
    const distance = (index - activeIndex + cards.length) % cards.length;
    return distance > cards.length / 2 ? distance - cards.length : distance;
  };

  // How many cards before/after the active one stay rendered — the rest only
  // appear once paging brings them into this window.
  const windowRadius = (() => {
    if (!visibleCount || visibleCount >= cards.length) {
      return { before: cards.length, after: cards.length };
    }
    const before = Math.ceil((visibleCount - 1) / 2);
    const after = Math.floor((visibleCount - 1) / 2);
    return { before, after };
  })();

  const isInWindow = (index: number) => {
    const d = getAdjustedDistance(index);
    return d >= -windowRadius.before && d <= windowRadius.after;
  };

  const getCardStyle = (index: number) => {
    const isActive = index === activeIndex;
    const adjustedDistance = getAdjustedDistance(index);

    const x = adjustedDistance * (cardWidth + gap);
    const scale = isActive ? 1 : 0.85 - Math.min(Math.abs(adjustedDistance), 2) * 0.05;
    const zIndex = cards.length - Math.abs(adjustedDistance);
    const opacity = 1 - Math.min(Math.abs(adjustedDistance) * 0.25, 0.6);

    let rotateY = 0;
    let rotateX = 0;
    let translateZ = 0;

    if (isActive && isHovered) {
      rotateY = -mousePosition.x * maxRotation;
      rotateX = mousePosition.y * (maxRotation * 0.5);
      translateZ = 50;
    }

    return {
      x,
      scale,
      zIndex,
      opacity,
      rotateY,
      rotateX,
      translateZ,
    };
  };

  const renderCardLayers = (card: CardData, index: number) => {
    const isActive = index === activeIndex;

    return (
      <div className="relative h-full w-full">
        {/* Background Layer */}
        <motion.div
          className="absolute inset-0 overflow-hidden rounded-2xl bg-surface"
          style={{
            translateZ: isActive && isHovered ? -20 : 0,
            translateX: isActive && isHovered ? -mousePosition.x * 10 : 0,
            translateY: isActive && isHovered ? -mousePosition.y * 10 : 0,
          }}
        />

        {/* Content Layer */}
        <motion.div
          className="absolute inset-0 z-10 flex flex-col justify-between p-6 text-center sm:text-left"
          style={{
            translateZ: isActive && isHovered ? 30 : 0,
            translateX: isActive && isHovered ? mousePosition.x * 15 : 0,
            translateY: isActive && isHovered ? mousePosition.y * 15 : 0,
          }}
        >
          <div>
            <h3 className="mb-1 text-xl font-bold text-fg">{card.title}</h3>
            <p className="text-sm text-muted">{card.subtitle}</p>
          </div>

          {card.imageUrl && (
            <motion.div
              className="my-4 overflow-hidden rounded-lg"
              style={{
                translateZ: isActive && isHovered ? 60 : 0,
                translateX: isActive && isHovered ? mousePosition.x * 25 : 0,
                translateY: isActive && isHovered ? mousePosition.y * 25 : 0,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- remote Unsplash URLs in carousel */}
              <img
                src={card.imageUrl}
                alt={card.title}
                className="h-48 w-full object-cover"
              />
            </motion.div>
          )}

          <div>
            <p className="mb-4 text-sm text-muted">{card.description}</p>
            <button
              type="button"
              className="rounded-lg bg-accent px-4 py-2 text-white transition-all duration-300 hover:scale-105 hover:opacity-90"
              onClick={(e) => {
                e.stopPropagation();
                card.onAction?.();
              }}
            >
              {card.actionLabel || "Learn More"}
            </button>
          </div>
        </motion.div>

        {/* Glass Reflection Effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-5"
          style={{
            background:
              isActive && isHovered
                ? `linear-gradient(
                  ${135 + mousePosition.y * 40}deg, 
                  rgba(255,255,255,0.1) 0%, 
                  rgba(255,255,255,0.15) 50%, 
                  rgba(255,255,255,0) 50.1%
                )`
                : "none",
            translateZ: isActive && isHovered ? 70 : 0,
          }}
        />

        {/* Card border */}
        <motion.div
          className="absolute inset-0 rounded-2xl border border-line"
          style={{
            boxShadow:
              isActive && isHovered
                ? `0 20px 25px -5px rgba(0, 0, 0, 0.4), 
                 0 10px 10px -5px rgba(0, 0, 0, 0.2),
                 inset 0 0 0 1px rgba(255, 255, 255, 0.1)`
                : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            translateZ: 10,
          }}
        />
      </div>
    );
  };

  if (cards.length === 0) return null;

  return (
    <div className={`flex w-full flex-col items-center justify-center py-4 ${backgroundColor}`}>
      <div
        ref={carouselRef}
        className="relative mx-auto w-full max-w-6xl"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label="Card Carousel"
        role="region"
        style={{
          perspective: `${perspective}px`,
          height: `${cardHeight + 100}px`,
        }}
      >
        <div className="relative flex h-full items-center justify-center">
          {cards.map((card, index) => {
            if (!isInWindow(index)) return null;
            return (
              <motion.div
                key={card.id}
                className="absolute cursor-pointer rounded-2xl shadow-xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={getCardStyle(index)}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  mass: 1,
                }}
                onClick={() => goToIndex(index)}
                style={{
                  width: `${cardWidth}px`,
                  height: `${cardHeight}px`,
                  transformStyle: "preserve-3d",
                }}
                whileHover={{ scale: index === activeIndex ? 1.02 : undefined }}
                role="button"
                tabIndex={index === activeIndex ? 0 : -1}
                aria-label={`Card ${index + 1}: ${card.title}`}
                aria-current={index === activeIndex ? "true" : "false"}
              >
                {renderCardLayers(card, index)}
              </motion.div>
            );
          })}
        </div>

        <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-4 py-6">
          <button
            type="button"
            className="rounded-full bg-accent-soft p-3 text-fg backdrop-blur-md transition-colors duration-300 hover:bg-accent/20"
            onClick={goToPrev}
            aria-label="Previous card"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="flex items-center gap-2">
            {cards.map((_, index) => (
              <button
                type="button"
                key={index}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? "w-6 bg-accent"
                    : "w-2.5 bg-faint hover:bg-muted"
                }`}
                onClick={() => goToIndex(index)}
                aria-label={`Go to card ${index + 1}`}
                aria-current={activeIndex === index ? "true" : "false"}
              />
            ))}
          </div>

          <button
            type="button"
            className="rounded-full bg-accent-soft p-3 text-fg backdrop-blur-md transition-colors duration-300 hover:bg-accent/20"
            onClick={goToNext}
            aria-label="Next card"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <button
            type="button"
            className={`rounded-full p-3 text-fg backdrop-blur-md transition-colors duration-300 ${
              isAutoPlaying
                ? "bg-accent/20"
                : "bg-accent-soft hover:bg-accent/20"
            }`}
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            aria-label={isAutoPlaying ? "Pause autoplay" : "Start autoplay"}
            title={isAutoPlaying ? "Pause" : "Play"}
          >
            {isAutoPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ParallaxCardCarousel;
