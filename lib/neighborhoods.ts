import type { Neighborhood } from './types';
// Original, approximate prototype areas, not official administrative boundaries.
// Coordinates are [longitude, latitude] (GeoJSON). Shared by map and server resolver.
export const boundaryVersion = 'prototype-2026-09-v2';
export const neighborhoods: Neighborhood[] = [
  { id: 'graefekiez', name: 'Graefekiez', district: 'Kreuzberg', aliases: ['kreuzberg', 'graefe', 'gräfekiez'], description: 'Canal-side conversations & little everyday rituals.', color: '#b05e44', center: [52.4917, 13.4150], geometry: { type: 'Polygon', coordinates: [[[13.4080,52.4870],[13.4212,52.4870],[13.4230,52.4938],[13.4140,52.4966],[13.4070,52.4940],[13.4080,52.4870]]] } },
  { id: 'reuterkiez', name: 'Reuterkiez', district: 'Neukölln', aliases: ['neukolln','neukölln','reuter'], description: 'A hundred languages, a familiar corner.', color: '#7d8963', center: [52.4878,13.4325], geometry: { type: 'Polygon', coordinates: [[[13.4240,52.4830],[13.4390,52.4830],[13.4420,52.4895],[13.4320,52.4935],[13.4250,52.4925],[13.4240,52.4830]]] } },
  { id: 'bergmannkiez', name: 'Bergmannkiez', district: 'Kreuzberg', aliases: ['kreuzberg','bergmann','marheineke'], description: 'Market mornings, park afternoons, stories in between.', color: '#aa8c55', center: [52.4887,13.3920], geometry: { type: 'Polygon', coordinates: [[[13.3820,52.4840],[13.4010,52.4840],[13.4040,52.4905],[13.3990,52.4940],[13.3830,52.4930],[13.3820,52.4840]]] } },
  { id: 'schillerkiez', name: 'Schillerkiez', district: 'Neukölln', aliases: ['neukolln','neukölln','schiller','tempelhofer feld'], description: 'Wide skies and the people who live beneath them.', color: '#788e94', center: [52.4752,13.4190], geometry: { type: 'Polygon', coordinates: [[[13.4110,52.4705],[13.4260,52.4705],[13.4280,52.4782],[13.4220,52.4804],[13.4110,52.4785],[13.4110,52.4705]]] } },
  // Venue: https://www.klu.org/directions (Großer Grasbrook 17, 20457 Hamburg).
  // Original approximate area around KLU, not the official HafenCity boundary.
  { id: 'hafencity', name: 'HafenCity', district: 'Hamburg', aliases: ['hamburg', 'hafencity', 'hafen city', '20457', 'klu', 'kühne logistics university', 'kuhne logistics university', 'kuehne logistics university', 'großer grasbrook', 'grosser grasbrook'], description: 'Harbor air & shared moments around Kühne Logistics University.', color: '#587f91', center: [53.54057,9.99437], geometry: { type: 'Polygon', coordinates: [[[9.9875,53.5370],[10.0030,53.5370],[10.0030,53.5445],[9.9875,53.5445],[9.9875,53.5370]]] } },
];
export function getNeighborhood(id: string) { return neighborhoods.find(n => n.id === id); }
export function pointInPolygon(lng: number, lat: number, ring: number[][]) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > lat) !== (yj > lat) && lng < (xj-xi)*(lat-yi)/(yj-yi)+xi) inside = !inside;
  }
  return inside;
}
export function resolveLocation(lat: number, lng: number, accuracy: number) {
  const n = neighborhoods.find(n => pointInPolygon(lng, lat, n.geometry.coordinates[0]));
  if (!n) return { status: 'outside' as const };
  // Conservative accuracy-circle test: distance to every boundary segment in local meters.
  const ring = n.geometry.coordinates[0];
  const scaleX = 111320 * Math.cos(lat * Math.PI / 180), scaleY = 111320;
  let distance = Infinity;
  for (let i = 1; i < ring.length; i++) {
    const ax = (ring[i-1][0]-lng)*scaleX, ay = (ring[i-1][1]-lat)*scaleY;
    const bx = (ring[i][0]-lng)*scaleX, by = (ring[i][1]-lat)*scaleY;
    const dx = bx-ax, dy = by-ay, t = Math.max(0,Math.min(1,-(ax*dx+ay*dy)/(dx*dx+dy*dy)));
    distance = Math.min(distance,Math.hypot(ax+t*dx,ay+t*dy));
  }
  if (accuracy > distance || accuracy > 250) return { status: 'uncertain' as const };
  return { status: 'resolved' as const, neighborhood: n };
}
