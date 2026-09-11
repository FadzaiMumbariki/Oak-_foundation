export default function OakLogo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <img
      src="/oak-foundation-logo.svg"
      className={className}
      alt="Oak Foundation"
    />
  );
}
