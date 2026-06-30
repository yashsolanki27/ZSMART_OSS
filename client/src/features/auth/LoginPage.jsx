import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./LoginPage.module.css";

/**
 * LoginPage — split-screen login faithful to the reference screenshot.
 * Left: gradient ∞ logo + ZSMART / NEW GENERATION OSS branding.
 * Right: Username / Password / Remember / Forgot → round blue login button + IP.
 *
 * Phase 1: local mock auth (admin / password).
 * Phase 2: swap to POST /api/auth/login (JWT) — same handler signature.
 */
export default function LoginPage() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [ipAddress, setIpAddress] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((r) => r.json())
      .then((d) => setIpAddress(d.ip))
      .catch(() => setIpAddress("Unavailable"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username.trim()) return setError("Username is required");
    if (!password.trim()) return setError("Password is required");

    try {
      await login(username, password);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/"), 800);
    } catch {
      setError("Invalid username or password");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.logoSection}>
          <div className={styles.logo}>∞</div>
          <div className={styles.logoText}>
            <h2>ZSMART</h2>
            <span className={styles.subtitle}>NEW GENERATION OSS</span>
            <p className={styles.tagline}>Digital Transformation Platform</p>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h1>Login</h1>

          <div className={styles.group}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className={styles.group}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && <div className={styles.error}>⚠ {error}</div>}
          {success && <div className={styles.success}>✓ {success}</div>}

          <div className={styles.actions}>
            <label className={styles.remember}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <button
              type="button"
              className={styles.forgot}
              onClick={() => alert("Password reset link sent to your email")}
            >
              Forgot password?
            </button>
          </div>

          <button type="submit" className={styles.loginBtn} title="Login">
            →
          </button>

          <div className={styles.hint}>
            Demo credentials — <strong>admin</strong> / <strong>password</strong>
          </div>

          {ipAddress && <div className={styles.ipInfo}>IP: {ipAddress}</div>}
        </form>
      </div>
    </div>
  );
}
