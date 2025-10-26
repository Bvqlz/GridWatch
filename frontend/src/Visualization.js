import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from './services/api';

import Header from './components/header';
import MetricsPanel from './components/metrics';
import BatteryUsageSection from './components/battery';
import MissionControls from './components/missions';
import MissionMap from './components/map';
import MissionDetailsTable from './components/missionTable';
import MissionDistributionChart from './components/missionGraph';

export default function DroneVisualization() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMissions, setSelectedMissions] = useState([]);
  const [showAllWaypoints, setShowAllWaypoints] = useState(false);

  // states for our animations
  const [animatingMission, setAnimatingMission] = useState(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // we load the data when page loads
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      //mission data is from the api the large json that was restructured 
      const missionData = await api.fetchMissionData();
      setData(missionData);
      setSelectedMissions(missionData.missions.map(m => m.id)); //map over each mission in the array. 
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false); //loading screen goes away
    }
  };

  //simple filter for different missions
  //cool part is the memoized function so it doesnt recreate on every render
  const toggleMission = useCallback((missionId) => {
    setSelectedMissions(prev =>
      prev.includes(missionId)
        ? prev.filter(id => id !== missionId)
        : [...prev, missionId]
    );
  }, []); 

  //set to false or true 
  const handleToggleWaypoints = useCallback((value) => {
    setShowAllWaypoints(value);
  }, []);

  // important because more assets was crashing webgl bc of rerenders from the toggles
  // caches result from the api and only recalculates if data changes
  const missions = useMemo(() => data?.missions || [], [data]);

  // passes missionId to animate
  const handleAnimateMission = useCallback((missionId) => {
    if (!data || isAnimating) return; // function fails if we dont have data or are already animating

    // check if the mission exists but kinda redundant
    const mission = data.missions.find(m => m.id === missionId);
    if (!mission) return;
    
    // deselects all missions to only show the animated one 
    // we update states 
    setSelectedMissions([missionId]);
    setAnimatingMission(missionId);
    setAnimationProgress(0);
    setIsAnimating(true);
    
    
    //boundary of this specific mission
    const totalSteps = mission.coordinates.length;
    let step = 0; // counter for progress
    
    const interval = setInterval(() => {
      step++;
      setAnimationProgress(step);
      
      // once step exceeds boundary we exit
      if (step >= totalSteps - 1) {
        clearInterval(interval); // stops the interval
        setTimeout(() => {
          setAnimatingMission(null);
          setIsAnimating(false);
        }, 1000); // update state again after some delay
      }
    }, 175); // but each waypoint takes 175ms
    
    // call to clear interval if comp unmounts
    return () => clearInterval(interval);
  }, [data, isAnimating]); //depends on data on isAnimating

  // simple wrapper function to update states
  const stopAnimation = useCallback(() => {
    setAnimatingMission(null);
    setIsAnimating(false);
    setAnimationProgress(0);
  }, []);

  //simple loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-xl text-gray-700">Loading mission data...</p>
        </div>
      </div>
    );
  }

  //if data wasnt found we show an error
  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">Error loading data</p>
          <button 
            onClick={loadData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        <MetricsPanel data={data} />
        
        <BatteryUsageSection missions={missions} />
        
        <MissionControls 
          missions={missions}
          selectedMissions={selectedMissions}
          onToggleMission={toggleMission}
          onAnimateMission={handleAnimateMission}
          onStopAnimation={stopAnimation}
          isAnimating={isAnimating}
          showAllWaypoints={showAllWaypoints}
          onToggleWaypoints={handleToggleWaypoints}
        />
                
        <MissionMap 
          data={data}
          selectedMissions={selectedMissions}
          showAllWaypoints={showAllWaypoints}
          animatingMission={animatingMission}
          animationProgress={animationProgress}
        />
        
        <MissionDetailsTable 
          missions={missions} 
          totalDistance={data.totalDistance} 
        />
        
        <MissionDistributionChart missions={missions} />
      </div>
    </div>
  );
}