import type { City, Trip, Activity } from '../types';

export const MOCK_CITIES: City[] = [
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    popularity: 5,
    costIndex: 4,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80',
    description: 'The City of Light is a global center for art, fashion, gastronomy, and culture.'
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    popularity: 5,
    costIndex: 4,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop&q=80',
    description: 'A neon-lit mix of ultramodern skyscrapers and historic temples.'
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    popularity: 4,
    costIndex: 5,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop&q=80',
    description: 'Known for luxury shopping, ultramodern architecture, and a lively nightlife scene.'
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    popularity: 5,
    costIndex: 4,
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80',
    description: 'The capital of the UK, rich in history, royal heritage, and world-class museums.'
  },
  {
    id: 'new-york',
    name: 'New York',
    country: 'United States',
    region: 'North America',
    popularity: 5,
    costIndex: 5,
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop&q=80',
    description: 'The Big Apple, featuring iconic landmarks, Broadway shows, and endless energy.'
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    country: 'India',
    region: 'Asia',
    popularity: 4,
    costIndex: 2,
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80',
    description: 'A bustling, diverse metropolis filled with Bollywood, history, and incredible street food.'
  },
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    region: 'Asia',
    popularity: 5,
    costIndex: 4,
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&auto=format&fit=crop&q=80',
    description: 'A global financial hub known for its clean streets, futuristic gardens, and diverse culture.'
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    region: 'Asia',
    popularity: 5,
    costIndex: 2,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80',
    description: 'A tropical paradise famous for its forested volcanic mountains, beaches, and coral reefs.'
  },
  {
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    region: 'Europe',
    popularity: 5,
    costIndex: 3,
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop&q=80',
    description: 'The Eternal City, showcasing 3,000 years of globally influential art, architecture, and culture.'
  },
  {
    id: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    region: 'Europe',
    popularity: 4,
    costIndex: 3,
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efedd?w=800&auto=format&fit=crop&q=80',
    description: 'Renowned for its art and architecture, Gaudi landmarks, and beautiful city beaches.'
  }
];

export const MOCK_ACTIVITIES: Record<string, Omit<Activity, 'id' | 'time'>[]> = {
  paris: [
    {
      name: 'Eiffel Tower Summit Access',
      category: 'Sightseeing',
      description: 'Ascend to the top floor of the iconic Eiffel Tower for panoramic views of Paris.',
      duration: 120,
      estimatedCost: 35,
      image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=600&auto=format&fit=crop&q=80'
    },
    {
      name: 'Louvre Museum Guided Tour',
      category: 'Culture',
      description: 'Skip-the-line entry and guided tour of the world\'s largest art museum, including the Mona Lisa.',
      duration: 180,
      estimatedCost: 65,
      image: 'https://images.unsplash.com/photo-1601887389937-0b02c26b6c3c?w=600&auto=format&fit=crop&q=80'
    },
    {
      name: 'Seine River Dinner Cruise',
      category: 'Food',
      description: 'Enjoy a gourmet 3-course French dinner while cruising past illuminated Parisian landmarks.',
      duration: 150,
      estimatedCost: 95,
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80'
    },
    {
      name: 'Montmartre Artists Walking Tour',
      category: 'Culture',
      description: 'Explore the charming bohemian streets of Montmartre and visit the stunning Sacré-Cœur.',
      duration: 120,
      estimatedCost: 20,
      image: 'https://images.unsplash.com/photo-1509840191024-457dd90c59b8?w=600&auto=format&fit=crop&q=80'
    }
  ],
  tokyo: [
    {
      name: 'Sushi Making Masterclass',
      category: 'Food',
      description: 'Learn the precise art of sushi rolling and sashimi slicing from a professional Tsukiji chef.',
      duration: 150,
      estimatedCost: 80,
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80'
    },
    {
      name: 'Shibuya Crossing & Izakaya Crawl',
      category: 'Relaxation',
      description: 'Experience the world\'s busiest crossing and dive into hidden alleyways for local drinks and yakitori.',
      duration: 180,
      estimatedCost: 50,
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80'
    },
    {
      name: 'Mt. Fuji & Lake Ashi Day Trip',
      category: 'Adventure',
      description: 'Travel to the 5th Station of Mt. Fuji, cruise on Lake Ashi, and take the Hakone ropeway.',
      duration: 600,
      estimatedCost: 120,
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop&q=80'
    },
    {
      name: 'teamLab Borderless Digital Art Museum',
      category: 'Culture',
      description: 'Immerse yourself in a collection of artworks that form one borderless world without map.',
      duration: 180,
      estimatedCost: 28,
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&auto=format&fit=crop&q=80'
    }
  ],
  london: [
    {
      name: 'Tower of London & Crown Jewels Tour',
      category: 'Culture',
      description: 'Explore the historic castle and see the dazzling display of the official Crown Jewels.',
      duration: 150,
      estimatedCost: 40,
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&auto=format&fit=crop&q=80'
    },
    {
      name: 'London Eye Flight',
      category: 'Sightseeing',
      description: 'Enjoy a 30-minute rotation in a glass pod with spectacular 360-degree views of London.',
      duration: 45,
      estimatedCost: 38,
      image: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=600&auto=format&fit=crop&q=80'
    },
    {
      name: 'West End Musical Show Tickets',
      category: 'Culture',
      description: 'Watch a world-famous theater production in London\'s legendary West End theater district.',
      duration: 150,
      estimatedCost: 75,
      image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600&auto=format&fit=crop&q=80'
    }
  ]
};

