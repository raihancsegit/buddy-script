"use client";

import React, { useState, useEffect } from "react";

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

function getInitials(name?: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "?";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function stringToColor(name?: string | null): string {
  const colors = [
    "#377DFF", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4",
    "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE",
    "#76B041", "#E67E22", "#1ABC9C", "#E74C3C", "#3498DB",
  ];
  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function Avatar({ src, name, size = 40, className = "", style = {} }: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [src]);

  const showInitials = !src || imgError;
  const initials = getInitials(name);
  const bgColor = stringToColor(name);

  const baseStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: "50%",
    objectFit: "cover",
    flexShrink: 0,
    ...style,
  };

  if (showInitials) {
    return (
      <div
        className={className}
        style={{
          ...baseStyle,
          background: bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 700,
          fontSize: size * 0.38,
          letterSpacing: "0.5px",
          userSelect: "none",
        }}
        title={name || ""}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name || ""}
      className={className}
      style={baseStyle}
      onError={() => setImgError(true)}
    />
  );
}
