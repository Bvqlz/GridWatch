# GridWatch - Drone Route Optimization System

A full-stack application for optimizing and visualizing drone flight paths for power grid inspection. Built for NextEra Energy to efficiently plan multi-mission drone routes covering photo waypoints and asset inspections.

## Project Overview

GridWatch consists of two main components:
- **Backend**: Python-based route optimizer using Google OR-Tools
- **Frontend**: React-based interactive visualization dashboard

The system optimizes flight paths across 11 drone missions, covering approximately 3,250 waypoints over 117.51 km while respecting battery constraints and flight boundaries.

## Prerequisites

### Backend Requirements
- Python 3.11 or higher
- pip package manager

### Frontend Requirements
- Node.js 16.x or higher
- npm 8.x or higher

### Optional
- Git (for version control)

## Installation

### 1. Clone or Download the Project

```powershell
git clone <repository-url>
cd GridEye
```

Or extract the project folder if downloaded as a ZIP file.

### 2. Backend Setup

#### Navigate to Backend Directory
```powershell
cd backend\drone-optimizer
```

#### Create Python Virtual Environment
```powershell
python -m venv .venv
```

#### Activate Virtual Environment
```powershell
.\.venv\Scripts\Activate.ps1
```

**Note**: If you encounter an execution policy error, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Install Python Dependencies
```powershell
pip install -r requirements.txt
```

#### Generate Optimized Routes (First Time Only)
```powershell
python terminal.py
```

This will process the waypoint data and generate optimized mission paths in the `output/` directory.

### 3. Frontend Setup

#### Navigate to Frontend Directory
Open a new terminal window and run:
```powershell
cd frontend
```

#### Install Node Dependencies
```powershell
npm install
```

#### Configure Environment Variables
The `.env` file should already be configured with:
```
REACT_APP_MAPBOX_TOKEN=<your-mapbox-token>
REACT_APP_API_URL=http://localhost:5000
```

If you need to update the Mapbox token, edit the `.env` file in the frontend directory.

## Running the Application

You will need to run both the backend and frontend servers simultaneously.

### Terminal 1: Start Backend Server

```powershell
cd backend
python server.py
```

The Flask API server will start on `http://localhost:5000`

### Terminal 2: Start Frontend Development Server

```powershell
cd frontend
npm start
```

The React application will start on `http://localhost:3000` and should automatically open in your browser.

## Project Structure

```
GridEye/
├── backend/
│   ├── server.py                    # Flask API server
│   └── drone-optimizer/
│       ├── terminal.py              # Route optimization script
│       ├── requirements.txt         # Python dependencies
│       ├── *.npy                    # Pre-calculated data matrices
│       ├── polygon_lon_lat.wkt     # Flight boundary definition
│       └── output/                  # Generated JSON files
│           ├── mission_paths.json
│           ├── asset_points.json
│           ├── photo_points.json
│           └── polygon_boundary.json
│
└── frontend/
    ├── package.json                 # Node dependencies
    ├── .env                         # Environment configuration
    ├── public/
    │   └── index.html
    └── src/
        ├── Visualization.js         # Main application component
        ├── components/              # React components
        ├── services/
        │   └── api.js              # API communication
        └── utils/                   # Helper functions
```

## Features

### Backend
- Google OR-Tools based route optimization
- Multi-mission planning with battery constraints
- Asset and photo waypoint coverage
- JSON API endpoints for mission data

### Frontend
- Interactive Mapbox-based mission visualization
- Real-time mission path animation
- Battery usage monitoring per mission
- Mission filtering and selection controls
- Detailed mission statistics and tables
- Distance distribution charts
- Export functionality

## API Endpoints

The backend server provides the following endpoints:

- `GET /` - API status and available endpoints
- `GET /mission-paths` - Optimized mission routes
- `GET /asset-points` - Asset inspection locations
- `GET /photo-points` - Photo waypoint locations
- `GET /polygon-boundary` - Flight zone boundary
- `GET /mission-data` - Combined data endpoint

## Usage

1. **View Mission Routes**: The map displays all 11 optimized mission paths with color-coded routes
2. **Filter Missions**: Toggle individual missions on/off using the mission buttons
3. **Animate Routes**: Select a mission from the dropdown and click "Animate" to visualize the flight path
4. **View Waypoints**: Enable "Show All Waypoints" to see asset poles and photo points
5. **Monitor Battery**: Check the battery usage section for per-mission battery consumption
6. **Analyze Data**: Review mission details table and distance distribution chart

## Troubleshooting

### Backend Issues

**Virtual environment activation fails**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Package installation fails**
- Ensure Python 3.11+ is installed: `python --version`
- Upgrade pip: `python -m pip install --upgrade pip`

**Missing data files**
- Ensure all `.npy` and `.wkt` files are present in `backend/drone-optimizer/`
- Re-run `python terminal.py` to regenerate output files

### Frontend Issues

**npm start fails**
- Clear node_modules: `Remove-Item -Recurse -Force node_modules`
- Reinstall: `npm install`

**Map not displaying**
- Verify Mapbox token in `.env` file
- Check browser console for errors

**API connection errors**
- Ensure backend server is running on port 5000
- Verify `REACT_APP_API_URL` in `.env` matches backend URL

## Development

### Backend Development
- Modify `terminal.py` for optimization algorithm changes
- Update `server.py` to add new API endpoints
- Data files in `drone-optimizer/output/` are generated by the optimizer

### Frontend Development
- Components are in `src/components/`
- API calls are centralized in `src/services/api.js`
- Map visualization logic is in `src/utils/mapDataGen.js`
- Tailwind CSS is used for styling

## Performance Optimization

- The application caches mission data to minimize API calls
- Map rendering uses WebGL for efficient visualization
- Animations use requestAnimationFrame for smooth playback
- Mission filtering is memoized to prevent unnecessary re-renders

## License

This project is proprietary to NextEra Energy.

## Support

For issues or questions, please contact the development team or refer to the inline code documentation.
