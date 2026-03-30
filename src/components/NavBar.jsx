import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { navbarClasses } from './NavBarStyles'; 

function NavBar() {
    const [isDaysOpen, setIsDaysOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className={`${navbarClasses.header} sticky top-0 bg-white z-[100] border-b border-gray-100 mb-0 shadow-none`}>
            <div className={`${navbarClasses.container} flex justify-between items-center px-4 md:px-12 h-16`}>
                
                {/* 1. 로고 */}
                <div className="flex-1 flex justify-start">
                    <Link to="/" className={navbarClasses.logoLink}>
                        <img src="/logo.png" alt="앱 로고" className="h-7 w-auto" />
                    </Link>
                </div>

                {/* 2. 중앙 메뉴 (Desktop) */}
                <nav className="hidden md:flex flex-[2] justify-center">
                    <ul className="flex items-center gap-16 text-[17px] font-medium tracking-wide">
                        <li 
                            className="relative"
                            onMouseEnter={() => setIsDaysOpen(true)}
                            onMouseLeave={() => setIsDaysOpen(false)}
                        >
                            <Link to="/Days" className="hover:text-blue-600 transition-colors flex items-center gap-1">
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

                        <li><Link to="/Timer" className="hover:text-blue-600 transition-colors">Timer</Link></li>
                        <li><Link to="/Challenges" className="hover:text-blue-600 transition-colors">Challenges</Link></li>
                    </ul>
                </nav>

                {/* 3. 로그인/회원가입 (Desktop) */}
                <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
                    <Link to="/login" className="text-[14px] text-gray-500 hover:text-black transition-colors">로그인</Link>
                    <Link to="/signup" className="text-[13px] bg-gray-900 text-white px-5 py-2 rounded-full hover:bg-black transition-all">회원가입</Link>
                </div>

                {/* 4. Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <button onClick={toggleMenu} className="p-2 text-gray-600 hover:text-black focus:outline-none">
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 top-16 shadow-lg z-[90]">
                    <nav className="flex flex-col p-6 gap-6">
                        <div className="flex flex-col gap-4">
                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Menu</p>
                            <Link to="/Days" onClick={toggleMenu} className="text-lg font-bold text-gray-900">Days</Link>
                            <div className="flex flex-col pl-4 gap-3 border-l-2 border-gray-50">
                                <Link to="/Days/daily" onClick={toggleMenu} className="text-sm text-gray-600">일간 플래너</Link>
                                <Link to="/Days/weekly" onClick={toggleMenu} className="text-sm text-gray-600">주간 플래너</Link>
                                <Link to="/Days/monthly" onClick={toggleMenu} className="text-sm text-gray-600">월간 플래너</Link>
                            </div>
                            <Link to="/Timer" onClick={toggleMenu} className="text-lg font-bold text-gray-900">Timer</Link>
                            <Link to="/Challenges" onClick={toggleMenu} className="text-lg font-bold text-gray-900">Challenges</Link>
                        </div>
                        <div className="h-[1px] bg-gray-50" />
                        <div className="flex flex-col gap-4">
                            <Link to="/login" onClick={toggleMenu} className="text-center py-3 rounded-xl border border-gray-200 font-bold">로그인</Link>
                            <Link to="/signup" onClick={toggleMenu} className="text-center py-3 rounded-xl bg-gray-900 text-white font-bold">회원가입</Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );  
}

export default NavBar;