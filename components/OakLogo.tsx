export default function OakLogo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 56 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="OAK Foundation"
    >
      {/* O */}
      <text
        x="0"
        y="22"
        fontFamily="Georgia, serif"
        fontSize="26"
        fontWeight="700"
        fill="#1B2B4B"
        letterSpacing="-1"
      >
        OAK
      </text>
    </svg>
  );
}
