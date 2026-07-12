"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import * as THREE from "three";
import { Sky } from "three/addons/objects/Sky.js";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CAPTIONS = [
  { key: "plot", text: "An empty plot, full of promise." },
  { key: "foundation", text: "Laying the foundation" },
  { key: "walls", text: "Raising the walls" },
  { key: "roof", text: "Topping it off" },
  { key: "finish", text: "The finishing touches" },
  { key: "welcome", text: "Welcome home." },
];

/* ------------------------------------------------------------------ */
/* Procedural textures — every map is a 1m x 1m tile drawn to canvas,  */
/* so meshes can set repeat = (width, height) in metres and adjacent   */
/* pieces stay perfectly aligned.                                      */
/* ------------------------------------------------------------------ */

type Draw = (ctx: CanvasRenderingContext2D, s: number) => void;

function makeTile(size: number, draw: Draw, anisotropy: number) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  draw(ctx, size);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = anisotropy;
  return tex;
}

const jitter = (hex: number, amt: number) => {
  const r = (hex >> 16) & 255, g = (hex >> 8) & 255, b = hex & 255;
  const d = (Math.random() - 0.5) * 2 * amt;
  const cl = (v: number) => Math.max(0, Math.min(255, Math.round(v + d)));
  return `rgb(${cl(r)},${cl(g)},${cl(b)})`;
};

/* Painted clapboard siding — 4 laps per metre. */
const drawSiding: Draw = (ctx, s) => {
  const lap = s / 4;
  for (let i = 0; i < 4; i++) {
    const y = i * lap;
    const g = ctx.createLinearGradient(0, y, 0, y + lap);
    g.addColorStop(0, "#f6f0e1");
    g.addColorStop(0.75, "#eBe3d0");
    g.addColorStop(1, "#d9cfb8");
    ctx.fillStyle = g;
    ctx.fillRect(0, y, s, lap);
    ctx.fillStyle = "rgba(60,45,30,0.35)";
    ctx.fillRect(0, y + lap - 2, s, 2);
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.fillRect(0, y, s, 1);
  }
  // wood grain noise
  ctx.fillStyle = "rgba(90,70,50,0.05)";
  for (let i = 0; i < 900; i++) {
    ctx.fillRect(Math.random() * s, Math.random() * s, 1 + Math.random() * 6, 1);
  }
};

/* Asphalt shingles. Courses run VERTICALLY in the tile (as columns) so
   that on the roof box's top face (u = slope direction, v = eave
   direction) the course lines lie perpendicular to the slope. */
const drawShingles: Draw = (ctx, s) => {
  ctx.fillStyle = "#241b13";
  ctx.fillRect(0, 0, s, s);
  const courseW = s / 3; // 3 courses per metre
  const cellH = s / 4; // shingle tab width
  for (let c = 0; c < 3; c++) {
    const x = c * courseW;
    const off = c % 2 ? cellH / 2 : 0;
    for (let i = -1; i < 5; i++) {
      const y = i * cellH + off;
      ctx.fillStyle = jitter(0x453527, 26);
      ctx.fillRect(x + 2, y + 2, courseW - 4, cellH - 3);
      // subtle top-lit edge on the exposed (down-slope) side
      ctx.fillStyle = "rgba(255,235,200,0.10)";
      ctx.fillRect(x + 2, y + 2, 3, cellH - 3);
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fillRect(x, y, 2, cellH);
    }
  }
};

/* Red-brown brick with mortar joints — 8 courses per metre. */
const drawBrick: Draw = (ctx, s) => {
  ctx.fillStyle = "#b3a897";
  ctx.fillRect(0, 0, s, s);
  const rows = 8;
  const bh = s / rows;
  const bw = s / 3;
  for (let r = 0; r < rows; r++) {
    const y = r * bh;
    const off = r % 2 ? bw / 2 : 0;
    for (let i = -1; i < 4; i++) {
      ctx.fillStyle = jitter(0x8a5240, 30);
      ctx.fillRect(i * bw + off + 2, y + 2, bw - 4, bh - 4);
    }
  }
};

