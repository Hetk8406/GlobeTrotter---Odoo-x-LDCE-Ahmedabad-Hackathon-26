import type { City, Trip, Activity } from '../types';

export const MOCK_CITIES: City[] = [
  // INDIA
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    country: 'India',
    region: 'India',
    popularity: 4,
    costIndex: 1,
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&auto=format&fit=crop&q=80',
    description: 'India\'s first UNESCO World Heritage City, famous for heritage monuments and delicious street food.'
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    country: 'India',
    region: 'India',
    popularity: 5,
    costIndex: 3,
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80',
    description: 'A bustling, diverse metropolis filled with Bollywood, British colonial history, and incredible street food.'
  },
  {
    id: 'delhi',
    name: 'Delhi',
    country: 'India',
    region: 'India',
    popularity: 5,
    costIndex: 2,
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80',
    description: 'The historic capital city of India, containing rich monuments, ancient lanes, and modern avenues.'
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    country: 'India',
    region: 'India',
    popularity: 5,
    costIndex: 2,
    image: 'https://images.unsplash.com/photo-1477584322904-48618db530c2?w=800&auto=format&fit=crop&q=80',
    description: 'The Pink City, gateway to Rajasthan\'s historic palaces, grand forts, and traditional bazaars.'
  },
  {
    id: 'udaipur',
    name: 'Udaipur',
    country: 'India',
    region: 'India',
    popularity: 4,
    costIndex: 3,
    image: 'https://images.unsplash.com/photo-1595238210381-81765c7c2b4d?w=800&auto=format&fit=crop&q=80',
    description: 'The City of Lakes, romantic palace architectures resting beside peaceful waters.'
  },
  {
    id: 'jodhpur',
    name: 'Jodhpur',
    country: 'India',
    region: 'India',
    popularity: 4,
    costIndex: 2,
    image: 'https://images.unsplash.com/photo-1562122606-d0a068a52cb2?w=800&auto=format&fit=crop&q=80',
    description: 'The Blue City, famous for Mehrangarh Fort rising majestically over painted streets.'
  },
  {
    id: 'goa',
    name: 'Goa',
    country: 'India',
    region: 'India',
    popularity: 5,
    costIndex: 2,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    description: 'Pristine beaches, historical Portuguese churches, spice plantations, and fresh seafood.'
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    country: 'India',
    region: 'India',
    popularity: 4,
    costIndex: 3,
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80',
    description: 'Silicon Valley of India, celebrated for its gardens, microbreweries, and mild climate.'
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    country: 'India',
    region: 'India',
    popularity: 4,
    costIndex: 2,
    image: 'https://images.unsplash.com/photo-1608958416738-f9b66236b28d?w=800&auto=format&fit=crop&q=80',
    description: 'The City of Pearls, home of Charminar, tech parks, and world-famous Biryani.'
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    country: 'India',
    region: 'India',
    popularity: 4,
    costIndex: 1,
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800&auto=format&fit=crop&q=80',
    description: 'The cultural capital of India, with colonial grand architecture, sweets, and festivals.'
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    country: 'India',
    region: 'India',
    popularity: 4,
    costIndex: 1,
    image: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=800&auto=format&fit=crop&q=80',
    description: 'One of the oldest continuously inhabited cities on Earth, situated on the sacred Ganges River.'
  },
  {
    id: 'agra',
    name: 'Agra',
    country: 'India',
    region: 'India',
    popularity: 5,
    costIndex: 2,
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
    description: 'Home to the eternal monument of love, the Taj Mahal, and massive Mughal architectures.'
  },
  {
    id: 'manali',
    name: 'Manali',
    country: 'India',
    region: 'India',
    popularity: 4,
    costIndex: 2,
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&auto=format&fit=crop&q=80',
    description: 'High-altitude Himalayan resort town, popular for adventure sports, snow days, and valleys.'
  },
  {
    id: 'srinagar',
    name: 'Srinagar',
    country: 'India',
    region: 'India',
    popularity: 4,
    costIndex: 2,
    image: 'https://images.unsplash.com/photo-1598305372100-877abf3c051a?w=800&auto=format&fit=crop&q=80',
    description: 'The summer capital of Kashmir, famous for Dal Lake houseboats, shikaras, and mughal gardens.'
  },
  {
    id: 'kerala',
    name: 'Kerala',
    country: 'India',
    region: 'India',
    popularity: 5,
    costIndex: 2,
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&auto=format&fit=crop&q=80',
    description: 'God\'s Own Country, famed for serene palm-lined backwaters, houseboats, and ayurvedic spas.'
  },

  // ASIA
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    popularity: 5,
    costIndex: 4,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop&q=80',
    description: 'A neon-lit mix of ultramodern skyscrapers and historic wooden shrines.'
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    country: 'Japan',
    region: 'Asia',
    popularity: 5,
    costIndex: 3,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80',
    description: 'The cultural capital of Japan, renowned for historic temples, shrines, and traditional geisha.'
  },
  {
    id: 'osaka',
    name: 'Osaka',
    country: 'Japan',
    region: 'Asia',
    popularity: 4,
    costIndex: 3,
    image: 'https://images.unsplash.com/photo-1590253508491-a1e4dd2ad18f?w=800&auto=format&fit=crop&q=80',
    description: 'Known for its modern architecture, street food culture, and glowing neon districts.'
  },
  {
    id: 'seoul',
    name: 'Seoul',
    country: 'South Korea',
    region: 'Asia',
    popularity: 5,
    costIndex: 3,
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80',
    description: 'Tech giants, dynamic culture, palaces, temples, and delicious street food markets.'
  },
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    region: 'Asia',
    popularity: 5,
    costIndex: 4,
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&auto=format&fit=crop&q=80',
    description: 'A global garden city, known for cleanliness, futuristic architecture, and diverse dining.'
  },
  {
    id: 'bangkok',
    name: 'Bangkok',
    country: 'Thailand',
    region: 'Asia',
    popularity: 5,
    costIndex: 2,
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&auto=format&fit=crop&q=80',
    description: 'Ornate shrines, street life, grand temples, and floating markets.'
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    region: 'Asia',
    popularity: 5,
    costIndex: 2,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80',
    description: 'A tropical paradise famous for its volcanic mountains, beaches, and coral reefs.'
  },
  {
    id: 'jakarta',
    name: 'Jakarta',
    country: 'Indonesia',
    region: 'Asia',
    popularity: 3,
    costIndex: 2,
    image: 'https://images.unsplash.com/photo-1555620150-e8867cf9eb7b?w=800&auto=format&fit=crop&q=80',
    description: 'A massive metropolis hosting historic colonial architectures and ultra-fast growth.'
  },
  {
    id: 'kuala-lumpur',
    name: 'Kuala Lumpur',
    country: 'Malaysia',
    region: 'Asia',
    popularity: 4,
    costIndex: 2,
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc1f7f43?w=800&auto=format&fit=crop&q=80',
    description: 'Iconic Petronas Twin Towers, grand malls, historic colonial offices, and green spaces.'
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Asia',
    popularity: 5,
    costIndex: 5,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop&q=80',
    description: 'High luxury shopping, futuristic architectures, massive towers, and gold bazaars.'
  },

  // EUROPE
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    popularity: 5,
    costIndex: 4,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80',
    description: 'The City of Light, a global center for arts, fashion, landmarks, and romance.'
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    popularity: 5,
    costIndex: 4,
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80',
    description: 'Capital of the UK, steeped in history, castles, royal monuments, and world-class museums.'
  },
  {
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    region: 'Europe',
    popularity: 5,
    costIndex: 3,
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop&q=80',
    description: 'The Eternal City, showcasing 3,000 years of globally influential ancient ruins.'
  },
  {
    id: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    region: 'Europe',
    popularity: 5,
    costIndex: 3,
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efedd?w=800&auto=format&fit=crop&q=80',
    description: 'Renowned for its Catalan modernism architecture, Gaudi works, and sunny beaches.'
  },
  {
    id: 'amsterdam',
    name: 'Amsterdam',
    country: 'Netherlands',
    region: 'Europe',
    popularity: 4,
    costIndex: 4,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    description: 'Famous canal rings, artistic heritages, historic row houses, and tulip gardens.'
  },
  {
    id: 'prague',
    name: 'Prague',
    country: 'Czech Republic',
    region: 'Europe',
    popularity: 4,
    costIndex: 2,
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&auto=format&fit=crop&q=80',
    description: 'The City of a Hundred Spires, historic bridges, old squares, and Gothic castles.'
  },
  {
    id: 'vienna',
    name: 'Vienna',
    country: 'Austria',
    region: 'Europe',
    popularity: 4,
    costIndex: 4,
    image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&auto=format&fit=crop&q=80',
    description: 'Imperial history, grand palace complexes, and classical music traditions.'
  },
  {
    id: 'berlin',
    name: 'Berlin',
    country: 'Germany',
    region: 'Europe',
    popularity: 4,
    costIndex: 3,
    image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=800&auto=format&fit=crop&q=80',
    description: 'A city rich with political history, street art galleries, and modern culture.'
  },
  {
    id: 'venice',
    name: 'Venice',
    country: 'Italy',
    region: 'Europe',
    popularity: 5,
    costIndex: 4,
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&auto=format&fit=crop&q=80',
    description: 'Built on over 100 small islands, famous for canals, gondolas, and Gothic palaces.'
  },
  {
    id: 'florence',
    name: 'Florence',
    country: 'Italy',
    region: 'Europe',
    popularity: 5,
    costIndex: 3,
    image: 'https://images.unsplash.com/photo-1528114039593-4366cc08227d?w=800&auto=format&fit=crop&q=80',
    description: 'The birthplace of the Renaissance, containing masterpiece architectures and world-renowned art.'
  },

  // NORTH AMERICA
  {
    id: 'new-york',
    name: 'New York',
    country: 'United States',
    region: 'Americas',
    popularity: 5,
    costIndex: 5,
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop&q=80',
    description: 'The Big Apple, featuring iconic towers, Broadway, and high-energy streets.'
  },
  {
    id: 'los-angeles',
    name: 'Los Angeles',
    country: 'United States',
    region: 'Americas',
    popularity: 5,
    costIndex: 4,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
    description: 'Home of the movie industry, sunny beaches, and palms.'
  },
  {
    id: 'san-francisco',
    name: 'San Francisco',
    country: 'United States',
    region: 'Americas',
    popularity: 4,
    costIndex: 4,
    image: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?w=800&auto=format&fit=crop&q=80',
    description: 'Golden Gate Bridge, historical cable cars, and rolling hills.'
  },
  {
    id: 'las-vegas',
    name: 'Las Vegas',
    country: 'United States',
    region: 'Americas',
    popularity: 4,
    costIndex: 4,
    image: 'https://images.unsplash.com/photo-1522083165195-342750297f05?w=800&auto=format&fit=crop&q=80',
    description: 'The entertainment capital of the world, bright lights, and showmanship.'
  },
  {
    id: 'miami',
    name: 'Miami',
    country: 'United States',
    region: 'Americas',
    popularity: 4,
    costIndex: 4,
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
    description: 'Art Deco history, tropical climate, white beaches, and night entertainment.'
  },

  // SOUTH AMERICA
  {
    id: 'rio-de-janeiro',
    name: 'Rio de Janeiro',
    country: 'Brazil',
    region: 'Americas',
    popularity: 4,
    costIndex: 2,
    image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&auto=format&fit=crop&q=80',
    description: 'Famed for Copacabana beaches, Carnival festival, and mountaintop statue.'
  },
  {
    id: 'buenos-aires',
    name: 'Buenos Aires',
    country: 'Argentina',
    region: 'Americas',
    popularity: 4,
    costIndex: 2,
    image: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800&auto=format&fit=crop&q=80',
    description: 'European architectural influences, tango shows, and rich steak gastronomy.'
  },
  {
    id: 'lima',
    name: 'Lima',
    country: 'Peru',
    region: 'Americas',
    popularity: 3,
    costIndex: 2,
    image: 'https://images.unsplash.com/photo-1531968455001-5c5272a4112e?w=800&auto=format&fit=crop&q=80',
    description: 'Colonial core squares, prehistoric museums, and highly famous culinary arts.'
  },

  // AFRICA
  {
    id: 'cape-town',
    name: 'Cape Town',
    country: 'South Africa',
    region: 'Africa',
    popularity: 5,
    costIndex: 2,
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&auto=format&fit=crop&q=80',
    description: 'A harbor city backdropped by majestically rising Table Mountain and pristine oceans.'
  },
  {
    id: 'marrakech',
    name: 'Marrakech',
    country: 'Morocco',
    region: 'Africa',
    popularity: 4,
    costIndex: 2,
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&auto=format&fit=crop&q=80',
    description: 'A historic walled city enclosing vibrant souks, traditional palaces, and mosques.'
  },
  {
    id: 'cairo',
    name: 'Cairo',
    country: 'Egypt',
    region: 'Africa',
    popularity: 4,
    costIndex: 1,
    image: 'https://images.unsplash.com/photo-1572252009286-268acec5a0af?w=800&auto=format&fit=crop&q=80',
    description: 'Resting on the Nile River, hosting monumental Pyramids of Giza and Sphinx.'
  },

  // OCEANIA
  {
    id: 'sydney',
    name: 'Sydney',
    country: 'Australia',
    region: 'Oceania',
    popularity: 5,
    costIndex: 4,
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&auto=format&fit=crop&q=80',
    description: 'Home of the Opera House, Harbour Bridge, and sunny surf beaches.'
  },
  {
    id: 'melbourne',
    name: 'Melbourne',
    country: 'Australia',
    region: 'Oceania',
    popularity: 4,
    costIndex: 4,
    image: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=800&auto=format&fit=crop&q=80',
    description: 'The cultural capital, famous for coffee shops, art lanes, and gardens.'
  },
  {
    id: 'queenstown',
    name: 'Queenstown',
    country: 'New Zealand',
    region: 'Oceania',
    popularity: 5,
    costIndex: 3,
    image: 'https://images.unsplash.com/photo-1589871190907-536014182a52?w=800&auto=format&fit=crop&q=80',
    description: 'Adventure capital, hosting bungy jumping, jet boating, and snowy peaks.'
  }
];

