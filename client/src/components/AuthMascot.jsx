import React from 'react';

const AuthMascot = ({ message, type = 'default' }) => {
    // This function returns the correct SVG paths for the face based on the 'type' prop
    const getMascotFace = () => {
        switch (type) {
            case 'error':
                return ( // Using a fragment <> to group elements
                    <>
                        <path d="M14.5 15.5 a1 1 0 100-2 1 1 0 000 2z" />
                        <path d="M21.5 15.5 a1 1 0 100-2 1 1 0 000 2z" />
                        <path d="M15 23 c3 -2 6 0 6 1" stroke="#4D4D4D" strokeWidth="1.5" strokeLinecap="round" />
                    </>
                );
            case 'success':
                return (
                    <>
                        <path d="M14.5 15.5c-1-1-1.5-2.5.5-3.5s3.5.5 2.5 1.5" stroke="#4D4D4D" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M21.5 15.5c-1-1-1.5-2.5.5-3.5s3.5.5 2.5 1.5" stroke="#4D4D4D" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M15 22c3 2 6 0 6-1" stroke="#4D4D4D" strokeWidth="1.5" strokeLinecap="round" />
                    </>
                );
            default:
                return (
                    <>
                        <circle cx="15" cy="17" r="1.5" />
                        <circle cx="21" cy="17" r="1.5" />
                        <path d="M15 22 c3 1 6 0 6-1" stroke="#4D4D4D" strokeWidth="1.5" strokeLinecap="round" />
                    </>
                );
        }
    };

    return (
        <div className="flex items-center justify-center gap-4 my-4" style={{ minHeight: '6rem' }}>
            <div className="w-24 h-24 flex-shrink-0">
                <svg className="w-full h-full" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="18" cy="18" r="16" fill="#FDE047" stroke="#EAB308" strokeWidth="2" />
                    <g fill="#4D4D4D">
                        {getMascotFace()}
                    </g>
                </svg>
            </div>
      
            <div className={`relative transition-all duration-300 ${message ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                <div className="bg-white border border-slate-300 rounded-lg px-4 py-2 shadow-sm max-w-xs">
                    <p className={`text-sm font-medium ${type === 'error' ? 'text-red-600' : 'text-slate-700'}`}>{message}</p>
                </div>
                <div className="absolute left-0 top-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-l border-slate-300 transform rotate-45"></div>
            </div>
        </div>
    );
};

export default AuthMascot;