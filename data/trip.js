// Single source of truth for the trip. Claude edits this file as plans evolve.
// Prices are rough ESTIMATES (USD per night) for planning only - always check live rates.
window.TRIP = {
  meta: {
    title: "CoRL 2026 · USA trip",
    travellers: ["Matija", "Maryna"],
    updated: "2026-09-24T13:24Z",
    status: "Work dates are confirmed. After Fri 13 Nov (Matija done at 16:00) this is a two-week proposal, flying home Fri 27 Nov - see the open questions.",
  },

  // Matija's work commitments. Maryna is free the whole time.
  obligations: [
    { who: "Matija", title: "CoRL main conference", start: "2026-11-09", end: "2026-11-11", where: "JW Marriott / Hilton Austin / Bass Hall (UT)" },
    { who: "Matija", title: "CoRL workshops + team social (evening)", start: "2026-11-12", end: "2026-11-12" },
    { who: "Matija", title: "Team summit, until 16:00", start: "2026-11-13", end: "2026-11-13" },
  ],

  openQuestions: [
    "Warm leg after Texas: Florida (Miami + Keys, as now in the plan), or San Diego / Puerto Rico instead? Vote on the 'Warm alternative' cards or answer here.",
    "Thanksgiving with Maja & Amit (Thu 26 Nov, they're in Cobble Hill, Brooklyn - we'll stay nearby, not with them): dinner at their place (bring something?) or a restaurant (book by October)? And do we want a 3rd night in New York to have more time with them and a less rushed morning at the 9/11 Memorial & Museum before the Fri 27 Nov flight home (it currently fits on departure morning, but only if we don't linger)?",
    "Maryna, Mon 9 - Fri 13 Nov: stay in Austin with day trips, or a side trip (New Orleans, Houston, San Antonio...)? Vote on the 'Maryna:' idea cards.",
    "OK renting a car for the road trip after the conference, with some 4-6 h driving days?",
    "SpaceX: with Florida in the plan, we could swap a Keys day for the Space Coast if a launch is scheduled then (I'll check the schedule nearer the time). Interested?",
    "Vegas: where should it go? Options: (a) swap Key West for 3 nights in Vegas (Sphere + Valley of Fire), flying Austin/San Antonio -> Vegas; (b) replace all of Florida with Vegas + the Grand Canyon; (c) add Vegas at the end and fly home a few days later.",
    "NASCAR: the Cup championship race is Sun 8 Nov at Homestead-Miami - the day before CoRL. Tickets are on sale now (~$100-250pp estimate for a good grandstand seat, more for premium/hospitality). Checked flights: American has a 9:45pm nonstop Miami -> Austin (backup 10:13pm) landing well before Monday's conference start, so it's logistically doable if we fly into Miami first (Fri 6 Nov) - tight on race day (leave right after the trophy presentation), but workable. Worth it, or do the Texas Motor Speedway drive/ride-along (Fort Worth, a full day) instead?",
    "Theme parks: add Orlando (Disney World / Universal) to the Florida leg? It would take 2-3 nights, e.g. from Key West or NYC.",
    "Concerts: the bands we grew up with (Linkin Park, AC/DC, Iron Maiden, Foo Fighters, Okean Elzy) aren't touring the US in November 2026. Metallica at the Sphere is the big exception, but it needs Vegas. Should I keep checking for new announcements, or is it worth building Vegas in for Metallica?",
    "Flights: Matija might fly business (BA Club Suite, London → Austin nonstop). Should Maryna fly business too, both take premium economy together, or split cabins on the same flight? See the 📜 Details on the London → Austin card.",
    "Any must-sees already on your list?",
  ],

  // type: city | nature | beach  (shown as 🏙️ / 🌲 / 🏖️ on the Ideas page). Names always end with ", <state>".
  places: {
    austin:         { name: "Austin, TX",                  type: "city",   lat: 30.2672, lng: -97.7431,  blurb: "Live music, tacos & BBQ, swimming holes. Conference base." },
    fredericksburg: { name: "Fredericksburg, TX",          type: "nature", lat: 30.2752, lng: -98.8720,  blurb: "German-Texan Hill Country town, wineries, Enchanted Rock." },
    marfa:          { name: "Marfa, TX",                   type: "nature", lat: 30.3094, lng: -104.0206, blurb: "Tiny high-desert art town, Donald Judd, dark skies." },
    bigbend:        { name: "Big Bend National Park, TX",  type: "nature", lat: 29.3214, lng: -103.6160, blurb: "Remote desert and canyon national park on the Rio Grande (stay in Terlingua)." },
    sanantonio:     { name: "San Antonio, TX",             type: "city",   lat: 29.4241, lng: -98.4936,  blurb: "River Walk, Spanish missions (UNESCO), Pearl district." },
    houston:        { name: "Houston, TX",                 type: "city",   lat: 29.7604, lng: -95.3698,  blurb: "Space Center, Menil & Rothko Chapel, great food." },
    starbase:       { name: "Starbase & South Padre, TX",  type: "beach",  lat: 25.9971, lng: -97.1560,  blurb: "SpaceX Starship site at Boca Chica, next to the Gulf beaches of South Padre Island." },
    neworleans:     { name: "New Orleans, LA",             type: "city",   lat: 29.9511, lng: -90.0715,  blurb: "Jazz, Creole food, architecture, swamps." },
    miami:          { name: "Miami, FL",                   type: "beach",  lat: 25.7617, lng: -80.1918,  blurb: "~27°C in November. South Beach, Art Deco, Cuban food; the Everglades next door." },
    keywest:        { name: "Key West, FL",                type: "beach",  lat: 24.5551, lng: -81.7800,  blurb: "End of the Overseas Highway: reefs, sunsets, pastel Old Town. ~27°C in November." },
    spacecoast:     { name: "Space Coast, FL",             type: "beach",  lat: 28.3922, lng: -80.6077,  blurb: "Cape Canaveral / Kennedy Space Center - the busiest launch site in the US." },
    sandiego:       { name: "San Diego, CA",               type: "beach",  lat: 32.7157, lng: -117.1611, blurb: "~21°C and sunny in November; beaches, La Jolla, Balboa Park." },
    sanjuan:        { name: "San Juan, PR",                type: "beach",  lat: 18.4655, lng: -66.1057,  blurb: "Puerto Rico: ~29°C, Old San Juan, rainforest, bioluminescent bays. US territory (ESTA works)." },
    fortworth:      { name: "Fort Worth, TX",              type: "city",   lat: 32.7555, lng: -97.3308,  blurb: "Cowboy town: Stockyards cattle drives, rodeo, and Texas Motor Speedway just north." },
    orlando:        { name: "Orlando, FL",                 type: "city",   lat: 28.5384, lng: -81.3789,  blurb: "Theme park capital: Walt Disney World, Universal & Epic Universe; an hour from the Space Coast." },
    anaheim:        { name: "Anaheim (Disneyland), CA",    type: "city",   lat: 33.8121, lng: -117.9190, blurb: "The original Disneyland; pairs with a San Diego warm leg (1.5 h away)." },
    lasvegas:       { name: "Las Vegas, NV",               type: "city",   lat: 36.1699, lng: -115.1398, blurb: "Gateway airport for the parks; Red Rock & Valley of Fire nearby." },
    zion:           { name: "Zion National Park, UT",      type: "nature", lat: 37.1889, lng: -112.9986, blurb: "Towering red canyon walls, iconic hikes (stay in Springdale)." },
    page:           { name: "Page, AZ",                    type: "nature", lat: 36.9147, lng: -111.4558, blurb: "Horseshoe Bend, Antelope Canyon, Lake Powell." },
    grandcanyon:    { name: "Grand Canyon South Rim, AZ",  type: "nature", lat: 36.0544, lng: -112.1401, blurb: "Needs no introduction. Sunrise & sunset on the rim." },
    sedona:         { name: "Sedona, AZ",                  type: "nature", lat: 34.8697, lng: -111.7610, blurb: "Red rock hiking, late fall colours in Oak Creek Canyon." },
    phoenix:        { name: "Phoenix, AZ",                 type: "city",   lat: 33.4484, lng: -112.0740, blurb: "Departure airport (PHX)." },
    nyc:            { name: "New York City, NY",           type: "city",   lat: 40.7128, lng: -74.0060,  blurb: "Museums, Broadway, late-fall Central Park - and Thanksgiving on Thu 26 Nov." },
  },


  // Idea cards. Region groups them on the Ideas page; ideas outside the plan's regions are alternatives to vote on.
  // cat: nature | food | culture | music | city | night | adventure. Optional link: official website / booking page.
  ideas: [
    // Austin
    { id: "atx-barton", place: "austin", title: "Swim at Barton Springs Pool", cat: "nature", cost: "$", dur: "2h", why: "Spring-fed pool at ~20°C all year - locals swim in November too." },
    { id: "atx-soco", place: "austin", title: "South Congress stroll", cat: "city", cost: "free", dur: "2h", why: "Shops, murals, 'I love you so much' wall, view of the Capitol." },
    { id: "atx-bbq", place: "austin", title: "Texas BBQ (Franklin / la Barbecue / Terry Black's)", cat: "food", cost: "$$", dur: "2-4h", why: "Franklin needs a morning queue; Terry Black's is walk-in and good." },
    { id: "atx-tacos", place: "austin", title: "Breakfast tacos crawl", cat: "food", cost: "$", dur: "1h", why: "Veracruz All Natural migas taco is a local classic." },
    { id: "atx-capitol", place: "austin", title: "Texas State Capitol", cat: "culture", cost: "free", dur: "1h", why: "Free tours, bigger than the US Capitol (Texans will tell you)." },
    { id: "atx-bonnell", place: "austin", title: "Sunset at Mount Bonnell", cat: "nature", cost: "free", dur: "1h", why: "Short climb, best sunset over Lake Austin." },
    { id: "atx-kayak", place: "austin", title: "Kayak / SUP on Lady Bird Lake", cat: "nature", cost: "$", dur: "2h", why: "Skyline views from the water, rentals near Zilker." },
    { id: "atx-stubbs", place: "austin", title: "Rock show at Stubb's or Mohawk", cat: "music", cost: "$$", dur: "evening", why: "Austin's classic outdoor rock stages. November line-ups are announced late - check what's on during CoRL week." },
    { id: "atx-music", place: "austin", title: "Live music: Continental Club / Broken Spoke", cat: "music", cost: "$", dur: "evening", why: "Broken Spoke gives two-step lessons - great post-conference night." },
    { id: "atx-wildflower", place: "austin", title: "Lady Bird Johnson Wildflower Center", cat: "nature", cost: "$", dur: "2-3h", why: "Good solo day for Maryna during the conference." },
    { id: "atx-blanton", place: "austin", title: "Blanton Museum + Ellsworth Kelly's 'Austin'", cat: "culture", cost: "$", dur: "2h", why: "Kelly's light-filled chapel is a must for art fans." },
    { id: "atx-hamilton", place: "austin", title: "Hamilton Pool Preserve", cat: "nature", cost: "$", dur: "half day", why: "Collapsed grotto with waterfall; reservation required - check if open." },
    { id: "atx-lbj", place: "austin", title: "LBJ Presidential Library", cat: "culture", cost: "$", dur: "2h", why: "On the UT campus right next to Bass Hall (a CoRL venue). Daytime museum hours - no evening opening, check times before going." },
    { id: "atx-mckinney", place: "austin", title: "McKinney Falls State Park", cat: "nature", cost: "$", dur: "half day", why: "Waterfalls, limestone pools and cypress trails 20 min from downtown. Book a day pass." },
    { id: "atx-greenbelt", place: "austin", title: "Barton Creek Greenbelt hike", cat: "nature", cost: "free", dur: "2-3h", why: "Wooded canyon trail starting right by Barton Springs; creek may be dry in Nov." },
    { id: "atx-bats", place: "austin", title: "Congress Avenue bat bridge", cat: "nature", cost: "free", dur: "30m", why: "Season is Mar-Oct; by November most bats have left - low odds." },
    { id: "atx-zilker", place: "austin", title: "Zilker Botanical Garden", cat: "nature", cost: "$", dur: "1-2h", why: "Japanese Garden, cactus and rose gardens right by Zilker Park - a quieter option than Barton Springs." },

    // Maryna's options while Matija works (Mon 9 - Fri 13 Nov)
    { id: "mar-nola", place: "neworleans", title: "Maryna: side trip to New Orleans (Mon-Thu)", cat: "adventure", cost: "$$$", dur: "3-4 days", why: "~1.5 h direct flight from Austin. Walkable and easy solo; jazz, food, streetcars. Back in Austin Thu night." },
    { id: "mar-houston", place: "houston", title: "Maryna: 1-2 nights in Houston", cat: "culture", cost: "$$", dur: "1-2 days", why: "~2.5 h by bus. Space Center, Menil Collection, Rothko Chapel, great food." },
    { id: "mar-sa", place: "sanantonio", title: "Maryna: overnight in San Antonio", cat: "culture", cost: "$$", dur: "1-2 days", why: "~1.5 h by bus. River Walk, Mission trail by bike, Pearl district. (Then skip it at the end of the road trip.)" },
    { id: "mar-wine", place: "fredericksburg", title: "Maryna: Hill Country wine day tour", cat: "food", cost: "$$", dur: "1 day", why: "Guided tours leave from Austin - no car needed." },
    { id: "mar-food", place: "austin", title: "Maryna: Austin food tour or cooking class", cat: "food", cost: "$$", dur: "3h", why: "Nice way to meet people solo; lots of options on East 6th / South Congress." },

    // Warm places (November)
    { id: "mia-southbeach", place: "miami", title: "South Beach & the Art Deco district", cat: "city", cost: "free", dur: "half day", why: "Swim, people-watch on Ocean Drive, pastel 1930s hotels. Sea is still ~26°C." },
    { id: "mia-wynwood", place: "miami", title: "Wynwood Walls street art", cat: "culture", cost: "$", dur: "2h", why: "Huge outdoor mural park plus galleries, breweries and cafés around it." },
    { id: "mia-havana", place: "miami", title: "Little Havana (Calle Ocho)", cat: "food", cost: "$", dur: "2-3h", why: "Cuban coffee, sandwiches, domino park, live music at Ball & Chain." },
    { id: "mia-everglades", place: "miami", title: "Everglades: Shark Valley bike loop or airboat", cat: "nature", cost: "$$", dur: "half day", why: "Alligators, herons and sawgrass; Shark Valley's 15-mile loop by rental bike is the classic. Easy stop on the way to the Keys." },
    { id: "kw-highway", place: "keywest", title: "Drive the Overseas Highway", cat: "adventure", cost: "free", dur: "4h", why: "113 miles of bridges over turquoise water; stop at Islamorada and Bahia Honda beach." },
    { id: "kw-sunset", place: "keywest", title: "Sunset at Mallory Square", cat: "night", cost: "free", dur: "1-2h", why: "Nightly street-performer sunset party." },
    { id: "kw-snorkel", place: "keywest", title: "Reef snorkel trip", cat: "nature", cost: "$$", dur: "half day", why: "The only living coral barrier reef in the continental US." },
    { id: "kw-oldtown", place: "keywest", title: "Old Town by bike + Hemingway House", cat: "culture", cost: "$", dur: "half day", why: "Flat, pastel streets; the six-toed cats at Hemingway's house." },
    { id: "kw-tortugas", place: "keywest", title: "Dry Tortugas National Park day trip", cat: "nature", cost: "$$$", dur: "full day", why: "Ferry to a 19th-century fort on a remote island with great snorkelling. Books out - reserve early." },
    { id: "sd-coast", place: "sandiego", title: "Warm alternative: San Diego (La Jolla, beaches, Balboa Park)", cat: "nature", cost: "$$", dur: "3-4 days", why: "Dry, sunny ~21°C; sea lions at La Jolla Cove, coastal walks, great tacos. Direct flights from Texas." },
    { id: "pr-island", place: "sanjuan", title: "Warm alternative: Puerto Rico (Old San Juan, El Yunque, bio bay)", cat: "adventure", cost: "$$", dur: "3-4 days", why: "Hottest option (~29°C): colourful old town, rainforest hikes, kayaking a glowing bioluminescent bay." },

    // Alligators
    { id: "gator-brazos", place: "houston", title: "Alligators at Brazos Bend State Park", cat: "nature", cost: "$", dur: "half day", why: "~1 h from Houston; 250-350 big gators around Elm Lake and 40-Acre Lake, and Sep-Nov is peak viewing. Best on a sunny morning when they bask." },
    { id: "gator-nola-swamp", place: "neworleans", title: "Honey Island Swamp boat tour", cat: "nature", cost: "$$", dur: "half day", why: "Small-boat tour into a protected cypress swamp (not an airboat park); gators get less active as it cools, so pick a warm day." },
    { id: "gator-nola-barataria", place: "neworleans", title: "Jean Lafitte Barataria Preserve boardwalk", cat: "nature", cost: "free", dur: "2-3h", why: "Free National Park boardwalk through swamp 30 min from the French Quarter; gators and herons on warm days." },
    { id: "gator-gatorland", place: "orlando", title: "Gatorland", cat: "adventure", cost: "$$", dur: "half day", why: "Classic Florida gator park with thousands of alligators, breeding marsh boardwalk and a zipline over the pens." },
    { id: "gator-bigcypress", place: "miami", title: "Gator spotting on Loop Road / Big Cypress", cat: "nature", cost: "free", dur: "half day", why: "Wild alligators line the canals along the Tamiami Trail - pairs with Shark Valley in the Everglades." },

    // Theme parks
    { id: "park-disneyworld", place: "orlando", title: "Walt Disney World (Magic Kingdom / EPCOT)", cat: "adventure", cost: "$$$", dur: "1-2 days", why: "The big one. Mid-November before Thanksgiving is a relatively quiet week; Thanksgiving week itself is very busy." },
    { id: "park-universal", place: "orlando", title: "Universal Orlando + Epic Universe", cat: "adventure", cost: "$$$", dur: "1-2 days", why: "Harry Potter worlds, big coasters; Epic Universe (opened 2025) is the newest theme park in the US." },
    { id: "park-kennedy", place: "spacecoast", title: "Kennedy Space Center Visitor Complex", cat: "culture", cost: "$$", dur: "full day", why: "Space Shuttle Atlantis, Saturn V, astronaut encounters - and a launch if the timing works. 1 h from Orlando." },
    { id: "park-disneyland", place: "anaheim", title: "Disneyland Resort", cat: "adventure", cost: "$$$", dur: "1-2 days", why: "The original park + California Adventure; an easy add-on if we pick San Diego as the warm leg." },
    { id: "park-fiesta", place: "sanantonio", title: "Six Flags Fiesta Texas", cat: "adventure", cost: "$$", dur: "full day", why: "Big coasters in an old quarry. Heads-up: 'Holiday in the Park' only starts 21 Nov, so it's probably closed on our San Antonio day - check the calendar." },

    // NASCAR / motorsport
    { id: "nascar-tms", place: "fortworth", title: "Drive (or ride in) a NASCAR stock car at Texas Motor Speedway", cat: "adventure", cost: "$$$", dur: "half day", why: "Ride-alongs at up to ~160 mph or drive yourself in timed sessions on the 1.5-mile oval. Fort Worth is ~3 h from Austin - would need a dedicated day." },
    { id: "nascar-stockyards", place: "fortworth", title: "Fort Worth Stockyards cattle drive + rodeo", cat: "culture", cost: "$", dur: "half day", why: "Longhorns walk the street twice a day; Friday/Saturday night rodeo. Pairs with the Speedway for a 'very Texas' day." },
    { id: "nascar-cota", place: "austin", title: "Circuit of the Americas (COTA)", cat: "adventure", cost: "$$", dur: "half day", why: "Austin's F1/NASCAR circuit, 20 min from downtown. Easiest evening drop-in is Speed City (karting + mini-golf + zipline, ~$25-40pp estimate karting); COTA Driving Experience (~$1,837pp estimate) and Xtreme Xperience supercar rides (from ~$99pp estimate) are pricier day-session bookings, not evening drop-ins. No F1 or NASCAR Cup race clashes in Nov 2026 (F1 is in October); Schnell Fest club racing runs Nov 11-12 (daytime, may mean extra track traffic those days). Sources disagree on exact evening hours - confirm nearer the time." },
    { id: "nascar-final", place: "miami", title: "NASCAR Cup championship race, Homestead-Miami (Sun 8 Nov)", cat: "adventure", cost: "$$-$$$", dur: "full day", why: "The 2026 season finale, 45 min from Miami. Tickets already on sale, ~$100-250pp estimate for a good grandstand seat (premium/hospitality $250-500+pp). Race should end ~7:30-8:30pm; American has a 9:45pm Miami -> Austin nonstop (backup 10:13pm) landing well before Monday's conference start - tight but doable if we head straight to the airport after the trophy presentation. Clashes with our Austin weekend - only works if we fly into Miami first (see open questions)." },

    // Space / rockets
    { id: "space-starbase", place: "starbase", title: "SpaceX Starbase (Starship) + South Padre beaches", cat: "adventure", cost: "$", dur: "1-2 days", why: "~5 h drive from San Antonio. You can see the Starship towers from the road/beach any time; a launch is a bonus - dates are only set weeks ahead and slip often." },
    { id: "space-cape", place: "spacecoast", title: "Watch a Falcon 9 launch on the Space Coast", cat: "adventure", cost: "$$", dur: "2-3 days", why: "The most reliable way to see a SpaceX launch: several per week in 2026. Fly to Orlando; watch from Playalinda Beach or Jetty Park, plus Kennedy Space Center visitor complex." },
    { id: "space-mcgregor", place: "austin", title: "SpaceX McGregor engine test site (drive-by)", cat: "adventure", cost: "free", dur: "half day", why: "1.5 h north of Austin near Waco. No tours or launches - only engine tests you may hear from outside. Low odds, fun detour with Waco's Magnolia/Dr Pepper museum." },

    // Fredericksburg / Hill Country
    { id: "fbg-rock", place: "fredericksburg", title: "Hike Enchanted Rock", cat: "nature", cost: "$", dur: "3h", why: "Huge pink granite dome; book a state-park day pass in advance." },
    { id: "fbg-wine", place: "fredericksburg", title: "Hill Country wineries on Hwy 290", cat: "food", cost: "$$", dur: "half day", why: "Dozens of tasting rooms; designate a driver or book a shuttle." },
    { id: "fbg-pedernales", place: "fredericksburg", title: "Pedernales Falls State Park", cat: "nature", cost: "$", dur: "3h", why: "Tiered limestone falls in the Hill Country; an easy stop on the way to or from Fredericksburg." },
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
    { id: "bb-stars", place: "bigbend", title: "Stargazing in Big Bend (Dark Sky Park)", cat: "nature", cost: "free", dur: "1-2h", why: "One of the darkest places in the lower 48 - just lie back anywhere away from lights." },
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
    { id: "lv-sphere-metallica", place: "lasvegas", title: "Metallica 'Life Burns Faster' at the Sphere", cat: "music", cost: "$$$", dur: "evening", why: "Residency runs 1 Oct 2026 - 13 Mar 2027, so it overlaps our dates. Shows sell out - check dates and book early." },
    { id: "lv-sphere-oz", place: "lasvegas", title: "The Wizard of Oz at Sphere", cat: "night", cost: "$$", dur: "2h", why: "The fully immersive version of the film on the 16K wraparound screen with wind and effects; usually daily at 11am, 2pm, 5pm and 8pm." },
    { id: "lv-fountains", place: "lasvegas", title: "The Strip at night + Bellagio fountains", cat: "city", cost: "free", dur: "evening", why: "Free fountain show every 15-30 min after dark; walk from Caesars to the Cosmopolitan." },
    { id: "lv-fremont", place: "lasvegas", title: "Fremont Street & old downtown", cat: "night", cost: "free", dur: "2-3h", why: "Old-Vegas casinos under the LED canopy, zipline overhead, cheaper drinks." },
    { id: "lv-cirque", place: "lasvegas", title: "Cirque du Soleil 'O' at Bellagio", cat: "night", cost: "$$$", dur: "2h", why: "The classic water show - one of the best productions in Vegas." },
    { id: "lv-valleyfire", place: "lasvegas", title: "Valley of Fire State Park", cat: "nature", cost: "$", dur: "half day", why: "1 h from the Strip: glowing red sandstone, Fire Wave hike; perfect November temperatures." },
    { id: "lv-hoover", place: "lasvegas", title: "Hoover Dam + bypass bridge walk", cat: "culture", cost: "$", dur: "half day", why: "45 min away; walk the bridge for the classic view down onto the dam." },
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
    { id: "nyc-rock", place: "nyc", title: "Thanksgiving Eve rock show (Beacon Theatre / Irving Plaza / Brooklyn Steel)", cat: "music", cost: "$$", dur: "evening", why: "The night before Thanksgiving is a big going-out night; classic and alt-rock acts often play these venues. Check listings nearer the time." },
    { id: "nyc-veselka", place: "nyc", title: "Veselka + the East Village's Ukrainian corner", cat: "food", cost: "$", dur: "2h", why: "Legendary Ukrainian diner (varenyky, borscht) at the heart of Little Ukraine; the Ukrainian Museum is a few blocks away." },
    { id: "nyc-jazz", place: "nyc", title: "Village Vanguard jazz", cat: "music", cost: "$$", dur: "evening", why: "Legendary basement club." },
    { id: "nyc-summit", place: "nyc", title: "Top of the Rock or SUMMIT at sunset", cat: "city", cost: "$$", dur: "2h", why: "Top of the Rock has the Empire State in view." },
    { id: "nyc-911memorial", place: "nyc", link: "https://www.911memorial.org/visit/visit-museum-1", title: "9/11 Memorial & Museum", cat: "culture", cost: "$$", dur: "half day", why: "Outdoor Memorial is free, daily 8am-8pm. Museum (~$33pp estimate) is open Wed-Mon 9am-7pm, last entry 5:30pm (closed Tuesdays) - but closed on Thanksgiving Day itself. Book timed tickets online up to 6 months ahead; first-come first-served tickets release Mondays 7am ET." },
  ],

  // Austin map page (#austin). Coordinates are approximate; the map links search by address.
  // Hotel prices are rough estimates for CoRL week - check live rates / the CoRL hotel portal.
  austinMap: {
    work: [
      { name: "JW Marriott Austin (CoRL venue)", address: "110 E 2nd St, Austin, TX 78701", lat: 30.2649, lng: -97.7441 },
      { name: "Hilton Austin (CoRL venue)", address: "500 E 4th St, Austin, TX 78701", lat: 30.2654, lng: -97.7389 },
      { name: "Bass Concert Hall, UT (CoRL venue)", address: "2350 Robert Dedman Dr, Austin, TX 78712", lat: 30.2858, lng: -97.7310 },
      { name: "Google Austin office (team summit)", address: "500 W 2nd St, Austin, TX 78701", lat: 30.2663, lng: -97.7497 },
    ],
    hotels: [
      { name: "JW Marriott Austin", address: "110 E 2nd St, Austin, TX 78701", lat: 30.2649, lng: -97.7441, price: 380, run: "~8 min jog to the Lady Bird Lake trail via Congress Ave. Fine, but you cross a few downtown blocks first.", note: "Is a venue - zero commute." },
      { name: "Hilton Austin", address: "500 E 4th St, Austin, TX 78701", lat: 30.2654, lng: -97.7389, price: 330, run: "~10 min to the lake trail via Rainey St; Waterloo Park is close for short loops.", note: "Is a venue." },
      { name: "Hyatt Place Austin Downtown", address: "211 E 3rd St, Austin, TX 78701", lat: 30.2644, lng: -97.7428, price: 240, run: "~6 min to the lake trail.", note: "Between the two downtown venues." },
      { name: "Hampton Inn & Suites Austin Downtown", address: "200 San Jacinto Blvd, Austin, TX 78701", lat: 30.2636, lng: -97.7422, price: 230, run: "~4 min to the lake trail.", note: "" },
      { name: "The LINE Austin", address: "111 E Cesar Chavez St, Austin, TX 78701", lat: 30.2629, lng: -97.7436, price: 300, run: "⭐ Best for running: the Butler Hike-and-Bike Trail is across the street and busy with runners from about 6am.", note: "On Lady Bird Lake - good for Maryna's lake days." },
      { name: "Fairmont Austin", address: "101 Red River St, Austin, TX 78701", lat: 30.2618, lng: -97.7386, price: 340, run: "⭐ Very good: ~3 min to the trail at the Rainey St end.", note: "" },
      { name: "Hotel Van Zandt", address: "605 Davis St, Austin, TX 78701", lat: 30.2596, lng: -97.7389, price: 330, run: "⭐ Very good: ~3 min to the trail. Rainey St is noisy late at night, but quiet at dawn.", note: "Rainey St - lively evenings." },
      { name: "AT&T Hotel (UT campus)", address: "1900 University Ave, Austin, TX 78705", lat: 30.2818, lng: -97.7401, price: 250, run: "The lake trail is ~3 km away; better for shorter loops around the UT campus or the Shoal Creek trail.", note: "Walk to Bass Hall and the LBJ Library." },
      { name: "Hotel San José", address: "1316 S Congress Ave, Austin, TX 78704", lat: 30.2513, lng: -97.7490, price: 300, run: "⭐ Good: ~10 min down South Congress to the south shore of the trail (Butler Park). Lively, safe neighbourhood.", note: "South Congress - nicest area for Maryna, 10 min ride." },
    ],
  },

  // "📜 Details" pages, keyed like plan feedback targets ("stop:<place>", "travel:<place>", "travel:home"), plus
  // "stay:<place>" (the stop's place to stay) and "idea:<idea id>" (shows 📜 Details on that idea card).
  // Stops, journeys and stays without an entry get an automatic page built from the plan.
  // Either { href } to an existing page, or { title, intro, sections: [{ title, items: [{ name, text, link }] }] }.
  // Prices are estimates. Any stop or travel card with an entry here gets a Details button.
  details: {
    "stop:austin": { href: "#austin" },
    "stay:austin": { href: "#austin" },
    "travel:austin": {
      title: "✈️ Flights London → Austin (Sat 7 Nov)",
      intro: "British Airways is the only nonstop: Heathrow → Austin in about 10.5 hours, roughly 11-14 flights a week, leaving Heathrow late morning to mid-afternoon and landing in Austin the same afternoon/evening. Virgin Atlantic stopped flying this route in January 2024.",
      sections: [
        { title: "Nonstop - British Airways (LHR → AUS)", items: [
          { name: "Economy", text: "Comparison sites show London → Austin return from roughly £450 (estimate; November is usually one of the cheaper months for transatlantic flights).", link: "https://www.kayak.co.uk/flight-routes/London-Heathrow-LHR/Austin-Bergstrom-AUS" },
          { name: "Business - Club Suite", text: "Fully flat seat with a door and direct aisle access. Business fares on Austin-London have been seen from about $2,600 return, but published fares are often much higher (~$4,500) - worth tracking prices, using Avios, or bidding for an upgrade.", link: "https://www.britishairways.com/content/flights/usa/texas/austin" },
          { name: "Premium Economy (World Traveller Plus)", text: "A middle ground if you want to sit together in more comfort: wider seat, more recline, better food - usually well below business fares." },
        ] },
        { title: "Business for Matija, Maryna too?", items: [
          { name: "Options", text: "Both economy; both premium economy; or Matija in Club Suite and Maryna in economy or premium (same flight, different cabins). If Matija's ticket is booked through work, check which cabin the travel policy allows. See the open question on the Plan page." },
        ] },
        { title: "One-stop alternatives (cheaper, longer)", items: [
          { name: "Via a US hub", text: "American (via Dallas), United (via Houston/Chicago) or Delta (via Atlanta) - typically 14-16 hours door to door. Only worth it if much cheaper or for the airline's lounge/status." },
        ] },
        { title: "Before you fly", items: [
          { name: "Entry to the US", text: "UK passports need an approved ESTA (apply online, well before travel). Other passports may need a US visa instead, which can take months - check each passport's requirements early.", link: "https://esta.cbp.dhs.gov/" },
          { name: "Arriving at AUS", text: "Austin airport is ~20 minutes from downtown by Uber/taxi." },
        ] },
      ],
    },
    "travel:home": {
      title: "✈️ Flights New York → London (Fri 27 Nov)",
      intro: "Plenty of nonstops from JFK and Newark: British Airways, Virgin Atlantic, American, Delta, United and JetBlue. Evening departures (roughly 6-11 pm) land in London the next morning after ~7 hours.",
      sections: [
        { title: "Choosing a flight", items: [
          { name: "Evening flight (the plan)", text: "Leaves time for the 9/11 Museum or the Met in the morning. Allow ~1-1.5 h to JFK/Newark from Brooklyn or Midtown, more on the Friday after Thanksgiving." },
          { name: "Business on the way home", text: "An overnight flight is where a flat bed helps most - BA Club Suite, Virgin Upper Class and others fly this route. Same options as the outbound: same cabin together, or split cabins." },
        ] },
        { title: "Heads-up", items: [
          { name: "Thanksgiving weekend", text: "The Friday after Thanksgiving is busy and pricier - book early, and check whether an open-jaw ticket (London → Austin, New York → London) is cheaper than two one-ways." },
        ] },
      ],
    },
    "travel:fredericksburg": {
      title: "🚗 Car hire for the Texas road trip",
      intro: "One rental covers Fri 13 - Fri 20 Nov: pick up in Austin after the team summit, drop off at San Antonio airport before the flight to Miami. Avis and Budget are the same company (Avis Budget Group) and both have desks at both airports.",
      sections: [
        { title: "Pick up - Fri 13 Nov, after 16:00", items: [
          { name: "Avis / Budget - Austin airport (AUS)", text: "The safe choice: the airport rental centre stays open late, so a pickup after the 16:00 summit finish is easy. ~20 min by Uber from downtown.", link: "https://www.budget.com/en/locations/us/tx/austin/aus" },
          { name: "📍 Map: Austin airport rental centre", text: "Consolidated Rental Car Facility at Austin-Bergstrom (AUS).", link: "https://www.google.com/maps/search/?api=1&query=Avis%20Budget%20Rental%20Car%20Center%2C%20Austin-Bergstrom%20International%20Airport%2C%20Austin%2C%20TX" },
          { name: "Budget - Downtown (1104 N I-35 at 11th St)", text: "Closest to the venues but open only until 18:00 on weekdays - tight after a 16:00 finish.", link: "https://www.budget.com/en/locations/us/tx/austin/a2s" },
          { name: "📍 Map: Budget Downtown", text: "1104 N I-35 at 11th St, Austin, TX.", link: "https://www.google.com/maps/search/?api=1&query=Budget%20Car%20Rental%2C%201104%20N%20I-35%2C%20Austin%2C%20TX%2078702" },
        ] },
        { title: "Drop off - Fri 20 Nov", items: [
          { name: "Avis / Budget - San Antonio airport (SAT)", text: "Return before the flight to Miami. One-way rentals usually add a drop-off fee - compare with returning to Austin, but that costs a 1.5 h detour and a flight from AUS instead.", link: "https://www.avis.com/en/locations/nam/us/tx/san-antonio/sat" },
          { name: "📍 Map: San Antonio airport rental centre", text: "Avis/Budget Rental Car Center at San Antonio International Airport (SAT).", link: "https://www.google.com/maps/search/?api=1&query=Avis%20Budget%20Rental%20Car%20Center%2C%20San%20Antonio%20International%20Airport%2C%20San%20Antonio%2C%20TX" },
        ] },
        { title: "Rough cost (estimate)", items: [
          { name: "7 days, mid-size car", text: "Comparison sites show Avis/Budget at AUS from roughly $40-65 a day before taxes, airport fees and the one-way fee - plan on about $450-650 all-in. Book a free-cancellation rate and re-check prices nearer the time.", link: "https://www.kayak.com/Budget-Car-Rentals-Austin.ABUDGET.22863.cl.ksp" },
        ] },
        { title: "For UK drivers", items: [
          { name: "What to bring", text: "Full UK photocard licence (most suppliers want it held 12+ months), passport, and a credit card in the main driver's name for the deposit. An International Driving Permit is normally not needed." },
          { name: "Insurance", text: "A car-hire excess policy bought in the UK is usually much cheaper than the desk's damage waiver. Add Maryna as a second driver when booking if you want to share the long drives." },
        ] },
        { title: "Later: the Florida car (Sun 22 - Wed 25 Nov)", items: [
          { name: "Miami airport (MIA), round trip", text: "A separate rental for the Everglades and the Keys; Avis and Budget are both in MIA's Rental Car Center. Returning to MIA avoids a one-way fee.", link: "https://www.avis.com/en/locations/nam/us/fl/miami/mia" },
          { name: "📍 Map: Miami airport rental centre", text: "Rental Car Center at Miami International Airport (MIA).", link: "https://www.google.com/maps/search/?api=1&query=Rental%20Car%20Center%2C%20Miami%20International%20Airport%2C%20Miami%2C%20FL" },
        ] },
      ],
    },
  },

  // THE plan. A leg = where you sleep between arrive (check-in) and leave (check-out).
  // days[k] = items for the k-th day of the leg; idea ids are expanded to their titles on the page.
  plan: {
    home: "London",
    // Estimated trip costs (USD, for both of us) that aren't hotels or activities - drive the Trip Summary pie charts.
    // Hotels come from each leg's stay; "events" are estimated from the cost level ($/$$/$$$) of ideas in the plan.
    // A cost has a date, or from/to (spread evenly per day, to exclusive). Estimates only - update as things get booked.
    costs: [
      { type: "flights", label: "London → Austin, 2 people, economy (BA nonstop, estimate)", amount: 600, date: "2026-11-07" },
      { type: "flights", label: "San Antonio → Miami, 2 people (estimate)", amount: 350, date: "2026-11-20" },
      { type: "flights", label: "Miami → New York, 2 people (estimate)", amount: 350, date: "2026-11-25" },
      { type: "flights", label: "New York → London, 2 people, economy (estimate)", amount: 600, date: "2026-11-27" },
      { type: "car", label: "Texas rental, Austin → San Antonio one-way, 7 days (estimate)", amount: 550, from: "2026-11-13", to: "2026-11-20" },
      { type: "car", label: "Florida rental from Miami airport, 3 days (estimate)", amount: 250, from: "2026-11-22", to: "2026-11-25" },
    ],
    name: "Texas road trip, Florida & New York",
    summary: "A nature-heavy weekend together in Austin, then Maryna explores while Matija works (Mon-Fri). From Friday evening: a road trip through Hill Country, the West Texas desert and Big Bend, then fly to warm Florida (Miami, the Everglades and the Keys) and finish with Thanksgiving in New York.",
    budgetPerNight: 200,
    legs: [
      { place: "austin", arrive: "2026-11-07", leave: "2026-11-13",
        travel: "✈️ Fly London → Austin (AUS) together",
        stay: { name: "Downtown hotel near the venues", covered: true, notes: "Paid by Matija's work for 7-13 Nov. Check that Maryna can share the room." },
        days: [
          ["Arrive, recover from jet lag", "atx-lbj if you land by early afternoon (otherwise Matija can pop over on a lunch break - it's next to Bass Hall)", "atx-soco", "Dinner: atx-bbq (Terry Black's is walk-in)"],
          ["Breakfast: atx-tacos", "Together, nature day: atx-barton", "atx-wildflower", "Sunset: atx-bonnell"],
          ["Maryna: mar-food", "Evening together: atx-music"],
          ["Maryna: atx-blanton, atx-capitol"],
          ["Maryna: a side trip or city day (see the Maryna: ideas)"],
          ["Maryna: free day - South Congress shops, cafés, or a spa"],
        ] },
      { place: "fredericksburg", arrive: "2026-11-13", leave: "2026-11-15",
        travel: "🚗 Pick up rental car right after the Team summit ends (16:00) · 1.5 h drive",
        stay: { name: "Guesthaus / cottage near Main St", price: 180, notes: "" },
        days: [["Drive after work", "Late dinner on Main St"], ["Together: fbg-rock (early start)", "fbg-wine", "fbg-luck"]] },
      { place: "marfa", arrive: "2026-11-15", leave: "2026-11-16",
        travel: "🚗 5 h drive via I-10",
        stay: { name: "Hotel Saint George", price: 260, notes: "Few rooms in Marfa - book early. Budget alt: motel in Alpine ~$110." },
        days: [["mfa-prada", "mfa-lights or mfa-mcdonald"]] },
      { place: "bigbend", arrive: "2026-11-16", leave: "2026-11-19",
        travel: "🚗 1.5 h drive (after a morning Chinati tour)",
        stay: { name: "Casita / tiny house in Terlingua", price: 150, notes: "Chisos Mountains Lodge (in park, ~$200) books out months ahead." },
        days: [["mfa-chinati", "Drive to Terlingua", "bb-terlingua"], ["bb-lostmine", "bb-window", "bb-stars"], ["bb-santaelena", "bb-river", "bb-hotsprings"]] },
      { place: "sanantonio", arrive: "2026-11-19", leave: "2026-11-20",
        travel: "🚗 6 h drive",
        stay: { name: "Airbnb in King William district", price: 140, notes: "Walkable to the River Walk." },
        days: [["Long drive", "sa-riverwalk", "Dinner at sa-pearl"]] },
      { place: "miami", arrive: "2026-11-20", leave: "2026-11-22",
        travel: "✈️ Morning: sa-missions, return the car, fly San Antonio → Miami (~2.5 h, check flights)",
        stay: { name: "Hotel in South Beach / Mid-Beach", price: 250, notes: "Mid-range estimate for Collins Ave Art Deco hotels." },
        days: [["Arrive, evening walk on Ocean Drive"], ["mia-southbeach", "mia-wynwood", "Dinner: mia-havana"]] },
      { place: "keywest", arrive: "2026-11-22", leave: "2026-11-25",
        travel: "🚗 Rental car · Everglades on the way · ~4 h drive",
        stay: { name: "Guesthouse in Old Town Key West", price: 330, notes: "Key West is pricey - staying in Islamorada or Marathon (~$220) is the cheaper option." },
        days: [["mia-everglades", "kw-highway", "kw-sunset"], ["kw-snorkel", "kw-oldtown"], ["kw-tortugas (book ahead) or a lazy beach day"]] },
      { place: "nyc", arrive: "2026-11-25", leave: "2026-11-27",
        travel: "🚗 Drive back to Miami (~3.5 h), ✈️ fly to New York (~3 h)",
        stay: { name: "Hotel in Brooklyn Heights / Downtown Brooklyn, or Midtown", price: 400, notes: "Maja & Amit are in Cobble Hill, Brooklyn - not staying with them, but aim for <=30 min away (Brooklyn Heights/Downtown Brooklyn is closest; Midtown also works via subway). Thanksgiving week is peak - book early." },
        days: [["Long travel day", "Evening: balloon inflation by the Natural History Museum"], ["Relaxed Thanksgiving morning (skip the Macy's parade crowds): nyc-central", "Thanksgiving dinner with Maja & Amit"], ["Morning: nyc-911memorial (open Fri 9am-7pm; book ahead - it's closed on Thanksgiving Day itself) or the Met / High Line", "Check out and head to the airport"]] },
    ],
    end: { date: "2026-11-27", text: "✈️ Evening flight New York (JFK/EWR) → London together" },
  },
};
