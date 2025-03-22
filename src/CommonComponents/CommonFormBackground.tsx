import React, { ReactNode } from "react";

interface CommonFormBackgroundProps {
    title: string;
    children: ReactNode;
}

const CommonFormBackground: React.FC<CommonFormBackgroundProps> = ({ title, children }) => {
    return (
        <div className="page-container">
            <h2>{title}</h2>
            {children}
        </div>
    );
};

export default CommonFormBackground;
