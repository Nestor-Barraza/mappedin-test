// @ts-nocheck
export function getDirectionIcon(direction: string): string {
    switch (direction.toLowerCase()) {
      case 'left': return '←';
      case 'right': return '→';
      case 'straight': return '↑';
      default: return '•';
    }
  }
  
  export function roundDistance(distance: number): number {
    return Math.round(distance);
  }
  
  export function calculateEstimatedTime(distance: number): number {
   return Math.ceil(distance / 80);
  }
  
  export function formatDistance(distance: number): string {
    const roundedDistance = roundDistance(distance);
    return `${roundedDistance.toFixed(1)} meters`;
  }
  
  export function sanitizeHTML(str: string): string {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  }
  
  export function debounce(func: Function, wait: number): (...args: any[]) => void {
    let timeout: any;
    return function(...args: any[]) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
  
  export function logError(message: string, error?: any): void {
    console.error(`Error: ${message}`, error);
  }