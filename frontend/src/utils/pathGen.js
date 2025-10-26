// Helper function to generate realistic mission paths
export function generateMissionPath(depot, numWaypoints, centerLon, centerLat, startAngle) {
  const path = [depot]; // Start at depot
  
  const angleStep = (2 * Math.PI) / 8; // Divide area into 8 sectors
  const radius = 0.03;
  
  // Generate waypoints in a sector pattern
  for (let i = 1; i < numWaypoints - 1; i++) {
    const angle = startAngle + (i / (numWaypoints - 2)) * angleStep;
    const r = radius * (0.6 + 0.4 * (i / numWaypoints));
    
    const lon = centerLon + r * Math.cos(angle) + (Math.random() - 0.5) * 0.005;
    const lat = centerLat + r * Math.sin(angle) + (Math.random() - 0.5) * 0.005;
    
    path.push([lon, lat]);
  }
  
  path.push(depot); // Return to depot
  return path;
}