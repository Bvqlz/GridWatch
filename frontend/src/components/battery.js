export default function BatteryUsageSection({ missions }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Battery Usage per Mission</h3>
      <div className="space-y-3">
        {missions.map((mission) => {
          const batteryPercent = ((mission.distance / 37725) * 100).toFixed(1);
          const isNearLimit = batteryPercent > 90;
          const isWarning = batteryPercent > 80;
          
          return (
            <div key={mission.id} className="flex items-center gap-2">
              <div className="w-24 text-sm font-medium text-gray-700">
                Mission {mission.id}
              </div>
              <div className="flex-1 max-w-4xl">
                <div className="relative w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 h-6 transition-all rounded-full ${
                      isNearLimit ? 'bg-red-500' : 
                      isWarning ? 'bg-yellow-500' : 
                      'bg-green-500'
                    }`}
                    style={{ width: `${batteryPercent}%` }}
                  >
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {batteryPercent}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-32 text-sm text-gray-600">
                {mission.distance.toLocaleString()} ft
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Safe (&lt;80%)</span>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Warning (80-90%)</span>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Near Limit (&gt;90%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}