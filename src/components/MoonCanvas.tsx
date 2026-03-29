"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface MoonCanvasProps {
  size?: number;
}

// 备用CSS 3D球体
function CSSMoon({ size = 32 }: { size: number }) {
  return (
    <div 
      className="relative rounded-full"
      style={{ 
        width: size, 
        height: size,
        background: 'radial-gradient(circle at 30% 30%, #e8e8e8, #a0a0a0 40%, #606060 70%, #303030 100%)',
        boxShadow: `
          inset -8px -8px 20px rgba(0,0,0,0.5),
          inset 8px 8px 20px rgba(255,255,255,0.3),
          0 0 15px rgba(255,255,255,0.3)
        `,
        animation: 'moonRotate 20s linear infinite',
      }}
    >
      {/* 陨石坑 */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '25%',
        width: '20%',
        height: '20%',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, #707070, #404040)',
        boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.6)',
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '60%',
        width: '25%',
        height: '25%',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, #808080, #505050)',
        boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.5)',
      }} />
      <div style={{
        position: 'absolute',
        top: '70%',
        left: '30%',
        width: '15%',
        height: '15%',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, #757575, #454545)',
        boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.5)',
      }} />
      <div style={{
        position: 'absolute',
        top: '35%',
        left: '75%',
        width: '12%',
        height: '12%',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, #6a6a6a, #404040)',
        boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.5)',
      }} />
    </div>
  );
}

export default function MoonCanvas({ size = 32 }: MoonCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [useCSSFallback, setUseCSSFallback] = useState(false);

  useEffect(() => {
    if (!mountRef.current || typeof window === "undefined") {
      setUseCSSFallback(true);
      return;
    }

    try {
      // 清理之前的实例
      mountRef.current.innerHTML = "";

      // 场景
      const scene = new THREE.Scene();
      
      // 正交相机
      const frustumSize = size;
      const camera = new THREE.OrthographicCamera(
        frustumSize / -2,
        frustumSize / 2,
        frustumSize / 2,
        frustumSize / -2,
        0.1,
        1000
      );
      camera.position.z = 100;

      // 渲染器
      const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true 
      });
      renderer.setSize(size, size);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      mountRef.current.appendChild(renderer.domElement);

      // 创建月球纹理
      const createMoonTexture = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext("2d")!;
        
        // 基础颜色
        const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
        gradient.addColorStop(0, "#d0d0d0");
        gradient.addColorStop(0.4, "#a0a0a0");
        gradient.addColorStop(0.7, "#707070");
        gradient.addColorStop(1, "#404040");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);

        // 陨石坑
        const craters = [
          { x: 140, y: 130, r: 50, d: 0.5 },
          { x: 320, y: 180, r: 65, d: 0.6 },
          { x: 200, y: 350, r: 45, d: 0.4 },
          { x: 390, y: 290, r: 55, d: 0.5 },
          { x: 90, y: 280, r: 40, d: 0.4 },
          { x: 360, y: 110, r: 35, d: 0.35 },
          { x: 260, y: 410, r: 60, d: 0.45 },
          { x: 430, y: 200, r: 30, d: 0.3 },
        ];

        craters.forEach(c => {
          const g = ctx.createRadialGradient(c.x + c.r * 0.3, c.y + c.r * 0.3, 0, c.x, c.y, c.r);
          g.addColorStop(0, `rgba(40, 40, 40, ${c.d})`);
          g.addColorStop(0.5, `rgba(60, 60, 60, ${c.d * 0.6})`);
          g.addColorStop(1, `rgba(80, 80, 80, ${c.d * 0.2})`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.ellipse(c.x, c.y, c.r, c.r * 0.9, 0, 0, Math.PI * 2);
          ctx.fill();
        });

        // 噪点
        const imgData = ctx.getImageData(0, 0, 512, 512);
        for (let i = 0; i < imgData.data.length; i += 4) {
          const n = (Math.random() - 0.5) * 30;
          imgData.data[i] = Math.max(0, Math.min(255, imgData.data[i] + n));
          imgData.data[i+1] = Math.max(0, Math.min(255, imgData.data[i+1] + n));
          imgData.data[i+2] = Math.max(0, Math.min(255, imgData.data[i+2] + n));
        }
        ctx.putImageData(imgData, 0, 0);

        return new THREE.CanvasTexture(canvas);
      };

      const texture = createMoonTexture();
      
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.85,
        metalness: 0.0,
      });

      const geometry = new THREE.SphereGeometry(size * 0.45, 48, 48);
      const moon = new THREE.Mesh(geometry, material);
      scene.add(moon);

      // 光照
      const ambient = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambient);

      const sun = new THREE.DirectionalLight(0xffffff, 1.8);
      sun.position.set(80, 60, 100);
      scene.add(sun);

      const fill = new THREE.DirectionalLight(0xaaaacc, 0.4);
      fill.position.set(-80, -40, 60);
      scene.add(fill);

      // 动画
      let animId: number;
      const animate = () => {
        animId = requestAnimationFrame(animate);
        moon.rotation.y += 0.006;
        moon.rotation.x = 0.08;
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        cancelAnimationFrame(animId);
        renderer.dispose();
        geometry.dispose();
        material.dispose();
        texture.dispose();
        if (mountRef.current) mountRef.current.innerHTML = "";
      };
    } catch (e) {
      console.error("Three.js failed:", e);
      setUseCSSFallback(true);
    }
  }, [size]);

  if (useCSSFallback) {
    return <CSSMoon size={size} />;
  }

  return (
    <div 
      ref={mountRef} 
      className="rounded-full overflow-hidden"
      style={{ width: size, height: size }}
    />
  );
}
