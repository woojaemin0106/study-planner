// NavBarStyles.js 수정
export const navbarClasses = {
    // 1. 배경색이 화면 끝까지 차도록 w-full 유지, mb-0로 하단 마진 제거
    header: "w-full border-b border-gray-100 bg-white sticky top-0 z-[100] m-0 p-0", 
    
    // 2. container에서 max-w를 제거하거나 px를 조절해 꽉 차게 만듦
    container: "w-full h-16 flex items-center px-12", 
    
    centerUl: "flex items-center gap-16 font-medium text-gray-700 tracking-wide",
};