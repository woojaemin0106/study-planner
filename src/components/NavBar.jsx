import React, { useState } from "react";
import { Link } from "react-router-dom";
import { navbarClasses } from './NavBarStyles'; 

function NavBar() {
    const [isDaysOpen, setIsDaysOpen] = useState(false);

    return (
        /* mb-0를 명시적으로 추가하여 하단 여백을 제거하고, 
           h-16(64px) 높이를 유지합니다. */
        <header className={`${navbarClasses.header} sticky top-0 bg-white z-[100] border-b border-gray-100 mb-0 shadow-none`}>
            <div className={`${navbarClasses.container} flex justify-between items-center px-12 h-16`}>
                
                {/* 1. 로고 */}
                <div className="flex-1 flex justify-start">
                    <Link to="/" className={navbarClasses.logoLink}>
                        <img src="/logo.png" alt="앱 로고" className="h-7 w-auto" />
                    </Link>
                </div>

                {/* 2. 중앙 메뉴 */}
                <nav className="flex-[2] flex justify-center">
                    <ul className="flex items-center gap-16 text-[17px] font-medium tracking-wide">
                        <li>
                            <Link to="/" className="hover:text-blue-600 transition-colors uppercase">Home</Link>
                        </li>

                        <li 
                            className="relative"
                            onMouseEnter={() => setIsDaysOpen(true)}
                            onMouseLeave={() => setIsDaysOpen(false)}
                        >
                            <Link to="/Days" className="hover:text-blue-600 transition-colors uppercase flex items-center gap-1">
                                Days 
                            </Link>
                            
                            {isDaysOpen && (
                                <div className="absolute left-1/2 -translate-x-1/2 w-36 pt-4 z-[110]">
                                    <ul className="bg-white border border-gray-100 shadow-xl rounded-xl py-3 overflow-hidden">
                                        <li><Link to="/Days/daily" className="block px-4 py-2.5 hover:bg-blue-50 text-sm text-center">일간</Link></li>
                                        <li><Link to="/Days/weekly" className="block px-4 py-2.5 hover:bg-blue-50 text-sm text-center">주간</Link></li>
                                        <li><Link to="/Days/monthly" className="block px-4 py-2.5 hover:bg-blue-50 text-sm text-center">월간</Link></li>
                                    </ul>
                                </div>
                            )}
                        </li>

                        <li><Link to="/Timer" className="hover:text-blue-600 transition-colors uppercase">Timer</Link></li>
                        <li><Link to="/Challenges" className="hover:text-blue-600 transition-colors uppercase">Challenges</Link></li>
                    </ul>
                </nav>

                {/* 3. 로그인/회원가입 */}
                <div className="flex-1 flex justify-end gap-8 items-center">
                    <Link to="/Login" className="text-[14px] text-gray-500 hover:text-black transition-colors">로그인</Link>
                    <Link to="/Signup" className="text-[13px] bg-gray-900 text-white px-5 py-2 rounded-full hover:bg-black transition-all">회원가입</Link>
                </div>
            </div>
        </header>
    );  
}

export default NavBar;