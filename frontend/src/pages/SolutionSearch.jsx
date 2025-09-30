import React, { useState } from "react";
import axios from "axios";

const SolutionSearch = () => {
  const [bookCode, setBookCode] = useState("");
  const [page, setPage] = useState("");
  const [questionNumber, setQuestionNumber] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await axios.get("/api/solutions/search", {
        params: {
          book_code: bookCode,
          page: page,
          question_number: questionNumber,
        },
      });
      setResult(res.data);
    } catch (err) {
      setError("ไม่พบข้อมูลหรือเกิดข้อผิดพลาด");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="bg-white bg-opacity-60 backdrop-blur-lg rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">ค้นหาเฉลย</h2>
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">รหัสหนังสือ</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded border"
              value={bookCode}
              onChange={(e) => setBookCode(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">หน้า</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded border"
              value={page}
              onChange={(e) => setPage(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">เลขข้อ</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded border"
              value={questionNumber}
              onChange={(e) => setQuestionNumber(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded font-semibold hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "กำลังค้นหา..." : "ค้นหา"}
          </button>
        </form>
        {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
        {result && (
          <div className="mt-6 p-4 bg-white rounded shadow">
            <h3 className="font-bold mb-2">ผลการค้นหา</h3>
            <div>
              <div><span className="font-medium">รหัสหนังสือ:</span> {result.book_code}</div>
              <div><span className="font-medium">หน้า:</span> {result.page}</div>
              <div><span className="font-medium">เลขข้อ:</span> {result.question_number}</div>
              <div><span className="font-medium">เฉลย:</span> {result.solution_text}</div>
              {result.image_url && (
                <img src={result.image_url} alt="solution" className="mt-2 max-w-full rounded" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolutionSearch;
