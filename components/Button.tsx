import React from "react";
type buttonProp = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

function Button({ children, onClick, disabled = false }: buttonProp) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 ${disabled ? "bg-gray-500 text-black cursor-not-allowed" : "bg-red-500 text-white cursor-pointer"}  rounded-lg `}
    >
      {children}
    </button>
  );
}

export default Button;
