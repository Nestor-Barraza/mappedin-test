import { MappedinLocation } from "@mappedin/mappedin-js";
import { mapView } from './mapInitializer';
import { updateRouteSteps, updateRouteDistance, updateFloorSelector } from './sidebarManager';
import { addConnectionIcons } from './connectionManager';

let startLocation: MappedinLocation  | null = null;
let endLocation: MappedinLocation | null = null;
let currentRoute: any = null;

export function handleLocationClick(location: MappedinLocation) {
  console.log("Location clicked:", location.name);
  const { name } = location;
  const markerTemplate = `<div class="marker"><p>${name}</p></div>`;

  if (!startLocation) {
    startLocation = location;
    mapView.setPolygonColor(location.polygons[0], "#4285f4");
    mapView.Markers.add(location.polygons[0].entrances[0], markerTemplate);
    console.log(`Start location set: ${startLocation.name}`);
  } else if (!endLocation) {
    endLocation = location;
    mapView.setPolygonColor(location.polygons[0], "#ea4335");
    mapView.Markers.add(location.polygons[0].entrances[0], markerTemplate);
    console.log(`End location set: ${endLocation.name}`);
    drawRoute();
  } else {
    resetRoute();
    startLocation = location;
    mapView.setPolygonColor(location.polygons[0], "#4285f4");
    mapView.Markers.add(location.polygons[0].entrances[0], markerTemplate);
    console.log(`New start location set: ${startLocation.name}`);
  }
}

export function resetRoute() {
  console.log("Resetting route");
  mapView.clearAllPolygonColors();
  mapView.Journey.clear();
  mapView.Markers.removeAll();
  startLocation = null;
  endLocation = null;
  currentRoute = null;
  updateRouteSteps([]);
  addConnectionIcons(mapView.venue);
  updateRouteDistance(0);
}

export function changeFloor(newMapId: string) {
  mapView.setMap(newMapId);
  updateFloorSelector(newMapId);
  if (currentRoute) {
    mapView.Journey.draw(currentRoute, {
      nearestConnection: true,
      connectionTemplates: {
        stairs: `<div class="connection-marker">Stairs</div>`,
        elevator: `<div class="connection-marker">Elevator</div>`,
      },
    });
  }
}

async function drawRoute() {
  if (startLocation && endLocation) {
    console.log("Drawing route from", startLocation.name, "to", endLocation.name);
    try {
      const directions = await startLocation.directionsTo(endLocation, {
        accessible: true,
      });
      console.log("Directions received:", directions);
      
      currentRoute = directions;
      
      mapView.Journey.draw(directions, {
        nearestConnection: true,
        connectionTemplates: {
          stairs: `<div class="connection-marker">Stairs</div>`,
          elevator: `<div class="connection-marker">Elevator</div>`,
        },
      });
      
      console.log("Journey drawn on map");
      await mapView.setMap(directions.path[0].map);
      updateFloorSelector(directions.path[0].map.toString());
      
      if (directions.instructions && Array.isArray(directions.instructions)) {
        console.log("Updating route steps with", directions.instructions.length, "instructions");
        updateRouteSteps(directions.instructions);
        updateRouteDistance(directions.distance);
      } else {
        console.log("No valid instructions received for the route");
        updateRouteSteps([]);
        updateRouteDistance(0);
      }
    } catch (error) {
      console.error("Error drawing route:", error);
      updateRouteSteps([]);
      updateRouteDistance(0);
    }
  } else {
    console.log("Start or end location not set");
    updateRouteSteps([]);
    updateRouteDistance(0);
  }
}