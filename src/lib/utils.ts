// src/lib/utils.ts
import * as THREE from 'three';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts latitude and longitude to 3D coordinates on a sphere.
 * @param lat Latitude in degrees
 * @param lon Longitude in degrees
 * @param radius The radius of the sphere
 * @returns THREE.Vector3 A 3D vector representing the position.
 */
export function latLonToVector3(lat: number, lon: number, radius: number) {
  // Convert latitude and longitude from degrees to radians
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  // Calculate the 3D coordinates
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}
