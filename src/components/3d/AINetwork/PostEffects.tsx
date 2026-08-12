import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

export default function PostEffects() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={1.2}
        luminanceThreshold={0.15}
        luminanceSmoothing={0.9}
        mipmapBlur
        radius={0.8}
      />
      <Vignette
        offset={0.3}
        darkness={0.6}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
