export function generatePlotData(data, selectedMissions, showAllWaypoints, animatingMission, animationProgress) {
  if (!data) return [];

  const traces = [];
  const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#f97316', '#06b6d4'];

  // polygon boundary this is where the drone must stay within
  const polyLons = data.polygon.map(p => p[0]);
  const polyLats = data.polygon.map(p => p[1]);
  traces.push({
    type: 'scattermapbox',
    lon: polyLons,
    lat: polyLats,
    mode: 'lines',
    line: { width: 3, color: '#1e40af' },
    name: 'Flight Zone',
    hoverinfo: 'name'
  });

  // if checkbox is enabled we show all the waypoints. This includes the asset poles and the photo points
  if (showAllWaypoints) {
    const assetLons = data.allWaypoints.assets.map(p => p[0]);
    const assetLats = data.allWaypoints.assets.map(p => p[1]);
    traces.push({
      type: 'scattermapbox',
      lon: assetLons,
      lat: assetLats,
      mode: 'markers',
      marker: { size: 8, color: '#dc2626' },
      name: 'Asset Poles',
      text: assetLons.map((_, i) => `Asset ${i}`),
      hovertemplate: '<b>%{text}</b><br>Lon: %{lon:.4f}<br>Lat: %{lat:.4f}<extra></extra>'
    });

    const photoLons = data.allWaypoints.photos.map(p => p[0]);
    const photoLats = data.allWaypoints.photos.map(p => p[1]);
    traces.push({
      type: 'scattermapbox',
      lon: photoLons,
      lat: photoLats,
      mode: 'markers',
      marker: { size: 5, color: '#6b7280', opacity: 0.5 },
      name: 'Photo Points',
      text: photoLons.map((_, i) => `Photo ${i}`),
      hovertemplate: '<b>%{text}</b><br>Lon: %{lon:.4f}<br>Lat: %{lat:.4f}<extra></extra>'
    });
  }

  // so for in our data we have the missions array where we get each mission
  data.missions.forEach((mission, index) => {
    if (selectedMissions.includes(mission.id)) {
      //if apart of our state array we then check if the current mission matches the mission in the animatingMission state
      const isAnimating = animatingMission === mission.id;
      // which allows us to determine how much of the route to show based on animationProgress
      // if we are not animating our coords are just the full route
      const coords = isAnimating 
        ? mission.coordinates.slice(0, animationProgress + 1)
        : mission.coordinates;
      
      const lons = coords.map(c => c[0]);
      const lats = coords.map(c => c[1]);
      const color = colors[index % colors.length];

      // if we are animating and we havent reached the end we show a faded preview
      if (isAnimating && animationProgress < mission.coordinates.length - 1) {
        const fullLons = mission.coordinates.map(c => c[0]);
        const fullLats = mission.coordinates.map(c => c[1]);
        
        traces.push({
          type: 'scattermapbox',
          lon: fullLons,
          lat: fullLats,
          mode: 'lines',
          line: { width: 2, color: color, dash: 'dot' },
          opacity: 0.3,
          name: `Mission ${mission.id} Preview`,
          hoverinfo: 'skip',
          showlegend: false
        });
      }

      // since we are not animating we show the full route line
      traces.push({
        type: 'scattermapbox',
        lon: lons,
        lat: lats,
        mode: 'lines',
        line: { 
          width: isAnimating ? 4 : 3, 
          color: color 
        },
        name: `Mission ${mission.id}`,
        hoverinfo: 'name'
      });

      // makes the markers that are apart of a mission route
      traces.push({
        type: 'scattermapbox',
        lon: lons,
        lat: lats,
        mode: 'markers',
        marker: { size: 10, color: color },
        name: `Mission ${mission.id} Points`,
        text: mission.waypointIndices.map(w => `Waypoint ${w}`),
        hovertemplate: '<b>Mission ' + mission.id + '</b><br>%{text}<br>Lon: %{lon:.4f}<br>Lat: %{lat:.4f}<extra></extra>',
        showlegend: false
      });

      // our depot is the start and end of each mission
      traces.push({
        type: 'scattermapbox',
        lon: [lons[0]],
        lat: [lats[0]],
        mode: 'markers',
        marker: { size: 14, color: '#fbbf24' },
        name: 'Depot',
        text: ['Depot (Start/End)'],
        hovertemplate: '<b>%{text}</b><br>Lon: %{lon:.4f}<br>Lat: %{lat:.4f}<extra></extra>',
        showlegend: index === 0
      });

      // if this mission is being animated, in progress and incomplete
      if (isAnimating && animationProgress > 0 && animationProgress < mission.coordinates.length) {
        //
        const currentLon = lons[lons.length - 1];
        const currentLat = lats[lats.length - 1];
        
        // pulsing dot to show the current path the drone is at
        traces.push({
          type: 'scattermapbox',
          lon: [currentLon],
          lat: [currentLat],
          mode: 'markers',
          marker: { 
            size: 20, 
            color: '#10b981',
            opacity: 0.3,
            symbol: 'circle'
          },
          name: 'Drone Pulse',
          hoverinfo: 'skip',
          showlegend: false
        });
        
        // just more styling
        traces.push({
          type: 'scattermapbox',
          lon: [currentLon],
          lat: [currentLat],
          mode: 'markers',
          marker: { 
            size: 14, 
            color: '#10b981',
            opacity: 0.5,
            symbol: 'circle'
          },
          name: 'Drone Pulse 2',
          hoverinfo: 'skip',
          showlegend: false
        });
        
        // another layer of the drone dot
        traces.push({
          type: 'scattermapbox',
          lon: [currentLon],
          lat: [currentLat],
          mode: 'markers',
          marker: { 
            size: 10, 
            color: '#10b981',
            symbol: 'circle',
            line: { color: 'white', width: 2 }
          },
          name: 'Drone',
          text: [`Waypoint ${animationProgress}/${mission.coordinates.length - 1}`],
          hovertemplate: '<b>Current Position</b><br>%{text}<br>Lon: %{lon:.4f}<br>Lat: %{lat:.4f}<extra></extra>',
          showlegend: true
        });
        
        // this shows the last few nodes of the animation
        if (animationProgress > 3) {
          const trailLength = Math.min(5, animationProgress); // we use 5 and the animation progress because it guarantees we dont go out of bounds
          const trailLons = lons.slice(-trailLength); // gets the last trail length number of coordinates
          const trailLats = lats.slice(-trailLength); // same for lat
          
          //we use this to create the fading trail
          traces.push({
            type: 'scattermapbox',
            lon: trailLons,
            lat: trailLats,
            mode: 'markers',
            marker: { 
              size: 8,
              color: '#10b981',
              opacity: 0.4,
            },
            name: 'Trail',
            hoverinfo: 'skip',
            showlegend: false
          });
        }
      }
    }
  });

  return traces;
}