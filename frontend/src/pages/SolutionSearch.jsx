import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = 'http://localhost:8000/api';
const IMAGE_BASE_URL = 'http://localhost:8000';

const SolutionSearch = () => {
  const [bookId, setBookId] = useState("");
  const [page, setPage] = useState("");
  const [questionNo, setQuestionNo] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    
    try {
      // เรียกใช้ API ที่รองรับการค้นหาทั้งรหัสใหม่และรหัสเก่า
      const res = await axios.get(`${API_BASE_URL}/qa/${bookId}/${page}/${questionNo}`);
      setResult(res.data);
    } catch (err) {
      console.error('Search error:', err);
      if (err.response?.status === 404) {
        setError("ไม่พบโจทย์ที่ค้นหา กรุณาตรวจสอบรหัสหนังสือ, หน้า และข้อที่อีกครั้ง");
      } else {
        setError("เกิดข้อผิดพลาดในการค้นหา กรุณาลองใหม่อีกครั้ง");
      }
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${IMAGE_BASE_URL}/${imagePath}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-4xl border border-white/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-3xl">🔍</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">ค้นหาโจทย์และเฉลย</h2>
          <p className="text-white/70">รองรับการค้นหาด้วยรหัสหนังสือทั้งแบบใหม่และแบบเก่า</p>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto mt-4"></div>
        </div>

        <form onSubmit={handleSearch} className="space-y-6">
          <div>
            <label className="block mb-2 font-medium text-white/90">
              📚 รหัสหนังสือ (Book ID)
              <span className="text-xs text-white/60 ml-2">ใช้รหัสแบบใหม่ (เช่น IPL5203-1051) หรือแบบเก่า (เช่น 1710-0141)</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all"
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              placeholder="เช่น IPL5203-1051 หรือ 1710-0141"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium text-white/90">📄 หน้า (Page)</label>
              <input
                type="number"
                className="w-full px-4 py-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all"
                value={page}
                onChange={(e) => setPage(e.target.value)}
                placeholder="เช่น 5"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-white/90">🔢 ข้อที่ (Question No.)</label>
              <input
                type="number"
                className="w-full px-4 py-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all"
                value={questionNo}
                onChange={(e) => setQuestionNo(e.target.value)}
                placeholder="เช่น 2"
                min="1"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                กำลังค้นหา...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <span className="mr-2">🔍</span>
                ค้นหา
              </span>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-400/30 rounded-xl backdrop-blur-sm">
            <div className="flex items-center text-red-200">
              <span className="mr-2">⚠️</span>
              {error}
            </div>
          </div>
        )}

        {result && (
          <div className="mt-8 space-y-6">
            {/* Question Section */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="mr-2">📝</span>
                โจทย์
              </h3>
              <div className="space-y-2 text-white/90">
                <div>
                  <span className="font-medium text-white">รหัสหนังสือ:</span> {result.question.book_id}
                  {result.question.old_book_id && (
                    <span className="ml-2 text-amber-300/80">
                      (รหัสเก่า: {result.question.old_book_id})
                    </span>
                  )}
                </div>
                <div><span className="font-medium text-white">หน้า:</span> {result.question.page}</div>
                <div><span className="font-medium text-white">ข้อที่:</span> {result.question.question_no}</div>
                {result.question.question_text && (
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <span className="font-medium text-white">โจทย์:</span>
                    <p className="mt-1 text-white/80">{result.question.question_text}</p>
                  </div>
                )}
                {result.question.question_img && (
                  <div className="mt-4">
                    <img 
                      src={getImageUrl(result.question.question_img)} 
                      alt="Question" 
                      className="max-w-full rounded-lg border border-white/30 shadow-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Solutions Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center">
                <span className="mr-2">✅</span>
                เฉลยทั้งหมด ({result.solutions.length} เฉลย)
              </h3>
              
              {result.solutions.length === 0 ? (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
                  <p className="text-white/70">ยังไม่มีเฉลยสำหรับโจทย์นี้</p>
                </div>
              ) : (
                result.solutions.map((solution, index) => (
                  <div key={solution.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                        {index + 1}
                      </div>
                      <h4 className="text-lg font-semibold text-white">
                        {solution.title || `เฉลยที่ ${index + 1}`}
                      </h4>
                    </div>
                    
                    {solution.answer_text && (
                      <div className="mb-4">
                        <p className="text-white/80">{solution.answer_text}</p>
                      </div>
                    )}
                    
                    {solution.images && solution.images.length > 0 && (
                      <div className="space-y-4">
                        <p className="text-sm font-medium text-white/70">
                          รูปภาพเฉลย ({solution.images.length} รูป)
                        </p>
                        <div className="grid grid-cols-1 gap-4">
                          {solution.images.map((img, imgIndex) => (
                            <div key={img.id} className="relative">
                              <div className="absolute -top-2 -left-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold z-10">
                                {imgIndex + 1}
                              </div>
                              <img 
                                src={getImageUrl(img.image_path)} 
                                alt={`Solution step ${imgIndex + 1}`}
                                className="w-full rounded-lg border border-white/30 shadow-lg"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-xl"></div>
    </div>
  );
};

export default SolutionSearch;
