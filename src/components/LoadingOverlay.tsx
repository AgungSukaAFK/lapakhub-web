import React from "react";
import useLoadingStore from "../store/loadingStore";

const LoadingOverlay: React.FC = () => {
  const isLoading = useLoadingStore((state) => state.isLoading);

  return (
    <div
      className={`fixed z-[100] inset-0 flex items-center justify-center bg-black bg-opacity-50 ${
        isLoading ? "block" : "hidden"
      }`}
    >
      <div
        className="shapes"
        style={{
          width: "44.8px",
          height: "44.8px",
          background: `linear-gradient(currentColor 0 0),
                      linear-gradient(currentColor 0 0),
                      linear-gradient(currentColor 0 0),
                      linear-gradient(currentColor 0 0)`,
          backgroundSize: "23.4px 23.4px",
          backgroundRepeat: "no-repeat",
          color: "#474bff",
          animation: "shapes-animation 1.5s infinite cubic-bezier(0.3,1,0,1)",
        }}
      ></div>
    </div>
  );
};

export default LoadingOverlay;
