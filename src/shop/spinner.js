import React from "react";

export default function Spinner({ size = 40, color = "#3b82f6" }) {
  const style = {
    width: size,
    margin: `auto`,
    height: size,
    border: `${size / 8}px solid #e5e7eb`,
    borderTop: `${size / 8}px solid ${color}`,
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  };

  return (
    <>
      <div style={style} />
      <style>
        {`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </>
  );
}

