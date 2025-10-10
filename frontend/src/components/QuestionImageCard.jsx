import React from 'react';

/**
 * QuestionImageCard - Component แสดงรูปโจทย์ ไม่มี border สีแดง
 */
const QuestionImageCard = ({ 
  imageSrc, 
  imageAlt = 'Question Image',
  questionText,
  size = 'medium'
}) => {
  const sizeClasses = {
    small: 'max-h-48',
    medium: 'max-h-64',
    large: 'max-h-96'
  };

  return (
    <div className="space-y-4">
      {/* Question Text */}
      {questionText && (
        <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
          <p className="text-white/90 text-base leading-relaxed whitespace-pre-wrap">
            {questionText}
          </p>
        </div>
      )}

      {/* Question Image - ไม่มี border และไม่มี rounded เพื่อป้องกันจุดสีแดง */}
      {imageSrc && (
        <div className="bg-gray-900/50">
          <img
            src={imageSrc}
            alt={imageAlt}
            className={`w-full h-auto ${sizeClasses[size]} object-contain`}
            onError={(e) => {
              e.target.style.display = 'none';
              const parent = e.target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="flex items-center justify-center h-48 bg-gray-800/50 text-white/70 rounded-xl p-8">
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
      )}
    </div>
  );
};

export default QuestionImageCard;
