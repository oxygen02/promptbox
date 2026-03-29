"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface MoonCanvasProps {
  size?: number;
}

export default function MoonCanvas({ size = 40 }: MoonCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 清理之前的实例
    mountRef.current.innerHTML = "";

    // 场景
    const scene = new THREE.Scene();
    
    // 相机
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.z = size * 1.5;

    // 渲染器
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(size, size);
    renderer.setPixelRatio(2);
    mountRef.current.appendChild(renderer.domElement);

    // 创建月球纹理（程序化生成）
    const createMoonTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d")!;
      
      // 基础颜色
      const gradient = ctx.createRadialGradient(256, 200, 0, 256, 256, 256);
      gradient.addColorStop(0, "#d4d4d4");
      gradient.addColorStop(0.5, "#a0a0a0");
      gradient.addColorStop(1, "#606060");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);

      // 陨石坑
      const craters = [
        { x: 150, y: 150, r: 40 },
        { x: 300, y: 200, r: 55 },
        { x: 200, y: 350, r: 35 },
        { x: 380, y: 300, r: 45 },
        { x: 100, y: 280, r: 30 },
        { x: 350, y: 120, r: 25 },
        { x: 250, y: 400, r: 50 },
        { x: 420, y: 200, r: 20 },
        { x: 80, y: 180, r: 28 },
        { x: 180, y: 80, r: 22 },
      ];

      craters.forEach(crater => {
        // 陨石坑阴影
        const craterGrad = ctx.createRadialGradient(
          crater.x + crater.r * 0.3, crater.y + crater.r * 0.3, 0,
          crater.x, crater.y, crater.r
        );
        craterGrad.addColorStop(0, "#505050");
        craterGrad.addColorStop(0.7, "#707070");
        craterGrad.addColorStop(1, "#909090");
        ctx.fillStyle = craterGrad;
        ctx.beginPath();
        ctx.ellipse(crater.x, crater.y, crater.r, crater.r * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();

        // 陨石坑边缘
        ctx.strokeStyle = "#404040";
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // 添加噪点纹理
      const imageData = ctx.getImageData(0, 0, 512, 512);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 20;
        imageData.data[i] = Math.max(0, Math.min(255, imageData.data[i] + noise));
        imageData.data[i + 1] = Math.max(0, Math.min(255, imageData.data[i + 1] + noise));
        imageData.data[i + 2] = Math.max(0, Math.min(255, imageData.data[i + 2] + noise));
      }
      ctx.putImageData(imageData, 0, 0);

      return new THREE.CanvasTexture(canvas);
    };

    // 月球材质
    const moonTexture = createMoonTexture();
    const moonMaterial = new THREE.MeshStandardMaterial({
      map: moonTexture,
      roughness: 0.9,
      metalness: 0.1,
    });

    // 月球几何体
    const moonGeometry = new THREE.SphereGeometry(size / 2, 64, 64);
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    scene.add(moon);

    // 光照
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // 动画
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      // 月球自转
      moon.rotation.y += 0.008;
      moon.rotation.x += 0.002;
      
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
      if (mountRef.current) {
        mountRef.current.innerHTML = "";
      }
    };
  }, [size]);

  return (
    <div 
      ref={mountRef} 
      className="rounded-full"
      style={{ width: size, height: size }}
    />
  );
}
