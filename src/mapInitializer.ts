import { getVenue, showVenue, MapView, E_SDK_EVENT } from "@mappedin/mappedin-js";
import "@mappedin/mappedin-js/lib/mappedin.css";
import { createSidebar } from './sidebarManager';
import { handleLocationClick, resetRoute } from './routeManager';
import { addConnectionIcons } from './connectionManager';

const options = {
  venue: "mappedin-demo-mall",
  clientId: "5eab30aa91b055001a68e996",
  clientSecret: "RJyRXKcryCMy4erZqqCbuB1NbR66QTGNXVE0x3Pg6oCIlUR1"
};

export let mapView: MapView;

export async function initializeMap() {
  console.log("Initializing map...");
  try {
    const venue = await getVenue(options);
    if (!venue) {
      throw new Error("Failed to get venue data");
    }
    console.log("Venue data:", venue);

    const mapContainer = document.createElement('div');
    mapContainer.id = 'map-container';
    document.getElementById('app')!.appendChild(mapContainer);

    mapView = await showVenue(mapContainer, venue);

    mapView.addInteractivePolygonsForAllLocations();
    mapView.FlatLabels.labelAllLocations();

    mapView.on(E_SDK_EVENT.CLICK, ({ polygons }) => {
      console.log("Map clicked, polygons:", polygons);
      if (polygons.length > 0) {
        const location = mapView.getPrimaryLocationForPolygon(polygons[0]);
        if (location) handleLocationClick(location);
      } else {
        resetRoute();
      }
    });

    createSidebar(venue);
    await addConnectionIcons(venue);
    console.log("Map initialization complete");
  } catch (error) {
    console.error("Error initializing map:", error);
  }
}