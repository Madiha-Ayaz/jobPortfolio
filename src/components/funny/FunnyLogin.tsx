import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

const CORRECT_USER = 'student';
const CORRECT_PASS = '1234';

const toasts = [
  'Invalid credentials. Please retry.',
  'Authentication failed.',
  'Catch the button — if you can.',
  'Access denied.',
  'Wrong credentials again.',
  'Still incorrect.',
];

const randomToast = (count: number) => toasts[Math.min(count - 1, toasts.length - 1)];

const FunnyLogin: React.FC = () => {
  const appRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const charCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const bagCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [bagOpen, setBagOpen] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [speechText, setSpeechText] = useState('');
  const [speechVisible, setSpeechVisible] = useState(false);
  const [toastText, setToastText] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [escapeVisible, setEscapeVisible] = useState(false);
  const [escapePosition, setEscapePosition] = useState({ left: 'calc(50% - 60px)', top: '260px' });
  const [loginLabel, setLoginLabel] = useState('Sign In');
  const [successVisible, setSuccessVisible] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [charState, setCharState] = useState<'idle' | 'squint' | 'happy'>('idle');

  const wrongCountRef = useRef(0);
  const bagFlapRef = useRef(0);
  const bagFlapTargetRef = useRef(0);
  const tickRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setSpeech('Good morning. Click the backpack. 💼', 3500), 1200);
  }, []);

  const setSpeech = useCallback((msg: string, duration = 2000) => {
    setSpeechText(msg);
    setSpeechVisible(true);
    if (duration > 0) {
      window.setTimeout(() => {
        setSpeechVisible(false);
      }, duration);
    }
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastText(msg);
    setToastVisible(true);
    window.setTimeout(() => setToastVisible(false), 2200);
  }, []);

  const moveEscapeBtn = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const margin = 80;
    const x = margin + Math.random() * (rect.width - margin * 2 - 120);
    const y = margin + Math.random() * (rect.height - margin * 2 - 40);
    setEscapePosition({ left: `${x}px`, top: `${y}px` });
  }, []);

  const openBag = () => {
    if (bagOpen) return;
    setBagOpen(true);
    bagFlapTargetRef.current = 1;
    setHintVisible(false);
    setSpeech('Welcome back, student! 🎒', 3000);
    window.setTimeout(() => setFormVisible(true), 500);
  };

  const validate = () => username.trim() === CORRECT_USER && password === CORRECT_PASS;

  const wrongFlow = () => {
    setWrongCount((count) => {
      const next = count + 1;
      wrongCountRef.current = next;
      return next;
    });
    setSpeech('Invalid credentials... 🔒', 2000);
    setCharState('squint');
    window.setTimeout(() => setCharState('idle'), 1000);
    showToast(randomToast(wrongCountRef.current));

    if (wrongCountRef.current >= 2) {
      if (!escapeVisible) {
        setEscapeVisible(true);
      }
      moveEscapeBtn();
    }
  };

  const successFlow = () => {
    setCharState('happy');
    setSpeech('Access granted! Welcome back, student! 🎉', 3000);
    setLoginLabel('Verified ✓');
    setLoginSuccess(true);
    window.setTimeout(() => {
      setFormVisible(false);
      bagFlapTargetRef.current = 0;
      setBagOpen(false);
    }, 1600);
    window.setTimeout(() => {
      launchConfetti();
      setSuccessVisible(true);
    }, 2400);
    window.setTimeout(() => navigate('/'), 5000);
  };

  const signInWithGoogle = async () => {
    if (loading || loginSuccess) return;
    setErrorMessage('');
    if (!auth) {
      setErrorMessage('Firebase is not configured yet.');
      return;
    }

    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      successFlow();
    } catch (error) {
      setErrorMessage('Google sign-in failed. Please try again.');
      wrongFlow();
    } finally {
      setLoading(false);
    }
  };

  const doLogin = async (event?: React.FormEvent) => {
    event?.preventDefault();
    if (loading || loginSuccess) return;
    setErrorMessage('');

    if (auth) {
      if (!username || !password) {
        setErrorMessage('Please enter both email and password.');
        return;
      }

      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, username, password);
        successFlow();
      } catch (error) {
        setErrorMessage('Sign-in failed. Check your email/password or use Google.');
        wrongFlow();
      } finally {
        setLoading(false);
      }
      return;
    }

    if (validate()) {
      successFlow();
    } else {
      wrongFlow();
    }
  };

  const launchConfetti = () => {
    const colors = ['#3b82f6', '#c9a84c', '#22c55e', '#a78bfa', '#f87171', '#60a5fa', '#fbbf24'];
    const container = appRef.current;
    if (!container) return;
    for (let i = 0; i < 70; i += 1) {
      window.setTimeout(() => {
        const d = document.createElement('div');
        d.className = 'conf';
        d.style.setProperty('--d', `${1.2 + Math.random() * 1.5}s`);
        d.style.setProperty('--dl', `${Math.random() * 0.4}s`);
        d.style.left = `${Math.random() * 100}%`;
        d.style.top = '0';
        d.style.background = colors[i % colors.length];
        d.style.width = `${6 + Math.random() * 8}px`;
        d.style.height = `${6 + Math.random() * 8}px`;
        d.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        container.appendChild(d);
        window.setTimeout(() => d.remove(), 3000);
      }, i * 35);
    }
  };

  const handleStageMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!escapeVisible) return;
    const escapeX = parseFloat(escapePosition.left);
    const escapeY = parseFloat(escapePosition.top);
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const dx = mouseX - (escapeX + 60);
    const dy = mouseY - (escapeY + 20);
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      moveEscapeBtn();
    }
  };

  useEffect(() => {
    const keyHandler = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && bagOpen) {
        doLogin();
      }
    };
    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [bagOpen]);

  useLayoutEffect(() => {
    const charCanvas = charCanvasRef.current;
    const bagCanvas = bagCanvasRef.current;
    if (!charCanvas || !bagCanvas) return;
    const cctx = charCanvas.getContext('2d');
    const bctx = bagCanvas.getContext('2d');
    if (!cctx || !bctx) return;

    const draw3DRect = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      mainC: string,
      darkC: string,
      lightC: string,
    ) => {
      ctx.fillStyle = darkC;
      ctx.beginPath();
      ctx.roundRect(x + 4, y + 4, w, h, 4);
      ctx.fill();
      ctx.fillStyle = mainC;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 4);
      ctx.fill();
      ctx.fillStyle = lightC;
      ctx.globalAlpha = 0.25;
      ctx.fillRect(x + 2, y + 2, w * 0.4, h * 0.6);
      ctx.globalAlpha = 1;
    };

    const drawShoe = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      c: string,
    ) => {
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.ellipse(x + w / 2 + 4, y + h + 3, w / 2, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, { upperLeft: 3, upperRight: 3, lowerRight: 8, lowerLeft: 4 });
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fillRect(x + 2, y + 2, w - 4, 4);
    };

    const drawEye = (
      ctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      scaleY: number,
      state: 'idle' | 'squint' | 'happy',
    ) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, scaleY);
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.ellipse(0, 0, 9, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1e3a8a';
      ctx.beginPath();
      ctx.ellipse(1, 0, 6, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.ellipse(1, 0, 3, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.beginPath();
      ctx.ellipse(2, -2, 2, 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawHead = (
      ctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      blinkT: number,
      state: 'idle' | 'squint' | 'happy',
    ) => {
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.beginPath();
      ctx.ellipse(cx + 4, cy + 4, 34, 38, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f0c090';
      ctx.beginPath();
      ctx.ellipse(cx, cy, 34, 38, 0, 0, Math.PI * 2);
      ctx.fill();
      const grad = ctx.createLinearGradient(cx - 34, cy, cx + 34, cy);
      grad.addColorStop(0, 'rgba(0,0,0,0.12)');
      grad.addColorStop(0.5, 'rgba(255,255,255,0.08)');
      grad.addColorStop(1, 'rgba(0,0,0,0.1)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 34, 38, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#3d2000';
      ctx.beginPath();
      ctx.ellipse(cx, cy - 22, 34, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(cx - 34, cy - 38, 68, 28, { upperLeft: 34, upperRight: 34, lowerLeft: 0, lowerRight: 0 });
      ctx.fill();
      ctx.fillStyle = '#e8b07a';
      ctx.beginPath();
      ctx.ellipse(cx - 34, cy, 8, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + 34, cy, 8, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#3d2000';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx - 20, cy - 14);
      ctx.quadraticCurveTo(cx - 12, cy - 18, cx - 4, cy - 14);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 4, cy - 14);
      ctx.quadraticCurveTo(cx + 12, cy - 18, cx + 20, cy - 14);
      ctx.stroke();
      if (state === 'happy') {
        ctx.strokeStyle = '#3d2000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - 22, cy - 14);
        ctx.quadraticCurveTo(cx - 14, cy - 22, cx - 5, cy - 15);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + 5, cy - 15);
        ctx.quadraticCurveTo(cx + 14, cy - 22, cx + 22, cy - 14);
        ctx.stroke();
      }
      const eyeScaleY = state === 'squint' ? 0.3 : 1 - blinkT * 0.95;
      drawEye(ctx, cx - 14, cy - 4, eyeScaleY, state);
      drawEye(ctx, cx + 14, cy - 4, eyeScaleY, state);
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 6, 4, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.beginPath();
      ctx.ellipse(cx - 4, cy + 8, 3, 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + 4, cy + 8, 3, 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#c0704a';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      if (state === 'happy') {
        ctx.beginPath();
        ctx.moveTo(cx - 14, cy + 18);
        ctx.quadraticCurveTo(cx, cy + 28, cx + 14, cy + 18);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255,100,100,0.3)';
        ctx.beginPath();
        ctx.ellipse(cx - 22, cy + 16, 9, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + 22, cy + 16, 9, 6, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(cx - 12, cy + 20);
        ctx.quadraticCurveTo(cx, cy + 25, cx + 12, cy + 20);
        ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cx - 24, cy - 10, 20, 14, 5);
      ctx.stroke();
      ctx.beginPath();
      ctx.roundRect(cx + 4, cy - 10, 20, 14, 5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 4, cy - 5);
      ctx.lineTo(cx + 4, cy - 5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 24, cy - 5);
      ctx.lineTo(cx - 30, cy - 8);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 24, cy - 5);
      ctx.lineTo(cx + 30, cy - 8);
      ctx.stroke();
    };

    const drawArm = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      happy: boolean,
      t: number,
      swing: number,
      right: boolean,
    ) => {
      const rotDir = right ? 1 : -1;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(swing * 0.02 + rotDir * (happy ? Math.sin(t * 0.15) * 0.3 : 0));
      ctx.fillStyle = '#1d4ed8';
      ctx.beginPath();
      ctx.roundRect(-10, 0, 20, 55, 8);
      ctx.fill();
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(-10, 0, 6, 55);
      ctx.fillStyle = '#e2a87a';
      ctx.beginPath();
      ctx.roundRect(-12, 52, 22, 20, 9);
      ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillRect(-12, 52, 8, 20);
      ctx.restore();
    };

    const drawChar = (t: number) => {
      cctx.clearRect(0, 0, 200, 360);
      const breathY = Math.sin(t * 0.04) * 2.5;
      const blinkT = t % 180 < 8 ? Math.max(0, 1 - Math.abs((t % 180) - 4) / 4) : 0;
      cctx.save();
      cctx.beginPath();
      cctx.ellipse(100, 348, 50, 10, 0, 0, Math.PI * 2);
      cctx.fillStyle = 'rgba(0,0,0,0.35)';
      cctx.fill();
      cctx.restore();
      const by = breathY + (charState === 'happy' ? Math.sin(t * 0.15) * 6 : 0);
      cctx.save();
      cctx.translate(0, by);
      drawShoe(cctx, 72, 330, 32, 14, '#1e293b');
      drawShoe(cctx, 112, 330, 32, 14, '#1e293b');
      draw3DRect(cctx, 78, 245, 22, 88, '#334155', '#1e293b', '#475569');
      draw3DRect(cctx, 112, 245, 22, 88, '#334155', '#1e293b', '#475569');
      cctx.fillStyle = '#0f172a';
      cctx.beginPath();
      cctx.roundRect(70, 238, 72, 14, 4);
      cctx.fill();
      cctx.fillStyle = '#c9a84c';
      cctx.beginPath();
      cctx.roundRect(95, 240, 22, 10, 3);
      cctx.fill();
      cctx.fillStyle = '#fbbf24';
      cctx.beginPath();
      cctx.roundRect(100, 242, 12, 6, 2);
      cctx.fill();
      draw3DRect(cctx, 68, 155, 76, 90, '#1d4ed8', '#1e3a8a', '#3b82f6');
      cctx.fillStyle = '#1e3a8a';
      cctx.beginPath();
      cctx.moveTo(106, 158);
      cctx.lineTo(94, 190);
      cctx.lineTo(100, 190);
      cctx.lineTo(106, 165);
      cctx.fill();
      cctx.beginPath();
      cctx.moveTo(106, 158);
      cctx.lineTo(118, 190);
      cctx.lineTo(112, 190);
      cctx.lineTo(106, 165);
      cctx.fill();
      cctx.fillStyle = '#c9a84c';
      cctx.beginPath();
      cctx.moveTo(102, 168);
      cctx.lineTo(110, 168);
      cctx.lineTo(112, 215);
      cctx.lineTo(106, 222);
      cctx.lineTo(100, 215);
      cctx.fill();
      cctx.fillStyle = 'rgba(255,255,255,0.1)';
      cctx.beginPath();
      cctx.roundRect(72, 175, 18, 14, 3);
      cctx.fill();
      cctx.fillStyle = '#e2e8f0';
      cctx.fillRect(76, 173, 10, 4);
      const armSwing = Math.sin(t * 0.03) * 4;
      drawArm(cctx, 144, 168, charState === 'happy', t, armSwing, true);
      drawArm(cctx, 68, 168, charState === 'happy', t, -armSwing, false);
      cctx.fillStyle = '#e2a87a';
      cctx.beginPath();
      cctx.roundRect(98, 138, 16, 22, 5);
      cctx.fill();
      cctx.fillStyle = 'rgba(0,0,0,0.15)';
      cctx.fillRect(98, 138, 6, 22);
      drawHead(cctx, 106, 110, blinkT, charState);
      cctx.restore();
    };

    const drawBag = (t: number) => {
      bctx.clearRect(0, 0, 160, 130);
      bagFlapRef.current += (bagFlapTargetRef.current - bagFlapRef.current) * 0.08;
      const idle = Math.sin(t * 0.04) * 1.5;
      bctx.save();
      bctx.translate(0, idle);
      bctx.fillStyle = 'rgba(0,0,0,0.25)';
      bctx.beginPath();
      bctx.ellipse(80, 122, 55, 10, 0, 0, Math.PI * 2);
      bctx.fill();
      bctx.fillStyle = '#1e3a8a';
      bctx.beginPath();
      bctx.roundRect(14, 28, 124, 84, 8);
      bctx.fill();
      bctx.fillStyle = '#1d4ed8';
      bctx.beginPath();
      bctx.roundRect(10, 24, 120, 84, 8);
      bctx.fill();
      const bodyGrad = bctx.createLinearGradient(10, 24, 130, 24);
      bodyGrad.addColorStop(0, 'rgba(255,255,255,0.12)');
      bodyGrad.addColorStop(0.5, 'rgba(255,255,255,0.04)');
      bodyGrad.addColorStop(1, 'rgba(0,0,0,0.1)');
      bctx.fillStyle = bodyGrad;
      bctx.beginPath();
      bctx.roundRect(10, 24, 120, 84, 8);
      bctx.fill();
      bctx.strokeStyle = '#c9a84c';
      bctx.lineWidth = 2;
      bctx.beginPath();
      bctx.roundRect(10, 24, 120, 84, 8);
      bctx.stroke();
      bctx.strokeStyle = 'rgba(201,168,76,0.4)';
      bctx.lineWidth = 1;
      bctx.beginPath();
      bctx.moveTo(10, 58);
      bctx.lineTo(130, 58);
      bctx.stroke();
      bctx.fillStyle = '#c9a84c';
      bctx.beginPath();
      bctx.roundRect(62, 50, 16, 16, 4);
      bctx.fill();
      bctx.fillStyle = '#fbbf24';
      bctx.beginPath();
      bctx.roundRect(66, 54, 8, 8, 2);
      bctx.fill();
      bctx.fillStyle = 'rgba(0,0,0,0.4)';
      bctx.beginPath();
      bctx.ellipse(70, 57, 2.5, 2.5, 0, 0, Math.PI * 2);
      bctx.fill();
      bctx.fillRect(69, 58, 3, 4);
      bctx.fillStyle = '#c9a84c';
      bctx.beginPath();
      bctx.roundRect(20, 54, 10, 8, 2);
      bctx.fill();
      bctx.beginPath();
      bctx.roundRect(110, 54, 10, 8, 2);
      bctx.fill();
      bctx.strokeStyle = '#c9a84c';
      bctx.lineWidth = 3;
      bctx.lineCap = 'round';
      bctx.beginPath();
      bctx.moveTo(52, 24);
      bctx.quadraticCurveTo(52, 8, 70, 8);
      bctx.quadraticCurveTo(88, 8, 88, 24);
      bctx.stroke();
      bctx.strokeStyle = '#3b82f6';
      bctx.lineWidth = 6;
      bctx.beginPath();
      bctx.moveTo(58, 14);
      bctx.lineTo(82, 14);
      bctx.stroke();
      bctx.strokeStyle = '#c9a84c';
      bctx.lineWidth = 2;
      bctx.beginPath();
      bctx.moveTo(58, 14);
      bctx.lineTo(82, 14);
      bctx.stroke();
      bctx.fillStyle = 'rgba(255,255,255,0.06)';
      bctx.beginPath();
      bctx.roundRect(20, 68, 36, 32, 4);
      bctx.fill();
      bctx.beginPath();
      bctx.roundRect(84, 68, 36, 32, 4);
      bctx.fill();

      if (bagFlapRef.current > 0.01) {
        bctx.save();
        bctx.translate(70, 24);
        bctx.rotate(-bagFlapRef.current * (Math.PI / 3));
        bctx.fillStyle = '#1d4ed8';
        bctx.beginPath();
        bctx.roundRect(-60, -34, 120, 36, { upperLeft: 8, upperRight: 8, lowerLeft: 0, lowerRight: 0 });
        bctx.fill();
        const lidGrad = bctx.createLinearGradient(-60, -34, 60, -34);
        lidGrad.addColorStop(0, 'rgba(255,255,255,0.15)');
        lidGrad.addColorStop(1, 'rgba(0,0,0,0.1)');
        bctx.fillStyle = lidGrad;
        bctx.beginPath();
        bctx.roundRect(-60, -34, 120, 36, { upperLeft: 8, upperRight: 8, lowerLeft: 0, lowerRight: 0 });
        bctx.fill();
        bctx.strokeStyle = '#c9a84c';
        bctx.lineWidth = 2;
        bctx.beginPath();
        bctx.roundRect(-60, -34, 120, 36, { upperLeft: 8, upperRight: 8, lowerLeft: 0, lowerRight: 0 });
        bctx.stroke();
        if (bagFlapRef.current > 0.3) {
          const a = Math.min(1, (bagFlapRef.current - 0.3) / 0.5);
          bctx.fillStyle = `rgba(59,130,246,${0.15 * a})`;
          bctx.beginPath();
          bctx.roundRect(-58, 0, 116, 30, { lowerLeft: 0, lowerRight: 0 });
          bctx.fill();
        }
        bctx.restore();
      }
      bctx.restore();
    };

    const loop = () => {
      tickRef.current += 1;
      drawChar(tickRef.current);
      drawBag(tickRef.current);
      animFrameRef.current = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [charState]);

  return (
    <div ref={appRef} className="login-scene-root">
      <div id="app">
        <div id="bg-grid" />
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />

        <div id="stage" ref={stageRef} onMouseMove={handleStageMouseMove}>
          <div id="floor">
            <div className="floor-line" style={{ bottom: '40px' }} />
            <div className="floor-line" style={{ bottom: '80px', opacity: 0.5 }} />
            <div className="floor-line" style={{ bottom: '120px', opacity: 0.25 }} />
          </div>

          <canvas id="char-canvas" ref={charCanvasRef} width={200} height={360} />

          <div
            id="briefcase-wrap"
            role="button"
            tabIndex={0}
            onClick={openBag}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') openBag();
            }}
          >
            <canvas id="bag-canvas" ref={bagCanvasRef} width={160} height={130} />
          </div>

          {hintVisible && <div id="bag-hint">Click to open</div>}

          <div id="speech" className={speechVisible ? 'show' : ''}>
            {speechText}
          </div>

          <div id="form-panel" className={formVisible ? 'visible' : ''}>
            <div className="glass-card">
              <div className="card-header">
                <div className="card-logo">S</div>
                <div>
                  <div className="card-title">Campus Portal</div>
                  <div className="card-sub">Student access with personality</div>
                </div>
              </div>
              <div className="field-group">
                <label className="field-label" htmlFor="username">Email address</label>
                <input
                  className="field-input"
                  id="username"
                  type="email"
                  placeholder="student@example.com"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </div>
              <div className="field-group">
                <label className="field-label" htmlFor="password">Password</label>
                <input
                  className="field-input"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              <div className="hint-row">
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ accentColor: '#3b82f6' }} />
                  <span className="hint-text">Keep me signed in</span>
                </label>
                <span className="hint-link">Forgot password?</span>
              </div>
              {errorMessage && <div id="error-msg">{errorMessage}</div>}
              <button
                id="login-btn"
                type="button"
                onClick={doLogin}
                disabled={escapeVisible || loginSuccess || loading}
                style={{ display: escapeVisible || loginSuccess ? 'none' : 'block' }}
              >
                {loading ? 'Signing in...' : loginLabel}
              </button>
              <button
                id="google-btn"
                type="button"
                onClick={signInWithGoogle}
                disabled={loading || loginSuccess}
              >
                Continue with Google
              </button>
            </div>
          </div>

          <button
            id="escape-btn"
            type="button"
            onMouseEnter={moveEscapeBtn}
            onClick={moveEscapeBtn}
            style={{ display: escapeVisible ? 'block' : 'none', left: escapePosition.left, top: escapePosition.top }}
          >
            Sign In →
          </button>
        </div>

        <div id="toast" className={toastVisible ? 'show' : ''}>{toastText}</div>

        <div id="success-screen" className={successVisible ? 'show' : ''}>
          <div className="success-icon">✓</div>
          <div className="success-title">Welcome Back, Student! 🎉</div>
          <div className="success-sub">Redirecting to your dashboard...</div>
          <div className="progress-bar">
            <div className="progress-fill" />
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        .login-scene-root{min-height:100vh;background:var(--navy);font-family:'DM Sans',sans-serif;color:var(--text);position:relative;overflow:hidden;}
        :root{--navy:#0a0f1e;--navy2:#0d1528;--panel:#111827;--glass:rgba(255,255,255,0.04);--glass2:rgba(255,255,255,0.07);--border:rgba(255,255,255,0.08);--border2:rgba(255,255,255,0.14);--gold:#c9a84c;--gold2:#e8c96a;--blue:#3b82f6;--blue2:#60a5fa;--text:#f8fafc;--muted:#94a3b8;--muted2:#64748b;--green:#22c55e;--red:#ef4444;}
        body{min-height:100vh;background:var(--navy);font-family:'DM Sans',sans-serif;color:var(--text);overflow:hidden;position:relative;}
        #app{width:100%;min-height:100vh;position:relative;display:flex;align-items:center;justify-content:center;perspective:1200px;}
        #bg-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px);background-size:40px 40px;mask-image:radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);}
        .orb{position:absolute;border-radius:50%;filter:blur(60px);pointer-events:none;animation:orb-drift 8s ease-in-out infinite alternate;}
        .orb1{width:300px;height:300px;background:rgba(59,130,246,0.12);top:-60px;left:-60px;animation-delay:0s}
        .orb2{width:250px;height:250px;background:rgba(201,168,76,0.08);bottom:-40px;right:-40px;animation-delay:-4s}
        .orb3{width:180px;height:180px;background:rgba(139,92,246,0.08);top:50%;right:15%;animation-delay:-2s}
        @keyframes orb-drift{from{transform:translate(0,0)}to{transform:translate(20px,15px)}}
        #stage{position:relative;width:800px;max-width:100%;height:560px;display:flex;align-items:flex-end;justify-content:center;gap:0;}
        #floor{position:absolute;bottom:0;left:0;right:0;height:160px;background:linear-gradient(to top, rgba(15,23,42,0.9), transparent);transform:perspective(800px) rotateX(60deg);transform-origin:bottom center;}
        .floor-line{position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(59,130,246,0.2),transparent);}
        #char-canvas{position:absolute;left:50%;bottom:60px;transform:translateX(calc(-50% - 120px));width:200px;height:360px;}
        #briefcase-wrap{position:absolute;right:calc(50% - 230px);bottom:55px;width:160px;height:130px;cursor:pointer;transform-style:preserve-3d;transition:transform 0.4s ease;}
        #briefcase-wrap:hover{transform:scale(1.04) translateY(-4px)}
        #form-panel{position:absolute;left:50%;bottom:80px;transform:translateX(calc(-50% + 60px)) translateY(30px);width:300px;opacity:0;pointer-events:none;transition:all 0.6s cubic-bezier(0.34,1.56,0.64,1);transform-style:preserve-3d;z-index:20;}
        #form-panel.visible{opacity:1;pointer-events:all;transform:translateX(calc(-50% + 60px)) translateY(0);}
        .glass-card{background:rgba(17,24,39,0.9);backdrop-filter:blur(20px);border:1px solid var(--border2);border-radius:20px;padding:28px;box-shadow:0 0 0 1px rgba(255,255,255,0.05) inset,0 40px 80px rgba(0,0,0,0.6),0 0 40px rgba(59,130,246,0.08);}
        .card-header{display:flex;align-items:center;gap:12px;margin-bottom:24px;padding-bottom:18px;border-bottom:1px solid var(--border);}
        .card-logo{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#1d4ed8,#3b82f6);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:#fff;box-shadow:0 4px 12px rgba(59,130,246,0.3);}
        .card-title{font-size:15px;font-weight:600;color:var(--text)}
        .card-sub{font-size:11px;color:var(--muted);margin-top:2px;letter-spacing:0.03em}
        .field-group{margin-bottom:16px}
        .field-label{font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;display:block;}
        .field-input{width:100%;padding:11px 14px;background:rgba(255,255,255,0.05);border:1px solid var(--border2);border-radius:10px;font-size:13px;color:var(--text);font-family:'DM Sans',sans-serif;transition:border-color 0.2s,background 0.2s,box-shadow 0.2s;outline:none;}
        .field-input:focus{border-color:rgba(59,130,246,0.6);background:rgba(59,130,246,0.06);box-shadow:0 0 0 3px rgba(59,130,246,0.12);}
        .field-input::placeholder{color:var(--muted2);font-size:12px}
        .hint-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;}
        .hint-text{font-size:11px;color:var(--muted2)}
        .hint-link{font-size:11px;color:var(--blue2);cursor:pointer}
        #login-btn{width:100%;padding:13px;background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:600;font-family:'DM Sans',sans-serif;cursor:pointer;letter-spacing:0.02em;transition:transform 0.15s,box-shadow 0.15s,opacity 0.15s;box-shadow:0 4px 20px rgba(59,130,246,0.3);position:relative;overflow:hidden;}
        #login-btn::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.1),transparent);pointer-events:none;}
        #login-btn:hover{transform:translateY(-1px);box-shadow:0 6px 24px rgba(59,130,246,0.4)}
        #login-btn:active{transform:scale(0.98)}
        #login-btn.loading{opacity:0.7;pointer-events:none}
        #google-btn{width:100%;padding:13px;margin-top:12px;background:#fff;color:#0f172a;border:none;border-radius:10px;font-size:14px;font-weight:600;font-family:'DM Sans',sans-serif;cursor:pointer;letter-spacing:0.02em;transition:transform 0.15s,box-shadow 0.15s,opacity 0.15s;box-shadow:0 4px 20px rgba(15,23,42,0.12);}
        #google-btn:hover{transform:translateY(-1px);box-shadow:0 6px 24px rgba(15,23,42,0.22)}
        #google-btn:active{transform:scale(0.98)}
        #google-btn:disabled{opacity:0.65;cursor:not-allowed}
        #error-msg{margin-bottom:12px;padding:11px 14px;background:rgba(220,38,38,0.14);border:1px solid rgba(220,38,38,0.18);border-radius:10px;color:#fca5a5;font-size:13px;}
        #escape-btn{position:absolute;width:120px;height:40px;background:linear-gradient(135deg,#dc2626,#ef4444);color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:600;font-family:'DM Sans',sans-serif;cursor:pointer;box-shadow:0 4px 16px rgba(220,38,38,0.35);z-index:50;transition:box-shadow 0.2s;}
        #toast{position:absolute;top:20px;left:50%;transform:translateX(-50%) translateY(-20px);background:rgba(17,24,39,0.95);border:1px solid var(--border2);border-radius:12px;padding:10px 18px;font-size:13px;color:var(--text);white-space:nowrap;opacity:0;transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);z-index:100;box-shadow:0 8px 32px rgba(0,0,0,0.4);}
        #toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
        #bag-hint{position:absolute;right:calc(50% - 280px);bottom:190px;font-size:12px;color:var(--muted);font-weight:500;letter-spacing:0.04em;animation:hint-pulse 2s ease-in-out infinite;pointer-events:none;}
        @keyframes hint-pulse{0%,100%{opacity:0.5;transform:translateY(0)}50%{opacity:1;transform:translateY(-4px)}}
        #success-screen{position:absolute;inset:0;background:rgba(10,15,30,0.97);display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity 0.6s ease;z-index:200;}
        #success-screen.show{opacity:1;pointer-events:all}
        .success-icon{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#059669,#22c55e);display:flex;align-items:center;justify-content:center;font-size:32px;animation:success-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) both;box-shadow:0 0 40px rgba(34,197,94,0.3);margin-bottom:20px;}
        @keyframes success-pop{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}
        .success-title{font-size:32px;font-weight:700;background:linear-gradient(135deg,#f8fafc,#94a3b8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px;animation:fade-up 0.5s 0.2s both;}
        .success-sub{font-size:14px;color:var(--muted);animation:fade-up 0.5s 0.35s both;}
        @keyframes fade-up{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
        .progress-bar{width:200px;height:2px;background:rgba(255,255,255,0.1);border-radius:2px;margin-top:28px;overflow:hidden;animation:fade-up 0.5s 0.5s both;}
        .progress-fill{height:100%;width:0;background:linear-gradient(90deg,#3b82f6,#22c55e);animation:fill-bar 2.5s 0.8s ease-out forwards;}
        @keyframes fill-bar{to{width:100%}}
        .conf{position:absolute;width:8px;height:8px;border-radius:2px;animation:conf-fall var(--d) var(--dl) ease-in forwards;pointer-events:none;z-index:190;}
        @keyframes conf-fall{0%{transform:translateY(-10px) rotate(0);opacity:1}100%{transform:translateY(700px) rotate(540deg);opacity:0}}
        #speech{position:absolute;background:rgba(17,24,39,0.95);border:1px solid var(--border2);border-radius:12px;padding:8px 14px;font-size:12px;font-weight:500;color:var(--text);white-space:nowrap;opacity:0;transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);pointer-events:none;z-index:30;left:calc(50% - 300px);bottom:380px;box-shadow:0 8px 24px rgba(0,0,0,0.4);}
        #speech.show{opacity:1;transform:translateY(-4px)}
        #speech::after{content:'';position:absolute;bottom:-7px;left:20px;width:12px;height:7px;background:rgba(17,24,39,0.95);clip-path:polygon(0 0,100% 0,50% 100%);border-left:1px solid var(--border2);border-right:1px solid var(--border2);}
      `}</style>
    </div>
  );
};

export default FunnyLogin;
