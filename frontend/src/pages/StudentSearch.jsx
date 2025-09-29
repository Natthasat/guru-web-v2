import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';
const IMAGE_BASE_URL = 'http://localhost:8000';

function StudentSearch() {
  const [searchData, setSearchData] = useState({
    book_id: '',
    page: '',
    question_no: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setResult(null);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/qa/${searchData.book_id}/${searchData.page}/${searchData.question_no}`
      );
      setResult(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setMessage('ไม่พบโจทย์ที่ระบุ');
      } else {
        setMessage('เกิดข้อผิดพลาด: ' + (error.response?.data?.detail || error.message));
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">ค้นหาโจทย์และเฉลย</h2>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                รหัสหนังสือ (Book ID) *
              </label>
              <input
                type="text"
                name="book_id"
                value={searchData.book_id}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="เช่น MATH-101"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                หน้า (Page) *
              </label>
              <input
                type="number"
                name="page"
                value={searchData.page}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="เช่น 25"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ข้อที่ (Question No.) *
              </label>
              <input
                type="number"
                name="question_no"
                value={searchData.question_no}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="เช่น 1"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 font-medium"
          >
            {loading ? 'กำลังค้นหา...' : 'ค้นหาโจทย์และเฉลย'}
          </button>
        </form>

        {message && (
          <div className="mt-4 p-4 rounded-md bg-red-100 text-red-700 border border-red-300">
            {message}
          </div>
        )}
      </div>

      {/* Results Display */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Question Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-3">
                โจทย์
              </span>
              {result.question.book_id} หน้า {result.question.page} ข้อ {result.question.question_no}
            </h3>
            
            {result.question.question_text && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">ข้อความโจทย์:</h4>
                <p className="text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded">
                  {result.question.question_text}
                </p>
              </div>
            )}

            {result.question.question_img && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">รูปภาพโจทย์:</h4>
                <img 
                  src={getImageUrl(result.question.question_img)} 
                  alt="Question" 
                  className="w-full h-auto rounded border shadow-sm"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div style={{display: 'none'}} className="text-red-500 text-sm">
                  ไม่สามารถโหลดรูปภาพได้
                </div>
              </div>
            )}
          </div>

          {/* Solution Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm mr-3">
                เฉลย
              </span>
              คำตอบ
            </h3>
            
            {result.solution ? (
              <div className="space-y-4">
                {result.solution.answer_text && (
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-gray-700 mb-2">คำตอบ:</h4>
                    <div className="text-gray-800 whitespace-pre-wrap">
                      {result.solution.answer_text}
                    </div>
                  </div>
                )}
                
                {result.solution.answer_img && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">รูปภาพเฉลย:</h4>
                    <img 
                      src={getImageUrl(result.solution.answer_img)} 
                      alt="Solution" 
                      className="w-full h-auto rounded border shadow-sm"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div style={{display: 'none'}} className="text-red-500 text-sm">
                      ไม่สามารถโหลดรูปภาพเฉลยได้
                    </div>
                  </div>
                )}
                
                {!result.solution.answer_text && !result.solution.answer_img && (
                  <div className="text-center py-8 text-gray-500">
                    <p>มีเฉลยแต่ไม่มีเนื้อหา</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-4">📝</div>
                <p className="text-lg font-medium">ยังไม่มีเฉลยสำหรับโจทย์นี้</p>
                <p className="text-sm mt-2">กรุณาติดต่อผู้ดูแลระบบเพื่อเพิ่มเฉลย</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentSearch;