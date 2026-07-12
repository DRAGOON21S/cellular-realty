"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import * as THREE from "three";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* Palette — mirrors the .theme-brown tokens in globals.css */
const C = {
  cream: 0xfcfdf5,
  plaster: 0xf1e9d8,
  brown: 0x413126,
  gold: 0x9a7d5e,
  goldLight: 0xb49f78,
  glass: 0xcfe0dd,
  grass: 0x8d9a72,
  grassDark: 0x76855f,
  stone: 0xb8ab97,
  foliage: 0x5c6b47,
  trunk: 0x5b4634,
};

const CAPTIONS = [
  { key: "plot", text: "An empty plot, full of promise." },
  { key: "foundation", text: "Laying the foundation" },
  { key: "walls", text: "Raising the walls" },
  { key: "roof", text: "Topping it off" },
  { key: "finish", text: "The finishing touches" },
  { key: "welcome", text: "Welcome home." },
];

function standard(color: number, roughness = 0.85, metalness = 0.02) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

/** Box whose origin sits at its base, so scale.y grows it upward. */
function baseBox(w: number, h: number, d: number, mat: THREE.Material) {
  const geo = new THREE.BoxGeometry(w, h, d);
  geo.translate(0, h / 2, 0);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function box(w: number, h: number, d: number, mat: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function tree(x: number, z: number, s: number) {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.2, 0.9, 8),
    standard(C.trunk),
  );
  trunk.position.y = 0.45;
  trunk.castShadow = true;
  const lower = new THREE.Mesh(
    new THREE.ConeGeometry(1.0, 1.7, 9),
    standard(C.foliage),
  );
  lower.position.y = 1.5;
  lower.castShadow = true;
  const upper = new THREE.Mesh(
    new THREE.ConeGeometry(0.7, 1.3, 9),
    standard(C.foliage),
  );
  upper.position.y = 2.4;
  upper.castShadow = true;
  g.add(trunk, lower, upper);
  g.position.set(x, 0, z);
  g.scale.setScalar(s);
  return g;
}

export default function HouseScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const host = canvasHostRef.current;
      const section = sectionRef.current;
      if (!host || !section) return;

      /* ---------- Scene ---------- */
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(C.cream);
      scene.fog = new THREE.Fog(C.cream, 26, 46);

      const camera = new THREE.PerspectiveCamera(
        42,
        host.clientWidth / host.clientHeight,
        0.1,
        100,
      );

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(host.clientWidth, host.clientHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      host.appendChild(renderer.domElement);

      /* Lights */
      scene.add(new THREE.HemisphereLight(0xfff6e8, 0x86754f, 0.9));
      const sun = new THREE.DirectionalLight(0xfff1dc, 2.1);
      sun.position.set(9, 14, 7);
      sun.castShadow = true;
      sun.shadow.mapSize.set(2048, 2048);
      sun.shadow.camera.left = -14;
      sun.shadow.camera.right = 14;
      sun.shadow.camera.top = 14;
      sun.shadow.camera.bottom = -14;
      sun.shadow.bias = -0.0004;
      scene.add(sun);

      /* Ground */
      const ground = new THREE.Mesh(
        new THREE.CircleGeometry(34, 48),
        standard(C.grass, 1),
      );
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);

      const plot = new THREE.Mesh(
        new THREE.CircleGeometry(7.4, 40),
        standard(C.grassDark, 1),
      );
      plot.rotation.x = -Math.PI / 2;
      plot.position.y = 0.01;
      plot.receiveShadow = true;
      scene.add(plot);

      /* ---------- House pieces ---------- */
      const wallMat = standard(C.plaster);
      const roofMat = standard(C.brown, 0.7);
      const trimMat = standard(C.gold, 0.5, 0.15);

      // Foundation — starts sunken below the ground.
      const foundation = box(6.8, 0.6, 5.2, standard(C.stone, 0.95));
      foundation.position.y = -0.9;
      scene.add(foundation);
      const FOUNDATION_Y = 0.3; // resting position (top at y = 0.6)

      // Walls — grow upward from the foundation top.
      const WALL_H = 2.6;
      const wallBase = 0.6;
      const front = baseBox(6.2, WALL_H, 0.2, wallMat);
      front.position.set(0, wallBase, 2.2);
      const back = baseBox(6.2, WALL_H, 0.2, wallMat);
      back.position.set(0, wallBase, -2.2);
      const left = baseBox(0.2, WALL_H, 4.2, wallMat);
      left.position.set(-3.0, wallBase, 0);
      const right = baseBox(0.2, WALL_H, 4.2, wallMat);
      right.position.set(3.0, wallBase, 0);
      const walls = [front, left, right, back];
      walls.forEach((w) => {
        w.scale.y = 0.001;
        scene.add(w);
      });

      // Roof assembly (panels + gables + ridge) — drops in from the sky.
      const roof = new THREE.Group();
      const RISE = 1.7;
      const half = 3.4; // half-span incl. overhang
      const slope = Math.hypot(half, RISE);
      const pitch = Math.atan2(RISE, half);
      const topY = wallBase + WALL_H; // 3.2

      const panelL = box(slope + 0.15, 0.16, 5.6, roofMat);
      panelL.position.set(-half / 2, topY + RISE / 2, 0);
      panelL.rotation.z = pitch; // +x end rises toward the ridge
      const panelR = box(slope + 0.15, 0.16, 5.6, roofMat);
      panelR.position.set(half / 2, topY + RISE / 2, 0);
      panelR.rotation.z = -pitch;
      const ridge = box(0.34, 0.2, 5.7, trimMat);
      ridge.position.set(0, topY + RISE + 0.04, 0);

      const gableShape = new THREE.Shape();
      gableShape.moveTo(-3.1, 0);
      gableShape.lineTo(3.1, 0);
      gableShape.lineTo(0, RISE);
      gableShape.closePath();
      const gableGeo = new THREE.ExtrudeGeometry(gableShape, {
        depth: 0.18,
        bevelEnabled: false,
      });
      const gableF = new THREE.Mesh(gableGeo, wallMat);
      gableF.castShadow = true;
      gableF.position.set(0, topY, 2.12);
      const gableB = gableF.clone();
      gableB.position.z = -2.3;
      roof.add(panelL, panelR, ridge, gableF, gableB);
      roof.position.y = 7; // waiting in the sky
      roof.visible = false;
      scene.add(roof);

      // Chimney — grows out of the roof.
      const chimney = baseBox(0.55, 1.5, 0.55, standard(C.gold, 0.8));
      chimney.position.set(1.7, topY + 0.5, -1.1);
      chimney.scale.y = 0.001;
      chimney.visible = false;
      scene.add(chimney);

      // Door + windows — pop onto the front face.
      const door = box(1.0, 1.7, 0.1, trimMat);
      door.position.set(0, wallBase + 0.85, 2.33);
      const knob = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 10, 10),
        standard(C.brown, 0.4, 0.4),
      );
      knob.position.set(0.32, wallBase + 0.85, 2.4);
      const doorGroup = new THREE.Group();
      doorGroup.add(door, knob);

      const windows: THREE.Group[] = [doorGroup];
      for (const wx of [-1.9, 1.9]) {
        const frame = box(1.15, 1.15, 0.08, trimMat);
        frame.position.set(wx, wallBase + 1.45, 2.32);
        const glass = box(0.95, 0.95, 0.1, standard(C.glass, 0.15, 0.55));
        glass.position.set(wx, wallBase + 1.45, 2.34);
        const g = new THREE.Group();
        g.add(frame, glass);
        windows.push(g);
      }
      windows.forEach((w) => {
        w.scale.setScalar(0.001);
        w.visible = false;
        scene.add(w);
      });

      // Path stones + trees — the finishing touches.
      const stones: THREE.Mesh[] = [];
      for (let i = 0; i < 5; i++) {
        const s = box(0.85 - i * 0.05, 0.1, 0.6, standard(C.stone, 0.95));
        s.position.set(i % 2 ? 0.16 : -0.16, 0.05, 3.1 + i * 0.85);
        s.scale.setScalar(0.001);
        stones.push(s);
        scene.add(s);
      }
      const treeSizes = [1.05, 0.9, 0.7];
      const trees = [tree(-5.2, 1.8, 1), tree(4.9, -1.4, 1), tree(5.6, 2.6, 1)];
      trees.forEach((t) => {
        t.scale.setScalar(0.001);
        scene.add(t);
      });

      /* ---------- Camera rig ---------- */
      const cam = { theta: -0.55, radius: 18, height: 6.5, lookY: 1.4 };
      const applyCamera = () => {
        camera.position.set(
          Math.sin(cam.theta) * cam.radius,
          cam.height,
          Math.cos(cam.theta) * cam.radius,
        );
        camera.lookAt(0, cam.lookY, 0);
      };

      /* ---------- Render on demand ---------- */
      let dirty = true;
      const render = () => {
        if (!dirty) return;
        dirty = false;
        applyCamera();
        renderer.render(scene, camera);
      };
      gsap.ticker.add(render);

      const onResize = () => {
        camera.aspect = host.clientWidth / host.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(host.clientWidth, host.clientHeight);
        dirty = true;
      };
      const ro = new ResizeObserver(onResize);
      ro.observe(host);

      /* ---------- Build timeline ---------- */
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const caption = (key: string) => `[data-caption="${key}"]`;
      const showCaption = (tl: gsap.core.Timeline, key: string, at: string | number) => {
        tl.fromTo(
          caption(key),
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: 0.35 },
          at,
        );
      };
      const hideCaption = (tl: gsap.core.Timeline, key: string, at: string | number) => {
        tl.to(caption(key), { autoAlpha: 0, y: -22, duration: 0.3 }, at);
      };

      const tl = gsap.timeline({
        defaults: { ease: "power1.inOut" },
        onUpdate: () => (dirty = true),
        scrollTrigger: prefersReduced
          ? undefined
          : {
              trigger: section,
              start: "top top",
              end: "+=4800",
              scrub: 1,
              pin: true,
              // parent is display:flex, which auto-disables pin spacing
              pinSpacing: true,
              anticipatePin: 1,
            },
      });

      // Opening caption over the empty plot.
      gsap.set(caption("plot"), { autoAlpha: 1 });
      tl.to({}, { duration: 0.5 }); // a beat on the empty ground
      hideCaption(tl, "plot", 0.4);

      // Stage 1 — foundation rises out of the earth.
      tl.addLabel("foundation", 0.7);
      showCaption(tl, "foundation", "foundation");
      tl.to(
        foundation.position,
        { y: FOUNDATION_Y, duration: 1.0, ease: "power2.out" },
        "foundation",
      );
      tl.to(cam, { theta: -0.2, radius: 16.5, duration: 1.4, ease: "none" }, "foundation");

      // Stage 2 — walls grow upward, one after another.
      tl.addLabel("walls", "foundation+=1.15");
      hideCaption(tl, "foundation", "walls-=0.15");
      showCaption(tl, "walls", "walls");
      walls.forEach((w, i) => {
        tl.to(
          w.scale,
          { y: 1, duration: 0.65, ease: "power2.out" },
          `walls+=${i * 0.3}`,
        );
      });
      tl.to(cam, { theta: 0.25, height: 5.6, duration: 1.8, ease: "none" }, "walls");

      // Door and windows pop in.
      tl.addLabel("openings", "walls+=1.6");
      windows.forEach((w, i) => {
        tl.set(w, { visible: true }, `openings+=${i * 0.18}`);
        tl.to(
          w.scale,
          { x: 1, y: 1, z: 1, duration: 0.45, ease: "back.out(2)" },
          `openings+=${i * 0.18}`,
        );
      });

      // Stage 3 — the roof descends and settles.
      tl.addLabel("roof", "openings+=0.7");
      hideCaption(tl, "walls", "roof-=0.15");
      showCaption(tl, "roof", "roof");
      tl.set(roof, { visible: true }, "roof");
      tl.fromTo(
        roof.position,
        { y: 7 },
        { y: 0, duration: 1.1, ease: "power2.inOut" },
        "roof",
      );
      tl.set(chimney, { visible: true }, "roof+=1.0");
      tl.to(
        chimney.scale,
        { y: 1, duration: 0.5, ease: "power2.out" },
        "roof+=1.0",
      );
      tl.to(cam, { theta: 0.7, radius: 15.5, duration: 1.7, ease: "none" }, "roof");

      // Stage 4 — path, trees, life.
      tl.addLabel("finish", "roof+=1.7");
      hideCaption(tl, "roof", "finish-=0.15");
      showCaption(tl, "finish", "finish");
      stones.forEach((s, i) => {
        tl.to(
          s.scale,
          { x: 1, y: 1, z: 1, duration: 0.3, ease: "back.out(1.8)" },
          `finish+=${i * 0.14}`,
        );
      });
      trees.forEach((t, i) => {
        const s = treeSizes[i];
        tl.to(
          t.scale,
          { x: s, y: s, z: s, duration: 0.55, ease: "back.out(1.6)" },
          `finish+=${0.4 + i * 0.2}`,
        );
      });
      tl.to(cam, { theta: 1.05, duration: 1.6, ease: "none" }, "finish");

      // Stage 5 — pull back. Welcome home.
      tl.addLabel("welcome", "finish+=1.7");
      hideCaption(tl, "finish", "welcome-=0.15");
      showCaption(tl, "welcome", "welcome");
      tl.to(
        cam,
        { theta: 1.45, radius: 19, height: 7.5, lookY: 1.9, duration: 1.4, ease: "none" },
        "welcome",
      );
      tl.to({}, { duration: 0.4 }); // hold the final view

      // Progress hairline, driven by the same timeline.
      tl.fromTo(
        "[data-progress]",
        { scaleX: 0 },
        { scaleX: 1, duration: tl.duration(), ease: "none" },
        0,
      );

      if (prefersReduced) {
        // Skip the choreography: show the finished house and final caption.
        tl.progress(1).pause();
      }

      render();

      return () => {
        gsap.ticker.remove(render);
        ro.disconnect();
        scene.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose();
            const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
            mats.forEach((m) => m.dispose());
          }
        });
        renderer.dispose();
        renderer.domElement.remove();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-[#fcfdf5]"
    >
      <div ref={canvasHostRef} className="absolute inset-0" />

      {/* Staged captions */}
      <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-24">
        {CAPTIONS.map((c) => (
          <p
            key={c.key}
            data-caption={c.key}
            className="invisible absolute px-8 text-center font-serif text-4xl tracking-wide text-[#413126] opacity-0 md:text-5xl"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            {c.text}
          </p>
        ))}
      </div>

      {/* Scroll hint */}
      <div className="pointer-events-none absolute top-8 left-1/2 -translate-x-1/2 text-xs font-medium tracking-[0.3em] text-[#9a7d5e] uppercase">
        Scroll to build
      </div>

      {/* Progress hairline */}
      <div className="absolute bottom-0 left-0 h-[3px] w-full bg-[#413126]/10">
        <div
          data-progress
          className="h-full w-full origin-left scale-x-0 bg-[#9a7d5e]"
        />
      </div>
    </section>
  );
}
