import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaGoogle, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const LoginStyles = `
  body, html, #root { margin: 0; padding: 0; width: 100%; height: 100%; }
  .login-page-background { display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f0f2f5; font-family: Arial, sans-serif; }
  .login-card { display: flex; width: 950px; max-width: 95%; height: 600px; background: #fff; border-radius: 20px; box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1); overflow: hidden; }

  .info-panel { flex: 1; color: #fff; padding: 50px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;
    background-image: linear-gradient(rgba(30, 60, 114, 0.7), rgba(30, 60, 114, 0.7)),
      url('https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?auto=format&fit=crop&q=80');
    background-size: cover; background-position: center;
  }

  .company-name { font-size: 2.8rem; letter-spacing: 2px; margin: 20px 0 10px; z-index: 2; }
  .tagline, .description { z-index: 2; }
  .tagline { font-size: 1.1rem; font-weight: 300; margin-bottom: 25px; }
  .description { font-size: 0.95rem; max-width: 320px; line-height: 1.6; }

  .form-panel { flex: 1.1; padding: 60px; display: flex; flex-direction: column; justify-content: center; }
  .form-panel h2 { font-size: 2.2rem; color: #333; margin-bottom: 10px; }
  .form-panel .subtitle { color: #777; margin-bottom: 35px; }

  .input-wrapper { position: relative; margin-bottom: 20px; }
  .input-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #aaa; }
  .input-wrapper input { width: 100%; padding: 14px 14px 14px 45px; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; box-sizing: border-box; }
  .input-wrapper input:focus { outline: none; border-color: #2a5298; box-shadow: 0 0 0 3px rgba(42, 82, 152, 0.1); }

  .btn { width: 100%; padding: 14px; border: none; border-radius: 8px; font-size: 1rem; font-weight: bold; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 10px; transition: all 0.3s ease; }
  .login-btn { background-color: #2a5298; color: #fff; }
  .login-btn:hover { background-color: #1e3c72; }

  .separator { display: flex; align-items: center; text-align: center; color: #aaa; margin: 30px 0; }
  .separator::before, .separator::after { content: ''; flex: 1; border-bottom: 1px solid #ddd; }
  .separator span { padding: 0 10px; }

  .google-btn { background-color: #fff; color: #555; border: 1px solid #ddd; }
  .google-btn:hover { background-color: #f9f9f9; }
  .google-btn svg { color: #DB4437; }
`;

const AuthPage = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isRegister
        ? "http://localhost:5000/api/auth/register"
        : "http://localhost:5000/api/auth/login";

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        // ✅ store doctorId + token in localStorage
        if (data.doctorId) {
          localStorage.setItem("doctorId", data.doctorId);
        }
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        navigate("/dashboard");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Auth Error:", error);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <>
      <style>{LoginStyles}</style>
      <div className="login-page-background">
        <div className="login-card">
          
          {/* Info Panel */}
          <div className="info-panel">
            <h1 className="company-name">ONCODECODE</h1>
            <p className="tagline">Precision Oncology, Simplified.</p>
            <p className="description">
              Gene expression-based cancer classification to empower informed decisions.
            </p>
          </div>

          {/* Form Panel */}
          <div className="form-panel">
            <h2>{isRegister ? "Create Account" : "Welcome Back"}</h2>
            <p className="subtitle">
              {isRegister ? "Register to access your dashboard." : "Log in to access your dashboard."}
            </p>

            <form onSubmit={handleSubmit}>
              {isRegister && (
                <div className="input-wrapper">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn login-btn">
                {isRegister ? "Register" : "Log In"}
              </button>

              <div className="separator">
                <span>Or continue with</span>
              </div>

              <button type="button" className="btn google-btn">
                <FaGoogle /> {isRegister ? "Sign up with Google" : "Sign in with Google"}
              </button>
            </form>

            <p style={{ marginTop: "20px", textAlign: "center" }}>
              {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
              <span
                style={{ color: "#2a5298", cursor: "pointer" }}
                onClick={() => setIsRegister(!isRegister)}
              >
                {isRegister ? "Login here" : "Register here"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
