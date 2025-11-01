import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 1000);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 transition-opacity duration-1000 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }} />
      </div>

      <div className="relative flex flex-col items-center justify-center space-y-12 animate-fade-in">
        {/* Decorative rings */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-[spin_20s_linear_infinite]" />
          <div className="absolute inset-4 rounded-full border-2 border-secondary/30 animate-[spin_15s_linear_infinite_reverse]" />
          <div className="absolute inset-8 rounded-full border-2 border-accent/30 animate-[spin_10s_linear_infinite]" />
          
          {/* Center content */}
          <div className="relative z-10 text-center space-y-4">
            <div className="relative">
              <h1 className="text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent drop-shadow-2xl animate-scale-in">
                Vanshavali
              </h1>
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-2xl animate-pulse -z-10" />
            </div>
          </div>
        </div>

        {/* Tagline with animation */}
        <div className="text-center space-y-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <p className="text-xl font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Preserve Your Family Legacy
          </p>
          
          {/* Progress bar */}
          <div className="w-64 mx-auto space-y-2">
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">Loading your family tree...</p>
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-br from-primary to-secondary rounded-full animate-float opacity-40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${4 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
