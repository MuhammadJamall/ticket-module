import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, clearError } from "../features/auth/authSlice";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        dispatch(clearError());

        dispatch(loginUser({email,password}));
    };

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc" }}>
            <h2>Login</h2>
            
            {/* Agar backend se error aaye toh yahan dikhayein */}
            {error && <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "15px" }}>
                    <label>Email:</label><br />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px", margin: "5px 0" }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Password:</label><br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px", margin: "5px 0" }}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading} 
                    style={{ width: "100%", padding: "10px", background: "#aa3bff", color: "white", border: "none", cursor: "pointer" }}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <p style={{ marginTop: "15px", textAlign: "center" }}>
                Don’t have an account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
}