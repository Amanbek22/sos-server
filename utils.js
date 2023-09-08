function calculateDistance(lat1, lng1, lat2, lng2) {
  const earthRadius = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  return distance; // Distance in kilometers
}

module.exports =  function findNearestUser(myLocation, users) {
  let nearestUser = null;
  let nearestDistance = Infinity;

  for (const user of users) {
    const distance = calculateDistance(
      myLocation.lat,
      myLocation.lng,
      user.position._lat,
      user.position._long
    );
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestUser = user;
    }
  }

  return nearestUser;
}
