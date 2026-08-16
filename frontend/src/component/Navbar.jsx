import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

export default function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Auth state se role aur email nikal rahe hain
    const { role, email } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout()); // Redux state clear karega
        navigate("/login"); // Login page par bhej dega
    };

    return (
        <nav style={{ display: "flex", justifyContent: "space-between", padding: "15px", backgroundColor: "#333", color: "white" }}>
            <div>
                <Link to="/" style={{ color: "white", marginRight: "15px", textDecoration: "none" }}>Home</Link>
                {/* Sirf admin ya manager hi Create Ticket ka button dekh sakein (Example) */}
                {(role === "admin" || role === "manager") && (
                    <Link to="/create" style={{ color: "white", textDecoration: "none" }}>Create Ticket</Link>
                )}
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <span>{email} ({role})</span>
                <button 
                    onClick={handleLogout} 
                    style={{ backgroundColor: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}