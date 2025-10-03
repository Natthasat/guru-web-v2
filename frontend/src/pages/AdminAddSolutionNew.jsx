import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

function AdminAddSolution() {
  const [formData, setFormData] = useState({
    title: '',
    answer_text: ''
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [createdSolutionId, setCreatedSolutionId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // ตรวจสอบจำนวนไฟล์ (จำกัดไม่เกิน 5 รูป)
    if (files.length > 5) {
      setMessage('⚠️ สามารถอัปโหลดได้สูงสุด 5 รูป');
      return;
    }

    // ตรวจสอบขนาดและประเภทไฟล์
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    
    for (const file of files) {
      if (file.size > maxSize) {
        setMessage(`⚠️ ไฟล์ ${file.name} มีขนาดใหญ่เกินไป (จำกัดที่ 5MB)`);
        return;
      }
      if (!allowedTypes.includes(file.type)) {
        setMessage(`⚠️ ไฟล์ ${file.name} ประเภทไม่รองรับ (ใช้ JPG, PNG, GIF เท่านั้น)`);
        return;
      }
    }

    setImages(files);

    // สร้าง preview
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
    setMessage('');
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setCreatedSolutionId(null);

    try {
      // Step 1: สร้างเฉลย
      const solutionFormData = new FormData();
      solutionFormData.append('title', formData.title);
      solutionFormData.append('answer_text', formData.answer_text);

      const solutionResponse = await axios.post(
        `${API_BASE_URL}/solutions`,
        solutionFormData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      const solutionId = solutionResponse.data.id;
      setCreatedSolutionId(solutionId);

      // Step 2: อัปโหลดรูปภาพ (ถ้ามี)
      if (images.length > 0) {
        const imageFormData = new FormData();
        images.forEach(image => {
          imageFormData.append('images', image);
        });

        await axios.post(
          `${API_BASE_URL}/solutions/${solutionId}/images`,
          imageFormData,
          {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        );
      }

      setMessage(`✅ สร้างเฉลยสำเร็จ! (ID: ${solutionId}) - ตอนนี้สามารถเชื่อมกับโจทย์ได้แล้ว`);
      
      // รีเซ็ตฟอร์ม
      setFormData({ title: '', answer_text: '' });
      setImages([]);
      setImagePreviews([]);

    } catch (error) {
      console.error('Error creating solution:', error);
      if (error.response) {
        setMessage(`❌ เกิดข้อผิดพลาด: ${error.response.data.detail || 'ไม่สามารถสร้างเฉลยได้'}`);
      } else {
        setMessage('❌ เกิดข้อผิดพลาด: Network Error');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({ title: '', answer_text: '' });
    setImages([]);
    setImagePreviews([]);
    setMessage('');
    setCreatedSolutionId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">➕</span>
            </div>
            <h1 className="text-2xl font-bold text-white">เพิ่มเฉลยใหม่</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center py-8 px-4">
        <div className="max-w-3xl w-full">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            {/* Back Button */}
            <div className="mb-6">
              <button
                onClick={() => window.history.back()}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200"
              >
                ← กลับ
              </button>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
              <p className="text-blue-800 text-sm">
                💡 <strong>หมายเหตุ:</strong> ระบบใหม่จะสร้างเฉลยแยกจากโจทย์ก่อน 
                หลังจากนั้นสามารถเชื่อมเฉลยกับหลายโจทย์ได้ในหน้า "เชื่อมโจทย์-เฉลย"
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  🏷️ ชื่อเฉลย (ไม่บังคับ)
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="เช่น: วิธีทำข้อ 1-5 เรื่องสมการ"
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                />
              </div>

              {/* Answer Text */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  ✏️ คำตอบ (Answer Text)
                </label>
                <textarea
                  name="answer_text"
                  value={formData.answer_text}
                  onChange={handleInputChange}
                  rows="8"
                  placeholder="พิมพ์คำตอบที่นี่..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm transition-all duration-200 resize-none"
                />
              </div>

              {/* Images Upload */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  🖼️ รูปภาพคำตอบ (สูงสุด 5 รูป)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-500 file:text-white hover:file:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200"
                />
                <p className="text-sm text-white/60 mt-2">
                  รองรับไฟล์ JPG, PNG, GIF ขนาดไม่เกิน 5MB ต่อรูป
                </p>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative bg-white/10 rounded-xl p-2 border border-white/30">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-4 right-4 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-1 transition-all duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <p className="text-xs text-white/60 text-center mt-1">รูปที่ {index + 1}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Buttons */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      กำลังบันทึก...
                    </>
                  ) : (
                    <>➕ สร้างเฉลย</>
                  )}
                </button>

                <button
                  type="button"
                  onClick={clearForm}
                  className="px-6 py-3 bg-gray-500/80 hover:bg-gray-600 text-white font-medium rounded-xl transition-all duration-200"
                >
                  ล้างข้อมูล
                </button>
              </div>
            </form>

            {/* Message */}
            {message && (
              <div className={`mt-6 p-4 rounded-xl backdrop-blur-sm ${
                message.includes('สำเร็จ') 
                  ? 'bg-green-500/20 border border-green-400/30' 
                  : 'bg-red-500/20 border border-red-400/30'
              }`}>
                <p className={`text-sm ${message.includes('สำเร็จ') ? 'text-green-200' : 'text-red-200'}`}>
                  {message}
                </p>
                {createdSolutionId && (
                  <div className="mt-3">
                    <a
                      href="/admin/link-question-solution"
                      className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-all duration-200"
                    >
                      🔗 ไปเชื่อมกับโจทย์
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-green-400/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl"></div>
    </div>
  );
}

export default AdminAddSolution;
