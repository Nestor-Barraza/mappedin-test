import { changeFloor, resetRoute } from './routeManager';
import { getDirectionIcon } from './utils';

export function createSidebar(venue: any) {
  console.log("Creating sidebar");
  const sidebar = document.createElement('div');
  sidebar.id = 'sidebar';
  sidebar.innerHTML = `
    <h2>Route Instructions</h2>
    <div id="route-distance"></div>
    <div id="route-steps"></div>
    <button id="clear-route">Clear Route</button>
    <div id="floor-selector-container">
      <label for="floor-selector">Change Floor:</label>
      <select id="floor-selector"></select>
    </div>
  `;
  document.body.appendChild(sidebar);

  const clearRouteButton = document.getElementById('clear-route');
  if (clearRouteButton) {
    clearRouteButton.addEventListener('click', resetRoute);
  }

  const floorSelector = document.getElementById('floor-selector') as HTMLSelectElement;
  if (floorSelector) {
    venue.maps.forEach((map: any) => {
      const option = document.createElement('option');
      option.value = map.id;
      option.textContent = map.name;
      floorSelector.appendChild(option);
    });
    floorSelector.addEventListener('change', (e) => {
      const selectedMapId = (e.target as HTMLSelectElement).value;
      console.log("Floor changed to:", selectedMapId);
      changeFloor(selectedMapId);
    });
  }
}

export function updateRouteSteps(steps: any[]) {
  console.log("Updating route steps", steps);
  const stepsContainer = document.getElementById('route-steps');
  if (stepsContainer) {
    if (!Array.isArray(steps) || steps.length === 0) {
      stepsContainer.innerHTML = '<p>No route instructions available. Please try selecting a different route.</p>';
      return;
    }

    let totalDistance = 0;
    const stepsHTML = steps.map((step, index) => {
      console.log(`Processing step ${index}:`, step);
      if (typeof step.distance === 'number') {
        totalDistance += step.distance;
      }
      
      const direction = step.direction || 'unknown';
      const instruction = step.instruction || `Step ${index + 1}`;
      const distance = step.distance ? `${step.distance.toFixed(1)} meters` : 'Distance unknown';

      return `
        <li>
          <span class="direction-icon">${getDirectionIcon(direction)}</span>
          <span class="instruction">${instruction}</span>
          <span class="distance">${distance}</span>
        </li>
      `;
    }).join('');

    const estimatedTime = Math.ceil(totalDistance / 80);

    stepsContainer.innerHTML = `
      <h3>Estimated Time: ${estimatedTime} minutes</h3>
      <ul>${stepsHTML}</ul>
    `;
  } else {
    console.error("Route steps container not found");
  }
}

export function updateRouteDistance(distance: number) {
  const distanceContainer = document.getElementById('route-distance');
  if (distanceContainer) {
    const roundedDistance = Math.round(distance);
    distanceContainer.innerHTML = `<p>Total Distance: ${roundedDistance.toFixed(1)} meters</p>`;
  } else {
    console.error("Route distance container not found");
  }
}

export function updateFloorSelector(mapId: string) {
  console.log("Updating floor selector to:", mapId);
  const floorSelector = document.getElementById('floor-selector') as HTMLSelectElement;
  if (floorSelector) {
    floorSelector.value = mapId;
  }
}