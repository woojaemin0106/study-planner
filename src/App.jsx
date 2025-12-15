import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/NavBar.jsx'

function App() {
    return (
        <div>
            <Navbar />
            <Outlet />
        </div>
    )
}

export default App
