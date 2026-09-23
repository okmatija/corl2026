// Single source of truth for the trip. Claude edits this file as plans evolve.
// Prices are rough ESTIMATES (USD per night) for planning only - always check live rates.
window.TRIP = {
  meta: {
    title: "CoRL 2026 · USA trip",
    travellers: ["Matija", "Maryna"],
    updated: "2026-09-23",
    status: "Work dates are confirmed. Everything after Fri 13 Nov (when Matija finishes at 16:00) is a proposal - the end date is a guess.",
  },

  // Matija's work commitments. Maryna is free the whole time.
  obligations: [
    { who: "Matija", title: "CoRL main conference", start: "2026-11-09", end: "2026-11-11", where: "JW Marriott / Hilton Austin / Bass Hall (UT)" },
    { who: "Matija", title: "CoRL workshops + team social (evening)", start: "2026-11-12", end: "2026-11-12" },
    { who: "Matija", title: "Team summit, until 16:00", start: "2026-11-13", end: "2026-11-13" },
  ],

  openQuestions: [
    "Flying from London? Arriving together on Sat 7 Nov?",
    "Latest date to be back home (how long can the holiday part be)?",
    "Maryna, Mon 9 - Fri 13 Nov: stay in Austin with day trips, or a side trip (New Orleans, Houston, San Antonio...)? Vote on the 'Maryna:' idea cards.",
    "OK renting a car for the road trip after the conference, with some 4-6 h driving days?",
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

  // Idea cards. Region groups them on the Ideas page; ideas outside the plan's regions are alternatives to vote on.
  // cat: nature | food | culture | music | city | night | adventure
  ideas: [
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

    // Maryna's options while Matija works (Mon 9 - Fri 13 Nov)
    { id: "mar-nola", place: "neworleans", title: "Maryna: side trip to New Orleans (Mon-Thu)", cat: "adventure", cost: "$$$", dur: "3-4 days", why: "~1.5 h direct flight from Austin. Walkable and easy solo; jazz, food, streetcars. Back in Austin Thu night." },
    { id: "mar-houston", place: "houston", title: "Maryna: 1-2 nights in Houston", cat: "culture", cost: "$$", dur: "1-2 days", why: "~2.5 h by bus. Space Center, Menil Collection, Rothko Chapel, great food." },
    { id: "mar-sa", place: "sanantonio", title: "Maryna: overnight in San Antonio", cat: "culture", cost: "$$", dur: "1-2 days", why: "~1.5 h by bus. River Walk, Mission trail by bike, Pearl district. (Then skip it at the end of the road trip.)" },
    { id: "mar-wine", place: "fredericksburg", title: "Maryna: Hill Country wine day tour", cat: "food", cost: "$$", dur: "1 day", why: "Guided tours leave from Austin - no car needed." },
    { id: "mar-food", place: "austin", title: "Maryna: Austin food tour or cooking class", cat: "food", cost: "$$", dur: "3h", why: "Nice way to meet people solo; lots of options on East 6th / South Congress." },

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

  // THE plan. A leg = where you sleep between arrive (check-in) and leave (check-out).
  // days[k] = items for the k-th day of the leg; idea ids are expanded to their titles on the page.
  plan: {
    name: "Texas road trip",
    summary: "A weekend together in Austin, then Maryna explores while Matija works (Mon-Fri). From Friday evening: a road trip through Hill Country, the West Texas desert and Big Bend, ending in San Antonio.",
    budgetPerNight: 200,
    legs: [
      { place: "austin", arrive: "2026-11-07", leave: "2026-11-13",
        travel: "✈️ Fly into Austin (AUS) together",
        stay: { name: "Downtown hotel near the venues", covered: true, notes: "Paid by Matija's work for 7-13 Nov. Check that Maryna can share the room." },
        days: [
          ["Arrive, recover from jet lag", "atx-tacos", "atx-soco"],
          ["Together: atx-barton", "atx-bbq", "atx-bonnell"],
          ["Maryna: atx-wildflower", "Evening together: atx-music"],
          ["Maryna: atx-blanton, atx-capitol"],
          ["Maryna: atx-kayak or a side trip (see Ideas)"],
          ["mar-food"],
        ] },
      { place: "fredericksburg", arrive: "2026-11-13", leave: "2026-11-15",
        travel: "🚗 Pick up rental car; leave Austin after 16:00 · 1.5 h drive",
        stay: { name: "Guesthaus / cottage near Main St", price: 180, notes: "" },
        days: [["Drive after work", "Late dinner on Main St"], ["fbg-rock (early start)", "fbg-wine", "fbg-luck"]] },
      { place: "marfa", arrive: "2026-11-15", leave: "2026-11-16",
        travel: "🚗 5 h drive via I-10",
        stay: { name: "Hotel Saint George", price: 260, notes: "Few rooms in Marfa - book early. Budget alt: motel in Alpine ~$110." },
        days: [["mfa-prada", "mfa-lights or mfa-mcdonald"]] },
      { place: "bigbend", arrive: "2026-11-16", leave: "2026-11-19",
        travel: "🚗 1.5 h drive (after a morning Chinati tour)",
        stay: { name: "Casita / tiny house in Terlingua", price: 150, notes: "Chisos Mountains Lodge (in park, ~$200) books out months ahead." },
        days: [["mfa-chinati", "Drive to Terlingua", "bb-terlingua"], ["bb-lostmine", "bb-window"], ["bb-santaelena", "bb-river", "bb-hotsprings"]] },
      { place: "sanantonio", arrive: "2026-11-19", leave: "2026-11-21",
        travel: "🚗 6 h drive",
        stay: { name: "Airbnb in King William district", price: 140, notes: "Walkable to the River Walk." },
        days: [["Long drive", "sa-riverwalk"], ["sa-missions", "sa-pearl", "sa-alamo"]] },
    ],
    end: { date: "2026-11-21", text: "Fly home from San Antonio (SAT) - the end date is a guess" },
  },
};
