"use client";

type ConfirmButtonProps = {
  children: React.ReactNode;
  message: string;
  className?: string;
};

export default function ConfirmButton({
  children,
  message,
  className,
}: ConfirmButtonProps) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(event) => {
        const confirmed = window.confirm(message);

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
