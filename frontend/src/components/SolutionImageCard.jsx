import React from 'react';

/**
 * SolutionImageCard - Component แสดงรูปภาพเฉลยแบบสะอาด ไม่มีจุดสีแดง
 * แก้ไขปัญหา: ไม่ใช้ border, ไม่ใช้ overflow-hidden กับ badge
 */
const SolutionImageCard = ({ 
  imageSrc, 
  imageAlt = 'Solution Image',
  imageNumber,
  teacherName,
  showDelete = false,
  onDelete,
  size = 'medium'
}) => {
  const sizeClasses = {
    small: 'h-48',
    medium: 'h-64',
    large: 'h-80'
  };

  const badgeSizes = {
    small: 'text-xs px-2 py-1',
    medium: 'text-sm px-3 py-1.5',
    large: 'text-base px-4 py-2'
  };

  return (
    <div className="relative group">
      {/* Image Container - พื้นหลังสีดำ ไม่มี rounded เพื่อป้องกันจุดสีแดง */}
      <div className={`relative ${sizeClasses[size]} w-full bg-gray-900/50`}>
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.style.display = 'none';
            const parent = e.target.parentElement;
            if (parent) {
              parent.innerHTML = `
                <div class="flex items-center justify-center h-full bg-gray-800/50 text-white/70">
                  <div class="text-center">
                    <svg class="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p class="text-sm">ไม่สามารถโหลดรูปภาพได้</p>
                  </div>
                </div>
              `;
            }
          }}
        />
      </div>

      {/* Image Number Badge - ใช้สีเดียวไม่มี gradient เพื่อป้องกันจุดสีแดง */}
      {imageNumber !== undefined && (
        <div 
          className={`absolute top-2 left-2 bg-blue-600 text-white font-bold rounded-full shadow-xl z-10 flex items-center justify-center ${badgeSizes[size]}`}
          style={{ 
            pointerEvents: 'none',
            minWidth: '2.5rem',
            minHeight: '2.5rem'
          }}
        >
          {imageNumber}
        </div>
      )}

      {/* Delete Button */}
      {showDelete && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-xl opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110 z-20"
          title="ลบรูปภาพ"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Teacher Name */}
      {teacherName && (
        <div className="mt-3 flex items-center text-sm text-white/70">
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>ครูผู้ให้เฉลย: {teacherName}</span>
        </div>
      )}
    </div>
  );
};

export default SolutionImageCard;
