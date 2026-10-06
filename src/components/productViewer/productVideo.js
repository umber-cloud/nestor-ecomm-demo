"use client";
import React, { useRef, useState } from "react";

function ProductVideo({ url }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-contain rounded-none bg-black/5"
      onClick={togglePlay}
      controls
    >
      <source src={url} type="video/mp4" />
    </video>
  );
}

export default ProductVideo;
