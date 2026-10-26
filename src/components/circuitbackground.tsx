import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

const CANVAS_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body, html { width: 100%; height: 100%; overflow: hidden; background-color: #070C18; }
    canvas { display: block; width: 100vw; height: 100vh; }
  </style>
</head>
<body>
  <canvas id="canvas"></canvas>
  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    function setupCanvas() {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    }

    let circuits = [];
    let scanlineY = 0;

    const COLOR_BG = '#070C18';
    const CYAN_GLOW = '#00A8E8';
    const GREEN_NEON = '#00C853';
    const BLUE_ELECTRIC = '#4CC9FE';

    function initCircuits() {
      setupCanvas();
      circuits = [];
      const GRID = 35;
      const cols = Math.ceil(width / GRID);
      const rows = Math.ceil(height / GRID);
      const totalCircuits = Math.floor((cols * rows) / 4);

      for (let i = 0; i < totalCircuits; i++) {
        const randLayer = Math.random();
        let layer = 'mid';
        let lineWidth = 1.5;

        if (randLayer > 0.8) { layer = 'fg'; lineWidth = 2.2; }
        else if (randLayer < 0.4) { layer = 'bg'; lineWidth = 1.0; }

        let currX = Math.floor(Math.random() * cols) * GRID;
        let currY = Math.floor(Math.random() * rows) * GRID;
        const points = [{ x: currX, y: currY }];
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
        const pulses = [];
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

        const nodeTypes = ['circle', 'square', 'ring'];
        circuits.push({
          points, layer, lineWidth,
          baseColor: layer === 'fg' ? 'rgba(0, 168, 232, 0.35)' : 'rgba(0, 168, 232, 0.15)',
          pulses,
          nodeType: nodeTypes[Math.floor(Math.random() * nodeTypes.length)],
        });
      }
    }

    initCircuits();
    window.addEventListener('resize', initCircuits);

    function render() {
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

      requestAnimationFrame(render);
    }

    render();
  </script>
</body>
</html>
`;

interface CircuitBackgroundProps {
  opacity?: number;
}

export function CircuitBackground({ opacity = 1 }: CircuitBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

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

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.absoluteContainer, { opacity, pointerEvents: 'none' }]}>
        {/* @ts-ignore */}
        <canvas ref={canvasRef} style={styles.canvas} />
      </View>
    );
  }

  return (
    <View style={[styles.absoluteContainer, { opacity, pointerEvents: 'none' }]}>
      <WebView
        originWhitelist={['*']}
        source={{ html: CANVAS_HTML }}
        style={styles.webview}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  absoluteContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  webview: {
    backgroundColor: '#070C18',
  },
});