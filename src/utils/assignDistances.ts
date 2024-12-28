interface PackageData {
  recipient_zip: number;
  package_lat: number;
  package_long: number;
  package_distance?: number;
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

export function assignDistances(packages: PackageData[]): PackageData[] {
  const pkgs = [...packages];

  pkgs.sort((a, b) => a.recipient_zip - b.recipient_zip);

  const ordered: PackageData[] = [];
  const firstPackage = pkgs.shift();
  if (!firstPackage) return packages;

  firstPackage.package_distance = 1;
  ordered.push(firstPackage);

  let currentPackage = firstPackage;

  while (pkgs.length > 0) {
    let closestIndex = 0;
    let closestDistance = Infinity;

    for (let i = 0; i < pkgs.length; i++) {
      const dist = calculateDistance(
        currentPackage.package_lat,
        currentPackage.package_long,
        pkgs[i].package_lat,
        pkgs[i].package_long
      );
      if (dist < closestDistance) {
        closestDistance = dist;
        closestIndex = i;
      }
    }

    const closestPackage = pkgs.splice(closestIndex, 1)[0];
    closestPackage.package_distance = ordered.length + 1;
    ordered.push(closestPackage);
    currentPackage = closestPackage;
  }

  return ordered;
}
