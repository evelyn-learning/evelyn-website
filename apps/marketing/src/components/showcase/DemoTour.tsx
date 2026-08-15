'use client';

import { useState, useEffect, useContext, useRef } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles, MessageCircle, Users, Phone } from 'lucide-react';
import { SiteContext } from '@/app/showcase/[slug]/ShowcaseLayoutClient';

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  targetSelector?: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  arrowPosition?: 'top' | 'bottom' | 'left' | 'right' | 'none';
  offset?: { x: number; y: number };
}

export function DemoTour() {
  const site = useContext(SiteContext);
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTour, setHasSeenTour] = useState(true);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const steps: TourStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Your Demo! 👋',
      description: `This is a preview of what a modern website could look like for ${site?.businessName || 'your business'}. Take a quick tour to see what's included.`,
      icon: <Sparkles className="w-6 h-6 text-purple-500" />,
      position: 'top-right',
      arrowPosition: 'none',
      offset: { x: 0, y: 0 },
    },
    {
      id: 'chat',
      title: 'AI Chat Assistant',
      description: 'Click the chat bubble to try the AI assistant. It can answer questions about your services, just like a real team member would.',
      icon: <MessageCircle className="w-6 h-6 text-blue-500" />,
      targetSelector: '[data-tour="chat-widget"]',
      position: 'bottom-right',
      arrowPosition: 'right',
      offset: { x: 0, y: 0 },
    },
    {
      id: 'staff',
      title: 'Staff Portal',
      description: 'Click "Staff Login" to access AI tools like test generators, homework helpers, and essay scoring - designed for your team.',
      icon: <Users className="w-6 h-6 text-emerald-500" />,
      targetSelector: '[data-tour="staff-login"]',
      position: 'top-right',
      arrowPosition: 'top',
      offset: { x: 0, y: 0 },
    },
    {
      id: 'contact',
      title: 'Ready to Launch?',
      description: 'If you like what you see, click "Contact Us" to discuss launching this on your own domain. No obligation!',
      icon: <Phone className="w-6 h-6 text-orange-500" />,
      targetSelector: '[data-tour="contact-button"]',
      position: 'top-right',
      arrowPosition: 'bottom',
      offset: { x: 0, y: 0 },
    },
  ];

  useEffect(() => {
    if (!site) return;

    const tourKey = `demo_tour_seen_${site.slug}`;
    const seen = localStorage.getItem(tourKey);

    if (!seen) {
      const timer = setTimeout(() => {
        setHasSeenTour(false);
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [site]);

  // Update target position when step changes or window resizes
  useEffect(() => {
    if (!isVisible) return;

    const updateTargetRect = () => {
      const step = steps[currentStep];
      if (step.targetSelector) {
        const target = document.querySelector(step.targetSelector);
        if (target) {
          setTargetRect(target.getBoundingClientRect());
        } else {
          setTargetRect(null);
        }
      } else {
        setTargetRect(null);
      }
    };

    // Initial update
    updateTargetRect();

    // Update on window resize and scroll
    window.addEventListener('resize', updateTargetRect);
    window.addEventListener('scroll', updateTargetRect, true);

    return () => {
      window.removeEventListener('resize', updateTargetRect);
      window.removeEventListener('scroll', updateTargetRect, true);
    };
  }, [currentStep, isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    if (site) {
      localStorage.setItem(`demo_tour_seen_${site.slug}`, 'true');
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!site || hasSeenTour || !isVisible) return null;

  const step = steps[currentStep];

  // Calculate card position based on target element and arrow direction
  const getCardStyle = (): React.CSSProperties => {
    const cardWidth = 360;
    const cardHeight = 220; // Approximate height
    const padding = 16;
    const arrowOffset = 16; // Gap for arrow
    const offset = step.offset || { x: 0, y: 0 };

    if (targetRect) {
      let top: number | undefined;
      let left: number | undefined;
      let right: number | undefined;
      let bottom: number | undefined;

      // Position based on arrow direction (arrow points TO target, card is on opposite side)
      switch (step.arrowPosition) {
        case 'top':
          // Card below target, arrow points up to target
          top = targetRect.bottom + arrowOffset + offset.y;
          // Center horizontally relative to target, or align to right edge
          left = Math.max(padding, Math.min(
            targetRect.left + (targetRect.width / 2) - (cardWidth / 2) + offset.x,
            window.innerWidth - cardWidth - padding
          ));
          break;
        case 'bottom':
          // Card above target, arrow points down to target
          top = targetRect.top - cardHeight - arrowOffset + offset.y;
          left = Math.max(padding, Math.min(
            targetRect.left + (targetRect.width / 2) - (cardWidth / 2) + offset.x,
            window.innerWidth - cardWidth - padding
          ));
          break;
        case 'left':
          // Card to right of target, arrow points left to target
          top = targetRect.top + (targetRect.height / 2) - (cardHeight / 2) + offset.y;
          left = targetRect.right + arrowOffset + offset.x;
          break;
        case 'right':
          // Card to left of target, arrow points right to target
          top = targetRect.top + (targetRect.height / 2) - (cardHeight / 2) + offset.y;
          right = window.innerWidth - targetRect.left + arrowOffset - offset.x;
          break;
        default:
          // No arrow, position below
          top = targetRect.bottom + arrowOffset + offset.y;
          left = Math.max(padding, targetRect.left + offset.x);
      }

      // Ensure card stays within viewport
      if (top !== undefined && top < padding) top = padding;
      if (top !== undefined && top + cardHeight > window.innerHeight - padding) {
        top = window.innerHeight - cardHeight - padding;
      }
      if (left !== undefined && left + cardWidth > window.innerWidth - padding) {
        left = window.innerWidth - cardWidth - padding;
      }
      if (left !== undefined && left < padding) left = padding;

      return {
        position: 'fixed',
        ...(top !== undefined && { top: `${top}px` }),
        ...(left !== undefined && { left: `${left}px` }),
        ...(right !== undefined && { right: `${right}px` }),
        ...(bottom !== undefined && { bottom: `${bottom}px` }),
        zIndex: 201,
      };
    }

    // Default positions when no target (welcome step)
    switch (step.position) {
      case 'top-right':
        return {
          position: 'fixed',
          top: '140px', // Below demo banner and header
          right: '24px',
          zIndex: 201,
        };
      case 'bottom-right':
        return {
          position: 'fixed',
          bottom: '100px',
          right: '24px',
          zIndex: 201,
        };
      case 'center':
        return {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 201,
        };
      default:
        return {
          position: 'fixed',
          top: '140px',
          right: '24px',
          zIndex: 201,
        };
    }
  };

  // Render arrow pointing to target
  const renderArrow = () => {
    if (step.arrowPosition === 'none' || !step.arrowPosition || !targetRect) return null;

    const arrowSize = 12;
    const arrowStyle: React.CSSProperties = {
      position: 'absolute',
      width: 0,
      height: 0,
    };

    // Calculate arrow position to point toward target center
    switch (step.arrowPosition) {
      case 'top':
        // Arrow points UP to target (card is below target)
        return (
          <div
            style={{
              ...arrowStyle,
              top: `-${arrowSize}px`,
              left: '50%',
              transform: 'translateX(-50%)',
              borderLeft: `${arrowSize}px solid transparent`,
              borderRight: `${arrowSize}px solid transparent`,
              borderBottom: `${arrowSize}px solid white`,
            }}
          />
        );
      case 'right':
        // Arrow points RIGHT to target (card is to left of target)
        return (
          <div
            style={{
              ...arrowStyle,
              right: `-${arrowSize}px`,
              top: '50%',
              transform: 'translateY(-50%)',
              borderTop: `${arrowSize}px solid transparent`,
              borderBottom: `${arrowSize}px solid transparent`,
              borderLeft: `${arrowSize}px solid white`,
            }}
          />
        );
      case 'bottom':
        // Arrow points DOWN to target (card is above target)
        return (
          <div
            style={{
              ...arrowStyle,
              bottom: `-${arrowSize}px`,
              left: '50%',
              transform: 'translateX(-50%)',
              borderLeft: `${arrowSize}px solid transparent`,
              borderRight: `${arrowSize}px solid transparent`,
              borderTop: `${arrowSize}px solid white`,
            }}
          />
        );
      case 'left':
        // Arrow points LEFT to target (card is to right of target)
        return (
          <div
            style={{
              ...arrowStyle,
              left: `-${arrowSize}px`,
              top: '50%',
              transform: 'translateY(-50%)',
              borderTop: `${arrowSize}px solid transparent`,
              borderBottom: `${arrowSize}px solid transparent`,
              borderRight: `${arrowSize}px solid white`,
            }}
          />
        );
      default:
        return null;
    }
  };

  // Highlight target element
  const renderHighlight = () => {
    if (!targetRect) return null;

    return (
      <div
        className="fixed pointer-events-none z-[199] rounded-lg ring-4 ring-purple-400 ring-opacity-75 animate-pulse"
        style={{
          top: targetRect.top - 4,
          left: targetRect.left - 4,
          width: targetRect.width + 8,
          height: targetRect.height + 8,
        }}
      />
    );
  };

  return (
    <>
      {/* Semi-transparent backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-[198] transition-opacity"
        onClick={handleClose}
      />

      {/* Target highlight */}
      {renderHighlight()}

      {/* Tour Card */}
      <div
        ref={cardRef}
        style={getCardStyle()}
        className="w-[360px] max-w-[calc(100vw-2rem)] animate-in fade-in duration-300"
      >
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Arrow */}
          {renderArrow()}

          {/* Progress bar */}
          <div className="h-1 bg-gray-100">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          <div className="p-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
                  {step.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-xs text-gray-500">
                    Step {currentStep + 1} of {steps.length}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {step.description}
            </p>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleClose}
                className="text-sm text-gray-500 hover:text-gray-700 transition"
              >
                Skip tour
              </button>

              <div className="flex items-center gap-2">
                {currentStep > 0 && (
                  <button
                    onClick={handlePrev}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1 px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg hover:from-purple-600 hover:to-blue-600 transition"
                >
                  {currentStep === steps.length - 1 ? 'Got it!' : 'Next'}
                  {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Decorative dots */}
          <div className="flex justify-center gap-1.5 pb-4">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentStep
                    ? 'w-4 bg-purple-500'
                    : idx < currentStep
                    ? 'bg-purple-300'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
