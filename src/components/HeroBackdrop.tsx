import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { easing } from 'maath';

const PHOTO_Z = -45;

/**
 * Full-bleed photographic backdrop (see src/data/heroConfig.ts for the
 * image registry + schedule) with a slow Ken-Burns drift and a whisper of
 * pointer parallax. Sits far behind the glass name, which refracts it.
 */
export function PhotoBackdrop({ file }: { file: string }) {
  const texture = useLoader(
    THREE.TextureLoader,
    `${import.meta.env.BASE_URL}backdrops/${file}`
  );
  texture.colorSpace = THREE.SRGBColorSpace;
  const meshRef = useRef<THREE.Mesh>(null);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  // `size` only changes on resize — deriving the plane from it keeps the
  // geometry stable frame-to-frame. (Reading viewport.getCurrentViewport in
  // a selector returns a fresh object every store update, re-rendering and
  // rebuilding the plane whenever the pointer moves — a jumpy glitch.)
  const size = useThree((s) => s.size);
  const { w, h } = useMemo(() => {
    const dist = camera.position.z - PHOTO_Z;
    const vh = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * dist;
    const vw = vh * (size.width / size.height);
    const img = texture.image as HTMLImageElement;
    const aspect = img.width / img.height;
    // Cover-fit at the plane's depth, with margin for drift + parallax.
    let w = vw;
    let h = w / aspect;
    if (h < vh) {
      h = vh;
      w = h * aspect;
    }
    return { w: w * 1.14, h: h * 1.14 };
  }, [camera, size, texture]);
  useFrame((state, delta) => {
    const m = meshRef.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    // Damped, so neither pointer jumps nor re-renders can make the image snap.
    easing.damp3(
      m.position,
      [
      Math.sin(t * 0.02) * (w * 0.02) - state.pointer.x * w * 0.012,
      Math.cos(t * 0.016) * (h * 0.015) - state.pointer.y * h * 0.012,
      PHOTO_Z],

      0.8,
      delta
    );
  });
  return (
    <mesh ref={meshRef} position={[0, 0, PHOTO_Z]}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={texture} depthWrite={false} toneMapped={false} />
    </mesh>);

}
