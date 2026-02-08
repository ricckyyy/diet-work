import { useState } from 'react';

export function SubComponent({ content }: { content: string }) {
  const [clicked, setClicked] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  
  const handleClick = () => {
    setClicked(true);
    setClickCount(prev => prev + 1);
  };
  
  return (
    <div className="p-2 bg-gray-100 rounded">
      <div className="flex items-center gap-2 mb-2">
        <svg 
          className="w-5 h-5 text-blue-500" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            fillRule="evenodd" 
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
            clipRule="evenodd"
          />
        </svg>
        <p>{content}</p>
      </div>
      <button
        onClick={handleClick}
        className={`px-4 py-2 rounded transition-colors ${
          clicked 
            ? 'bg-green-500 hover:bg-green-600' 
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white`}
      >
        {clicked ? `クリック済み (${clickCount}回)` : 'クリックしてください'}
      </button>
    </div>
  );
}
