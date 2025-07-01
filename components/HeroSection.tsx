"use client";

import { MotionAnimation } from "@/motionsHoc/MotionAnimation";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
// import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

// Particle.js and Three.js types
declare global {
  interface Window {
    particlesJS: any;
    THREE?: any;
  }
}

const HeroSection = () => {
  const particlesRef = useRef<HTMLDivElement>(null);
  const threeContainerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Load Particle.js
    const loadParticles = async () => {
      if (typeof window !== "undefined") {
        // Dynamically import particles.js
        const particlesScript = document.createElement("script");
        particlesScript.src =
          "https://cdnjs.cloudflare.com/ajax/libs/particles.js/2.0.0/particles.min.js";
        particlesScript.onload = () => {
          if (window.particlesJS && particlesRef.current) {
            window.particlesJS("particles-js", {
              particles: {
                number: {
                  value: 80,
                  density: {
                    enable: true,
                    value_area: 800,
                  },
                },
                color: {
                  value: ["#667eea", "#764ba2", "#f093fb"],
                },
                shape: {
                  type: "circle",
                  stroke: {
                    width: 0,
                    color: "#000000",
                  },
                },
                opacity: {
                  value: 0.5,
                  random: false,
                  anim: {
                    enable: false,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false,
                  },
                },
                size: {
                  value: 3,
                  random: true,
                  anim: {
                    enable: false,
                    speed: 40,
                    size_min: 0.1,
                    sync: false,
                  },
                },
                line_linked: {
                  enable: true,
                  distance: 150,
                  color: "#667eea",
                  opacity: 0.4,
                  width: 1,
                },
                move: {
                  enable: true,
                  speed: 6,
                  direction: "none",
                  random: false,
                  straight: false,
                  out_mode: "out",
                  bounce: false,
                  attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200,
                  },
                },
              },
              interactivity: {
                detect_on: "canvas",
                events: {
                  onhover: {
                    enable: true,
                    mode: "repulse",
                  },
                  onclick: {
                    enable: true,
                    mode: "push",
                  },
                  resize: true,
                },
                modes: {
                  repulse: {
                    distance: 200,
                    duration: 0.4,
                  },
                  push: {
                    particles_nb: 4,
                  },
                },
              },
              retina_detect: true,
            });
          }
        };
        document.head.appendChild(particlesScript);
      }
    };

    // Load Three.js and setup scene
    const loadThreeJS = async () => {
      if (typeof window !== "undefined") {
        const threeScript = document.createElement("script");
        threeScript.src =
          "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
        threeScript.onload = () => {
          setupThreeScene();
        };
        document.head.appendChild(threeScript);
      }
    };

    const setupThreeScene = () => {
      if (!threeContainerRef.current || !window.THREE) return;

      const container = threeContainerRef.current;
      const scene = new window.THREE.Scene();
      const camera = new window.THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      const renderer = new window.THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      // Create geometric shapes
      const geometry1 = new window.THREE.TorusGeometry(10, 3, 16, 100);
      const geometry2 = new window.THREE.OctahedronGeometry(8);
      const geometry3 = new window.THREE.IcosahedronGeometry(6);

      const material1 = new window.THREE.MeshBasicMaterial({
        color: 0x667eea,
        wireframe: true,
        transparent: true,
        opacity: 0.6,
      });
      const material2 = new window.THREE.MeshBasicMaterial({
        color: 0x764ba2,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      });
      const material3 = new window.THREE.MeshBasicMaterial({
        color: 0xf093fb,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      });

      const torus = new window.THREE.Mesh(geometry1, material1);
      const octahedron = new window.THREE.Mesh(geometry2, material2);
      const icosahedron = new window.THREE.Mesh(geometry3, material3);

      // Position the shapes
      torus.position.set(-30, 0, -50);
      octahedron.position.set(30, 20, -40);
      icosahedron.position.set(0, -30, -60);

      scene.add(torus);
      scene.add(octahedron);
      scene.add(icosahedron);

      camera.position.z = 30;

      sceneRef.current = { scene, camera, torus, octahedron, icosahedron };
      rendererRef.current = renderer;

      // Animation loop
      const animate = () => {
        animationIdRef.current = requestAnimationFrame(animate);

        if (sceneRef.current) {
          const { torus, octahedron, icosahedron } = sceneRef.current;

          // Rotate the shapes
          torus.rotation.x += 0.01;
          torus.rotation.y += 0.005;

          octahedron.rotation.x += 0.008;
          octahedron.rotation.z += 0.01;

          icosahedron.rotation.y += 0.006;
          icosahedron.rotation.z += 0.008;

          // Float animation
          torus.position.y = Math.sin(Date.now() * 0.001) * 5;
          octahedron.position.y = 20 + Math.cos(Date.now() * 0.0015) * 3;
          icosahedron.position.x = Math.sin(Date.now() * 0.0008) * 10;

          renderer.render(sceneRef.current.scene, sceneRef.current.camera);
        }
      };

      animate();

      // Handle window resize
      const handleResize = () => {
        if (sceneRef.current && rendererRef.current) {
          sceneRef.current.camera.aspect =
            window.innerWidth / window.innerHeight;
          sceneRef.current.camera.updateProjectionMatrix();
          rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        }
      };

      window.addEventListener("resize", handleResize);

      // Mouse interaction
      const handleMouseMove = (event: MouseEvent) => {
        if (sceneRef.current) {
          const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
          const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

          sceneRef.current.camera.position.x = mouseX * 2;
          sceneRef.current.camera.position.y = mouseY * 2;
          sceneRef.current.camera.lookAt(sceneRef.current.scene.position);
        }
      };

      document.addEventListener("mousemove", handleMouseMove);

      // Cleanup function
      return () => {
        window.removeEventListener("resize", handleResize);
        document.removeEventListener("mousemove", handleMouseMove);
      };
    };

    loadParticles();
    loadThreeJS();

    // Cleanup on unmount
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current && threeContainerRef.current) {
        threeContainerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  return (
    <>
      <section className="hero-section max-w-[100vw] overflow-hidden">
        {/* Particles.js Background */}
        <div id="particles-js" ref={particlesRef}></div>

        {/* Three.js Container */}
        <div className="three-container" ref={threeContainerRef}></div>

        {/* Floating Elements */}
        <div className="floating-elements">
          <div className="floating-element"></div>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
        </div>

        {/* Glow Effect */}
        <div className="glow"></div>

        {/* Hero Content */}
        <div className="hero-content">
          <MotionAnimation>
            <h1 className="hero-title">
              Collect On-Chain Credentials & Complete Quests
            </h1>
          </MotionAnimation>

          <MotionAnimation delay={0.4} animation="slide-up">
            <p className="hero-subtitle">
              StarkPass is a web3 platform for collecting verifiable
              credentials, participating in quests, and showcasing your
              blockchain journey - all powered by StarkNet.
            </p>
          </MotionAnimation>

          <MotionAnimation delay={0.6} animation="slide-up">
            <div className="hero-buttons">
              {/* <Link href="/quests">
                <Button
                  size="lg"
                  className="rounded-full px-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Explore Quests
                </Button>
              </Link> */}
              <Link href="/sponsor" className="btn-secondary">
                Become a Sponsor <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </MotionAnimation>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
