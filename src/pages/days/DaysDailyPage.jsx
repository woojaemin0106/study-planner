import { Link } from "react-router-dom";

export default function DaysDailyPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <Link
        to="/Days"
        className="text-sm font-semibold text-blue-600 hover:underline"
      >
        ← Days로 돌아가기
      </Link>

      <h1 className="mt-4 text-2xl font-extrabold text-gray-900">일간</h1>
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        일간 페이지 내용
      </div>
    </div>
  );
}
