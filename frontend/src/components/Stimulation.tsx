import subwayGif from "../assets/subway.gif";

export default function Stimulation({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center">
      <div className="w-70 h-screen fixed left-0">
        <img src={subwayGif} alt="Subway Surfers" className="w-full h-full object-cover" />
      </div>
      {children}
      <div className="w-70 h-screen fixed right-0">
        <img src={subwayGif} alt="Subway Surfers" className="w-full h-full object-cover" />
      </div>
    </div>
  )
}