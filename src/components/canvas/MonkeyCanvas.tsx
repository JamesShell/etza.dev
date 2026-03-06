"use client";

import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF, useFBX } from "@react-three/drei";
import {
    AnimationMixer,
    LoopRepeat,
    PerspectiveCamera,
    Vector3,
} from "three";
import { lerp } from "three/src/math/MathUtils.js";
import GlobalLoader from "../ui/GlobalLoader";

extend({});

// ---------- Types ----------

type HoverState = "" | "about" | "work" | "contact" | "github" | "linkedin" | "twitter" | "dribbble";

interface MonkeyProps {
    isMobile: boolean;
    lightPosition: [number, number, number];
    hovered: HoverState;
    onLoaded?: () => void;
}

interface MonkeyCanvasProps {
    className?: string;
    hovered: HoverState;
}

// ---------- Constants ----------

const camera = new PerspectiveCamera(28, 1, 0.1, 1000);
camera.position.set(8, 0, -2);

const CAMERA_POSITIONS: Record<string, { position: number[]; target: number[] }> = {
    "": { position: [8, 0, -2], target: [0, -0.8, 0] },
    about: { position: [5, -6, 0], target: [0, 0, 0] },
    work: { position: [5, -5, -3], target: [2, 1.5, -3.15] },
    contact: { position: [2, -1, 10], target: [-1, 1, 3.5] },
    github: { position: [5, -6, 0], target: [0, 0, 0] },
    linkedin: { position: [5, -5, -3], target: [2, 1.5, -3.15] },
    twitter: { position: [2, -1, 10], target: [-1, 1, 3.5] },
    dribbble: { position: [5, -6, 0], target: [0, 0, 0] },
};

// ---------- Helpers ----------

const AspectRatioController: React.FC = () => {
    const { camera: cam, size } = useThree();

    useEffect(() => {
        const clamped = Math.max(0.8, Math.min(2.0, size.width / size.height));
        (cam as PerspectiveCamera).aspect = clamped;
        cam.updateProjectionMatrix();
    }, [cam, size]);

    return null;
};

function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ---------- Monkey (3-D character) ----------

