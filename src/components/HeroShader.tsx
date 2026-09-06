import React, { useEffect, useRef } from 'react';

export const HeroShader: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId: number;
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;

    if (!gl) {
      // Fallback 2D canvas animation if WebGL is unavailable
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const render2D = (time: number) => {
        const w = canvas.width = canvas.clientWidth || 1200;
        const h = canvas.height = canvas.clientHeight || 700;
        ctx.clearRect(0, 0, w, h);

        const hexRadius = 28;
        const hexWidth = Math.sqrt(3) * hexRadius;
        const hexHeight = hexRadius * 1.5;

        for (let row = 0; row < Math.ceil(h / hexHeight) + 1; row++) {
          for (let col = 0; col < Math.ceil(w / hexWidth) + 1; col++) {
            const cx = col * hexWidth + (row % 2 === 1 ? hexWidth / 2 : 0);
            const cy = row * hexHeight;

            const dist = Math.sin(time * 0.0015 + row * 0.5 + col * 0.7) * 0.5 + 0.5;
            const isSpecial = (row * 7 + col) % 9 === 0;

            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
              const angle = (Math.PI / 3) * i + Math.PI / 6;
              const x = cx + hexRadius * 0.9 * Math.cos(angle);
              const y = cy + hexRadius * 0.9 * Math.sin(angle);
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.closePath();

            if (isSpecial) {
              ctx.strokeStyle = dist > 0.6 ? `rgba(254, 183, 0, ${0.15 + dist * 0.3})` : `rgba(0, 245, 255, ${0.15 + dist * 0.3})`;
              ctx.fillStyle = dist > 0.6 ? `rgba(254, 183, 0, ${dist * 0.08})` : `rgba(0, 245, 255, ${dist * 0.08})`;
              ctx.fill();
            } else {
              ctx.strokeStyle = 'rgba(0, 245, 255, 0.04)';
            }
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
        animationFrameId = requestAnimationFrame(render2D);
      };

      animationFrameId = requestAnimationFrame(render2D);
      return () => cancelAnimationFrame(animationFrameId);
    }

    // WebGL Shader setup
    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;

      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        uv *= 6.5;

        // Slow drifting
        uv.x += sin(u_time * 0.08) * 0.3;
        uv.y += cos(u_time * 0.08) * 0.3;

        // Hexagonal grid coordinates
        vec2 p = uv;
        p.x *= 0.8660254; // sqrt(3)/2
        vec2 r = vec2(p.x, p.y + (mod(floor(p.x + 0.5), 2.0) == 0.0 ? 0.0 : 0.5));
        vec2 f = fract(r + 0.5) - 0.5;

        float dist = length(f);
        float pulse = sin(u_time * 1.8 + floor(r.x) * 8.0 + floor(r.y) * 4.0) * 0.5 + 0.5;
        
        // Base dark navy tone
        vec3 color = vec3(0.043, 0.075, 0.149);

        // Distance from mouse
        vec2 mouseUv = (u_mouse * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y) * 6.5;
        float mouseDist = length(uv - mouseUv);
        float mouseGlow = smoothstep(3.0, 0.0, mouseDist) * 0.25;

        float rand = fract(sin(dot(floor(r), vec2(12.9898, 78.233))) * 43758.5453);

        if (dist < 0.42) {
          if (rand > 0.92) {
            // Pulsing critical/alert cells (Amber & Coral)
            vec3 alertCol = mix(vec3(0.9, 0.2, 0.2), vec3(0.99, 0.71, 0.0), pulse);
            color = mix(color, alertCol, 0.4 + pulse * 0.4);
          } else if (rand > 0.78) {
            // Electric teal active sensor cells
            vec3 activeCol = vec3(0.0, 0.96, 1.0);
            color = mix(color, activeCol, 0.15 + pulse * 0.25);
          } else {
            color = vec3(0.05, 0.09, 0.18);
          }
        }

        // Add mouse reaction
        color += vec3(0.0, 0.8, 0.9) * mouseGlow;

        // Glowing hex boundaries
        float grid = smoothstep(0.44, 0.41, dist) - smoothstep(0.41, 0.38, dist);
        color += grid * vec3(0.0, 0.9, 1.0) * 0.18;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const createShader = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = createShader(gl.VERTEX_SHADER, vs);
    const fragShader = createShader(gl.FRAGMENT_SHADER, fs);
    if (!vertShader || !fragShader) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vertShader);
    gl.attachShader(prog, fragShader);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        mouse.x = event.clientX - rect.left;
        mouse.y = rect.height - (event.clientY - rect.top);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const resize = () => {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || 800;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const render = (t: number) => {
      resize();
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ display: 'block' }}
    />
  );
};
