import React, { useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const options = [
  { value: "daily", label: "일간" },
  { value: "weekly", label: "주간" },
  { value: "monthly", label: "월간" },
];

export default function DaysLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const current = useMemo(() => {
    // /Days/daily -> ["Days","daily"]
    const seg = location.pathname.split("/").filter(Boolean);
    const mode = seg[1] || "daily";
    return options.some((o) => o.value === mode) ? mode : "daily";
  }, [location.pathname]);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Days</h1>
          <p className="mt-1 text-sm text-gray-600">일간 / 주간 / 월간 보기</p>
        </div>

        <div className="w-full md:w-56">
          <label className="mb-1 block text-xs font-semibold text-gray-500">
            보기 모드
          </label>
          <select
            value={current}
            onChange={(e) => navigate(`/Days/${e.target.value}`)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none focus:border-gray-400"
          >
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8">
        <Outlet />
      </div>
    </div>
  );
}