export const MOCK_ACTIVITIES: Record<string, Omit<Activity, 'id' | 'time'>[]> = {
  // INDIA
  ahmedabad: [
    { name: 'Sabarmati Ashram Visit', category: 'Culture', description: 'Explore the peaceful residence of Mahatma Gandhi.', duration: 90, estimatedCost: 100, image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&auto=format&fit=crop&q=80' },
    { name: 'Adalaj Stepwell Walk', category: 'Sightseeing', description: 'Inspect the beautifully carved historic underground stepwell.', duration: 90, estimatedCost: 150, image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&auto=format&fit=crop&q=80' },
    { name: 'Manek Chowk Food Tour', category: 'Food', description: 'Gorge on delicious local street snacks and sandwhiches.', duration: 120, estimatedCost: 400, image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&auto=format&fit=crop&q=80' }
  ],
  mumbai: [
    { name: 'Gateway of India Walk', category: 'Sightseeing', description: 'Iconic monumental arch overlooking the Arabian Sea.', duration: 60, estimatedCost: 0, image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop&q=80' },
    { name: 'Elephanta Caves Boat Tour', category: 'Culture', description: 'Ferry ride and exploration of ancient rock-cut cave temples.', duration: 240, estimatedCost: 800, image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop&q=80' },
    { name: 'Marine Drive Sunset', category: 'Relaxation', description: 'Stroll along the Queen\'s Necklace bay path.', duration: 90, estimatedCost: 100, image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop&q=80' }
  ],
  delhi: [
    { name: 'Red Fort Exploration', category: 'Culture', description: 'Tour the massive 17th-century Mughal palace complex.', duration: 150, estimatedCost: 500, image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format&fit=crop&q=80' },
    { name: 'Qutub Minar Walk', category: 'Sightseeing', description: 'Inspect the tallest brick minaret tower in the world.', duration: 90, estimatedCost: 400, image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format&fit=crop&q=80' },
    { name: 'Chandni Chowk Rickshaw Ride', category: 'Food', description: 'Experience Delhi street foods in crowded old bazaar lanes.', duration: 120, estimatedCost: 600, image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format&fit=crop&q=80' }
  ],
  jaipur: [
    { name: 'Amber Fort Guided Tour', category: 'Culture', description: 'Explore the grand hilltop fortress and its artistic halls.', duration: 180, estimatedCost: 500, image: 'https://images.unsplash.com/photo-1477584322904-48618db530c2?w=600&auto=format&fit=crop&q=80' },
    { name: 'Hawa Mahal Palace Visit', category: 'Sightseeing', description: 'View the iconic pink honeycomb window facade.', duration: 60, estimatedCost: 200, image: 'https://images.unsplash.com/photo-1477584322904-48618db530c2?w=600&auto=format&fit=crop&q=80' }
  ],
  udaipur: [
    { name: 'Lake Pichola Boat Ride', category: 'Relaxation', description: 'Romantic boat cruise passing Lake Palace architectures.', duration: 90, estimatedCost: 600, image: 'https://images.unsplash.com/photo-1595238210381-81765c7c2b4d?w=600&auto=format&fit=crop&q=80' },
    { name: 'City Palace Walk', category: 'Culture', description: 'Walk through the massive historic royal complex.', duration: 120, estimatedCost: 400, image: 'https://images.unsplash.com/photo-1595238210381-81765c7c2b4d?w=600&auto=format&fit=crop&q=80' }
  ],
  jodhpur: [
    { name: 'Mehrangarh Fort Visit', category: 'Culture', description: 'One of India\'s largest forts, offering panoramic city views.', duration: 120, estimatedCost: 300, image: 'https://images.unsplash.com/photo-1562122606-d0a068a52cb2?w=600&auto=format&fit=crop&q=80' }
  ],
  goa: [
    { name: 'Basilica of Bom Jesus', category: 'Culture', description: 'Baroque church holding saintly relics.', duration: 90, estimatedCost: 0, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80' },
    { name: 'Baga Beach Watersports', category: 'Adventure', description: 'Parasailing and jet skiing on Goan waters.', duration: 120, estimatedCost: 1500, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80' }
  ],
  bengaluru: [
    { name: 'Lalbagh Botanical Gardens Walk', category: 'Relaxation', description: 'Historical 240-acre garden with glass house.', duration: 120, estimatedCost: 100, image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&auto=format&fit=crop&q=80' }
  ],
  hyderabad: [
    { name: 'Charminar Exploration', category: 'Sightseeing', description: 'Four-minaret historic monument and grand mosque.', duration: 60, estimatedCost: 200, image: 'https://images.unsplash.com/photo-1608958416738-f9b66236b28d?w=600&auto=format&fit=crop&q=80' },
    { name: 'Biryani Tasting Tour', category: 'Food', description: 'Try legendary Hyderabadi spice rice cooking.', duration: 90, estimatedCost: 500, image: 'https://images.unsplash.com/photo-1608958416738-f9b66236b28d?w=600&auto=format&fit=crop&q=80' }
  ],
  kolkata: [
    { name: 'Victoria Memorial Museum', category: 'Culture', description: 'White marble palace hosting historical galleries.', duration: 120, estimatedCost: 300, image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=600&auto=format&fit=crop&q=80' }
  ],
  varanasi: [
    { name: 'Ganga Aarti Boat Cruise', category: 'Culture', description: 'Observe traditional oil lamp rituals from waters.', duration: 120, estimatedCost: 800, image: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=600&auto=format&fit=crop&q=80' }
  ],
  agra: [
    { name: 'Taj Mahal Sunrise Visit', category: 'Culture', description: 'View the masterpiece marble mausoleum in soft light.', duration: 180, estimatedCost: 1100, image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&auto=format&fit=crop&q=80' },
    { name: 'Agra Fort Exploration', category: 'Sightseeing', description: 'Tour the massive walled imperial Mughal fortress.', duration: 120, estimatedCost: 600, image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&auto=format&fit=crop&q=80' }
  ],
  manali: [
    { name: 'Solang Valley Paragliding', category: 'Adventure', description: 'Gliding high over Himalayan green valleys.', duration: 120, estimatedCost: 3000, image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&auto=format&fit=crop&q=80' }
  ],
  srinagar: [
    { name: 'Dal Lake Shikara Ride', category: 'Relaxation', description: 'Traditional Kashmiri wooden boat ride past gardens.', duration: 120, estimatedCost: 1000, image: 'https://images.unsplash.com/photo-1598305372100-877abf3c051a?w=600&auto=format&fit=crop&q=80' }
  ],
  kerala: [
    { name: 'Alleppey Backwaters Cruise', category: 'Relaxation', description: 'Day trip on traditional thatched roof houseboats.', duration: 300, estimatedCost: 4000, image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600&auto=format&fit=crop&q=80' }
  ],

  // ASIA
  tokyo: [
    { name: 'teamLab Borderless Tickets', category: 'Culture', description: 'Immersive borderless three-dimensional digital galleries.', duration: 180, estimatedCost: 2500, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&auto=format&fit=crop&q=80' },
    { name: 'Senso-ji Temple Walk', category: 'Culture', description: 'Visit Tokyo\'s oldest historic Buddhist temple.', duration: 90, estimatedCost: 0, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&auto=format&fit=crop&q=80' },
    { name: 'Shibuya Crossing Walk', category: 'Sightseeing', description: 'Traverse the world\'s busiest pedestrian intersection.', duration: 60, estimatedCost: 100, image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80' },
    { name: 'Tsukiji Market Tasting Tour', category: 'Food', description: 'Enjoy fresh sushi and local seafood snacks.', duration: 120, estimatedCost: 3500, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80' }
  ],
  kyoto: [
    { name: 'Fushimi Inari Torii Path', category: 'Sightseeing', description: 'Hike through thousands of vibrant orange torii gates.', duration: 120, estimatedCost: 0, image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop&q=80' },
    { name: 'Kinkaku-ji Golden Pavilion', category: 'Culture', description: 'Zen temple covered entirely in gold leaf.', duration: 90, estimatedCost: 400, image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop&q=80' }
  ],
  osaka: [
    { name: 'Osaka Castle Tour', category: 'Culture', description: 'Historic museum interior rising over scenic moats.', duration: 125, estimatedCost: 500, image: 'https://images.unsplash.com/photo-1590253508491-a1e4dd2ad18f?w=600&auto=format&fit=crop&q=80' }
  ],
  seoul: [
    { name: 'Gyeongbokgung Palace Walk', category: 'Culture', description: 'The main royal palace of Joseon Dynasty with gate guard show.', duration: 120, estimatedCost: 250, image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80' }
  ],
  singapore: [
    { name: 'Gardens by the Bay Supertrees', category: 'Sightseeing', description: 'Futuristic vertical gardens and massive conservatories.', duration: 150, estimatedCost: 2000, image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&auto=format&fit=crop&q=80' }
  ],
  bangkok: [
    { name: 'Grand Palace Tour', category: 'Culture', description: 'Spectacular gold-spired complex of royal temples.', duration: 120, estimatedCost: 1200, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&auto=format&fit=crop&q=80' }
  ],
  bali: [
    { name: 'Uluwatu Sunset Temple Tour', category: 'Culture', description: 'Cliff-edge temple hosting traditional Kecak dance.', duration: 150, estimatedCost: 800, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=80' }
  ],
  jakarta: [
    { name: 'National Monument Monas', category: 'Sightseeing', description: 'Iconic tower symbolizing Indonesian independence.', duration: 90, estimatedCost: 150, image: 'https://images.unsplash.com/photo-1555620150-e8867cf9eb7b?w=600&auto=format&fit=crop&q=80' }
  ],
  'kuala-lumpur': [
    { name: 'Batu Caves Stairs Tour', category: 'Culture', description: 'Massive rainbow-colored staircases leading to limestone caves.', duration: 120, estimatedCost: 200, image: 'https://images.unsplash.com/photo-1596422846543-75c6fc1f7f43?w=600&auto=format&fit=crop&q=80' }
  ],
  dubai: [
    { name: 'Burj Khalifa Observation Deck', category: 'Sightseeing', description: 'Ascend to 148th floor for desert skyline views.', duration: 120, estimatedCost: 5000, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&auto=format&fit=crop&q=80' }
  ],

  // EUROPE
  paris: [
    { name: 'Eiffel Tower Access', category: 'Sightseeing', description: 'Ascend the top floors of the landmark steel tower.', duration: 120, estimatedCost: 3000, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80' },
    { name: 'Louvre Art Guided Tour', category: 'Culture', description: 'Skip queues and explore Renaissance master paintings.', duration: 180, estimatedCost: 2500, image: 'https://images.unsplash.com/photo-1601887389937-0b02c26b6c3c?w=600&auto=format&fit=crop&q=80' }
  ],
  london: [
    { name: 'Tower of London Tour', category: 'Culture', description: 'Historic castle housing crown jewels.', duration: 150, estimatedCost: 3500, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&auto=format&fit=crop&q=80' },
    { name: 'London Eye Flight', category: 'Sightseeing', description: '30-minute panoramic views over Parliament houses.', duration: 45, estimatedCost: 3200, image: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=600&auto=format&fit=crop&q=80' }
  ],
  rome: [
    { name: 'Colosseum & Forum Skip-Line', category: 'Culture', description: 'Walk the historic arena floor of ancient gladiators.', duration: 180, estimatedCost: 3000, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=80' },
    { name: 'Trevi Fountain Walk', category: 'Sightseeing', description: 'Toss a coin into the spectacular baroque fountain.', duration: 45, estimatedCost: 0, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=80' }
  ],
  barcelona: [
    { name: 'Sagrada Familia Cathedral', category: 'Culture', description: 'Observe Gaudi\'s soaring organic tree-like cathedral columns.', duration: 120, estimatedCost: 2800, image: 'https://images.unsplash.com/photo-1583422409516-2895a77efedd?w=600&auto=format&fit=crop&q=80' }
  ],
  amsterdam: [
    { name: 'Canal Ring Cruise', category: 'Relaxation', description: 'Scenic historic canal boat ride past narrow house fronts.', duration: 75, estimatedCost: 1800, image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80' }
  ],
  prague: [
    { name: 'Charles Bridge Stroll', category: 'Sightseeing', description: 'Walk past Baroque statues connecting historic squares.', duration: 60, estimatedCost: 0, image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&auto=format&fit=crop&q=80' }
  ],
  vienna: [
    { name: 'Schonbrunn Palace Tour', category: 'Culture', description: 'Explore royal apartments and grand formal gardens.', duration: 150, estimatedCost: 2200, image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=600&auto=format&fit=crop&q=80' }
  ],
  berlin: [
    { name: 'Brandenburg Gate Photo Walk', category: 'Sightseeing', description: 'Iconic neoclassical city gateway monument.', duration: 45, estimatedCost: 0, image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=600&auto=format&fit=crop&q=80' }
  ],
  venice: [
    { name: 'Grand Canal Gondola Ride', category: 'Relaxation', description: 'Classic Venice small-canal wooden boat cruise.', duration: 40, estimatedCost: 4000, image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=600&auto=format&fit=crop&q=80' }
  ],
  florence: [
    { name: 'Uffizi Gallery Art Tour', category: 'Culture', description: 'View master Renaissance paintings by Botticelli and Da Vinci.', duration: 180, estimatedCost: 2400, image: 'https://images.unsplash.com/photo-1528114039593-4366cc08227d?w=600&auto=format&fit=crop&q=80' }
  ],

  // NORTH AMERICA
  'new-york': [
    { name: 'Statue of Liberty Ferry Tour', category: 'Culture', description: 'Boat trip to Liberty Island museum and pedestal gates.', duration: 180, estimatedCost: 2500, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&auto=format&fit=crop&q=80' },
    { name: 'Summit One Vanderbilt Access', category: 'Sightseeing', description: 'Glass elevators and reflective mirror galleries rising high.', duration: 120, estimatedCost: 4200, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&auto=format&fit=crop&q=80' }
  ],
  'los-angeles': [
    { name: 'Universal Studios Hollywood', category: 'Adventure', description: 'Action movie themes, rides, and studio set tour.', duration: 360, estimatedCost: 9500, image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80' }
  ],
  'san-francisco': [
    { name: 'Alcatraz Prison Ferry Tour', category: 'Culture', description: 'Audio tour of the legendary historic federal penitentiary.', duration: 180, estimatedCost: 4000, image: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?w=600&auto=format&fit=crop&q=80' }
  ],
  'las-vegas': [
    { name: 'Grand Canyon Helicopter Tour', category: 'Adventure', description: 'Fly deep into canyon ravines from Las Vegas strip.', duration: 240, estimatedCost: 15000, image: 'https://images.unsplash.com/photo-1522083165195-342750297f05?w=600&auto=format&fit=crop&q=80' }
  ],
  miami: [
    { name: 'South Beach Parasailing', category: 'Adventure', description: 'Fly high above tropical blue beaches.', duration: 60, estimatedCost: 5500, image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80' }
  ],

  // SOUTH AMERICA
  'rio-de-janeiro': [
    { name: 'Christ the Redeemer Statue', category: 'Sightseeing', description: 'Cog train ascending Corcovado Mountain to the giant statue.', duration: 120, estimatedCost: 1200, image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=600&auto=format&fit=crop&q=80' }
  ],
  'buenos-aires': [
    { name: 'San Telmo Tango Show', category: 'Culture', description: 'Observe legendary traditional Argentine dances with dinner.', duration: 150, estimatedCost: 4500, image: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=600&auto=format&fit=crop&q=80' }
  ],
  lima: [
    { name: 'Historic Centre Walking Tour', category: 'Culture', description: 'Inspect baroque wooden balcony fronts and palaces.', duration: 120, estimatedCost: 0, image: 'https://images.unsplash.com/photo-1531968455001-5c5272a4112e?w=600&auto=format&fit=crop&q=80' }
  ],

  // AFRICA
  'cape-town': [
    { name: 'Table Mountain Cableway', category: 'Adventure', description: 'Rotating cable car ascending Table Mountain top flat plate.', duration: 120, estimatedCost: 2200, image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&auto=format&fit=crop&q=80' }
  ],
  marrakech: [
    { name: 'Majorelle Botanic Garden', category: 'Relaxation', description: 'Stunning bright blue villa structures inside desert cacti gardens.', duration: 90, estimatedCost: 1200, image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600&auto=format&fit=crop&q=80' }
  ],
  cairo: [
    { name: 'Giza Pyramids Guided Walk', category: 'Culture', description: 'Behold the singular ancient wonders of Giza and Sphinx.', duration: 180, estimatedCost: 1500, image: 'https://images.unsplash.com/photo-1572252009286-268acec5a0af?w=600&auto=format&fit=crop&q=80' }
  ],

  // OCEANIA
  sydney: [
    { name: 'Sydney Opera House Tour', category: 'Culture', description: 'Walk underneath historic sail-like roofs of the art halls.', duration: 90, estimatedCost: 2500, image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&auto=format&fit=crop&q=80' }
  ],
  melbourne: [
    { name: 'Yarra Valley Wine Tasting', category: 'Food', description: 'Full day culinary estate visits and vineyards tour.', duration: 480, estimatedCost: 7500, image: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=600&auto=format&fit=crop&q=80' }
  ],
  queenstown: [
    { name: 'Shotover Jet Boat Ride', category: 'Adventure', description: 'High speed canyon rafting maneuvers on mountain waters.', duration: 60, estimatedCost: 6500, image: 'https://images.unsplash.com/photo-1589871190907-536014182a52?w=600&auto=format&fit=crop&q=80' }
  ]
};

export const MOCK_TRIPS: Trip[] = [
  {
    id: 'trip-1',
    name: 'India Heritage Exploration',
    description: 'A grand architectural trip covering Delhi, Agra, and Jaipur.',
    coverImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
    startDate: '2026-11-10',
    endDate: '2026-11-18',
    totalBudget: 85000,
    destinations: ['Delhi', 'Agra', 'Jaipur'],
    status: 'planning',
    stops: [
      {
        id: 'stop-1-1',
        cityId: 'delhi',
        cityName: 'Delhi',
        arrivalDate: '2026-11-10',
        departureDate: '2026-11-12',
        order: 1,
        activities: [
          {
            id: 'act-101',
            name: 'Red Fort Walk',
            category: 'Culture',
            description: 'Tour the massive 17th-century Mughal palace complex.',
            duration: 150,
            estimatedCost: 500,
            image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format&fit=crop&q=80',
            time: '09:00'
          }
        ]
      },
      {
        id: 'stop-1-2',
        cityId: 'agra',
        cityName: 'Agra',
        arrivalDate: '2026-11-13',
        departureDate: '2026-11-15',
        order: 2,
        activities: [
          {
            id: 'act-102',
            name: 'Taj Mahal Sunrise Visit',
            category: 'Culture',
            description: 'View the masterpiece marble mausoleum in soft light.',
            duration: 180,
            estimatedCost: 1100,
            image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&auto=format&fit=crop&q=80',
            time: '06:00'
          }
        ]
      }
    ],
    expenses: [
      {
        id: 'exp-101',
        category: 'Transport',
        amount: 8500,
        date: '2026-11-10',
        description: 'Train & Cab Transfers'
      },
      {
        id: 'exp-102',
        category: 'Accommodation',
        amount: 15000,
        date: '2026-11-10',
        description: 'Hotel Rooms Stay'
      }
    ]
  },
  {
    id: 'trip-2',
    name: 'Neon Tokyo & Kyoto Trails',
    description: 'Immersive exploration of Japan\'s historic landmarks and modern digital marvels.',
    coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop&q=80',
    startDate: '2026-10-15',
    endDate: '2026-10-23',
    totalBudget: 150000,
    destinations: ['Tokyo', 'Kyoto'],
    status: 'planning',
    stops: [
      {
        id: 'stop-2-1',
        cityId: 'tokyo',
        cityName: 'Tokyo',
        arrivalDate: '2026-10-15',
        departureDate: '2026-10-19',
        order: 1,
        activities: [
          {
            id: 'act-5',
            name: 'Tsukiji Market Tasting Tour',
            category: 'Food',
            description: 'Enjoy fresh sushi and local seafood snacks.',
            duration: 120,
            estimatedCost: 3500,
            image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80',
            time: '12:00'
          },
          {
            id: 'act-6',
            name: 'teamLab Borderless Tickets',
            category: 'Culture',
            description: 'Immersive borderless three-dimensional digital galleries.',
            duration: 180,
            estimatedCost: 2500,
            image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&auto=format&fit=crop&q=80',
            time: '15:30'
          }
        ]
      }
    ],
    expenses: [
      {
        id: 'exp-201',
        category: 'Transport',
        amount: 45000,
        date: '2026-10-15',
        description: 'Flights to Tokyo'
      },
      {
        id: 'exp-202',
        category: 'Accommodation',
        amount: 35000,
        date: '2026-10-15',
        description: 'Shinjuku Hotel Stay'
      }
    ]
  }
];
