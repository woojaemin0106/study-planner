// src/styles/navbarStyles.js

export const navbarClasses = {
    // 최상위 <header> 태그 스타일: 순수 블랙(bg-black), 상단 고정, z-50
    header: "fixed top-0 left-0 w-full text-black-400 z-50 transition duration-300 ease-in shadow-md",
    
    // 컨텐츠 래퍼 <div> 스타일: 높이 h-16 (64px), 패딩, Flexbox 정렬
    container: "flex items-center justify-between h-16 px-6 md:px-12",
    
    // 로고 Wrapper <div> 스타일
    logoWrapper: "flex items-center",
    // 로고 Link 스타일: 폰트 크기, 굵기, 넷플릭스 레드
    logoLink: "text-3xl font-bold text-red-600 hover:text-red-500 tracking-wider transition",
    
    // 중앙 메뉴 <nav> 스타일: 데스크톱에서만 표시
    centerNav: "hidden md:block",
    // 중앙 메뉴 <ul> 스타일: Flex 정렬 및 항목 간 간격 (space-x-8 = 32px)
    centerUl: "flex space-x-8",

    // 인증 영역 <div> 스타일
    authWrapper: "flex space-x-4 items-center",
    
    // 로그인 버튼 Link 스타일 (일반 텍스트)
    loginLink: "text-sm font-medium hover:text-gray-300 transition",
    
    // 회원가입 버튼 Link 스타일 (빨간색 배경, 강조)
    signupLink: "bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-1.5 px-4 rounded transition duration-200",
    
    // 로고 이미지 스타일 (height만 지정하고 width는 auto로 비율 유지)
    logoImg: "h-8 w-auto", 
};