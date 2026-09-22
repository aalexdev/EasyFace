import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import logoImg from '../images/logo.jpg';

export default function Login() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [userType, setUserType] = useState<'participante' | 'fornecedor'>('participante');
  const [emailOrDoc, setEmailOrDoc] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const setupCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    interface Point { x: number; y: number; }
    interface Pulse { progress: number; speed: number; length: number; color: string; glow: number; }
    interface Circuit {
      points: Point[];
      layer: 'bg' | 'mid' | 'fg';
      lineWidth: number;
      baseColor: string;
      pulses: Pulse[];
      nodeType: 'circle' | 'square' | 'ring';
    }

    let circuits: Circuit[] = [];
    let scanlineY = 0;

    const COLOR_BG = '#070C18';
    const CYAN_GLOW = '#00A8E8';
    const GREEN_NEON = '#00C853';
    const BLUE_ELECTRIC = '#4CC9FE';

    const initCircuits = () => {
      setupCanvas();
      circuits = [];
      const GRID = 35;
      const cols = Math.ceil(width / GRID);
      const rows = Math.ceil(height / GRID);
      const totalCircuits = Math.floor((cols * rows) / 4);

      for (let i = 0; i < totalCircuits; i++) {
        const randLayer = Math.random();
        let layer: 'bg' | 'mid' | 'fg' = 'mid';
        let lineWidth = 1.5;

        if (randLayer > 0.8) { layer = 'fg'; lineWidth = 2.2; }
        else if (randLayer < 0.4) { layer = 'bg'; lineWidth = 1.0; }

        let currX = Math.floor(Math.random() * cols) * GRID;
        let currY = Math.floor(Math.random() * rows) * GRID;
        const points: Point[] = [{ x: currX, y: currY }];
        const length = 4 + Math.floor(Math.random() * 6);
        let dir = Math.floor(Math.random() * 8);

        for (let j = 0; j < length; j++) {
          if (Math.random() > 0.3) dir = (dir + (Math.random() > 0.5 ? 1 : 7)) % 8;
          const step = GRID * (Math.random() > 0.5 ? 1 : 2);

          switch (dir) {
            case 0: currX += step; break;
            case 1: currX += step; currY += step; break;
            case 2: currY += step; break;
            case 3: currX -= step; currY += step; break;
            case 4: currX -= step; break;
            case 5: currX -= step; currY -= step; break;
            case 6: currY -= step; break;
            case 7: currX += step; currY -= step; break;
          }

          currX = Math.max(GRID, Math.min(width - GRID, currX));
          currY = Math.max(GRID, Math.min(height - GRID, currY));
          points.push({ x: currX, y: currY });
        }

        const pulseCount = layer === 'fg' ? 2 : 1;
        const pulses: Pulse[] = [];
        for (let p = 0; p < pulseCount; p++) {
          const speedFactor = layer === 'fg' ? 0.008 + Math.random() * 0.015 : 0.002 + Math.random() * 0.004;
          const colorChoice = Math.random();
          pulses.push({
            progress: Math.random(),
            speed: speedFactor,
            length: 0.1 + Math.random() * 0.2,
            color: colorChoice > 0.6 ? CYAN_GLOW : colorChoice > 0.3 ? BLUE_ELECTRIC : GREEN_NEON,
            glow: layer === 'fg' ? 12 : layer === 'mid' ? 6 : 0,
          });
        }

        const nodeTypes: ('circle' | 'square' | 'ring')[] = ['circle', 'square', 'ring'];
        circuits.push({
          points, layer, lineWidth,
          baseColor: layer === 'fg' ? 'rgba(0, 168, 232, 0.35)' : 'rgba(0, 168, 232, 0.15)',
          pulses,
          nodeType: nodeTypes[Math.floor(Math.random() * nodeTypes.length)],
        });
      }
    };

    initCircuits();
    const handleResize = () => initCircuits();
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.fillStyle = COLOR_BG;
      ctx.fillRect(0, 0, width, height);

      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgba(0, 168, 232, 0.04)';
      const stepGrid = 40;
      ctx.beginPath();
      for (let x = 0; x < width; x += stepGrid) { ctx.moveTo(x, 0); ctx.lineTo(x, height); }
      for (let y = 0; y < height; y += stepGrid) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
      ctx.stroke();

      ['bg', 'mid', 'fg'].forEach((currentLayer) => {
        const layerCircuits = circuits.filter((c) => c.layer === currentLayer);
        layerCircuits.forEach((circuit) => {
          ctx.lineWidth = circuit.lineWidth;
          ctx.strokeStyle = circuit.baseColor;
          ctx.beginPath();
          circuit.points.forEach((pt, index) => {
            if (index === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          });
          ctx.stroke();

          const first = circuit.points[0];
          const last = circuit.points[circuit.points.length - 1];
          [first, last].forEach((node) => {
            ctx.fillStyle = circuit.layer === 'fg' ? CYAN_GLOW : 'rgba(0, 168, 232, 0.4)';
            if (circuit.nodeType === 'square') ctx.fillRect(node.x - 2.5, node.y - 2.5, 5, 5);
            else if (circuit.nodeType === 'ring') {
              ctx.beginPath(); ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
              ctx.strokeStyle = CYAN_GLOW; ctx.lineWidth = 1; ctx.stroke();
            } else {
              ctx.beginPath(); ctx.arc(node.x, node.y, 2.5, 0, Math.PI * 2); ctx.fill();
            }
          });

          circuit.pulses.forEach((pulse) => {
            pulse.progress += pulse.speed;
            if (pulse.progress > 1) pulse.progress = 0;
            const totalSegments = circuit.points.length - 1;
            const trailSteps = 8;
            for (let i = trailSteps; i >= 0; i--) {
              const lag = (i / trailSteps) * pulse.length;
              let headProgress = pulse.progress - lag;
              if (headProgress < 0) headProgress += 1;
              const currFloat = headProgress * totalSegments;
              const segIdx = Math.min(Math.floor(currFloat), totalSegments - 1);
              const segProg = currFloat - segIdx;
              const p1 = circuit.points[segIdx];
              const p2 = circuit.points[segIdx + 1];
              if (p1 && p2) {
                const px = p1.x + (p2.x - p1.x) * segProg;
                const py = p1.y + (p2.y - p1.y) * segProg;
                const alpha = (1 - i / trailSteps) * (circuit.layer === 'fg' ? 1 : 0.6);
                const radius = (1 - i / trailSteps) * (circuit.layer === 'fg' ? 3.5 : 2) + 0.5;

                ctx.save();
                if (pulse.glow > 0 && i === 0) { ctx.shadowBlur = pulse.glow; ctx.shadowColor = pulse.color; }
                ctx.fillStyle = pulse.color; ctx.globalAlpha = alpha;
                ctx.beginPath(); ctx.arc(px, py, radius, 0, Math.PI * 2); ctx.fill();
                ctx.restore();
              }
            }
          });
        });
      });

      scanlineY += 1.8;
      if (scanlineY > height) scanlineY = 0;
      const scanGradient = ctx.createLinearGradient(0, scanlineY - 20, 0, scanlineY + 5);
      scanGradient.addColorStop(0, 'rgba(0, 168, 232, 0)');
      scanGradient.addColorStop(0.8, 'rgba(0, 168, 232, 0.08)');
      scanGradient.addColorStop(1, 'rgba(0, 168, 232, 0.25)');
      ctx.fillStyle = scanGradient;
      ctx.fillRect(0, scanlineY - 20, width, 25);

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Autenticando ${userType.toUpperCase()}: ${emailOrDoc}`);
  };

  return (
    <div style={styles.container}>
      <canvas ref={canvasRef} style={styles.canvas} />

      <main style={styles.content}>
        <div style={styles.logoWrapper} onClick={() => router.push('/')}>
          <div style={styles.outerRing} />
          <img src={logoImg} alt="EasyFace Logo" style={styles.logo} />
        </div>

        <h1 style={styles.title}>EASYFACE</h1>
        <p style={styles.subtitle}>AUTENTICAÇÃO DE ACESSO</p>

        <div style={styles.tabContainer}>
          <button
            type="button"
            style={{ ...styles.tabButton, ...(userType === 'participante' ? styles.tabActive : {}) }}
            onClick={() => setUserType('participante')}
          >
            PARTICIPANTE
          </button>
          <button
            type="button"
            style={{ ...styles.tabButton, ...(userType === 'fornecedor' ? styles.tabActive : {}) }}
            onClick={() => setUserType('fornecedor')}
          >
            FORNECEDOR
          </button>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              {userType === 'participante' ? 'CPF OU E-MAIL' : 'CNPJ OU E-MAIL'}
            </label>
            <input
              type="text"
              required
              placeholder={userType === 'participante' ? '000.000.000-00 ou email@exemplo.com' : '00.000.000/0001-00 ou email@empresa.com'}
              value={emailOrDoc}
              onChange={(e) => setEmailOrDoc(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>SENHA</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            style={styles.button}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 168, 232, 0.9)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 168, 232, 0.4)';
            }}
          >
            ENTRAR COMO {userType.toUpperCase()}
          </button>
        </form>

        <div style={styles.footerText}>
          Não está logado?{' '}
          <span style={styles.linkText} onClick={() => router.push('/registro')}>
            Registre-se
          </span>
        </div>
      </main>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'relative',
    width: '100vw',
    minHeight: '100vh',
    overflow: 'hidden',
    backgroundColor: '#070C18',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Inter', system-ui, sans-serif",
    padding: '20px',
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  content: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 36px',
    borderRadius: '28px',
    backgroundColor: 'rgba(7, 12, 24, 0.75)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(0, 168, 232, 0.3)',
    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.7), inset 0 0 20px rgba(0, 168, 232, 0.1)',
    maxWidth: '410px',
    width: '100%',
  },
  logoWrapper: {
    position: 'relative',
    width: '100px',
    height: '100px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  outerRing: {
    position: 'absolute',
    width: '112px',
    height: '112px',
    borderRadius: '50%',
    border: '1.5px dashed rgba(0, 168, 232, 0.5)',
  },
  logo: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #00A8E8',
    boxShadow: '0 0 20px rgba(0, 168, 232, 0.6)',
  },
  title: {
    margin: '0 0 4px 0',
    fontSize: '2rem',
    fontWeight: 900,
    color: '#FFFFFF',
    letterSpacing: '4px',
    textShadow: '0 0 15px rgba(0, 168, 232, 0.7)',
  },
  subtitle: {
    margin: '0 0 24px 0',
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#00A8E8',
    letterSpacing: '2px',
  },
  tabContainer: {
    display: 'flex',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: '12px',
    padding: '4px',
    marginBottom: '24px',
    border: '1px solid rgba(0, 168, 232, 0.2)',
  },
  tabButton: {
    flex: 1,
    padding: '10px 0',
    fontSize: '0.72rem',
    fontWeight: 800,
    color: '#A0AAB5',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    letterSpacing: '1px',
    transition: 'all 0.3s ease',
  },
  tabActive: {
    color: '#FFFFFF',
    backgroundColor: '#00A8E8',
    boxShadow: '0 0 15px rgba(0, 168, 232, 0.5)',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '0.68rem',
    color: '#00A8E8',
    fontWeight: 800,
    letterSpacing: '1px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '0.88rem',
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(0, 168, 232, 0.3)',
    borderRadius: '10px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  button: {
    marginTop: '8px',
    width: '100%',
    padding: '15px',
    fontSize: '0.9rem',
    fontWeight: 800,
    color: '#FFFFFF',
    backgroundColor: '#00A8E8',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    letterSpacing: '1.5px',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 0 20px rgba(0, 168, 232, 0.4)',
  },
  footerText: {
    marginTop: '24px',
    fontSize: '0.8rem',
    color: '#A0AAB5',
  },
  linkText: {
    color: '#00A8E8',
    fontWeight: 800,
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};