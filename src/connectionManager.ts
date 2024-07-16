import { Connection } from "@mappedin/mappedin-js";
import { mapView } from './mapInitializer';
import { changeFloor } from './routeManager';

export async function addConnectionIcons(venue: any) {
  console.log("Adding connection icons");
  if (!venue || !venue.maps || !Array.isArray(venue.maps)) {
    console.error("Venue or venue.maps is undefined or not an array");
    return;
  }
  
  let connections: Connection[];
  if (!venue.connections || !Array.isArray(venue.connections)) {
    console.warn("venue.connections is undefined or not an array, attempting to fetch connections");
    connections = await getConnections(venue);
  } else {
    connections = venue.connections;
  }

  if (!connections || connections.length === 0) {
    console.error("No connections available");
    return;
  }

  venue.maps.forEach((map: any) => {
    if (!map || !map.id) {
      console.error("Invalid map object", map);
      return;
    }

    const mapConnections = connections.filter((conn: Connection) => {
      if (!conn || !conn.node1 || !conn.node2) {
        console.error("Invalid connection object", conn);
        return false;
      }
      return conn.node1.map === map.id || conn.node2.map === map.id;
    });

    mapConnections.forEach((conn: Connection) => {
      if (!conn.node1 || !conn.node2) {
        console.error("Connection nodes are undefined", conn);
        return;
      }

      const node = conn.node1.map === map.id ? conn.node1 : conn.node2;
      const isElevator = conn.type === "elevator";
      const iconTemplate = `
        <div class="${isElevator ? 'elevator-icon' : 'stair-icon'}" data-connection-id="${conn.id}">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="${isElevator ? 'M7 2l2 3h-2l2 3h-2l2 3h-2l2 3H7l2 3H7l2 3H7v3h10v-3h-2l2-3h-2l2-3h-2l2-3h-2l2-3h-2l2-3h-2l2-3H7z' : 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2v-4h-2V9h2V5h2v4h2v4h-2v4z'}"/>
          </svg>
        </div>
      `;
      mapView.Markers.add(node, iconTemplate, {
        interactive: true,
        onClick: () => handleConnectionClick(conn)
      });
    });
  });
}

async function getConnections(venue: any): Promise<Connection[]> {
  console.log("Attempting to fetch connections manually");
  let connections: Connection[] = [];

  for (const map of venue.maps) {
    const mapConnections = await map.getConnections();
    connections = connections.concat(mapConnections);
  }

  return connections;
}

function handleConnectionClick(connection: Connection) {
  console.log(`${connection.type} icon clicked, changing floor`);
  const newMapId = connection.node1.map === mapView.currentMap ? connection.node2.map : connection.node1.map;
  changeFloor(newMapId);
}