const Monkey: React.FC<MonkeyProps> = ({ isMobile, lightPosition, hovered, onLoaded }) => {
    const { scene, animations } = useGLTF("./space_boi/space_boi.glb");

    // Skinned mesh
    const fbxCharacter = useFBX("./space_boi/animations/idle/animated_idle.fbx");

    // Animation banks
    const idleAnimations = {
        lookingAround: useFBX("./space_boi/animations/idle/Looking Around.fbx"),
        animatedIdle: useFBX("./space_boi/animations/idle/animated_idle.fbx"),
    };
    const hoverAnimations = {
        cockyHeadTurn: useFBX("./space_boi/animations/on_hover/Cocky Head Turn.fbx"),
        headNodYes: useFBX("./space_boi/animations/on_hover/Head Nod Yes.fbx"),
    };
    const afterHoverAnimations = {
        nervouslyLookAround: useFBX("./space_boi/animations/after_hover/Nervously Look Around.fbx"),
        standCoverToLook: useFBX("./space_boi/animations/after_hover/Stand Cover To Look.fbx"),
    };

    const planetsRef = useRef<any[]>([]);
    const characterRef = useRef<any>(null);
    const wavesRef = useRef<any[]>([]);
    const mixerRef = useRef<AnimationMixer>(null!);
    const controlsRef = useRef<any>(null);
    const { camera: cam } = useThree();

    const [scrollY, setScrollY] = useState(0);
    const [currentAction, setCurrentAction] = useState<any>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isAnimPlaying, setIsAnimPlaying] = useState(false);
    const [animSet, setAnimSet] = useState<"idle" | "hover" | "afterHover">("idle");
    const [recovering, setRecovering] = useState(false);
    const previousHovered = useRef<HoverState>("");
    const timeoutRef = useRef<NodeJS.Timeout>(null);

    // Scroll listener (capped at 220)
    useEffect(() => {
        const onScroll = () => setScrollY(Math.min(window.scrollY, 220));
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Play a random animation from a given bank
    const playRandomAnimation = React.useCallback(
        (type: "idle" | "hover" | "afterHover", force = false) => {
            if (!mixerRef.current || !characterRef.current || !isInitialized) return;

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            if (force || animSet !== type) setIsAnimPlaying(false);
            if (!force && isAnimPlaying && animSet !== "idle") return;

            // Pick the FBX clip
            let fbx: any;
            switch (type) {
                case "idle":
                    fbx = Math.random() < 0.7
                        ? idleAnimations.animatedIdle
                        : pickRandom(Object.values(idleAnimations).filter(v => v !== idleAnimations.animatedIdle));
                    break;
                case "hover":
                    fbx = pickRandom(Object.values(hoverAnimations));
                    break;
                case "afterHover":
                    fbx = pickRandom(Object.values(afterHoverAnimations));
                    break;
                default:
                    fbx = idleAnimations.animatedIdle;
            }

            if (!fbx?.animations?.length) return;

            const prevAction = currentAction;
            const newAction = mixerRef.current!.clipAction(fbx.animations[0], characterRef.current);

            // Cross-fade
            if (prevAction && prevAction !== newAction) {
                const fade = force ? (type === "hover" ? 0.15 : 0.2) : 0.3;
                prevAction.fadeOut(fade);
                newAction.reset().fadeIn(fade).play();
            } else {
                newAction.reset().fadeIn(0.1).play();
            }

            // Schedule returning to idle after one-shot clips
            if (type === "idle") {
                const isDefault = fbx === idleAnimations.animatedIdle;
                if (isDefault) {
                    newAction.setLoop(LoopRepeat, Infinity);
                    setIsAnimPlaying(false);
                    timeoutRef.current = setTimeout(() => {
                        if (animSet === "idle" && !isAnimPlaying) playRandomAnimation("idle");
                    }, 6000 + Math.random() * 4000);
                } else {
                    newAction.setLoop(2200 as any, 1);
                    newAction.clampWhenFinished = true;
                    setIsAnimPlaying(true);
                    const dur = fbx.animations[0].duration * 1000;
                    timeoutRef.current = setTimeout(() => {
                        setIsAnimPlaying(false);
                        setTimeout(() => playRandomAnimation("idle"), 100);
                    }, dur + 500);
                }
            } else {
                const maxDur = type === "hover" ? 2 : 3;
                newAction.setLoop(2200 as any, 1);
                newAction.clampWhenFinished = true;
                setIsAnimPlaying(true);
                timeoutRef.current = setTimeout(() => {
                    setIsAnimPlaying(false);
                    setAnimSet("idle");
                    if (type === "afterHover") setRecovering(true);
                    playRandomAnimation("idle");
                }, maxDur * 1000);
            }

            setCurrentAction(newAction);
        },
        [currentAction, idleAnimations, hoverAnimations, afterHoverAnimations, isInitialized, isAnimPlaying, animSet],
    );

    // One-time character init
    useEffect(() => {
        if (!fbxCharacter?.animations?.length || isInitialized) return;

        mixerRef.current = new AnimationMixer(fbxCharacter);
        characterRef.current = fbxCharacter;
        fbxCharacter.position.set(0, -10, 0);
        fbxCharacter.scale.set(0.01, 0.01, 0.01);

        const initial = idleAnimations.animatedIdle;
        if (initial?.animations?.length) {
            const action = mixerRef.current.clipAction(initial.animations[0], fbxCharacter);
            action.setLoop(LoopRepeat, Infinity);
            action.play();
            setCurrentAction(action);
        }
        setIsInitialized(true);
        onLoaded?.();

        return () => {
            mixerRef.current?.stopAllAction();
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fbxCharacter]);

    // Parse scene graph once
    useEffect(() => {
        scene.traverse((child: any) => {
            if (child.name === "particles" || child.name === "Cube" || child.name === "body") {
                child.visible = false;
            }
            if (child.name.startsWith("waves") && child.type === "Object3D") {
                child.visible = false;
            }
            if (["Sphere011", "Sphere010", "Sphere009", "Sphere008", "Sphere007"].includes(child.name)) {
                child.visible = false;
            }
            if (child.name === "Sphere" || child.name === "Sphere001") {
                let group = planetsRef.current.find((p: any) => p.name === "SphereGroup");
                if (!group) { group = { name: "SphereGroup", children: [] }; planetsRef.current.push(group); }
                group.children.push(child);
                child.visible = false;
            }
            if (child.name.startsWith("Sphere00") && child.name !== "Sphere001") {
                planetsRef.current.push(child);
                child.visible = false;
            }
        });
    }, [scene, animations]);

    // Hover → animation switch
    useEffect(() => {
        if (hovered === previousHovered.current || !isInitialized) return;
        if (hovered !== "") {
            setAnimSet("hover");
            playRandomAnimation("hover", true);
        } else if (previousHovered.current !== "") {
            setAnimSet("afterHover");
            playRandomAnimation("afterHover", true);
        }
        previousHovered.current = hovered;
    }, [hovered, isInitialized, playRandomAnimation]);

    // Backup idle timer
    useEffect(() => {
        if (animSet !== "idle" || isAnimPlaying || !isInitialized) return;
        const ms = recovering ? 100 : 8000 + Math.random() * 4000;
        const id = setInterval(() => {
            if (!isAnimPlaying && animSet === "idle" && isInitialized) {
                if (recovering) setRecovering(false);
                playRandomAnimation("idle");
            }
        }, ms);
        return () => clearInterval(id);
    }, [animSet, isAnimPlaying, isInitialized, recovering, playRandomAnimation]);

    // Per-frame updates
    useFrame((state, delta) => {
        mixerRef.current?.update(delta);

        // Character floating + rotation
        if (characterRef.current) {
            const targetY = hovered === "" ? (-scrollY * 0.01) - 3.25 : -3.25;
            characterRef.current.position.y = lerp(characterRef.current.position.y, targetY, 0.25);
            characterRef.current.rotation.y = Math.PI / 2 - 0.5 + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
        }

        // Planets orbit + scroll hide
        const hidePlanets = true; // scrollY > 100;
        planetsRef.current.forEach((planet: any, idx) => {
            if (planet.name === "SphereGroup") {
                planet.children.forEach((c: any, ci: number) => {
                    c.visible = !hidePlanets;
                    if (c.visible) {
                        c.position.applyAxisAngle(new Vector3(0, 1, 0), 0.005);
                        c.rotation.z -= 0.025 + ci * 0.01;
                    }
                });
            } else if (planet) {
                planet.visible = !hidePlanets;
                if (planet.visible) {
                    planet.position.applyAxisAngle(new Vector3(0, 1, 0), 0.005);
                    planet.rotation.z += 0.025 + idx * 0.001;
                }
            }
        });

        // Waves
        if (wavesRef.current.length) {
            const s = Math.sin(state.clock.elapsedTime * 0.5) * 20;
            wavesRef.current.forEach((w: any) => {
                if (w.name !== "waves2") w.scale.set(105 - Math.abs(s), 105 - Math.abs(s), 0.5);
            });
        }

        // Camera lerp
        if (controlsRef.current) {
            const key = hovered || "";
            const target = CAMERA_POSITIONS[key] ?? CAMERA_POSITIONS[""];

            // Dynamic overrides for work/contact linked to actual object positions
            let pos = target;
            if ((hovered === "work" || hovered === "linkedin") && planetsRef.current.length) {
                const sg = planetsRef.current.find((p: any) => p.name === "SphereGroup");
                if (sg?.children?.[0]) {
                    const wp = sg.children[0].getWorldPosition(new Vector3());
                    pos = { position: [wp.x + 3, wp.y + 2, wp.z + 3], target: [wp.x, wp.y, wp.z] };
                }
            }
            if (hovered === "contact" || hovered === "twitter") {
                let s5: any = null;
                scene.traverse((c: any) => { if (c.name === "Sphere005") s5 = c; });
                if (s5) {
                    const wp = s5.getWorldPosition(new Vector3());
                    pos = { position: [wp.x + 3, wp.y + 2, wp.z + 3], target: [wp.x, wp.y, wp.z] };
                }
            }

            const speed = hovered ? 0.15 : 0.075;
            cam.position.lerp(new Vector3(...pos.position), speed);
            controlsRef.current.target.lerp(new Vector3(...pos.target), speed);
            controlsRef.current.update();
        }
    });

    return (
        <>
            <OrbitControls
                ref={controlsRef}
                enableZoom={false}
                enableDamping
                dampingFactor={0.1}
                enablePan={false}
                autoRotate={!hovered}
                autoRotateSpeed={0.5}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 2}
            />
            <mesh>
                <hemisphereLight intensity={1.5} groundColor="white" />
                <pointLight intensity={15} position={lightPosition} />
                <spotLight intensity={20} castShadow position={[-1, 5, 0]} penumbra={1} angle={0.12} />
                <primitive object={scene} scale={1} position={[0, -2.6, 0]} rotation={[0, 1.3, 0]} />
            </mesh>
            {characterRef.current && (
                <primitive
                    object={characterRef.current}
                    scale={[0.01, 0.01, 0.01]}
                    position={[0, -3.25, 0]}
                />
            )}
        </>
    );
};

// ---------- Canvas wrapper ----------

const MonkeyCanvas: React.FC<MonkeyCanvasProps> = ({ className, hovered }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 600px)");
        setIsMobile(mq.matches);
        const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);

    return (
        <div className="relative w-full h-full">
            {isLoading && <GlobalLoader overlay={false} />}
            <Canvas
                className={className}
                shadows
                camera={camera}
                gl={{ preserveDrawingBuffer: true }}
                style={{ opacity: isLoading ? 0 : 1, transition: "none" }}
            >
                <Suspense fallback={null}>
                    <AspectRatioController />
                    <Monkey
                        isMobile={isMobile}
                        lightPosition={[0, 0, 10]}
                        hovered={hovered}
                        onLoaded={() => setIsLoading(false)}
                    />
                </Suspense>
                <Preload all />
            </Canvas>
        </div>
    );
};

export { MonkeyCanvas };
export default MonkeyCanvas;
