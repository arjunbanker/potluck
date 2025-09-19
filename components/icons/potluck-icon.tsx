interface PotluckIconProps {
  className?: string;
  size?: number;
}

export function PotluckIcon({ className = "", size = 24 }: PotluckIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Cooking pot base */}
      <path
        d="M6 10C6 8.89543 6.89543 8 8 8H16C17.1046 8 18 8.89543 18 10V18C18 19.1046 17.1046 20 16 20H8C6.89543 20 6 19.1046 6 18V10Z"
        fill="currentColor"
        opacity="0.8"
      />
      
      {/* Pot handles */}
      <path
        d="M5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13H6V11H5Z"
        fill="currentColor"
        opacity="0.6"
      />
      <path
        d="M18 11V13H19C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11H18Z"
        fill="currentColor"
        opacity="0.6"
      />
      
      {/* Steam/warmth lines */}
      <path
        d="M9 5C9 4.44772 9.44772 4 10 4C10.5523 4 11 4.44772 11 5V7C11 7.55228 10.5523 8 10 8C9.44772 8 9 7.55228 9 7V5Z"
        fill="currentColor"
        opacity="0.4"
      />
      <path
        d="M12 3C12 2.44772 12.4477 2 13 2C13.5523 2 14 2.44772 14 3V6C14 6.55228 13.5523 7 13 7C12.4477 7 12 6.55228 12 6V3Z"
        fill="currentColor"
        opacity="0.4"
      />
      <path
        d="M15 5C15 4.44772 15.4477 4 16 4C16.5523 4 17 4.44772 17 5V7C17 7.55228 16.5523 8 16 8C15.4477 8 15 7.55228 15 7V5Z"
        fill="currentColor"
        opacity="0.4"
      />
      
      {/* Content/food in pot */}
      <circle cx="10" cy="14" r="1.5" fill="currentColor" opacity="0.3" />
      <circle cx="14" cy="12" r="1" fill="currentColor" opacity="0.3" />
      <circle cx="13" cy="16" r="1" fill="currentColor" opacity="0.3" />
    </svg>
  );
}