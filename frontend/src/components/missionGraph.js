import Plot from 'react-plotly.js';

export default function MissionDistributionChart({ missions }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Mission Distance Distribution</h3>
      <Plot
        data={[
          {
            x: missions.map(m => `M${m.id}`),
            y: missions.map(m => m.distance),
            type: 'bar',
            marker: {
              color: missions.map(m => {
                const percent = (m.distance / 37725) * 100;
                return percent > 90 ? '#ef4444' : percent > 80 ? '#f59e0b' : '#10b981';
              }),
            },
            text: missions.map(m => `${m.distance.toLocaleString()} ft`),
            textposition: 'outside',
            hovertemplate: '<b>Mission %{x}</b><br>Distance: %{y:,.0f} ft<br>Battery: ' +
              missions.map(m => `${((m.distance / 37725) * 100).toFixed(1)}%`) +
              '<extra></extra>'
          },
          {
            x: missions.map(m => `M${m.id}`),
            y: Array(missions.length).fill(37725),
            type: 'scatter',
            mode: 'lines',
            name: 'Battery Limit',
            line: { color: 'red', width: 2, dash: 'dash' },
            hoverinfo: 'skip'
          }
        ]}
        layout={{
          title: {
            text: 'Distance per Mission vs Battery Limit (37,725 ft)',
            font: { size: 14 }
          },
          xaxis: { 
            title: 'Mission',
            tickfont: { size: 10 }
          },
          yaxis: { 
            title: 'Distance (feet)',
            tickformat: ',.0f'
          },
          height: 450,
          showlegend: true,
          legend: { 
            x: 1, 
            y: 1,
            xanchor: 'right',
            yanchor: 'top',
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            bordercolor: '#e5e7eb',
            borderwidth: 1
          },
          margin: { t: 80, b: 60, l: 80, r: 20 },
          hovermode: 'closest'
        }}
        config={{ 
          responsive: true, 
          displayModeBar: false 
        }}
        style={{ width: '100%' }}
      />
    </div>
  );
}