export const MOCK_TRIPS: Trip[] = [
  {
    id: 'trip-1',
    name: 'Classic European Adventure',
    description: 'A thrilling journey through the most romantic, artistic, and historical cities of Western Europe.',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80',
    startDate: '2026-09-10',
    endDate: '2026-09-20',
    totalBudget: 3500,
    destinations: ['Paris', 'Rome', 'Barcelona'],
    status: 'planning',
    stops: [
      {
        id: 'stop-1-1',
        cityId: 'paris',
        cityName: 'Paris',
        arrivalDate: '2026-09-10',
        departureDate: '2026-09-13',
        order: 1,
        activities: [
          {
            id: 'act-1',
            name: 'Eiffel Tower Summit Access',
            category: 'Sightseeing',
            description: 'Ascend to the top floor of the iconic Eiffel Tower for panoramic views of Paris.',
            duration: 120,
            estimatedCost: 35,
            image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=600&auto=format&fit=crop&q=80',
            time: '10:00'
          },
          {
            id: 'act-2',
            name: 'Seine River Dinner Cruise',
            category: 'Food',
            description: 'Enjoy a gourmet 3-course French dinner while cruising past illuminated Parisian landmarks.',
            duration: 150,
            estimatedCost: 95,
            image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80',
            time: '19:00'
          }
        ]
      },
      {
        id: 'stop-1-2',
        cityId: 'rome',
        cityName: 'Rome',
        arrivalDate: '2026-09-14',
        departureDate: '2026-09-17',
        order: 2,
        activities: [
          {
            id: 'act-3',
            name: 'Colosseum & Roman Forum Tour',
            category: 'Culture',
            description: 'Step back in time to the Roman Empire with a guided skip-the-line historical tour.',
            duration: 180,
            estimatedCost: 45,
            image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=80',
            time: '09:00'
          }
        ]
      },
      {
        id: 'stop-1-3',
        cityId: 'barcelona',
        cityName: 'Barcelona',
        arrivalDate: '2026-09-18',
        departureDate: '2026-09-20',
        order: 3,
        activities: [
          {
            id: 'act-4',
            name: 'Sagrada Familia Fast Track',
            category: 'Culture',
            description: 'Marvel at Gaudi\'s unfinished masterpiece with an audio-guided basilica tour.',
            duration: 90,
            estimatedCost: 30,
            image: 'https://images.unsplash.com/photo-1583422409516-2895a77efedd?w=600&auto=format&fit=crop&q=80',
            time: '11:00'
          }
        ]
      }
    ],
    expenses: [
      {
        id: 'exp-1',
        category: 'Transport',
        amount: 450,
        date: '2026-09-10',
        description: 'Flights from Home to Paris'
      },
      {
        id: 'exp-2',
        category: 'Accommodation',
        amount: 800,
        date: '2026-09-10',
        description: 'Hotel in Paris (3 nights)'
      },
      {
        id: 'exp-3',
        category: 'Activities',
        amount: 130,
        date: '2026-09-11',
        description: 'Eiffel Tower & Dinner Cruise'
      },
      {
        id: 'exp-4',
        category: 'Transport',
        amount: 150,
        date: '2026-09-14',
        description: 'Train from Paris to Rome'
      },
      {
        id: 'exp-5',
        category: 'Accommodation',
        amount: 600,
        date: '2026-09-14',
        description: 'Boutique Hotel in Rome (3 nights)'
      }
    ]
  },
  {
    id: 'trip-2',
    name: 'Neon & Nature: Japan Explorer',
    description: 'Immersive discovery of Tokyo\'s futuristic skyline and Mt. Fuji\'s natural beauty.',
    coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop&q=80',
    startDate: '2026-10-15',
    endDate: '2026-10-22',
    totalBudget: 4200,
    destinations: ['Tokyo'],
    status: 'planning',
    stops: [
      {
        id: 'stop-2-1',
        cityId: 'tokyo',
        cityName: 'Tokyo',
        arrivalDate: '2026-10-15',
        departureDate: '2026-10-22',
        order: 1,
        activities: [
          {
            id: 'act-5',
            name: 'Sushi Making Masterclass',
            category: 'Food',
            description: 'Learn the precise art of sushi rolling from a professional Tsukiji chef.',
            duration: 150,
            estimatedCost: 80,
            image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80',
            time: '12:00'
          },
          {
            id: 'act-6',
            name: 'teamLab Borderless',
            category: 'Culture',
            description: 'Immerse yourself in a collection of digital artworks without boundaries.',
            duration: 180,
            estimatedCost: 28,
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
        amount: 950,
        date: '2026-10-15',
        description: 'Round-trip Flights to Tokyo'
      },
      {
        id: 'exp-202',
        category: 'Accommodation',
        amount: 1400,
        date: '2026-10-15',
        description: 'Shinjuku Hotel Stay (7 nights)'
      },
      {
        id: 'exp-203',
        category: 'Activities',
        amount: 108,
        date: '2026-10-16',
        description: 'Sushi Class + teamLab'
      }
    ]
  },
  {
    id: 'trip-3',
    name: 'London Discovery & History',
    description: 'A history-focused tour exploring palaces, museums, and musicals in London.',
    coverImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80',
    startDate: '2026-05-01',
    endDate: '2026-05-06',
    totalBudget: 2200,
    destinations: ['London'],
    status: 'completed',
    stops: [
      {
        id: 'stop-3-1',
        cityId: 'london',
        cityName: 'London',
        arrivalDate: '2026-05-01',
        departureDate: '2026-05-06',
        order: 1,
        activities: [
          {
            id: 'act-7',
            name: 'Tower of London Tour',
            category: 'Culture',
            description: 'Explore the historic castle and see the dazzling display of the official Crown Jewels.',
            duration: 150,
            estimatedCost: 40,
            image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&auto=format&fit=crop&q=80',
            time: '10:00'
          }
        ]
      }
    ],
    expenses: [
      {
        id: 'exp-301',
        category: 'Transport',
        amount: 550,
        date: '2026-05-01',
        description: 'Eurostar Ticket Paris-London'
      },
      {
        id: 'exp-302',
        category: 'Accommodation',
        amount: 900,
        date: '2026-05-01',
        description: 'Airbnb in Soho (5 nights)'
      }
    ]
  }
];
