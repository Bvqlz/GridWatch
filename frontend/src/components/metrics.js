import { Route, MapPin, Radar, Map } from 'lucide-react';

export default function MetricsPanel({ data }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Missions</p>
            <p className="text-3xl font-bold text-gray-900">{data.totalMissions}</p>
          </div>
          <Route className="w-10 h-10 text-[#123D5F] opacity-70" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border-l-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Distance</p>
            <p className="text-3xl font-bold text-gray-900">{data.totalDistance.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">feet</p>
          </div>
          <MapPin className="w-10 h-10 text-[#476678] opacity-70" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border-l-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Coverage</p>
            <p className="text-3xl font-bold text-gray-900">{data.coverage}</p>
          </div>
          <Radar className="w-10 h-10 text-[#152E56] opacity-70" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border-l-4">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Distance</p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.round(data.totalDistance / data.totalMissions).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">feet/mission</p>
            </div>
            <Map className="w-10 h-10 text-[#476678] opacity-70" />
          </div>
        </div>
      </div>
    </div>
  );
}