/* Poured concrete. */
const drawConcrete: Draw = (ctx, s) => {
  ctx.fillStyle = "#9a9486";
  ctx.fillRect(0, 0, s, s);
  for (let i = 0; i < 2600; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)";
    ctx.fillRect(Math.random() * s, Math.random() * s, 1 + Math.random() * 2, 1 + Math.random() * 2);
  }
};

/* Lawn grass. */
const drawGrass: Draw = (ctx, s) => {
  ctx.fillStyle = "#6f8149";
  ctx.fillRect(0, 0, s, s);
  const greens = [0x5c7040, 0x778a52, 0x69805e, 0x83955c, 0x54683a];
  for (let i = 0; i < 5200; i++) {
    ctx.strokeStyle = jitter(greens[i % greens.length], 14);
    ctx.lineWidth = 1;
    const x = Math.random() * s, y = Math.random() * s;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 3, y - 2 - Math.random() * 4);
    ctx.stroke();
  }
};

/* Bare cleared earth for the plot. */
const drawDirt: Draw = (ctx, s) => {
  ctx.fillStyle = "#93815f";
  ctx.fillRect(0, 0, s, s);
  for (let i = 0; i < 3200; i++) {
    ctx.fillStyle = jitter(0x8a7856, 26);
    ctx.fillRect(Math.random() * s, Math.random() * s, 1 + Math.random() * 3, 1 + Math.random() * 2);
  }
};

/* Flagstone. */
const drawStone: Draw = (ctx, s) => {
  ctx.fillStyle = "#9d9584";
  ctx.fillRect(0, 0, s, s);
  for (let i = 0; i < 2000; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.05)";
    ctx.fillRect(Math.random() * s, Math.random() * s, 1 + Math.random() * 3, 1 + Math.random() * 3);
  }
};

/* Stained oak (door). */
const drawWood: Draw = (ctx, s) => {
  ctx.fillStyle = "#4d3420";
  ctx.fillRect(0, 0, s, s);
  for (let x = 0; x < s; x += 3) {
    ctx.strokeStyle = `rgba(${30 + Math.random() * 40},${18 + Math.random() * 24},${8 + Math.random() * 14},${0.25 + Math.random() * 0.3})`;
    ctx.lineWidth = 1 + Math.random();
    ctx.beginPath();
    ctx.moveTo(x, 0);
    let px = x;
    for (let y = 0; y <= s; y += 16) {
      px += (Math.random() - 0.5) * 3;
      ctx.lineTo(px, y);
    }
    ctx.stroke();
  }
};

/* Tree bark. */
const drawBark: Draw = (ctx, s) => {
  ctx.fillStyle = "#57462f";
  ctx.fillRect(0, 0, s, s);
  for (let i = 0; i < 90; i++) {
    ctx.strokeStyle = `rgba(20,14,8,${0.15 + Math.random() * 0.25})`;
    ctx.lineWidth = 1 + Math.random() * 2;
    const x = Math.random() * s;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + (Math.random() - 0.5) * 14, s);
    ctx.stroke();
  }
};

