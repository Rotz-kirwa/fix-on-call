import math

def calculate_distance(lat1, lon1, lat2, lon2):
    """
    Calculate distance between two coordinates using Haversine formula
    Returns distance in kilometers
    """
    R = 6371  # Earth's radius in kilometers
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)
    
    a = math.sin(delta_lat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    return R * c

def find_nearby_locations(user_location, locations, radius_km=10):
    """
    Find locations within radius of user location
    user_location: {'latitude': float, 'longitude': float}
    locations: list of dicts with 'location' key containing lat/lon
    """
    nearby = []
    
    for loc in locations:
        if 'location' in loc and 'latitude' in loc['location'] and 'longitude' in loc['location']:
            distance = calculate_distance(
                user_location['latitude'],
                user_location['longitude'],
                loc['location']['latitude'],
                loc['location']['longitude']
            )
            
            if distance <= radius_km:
                loc['distance_km'] = round(distance, 2)
                nearby.append(loc)
    
    # Sort by distance
    nearby.sort(key=lambda x: x['distance_km'])
    return nearby

def get_estimated_time(distance_km, avg_speed_kmh=40):
    """
    Estimate travel time based on distance
    Returns time in minutes
    """
    if distance_km <= 0:
        return 0
    
    hours = distance_km / avg_speed_kmh
    minutes = hours * 60
    return round(minutes)
