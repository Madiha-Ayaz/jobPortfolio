import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, signInWithGoogle as firebaseSignInWithGoogle } from '@/lib/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Sparkles, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import PhoneAuthForm from '@/components/auth/PhoneAuthForm';
import { useAuth } from '@/context/AuthContext';

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

/* ════════════════════════════════════════════════════════════════
   CONTINUOUS 3D SCENE — aurora hub + interactive briefcase
════════════════════════════════════════════════════════════════ */
type SceneRefs = {
  open: React.MutableRefObject<number>;
  celebrate: React.MutableRefObject<boolean>;
  allowClick: React.MutableRefObject<boolean>;
  onOpen: () => void;
  signedIn: boolean;
  lowFx: boolean;
};

function BackgroundAurora({ refs }: { refs: SceneRefs }) {
  const starRef = useRef<THREE.Points>(null);

  const starPos = useMemo(() => {
    const count = 450;
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 4 + Math.random() * 9;
      a[i * 3] = Math.cos(theta) * r;
      a[i * 3 + 1] = Math.sin(theta) * r;
      a[i * 3 + 2] = -3 + Math.random() * -6;
    }
    return a;
  }, []);

  useFrame((_, delta) => {
    if (!starRef.current) return;
    starRef.current.rotation.z += delta * 0.008;
  });

  return (
    <group>
      <points ref={starRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={starPos.length / 3} array={starPos} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#99f6e4"
          transparent
          opacity={0.6}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* gyro rings behind the briefcase */}
      <mesh position={[0, -0.6, -2.6]} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[2.4, 0.012, 8, 120]} />
        <meshBasicMaterial color="#2dd4a7" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[0, -0.6, -2.6]} rotation={[Math.PI / 1.9, 0, 0.4]}>
        <torusGeometry args={[2.8, 0.01, 8, 120]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.24} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* nebula glow blobs */}
      <mesh position={[-6, 3, -7]}>
        <sphereGeometry args={[4, 16, 16]} />
        <meshBasicMaterial color="#0d9488" transparent opacity={0.05} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[6, -3, -7]}>
        <sphereGeometry args={[4.5, 16, 16]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.05} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[4, 4, -8]}>
        <sphereGeometry args={[3, 16, 16]} />
        <meshBasicMaterial color="#e879f9" transparent opacity={0.035} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

