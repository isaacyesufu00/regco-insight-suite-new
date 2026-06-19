import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const headingFont = "'Barlow Condensed', 'Arial Narrow', sans-serif";
const bodyFont = "'Inter', system-ui, sans-serif";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleContinue = () => {
    if (!email.trim()) {
      setError(true);
      return;
    }
    navigate('/dashboard');
  };

  const borderColor = error ? '#EF4444' : focused ? '#7B5EA7' : '#D1D5DB';

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          padding: '0 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            fontFamily: headingFont,
            fontSize: 32,
            fontWeight: 700,
            color: '#1A1A1A',
            textAlign: 'center',
            marginBottom: 8,
            letterSpacing: '-0.01em',
            margin: '0 0 8px',
          }}
        >
          Sign in to Regco
        </h1>
        <p
          style={{
            fontFamily: bodyFont,
            fontSize: 14,
            fontWeight: 400,
            color: '#6B6B6B',
            textAlign: 'center',
            marginBottom: 28,
            margin: '0 0 28px',
          }}
        >
          Enter your email below to sign in to your account
        </p>
        <input
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (error) setError(false); }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleContinue(); }}
          style={{
            width: '100%',
            height: 48,
            borderRadius: 8,
            border: `1.5px solid ${borderColor}`,
            background: '#FFFFFF',
            padding: '0 16px',
            fontFamily: bodyFont,
            fontSize: 15,
            color: '#1A1A1A',
            marginBottom: 8,
            outline: 'none',
            boxShadow: 'none',
            boxSizing: 'border-box',
          }}
        />
        <button
          type="button"
          onClick={handleContinue}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#6B4F9A')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#7B5EA7')}
          style={{
            width: '100%',
            height: 48,
            borderRadius: 8,
            background: '#7B5EA7',
            color: '#FFFFFF',
            fontFamily: bodyFont,
            fontSize: 15,
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease',
            marginTop: 8,
            marginBottom: 28,
          }}
        >
          Continue
        </button>
        <p
          style={{
            fontFamily: bodyFont,
            fontSize: 14,
            textAlign: 'center',
            color: '#6B6B6B',
            fontWeight: 400,
            margin: 0,
          }}
        >
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/')}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            style={{ color: '#7B5EA7', cursor: 'pointer', fontWeight: 400 }}
          >
            Request a demo
          </span>
        </p>
      </div>
    </div>
  );
}
