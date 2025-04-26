interface LogoIconProps {
  className?: string;
}

export default function LogoIcon({ className = "h-6 w-6" }: LogoIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 3H3.5C2.67 3 2 3.67 2 4.5V9M9 3V9M9 3H15M9 9H3.5C2.67 9 2 9.67 2 10.5V15M9 9V15M9 15H3.5C2.67 15 2 15.67 2 16.5V19.5C2 20.33 2.67 21 3.5 21H9M9 15V21M9 21H15M15 3H20.5C21.33 3 22 3.67 22 4.5V9M15 3V9M15 9H20.5C21.33 9 22 9.67 22 10.5V15M15 9V15M15 15H20.5C21.33 15 22 15.67 22 16.5V19.5C22 20.33 21.33 21 20.5 21H15M15 15V21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
