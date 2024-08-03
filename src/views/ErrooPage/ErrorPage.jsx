import React, { useState } from "react";
import { Spin } from "antd";

const ErrorPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-gray-100">
      {isLoading && (
        <div className="absolute flex flex-col items-center justify-center w-full h-full bg-white z-10">
          <Spin size="large" spinning={isLoading} />
          <div className="mt-4 text-lg font-semibold text-teal-300">
            Loading...
          </div>
        </div>
      )}
      <iframe
        src="https://chromedino.com/"
        width="100%"
        height="100%"
        loading="lazy"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
        }}
        title="Dino Game"
        onLoad={handleIframeLoad}
      ></iframe>
    </div>
  );
};

export default ErrorPage;