function LoginCore({ refs }: { refs: SceneRefs }) {
  const mobile = useThree((s) => s.viewport.width);
  const scale = Math.max(0.55, Math.min(1, mobile / 7));

  const root = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);
  const sats = useRef<THREE.Group>(null);
  const beam = useRef<THREE.Mesh>(null);
  const scanner = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const satRefs = useRef<(THREE.Mesh | null)[]>([]);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const open = refs.open.current;
    if (!root.current) return;

    root.current.position.y = 0.12 + Math.sin(t * 0.7) * 0.09 - open * 0.1;
    root.current.rotation.y += delta * (open ? 1.6 : 0.38);

    if (refs.celebrate.current) {
      root.current.rotation.y += delta * 2.8;
      root.current.scale.setScalar(1 + Math.sin(t * 6) * 0.04);
    } else if (hovered && !open) {
      root.current.scale.setScalar(1.06 + Math.sin(t * 2) * 0.012);
    } else if (open) {
      root.current.scale.setScalar(1 + Math.sin(t * 4.5) * 0.02);
    } else {
      root.current.scale.setScalar(1 + Math.sin(t * 1.2) * 0.012);
    }

    if (core.current) {
      core.current.rotation.x += delta * 0.32;
      core.current.rotation.z += delta * 0.2;
    }
    if (shell.current) {
      shell.current.rotation.y -= delta * 0.55;
      shell.current.rotation.x = Math.sin(t * 0.6) * 0.3;
    }
    if (ring1.current) ring1.current.rotation.z += delta * (open ? 0.7 : 0.32);
    if (ring2.current) ring2.current.rotation.x += delta * 0.5;
    if (ring3.current) ring3.current.rotation.y += delta * 0.46;
    if (sats.current) sats.current.rotation.y += delta * (open ? 1.15 : 0.72);
    satRefs.current.forEach((m, i) => {
      if (!m) return;
      m.rotation.x += delta * 1.6;
      m.rotation.y += delta * (0.9 + i * 0.25);
    });

    if (scanner.current) {
      scanner.current.scale.setScalar(1 + Math.sin(t * 1.4) * 0.08);
      const mat = scanner.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.26 + Math.sin(t * 2.2) * 0.14 + open * 0.22;
    }
    if (beam.current) {
      const mat = beam.current.material as THREE.MeshBasicMaterial;
      mat.opacity = (0.1 + Math.sin(t * 3) * 0.05 + open * 0.24) * scale;
    }
    if (halo.current) {
      halo.current.rotation.z += delta * 0.28;
      const mat = halo.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.2 + Math.sin(t * 1.1) * 0.08;
    }
  });

  const handleClick = () => {
    if (refs.allowClick.current) refs.onOpen();
  };

  const teal = '#2dd4a7';
  const violet = '#8b5cf6';
  const fuchsia = '#e879f9';
  const gold = '#f2d98c';

  return (
    <>
    <group
      ref={root}
      position={[0, 0.12, 0]}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <group scale={scale}>
        {/* data beam */}
        <mesh ref={beam} position={[0, 1.3, 0]}>
          <cylinderGeometry args={[0.04, 0.1, 2.8, 16, 1, true]} />
          <meshBasicMaterial
            color="#22d3ee"
            transparent
            opacity={0.12}
            depthWrite={false}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* core crystal + glow */}
        <pointLight position={[0, 0.3, 0.5]} color="#2dd4a7" intensity={10} distance={3.4} decay={2} />
        <mesh ref={core}>
          <icosahedronGeometry args={[0.52, 0]} />
          <meshStandardMaterial
            color="#0e3a33"
            metalness={0.85}
            roughness={0.18}
            emissive="#14b8a6"
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* halo ring rising off the core */}
        <mesh ref={halo} position={[0, 0.05, 0]} rotation={[Math.PI / 2.1, 0.35, 0]}>
          <torusGeometry args={[0.68, 0.008, 8, 72]} />
          <meshBasicMaterial color={fuchsia} transparent opacity={0.22} blending={THREE.AdditiveBlending} />
        </mesh>

        {/* inner golden heart */}
        <mesh rotation={[0.4, 0.8, 0.2]}>
          <octahedronGeometry args={[0.26, 0]} />
          <meshStandardMaterial
            color={gold}
            metalness={0.9}
            roughness={0.2}
            emissive={gold}
            emissiveIntensity={0.45}
          />
        </mesh>

        {/* wireframe neural shell */}
        <mesh ref={shell} scale={1.25}>
          <icosahedronGeometry args={[0.52, 1]} />
          <meshBasicMaterial color={teal} wireframe transparent opacity={0.24} blending={THREE.AdditiveBlending} />
        </mesh>

        {/* orbital gyro rings */}
        <mesh ref={ring1} rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[1.05, 0.012, 10, 90]} />
          <meshBasicMaterial color={teal} transparent opacity={0.55} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh ref={ring2} rotation={[Math.PI / 2.2, 0.5, 0]}>
          <torusGeometry args={[1.25, 0.01, 10, 90]} />
          <meshBasicMaterial color={violet} transparent opacity={0.4} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh ref={ring3} rotation={[Math.PI / 2.6, -0.5, 0.6]}>
          <torusGeometry args={[0.85, 0.008, 10, 90]} />
          <meshBasicMaterial color={fuchsia} transparent opacity={0.45} blending={THREE.AdditiveBlending} />
        </mesh>

        {/* orbiting satellites (self-spinning crystals) */}
        <group ref={sats}>
          {Array.from({ length: 5 }).map((_, i) => (
            <mesh
              key={i}
              ref={(el) => {
                satRefs.current[i] = el;
              }}
              position={[Math.cos((i / 5) * Math.PI * 2) * 1.3, Math.sin((i / 5) * Math.PI * 2) * 1.3, 0]}
            >
              <octahedronGeometry args={[0.08, 0]} />
              <meshStandardMaterial
                color={i % 2 ? fuchsia : teal}
                emissive={i % 2 ? fuchsia : teal}
                emissiveIntensity={0.9}
                metalness={0.7}
                roughness={0.25}
              />
            </mesh>
          ))}
        </group>

        {/* ground scanner ring */}
        <mesh ref={scanner} position={[0, -0.74, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.68, 0.018, 10, 80]} />
          <meshBasicMaterial color={teal} transparent opacity={0.3} blending={THREE.AdditiveBlending} />
        </mesh>

        <Sparkles
          count={refs.lowFx ? 12 : 26}
          scale={[3, 2.2, 3]}
          size={2.2}
          speed={0.4}
          color="#6ee7c8"
          opacity={0.8}
        />
      </group>
      </group>
      <Html position={[0, 1.22, 0]} center distanceFactor={6.2} zIndexRange={[45, 0]} style={{ pointerEvents: 'none' }}>
        <div className="core-label" data-out={refs.signedIn ? '1' : '0'}>
          {refs.signedIn ? 'Sign Out' : 'Sign In'}
          <span className="core-label-sub">tap the crystal</span>
        </div>
      </Html>
    </>
  );
}

