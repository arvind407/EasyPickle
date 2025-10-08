export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col justify-center items-center h-64">
      <div className="relative w-16 h-16 mb-4">
        <svg
          className="w-16 h-16 animate-spin"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Pickleball Paddle */}
          <g className="origin-center">
            {/* Paddle Handle */}
            <rect
              x="44"
              y="65"
              width="12"
              height="28"
              rx="3"
              fill="#4F46E5"
              className="opacity-90"
            />
            
            {/* Paddle Face */}
            <ellipse
              cx="50"
              cy="40"
              rx="22"
              ry="28"
              fill="#6366F1"
            />
            
            {/* Paddle Holes (pickleball paddle pattern) */}
            <circle cx="50" cy="30" r="3" fill="#E0E7FF" />
            <circle cx="42" cy="38" r="3" fill="#E0E7FF" />
            <circle cx="58" cy="38" r="3" fill="#E0E7FF" />
            <circle cx="50" cy="45" r="3" fill="#E0E7FF" />
            <circle cx="42" cy="52" r="3" fill="#E0E7FF" />
            <circle cx="58" cy="52" r="3" fill="#E0E7FF" />
          </g>
        </svg>
        
        {/* Pickleball bouncing animation */}
        <div className="absolute top-0 right-0 w-6 h-6 animate-bounce">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2" />
            <circle cx="8" cy="8" r="1.5" fill="#F59E0B" />
            <circle cx="16" cy="8" r="1.5" fill="#F59E0B" />
            <circle cx="8" cy="16" r="1.5" fill="#F59E0B" />
            <circle cx="16" cy="16" r="1.5" fill="#F59E0B" />
            <circle cx="12" cy="12" r="1.5" fill="#F59E0B" />
          </svg>
        </div>
      </div>
      
      <p className="text-slate-500">{message}</p>
    </div>
  );
}