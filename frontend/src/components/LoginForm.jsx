import React from "react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    // Usar el hook useAuth en lugar de AuthContext directamente
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    
    // Estados locales del formulario
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Limpiar errores previos
        
        // Intentar hacer login
        const success = await login(formData.username, formData.password);
        
        if (success) {
            // Redirigir a productos si el login es exitoso
            navigate("/products");
        } else {
            // Mostrar error si el login falla
            setError("Credenciales incorrectas. Intenta de nuevo.");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
    
}

export default LoginForm;