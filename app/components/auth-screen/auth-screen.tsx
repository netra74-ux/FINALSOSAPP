import { useState } from 'react';
import { AlertCircle, Sun, Moon } from 'lucide-react';
import { useColorScheme } from '@dazl/color-scheme/react';
import classNames from 'classnames';
import styles from './auth-screen.module.css';

interface AuthScreenProps {
  authMode: 'login' | 'signup';
  authError: string | null;
  onLogin: (email: string, password: string) => void;
  onSignup: (name: string, email: string, phone: string, password: string) => void;
  onModeChange: (mode: 'login' | 'signup') => void;
}

export function AuthScreen({ authMode, authError, onLogin, onSignup, onModeChange }: AuthScreenProps) {
  const { isDark, setColorScheme } = useColorScheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'login') {
      onLogin(email, password);
    } else {
      onSignup(name, email, phone, password);
    }
  };

  return (
    <div className={styles.overlay} style={{ position: 'relative' }}>
      <button
        className={styles.themeBtn}
        onClick={() => setColorScheme(isDark ? 'light' : 'dark')}
        type="button"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <div className={styles.card}>
        <div className={styles.logoArea}>
          <div className={styles.logoCircle}>SOS</div>
          <div className={styles.appName}>
            <div className={styles.appTitle}>Emergency SOS</div>
            <div className={styles.appSub}>One-tap emergency safety system</div>
          </div>
        </div>

        <div className={styles.tabs}>
          <button
            className={classNames(styles.tab, { [styles.active]: authMode === 'login' })}
            onClick={() => onModeChange('login')}
            type="button"
          >
            Sign In
          </button>
          <button
            className={classNames(styles.tab, { [styles.active]: authMode === 'signup' })}
            onClick={() => onModeChange('signup')}
            type="button"
          >
            Sign Up
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {authMode === 'signup' && (
            <>
              <div className={styles.field}>
                <label className={styles.label}>Full Name</label>
                <input
                  className={styles.input}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Alex Johnson"
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Phone Number</label>
                <input
                  className={styles.input}
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  type="tel"
                  required
                />
              </div>
            </>
          )}

          <div className={styles.field}>
            <label className={styles.label}>Email Address</label>
            <input
              className={styles.input}
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              type="email"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
              required
            />
          </div>

          {authError && (
            <div className={styles.error}>
              <AlertCircle size={16} />
              {authError}
            </div>
          )}

          <button className={styles.submitBtn} type="submit">
            {authMode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className={styles.footer}>
          Protected by end-to-end encryption · Emergency SOS &copy; 2024
        </div>
      </div>
    </div>
  );
}
