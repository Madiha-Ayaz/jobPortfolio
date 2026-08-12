import * as THREE from 'three';

/**
 * Creates a circular texture for THREE.Points to make particles appear round instead of square
 */
export function createCircularTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  
  if (!context) {
    throw new Error('Could not get canvas context');
  }
  
  // Create a circular gradient
  const center = size / 2;
  const gradient = context.createRadialGradient(center, center, 0, center, center, center);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');   // White center
  gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.8)'); // Semi-transparent middle
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');    // Transparent edge
  
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  
  return texture;
}