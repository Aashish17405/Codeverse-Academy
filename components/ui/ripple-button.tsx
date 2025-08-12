"use client";

import { MouseEvent, useRef } from "react";

type RippleButtonProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
};

export const RippleButton = ({
  children,
  className = "",
  onClick,
}: RippleButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const createRipple = (e: MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (!button) return;

    onClick?.(e);

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2; // Bigger ripple
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement("span");
    ripple.className = "ripple-effect";
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 700);
  };

  return (
    <button
      ref={buttonRef}
      onClick={createRipple}
      className={`relative overflow-hidden select-none ${className}`}
    >
      {children}
    </button>
  );
};
