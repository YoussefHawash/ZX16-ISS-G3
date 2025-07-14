import { useEffect, useRef } from "react";

// Custom Dialog Components
const CustomDialog = ({ children }: any) => {
  return <>{children}</>;
};

const CustomDialogTrigger = ({ children, onClick }: any) => {
  return <div onClick={onClick}>{children}</div>;
};

const CustomDialogContent = ({
  isOpen,
  onClose,
  children,
  className = "",
}: any) => {
  const contentRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    const handleClickOutside = (e) => {
      if (contentRef.current && !contentRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Content */}
      <div ref={contentRef} className={`relative z-10 ${className}`}>
        {children}
      </div>
    </div>
  );
};
export { CustomDialog, CustomDialogContent, CustomDialogTrigger };
