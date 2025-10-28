import React, { useState, useMemo, useRef, useEffect } from 'react';
import Davido from "../assets/Davido.jpg";
import DavidoCover from "../assets/Davido-Timeless.jpg";
import Burna from "../assets/Burna-Boy.jpg";
import BurnaCover from "../assets/Burna-Boy-Last-Last.jpg";
import Rema from "../assets/Rema.jpg";
import RemaCover from "../assets/Rema-Calm-Down-Artwork.jpg";
import Shallipopi from "../assets/shallipopi.jpg";
import ShallipopiCover from "../assets/Shallipopi-Laho.jpg";
import Stromae from "../assets/stromae_cover.jpg";
import StromaeCover from "../assets/stromae_album.jpg";
import Repeat from "../assets/repeat-sharp.svg";
import BurnaSong from "../assets/music/burna_boy.mp3";
import DavidoSong from "../assets/music/feel_davido.mp3";
import ShallipopiSong from "../assets/music/laho_shallipopi.mp3";
import RemaSong from "../assets/music/rema_calm_down.mp3";
import StromaeSong from "../assets/music/stromae.mp3";

const tracks = [
  
  { 
    rank: "02", 
    title: 'Tous Les Mêmes', 
    artist: 'Stromae', 
    image: Stromae,
    cover: StromaeCover,
    src: StromaeSong,
    time: '3:15', 
    Date: "April 3, 2020"
  },
  { 
    rank: "03", 
    title: 'Laho', 
    artist: 'Shallipopi', 
    image: Shallipopi,
    cover: ShallipopiCover,
    src: ShallipopiSong,
    time: '2:24', 
    Date: "February 21, 2025"
  },
  { 
    rank: "04", 
    title: 'Last Last', 
    artist: 'Burna Boy', 
    image: Burna,
    cover: BurnaCover,
    src: BurnaSong,
    time: '2:52', 
    Date: "May 13, 2022"
  },
  { 
    rank: "05", 
    title: 'Calm Down', 
    artist: 'Rema', 
    image: Rema,
    cover: RemaCover,
    src: RemaSong,
    time: '3:39', 
    Date: "February 11, 2022"
  },
  { 
    rank: "06", 
    title: 'Feel', 
    artist: 'Davido', 
    image: Davido,
    cover: DavidoCover,
    src: DavidoSong,
    time: '3:39', 
    Date: "March 31, 2023"
  },
];

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString();
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};
const HeroSection = () => {

    const [currentIndex, setCurrentIndex] = useState(0); // which track is selected
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoop, setIsLoop] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const audioRef = useRef(null);
    const progressRef = useRef(null);

    // Initialize audio element
    useEffect(() => {
        audioRef.current = new Audio(tracks[currentIndex].src);
        audioRef.current.preload = "metadata";

        const audio = audioRef.current;

        // metadata loaded -> get duration
        const onLoaded = () => {
        setDuration(audio.duration || 0);
        };

        const onTimeUpdate = () => {
        setCurrentTime(audio.currentTime || 0);
        };

        const onEnded = () => {
        if (isLoop) {
            // if loop is active, replay current track
            audio.currentTime = 0;
            audio.play();
        } else {
            handleNext();
        }
        };

        audio.addEventListener("loadedmetadata", onLoaded);
        audio.addEventListener("timeupdate", onTimeUpdate);
        audio.addEventListener("ended", onEnded);

        // if we should auto-play when switching track:
        if (isPlaying) {
        audio.play().catch(() => {
            /* autoplay blocked on some browsers — leave state as is */
        });
        }

        return () => {
        // cleanup listeners and pause previous audio to avoid multiple players
        audio.pause();
        audio.removeEventListener("loadedmetadata", onLoaded);
        audio.removeEventListener("timeupdate", onTimeUpdate);
        audio.removeEventListener("ended", onEnded);
        audioRef.current.src = "";
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex]); // re-run when currentIndex changes

    // Keep loop flag in sync with the audio element
    useEffect(() => {
        if (audioRef.current) audioRef.current.loop = isLoop;
    }, [isLoop]);

    // Play / Pause toggle
    const togglePlay = async () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
        } else {
        try {
            await audio.play();
            setIsPlaying(true);
        } catch (err) {
            // autoplay may be disallowed by browser; still set playing state only if actually playing
            console.warn("Play failed", err);
        }
        }
    };

    // Stop: pause and reset to start
    const handleStop = () => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
        setCurrentTime(0);
    };

    // Prev action: if playback > 3s restart track, otherwise go to previous
    const handlePrev = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (audio.currentTime > 3) {
        audio.currentTime = 0;
        } else {
        const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
        setCurrentIndex(prevIndex);
        setIsPlaying(true);
        }
    };

    // Next action
    const handleNext = () => {
        const nextIndex = (currentIndex + 1) % tracks.length;
        setCurrentIndex(nextIndex);
        setIsPlaying(true);
    };
    

    // clicking a track (or its image) starts it
    const handleSelectTrack = (index) => {
        if (index === currentIndex) {
        // toggle play if selecting currently selected track
        setIsPlaying(true);
        const audio = audioRef.current;
        if (audio) audio.play().catch(() => {});
        } else {
        setCurrentIndex(index);
        setIsPlaying(true);
        }
    };

    // Seeking by clicking the progress bar
    const handleSeek = (e) => {
        const bar = progressRef.current;
        const audio = audioRef.current;
        if (!bar || !audio) return;
        const rect = bar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = clickX / rect.width;
        const newTime = percent * duration;
        audio.currentTime = newTime;
        setCurrentTime(newTime);
    };

    // convert track time string "3:15" -> seconds for display fallback if metadata missing
    const parseTimeToSec = (timeString) => {
        if (!timeString) return 0;
        const [m, s] = timeString.split(":").map(Number);
        return (m || 0) * 60 + (s || 0);
    };

    // computed progress percent
    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : (currentTime / (parseTimeToSec(tracks[currentIndex].time) || 1)) * 100;

    return (
        <section className="w-full mt-2">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* LEFT: Track list */}
                <aside className="lg:col-span-3">
                <div className="space-y-6 mt-10">
                    <div className="space-y-1 mb-15">
                    <p className="text-sm font-bold border-b-4 border-[#F43A15] inline-block">The HOT 100</p>
                    <p className="text-sm font-bold">BILLBOARD 200</p>
                    <p className="text-sm font-bold">ARTIST 100</p>
                    </div>

                    <div className="space-y-4 mt-4">
                    {tracks.map((t, idx) => {
                        const isActive = idx === currentIndex;
                        return (
                        <div
                            key={t.rank}
                            className={`flex items-center gap-3 cursor-pointer ${isActive && isPlaying ? "opacity-100 border-l-4 border-[#F43A15] pl-1.5 bg-gradient-to-r from-[#f5ddd8] to-white" : "opacity-90 hover:opacity-100"}`}
                            onClick={() => handleSelectTrack(idx)}
                        >
                            <p className="font-bold text-lg">{t.rank}</p>

                            <div
                            className="w-12 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0"
                            onClick={() => handleSelectTrack(idx)}
                            >
                                <img src={t.image} alt={t.title} className="object-cover w-full h-full" />
                            </div>

                            <div className="flex items-center gap-3">
                                <div onClick={(e) => { e.stopPropagation(); handleSelectTrack(idx); }}>
                                    {/* play icon; show pause icon if active & playing */}
                                    {isActive && isPlaying ? (
                                    <i className="fa-solid fa-pause text-[#F43A15]"></i>
                                    ) : (
                                    <i className="fa-solid fa-play text-[#F43A15]"></i>
                                    )}
                                </div>

                                <div className="text-base font-bold">{t.title}</div>
                            </div>
                        </div>
                        );
                    })}
                    </div>

                    <div className=" billboard font-bold mt-30 hidden lg:block">2020 Billboard.</div>
                </div>
                </aside>

                {/* CENTER: hero main */}
                <main className="lg:col-span-6 flex flex-col items-center">
                {/* Centered artist name - updates with current track */}
                <h1 className="font-bold text-base text-center">{tracks[currentIndex].artist.toUpperCase()}</h1>

                {/* circle with arrows */}
                <div className="mt-6 relative w-72 h-72 sm:w-[20rem] sm:h-[20rem] 2xl:w-[30rem] lg:h-[30rem]">
                    <button
                    aria-label="prev"
                    className="arrowButton absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 rounded-lg bg-white p-3 hover:bg-gray-100 shadow-lg transition"
                    onClick={handlePrev}
                    >
                    <i className="fa-solid fa-arrow-left text-[#F43A15] text-sm sm:text-xl"></i>
                    </button>

                    <div className="w-full h-full rounded-full overflow-hidden shadow-2xl">
                    <img src={tracks[currentIndex].image} alt={tracks[currentIndex].title} className="object-cover w-full h-full" />
                    </div>

                    <button
                    aria-label="next"
                    className="arrowButton absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 rounded-lg bg-white p-3 hover:bg-gray-100 shadow-lg transition"
                    onClick={handleNext}
                    >
                    <i className="fa-solid fa-arrow-right text-[#F43A15] text-sm sm:text-xl"></i>
                    </button>
                </div>

                {/* Progress bar and time */}
                <div className="w-full max-w-2xl mt-10">
                    <div className="flex items-center gap-3">
                    <div className="text-xs sm:text-sm">{formatTime(Math.floor(currentTime))}</div>

                    <div
                        ref={progressRef}
                        className="flex-1 h-2 bg-gray-200 rounded-full mt-2 cursor-pointer"
                        onClick={handleSeek}
                        style={{ position: "relative" }}
                    >
                        <div
                        className="h-full rounded-full"
                        style={{
                            width: `${Math.max(0, Math.min(100, progressPercent))}%`,
                            background: "linear-gradient(90deg, #F43A15, #FF8A4B)",
                        }}
                        />
                    </div>

                    <div className="text-xs sm:text-sm">{formatTime(Math.floor(duration) || parseTimeToSec(tracks[currentIndex].time))}</div>
                    </div>

                    {/* Controls */}
                    <div className="mt-4 flex items-center justify-between w-full">
                        <div className="flex items-center justify-center gap-4 sm:gap-6 w-full">
                            {/* loop icon */}
                            <button onClick={() => setIsLoop(!isLoop)} className={`p-2 ${isLoop ? "bg-[#b0a9a8] rounded-full" : ""}`}>
                            <img src={Repeat} alt="loop" className="w-7 h-7" />
                            </button>

                            {/* backward */}
                            <button onClick={handlePrev} className="p-2 w-10 h-10 rounded-full bg-black hover:bg-gray-800">
                            <i className="fa-solid fa-backward text-white"></i>
                            </button>

                            {/* stop/play/pause */}
                            <button
                            onClick={togglePlay}
                            className="p-2 w-12 h-12 rounded-full bg-black hover:bg-gray-800 flex items-center justify-center"
                            >
                            {isPlaying ? <i className="fa-solid fa-pause text-white"></i> : <i className="fa-solid fa-play text-white"></i>}
                            </button>

                            {/* stop */}
                            <button onClick={handleStop} className="p-2 w-10 h-10 rounded-full bg-black hover:bg-gray-800">
                            <i className="fa-solid fa-stop text-white"></i>
                            </button>

                            {/* forward */}
                            <button onClick={handleNext} className="p-2 w-10 h-10 rounded-full bg-black hover:bg-gray-800">
                            <i className="fa-solid fa-forward text-white"></i>
                            </button>

                            {/* share */}
                            <i className="fa-solid fa-share-nodes text-base sm:text-2xl"></i>
                        </div>

            
                    </div>
                </div>
                </main>

                {/* RIGHT: details */}
                <aside className="lg:col-span-3">
                <div className="space-y-6 mt-10 md:max-w-md md:mx-auto lg:max-w-full lg:mx-0">
                    <div className="w-full h-56 rounded-2xl overflow-hidden bg-gray-100">
                    <img src={tracks[currentIndex].cover} alt="artist large" className="object-cover w-full h-full" />
                    </div>

                    <div className="flex justify-between text-xs text-black font-bold sm:text-base">
                    <p className="track-date inline-block">Released {tracks[currentIndex].Date}</p>
                    <p className="track-time inline-block">Length {tracks[currentIndex].time}</p>
                    </div>

                    <div>
                        <h3 className="boxTitle text-xl font-bold mt-3">The Box - Roddy Rich ❤️</h3>
                        <p className="box-desc text-sm text-black mt-2">
                            WHENEVER YOU RECORD A SONG THAT SOMEONE ELSE WROTE, YOU NEED TO 
                            GET PERMISSION FROM THE COPYRIGHT HOLDERS.
                        </p>
                        
                        <div className="mt-7 flex gap-4 justify-between">
                            <button className="full-album px-8 py-2 bg-[#F43A15] text-white rounded-md font-bold hover:bg-transparent hover:border-2 hover:border-black hover:text-black">
                                Hear Full Album
                            </button>
                            <button className="more px-6 py-2 border-2 rounded-md font-bold hover:bg-[#F43A15] hover:text-white hover:border-transparent">More</button>
                        </div>
                    </div>

                    

                    <div className="follow hidden lg:flex items-center gap-3 justify-end text-sm mt-16">
                        <span className="uppercase text-xs sm:text-sm font-bold">FOLLOW US</span>
                        <div className="flex items-center gap-1.5">
                            <i className="fa-brands fa-facebook-f text-sm sm:text-lg"></i>
                            <i className="fa-brands fa-instagram text-sm sm:text-lg"></i>
                            <i className="fa-brands fa-twitter text-sm sm:text-lg"></i>
                        </div>
                    </div>

                    <div className='flex justify-between items-center mt-10 mb-5 lg:hidden'>
                        <div className="font-bold text-sm">2020 Billboard.</div>
                        <div className='flex items-center gap-3 text-xs'>
                            <span className='uppercase text-xs font-bold'>FOLLOW US</span>
                            <div className='flex items-center gap-1.5'>
                                <i className="fa-brands fa-facebook-f text-xs"></i>
                                <i className="fa-brands fa-instagram text-xs"></i>
                                <i className="fa-brands fa-twitter text-xs"></i>
                            </div>
                        </div>
                    </div>
                </div>
                </aside>
            </div>
        </section>
    
  )
}

export default HeroSection
