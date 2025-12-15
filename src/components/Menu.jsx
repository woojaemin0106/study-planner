import React from "react";
import { Link } from "react-router-dom";

function Menuitem({ to, label }) {
    return (
        <li>
            <Link to={to}>{label}</Link>
        </li>
    );
}

export default Menuitem;