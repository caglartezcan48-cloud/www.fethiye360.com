import { Header } from '@/components/fethiye/header'
import { Hero } from '@/components/fethiye/hero'
import { Footer } from '@/components/fethiye/footer'
import { Sun, Cloud, CloudRain, Thermometer, Wind, CloudSun, CloudLightning } from 'lucide-react'
import { getWeatherData, getWeatherStatus } from '@/lib/city-data'

export default async function WeatherPage() {
  const weatherData = await getWeatherData();

  if (!weatherData) {
    return (
      <div className="min-h-screen bg-[#0a192f] flex items-center justify-center text-white">
        Veri yüklenemedi.
      </div>
    );
  }

  const { current, daily } = weatherData;

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="w-16 h-16 text-yellow-500 drop-shadow-[0_0_20px_rgba(234,179,8,0.3)]" />;
    if (code >= 1 && code <= 3) return <CloudSun className="w-16 h-16 text-yellow-400" />;
    if (code >= 45 && code <= 48) return <Cloud className="w-16 h-16 text-slate-400" />;
    if (code >= 51 && code <= 67) return <CloudRain className="w-16 h-16 text-blue-400" />;
    if (code >= 80) return <CloudLightning className="w-16 h-16 text-purple-400" />;
    return <Sun className="w-16 h-16 text-yellow-500" />;
  };

  const getSmallIcon = (code: number) => {
    if (code === 0) return <Sun className="w-5 h-5 text-yellow-500" />;
    if (code >= 1 && code <= 3) return <CloudSun className="w-5 h-5 text-yellow-400" />;
    if (code >= 51) return <CloudRain className="w-5 h-5 text-blue-400" />;
    return <Cloud className="w-5 h-5 text-slate-400" />;
  };

  const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

  return (
    <main className="min-h-screen bg-[#0a192f]">
      <Header />
      <Hero />
      
      <div className="container mx-auto px-4 pb-20 -mt-20 relative z-20 flex justify-center">
        <div className="w-full max-w-md bg-[#112240]/90 backdrop-blur-xl rounded-[40px] border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-10 pt-4">
              <p className="text-[#64ffda] font-bold text-[10px] uppercase tracking-[0.2em] mb-2">Fethiye Hava Durumu</p>
              <div className="flex items-center justify-center gap-6">
                {getWeatherIcon(current.conditionCode)}
                <div className="text-7xl font-bold text-white tracking-tighter">{current.temp}°</div>
              </div>
              <p className="text-slate-400 text-sm mt-2 font-medium">{getWeatherStatus(current.conditionCode)}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-10">
              <div className="bg-white/5 rounded-3xl p-4 border border-white/5 flex items-center gap-3">
                <Thermometer className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-slate-500 text-[9px] uppercase font-bold">Deniz Suyu</p>
                  <p className="text-white font-bold text-sm">{current.seaTemp}°C</p>
                </div>
              </div>
              <div className="bg-white/5 rounded-3xl p-4 border border-white/5 flex items-center gap-3">
                <Wind className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-slate-500 text-[9px] uppercase font-bold">Rüzgar</p>
                  <p className="text-white font-bold text-sm">{current.windSpeed} km/s</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-[32px] p-6 border border-white/5">
              <div className="flex justify-between">
                {daily.slice(0, 5).map((f: any, i: number) => (
                  <div key={i} className="text-center">
                    <p className="text-slate-500 text-[10px] font-bold mb-3">
                      {days[new Date(f.date).getDay()]}
                    </p>
                    <div className="mb-2 flex justify-center">{getSmallIcon(f.conditionCode)}</div>
                    <p className="text-white font-bold text-sm">{f.maxTemp}°</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
