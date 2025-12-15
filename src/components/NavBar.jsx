import React from "react";
import { Link } from "react-router-dom";
import MenuItem from "./Menu.jsx";
import { navbarClasses } from "./NavBarStyles";

function NavBar() {
  return (
    <header className={navbarClasses.header}>
      <div className={navbarClasses.container}>
        {/* 1. 로고 */}
        <div className={navbarClasses.logoWrapper}>
          <Link to="/" className={navbarClasses.logoLink}>
            {/* 👈 이미지 태그에 크기 클래스(예: h-8, w-auto) 추가 */}
            <img
              src="/logo.png"
              alt="앱 로고"
              className="h-8 w-auto" // h-8 (높이 2rem, 32px), w-auto (가로 비율 유지)
            />
          </Link>
        </div>

        {/* 2. 중앙 메뉴 */}
        <nav className={navbarClasses.centerNav}>
          <ul className={navbarClasses.centerUl}>
            <MenuItem to="/Days" label="Days" />
            <MenuItem to="/Timer" label="Timer" />
            <MenuItem to="/Challenges" label="Challenges" />
          </ul>
        </nav>

        {/* 3 & 4. 로그인/회원가입 */}
        <div className={navbarClasses.authWrapper}>
          <Link to="/Login" className={navbarClasses.loginLink}>
            로그인
          </Link>
          <Link to="/Signup" className={navbarClasses.signupLink}>
            회원가입
          </Link>
        </div>
      </div>
    </header>
  );
}

export default NavBar;
