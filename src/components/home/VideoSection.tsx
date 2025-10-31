// src/components/home/VideoSection.tsx
'use client';

import { useRef, useState, useEffect } from 'react';

export default function VideoSection() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        if (videoRef.current) {
            const video = videoRef.current;
            
            const handleLoadedData = () => setIsLoading(false);
            const handleCanPlay = () => setIsLoading(false);
            const handleCanPlayThrough = () => setIsLoading(false);
            const handlePlaying = () => setIsPlaying(true);
            const handlePause = () => setIsPlaying(false);
            const handleError = () => {
                console.error('Video loading error');
                setIsLoading(false);
                setHasError(true);
            };

            video.addEventListener('loadeddata', handleLoadedData);
            video.addEventListener('canplay', handleCanPlay);
            video.addEventListener('canplaythrough', handleCanPlayThrough);
            video.addEventListener('playing', handlePlaying);
            video.addEventListener('pause', handlePause);
            video.addEventListener('error', handleError);

            // Fallback timeout - hide loading after 5 seconds
            const timeout = setTimeout(() => {
                console.warn('Video loading timeout - hiding spinner');
                setIsLoading(false);
            }, 5000);

            return () => {
                clearTimeout(timeout);
                video.removeEventListener('loadeddata', handleLoadedData);
                video.removeEventListener('canplay', handleCanPlay);
                video.removeEventListener('canplaythrough', handleCanPlayThrough);
                video.removeEventListener('playing', handlePlaying);
                video.removeEventListener('pause', handlePause);
                video.removeEventListener('error', handleError);
            };
        }
    }, []);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
        }
    };

    return (
        <section className="relative w-full h-[60vh] md:h-[70vh] lg:h-screen overflow-hidden group">
            {/* Video Container */}
            <div className="absolute inset-0 w-full h-full">
                {isLoading && (
                    <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
                        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover"
                    onLoadedData={() => setIsLoading(false)}
                    onCanPlay={() => setIsLoading(false)}
                    onError={() => {
                        setIsLoading(false);
                        setHasError(true);
                    }}
                >
                    <source src="/videos/hero-video.mp4" type="video/mp4" />
                    Вашият браузър не поддържа видео елемента.
                </video>
                
                {hasError && (
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                        <p className="text-white text-center px-4">
                            Видеото не можа да се зареди
                        </p>
                    </div>
                )}

                {/* Control Overlay */}
                <div className="absolute bottom-8 right-8 flex gap-3 z-20">
                    {/* Mute/Unmute Button */}
                    <button
                        onClick={toggleMute}
                        className="w-12 h-12 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg group-hover:opacity-100 opacity-0"
                        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                    >
                        {isMuted ? (
                            <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            </svg>
                        )}
                    </button>

                    {/* Play/Pause Button */}
                    <button
                        onClick={togglePlay}
                        className="w-12 h-12 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg group-hover:opacity-100 opacity-0"
                        aria-label={isPlaying ? 'Pause video' : 'Play video'}
                    >
                        {isPlaying ? (
                            <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </section>
    );
}

