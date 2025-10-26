import React from 'react';

export default function MissionControls({ 
  missions, 
  selectedMissions, 
  onToggleMission, 
  onAnimateMission,
  onStopAnimation,
  isAnimating,
  showAllWaypoints, 
  onToggleWaypoints 
}) {

  //kinda useless right now
  const exportMissions = () => {
    const data = JSON.stringify(missions, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'missions.json';
    link.click();
  }


  const handleAnimate = () => {
    const select = document.getElementById('animateMissionSelect');
    const missionId = parseInt(select.value);
    if (missionId) {
      onAnimateMission(missionId);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Missions</h3>
      <div className="grid grid-cols-6 gap-2 mb-4">
        {missions.map((mission) => (
          <button
            key={mission.id}
            onClick={() => onToggleMission(mission.id)}
            className={`px-3 py-2 rounded-lg font-medium transition-all ${
              selectedMissions.includes(mission.id)
                ? 'bg-[#123D5F] text-white shadow-md'
                : 'bg-[#A7B6B5] text-gray-700 hover:bg-[#476678] hover:text-white'
            } flex flex-col items-center justify-center`}
          
          >
            <span className="font-semibold">M{mission.id}</span>
            <span className="text-xs opacity-80 whitespace-nowrap">
              {(mission.distance / 1000).toFixed(1)}k ft
            </span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4 p-4 bg-gray-50 rounded-lg">
        <label className="text-sm font-medium text-gray-700">
          Animate Mission:
        </label>
        <select 
          id="animateMissionSelect"
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#123D5F] focus:border-[#123D5F]"
          disabled={isAnimating}
        >
          <option value="">Select a mission...</option>
          {missions.map((mission) => (
            <option key={mission.id} value={mission.id}>
              Mission {mission.id}
            </option>
          ))}
        </select>
        
        {!isAnimating ? (
          <button
            onClick={handleAnimate}
            className="px-4 py-2 bg-[#476678] text-white rounded-lg hover:bg-[#152E56] transition-all flex items-center gap-2 text-sm font-medium"
          >
            ▶ Animate
          </button>
        ) : (
          <button
            onClick={onStopAnimation}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center gap-2 text-sm font-medium animate-pulse"
          >
            ⏸ Stop
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedMissions.length === missions.length}
            onChange={(e) => {
              if (e.target.checked) {
                // Select all missions
                missions.forEach(mission => {
                  if (!selectedMissions.includes(mission.id)) {
                    onToggleMission(mission.id);
                  }
                });
              } else {
                // Deselect all missions
                selectedMissions.forEach(missionId => {
                  onToggleMission(missionId);
                });
              }
            }}
            className="w-4 h-4 text-[#123D5F] rounded focus:ring-2 focus:ring-[#123D5F]"
          />
          <span className="text-gray-700">Select All Missions</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showAllWaypoints}
            onChange={(e) => onToggleWaypoints(e.target.checked)}
            className="w-4 h-4 text-[#123D5F] rounded focus:ring-2 focus:ring-[#123D5F]"
          />
          <span className="text-gray-700">Show All Waypoints</span>
        </label>

        <button 
          onClick={exportMissions}
          className="ml-auto px-4 py-2 bg-[#152E56] text-white rounded-lg hover:bg-[#123D5F] transition-colors"
        >
          Export Missions
        </button>
      </div>
    </div>
  );
}