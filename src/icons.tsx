export const PreviousIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      width={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      focusable={false}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g id="SVGRepo_iconCarrier">
        <path
          d="M15 6L9 12L15 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export const NextIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      focusable={false}
      height={size}
      width={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g id="SVGRepo_iconCarrier">
        <path
          d="M9 6L15 12L9 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export const CloseIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      className="zener-outline-none"
      tabIndex={-1}
      focusable="false"
      data-icon="close"
      width={size}
      height={size}
      strokeWidth="2"
      fill="currentColor"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M24 8 8 24M24 24 8 8"
      />
    </svg>
  );
};
