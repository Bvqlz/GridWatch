# Drone Route Optimizer

This project optimizes drone flight paths for photo waypoints and asset inspection.

## Quick Setup

### Prerequisites
- Python 3.11 or higher
- Git (optional)

### Installation Steps

1. **Extract/Clone the project folder**

2. **Open PowerShell in the project directory**
   ```powershell
   cd path\to\drone-optimizer
   ```

3. **Create a virtual environment**
   ```powershell
   python -m venv .venv
   ```

4. **Activate the virtual environment**
   ```powershell
   .\.venv\Scripts\Activate.ps1
   ```
   
   *Note: If you get an execution policy error, run:*
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

5. **Install dependencies**
   ```powershell
   pip install -r requirements.txt
   ```

6. **Run the program**
   ```powershell
   python terminal.py
   ```

## What the Script Does

- Loads pre-calculated distance matrices and waypoint data
- Optimizes drone flight paths using Google OR-Tools
- Exports results to the `output/` folder:
  - `photo_points.json` - Photo waypoint coordinates
  - `asset_points.json` - Asset location coordinates
  - `polygon_boundary.json` - Flight boundary
  - `mission_paths.json` - Optimized mission routes

## Required Files

The following data files must be in the project directory:
- `distance_matrix.npy`
- `asset_indexes.npy`
- `photo_indexes.npy`
- `points_lat_long.npy`
- `predecessors.npy`
- `waypoint_indexes.npy`
- `polygon_lon_lat.wkt`

## Output

Results are saved in the `output/` directory with:
- Mission paths for 11 drone routes
- Total distance: ~117.51 km
- Total waypoints: ~3,250 points

## Troubleshooting

**Issue: Virtual environment activation fails**
- Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

**Issue: Package installation fails**
- Ensure Python 3.11+ is installed
- Try: `python -m pip install --upgrade pip` first

**Issue: Missing data files**
- Ensure all `.npy` and `.wkt` files are in the project directory
