import { useState, useEffect, useRef } from 'react';
import Plot from 'react-plotly.js';
import { generatePlotData } from '../utils/mapDataGen';

export default function MissionMap({ data, selectedMissions, showAllWaypoints, animatingMission, animationProgress }) {
  const [mapError, setMapError] = useState(null);
  const plotRef = useRef(null);
  
  // Store map view state
  const [mapView, setMapView] = useState({
    center: {
      lon: data.missions[0]?.coordinates[0]?.[0],
      lat: data.missions[0]?.coordinates[0]?.[1]
    },
    zoom: 14
  });

  // Track if this is the initial render
  const isInitialRender = useRef(true);
  
  // Track user interaction to prevent animation from overriding
  const userInteracting = useRef(false);
  const interactionTimeout = useRef(null);

  const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN;
  
  const animatingMissionData = animatingMission 
    ? data.missions.find(m => m.id === animatingMission)
    : null;
  
  const animationPercentage = animatingMissionData && animationProgress > 0
    ? Math.round((animationProgress / (animatingMissionData.coordinates.length - 1)) * 100)
    : 0;
  
  useEffect(() => {
    if (!mapboxToken) {
      setMapError('mapbox token missing');
    }
    
    return () => {
      // Clean up interaction timeout
      if (interactionTimeout.current) {
        clearTimeout(interactionTimeout.current);
      }
      
      if (plotRef.current && plotRef.current.el) {
        try {
          const canvas = plotRef.current.el.querySelector('canvas');
          if (canvas) {
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl && gl.getExtension('WEBGL_lose_context')) {
              gl.getExtension('WEBGL_lose_context').loseContext();
            }
          }
        } catch (e) {
          console.warn('Error cleaning up WebGL:', e);
        }
      }
    };
  }, [mapboxToken]);

  if (mapError) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Mission Routes</h3>
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800 mb-2">Map config error:</p>
          <p className="text-sm text-yellow-700">{mapError}</p>
        </div>
      </div>
    );
  }

  const plotData = generatePlotData(data, selectedMissions, showAllWaypoints, animatingMission, animationProgress);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Mission Routes Map</h3>
      
      {/* Animation Info Overlay */}
      {animatingMissionData && (
        <div className="mb-4 bg-white border border-gray-300 rounded-lg p-4 shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-800">
                Mission {animatingMission} in Progress
              </span>
            </div>
            <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded">
              {animationPercentage}% Complete
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-300 ease-linear"
              style={{ width: `${animationPercentage}%` }}
            />
          </div>
          
          <div className="mt-2 flex justify-between text-sm text-gray-600">
            <span>Waypoint: {animationProgress} / {animatingMissionData.coordinates.length - 1}</span>
            <span>Distance: {animatingMissionData.distance.toLocaleString()} ft</span>
          </div>
        </div>
      )}
      
      <div style={{ width: '100%', height: '700px' }}>
        <Plot
          ref={plotRef}
          data={plotData}
          layout={{
            mapbox: {
              accesstoken: mapboxToken,
              style: 'outdoors',
              center: mapView.center,
              zoom: mapView.zoom
            },
            height: 700,
            width: undefined,
            margin: { l: 0, r: 0, t: 0, b: 0 },
            showlegend: true,
            legend: {
              x: 0.02,
              y: 0.98,
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              bordercolor: '#e5e7eb',
              borderwidth: 2
            },
            hovermode: 'closest',
            autosize: true,
            uirevision: 'true' // Preserve UI state (zoom/pan) across updates
          }}
          config={{
            responsive: true,
            displayModeBar: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['lasso2d', 'select2d'],
            toImageButtonOptions: {
              format: 'png',
              filename: 'mission_map',
              height: 1080,
              width: 1920,
              scale: 1
            }
          }}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler={true}
          onInitialized={(figure, graphDiv) => {
            if (plotRef.current) {
              plotRef.current.el = graphDiv;
            }
          }}
          onUpdate={(figure) => {
            // Mark that user is interacting
            userInteracting.current = true;
            
            // Clear any existing timeout
            if (interactionTimeout.current) {
              clearTimeout(interactionTimeout.current);
            }
            
            // Reset user interaction flag after 500ms of no updates
            interactionTimeout.current = setTimeout(() => {
              userInteracting.current = false;
            }, 500);
            
            // Update our state when user zooms/pans (but not on initial render)
            if (!isInitialRender.current && figure.layout.mapbox) {
              setMapView({
                center: figure.layout.mapbox.center,
                zoom: figure.layout.mapbox.zoom
              });
            }
            isInitialRender.current = false;
          }}
          onError={(err) => {
            console.error('Plotly error:', err);
            setMapError('Error rendering map.');
          }}
        />
      </div>
    </div>
  );
}