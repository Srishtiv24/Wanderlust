//default data
const sampleListings = [
  {
    title: "Cozy Beachfront Cottage",
    description:
      "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&auto=format&fit=crop&q=60",
    },
    price: 1500,
    location: "Malibu",
    country: "United States",
  },
  {
    title: "Modern Loft in Downtown",
    description:
      "Stay in the heart of the city in this stylish loft apartment. Perfect for urban explorers!",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=60",
    },
    price: 1200,
    location: "New York City",
    country: "United States",
  },
  {
    title: "Mountain Retreat",
    description:
      "Unplug and unwind in this peaceful mountain cabin. Surrounded by nature, it's a perfect place to recharge.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?w=800&auto=format&fit=crop&q=60",
    },
    price: 1000,
    location: "Aspen",
    country: "United States",
  },
  {
    title: "Historic Villa in Tuscany",
    description:
      "Experience the charm of Tuscany in this beautifully restored villa. Explore the rolling hills and vineyards.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=60",
    },
    price: 2500,
    location: "Florence",
    country: "Italy",
  },
  {
    title: "Secluded Treehouse Getaway",
    description:
      "Live among the treetops in this unique treehouse retreat. A true nature lover's paradise.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&auto=format&fit=crop&q=60",
    },
    price: 800,
    location: "Portland",
    country: "United States",
  },
  {
    title: "Beachfront Paradise",
    description:
      "Step out of your door onto the sandy beach. This beachfront condo offers the ultimate relaxation.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&auto=format&fit=crop&q=60",
    },
    price: 2000,
    location: "Cancun",
    country: "Mexico",
  },
  {
    title: "Rustic Cabin by the Lake",
    description:
      "Spend your days fishing and kayaking on the serene lake. This cozy cabin is perfect for outdoor enthusiasts.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&auto=format&fit=crop&q=60",
    },
    price: 900,
    location: "Lake Tahoe",
    country: "United States",
  },
  {
    title: "Luxury Penthouse with City Views",
    description:
      "Indulge in luxury living with panoramic city views from this stunning penthouse apartment.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60",
    },
    price: 3500,
    location: "Los Angeles",
    country: "United States",
  },
  {
    title: "Ski-In/Ski-Out Chalet",
    description:
      "Hit the slopes right from your doorstep in this ski-in/ski-out chalet in the Swiss Alps.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=800&auto=format&fit=crop&q=60",
    },
    price: 3000,
    location: "Verbier",
    country: "Switzerland",
  },
  {
    title: "Safari Lodge in the Serengeti",
    description:
      "Experience the thrill of the wild in a comfortable safari lodge. Witness the Great Migration up close.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&auto=format&fit=crop&q=60",
    },
    price: 4000,
    location: "Serengeti National Park",
    country: "Tanzania",
  },
  {
    title: "Historic Canal House",
    description:
      "Stay in a piece of history in this beautifully preserved canal house in Amsterdam's iconic district.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&auto=format&fit=crop&q=60",
    },
    price: 1800,
    location: "Amsterdam",
    country: "Netherlands",
  },
  {
    title: "Private Island Retreat",
    description:
      "Have an entire island to yourself for a truly exclusive and unforgettable vacation experience.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1602391833977-358a52198938?w=800&auto=format&fit=crop&q=60",
    },
    price: 10000,
    location: "Fiji",
    country: "Fiji",
  },
  {
    title: "Charming Cottage in the Cotswolds",
    description:
      "Escape to the picturesque Cotswolds in this quaint and charming cottage with a thatched roof.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop&q=60",
    },
    price: 1200,
    location: "Cotswolds",
    country: "United Kingdom",
  },
  {
    title: "Historic Brownstone in Boston",
    description:
      "Step back in time in this elegant historic brownstone located in the heart of Boston.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&auto=format&fit=crop&q=60",
    },
    price: 2200,
    location: "Boston",
    country: "United States",
  },
  {
    title: "Beachfront Bungalow in Bali",
    description:
      "Relax on the sandy shores of Bali in this beautiful beachfront bungalow with a private pool.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=60",
    },
    price: 1800,
    location: "Bali",
    country: "Indonesia",
  },
  {
    title: "Mountain View Cabin in Banff",
    description:
      "Enjoy breathtaking mountain views from this cozy cabin in the Canadian Rockies.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=60",
    },
    price: 1500,
    location: "Banff",
    country: "Canada",
  },
  {
    title: "Art Deco Apartment in Miami",
    description:
      "Step into the glamour of the 1920s in this stylish Art Deco apartment in South Beach.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1729605412184-8d796f9c6f66?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDMwfHx8ZW58MHx8fHx8?w=800&auto=format&fit=crop&q=60",
    },
    price: 1600,
    location: "Miami",
    country: "United States",
  },
  {
    title: "Tropical Villa in Phuket",
    description:
      "Escape to a tropical paradise in this luxurious villa with a private infinity pool in Phuket.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1586611292717-f828b167408c?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=800&auto=format&fit=crop&q=60",
    },
    price: 3000,
    location: "Phuket",
    country: "Thailand",
  },
  {
    title: "Historic Castle in Scotland",
    description:
      "Live like royalty in this historic castle in the Scottish Highlands. Explore the rugged beauty of the area.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1606787947151-1c54964042e5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjg5fHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D?w=800&auto=format&fit=crop&q=60",
    },
    price: 4000,
    location: "Scottish Highlands",
    country: "United Kingdom",
  },
  {
    title: "Desert Oasis in Dubai",
    description:
      "Experience luxury in the middle of the desert in this opulent oasis in Dubai with a private pool.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&auto=format&fit=crop&q=60",
    },
    price: 5000,
    location: "Dubai",
    country: "United Arab Emirates",
  },
  {
    title: "Rustic Log Cabin in Montana",
    description:
      "Unplug and unwind in this cozy log cabin surrounded by the natural beauty of Montana.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=800&auto=format&fit=crop&q=60",
    },
    price: 1100,
    location: "Montana",
    country: "United States",
  },
  {
    title: "Beachfront Villa in Greece",
    description:
      "Enjoy the crystal-clear waters of the Mediterranean in this beautiful beachfront villa on a Greek island.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800&auto=format&fit=crop&q=60",
    },
    price: 2500,
    location: "Mykonos",
    country: "Greece",
  },
  {
    title: "Eco-Friendly Treehouse Retreat",
    description:
      "Stay in an eco-friendly treehouse nestled in the forest. It's the perfect escape for nature lovers.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?w=800&auto=format&fit=crop&q=60",
    },
    price: 750,
    location: "Costa Rica",
    country: "Costa Rica",
  },
  {
    title: "Historic Cottage in Charleston",
    description:
      "Experience the charm of historic Charleston in this beautifully restored cottage with a private garden.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop&q=60",
    },
    price: 1600,
    location: "Charleston",
    country: "United States",
  },
  {
    title: "Modern Apartment in Tokyo",
    description:
      "Explore the vibrant city of Tokyo from this modern and centrally located apartment.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&auto=format&fit=crop&q=60",
    },
    price: 2000,
    location: "Tokyo",
    country: "Japan",
  },
  {
    title: "Lakefront Cabin in New Hampshire",
    description:
      "Spend your days by the lake in this cozy cabin in the scenic White Mountains of New Hampshire.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1573052905904-34ad8c27f0cc?w=800&auto=format&fit=crop&q=60",
    },
    price: 1200,
    location: "New Hampshire",
    country: "United States",
  },
  {
    title: "Luxury Villa in the Maldives",
    description:
      "Indulge in luxury in this overwater villa in the Maldives with stunning views of the Indian Ocean.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&auto=format&fit=crop&q=60",
    },
    price: 6000,
    location: "Maldives",
    country: "Maldives",
  },
  {
    title: "Ski Chalet in Aspen",
    description:
      "Hit the slopes in style with this luxurious ski chalet in the world-famous Aspen ski resort.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop&q=60",
    },
    price: 4000,
    location: "Aspen",
    country: "United States",
  },
  {
    title: "Secluded Beach House in Costa Rica",
    description:
      "Escape to a secluded beach house on the Pacific coast of Costa Rica. Surf, relax, and unwind.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=800&auto=format&fit=crop&q=60",
    },
    price: 1800,
    location: "Costa Rica",
    country: "Costa Rica",
  },
  {
    title: "Cliffside Villa in Santorini",
    description: "Wake up to breathtaking views of the Aegean Sea in this stunning whitewashed villa perched on the cliffs.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=60",
    },
    price: 3200,
    location: "Santorini",
    country: "Greece",
  },
  {
    title: "Snow Igloo Experience",
    description: "Stay in a magical igloo under the northern lights for a once-in-a-lifetime Arctic adventure.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1520769945061-0a448c463865?w=800&auto=format&fit=crop&q=60",
    },
    price: 2800,
    location: "Lapland",
    country: "Finland",
  },
  {
    title: "Rainforest Eco Lodge",
    description: "Immerse yourself in lush greenery and wildlife in this sustainable eco-lodge deep in the rainforest.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&auto=format&fit=crop&q=60",
    },
    price: 1400,
    location: "Amazon",
    country: "Brazil",
  },
  {
    title: "Floating Houseboat in Kerala",
    description: "Cruise through serene backwaters while enjoying a traditional Kerala houseboat stay.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=60",
    },
    price: 900,
    location: "Alleppey",
    country: "India",
  },
  {
    title: "Glass Dome Under the Stars",
    description: "Sleep under a sky full of stars in a transparent dome surrounded by nature.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&auto=format&fit=crop&q=60",
    },
    price: 1700,
    location: "Utah",
    country: "United States",
  },
  {
    title: "Himalayan Monastery Stay",
    description: "Experience peaceful living with monks in a serene monastery in the Himalayas.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1689546975449-9708d77e811e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=800&auto=format&fit=crop&q=60",
    },
    price: 600,
    location: "Ladakh",
    country: "India",
  },
  {
    title: "Underwater Hotel Suite",
    description: "Watch marine life swim past your window in this luxurious underwater suite.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=60",
    },
    price: 8000,
    location: "Bora Bora",
    country: "French Polynesia",
  },
  {
    title: "Desert Camp in Rajasthan",
    description: "Enjoy cultural performances and starry nights in a royal desert camp.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&auto=format&fit=crop&q=60",
    },
    price: 700,
    location: "Jaisalmer",
    country: "India",
  },
  {
    title: "Ice Hotel Stay",
    description: "Sleep on ice beds in this artistically carved hotel made entirely of ice.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&auto=format&fit=crop&q=60",
    },
    price: 2600,
    location: "Quebec",
    country: "Canada",
  },
  {
    title: "Jungle Tree Villa in Bali",
    description: "Surrounded by tropical jungle, this villa offers a private pool and serene vibes.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&auto=format&fit=crop&q=60",
    },
    price: 2100,
    location: "Ubud",
    country: "Indonesia",
  },
  {
    title: "Countryside Farm Stay",
    description: "Live a rustic life on a working farm with fresh food and open landscapes.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=60",
    },
    price: 500,
    location: "Punjab",
    country: "India",
  },
  {
    title: "Skyline Apartment in Seoul",
    description: "Enjoy a modern stay with panoramic views of Seoul's skyline.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&auto=format&fit=crop&q=60",
    },
    price: 1900,
    location: "Seoul",
    country: "South Korea",
  },
  {
    title: "Vintage Caravan Stay",
    description: "Travel back in time with this retro caravan experience on scenic grounds.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1525811902-f2342640856e?w=800&auto=format&fit=crop&q=60",
    },
    price: 400,
    location: "California",
    country: "United States",
  },
  {
    title: "Island Hut in Philippines",
    description: "Simple beach hut with crystal clear waters just steps away.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&auto=format&fit=crop&q=60",
    },
    price: 600,
    location: "Palawan",
    country: "Philippines",
  },
  {
    title: "Luxury Ryokan in Kyoto",
    description: "Traditional Japanese hospitality with tatami rooms and hot springs.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&auto=format&fit=crop&q=60",
    },
    price: 2700,
    location: "Kyoto",
    country: "Japan",
  },
  {
    title: "Volcano View Cabin",
    description: "Stay near an active volcano with stunning lava field views.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=800&auto=format&fit=crop&q=60",
    },
    price: 1300,
    location: "Hawaii",
    country: "United States",
  },
  {
    title: "Arctic Glass Igloo",
    description: "Watch the aurora borealis from the comfort of your warm igloo.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=800&auto=format&fit=crop&q=60",
    },
    price: 3000,
    location: "Norway",
    country: "Norway",
  },
  {
    title: "Lake House in Switzerland",
    description: "Charming house by a pristine alpine lake with mountain views.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=60",
    },
    price: 2500,
    location: "Lucerne",
    country: "Switzerland",
  },
  {
    title: "Urban Capsule Hotel",
    description: "Compact yet futuristic capsule stay in a bustling city center.",
    image: {
      filename: "listingimage",
      url: "https://plus.unsplash.com/premium_photo-1682377521591-dd6fb21ec96e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIwfHx8ZW58MHx8fHx8?w=800&auto=format&fit=crop&q=60",
    },
    price: 300,
    location: "Osaka",
    country: "Japan",
  },
  {
    title: "Mediterranean Sea View Apartment",
    description: "Bright apartment with a balcony overlooking the turquoise sea.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=800&auto=format&fit=crop&q=60",
    },
    price: 1800,
    location: "Nice",
    country: "France",
  },
  {
    title: "Cave House in Cappadocia",
    description: "Stay in a beautifully carved cave dwelling with hot air balloons floating overhead at sunrise.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&auto=format&fit=crop&q=60",
    },
    price: 2100,
    location: "Cappadocia",
    country: "Turkey",
  },
  {
    title: "Overwater Bungalow in Tahiti",
    description: "Step directly into turquoise waters from your private bungalow deck.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&auto=format&fit=crop&q=60",
    },
    price: 5200,
    location: "Tahiti",
    country: "French Polynesia",
  },
  {
    title: "Heritage Haveli in Jaipur",
    description: "Experience royal Rajasthani living in this restored haveli with traditional decor.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1667125094717-47e0ff6d0608?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjE4fHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D?w=800&auto=format&fit=crop&q=60",
    },
    price: 1100,
    location: "Jaipur",
    country: "India",
  },
  {
    title: "Cliff Hut in Faroe Islands",
    description: "Remote hut perched on dramatic cliffs with endless ocean views.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=800&auto=format&fit=crop&q=60",
    },
    price: 1800,
    location: "Faroe Islands",
    country: "Denmark",
  },
  {
    title: "Wine Estate Stay in Napa Valley",
    description: "Stay amidst vineyards and enjoy wine tasting experiences right at your doorstep.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1580977276076-ae4b8c219b8e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjQ0fHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D?w=800&auto=format&fit=crop&q=60",
    },
    price: 2600,
    location: "Napa Valley",
    country: "United States",
  },
  {
    title: "Floating Cabin in Sweden",
    description: "A peaceful floating cabin surrounded by calm Nordic waters and forests.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1499678329028-101435549a4e?w=800&auto=format&fit=crop&q=60",
    },
    price: 1900,
    location: "Stockholm Archipelago",
    country: "Sweden",
  },
  {
    title: "Tea Plantation Bungalow",
    description: "Wake up to misty hills and endless tea gardens in this colonial-style bungalow.",
    image: {
      filename: "listingimage",
      url: "https://plus.unsplash.com/premium_photo-1687995672262-1ed45d6ed3d1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDA2fHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D?w=800&auto=format&fit=crop&q=60",
    },
    price: 900,
    location: "Munnar",
    country: "India",
  },
  {
    title: "Glass House in Iceland",
    description: "Modern glass house perfect for watching northern lights in complete comfort.",
    image: {
      filename: "listingimage",
      url: "https://plus.unsplash.com/premium_photo-1661903136240-a97367001a64?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzQyfHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D?w=800&auto=format&fit=crop&q=60",
    },
    price: 3000,
    location: "Reykjavik",
    country: "Iceland",
  },
  {
    title: "Safari Tent in Maasai Mara",
    description: "Luxury tented camp offering close encounters with wildlife in the savannah.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1504432842672-1a79f78e4084?w=800&auto=format&fit=crop&q=60",
    },
    price: 2300,
    location: "Maasai Mara",
    country: "Kenya",
  },
  {
    title: "Beach Shack in Goa",
    description: "Simple yet vibrant shack right on the beach with sunset views.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=60",
    },
    price: 600,
    location: "Goa",
    country: "India",
  },
  {
    title: "Hilltop Cottage in Ooty",
    description: "Cozy cottage with panoramic views of lush green hills and tea gardens.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1458442310124-dde6edb43d10?w=800&auto=format&fit=crop&q=60",
    },
    price: 800,
    location: "Ooty",
    country: "India",
  },
  {
    title: "Luxury Yacht Stay in Monaco",
    description: "Experience the high life aboard a private yacht in the glamorous harbor.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&auto=format&fit=crop&q=60",
    },
    price: 7000,
    location: "Monaco",
    country: "Monaco",
  },
  {
    title: "Desert Cave in Petra",
    description: "Ancient-style cave stay near the historic wonders of Petra.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=60",
    },
    price: 1200,
    location: "Petra",
    country: "Jordan",
  },
  {
    title: "Riverfront Bamboo Hut",
    description: "Eco-friendly bamboo hut beside a flowing river surrounded by greenery.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=60",
    },
    price: 500,
    location: "Chiang Mai",
    country: "Thailand",
  },
  {
    title: "Sky Cabin in New Zealand",
    description: "Elevated cabin offering uninterrupted views of mountains and night sky.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=60",
    },
    price: 2100,
    location: "Queenstown",
    country: "New Zealand",
  },
  {
    title: "Historic Riad in Marrakech",
    description: "Traditional Moroccan riad with intricate interiors and a peaceful courtyard.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?w=800&auto=format&fit=crop&q=60",
    },
    price: 1300,
    location: "Marrakech",
    country: "Morocco",
  },
  {
    title: "Coastal Lighthouse Stay",
    description: "Unique stay inside a restored lighthouse overlooking crashing waves.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1622041173930-3e72c82cb5a8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzc5fHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D?w=800&auto=format&fit=crop&q=60",
    },
    price: 1700,
    location: "Cornwall",
    country: "United Kingdom",
  },
  {
    title: "Jungle Dome in Sri Lanka",
    description: "Stay in a futuristic dome surrounded by dense tropical jungle.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=800&auto=format&fit=crop&q=60",
    },
    price: 1000,
    location: "Sigiriya",
    country: "Sri Lanka",
  },
  {
    title: "Alpine Chalet in Austria",
    description: "Classic wooden chalet with snow-covered peaks all around.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=60",
    },
    price: 2400,
    location: "Innsbruck",
    country: "Austria",
  },
  {
    title: "Canal Boat Stay in Venice",
    description: "Stay on a charming boat floating along Venice's iconic canals.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=800&auto=format&fit=crop&q=60",
    },
    price: 2000,
    location: "Venice",
    country: "Italy",
  },
  {
    title: "Forest Cabin in Black Forest",
    description: "Secluded wooden cabin deep in Germany's famous Black Forest.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&auto=format&fit=crop&q=60",
    },
    price: 1100,
    location: "Black Forest",
    country: "Germany",
  },
  {
    title: "Cliffside Resort in Amalfi Coast",
    description: "Luxury stay with dramatic sea views along Italy's famous coastline.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=800&auto=format&fit=crop&q=60",
    },
    price: 3500,
    location: "Amalfi",
    country: "Italy",
  },
  {
    title: "Snow Cabin in Siberia",
    description: "Extreme winter experience in a remote snowy wilderness.",
    image: {
      filename: "listingimage",
      url: "https://plus.unsplash.com/premium_photo-1661923086373-73176f7c004a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDExNnx8fGVufDB8fHx8fA%3D%3D?w=800&auto=format&fit=crop&q=60",
    },
    price: 900,
    location: "Siberia",
    country: "Russia",
  },
  {
    title: "Island Villa in Seychelles",
    description: "Private villa surrounded by turquoise waters and white sand beaches.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&auto=format&fit=crop&q=60",
    },
    price: 4800,
    location: "Seychelles",
    country: "Seychelles",
  },
  {
    title: "Temple View Stay in Varanasi",
    description: "Spiritual stay overlooking the ghats and Ganga river.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=800&auto=format&fit=crop&q=60",
    },
    price: 700,
    location: "Varanasi",
    country: "India",
  },
  {
    title: "Countryside Barn Stay",
    description: "Converted barn offering rustic charm with modern comforts.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?w=800&auto=format&fit=crop&q=60",
    },
    price: 800,
    location: "Texas",
    country: "United States",
  },
  {
    title: "Island Treehouse in Zanzibar",
    description: "Stay elevated above the beach in a tropical treehouse setting.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1606046604972-77cc76aee944?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTc1fHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D?w=800&auto=format&fit=crop&q=60",
    },
    price: 1400,
    location: "Zanzibar",
    country: "Tanzania",
  },
  {
    title: "Luxury Apartment in Hong Kong",
    description: "High-rise apartment with stunning skyline and harbor views.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1602081115720-72e5b0a254b8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTY2fHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D?w=800&auto=format&fit=crop&q=60",
    },
    price: 2800,
    location: "Hong Kong",
    country: "China",
  },
  {
    title: "Volcanic Rock House in Canary Islands",
    description: "Unique home built into volcanic rock formations.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1698752160549-a55a15516698?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzIwfHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D?w=800&auto=format&fit=crop&q=60",
    },
    price: 1500,
    location: "Lanzarote",
    country: "Spain",
  },
  {
    title: "Beach Resort in Andaman",
    description: "Crystal clear waters and white sand beaches at your doorstep.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=800&auto=format&fit=crop&q=60",
    },
    price: 1700,
    location: "Andaman",
    country: "India",
  },
  {
    title: "Floating Market Stay in Bangkok",
    description: "Stay near vibrant floating markets and experience Thailand's local culture up close.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800&auto=format&fit=crop&q=60",
    },
    price: 900,
    location: "Bangkok",
    country: "Thailand",
  },
  {
    title: "Cliffside Cottage in Ireland",
    description: "Cozy cottage overlooking dramatic cliffs and the wild Atlantic Ocean.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1726162843235-d1a48bfc9ad4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDU1fHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D?w=800&auto=format&fit=crop&q=60",
    },
    price: 1400,
    location: "Cliffs of Moher",
    country: "Ireland",
  },
  {
    title: "Luxury Desert Tent in Oman",
    description: "Experience Arabian nights in a premium desert camp under star-filled skies.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1538681105587-85640961bf8b?w=800&auto=format&fit=crop&q=60",
    },
    price: 1800,
    location: "Wahiba Sands",
    country: "Oman",
  },
  {
    title: "Snowy Lodge in Alaska",
    description: "Remote lodge surrounded by snow-covered wilderness and northern lights.",
    image: {
      filename: "listingimage",
      url: "https://plus.unsplash.com/premium_photo-1661907801393-3b36254a81b4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzc0fHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D?w=800&auto=format&fit=crop&q=60",
    },
    price: 2200,
    location: "Alaska",
    country: "United States",
  },
  {
    title: "Beach Hut in Sri Lanka",
    description: "Simple seaside hut with palm trees and relaxing ocean breeze.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=800&auto=format&fit=crop&q=60",
    },
    price: 500,
    location: "Mirissa",
    country: "Sri Lanka",
  },
  {
    title: "Jungle Safari Lodge in India",
    description: "Stay close to nature with jungle safaris and wildlife spotting experiences.",
    image: {
      filename: "listingimage",
      url: "https://plus.unsplash.com/premium_photo-1687960116802-a9a05891d33f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzYyfHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D?w=800&auto=format&fit=crop&q=60",
    },
    price: 1300,
    location: "Jim Corbett",
    country: "India",
  },
  {
    title: "Sky Villa in Singapore",
    description: "Ultra-modern villa with infinity pool overlooking the city skyline.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1506813211037-0b52e02d19b7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDI4fHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D?w=800&auto=format&fit=crop&q=60",
    },
    price: 3500,
    location: "Singapore",
    country: "Singapore",
  },
  {
    title: "Harbor View Apartment in Sydney",
    description: "Enjoy iconic views of the Sydney Opera House from your balcony.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTB8fGhvdGVsfGVufDB8fDB8fHww?w=800&auto=format&fit=crop&q=60",
    },
    price: 2600,
    location: "Sydney",
    country: "Australia",
  },
  {
    title: "Mountain Hut in Nepal",
    description: "Basic yet breathtaking stay along trekking routes in the Himalayas.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1582719388123-e03e25d06d51?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDc2fHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D?w=800&auto=format&fit=crop&q=60",
    },
    price: 400,
    location: "Everest Region",
    country: "Nepal",
  },
  {
    title: "Luxury Palace Stay in Udaipur",
    description: "Live like royalty in a palace overlooking serene lakes.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjB8fGhvdGVsfGVufDB8fDB8fHww?w=800&auto=format&fit=crop&q=60",
    },
    price: 2800,
    location: "Udaipur",
    country: "India",
  },
  {
    title: "Beachfront Condo in Honolulu",
    description: "Wake up to ocean waves in this modern Hawaiian beachfront condo.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fGhvdGVsfGVufDB8fDB8fHww?w=800&auto=format&fit=crop&q=60",
    },
    price: 2400,
    location: "Honolulu",
    country: "United States",
  },
  {
    title: "Forest Retreat in Finland",
    description: "Minimalist cabin surrounded by quiet forests and pristine lakes.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=60",
    },
    price: 1500,
    location: "Helsinki",
    country: "Finland",
  },
  {
    title: "Luxury Ski Lodge in Colorado",
    description: "High-end ski lodge with fireplace and slope access.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&auto=format&fit=crop&q=60",
    },
    price: 3200,
    location: "Colorado",
    country: "United States",
  },
  {
    title: "Riverside Cottage in Prague",
    description: "Charming cottage along the river with views of historic bridges.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800&auto=format&fit=crop&q=60",
    },
    price: 1700,
    location: "Prague",
    country: "Czech Republic",
  },
  {
    title: "Island Retreat in Madagascar",
    description: "Remote island escape surrounded by unique wildlife and beaches.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1587870306141-4f19861e6c73?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTY4fHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D?w=800&auto=format&fit=crop&q=60",
    },
    price: 2100,
    location: "Madagascar",
    country: "Madagascar",
  },
  {
    title: "Urban Loft in Berlin",
    description: "Trendy loft in the heart of Berlin's vibrant art scene.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&auto=format&fit=crop&q=60",
    },
    price: 1600,
    location: "Berlin",
    country: "Germany",
  },
  {
    title: "Beach Villa in Zanzibar",
    description: "Private beachfront villa with turquoise waters and white sand.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1595381958661-572a37f227bf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzc1fHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D?w=800&auto=format&fit=crop&q=60",
    },
    price: 2600,
    location: "Zanzibar",
    country: "Tanzania",
  },
  {
    title: "Cultural Homestay in Bhutan",
    description: "Experience Bhutanese traditions and hospitality in a local home.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTA2fHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D",
    },
    price: 600,
    location: "Paro",
    country: "Bhutan",
  },
  {
    title: "Luxury Apartment in Toronto",
    description: "Modern apartment with skyline views in downtown Toronto.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60",
    },
    price: 2200,
    location: "Toronto",
    country: "Canada",
  },
  {
    title: "Desert Retreat in Arizona",
    description: "Peaceful desert home surrounded by red rocks and sunsets.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=60",
    },
    price: 1400,
    location: "Arizona",
    country: "United States",
  },
  {
    title: "Seaside Cottage in Norway",
    description: "Colorful cottage by the fjords with stunning coastal views.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1561501878-aabd62634533?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTMxfHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D?w=800&auto=format&fit=crop&q=60",
    },
    price: 2000,
    location: "Bergen",
    country: "Norway",
  }
];

module.exports = { data: sampleListings };

//returning an obj with data as key which contains sample listing arr