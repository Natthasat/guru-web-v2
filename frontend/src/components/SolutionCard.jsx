import React from 'react';
import SolutionImageCard from './SolutionImageCard';

/**
 * SolutionCard - Component แสดงเฉลยทั้งชุด
 */
const SolutionCard = ({ 
  solution, 
  solutionIndex,
  getImageUrl,
  showDelete = false,
  onDeleteImage,
  imageSize = 'medium',
  gridCols = 2
}) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  };

  return (
    <div className="bg-green-500/10 rounded-xl p-6 backdrop-blur-sm">
      {/* Solution Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="bg-green-600/30 text-green-200 px-4 py-1.5 rounded-full text-sm font-medium">
            เฉลยที่ {solutionIndex + 1}
          </span>
          {solution.title && (
            <span className="text-white/70 text-sm">
              {solution.title}
            </span>
          )}
        </div>
      </div>

      {/* Answer Text */}
      {solution.answer_text && (
        <div className="mb-4 bg-white/5 rounded-lg p-4">
          <p className="text-white/90 text-base leading-relaxed whitespace-pre-wrap">
            {solution.answer_text}
          </p>
        </div>
      )}

      {/* Teacher Name */}
      {solution.teacher_name && (
        <div className="mb-4 flex items-center text-sm text-white/70">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>ครูผู้ให้เฉลย: <span className="text-white/90 font-medium">{solution.teacher_name}</span></span>
        </div>
      )}

      {/* Solution Images Grid */}
      {solution.images && solution.images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>รูปภาพเฉลย ({solution.images.length} รูป)</span>
          </div>

          <div className={`grid ${gridClasses[gridCols]} gap-4`}>
            {solution.images.map((img, imgIndex) => (
              <SolutionImageCard
                key={img.id || imgIndex}
                imageSrc={getImageUrl(img.image_path)}
                imageAlt={`Solution ${solutionIndex + 1} - Image ${img.image_order + 1}`}
                imageNumber={img.image_order + 1}
                showDelete={showDelete}
                onDelete={() => onDeleteImage && onDeleteImage(solution.id, img.id)}
                size={imageSize}
              />
            ))}
          </div>
        </div>
      )}

      {/* No Images Message */}
      {(!solution.images || solution.images.length === 0) && (
        <div className="bg-yellow-500/10 rounded-lg p-4 text-center">
          <p className="text-yellow-200/70 text-sm">
            ยังไม่มีรูปภาพเฉลย
          </p>
        </div>
      )}
    </div>
  );
};

export default SolutionCard;
