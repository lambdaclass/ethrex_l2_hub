import React from "react";

export type SpinnerProps = {
  className?: string;
};

export const Spinner: React.FC<SpinnerProps> = (props: SpinnerProps) => {
  const customClasses = props?.className || "";
  return <div className={`spinner ${customClasses}`}></div>;
};
