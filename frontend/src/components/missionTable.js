export default function MissionDetailsTable({ missions, totalDistance }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Mission Details</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Mission</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Waypoints</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Distance (ft)</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">% of Total</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {missions.map((mission) => (
              <tr key={mission.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900 font-medium text-center">
                  Mission {mission.id}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 text-center">
                  {mission.waypoints}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 text-center">
                  {mission.distance.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 text-center">
                  {((mission.distance / totalDistance) * 100).toFixed(1)}%
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="px-2 py-1 text-xs font-medium text-green-800">
                    Within Limit
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}