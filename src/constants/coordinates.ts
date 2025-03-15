export type Coordinate = {
    location: [number, number]
    size: number
}

export const GreenCoordinates: Coordinate[] = [
    { location: [14.5995, 120.9842], size: 0.03 }, // Manila, Philippines (limited urban greenery)
    { location: [19.076, 72.8777], size: 0.05 }, // Mumbai, India (some parks, but not dense)
    { location: [23.8103, 90.4125], size: 0.04 }, // Dhaka, Bangladesh (limited green spaces)
    { location: [30.0444, 31.2357], size: 0.02 }, // Cairo, Egypt (mostly desert, few trees)
    { location: [39.9042, 116.4074], size: 0.06 }, // Beijing, China (some parks and reforestation efforts)
    { location: [-23.5505, -46.6333], size: 0.07 }, // São Paulo, Brazil (near Atlantic Forest remnants)
    { location: [19.4326, -99.1332], size: 0.05 }, // Mexico City, Mexico (urban parks, nearby forests)
    { location: [40.7128, -74.006], size: 0.06 }, // New York, USA (Central Park and nearby forests)
    { location: [34.6937, 135.5022], size: 0.04 }, // Osaka, Japan (urban with some green areas)
    { location: [41.0082, 28.9784], size: 0.05 }, // Istanbul, Turkey (some forests nearby)

    // New markers for regions with high tree density (forests)
    { location: [-3.4653, -62.2159], size: 0.5 }, // Amazon Rainforest, Brazil (extremely dense tree cover)
    { location: [0.228, 15.8277], size: 0.45 }, // Congo Basin, Republic of Congo (second-largest rainforest)
    { location: [64.1333, 101.8833], size: 0.4 }, // Siberian Taiga, Russia (vast coniferous forest)
    { location: [9.082, 8.6753], size: 0.35 }, // West African Forest, Nigeria (tropical forest)
    { location: [-16.2902, 145.461], size: 0.3 }, // Daintree Rainforest, Australia (ancient rainforest)
    { location: [47.5162, -122.636], size: 0.25 }, // Olympic National Forest, USA (temperate rainforest)
    { location: [1.3521, 103.8198], size: 0.2 }, // Bukit Timah Nature Reserve, Singapore (dense urban forest)
    { location: [52.2297, 21.0122], size: 0.15 }, // Białowieża Forest, Poland (primeval forest)
    { location: [43.7696, 11.2558], size: 0.1 }, // Tuscan Forests, Italy (moderate tree density)
    { location: [-41.2865, 174.7762], size: 0.2 }, // Fiordland National Park, New Zealand (dense temperate forest)
]
