import subwayGif from "../assets/subway.gif";
import minecraft from "../assets/minecraft.mp4";
import { useEffect } from "react";
import { useState } from "react";

export default function Stimulation({ children }: { children: React.ReactNode }) {

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className="flex justify-center">
        {children}
      </div>
    )
  }

  return (
    <div className="flex justify-center">
        <div className="w-70 h-screen fixed left-0">
          <img src={subwayGif} alt="Subway Surfers" className="w-full h-full object-cover" />
      </div>
      {children}
      <div className="w-70 h-screen fixed right-0">
        <video src={minecraft} autoPlay loop muted className="w-full h-full object-cover" />
      </div>
    </div>
  )
}