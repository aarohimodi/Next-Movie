import React from "react";

function Container({ children }: { children: React.ReactNode }) {
  return <div className="md:w-[1200px] mx-auto">{children}</div>;
}

export default Container;
