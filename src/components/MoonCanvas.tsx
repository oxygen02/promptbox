"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface MoonCanvasProps {
  size?: number;
}

export default function MoonCanvas({ size = 32 }: MoonCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current || typeof window === "undefined") return;

    // 清理之前的实例
    mountRef.current.innerHTML = "";

    // 场景
    const scene = new THREE.Scene();
    
    // 相机 - 正交相机，确保球形显示
    const aspect = 1;
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

    // 创建月球纹理（程序化生成）
    const createMoonTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d")!;
      
      // 基础颜色 - 月球灰色
      ctx.fillStyle = "#a8a8a8";
      ctx.fillRect(0, 0, 512, 512);

      // 添加明暗变化
      const gradient = ctx.createRadialGradient(180, 180, 0, 256, 256, 256);
      gradient.addColorStop(0, "rgba(200, 200, 200, 0.5)");
      gradient.addColorStop(0.5, "rgba(150, 150, 150, 0.3)");
      gradient.addColorStop(1, "rgba(80, 80, 80, 0.5)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);

      // 陨石坑
      const craters = [
        { x: 150, y: 140, r: 45, depth: 0.4 },
        { x: 310, y: 200, r: 60, depth: 0.5 },
        { x: 200, y: 340, r: 40, depth: 0.3 },
        { x: 380, y: 300, r: 50, depth: 0.45 },
        { x: 100, y: 280, r: 35, depth: 0.35 },
        { x: 350, y: 120, r: 30, depth: 0.3 },
        { x: 250, y: 400, r: 55, depth: 0.4 },
        { x: 420, y: 220, r: 25, depth: 0.25 },
        { x: 80, y: 180, r: 32, depth: 0.35 },
        { x: 180, y: 90, r: 28, depth: 0.3 },
        { x: 300, y: 420, r: 35, depth: 0.3 },
        { x: 450, y: 350, r: 40, depth: 0.35 },
      ];

      craters.forEach(crater => {
        // 陨石坑阴影
        const craterGrad = ctx.createRadialGradient(
          crater.x + crater.r * 0.3, 
          crater.y + crater.r * 0.3, 
          0,
          crater.x, 
          crater.y, 
          crater.r
        );
        craterGrad.addColorStop(0, `rgba(60, 60, 60, ${crater.depth})`);
        craterGrad.addColorStop(0.6, `rgba(80, 80, 80, ${crater.depth * 0.6})`);
        craterGrad.addColorStop(1, `rgba(100, 100, 100, ${crater.depth * 0.3})`);
        ctx.fillStyle = craterGrad;
        ctx.beginPath();
        ctx.ellipse(crater.x, crater.y, crater.r, crater.r * 0.85, 0, 0, Math.PI * 2);
        ctx.fill();

        // 陨石坑边缘高光
        ctx.strokeStyle = `rgba(50, 50, 50, ${crater.depth * 0.8})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // 添加噪点纹理
      const imageData = ctx.getImageData(0, 0, 512, 512);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 25;
        imageData.data[i] = Math.max(0, Math.min(255, imageData.data[i] + noise));
        imageData.data[i + 1] = Math.max(0, Math.min(255, imageData.data[i + 1] + noise));
        imageData.data[i + 2] = Math.max(0, Math.min(255, imageData.data[i + 2] + noise));
      }
      ctx.putImageData(imageData, 0, 0);

      return new THREE.CanvasTexture(canvas);
    };

    // 创建凹凸贴图
    const createBumpMap = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d")!;
      
      ctx.fillStyle = "#808080";
      ctx.fillRect(0, 0, 512, 512);

      const craters = [
        { x: 150, y: 140, r: 45 },
        { x: 310, y: 200, r: 60 },
        { x: 200, y: 340, r: 40 },
        { x: 380, y: 300, r: 50 },
        { x: 100, y: 280, r: 35 },
        { x: 350, y: 120, r: 30 },
        { x: 250, y: 400, r: 55 },
        { x: 420, y: 220, r: 25 },
      ];

      craters.forEach(crater => {
        const grad = ctx.createRadialGradient(
          crater.x, crater.y, 0,
          crater.x, crater.y, crater.r
        );
        grad.addColorStop(0, "#404040");
        grad.addColorStop(0.5, "#606060");
        grad.addColorStop(1, "#808080");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(crater.x, crater.y, crater.r, 0, Math.PI * 2);
        ctx.fill();
      });

      return new THREE.CanvasTexture(canvas);
    };

    const moonTexture = createMoonTexture();
    const bumpMap = createBumpMap();
    
    // 月球材质
    const moonMaterial = new THREE.MeshStandardMaterial({
      map: moonTexture,
      bumpMap: bumpMap,
      bumpScale: 0.05,
      roughness: 0.9,
      metalness: 0.0,
    });

    // 月球几何体 - 高细分度球体
    const moonGeometry = new THREE.SphereGeometry(size * 0.42, 64, 64);
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    scene.add(moon);

    // 光照 - 模拟太阳光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.set(100, 50, 100);
    scene.add(sunLight);

    // 补光
    const fillLight = new THREE.DirectionalLight(0x8899aa, 0.3);
    fillLight.position.set(-100, -50, 50);
    scene.add(fillLight);

    // 动画
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      // 月球自转
      moon.rotation.y += 0.005;
      moon.rotation.x = 0.1; // 轻微倾斜
      
      renderer.render(scene, camera);
    };
    animate();

    // 清理
    return () => {
      cancelAnimationFrame(animationId);
      renderer.dispose();
      moonGeometry.dispose();
      moonMaterial.dispose();
      moonTexture.dispose();
      bumpMap.dispose();
      if (mountRef.current) {
        mountRef.current.innerHTML = "";
      }
    };
  }, [size]);

  return (
    <div 
      ref={mountRef} 
      className="rounded-full overflow-hidden"
      style={{ width: size, height: size }}
    />
  );
}
