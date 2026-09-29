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
      className="w-full h-auto block rounded-3xl"
      onClick={togglePlay}
      controls
    >
      <source src={url} type="video/mp4" />
    </video>
  );
}

export default ProductVideo;