function LoginScene({ refs }: { refs: SceneRefs }) {
  return (
    <>
      <ambientLight intensity={0.5} color={0xcaf7e8} />
      <directionalLight position={[5, 8, 6]} intensity={1.2} color={0xe6fff5} />
      <pointLight position={[-5, -3, 4]} intensity={0.9} color={0x0d9488} />
      <pointLight position={[5, 2, 3]} intensity={0.8} color={0x7c3aed} />

      <BackgroundAurora refs={refs} />
      <LoginCore refs={refs} />
      <ContactShadows position={[0, -1.55, 0]} opacity={0.45} scale={9} blur={2.6} far={3} color="#021512" />

      {!refs.lowFx && (
        <EffectComposer>
          <Bloom intensity={0.5} luminanceThreshold={0.22} luminanceSmoothing={0.6} mipmapBlur />
        </EffectComposer>
      )}
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   FUNNY LOGIN PAGE
════════════════════════════════════════════════════════════════ */
const FunnyLogin: React.FC = () => {
  const appRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const openRef = useRef(0);
  const celebrateRef = useRef(false);
  const allowClickRef = useRef(true);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { user } = useAuth();
  const signedIn = !!user;
  const [errorMessage, setErrorMessage] = useState('');
  const [hintVisible, setHintVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [speechText, setSpeechText] = useState('');
  const [speechVisible, setSpeechVisible] = useState(false);
  const [toastText, setToastText] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [escapeVisible, setEscapeVisible] = useState(false);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [escapePosition, setEscapePosition] = useState({ left: 'calc(50% - 60px)', top: '56%' });
  const [loginLabel, setLoginLabel] = useState('Sign In');
  const [successVisible, setSuccessVisible] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [lowFx, setLowFx] = useState(false);

  const wrongCountRef = useRef(0);
  const navigate = useNavigate();
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      (window.matchMedia('(pointer: coarse)').matches ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    ) {
      setLowFx(true);
    }
    setTimeout(() => setSpeech('Good morning. Tap the core to unlock. 💎', 3500), 1200);
    // Only mount the 3D canvas after the stage has a real, non-zero size.
    // Mounting it at 0×0 makes the framebuffer incomplete and spams
    // GL_INVALID_FRAMEBUFFER_OPERATION in the console.
    const checkReady = () => {
      const el = stageRef.current;
      const ok = el && el.clientWidth > 0 && el.clientHeight > 0;
      if (ok) setCanvasReady(true);
    };
    let raf = requestAnimationFrame(checkReady);
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(checkReady);
    };
    window.addEventListener('resize', onResize);
    const t = setTimeout(() => setCanvasReady(true), 700);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      window.removeEventListener('resize', onResize);
    };
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
    const y = margin + Math.random() * (rect.height - margin * 2 - 44);
    setEscapePosition({ left: `${x}px`, top: `${y}px` });
  }, []);

  const validate = () => username.trim() === CORRECT_USER && password === CORRECT_PASS;

  const wrongFlow = useCallback(() => {
    setWrongCount((count) => {
      const next = count + 1;
      wrongCountRef.current = next;
      return next;
    });
    setSpeech('Invalid credentials... 🔒', 2000);
    showToast(randomToast(wrongCountRef.current));

    if (wrongCountRef.current >= 2) {
      if (!escapeVisible) setEscapeVisible(true);
      setTimeout(moveEscapeBtn, 50);
    }
  }, [escapeVisible, moveEscapeBtn, setSpeech, showToast]);

  const successFlow = useCallback(() => {
    celebrateRef.current = true;
    setSpeech('Access granted! Welcome back, student! 🎉', 3000);
    setLoginLabel('Verified ✓');
    setLoginSuccess(true);
    window.setTimeout(() => {
      openRef.current = 0;
    }, 1600);
    window.setTimeout(() => {
      launchConfetti(appRef.current);
      setSuccessVisible(true);
    }, 2400);
    window.setTimeout(() => navigate('/'), 5200);
  }, [navigate, setSpeech]);

  const signInWithGoogle = async () => {
    if (loading || loginSuccess) return;
    setErrorMessage('');
    if (!auth) {
      setErrorMessage('Firebase is not configured yet.');
      return;
    }

    setLoading(true);
    try {
      const errorMessage = await firebaseSignInWithGoogle();
      if (errorMessage) {
        setErrorMessage(errorMessage);
        wrongFlow();
        return;
      }
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

  // Tap the crystal: signed in → sign out; otherwise → submit the sign-in form.
  const coreTap = useCallback(() => {
    if (!allowClickRef.current) return;
    allowClickRef.current = false;
    window.setTimeout(() => {
      allowClickRef.current = true;
    }, 1200);

    if (signedIn) {
      if (!auth) {
        setSpeech('Authentication is not configured yet.', 2400);
        return;
      }
      signOut(auth)
        .then(() => setSpeech('Signed out. Come back soon. 👋', 3000))
        .catch(() => setSpeech('Could not sign out right now.', 2000));
      return;
    }
    if (loginSuccess || loading) return;
    setSpeech('Verifying your access...', 1200);
    doLogin();
  }, [signedIn, loginSuccess, loading, setSpeech]);

  useEffect(() => {
    const keyHandler = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        doLogin();
      }
    };
    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  });

  const handleStageMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!escapeVisible) return;
    const escapeX = parseFloat(escapePosition.left);
    const escapeY = parseFloat(escapePosition.top);
    const dx = event.clientX - (escapeX + 60);
    const dy = event.clientY - (escapeY + 20);
    if (Math.sqrt(dx * dx + dy * dy) < 120) {
      moveEscapeBtn();
    }
  };

  const sceneRefs: SceneRefs = {
    open: openRef,
    celebrate: celebrateRef,
    allowClick: allowClickRef,
    onOpen: coreTap,
    signedIn,
    lowFx,
  };

  return (
    <div ref={appRef} className="login-scene-root">
      <div id="app" ref={stageRef} onMouseMove={handleStageMouseMove}>
        <div className="login-stage">
        {/* ── continuous 3D scene (mounts only once the stage has a real size) ── */}
        {canvasReady && (
        <Canvas
          className="scene-canvas"
          camera={{ position: [0, 0.2, 6], fov: 55, near: 0.1, far: 100 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          dpr={lowFx ? [1, 1] : [1, 1.5]}
          style={{ position: 'absolute', inset: 0 }}
        >
          <LoginScene refs={sceneRefs} />
        </Canvas>
        )}

        {/* ── vignette for the HUD ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 90% 90% at 50% 45%, rgba(2,7,10,0) 55%, rgba(2,7,10,0.62) 100%)',
          }}
        />

        {/* ── header chip ── */}
        <div className="portal-chip">
          <span className="portal-chip-dot" />
          <span>Student Portal</span>
        </div>

        {/* ── speech bubble ── */}
        <div id="speech" className={speechVisible ? 'show' : ''}>
          {speechText}
        </div>

        {/* ── hint under the core ── */}
        {hintVisible && (
          <div id="bag-hint">
            {signedIn ? 'Tap the crystal to sign out' : 'Fill the form, then tap the crystal to sign in'}
          </div>
        )}
        </div>

        {/* ── permanent auth panel (separate from the 3D scene) ── */}
        <div className="login-formside">
          <div className="glass-card">
            <div className="card-header">
              <div className="card-logo">S</div>
              <div>
                <div className="card-title">Campus Portal</div>
                <div className="card-sub">Student access with personality</div>
              </div>
            </div>
            {signedIn && (
              <div id="signed-in-banner">
                <span className="signed-in-dot" />
                Signed in as {user?.email || 'student'} — tap the crystal to sign out.
              </div>
            )}
            {phoneOpen && auth ? (
              <>
                <PhoneAuthForm
                  auth={auth}
                  onSuccess={() => {
                    setPhoneOpen(false);
                    successFlow();
                  }}
                />
                <button
                  id="google-btn"
                  type="button"
                  onClick={() => {
                    setPhoneOpen(false);
                    setErrorMessage('');
                  }}
                >
                  ← Back to email login
                </button>
              </>
            ) : (
              <>
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
                    <input type="checkbox" style={{ accentColor: '#2dd4a7' }} />
                    <span className="hint-text">Keep me signed in</span>
                  </label>
                  <span className="hint-link">Forgot password?</span>
                </div>
                {errorMessage && <div id="error-msg">{errorMessage}</div>}
                <button
                  id="login-btn"
                  type="button"
                  onClick={doLogin}
                  disabled={escapeVisible || loginSuccess || loading || signedIn}
                  style={{ display: escapeVisible || loginSuccess || signedIn ? 'none' : 'block' }}
                >
                  {loading ? 'Signing in...' : loginLabel}
                </button>
                <button
                  id="google-btn"
                  type="button"
                  onClick={signInWithGoogle}
                  disabled={loading || loginSuccess || signedIn}
                >
                  Continue with Google
                </button>
                {auth && (
                  <>
                    <div className="field-divider">or</div>
                    <button
                      id="phone-btn"
                      type="button"
                      onClick={() => {
                        setPhoneOpen(true);
                        setErrorMessage('');
                      }}
                      disabled={loading || loginSuccess || signedIn}
                    >
                      Sign in with phone
                    </button>
                  </>
                )}
                <div className="register-row">
                  Don&apos;t have an account?{' '}
                  <Link to="/auth/register" className="register-link">
                    Sign up
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── runaway escape button ── */}
        <button
          id="escape-btn"
          type="button"
          onMouseEnter={moveEscapeBtn}
          onClick={moveEscapeBtn}
          style={{ display: escapeVisible ? 'block' : 'none', left: escapePosition.left, top: escapePosition.top }}
        >
          Sign In →
        </button>

        {/* ── toast ── */}
        <div id="toast" className={toastVisible ? 'show' : ''}>{toastText}</div>

        {/* ── success screen ── */}
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        .login-scene-root{min-height:100vh;min-height:100dvh;height:100vh;height:100dvh;background:#02070b;font-family:'DM Sans',sans-serif;color:#f0fdf9;position:relative;overflow:hidden;display:block;width:100%;}
        body{min-height:100vh;min-height:100dvh;height:100vh;height:100dvh;background:#02070b;font-family:'DM Sans',sans-serif;color:#f0fdf9;overflow:hidden;position:relative;margin:0;}
        #app{width:100%;height:100%;min-height:100%;position:relative;overflow:hidden;display:grid;grid-template-columns:1fr 1fr;}
        .login-stage{position:relative;height:100%;overflow:hidden;}
        .login-stage::after{content:'';position:absolute;right:0;top:0;bottom:0;width:1px;background:linear-gradient(to bottom,rgba(45,212,167,0),rgba(45,212,167,0.25),rgba(45,212,167,0));}
        .login-formside{position:relative;display:flex;align-items:center;justify-content:center;padding:28px;background:radial-gradient(130% 120% at 0% 50%,rgba(7,22,25,0.9),rgba(2,7,11,0.45));}
        .glass-card{position:relative;z-index:10;width:min(400px,100%);background:rgba(6,16,19,0.74);backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px);border:1px solid rgba(45,212,167,0.2);border-radius:22px;padding:28px 26px 24px;box-shadow:0 24px 60px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.03) inset;}
        .card-header{display:flex;align-items:center;gap:12px;margin-bottom:20px;padding-bottom:18px;border-bottom:1px solid rgba(45,212,167,0.14);}
        #signed-in-banner{display:flex;align-items:center;gap:8px;margin-bottom:18px;padding:10px 13px;border-radius:11px;background:rgba(45,212,167,0.1);border:1px solid rgba(45,212,167,0.28);color:#6ee7c8;font-size:12px;font-weight:600;}
        .signed-in-dot{flex:none;width:8px;height:8px;border-radius:50%;background:#2dd4a7;box-shadow:0 0 10px #2dd4a7;}
        .scene-canvas{position:absolute;inset:0;}
        .portal-chip{position:absolute;top:22px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:8px;padding:9px 18px;border-radius:999px;background:rgba(7,22,25,0.6);border:1px solid rgba(45,212,167,0.28);backdrop-filter:blur(14px);font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#6ee7c8;box-shadow:0 8px 30px rgba(0,0,0,0.45);z-index:30;}
        .portal-chip-dot{width:7px;height:7px;border-radius:50%;background:#2dd4a7;box-shadow:0 0 10px #2dd4a7;animation:dot-pulse 1.6s ease-in-out infinite;}
        @keyframes dot-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.8)}}
        .core-label{display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 14px;border-radius:999px;background:rgba(6,18,20,0.85);border:1px solid rgba(45,212,167,0.45);color:#6ee7c8;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;white-space:nowrap;box-shadow:0 8px 30px rgba(0,0,0,0.5),0 0 24px rgba(45,212,167,0.15);backdrop-filter:blur(10px);}
        .core-label-sub{font-size:9px;font-weight:600;color:#8aa0b4;letter-spacing:0.2em;}
        .core-label[data-out="1"]{border-color:rgba(248,113,113,0.5);color:#fca5a5;box-shadow:0 8px 30px rgba(0,0,0,0.5),0 0 24px rgba(248,113,113,0.12);}
        #speech{position:absolute;top:12%;left:50%;transform:translateX(-50%) translateY(-6px);background:rgba(7,22,25,0.92);border:1px solid rgba(45,212,167,0.24);border-radius:14px;padding:10px 18px;font-size:13px;font-weight:500;color:#f0fdf9;white-space:nowrap;opacity:0;pointer-events:none;z-index:40;box-shadow:0 10px 34px rgba(0,0,0,0.5);transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);}
        #speech.show{opacity:1;transform:translateX(-50%) translateY(0);}
        #speech::after{content:'';position:absolute;bottom:-7px;left:50%;transform:translateX(-50%);width:12px;height:7px;background:rgba(7,22,25,0.92);clip-path:polygon(0 0,100% 0,50% 100%);border-left:1px solid rgba(45,212,167,0.24);border-right:1px solid rgba(45,212,167,0.24);}
        #bag-hint{position:absolute;bottom:12%;left:50%;transform:translateX(-50%);font-size:12px;color:#7dd3c0;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;animation:hint-pulse 2s ease-in-out infinite;pointer-events:none;z-index:30;background:rgba(7,22,25,0.55);padding:7px 14px;border-radius:999px;border:1px solid rgba(45,212,167,0.18);}
        @keyframes hint-pulse{0%,100%{opacity:0.55;transform:translateX(-50%) translateY(0)}50%{opacity:1;transform:translateX(-50%) translateY(-5px)}}
        .card-logo{width:38px;height:38px;border-radius:11px;background:linear-gradient(135deg,#0d9488,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:#fff;box-shadow:0 4px 16px rgba(13,148,136,0.5),0 0 0 1px rgba(45,212,167,0.25) inset;}
        .card-title{font-size:15px;font-weight:700;color:#f0fdf9}
        .card-sub{font-size:11px;color:#7f96a8;margin-top:2px;letter-spacing:0.03em}
        .field-group{margin-bottom:16px}
        .field-label{font-size:11px;font-weight:600;color:#8aa0b4;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:5px;display:block;}
        .field-input{width:100%;padding:11px 13px;background:rgba(2,10,12,0.6);border:1px solid rgba(255,255,255,0.1);border-radius:11px;font-size:13px;color:#f0fdf9;font-family:'DM Sans',sans-serif;transition:border-color 0.2s,box-shadow 0.2s;outline:none;caret-color:#2dd4a7;}
        .field-input:focus{border-color:rgba(45,212,167,0.75);box-shadow:0 0 0 3px rgba(45,212,167,0.12);}
        .field-input::placeholder{color:#52697c;font-size:12px}
        .hint-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;}
        .hint-text{font-size:11px;color:#8aa0b4}
        .hint-link{font-size:11px;color:#6ee7c8;cursor:pointer}
        #login-btn{width:100%;padding:13px;background:linear-gradient(135deg,#0f766e,#2dd4a7 55%,#7c3aed);color:#fff;border:none;border-radius:11px;font-size:14px;font-weight:700;font-family:'DM Sans',sans-serif;cursor:pointer;letter-spacing:0.02em;transition:transform 0.15s,box-shadow 0.15s,opacity 0.15s;box-shadow:0 6px 24px rgba(13,148,136,0.4);position:relative;overflow:hidden;}
        #login-btn::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.12),transparent);pointer-events:none;}
        #login-btn:hover{transform:translateY(-1px);box-shadow:0 8px 30px rgba(13,148,136,0.5)}
        #login-btn:active{transform:scale(0.98)}
        #google-btn{width:100%;padding:13px;margin-top:12px;background:#fff;color:#0f172a;border:none;border-radius:11px;font-size:14px;font-weight:600;font-family:'DM Sans',sans-serif;cursor:pointer;letter-spacing:0.02em;transition:transform 0.15s,box-shadow 0.15s,opacity 0.15s;box-shadow:0 4px 20px rgba(15,23,42,0.14);}
        #google-btn:hover{transform:translateY(-1px);box-shadow:0 6px 26px rgba(15,23,42,0.26)}
        #google-btn:active{transform:scale(0.98)}
        #google-btn:disabled{opacity:0.65;cursor:not-allowed}
        .field-divider{display:flex;align-items:center;gap:10px;margin:14px 0 12px;font-size:11px;color:#52697c;text-transform:uppercase;letter-spacing:0.06em;}
        .field-divider::before,.field-divider::after{content:'';flex:1;height:1px;background:rgba(255,255,255,0.09);}
        #phone-btn{width:100%;padding:13px;margin-top:0;background:transparent;color:#f0fdf9;border:1px solid rgba(255,255,255,0.13);border-radius:11px;font-size:14px;font-weight:600;font-family:'DM Sans',sans-serif;cursor:pointer;letter-spacing:0.02em;transition:transform 0.15s,border-color 0.15s,background 0.15s;display:flex;align-items:center;justify-content:center;gap:8px;}
        #phone-btn:hover{transform:translateY(-1px);background:rgba(45,212,167,0.06);border-color:rgba(45,212,167,0.4)}
        #phone-btn:active{transform:scale(0.98)}
        #phone-btn:disabled{opacity:0.65;cursor:not-allowed}
        #error-msg{margin-bottom:12px;padding:11px 14px;background:rgba(220,38,38,0.14);border:1px solid rgba(220,38,38,0.2);border-radius:11px;color:#fca5a5;font-size:13px;}
        .register-row{margin-top:16px;text-align:center;font-size:12.5px;color:#8aa0b4;}
        .register-link{color:#6ee7c8;font-weight:600;text-decoration:none;}
        .register-link:hover{text-decoration:underline;}
        #escape-btn{position:absolute;width:130px;height:44px;background:linear-gradient(135deg,#dc2626,#ef4444);color:#fff;border:none;border-radius:11px;font-size:13px;font-weight:700;font-family:'DM Sans',sans-serif;cursor:pointer;box-shadow:0 6px 20px rgba(220,38,38,0.4);z-index:80;transition:box-shadow 0.2s;}
        #escape-btn:hover{box-shadow:0 8px 28px rgba(220,38,38,0.6)}
        #toast{position:absolute;top:20px;left:50%;transform:translateX(-50%) translateY(-20px);background:rgba(6,18,20,0.96);border:1px solid rgba(45,212,167,0.24);border-radius:12px;padding:10px 18px;font-size:13px;color:#f0fdf9;white-space:nowrap;opacity:0;transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);z-index:100;box-shadow:0 10px 36px rgba(0,0,0,0.5);}
        #toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
        #success-screen{position:absolute;inset:0;background:rgba(2,7,11,0.97);display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity 0.6s ease;z-index:200;}
        #success-screen.show{opacity:1;pointer-events:all}
        .success-icon{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#0d9488,#34d399);display:flex;align-items:center;justify-content:center;font-size:32px;animation:success-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) both;box-shadow:0 0 44px rgba(52,211,153,0.35);margin-bottom:20px;}
        @keyframes success-pop{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}
        .success-title{font-size:30px;font-weight:700;background:linear-gradient(135deg,#f0fdf9,#7dd3c0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px;animation:fade-up 0.5s 0.2s both;}
        .success-sub{font-size:14px;color:#8aa0b4;animation:fade-up 0.5s 0.35s both;}
        @keyframes fade-up{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
        .progress-bar{width:200px;height:2px;background:rgba(255,255,255,0.1);border-radius:2px;margin-top:28px;overflow:hidden;animation:fade-up 0.5s 0.5s both;}
        .progress-fill{height:100%;width:0;background:linear-gradient(90deg,#2dd4a7,#8b5cf6);animation:fill-bar 2.5s 0.8s ease-out forwards;}
        @keyframes fill-bar{to{width:100%}}
        .conf{position:absolute;width:8px;height:8px;border-radius:2px;animation:conf-fall var(--d) var(--dl) ease-in forwards;pointer-events:none;z-index:190;}
        @keyframes conf-fall{0%{transform:translateY(-10px) rotate(0);opacity:1}100%{transform:translateY(780px) rotate(540deg);opacity:0}}
        @media (max-width: 860px) {
          #app{grid-template-columns:1fr;grid-template-rows:44dvh 1fr;overflow-y:auto;}
          .login-stage{height:100%;}
          .login-stage::after{right:auto;left:0;right:0;top:auto;bottom:0;height:1px;width:100%;background:linear-gradient(to right,rgba(45,212,167,0),rgba(45,212,167,0.25),rgba(45,212,167,0));}
          .login-formside{align-items:flex-start;justify-content:center;padding:22px 16px 44px;}
          .glass-card{width:min(400px,100%);}
        }
        @media (max-width: 640px) {
          #speech{white-space:normal;text-align:center;width:max-content;max-width:88vw;top:8%;}
          #bag-hint{white-space:normal;text-align:center;max-width:86vw;}
          #toast{white-space:normal;width:max-content;max-width:88vw;text-align:center;}
          .login-formside{padding:20px 14px 42px;}
          .glass-card{padding:22px 18px 20px;}
          .field-group{margin-bottom:13px;}
          .portal-chip{top:16px;}
          .core-label{font-size:11px;letter-spacing:0.1em;}
        }
        @media (max-height: 640px) and (min-width: 861px) {
          .login-formside{padding:16px;}
          .glass-card{width:min(360px,100%);padding:20px 20px 18px;}
          #bag-hint{bottom:8%;}
          #speech{top:7%;}
        }
        #login-btn,#google-btn,#phone-btn,#escape-btn{touch-action:manipulation;-webkit-tap-highlight-color:transparent;}
      `}</style>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   CONFETTI
════════════════════════════════════════════════════════════════ */
function launchConfetti(container: HTMLDivElement | null) {
  if (!container) return;
  const colors = ['#2dd4a7', '#8b5cf6', '#e879f9', '#34d399', '#fbbf24', '#c4b5fd', '#67e8f9'];
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
}

export default FunnyLogin;