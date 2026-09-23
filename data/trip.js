// Single source of truth for the trip. Claude edits this file as plans evolve.
// Prices are rough ESTIMATES (USD per night) for planning only - always check live rates.
window.TRIP = {
  meta: {
    title: "CoRL 2026 · USA trip",
    travellers: ["Matija", "Maryna"],
    updated: "2026-09-23",
    status: "First draft - built before any assets were added. Dates outside the conference are assumptions.",
  },

  // Default planning inputs. Each person can override these on the Feedback tab;
  // overrides are sent back with feedback and folded into the next revision.
  settings: {
    budgetPerNight: 200,
    currency: "USD",
    tripStart: "2026-11-07",
    maxDriveHoursPerDay: 5,
    pace: "relaxed",
  },

  obligations: [
    { id: "corl-ws", title: "CoRL workshops", start: "2026-11-09", end: "2026-11-09", place: "austin", where: "JW Marriott Austin", notes: "Workshop day." },
    { id: "corl-main", title: "CoRL main conference", start: "2026-11-10", end: "2026-11-12", place: "austin", where: "JW Marriott Austin", notes: "Main conference days. Maryna explores Austin solo during the day." },
  ],

  openQuestions: [
    "Where are you flying from, and which airports work for arriving/departing?",
    "How many days in total can you take (i.e. latest return date)?",
    "Is Maryna joining for the whole trip including the conference week?",
    "Are you OK renting a car and driving 4-6 h on some days?",
    "Any must-sees already on your list?",
  ],

  places: {
    austin:         { name: "Austin, TX",            lat: 30.2672, lng: -97.7431,  blurb: "Live music, tacos & BBQ, swimming holes. Conference base." },
    fredericksburg: { name: "Fredericksburg, TX",    lat: 30.2752, lng: -98.8720,  blurb: "German-Texan Hill Country town, wineries, Enchanted Rock." },
    marfa:          { name: "Marfa, TX",             lat: 30.3094, lng: -104.0206, blurb: "Tiny high-desert art town, Donald Judd, dark skies." },
    bigbend:        { name: "Big Bend NP (Terlingua)", lat: 29.3214, lng: -103.6160, blurb: "Remote desert and canyon national park on the Rio Grande." },
    sanantonio:     { name: "San Antonio, TX",       lat: 29.4241, lng: -98.4936,  blurb: "River Walk, Spanish missions (UNESCO), Pearl district." },
    houston:        { name: "Houston, TX",           lat: 29.7604, lng: -95.3698,  blurb: "Space Center, Menil & Rothko Chapel, great food." },
    neworleans:     { name: "New Orleans, LA",       lat: 29.9511, lng: -90.0715,  blurb: "Jazz, Creole food, architecture, swamps." },
    lasvegas:       { name: "Las Vegas, NV",         lat: 36.1699, lng: -115.1398, blurb: "Gateway airport for the parks; Red Rock & Valley of Fire nearby." },
    zion:           { name: "Zion NP (Springdale)",  lat: 37.1889, lng: -112.9986, blurb: "Towering red canyon walls, iconic hikes." },
    page:           { name: "Page, AZ",              lat: 36.9147, lng: -111.4558, blurb: "Horseshoe Bend, Antelope Canyon, Lake Powell." },
    grandcanyon:    { name: "Grand Canyon (South Rim)", lat: 36.0544, lng: -112.1401, blurb: "Needs no introduction. Sunrise & sunset on the rim." },
    sedona:         { name: "Sedona, AZ",            lat: 34.8697, lng: -111.7610, blurb: "Red rock hiking, late fall colours in Oak Creek Canyon." },
    phoenix:        { name: "Phoenix, AZ",           lat: 33.4484, lng: -112.0740, blurb: "Departure airport (PHX)." },
    nyc:            { name: "New York City",         lat: 40.7128, lng: -74.0060,  blurb: "Museums, Broadway, late-fall Central Park." },
  },

  // cat: nature | food | culture | music | city | night | adventure
  activities: [
    // Austin
    { id: "atx-barton", place: "austin", title: "Swim at Barton Springs Pool", cat: "nature", cost: "$", dur: "2h", why: "Spring-fed pool at ~20°C all year - locals swim in November too." },
    { id: "atx-soco", place: "austin", title: "South Congress stroll", cat: "city", cost: "free", dur: "2h", why: "Shops, murals, 'I love you so much' wall, view of the Capitol." },
    { id: "atx-bbq", place: "austin", title: "Texas BBQ (Franklin / la Barbecue / Terry Black's)", cat: "food", cost: "$$", dur: "2-4h", why: "Franklin needs a morning queue; Terry Black's is walk-in and good." },
    { id: "atx-tacos", place: "austin", title: "Breakfast tacos crawl", cat: "food", cost: "$", dur: "1h", why: "Veracruz All Natural migas taco is a local classic." },
    { id: "atx-capitol", place: "austin", title: "Texas State Capitol", cat: "culture", cost: "free", dur: "1h", why: "Free tours, bigger than the US Capitol (Texans will tell you)." },
    { id: "atx-bonnell", place: "austin", title: "Sunset at Mount Bonnell", cat: "nature", cost: "free", dur: "1h", why: "Short climb, best sunset over Lake Austin." },
    { id: "atx-kayak", place: "austin", title: "Kayak / SUP on Lady Bird Lake", cat: "nature", cost: "$", dur: "2h", why: "Skyline views from the water, rentals near Zilker." },
    { id: "atx-music", place: "austin", title: "Live music: Continental Club / Broken Spoke", cat: "music", cost: "$", dur: "evening", why: "Broken Spoke gives two-step lessons - great post-conference night." },
    { id: "atx-wildflower", place: "austin", title: "Lady Bird Johnson Wildflower Center", cat: "nature", cost: "$", dur: "2-3h", why: "Good solo day for Maryna during the conference." },
    { id: "atx-blanton", place: "austin", title: "Blanton Museum + Ellsworth Kelly's 'Austin'", cat: "culture", cost: "$", dur: "2h", why: "Kelly's light-filled chapel is a must for art fans." },
    { id: "atx-hamilton", place: "austin", title: "Hamilton Pool Preserve", cat: "nature", cost: "$", dur: "half day", why: "Collapsed grotto with waterfall; reservation required - check if open." },
    { id: "atx-bats", place: "austin", title: "Congress Avenue bat bridge", cat: "nature", cost: "free", dur: "30m", why: "Season is Mar-Oct; by November most bats have left - low odds." },

    // Fredericksburg / Hill Country
    { id: "fbg-rock", place: "fredericksburg", title: "Hike Enchanted Rock", cat: "nature", cost: "$", dur: "3h", why: "Huge pink granite dome; book a state-park day pass in advance." },
    { id: "fbg-wine", place: "fredericksburg", title: "Hill Country wineries on Hwy 290", cat: "food", cost: "$$", dur: "half day", why: "Dozens of tasting rooms; designate a driver or book a shuttle." },
    { id: "fbg-luck", place: "fredericksburg", title: "Luckenbach dance hall", cat: "music", cost: "free", dur: "2h", why: "Tiny town, big country music legend." },
    { id: "fbg-pacific", place: "fredericksburg", title: "National Museum of the Pacific War", cat: "culture", cost: "$", dur: "3h", why: "Excellent if you like history." },

    // Marfa
    { id: "mfa-chinati", place: "marfa", title: "Chinati Foundation (Donald Judd)", cat: "culture", cost: "$$", dur: "half day", why: "Guided tours - reserve ahead; open limited days." },
    { id: "mfa-prada", place: "marfa", title: "Prada Marfa photo stop", cat: "culture", cost: "free", dur: "1h", why: "Art installation in the middle of nowhere near Valentine." },
    { id: "mfa-lights", place: "marfa", title: "Marfa Lights viewing area", cat: "night", cost: "free", dur: "1h", why: "Mystery lights + incredible stars." },
    { id: "mfa-mcdonald", place: "marfa", title: "McDonald Observatory star party", cat: "night", cost: "$", dur: "evening", why: "Some of the darkest skies in the US; tickets sell out." },

    // Big Bend
    { id: "bb-santaelena", place: "bigbend", title: "Santa Elena Canyon trail", cat: "nature", cost: "free", dur: "2h", why: "1500 ft canyon walls over the Rio Grande." },
    { id: "bb-lostmine", place: "bigbend", title: "Lost Mine Trail (Chisos)", cat: "nature", cost: "free", dur: "3-4h", why: "Best view-per-effort hike in the park." },
    { id: "bb-window", place: "bigbend", title: "Window View at sunset", cat: "nature", cost: "free", dur: "1h", why: "Easy walk, classic sunset frame." },
    { id: "bb-hotsprings", place: "bigbend", title: "Soak in the Hot Springs", cat: "nature", cost: "free", dur: "2h", why: "Historic hot spring right on the Rio Grande." },
    { id: "bb-river", place: "bigbend", title: "River Road (FM 170) scenic drive", cat: "adventure", cost: "free", dur: "half day", why: "One of the most beautiful drives in Texas." },
    { id: "bb-terlingua", place: "bigbend", title: "Terlingua ghost town + Starlight Theatre", cat: "food", cost: "$$", dur: "evening", why: "Porch sunset, then dinner and live music." },

    // San Antonio
    { id: "sa-missions", place: "sanantonio", title: "Mission trail by bike", cat: "culture", cost: "$", dur: "half day", why: "UNESCO missions, bike-share along the river." },
    { id: "sa-riverwalk", place: "sanantonio", title: "River Walk evening", cat: "city", cost: "free", dur: "2h", why: "Touristy but charming at night." },
    { id: "sa-pearl", place: "sanantonio", title: "Pearl district + Hotel Emma bar", cat: "food", cost: "$$", dur: "3h", why: "Best food hall and farmers market (weekends)." },
    { id: "sa-alamo", place: "sanantonio", title: "The Alamo", cat: "culture", cost: "free", dur: "1h", why: "Quick visit - smaller than people expect." },

    // Houston
    { id: "hou-space", place: "houston", title: "Space Center Houston + tram tour", cat: "culture", cost: "$$", dur: "half day", why: "Mission Control and Saturn V - great for a robotics person." },
    { id: "hou-menil", place: "houston", title: "Menil Collection + Rothko Chapel", cat: "culture", cost: "free", dur: "3h", why: "World-class, free and calm." },

    // New Orleans
    { id: "nola-frenchmen", place: "neworleans", title: "Jazz on Frenchmen Street", cat: "music", cost: "$", dur: "evening", why: "Better than Bourbon St; Spotted Cat, Snug Harbor." },
    { id: "nola-preservation", place: "neworleans", title: "Preservation Hall concert", cat: "music", cost: "$$", dur: "1h", why: "Book tickets ahead." },
    { id: "nola-streetcar", place: "neworleans", title: "St Charles streetcar + Garden District", cat: "city", cost: "$", dur: "half day", why: "Oak-lined avenue, mansions, Lafayette Cemetery." },
    { id: "nola-beignets", place: "neworleans", title: "Beignets at Café du Monde", cat: "food", cost: "$", dur: "30m", why: "Go early to skip the queue." },
    { id: "nola-swamp", place: "neworleans", title: "Swamp / bayou boat tour", cat: "nature", cost: "$$", dur: "half day", why: "Alligators still around in mild November weather." },
    { id: "nola-ww2", place: "neworleans", title: "National WWII Museum", cat: "culture", cost: "$$", dur: "half day", why: "Consistently rated one of the best museums in the US." },
    { id: "nola-brunch", place: "neworleans", title: "Jazz brunch (Commander's Palace)", cat: "food", cost: "$$$", dur: "2h", why: "Dress code; reserve ahead." },

    // Southwest
    { id: "lv-redrock", place: "lasvegas", title: "Red Rock Canyon scenic loop", cat: "nature", cost: "$", dur: "half day", why: "30 min from the Strip; timed entry reservation." },
    { id: "lv-sphere", place: "lasvegas", title: "Show at the Sphere", cat: "night", cost: "$$$", dur: "evening", why: "If you're in Vegas anyway." },
    { id: "zion-overlook", place: "zion", title: "Canyon Overlook trail", cat: "nature", cost: "$", dur: "1h", why: "Short, huge payoff." },
    { id: "zion-angels", place: "zion", title: "Angels Landing (permit lottery)", cat: "adventure", cost: "$", dur: "half day", why: "Needs a permit - apply in the seasonal lottery." },
    { id: "zion-narrows", place: "zion", title: "Riverside Walk / lower Narrows", cat: "nature", cost: "$", dur: "3h", why: "Water is cold in Nov - drysuit rentals in Springdale." },
    { id: "page-horseshoe", place: "page", title: "Horseshoe Bend at sunset", cat: "nature", cost: "$", dur: "1h", why: "Iconic Colorado River bend." },
    { id: "page-antelope", place: "page", title: "Antelope Canyon guided tour", cat: "nature", cost: "$$", dur: "2h", why: "Navajo-guided tours only; book ahead." },
    { id: "gc-sunrise", place: "grandcanyon", title: "Sunrise at Mather Point, sunset at Hopi Point", cat: "nature", cost: "$", dur: "2h", why: "Stay inside the park to make both easy." },
    { id: "gc-brightangel", place: "grandcanyon", title: "Bright Angel Trail to 1.5-mile resthouse", cat: "nature", cost: "free", dur: "3h", why: "Taste of the inner canyon; the climb back is the hard part." },
    { id: "sed-cathedral", place: "sedona", title: "Cathedral Rock hike", cat: "nature", cost: "$", dur: "2h", why: "Short scramble, famous view." },
    { id: "sed-westfork", place: "sedona", title: "West Fork of Oak Creek", cat: "nature", cost: "$", dur: "3h", why: "Fall colours can still be around in early-mid November." },
    { id: "sed-chapel", place: "sedona", title: "Chapel of the Holy Cross + Tlaquepaque", cat: "culture", cost: "free", dur: "2h", why: "Easy afternoon." },
    { id: "sed-stars", place: "sedona", title: "Stargazing tour", cat: "night", cost: "$$", dur: "2h", why: "Dark-sky community." },

    // New York
    { id: "nyc-central", place: "nyc", title: "Central Park in late fall", cat: "nature", cost: "free", dur: "half day", why: "Foliage often peaks early-mid November." },
    { id: "nyc-met", place: "nyc", title: "The Met", cat: "culture", cost: "$$", dur: "half day", why: "Pick 3 wings, don't try to see it all." },
    { id: "nyc-highline", place: "nyc", title: "High Line + Little Island + Chelsea Market", cat: "city", cost: "free", dur: "half day", why: "Great first-day walk." },
    { id: "nyc-broadway", place: "nyc", title: "Broadway show", cat: "night", cost: "$$$", dur: "evening", why: "TKTS booth for same-day discounts." },
    { id: "nyc-brooklyn", place: "nyc", title: "Walk Brooklyn Bridge to DUMBO", cat: "city", cost: "free", dur: "2h", why: "Go early morning or at dusk." },
    { id: "nyc-jazz", place: "nyc", title: "Village Vanguard jazz", cat: "music", cost: "$$", dur: "evening", why: "Legendary basement club." },
    { id: "nyc-summit", place: "nyc", title: "Top of the Rock or SUMMIT at sunset", cat: "city", cost: "$$", dur: "2h", why: "Top of the Rock has the Empire State in view." },
  ],

  // price = rough estimate per night in USD. kind: hotel | airbnb | lodge | motel | campground
  stays: [
    { id: "s-atx-jw", place: "austin", name: "JW Marriott Austin (venue)", area: "Downtown", kind: "hotel", price: 380, notes: "Zero commute. Check for a CoRL group rate." },
    { id: "s-atx-hyattplace", place: "austin", name: "Hyatt Place / Hampton Inn Downtown", area: "Downtown", kind: "hotel", price: 240, notes: "Walkable to venue, cheaper chain option." },
    { id: "s-atx-sanjose", place: "austin", name: "Hotel San José", area: "South Congress", kind: "hotel", price: 300, notes: "Boutique, great area for Maryna; 10 min ride to venue." },
    { id: "s-atx-airbnb", place: "austin", name: "Airbnb in East Austin / Travis Heights", area: "East Austin", kind: "airbnb", price: 160, notes: "Kitchen + space for a 6-night stay; ride-share to venue." },

    { id: "s-fbg-cottage", place: "fredericksburg", name: "Guesthaus / cottage near Main St", area: "Downtown", kind: "airbnb", price: 180, notes: "Classic Fredericksburg stay." },
    { id: "s-fbg-inn", place: "fredericksburg", name: "Hangar Hotel / chain inn", area: "Airport / edge of town", kind: "hotel", price: 150, notes: "" },

    { id: "s-mfa-hotelsaintgeorge", place: "marfa", name: "Hotel Saint George", area: "Marfa", kind: "hotel", price: 260, notes: "Stylish; Marfa has few rooms - book early." },
    { id: "s-mfa-elcosmico", place: "marfa", name: "El Cosmico (trailers / tents)", area: "Marfa", kind: "campground", price: 170, notes: "Quirky vintage trailers. Cold nights in Nov!" },
    { id: "s-mfa-alpine", place: "marfa", name: "Motel in Alpine (26 mi)", area: "Alpine", kind: "motel", price: 110, notes: "Budget fallback." },

    { id: "s-bb-chisos", place: "bigbend", name: "Chisos Mountains Lodge", area: "Inside the park", kind: "lodge", price: 200, notes: "Only lodging in the park - books out months ahead." },
    { id: "s-bb-willow", place: "bigbend", name: "Casita / tiny house in Terlingua", area: "Terlingua", kind: "airbnb", price: 150, notes: "Off-grid style stays with huge skies." },
    { id: "s-bb-lajitas", place: "bigbend", name: "Lajitas Golf Resort", area: "Lajitas", kind: "hotel", price: 230, notes: "Most comfortable option, 40 min from park." },

    { id: "s-sa-emma", place: "sanantonio", name: "Hotel Emma", area: "Pearl", kind: "hotel", price: 450, notes: "Splurge - one of the best hotels in Texas." },
    { id: "s-sa-riverwalk", place: "sanantonio", name: "River Walk mid-range hotel", area: "Downtown", kind: "hotel", price: 180, notes: "" },
    { id: "s-sa-kinglwm", place: "sanantonio", name: "Airbnb in King William district", area: "King William", kind: "airbnb", price: 140, notes: "Historic, walkable to River Walk." },

    { id: "s-hou-museum", place: "houston", name: "Hotel in Museum District", area: "Museum District", kind: "hotel", price: 170, notes: "" },

    { id: "s-nola-quarter", place: "neworleans", name: "Boutique hotel in French Quarter", area: "French Quarter", kind: "hotel", price: 250, notes: "Loud at night - ask for a courtyard room." },
    { id: "s-nola-marigny", place: "neworleans", name: "Guesthouse in the Marigny", area: "Marigny", kind: "airbnb", price: 170, notes: "Walk to Frenchmen St." },
    { id: "s-nola-garden", place: "neworleans", name: "B&B in Garden District", area: "Garden District", kind: "hotel", price: 200, notes: "Quieter, on the streetcar line." },

    { id: "s-lv-strip", place: "lasvegas", name: "Mid-Strip hotel (weekday)", area: "The Strip", kind: "hotel", price: 120, notes: "Watch out for resort fees (~$45/night)." },
    { id: "s-zion-cliffrose", place: "zion", name: "Cliffrose / Desert Pearl, Springdale", area: "Springdale", kind: "hotel", price: 260, notes: "Walk to park entrance." },
    { id: "s-zion-motel", place: "zion", name: "Springdale motel", area: "Springdale", kind: "motel", price: 150, notes: "" },
    { id: "s-page-hotel", place: "page", name: "Page chain hotel", area: "Page", kind: "hotel", price: 130, notes: "" },
    { id: "s-gc-eltovar", place: "grandcanyon", name: "El Tovar / Bright Angel Lodge", area: "In park, on the rim", kind: "lodge", price: 230, notes: "Book 6-12 months ahead; cancellations do appear." },
    { id: "s-gc-tusayan", place: "grandcanyon", name: "Hotel in Tusayan", area: "Tusayan (10 min)", kind: "hotel", price: 170, notes: "" },
    { id: "s-sed-lauberge", place: "sedona", name: "L'Auberge de Sedona", area: "Uptown / creekside", kind: "hotel", price: 600, notes: "Big splurge." },
    { id: "s-sed-mid", place: "sedona", name: "West Sedona hotel", area: "West Sedona", kind: "hotel", price: 220, notes: "" },
    { id: "s-sed-cottonwood", place: "sedona", name: "Cottonwood inn (25 min)", area: "Cottonwood", kind: "hotel", price: 130, notes: "Budget fallback, nice old town." },

    { id: "s-nyc-midtown", place: "nyc", name: "Midtown hotel", area: "Midtown", kind: "hotel", price: 320, notes: "NYC hotel tax ~15% on top." },
    { id: "s-nyc-brooklyn", place: "nyc", name: "Hotel in Williamsburg / DUMBO", area: "Brooklyn", kind: "hotel", price: 280, notes: "" },
    { id: "s-nyc-lic", place: "nyc", name: "Long Island City hotel", area: "Queens (1 stop to Midtown)", kind: "hotel", price: 200, notes: "Best value with skyline views." },
  ],

  // Each variant is a sequence of legs. A leg = where you sleep between two dates.
  // "arrive" is the check-in date, "leave" the check-out date. "days" is a per-day plan (text or activity ids).
  currentVariant: "texas",
  variants: [
    {
      id: "texas",
      name: "Texas road trip",
      emoji: "🌵",
      summary: "Conference in Austin, then a loop through Hill Country, the West Texas desert and Big Bend, ending in San Antonio. One rental car, no extra flights.",
      pros: ["No internal flights", "Big Bend is spectacular and uncrowded in Nov", "Very varied: art town, desert, canyons, cities"],
      cons: ["Long drives (5-6h) on two days", "Big Bend lodging is limited - book early"],
      legs: [
        { place: "austin", arrive: "2026-11-07", leave: "2026-11-13", pick: "s-atx-airbnb",
          travel: { mode: "flight", text: "Fly into AUS" },
          days: [
            ["Arrive, recover from jet lag", "atx-tacos", "atx-soco"],
            ["atx-barton", "atx-bbq", "atx-bonnell"],
            ["CoRL workshops (Matija)", "Maryna: atx-wildflower"],
            ["CoRL (Matija)", "Maryna: atx-blanton, atx-capitol", "atx-music"],
            ["CoRL (Matija)", "Maryna: atx-kayak"],
            ["CoRL (Matija)", "Evening: celebrate - atx-music"],
          ] },
        { place: "fredericksburg", arrive: "2026-11-13", leave: "2026-11-15", pick: "s-fbg-cottage",
          travel: { mode: "car", text: "Pick up rental car, 1.5h drive", hours: 1.5 },
          days: [["fbg-wine", "Dinner on Main St"], ["fbg-rock (early start)", "fbg-luck"]] },
        { place: "marfa", arrive: "2026-11-15", leave: "2026-11-16", pick: "s-mfa-hotelsaintgeorge",
          travel: { mode: "car", text: "5h drive via I-10", hours: 5 },
          days: [["Drive", "mfa-prada", "mfa-lights / mfa-mcdonald"]] },
        { place: "bigbend", arrive: "2026-11-16", leave: "2026-11-19", pick: "s-bb-willow",
          travel: { mode: "car", text: "1.5h drive; Chinati tour in the morning first", hours: 1.5 },
          days: [["mfa-chinati", "Drive to Terlingua", "bb-terlingua"], ["bb-lostmine", "bb-window"], ["bb-santaelena", "bb-river", "bb-hotsprings?"]] },
        { place: "sanantonio", arrive: "2026-11-19", leave: "2026-11-21", pick: "s-sa-kinglwm",
          travel: { mode: "car", text: "6h drive", hours: 6 },
          days: [["Long drive", "sa-riverwalk"], ["sa-missions", "sa-pearl", "sa-alamo"]] },
      ],
      end: { date: "2026-11-21", text: "Drive to Austin (1.3h) or fly out of SAT" },
    },
    {
      id: "nola",
      name: "Austin → Houston → New Orleans",
      emoji: "🎺",
      summary: "City-and-food version: Space Center in Houston on the way, then 4 nights of music and food in New Orleans. Fly home from MSY.",
      pros: ["Very little driving after Houston", "Amazing food and music", "Easy one-way car or bus/flight"],
      cons: ["Less nature", "Hotels in NOLA pricier on weekends"],
      legs: [
        { place: "austin", arrive: "2026-11-07", leave: "2026-11-13", pick: "s-atx-airbnb",
          travel: { mode: "flight", text: "Fly into AUS" },
          days: [["Arrive", "atx-tacos", "atx-soco"], ["atx-barton", "atx-bbq", "atx-bonnell"], ["CoRL workshops", "Maryna: atx-wildflower"], ["CoRL", "Maryna: atx-blanton"], ["CoRL", "Maryna: atx-hamilton"], ["CoRL", "atx-music"]] },
        { place: "houston", arrive: "2026-11-13", leave: "2026-11-14", pick: "s-hou-museum",
          travel: { mode: "car", text: "2.5h drive (one-way rental)", hours: 2.5 },
          days: [["hou-space", "hou-menil"]] },
        { place: "neworleans", arrive: "2026-11-14", leave: "2026-11-18", pick: "s-nola-marigny",
          travel: { mode: "car", text: "5.5h drive, drop car at MSY", hours: 5.5 },
          days: [["Drive", "nola-frenchmen"], ["nola-beignets", "nola-ww2", "nola-preservation"], ["nola-streetcar", "nola-swamp"], ["nola-brunch", "Bywater & Marigny wander"]] },
      ],
      end: { date: "2026-11-18", text: "Fly out of MSY" },
    },
    {
      id: "southwest",
      name: "Southwest national parks",
      emoji: "🏜️",
      summary: "Fly Austin → Las Vegas, then Zion, Horseshoe Bend/Antelope Canyon, Grand Canyon and Sedona. Fly home from Phoenix.",
      pros: ["The most iconic US landscapes", "November = no summer heat, fewer crowds"],
      cons: ["Extra flight AUS → LAS", "Cold nights at Grand Canyon (can be below 0°C)", "Busiest itinerary"],
      legs: [
        { place: "austin", arrive: "2026-11-07", leave: "2026-11-13", pick: "s-atx-airbnb",
          travel: { mode: "flight", text: "Fly into AUS" },
          days: [["Arrive", "atx-soco"], ["atx-barton", "atx-bbq"], ["CoRL workshops"], ["CoRL"], ["CoRL"], ["CoRL", "atx-music"]] },
        { place: "zion", arrive: "2026-11-13", leave: "2026-11-15", pick: "s-zion-motel",
          travel: { mode: "flight", text: "Fly AUS → LAS (~3h), then 2.5h drive", hours: 2.5 },
          days: [["Flight + drive", "Sunset in Springdale"], ["zion-overlook", "zion-narrows"]] },
        { place: "page", arrive: "2026-11-15", leave: "2026-11-16", pick: "s-page-hotel",
          travel: { mode: "car", text: "2h drive", hours: 2 },
          days: [["page-antelope", "page-horseshoe"]] },
        { place: "grandcanyon", arrive: "2026-11-16", leave: "2026-11-17", pick: "s-gc-eltovar",
          travel: { mode: "car", text: "2.5h via Desert View entrance", hours: 2.5 },
          days: [["Desert View drive", "gc-sunrise (sunset)", "Next morning: sunrise + gc-brightangel"]] },
        { place: "sedona", arrive: "2026-11-17", leave: "2026-11-20", pick: "s-sed-mid",
          travel: { mode: "car", text: "2h drive", hours: 2 },
          days: [["gc-brightangel", "Drive", "sed-chapel"], ["sed-cathedral", "sed-stars"], ["sed-westfork"]] },
      ],
      end: { date: "2026-11-20", text: "2h drive, fly out of PHX" },
    },
    {
      id: "nyc",
      name: "Austin + New York",
      emoji: "🗽",
      summary: "Simplest option: after the conference, fly to NYC for 5 nights of museums, shows and late-fall Central Park.",
      pros: ["No driving at all", "Endless things to do", "Easy connections home"],
      cons: ["Most expensive lodging", "Less 'road trip' feeling"],
      legs: [
        { place: "austin", arrive: "2026-11-07", leave: "2026-11-13", pick: "s-atx-airbnb",
          travel: { mode: "flight", text: "Fly into AUS" },
          days: [["Arrive", "atx-soco"], ["atx-barton", "atx-bbq", "atx-bonnell"], ["CoRL workshops"], ["CoRL"], ["CoRL"], ["CoRL", "atx-music"]] },
        { place: "nyc", arrive: "2026-11-13", leave: "2026-11-18", pick: "s-nyc-lic",
          travel: { mode: "flight", text: "Fly AUS → NYC (~3.5h)" },
          days: [["Arrive", "nyc-highline"], ["nyc-central", "nyc-met", "nyc-broadway"], ["nyc-brooklyn", "nyc-summit"], ["Free day / neighbourhoods", "nyc-jazz"], ["Last museum or shopping"]] },
      ],
      end: { date: "2026-11-18", text: "Fly out of JFK / EWR" },
    },
  ],
};
