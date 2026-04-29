import type { ReactNode } from 'react';

export default function Tooltip({ children, text }: { children: ReactNode; text: string }) {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 whitespace-nowrap">
        {text}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-3 h-3 bg-gray-800 rotate-45"></div>
      </div>
    </div>
  );
}
