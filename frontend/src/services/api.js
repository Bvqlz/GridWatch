
export const api = {
  async fetchMissionData() {
    try {
      // Fetch all data files separately to avoid merge conflicts
      const response = await fetch(`${process.env.REACT_APP_API_URL}/mission-data`);
      if (!response.ok) throw new Error('Failed to fetch mission data');
      const rawData = await response.json();
      
      // Now we have clean separation: missionPaths, assetPoints, photoPoints, polygonBoundary
      const { missionPaths, assetPoints, photoPoints, polygonBoundary } = rawData;
      
      // Transform to frontend format
      return {
        missions: missionPaths.missions.map(m => ({
          id: m.mission_id,
          distance: m.total_distance_ft,
          waypoints: m.num_waypoints,
          photoPoints: m.num_photo_points,
          coordinates: m.waypoints.map(wp => [wp.longitude, wp.latitude]),
          waypointIndices: m.waypoints.map(wp => wp.waypoint_index)
        })),
        depot: missionPaths.summary?.depot_coordinates || {},
        polygon: polygonBoundary.coordinates || [],
        totalMissions: missionPaths.summary?.total_missions || 0,
        totalDistance: missionPaths.summary?.total_distance_ft || 0,
        coverage: `${missionPaths.summary?.total_photo_points_visited || 0} points`,
        allPoints: photoPoints.points || [],
        allWaypoints: {
          assets: assetPoints.points?.map(p => [p.longitude, p.latitude]) || [],
          photos: photoPoints.points?.map(p => [p.longitude, p.latitude]) || []
        }
      };
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async optimizeRoutes(params = {}) {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!response.ok) throw new Error('Optimization failed');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};