export default function HouseScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const host = canvasHostRef.current;
      const section = sectionRef.current;
      if (!host || !section) return;

      /* ---------- Renderer / camera ---------- */
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(host.clientWidth, host.clientHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.68;
      host.appendChild(renderer.domElement);
      const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0xdce0cd, 34, 70);

      const camera = new THREE.PerspectiveCamera(
        42,
        host.clientWidth / host.clientHeight,
        0.1,
        600,
      );

      /* ---------- Sky, sun, environment light ---------- */
      const sunDir = new THREE.Vector3().setFromSphericalCoords(
        1,
        THREE.MathUtils.degToRad(58), // polar: sun ~32° above horizon
        THREE.MathUtils.degToRad(140),
      );
      const configureSky = (sky: Sky) => {
        sky.material.uniforms.turbidity.value = 5;
        sky.material.uniforms.rayleigh.value = 1.4;
        sky.material.uniforms.mieCoefficient.value = 0.004;
        sky.material.uniforms.mieDirectionalG.value = 0.8;
        sky.material.uniforms.sunPosition.value.copy(sunDir);
      };
      const sky = new Sky();
      sky.scale.setScalar(500);
      configureSky(sky);
      scene.add(sky);

      // Image-based lighting baked from the same sky
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envScene = new THREE.Scene();
      const envSky = new Sky();
      envSky.scale.setScalar(500);
      configureSky(envSky);
      envScene.add(envSky);
      const envRT = pmrem.fromScene(envScene, 0.02);
      scene.environment = envRT.texture;
      scene.environmentIntensity = 0.25;

      const sun = new THREE.DirectionalLight(0xffe9c4, 3.9);
      sun.position.copy(sunDir).multiplyScalar(40);
      sun.castShadow = true;
      sun.shadow.mapSize.set(2048, 2048);
      sun.shadow.camera.left = -14;
      sun.shadow.camera.right = 14;
      sun.shadow.camera.top = 14;
      sun.shadow.camera.bottom = -14;
      sun.shadow.bias = -0.0004;
      sun.shadow.normalBias = 0.02;
      scene.add(sun);
      scene.add(new THREE.HemisphereLight(0xd6dde2, 0x5a6440, 0.38));

      /* ---------- Textures & materials ---------- */
      const sidingTex = makeTile(256, drawSiding, maxAniso);
      const shingleTex = makeTile(256, drawShingles, maxAniso);
      const brickTex = makeTile(256, drawBrick, maxAniso);
      const concreteTex = makeTile(256, drawConcrete, maxAniso);
      const grassTex = makeTile(256, drawGrass, maxAniso);
      const dirtTex = makeTile(256, drawDirt, maxAniso);
      const stoneTex = makeTile(256, drawStone, maxAniso);
      const woodTex = makeTile(256, drawWood, maxAniso);
      const barkTex = makeTile(128, drawBark, maxAniso);

      // Clone-with-repeat so courses/laps line up across separate meshes.
      const fit = (tex: THREE.Texture, w: number, h: number, x0 = 0, y0 = 0) => {
        const t = tex.clone();
        t.needsUpdate = true;
        t.repeat.set(w, h);
        t.offset.set(x0 % 1, y0 % 1);
        return t;
      };
      const sidingMat = (w: number, h: number, x0 = 0, y0 = 0) =>
        new THREE.MeshStandardMaterial({ map: fit(sidingTex, w, h, x0, y0), roughness: 0.85 });

      const trimMat = new THREE.MeshStandardMaterial({ color: 0xf4efe3, roughness: 0.55 });
      const concreteMat = new THREE.MeshStandardMaterial({ map: fit(concreteTex, 2, 2), roughness: 0.95 });
      const woodMat = new THREE.MeshStandardMaterial({ map: fit(woodTex, 1, 2), roughness: 0.6 });
      const barkMat = new THREE.MeshStandardMaterial({ map: fit(barkTex, 2, 2), roughness: 1 });
      const plasterMat = new THREE.MeshStandardMaterial({ color: 0xece2cd, roughness: 0.9 });
      const leafMats = [0x51713b, 0x5f7f45, 0x466335].map(
        (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.9, flatShading: true }),
      );
      const glassMats: THREE.MeshPhysicalMaterial[] = [];
      const glassMat = () => {
        const m = new THREE.MeshPhysicalMaterial({
          color: 0x9fb4bd,
          metalness: 0,
          roughness: 0.06,
          transparent: true,
          opacity: 0.92,
          envMapIntensity: 1.6,
          emissive: 0xffb466,
          emissiveIntensity: 0,
        });
        glassMats.push(m);
        return m;
      };

      const box = (w: number, h: number, d: number, mat: THREE.Material) => {
        const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
        m.castShadow = true;
        m.receiveShadow = true;
        return m;
      };

      /* ---------- Ground ---------- */
      const ground = new THREE.Mesh(
        new THREE.CircleGeometry(40, 56),
        new THREE.MeshStandardMaterial({ map: fit(grassTex, 46, 46), roughness: 1 }),
      );
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);

      const plot = new THREE.Mesh(
        new THREE.CircleGeometry(5.2, 40),
        new THREE.MeshStandardMaterial({ map: fit(dirtTex, 7, 7), roughness: 1 }),
      );
      plot.rotation.x = -Math.PI / 2;
      plot.position.y = 0.012;
      plot.receiveShadow = true;
      scene.add(plot);

      /* ---------- House dimensions ---------- */
      const W = 6.2, D = 4.4, T = 0.22, WALL_H = 2.6;
      const BASE = 0.6; // foundation top
      const TOP = BASE + WALL_H; // 3.2
      const RISE = 1.7;
      const OVER = 0.45; // roof overhang
      const half = W / 2 + OVER;
      const slope = Math.hypot(half, RISE);
      const pitch = Math.atan2(RISE, half);

      /* ---------- Foundation + floor (rise together) ---------- */
      const founG = new THREE.Group();
      const foundation = box(W + 0.4, 0.62, D + 0.4, concreteMat);
      foundation.position.y = 0.31;
      const floorSlab = box(
        W - 0.3,
        0.1,
        D - 0.3,
        new THREE.MeshStandardMaterial({ map: fit(woodTex, 6, 4), roughness: 0.7 }),
      );
      floorSlab.position.y = 0.66;
      founG.add(foundation, floorSlab);
      founG.position.y = -1.35; // sunken below the plot
      scene.add(founG);

      /* ---------- Walls (groups anchored at their base) ---------- */
      // Front wall: real openings for the door and two windows.
      const DOOR_W = 1.0, DOOR_H = 2.0;
      const WIN_W = 1.2, WIN_H = 1.2, SILL = 0.95;
      const frontWall = new THREE.Group();
      type Span = [number, number, number, number]; // x0, x1, y0, y1
      const spans: Span[] = [
        [-W / 2, -2.5, 0, WALL_H],
        [-2.5, -1.3, 0, SILL],
        [-2.5, -1.3, SILL + WIN_H, WALL_H],
        [-1.3, -DOOR_W / 2, 0, WALL_H],
        [-DOOR_W / 2, DOOR_W / 2, DOOR_H, WALL_H],
        [DOOR_W / 2, 1.3, 0, WALL_H],
        [1.3, 2.5, 0, SILL],
        [1.3, 2.5, SILL + WIN_H, WALL_H],
        [2.5, W / 2, 0, WALL_H],
      ];
      for (const [x0, x1, y0, y1] of spans) {
        const seg = box(x1 - x0, y1 - y0, T, sidingMat(x1 - x0, y1 - y0, x0 + W / 2, y0));
        seg.position.set((x0 + x1) / 2, (y0 + y1) / 2, 0);
        frontWall.add(seg);
      }
      frontWall.position.set(0, BASE, D / 2 - T / 2);

      const backWall = new THREE.Group();
      const back = box(W, WALL_H, T, sidingMat(W, WALL_H));
      back.position.y = WALL_H / 2;
      backWall.add(back);
      backWall.position.set(0, BASE, -(D / 2 - T / 2));

      const sideWall = (sign: 1 | -1) => {
        const g = new THREE.Group();
        const wallD = D - 2 * T;
        const s = box(T, WALL_H, wallD, sidingMat(wallD, WALL_H));
        s.position.y = WALL_H / 2;
        g.add(s);
        g.position.set(sign * (W / 2 - T / 2), BASE, 0);
        return g;
      };
      const leftWall = sideWall(-1);
      const rightWall = sideWall(1);

      const walls = [frontWall, leftWall, rightWall, backWall];
      walls.forEach((w) => {
        w.scale.y = 0.001;
        scene.add(w);
      });

      /* ---------- Window & door units (pop in) ---------- */
      const pops: THREE.Group[] = [];

      const windowUnit = (w: number, h: number) => {
        const g = new THREE.Group(); // origin = center of opening
        const f = 0.09; // trim width
        const head = box(w + 2 * f, f, 0.3, trimMat);
        head.position.y = h / 2 + f / 2;
        const sill = box(w + 2 * f, 0.08, 0.34, trimMat);
        sill.position.set(0, -h / 2 - 0.04, 0.03);
        const jambL = box(f, h, 0.3, trimMat);
        jambL.position.x = -w / 2 - f / 2;
        const jambR = box(f, h, 0.3, trimMat);
        jambR.position.x = w / 2 + f / 2;
        const glass = box(w, h, 0.05, glassMat());
        const mullV = box(0.045, h, 0.07, trimMat);
        const mullH = box(w, 0.045, 0.07, trimMat);
        g.add(head, sill, jambL, jambR, glass, mullV, mullH);
        return g;
      };

      // Front windows sit in the real openings.
      for (const wx of [-1.9, 1.9]) {
        const u = windowUnit(WIN_W, WIN_H);
        u.position.set(wx, BASE + SILL + WIN_H / 2, D / 2 - T / 2);
        pops.push(u);
      }
      // Side windows (surface-mounted with deep trim reads as recessed).
      for (const sx of [-1, 1] as const) {
        const u = windowUnit(1.1, 1.1);
        u.rotation.y = sx * (Math.PI / 2);
        u.position.set(sx * (W / 2 - 0.02), BASE + 1.0 + 0.55, sx * 0.4);
        pops.push(u);
      }

      // Door unit: trim + oak slab + raised panels + brass knob.
      const doorG = new THREE.Group();
      {
        const f = 0.1;
        const head = box(DOOR_W + 2 * f, f, 0.3, trimMat);
        head.position.y = DOOR_H + f / 2;
        const jL = box(f, DOOR_H, 0.3, trimMat);
        jL.position.set(-DOOR_W / 2 - f / 2, DOOR_H / 2, 0);
        const jR = box(f, DOOR_H, 0.3, trimMat);
        jR.position.set(DOOR_W / 2 + f / 2, DOOR_H / 2, 0);
        const slab = box(DOOR_W - 0.04, DOOR_H - 0.02, 0.07, woodMat);
        slab.position.set(0, DOOR_H / 2, -0.02);
        doorG.add(head, jL, jR, slab);
        for (const py of [0.62, 1.45]) {
          const panel = box(0.62, 0.55, 0.03, woodMat);
          panel.position.set(0, py, 0.025);
          doorG.add(panel);
        }
        const knob = new THREE.Mesh(
          new THREE.SphereGeometry(0.045, 12, 12),
          new THREE.MeshStandardMaterial({ color: 0xc9a35a, metalness: 0.9, roughness: 0.25 }),
        );
        knob.castShadow = true;
        knob.position.set(0.36, 1.02, 0.06);
        doorG.add(knob);
      }
      doorG.position.set(0, BASE, D / 2 - T / 2);
      pops.push(doorG);

      // Concrete stoop + step in front of the door.
      const stoop = new THREE.Group();
      const stoopSlab = box(1.6, 0.6, 0.95, concreteMat);
      stoopSlab.position.set(0, 0.3, 0);
      const step = box(1.3, 0.3, 0.45, concreteMat);
      step.position.set(0, 0.15, 0.68);
      stoop.add(stoopSlab, step);
      stoop.position.set(0, 0, D / 2 + 0.45);
      pops.push(stoop);

      pops.forEach((p) => {
        p.visible = false;
        p.scale.setScalar(0.001);
        scene.add(p);
      });

      /* ---------- Roof assembly (drops from the sky) ---------- */
      const roofG = new THREE.Group();
      {
        const depth = D + 0.9;
        const panel = (sign: 1 | -1) => {
          const p = box(slope + 0.12, 0.14, depth, new THREE.MeshStandardMaterial({
            map: fit(shingleTex, slope, depth),
            roughness: 0.9,
          }));
          p.position.set(sign * (half / 2), TOP + RISE / 2, 0);
          p.rotation.z = sign * -pitch; // inner end rises to the ridge
          return p;
        };
        const panelL = panel(-1);
        const panelR = panel(1);

        const ridge = box(0.3, 0.14, depth + 0.06, new THREE.MeshStandardMaterial({
          map: fit(shingleTex, 0.4, depth),
          roughness: 0.9,
        }));
        ridge.position.set(0, TOP + RISE + 0.05, 0);

        // Eave fascia boards
        for (const sx of [-1, 1]) {
          const fascia = box(0.06, 0.24, depth, trimMat);
          fascia.position.set(sx * (half + 0.02), TOP + 0.02, 0);
          roofG.add(fascia);
        }
        // Gable barge boards
        for (const sz of [1, -1]) {
          for (const sx of [-1, 1]) {
            const barge = box(slope, 0.17, 0.07, trimMat);
            barge.position.set(sx * (half / 2), TOP + RISE / 2 - 0.02, sz * (depth / 2 - 0.02));
            barge.rotation.z = sx * -pitch; // parallel to its roof panel
            roofG.add(barge);
          }
        }

        // Gable end walls (stucco)
        const gShape = new THREE.Shape();
        gShape.moveTo(-W / 2, 0);
        gShape.lineTo(W / 2, 0);
        gShape.lineTo(0, RISE);
        gShape.closePath();
        const gGeo = new THREE.ExtrudeGeometry(gShape, { depth: T, bevelEnabled: false });
        const gF = new THREE.Mesh(gGeo, plasterMat);
        gF.castShadow = true;
        gF.receiveShadow = true;
        gF.position.set(0, TOP, D / 2 - T);
        const gB = gF.clone();
        gB.position.z = -D / 2;
        roofG.add(panelL, panelR, ridge, gF, gB);
      }
      roofG.position.y = 7;
      roofG.visible = false;
      scene.add(roofG);

      /* ---------- Chimney ---------- */
      const chimney = new THREE.Group();
      {
        const stack = box(0.6, 1.7, 0.6, new THREE.MeshStandardMaterial({
          map: fit(brickTex, 0.6, 1.7),
          roughness: 0.95,
        }));
        stack.position.y = 0.85;
        const crown = box(0.74, 0.09, 0.74, concreteMat);
        crown.position.y = 1.74;
        const flue = box(0.26, 0.14, 0.26, new THREE.MeshStandardMaterial({ color: 0x3a2f26, roughness: 0.9 }));
        flue.position.y = 1.85;
        chimney.add(stack, crown, flue);
      }
      chimney.position.set(1.7, TOP + 0.35, -1.0);
      chimney.scale.y = 0.001;
      chimney.visible = false;
      scene.add(chimney);

      /* ---------- Warm interior light (the finale) ---------- */
      const homeLight = new THREE.PointLight(0xffc283, 0, 9, 1.8);
      homeLight.position.set(0, BASE + 1.5, 0);
      scene.add(homeLight);

      /* ---------- Landscaping ---------- */
      const stones: THREE.Mesh[] = [];
      for (let i = 0; i < 6; i++) {
        const r = 0.3 + Math.random() * 0.12;
        const s = new THREE.Mesh(
          new THREE.CylinderGeometry(r, r * 1.05, 0.07, 7),
          new THREE.MeshStandardMaterial({ map: fit(stoneTex, 1, 1), roughness: 0.95 }),
        );
        s.castShadow = true;
        s.receiveShadow = true;
        s.rotation.y = Math.random() * Math.PI;
        s.position.set(i % 2 ? 0.22 : -0.22, 0.035, D / 2 + 1.15 + i * 0.75);
        s.scale.setScalar(0.001);
        stones.push(s);
        scene.add(s);
      }

      const canopyBlob = (r: number, mat: THREE.Material) => {
        const geo = new THREE.IcosahedronGeometry(r, 1);
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          pos.setXYZ(
            i,
            pos.getX(i) + (Math.random() - 0.5) * r * 0.3,
            pos.getY(i) + (Math.random() - 0.5) * r * 0.3,
            pos.getZ(i) + (Math.random() - 0.5) * r * 0.3,
          );
        }
        geo.computeVertexNormals();
        const m = new THREE.Mesh(geo, mat);
        m.castShadow = true;
        return m;
      };

      const tree = (x: number, z: number) => {
        const g = new THREE.Group();
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.17, 1.3, 8), barkMat);
        trunk.position.y = 0.65;
        trunk.castShadow = true;
        g.add(trunk);
        const blobs: [number, number, number, number][] = [
          [0, 1.9, 0, 0.85],
          [-0.5, 1.6, 0.15, 0.55],
          [0.45, 1.65, -0.2, 0.6],
          [0.1, 2.4, 0.1, 0.55],
        ];
        blobs.forEach(([bx, by, bz, r], i) => {
          const b = canopyBlob(r, leafMats[i % leafMats.length]);
          b.position.set(bx, by, bz);
          g.add(b);
        });
        g.position.set(x, 0, z);
        return g;
      };

      const treeSizes = [1.15, 0.95, 0.8];
      const trees = [tree(-5.4, 1.9), tree(5.0, -1.6), tree(5.8, 2.7)];
      const bushes: THREE.Group[] = [];
      const bushSpots: [number, number][] = [[-2.5, D / 2 + 0.55], [2.4, D / 2 + 0.55], [W / 2 + 0.6, 0.6]];
      bushSpots.forEach(([bx, bz], i) => {
        const g = new THREE.Group();
        const b = canopyBlob(0.38, leafMats[(i + 1) % leafMats.length]);
        b.position.y = 0.3;
        g.add(b);
        g.position.set(bx, 0, bz);
        bushes.push(g);
      });
      [...trees, ...bushes].forEach((t) => {
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
        founG.position,
        { y: 0, duration: 1.0, ease: "power2.out" },
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

      // Door, windows, and stoop pop in.
      tl.addLabel("openings", "walls+=1.6");
      pops.forEach((p, i) => {
        tl.set(p, { visible: true }, `openings+=${i * 0.16}`);
        tl.to(
          p.scale,
          { x: 1, y: 1, z: 1, duration: 0.45, ease: "back.out(2)" },
          `openings+=${i * 0.16}`,
        );
      });

      // Stage 3 — the roof descends and settles.
      tl.addLabel("roof", "openings+=0.9");
      hideCaption(tl, "walls", "roof-=0.15");
      showCaption(tl, "roof", "roof");
      tl.set(roofG, { visible: true }, "roof");
      tl.fromTo(
        roofG.position,
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
          `finish+=${i * 0.12}`,
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
      bushes.forEach((b, i) => {
        tl.to(
          b.scale,
          { x: 1, y: 1, z: 1, duration: 0.35, ease: "back.out(1.8)" },
          `finish+=${0.7 + i * 0.12}`,
        );
      });
      tl.to(cam, { theta: 1.05, duration: 1.6, ease: "none" }, "finish");

      // Stage 5 — pull back, lights on. Welcome home.
      tl.addLabel("welcome", "finish+=1.7");
      hideCaption(tl, "finish", "welcome-=0.15");
      showCaption(tl, "welcome", "welcome");
      tl.to(
        cam,
        // swing back around to admire the finished front of the house
        { theta: 0.45, radius: 18.5, height: 6.2, lookY: 1.9, duration: 1.4, ease: "power1.inOut" },
        "welcome",
      );
      tl.to(homeLight, { intensity: 4, duration: 0.6 }, "welcome+=0.3");
      glassMats.forEach((m) => {
        tl.to(m, { emissiveIntensity: 1.3, duration: 0.6 }, "welcome+=0.3");
      });
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
      // The heavy scene setup (PMREM, shader compile) can land after
      // ScrollTrigger's initial measurement — re-measure once settled.
      const refreshRaf = requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        cancelAnimationFrame(refreshRaf);
        gsap.ticker.remove(render);
        ro.disconnect();
        scene.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose();
            const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
            mats.forEach((m) => {
              const std = m as THREE.MeshStandardMaterial;
              std.map?.dispose();
              m.dispose();
            });
          }
        });
        envRT.dispose();
        pmrem.dispose();
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
            style={{
              fontFamily: "var(--font-playfair), serif",
              textShadow: "0 1px 12px rgba(252,253,245,0.85)",
            }}
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
