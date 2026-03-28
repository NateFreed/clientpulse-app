'use client';

import { useState, useEffect } from 'react';

export interface TutorialStep {
  title: string;
  description: string;
}

interface TutorialProps {
  appName: string;
  steps: TutorialStep[];
  accentColor?: string;
  storageKey?: string;
}

export default function Tutorial({ appName, steps, accentColor = 'bg-accent', storageKey }: TutorialProps) {
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const key = storageKey ?? `${appName.toLowerCase().replace(/\s+/g, '_')}_tutorial_seen`;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const seen = localStorage.getItem(key);
    if (!seen) {
      setVisible(true);
    }
  }, [key]);

  function dismiss() {
    localStorage.setItem(key, 'true');
    setVisible(false);
  }

  function next() {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      dismiss();
    }
  }

  function back() {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }

  if (!visible) return null;

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-muted hover:text-foreground transition-colors z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Progress bar */}
        <div className="h-1 bg-border">
          <div
            className={`h-full ${accentColor} transition-all duration-300`}
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="px-8 pt-8 pb-6">
          {/* Step indicator */}
          <div className="text-xs text-muted uppercase tracking-wider mb-1">
            {currentStep === 0 ? `Welcome to ${appName}` : `Step ${currentStep + 1} of ${steps.length}`}
          </div>

          <h2 className="text-xl font-bold text-foreground mb-3">
            {step.title}
          </h2>

          <p className="text-sm text-muted leading-relaxed mb-8">
            {step.description}
          </p>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            {/* Progress dots */}
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentStep
                      ? `${accentColor} shadow-sm`
                      : i < currentStep
                        ? `${accentColor} opacity-40`
                        : 'bg-border'
                  }`}
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              {currentStep > 0 && (
                <button
                  onClick={back}
                  className="px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
                >
                  Back
                </button>
              )}
              <button
                onClick={next}
                className={`px-5 py-2 ${accentColor} hover:opacity-90 rounded-xl text-sm font-semibold text-white transition-all`}
              >
                {isLast ? 'Get Started' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
