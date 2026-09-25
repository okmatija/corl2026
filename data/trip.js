// Single source of truth for the trip. Claude edits this file as plans evolve.
// Prices are rough ESTIMATES (USD per night) for planning only - always check live rates.
window.TRIP = {
  meta: {
    title: "CoRL 2026 · USA trip",
    travellers: ["Matija", "Maryna"],
    updated: "2026-09-25T14:21Z",
    status: "Two plans to choose from (menu at the top left): Vegas or New York together, then Maryna flies home to London and Matija flies on to Austin for CoRL.",
  },

  // Matija's work commitments. Maryna is free the whole time.
  obligations: [
    { who: "Matija", title: "CoRL main conference", start: "2026-11-09", end: "2026-11-11", where: "JW Marriott / Hilton Austin / Bass Hall (UT)" },
    { who: "Matija", title: "CoRL workshops + team social (evening)", start: "2026-11-12", end: "2026-11-12" },
    { who: "Matija", title: "Team summit, until 16:00", start: "2026-11-13", end: "2026-11-13" },
  ],

  openQuestions: [
    "Vegas or New York? Switch between the two plans with the menu at the top left. Vegas: Halloween weekend, desert, the Zion + Grand Canyon loop and active stuff. New York: a city week with the Halloween parade, the Marathon and Maja & Amit.",
    "Start: both plans fly out on Fri 30 Oct, so Halloween (Sat 31) is a whole day there - Maryna's return costs the same either day. OK?",
    "Maryna flies Las Vegas → London on the evening of Sat 7 Nov (lands Sun 8 Nov) - or stay one more night and land on Mon 9 Nov around lunchtime?",
    "The Zion + Grand Canyon loop (3 nights, hire car) - keep it, or stay in Vegas and do day trips (Valley of Fire, Red Rock, Death Valley, Black Canyon kayak) instead?",
    "Sphere in Vegas: Metallica (residency runs through the autumn - check dates) or The Wizard of Oz (daily)?",
    "Matija after the team summit (ends Fri 13 Nov, 16:00): fly home Sat 14 Nov, or a weekend in New York first (e.g. see Maja & Amit)?",
    "Flights: Matija might fly business (BA Club Suite). Should Maryna fly business too, both take premium economy together, or split cabins? See the 📜 Details on the London → Las Vegas card.",
    "Any must-sees already on your list?",
  ],

  // type: city | nature | beach  (shown as 🏙️ / 🌲 / 🏖️ on the Ideas page). Names always end with ", <state>".
  places: {
    austin:         { name: "Austin, TX",                  type: "city",   lat: 30.2672, lng: -97.7431,  blurb: "Live music, tacos & BBQ, swimming holes. Conference base." },
    fredericksburg: { name: "Fredericksburg, TX",          type: "nature", lat: 30.2752, lng: -98.8720,  blurb: "German-Texan Hill Country town, wineries, Enchanted Rock." },
    sanantonio:     { name: "San Antonio, TX",             type: "city",   lat: 29.4241, lng: -98.4936,  blurb: "River Walk, Spanish missions (UNESCO), Pearl district." },
    lasvegas:       { name: "Las Vegas, NV",               type: "city",   lat: 36.1699, lng: -115.1398, blurb: "Gateway airport for the parks; Red Rock & Valley of Fire nearby." },
    zion:           { name: "Zion National Park, UT",      type: "nature", lat: 37.1889, lng: -112.9986, blurb: "Towering red canyon walls, iconic hikes (stay in Springdale)." },
    page:           { name: "Page, AZ",                    type: "nature", lat: 36.9147, lng: -111.4558, blurb: "Horseshoe Bend, Antelope Canyon, Lake Powell." },
    grandcanyon:    { name: "Grand Canyon South Rim, AZ",  type: "nature", lat: 36.0544, lng: -112.1401, blurb: "Needs no introduction. Sunrise & sunset on the rim." },
    nyc:            { name: "New York City, NY",           type: "city",   lat: 40.7128, lng: -74.0060,  blurb: "Museums, Broadway, late-fall Central Park - and Thanksgiving on Thu 26 Nov." },
  },

  // Idea cards. Region groups them on the Ideas page; ideas outside the plan's regions are alternatives to vote on.
  // cat: nature | food | culture | music | city | night | adventure. Optional link: official website / booking page.
  // Optional img: photo URL (use Wikimedia Commons Special:FilePath ...?width=640) + imgCredit: its Commons file page.
  ideas: [
    // Austin
    { id: "atx-barton", place: "austin", title: "Swim at Barton Springs Pool", cat: "nature", cost: "$", dur: "2h", why: "Spring-fed pool at ~20°C all year - locals swim in November too." },
    { id: "atx-soco", place: "austin", title: "South Congress stroll", cat: "city", cost: "free", dur: "2h", why: "Shops, murals, 'I love you so much' wall, view of the Capitol." },
    { id: "atx-bbq", place: "austin", title: "Texas BBQ (Franklin / la Barbecue / Terry Black's)", cat: "food", cost: "$$", dur: "2-4h", why: "Franklin needs a morning queue; Terry Black's is walk-in and good." },
    { id: "atx-tacos", place: "austin", title: "Breakfast tacos crawl", cat: "food", cost: "$", dur: "1h", why: "Veracruz All Natural migas taco is a local classic." },
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

    // Theme parks
    { id: "park-fiesta", place: "sanantonio", title: "Six Flags Fiesta Texas", cat: "adventure", cost: "$$", dur: "full day", why: "Big coasters in an old quarry. Heads-up: 'Holiday in the Park' only starts 21 Nov, so it's probably closed on our San Antonio day - check the calendar." },

    // NASCAR / motorsport
    { id: "nascar-cota", place: "austin", title: "Circuit of the Americas (COTA)", cat: "adventure", cost: "$$", dur: "half day", why: "Austin's F1/NASCAR circuit, 20 min from downtown. Easiest evening drop-in is Speed City (karting + mini-golf + zipline, ~$25-40pp estimate karting); COTA Driving Experience (~$1,837pp estimate) and Xtreme Xperience supercar rides (from ~$99pp estimate) are pricier day-session bookings, not evening drop-ins. No F1 or NASCAR Cup race clashes in Nov 2026 (F1 is in October); Schnell Fest club racing runs Nov 11-12 (daytime, may mean extra track traffic those days). Sources disagree on exact evening hours - confirm nearer the time." },

    // Fredericksburg / Hill Country
    { id: "fbg-rock", place: "fredericksburg", title: "Hike Enchanted Rock", cat: "nature", cost: "$", dur: "3h", why: "Huge pink granite dome; book a state-park day pass in advance." },
    { id: "fbg-wine", place: "fredericksburg", title: "Hill Country wineries on Hwy 290", cat: "food", cost: "$$", dur: "half day", why: "Dozens of tasting rooms; designate a driver or book a shuttle." },
    { id: "fbg-pedernales", place: "fredericksburg", title: "Pedernales Falls State Park", cat: "nature", cost: "$", dur: "3h", why: "Tiered limestone falls in the Hill Country; an easy stop on the way to or from Fredericksburg." },
    { id: "fbg-luck", place: "fredericksburg", title: "Luckenbach dance hall", cat: "music", cost: "free", dur: "2h", why: "Tiny town, big country music legend." },
    { id: "fbg-pacific", place: "fredericksburg", title: "National Museum of the Pacific War", cat: "culture", cost: "$", dur: "3h", why: "Excellent if you like history." },

    // San Antonio
    { id: "sa-missions", place: "sanantonio", title: "Mission trail by bike", cat: "culture", cost: "$", dur: "half day", why: "UNESCO missions, bike-share along the river." },
    { id: "sa-riverwalk", place: "sanantonio", title: "River Walk evening", cat: "city", cost: "free", dur: "2h", why: "Touristy but charming at night." },
    { id: "sa-pearl", place: "sanantonio", title: "Pearl district + Hotel Emma bar", cat: "food", cost: "$$", dur: "3h", why: "Best food hall and farmers market (weekends)." },
    { id: "sa-alamo", place: "sanantonio", title: "The Alamo", cat: "culture", cost: "free", dur: "1h", why: "Quick visit - smaller than people expect." },

    // Southwest
    { id: "lv-redrock", place: "lasvegas", title: "Red Rock Canyon scenic loop", cat: "nature", cost: "$", dur: "half day", why: "30 min from the Strip; timed entry reservation." },
    { id: "lv-sphere-metallica", place: "lasvegas", title: "Metallica 'Life Burns Faster' at the Sphere", cat: "music", cost: "$$$", dur: "evening", why: "Residency runs 1 Oct 2026 - 13 Mar 2027, so it overlaps our dates. Shows sell out - check dates and book early." },
    { id: "lv-sphere-oz", place: "lasvegas", title: "The Wizard of Oz at Sphere", cat: "night", cost: "$$", dur: "2h", why: "The fully immersive version of the film on the 16K wraparound screen with wind and effects; usually daily at 11am, 2pm, 5pm and 8pm." },
    { id: "lv-fountains", place: "lasvegas", title: "The Strip at night + Bellagio fountains", cat: "city", cost: "free", dur: "evening", why: "Free fountain show every 15-30 min after dark; walk from Caesars to the Cosmopolitan." },
    { id: "lv-fremont", place: "lasvegas", title: "Fremont Street & old downtown", cat: "night", cost: "free", dur: "2-3h", why: "Old-Vegas casinos under the LED canopy, zipline overhead, cheaper drinks." },
    { id: "lv-cirque", place: "lasvegas", title: "Cirque du Soleil 'O' at Bellagio", cat: "night", cost: "$$$", dur: "2h", why: "The classic water show - one of the best productions in Vegas." },
    { id: "lv-valleyfire", place: "lasvegas", title: "Valley of Fire State Park", cat: "nature", cost: "$", dur: "half day", why: "1 h from the Strip: glowing red sandstone, Fire Wave hike; perfect November temperatures." },
    { id: "lv-hoover", place: "lasvegas", title: "Hoover Dam + bypass bridge walk", cat: "culture", cost: "$", dur: "half day", why: "45 min away; walk the bridge for the classic view down onto the dam." },
    { id: "lv-blackcanyon", place: "lasvegas", title: "Kayak the Black Canyon below Hoover Dam", cat: "adventure", cost: "$$", dur: "full day", why: "Calm water between huge canyon walls, Emerald Cave, and hot springs you hike up to from the river. Guided trips from Vegas run all year. No experience or licence needed - just basic fitness; the outfitter sorts the launch permit." },
    { id: "lv-atv", place: "lasvegas", title: "ATV / buggy (UTV) desert tour", cat: "adventure", cost: "$$", dur: "half day", why: "Quad bikes or side-by-side buggies in the dunes and desert around Vegas. Driver needs a full valid licence (UK is fine), usually 16-18+; closed-toe shoes, no alcohol, sign a waiver, credit-card deposit. Passengers need no licence." },
    { id: "lv-climb", place: "lasvegas", title: "Guided intro rock climbing at Red Rock", cat: "adventure", cost: "$$$", dur: "half day", why: "World-class sandstone climbing 30 min from the Strip. Beginner half-days need no experience - guide and all kit included." },
    { id: "lv-calico", place: "lasvegas", title: "Calico Tanks scramble (Red Rock)", cat: "nature", cost: "$", dur: "2-3h", why: "Fun boulder-hopping hike to a hidden water pocket, with a view of the Strip at the top. Needs the Red Rock timed-entry reservation." },
    { id: "lv-ebike", place: "lasvegas", title: "E-bike tour of Red Rock Canyon", cat: "adventure", cost: "$$", dur: "half day", why: "Ride the 13-mile scenic loop without the car and the hills taking it out of you." },
    { id: "lv-horse", place: "lasvegas", title: "Horse riding at Red Rock", cat: "nature", cost: "$$", dur: "2h", why: "Guided trail rides at the edge of Red Rock; sunset rides are the best. No experience needed." },
    { id: "lv-zipline", place: "lasvegas", title: "Zipline: Flightlinez (Bootleg Canyon) or SlotZilla", cat: "adventure", cost: "$$", dur: "2-3h", why: "Flightlinez flies over desert canyons near Hoover Dam (easy to pair with it); SlotZilla shoots down Fremont Street." },
    { id: "lv-deathvalley", place: "lasvegas", title: "Death Valley day trip", cat: "nature", cost: "$", dur: "full day", why: "About 2 h away and at its best in November: Zabriskie Point, Badwater salt flats, Artists Drive, Mesquite dunes at sunset." },
    { id: "lv-gcwest", place: "lasvegas", title: "Grand Canyon West (Skywalk) or helicopter", cat: "nature", cost: "$$$", dur: "full day", why: "The 2-2.5 h option from Vegas. Pricey and far less impressive than the South Rim - only if there is no time for a night there." },
    { id: "zion-overlook", place: "zion", title: "Canyon Overlook trail", cat: "nature", cost: "$", dur: "1h", why: "Short, huge payoff." },
    { id: "zion-angels", place: "zion", title: "Angels Landing (permit lottery)", cat: "adventure", cost: "$", dur: "half day", link: "https://www.nps.gov/zion/planyourvisit/angels-landing-hiking-permits.htm", why: "Needs a permit: apply in the seasonal lottery 1-3 months ahead, or the day-before lottery." },
    { id: "zion-narrows", place: "zion", title: "Riverside Walk / lower Narrows", cat: "nature", cost: "$", dur: "3h", why: "Water is cold in Nov - drysuit rentals in Springdale." },
    { id: "zion-drive", place: "zion", title: "Zion-Mount Carmel Highway drive", cat: "nature", cost: "$", dur: "1h", why: "Switchbacks, a tunnel through the cliffs, then slickrock country - one of the best drives in the US, and the scenic way on towards Page." },
    { id: "page-horseshoe", place: "page", title: "Horseshoe Bend at sunset", cat: "nature", cost: "$", dur: "1h", why: "Iconic Colorado River bend." },
    { id: "page-antelope", place: "page", title: "Antelope Canyon guided tour", cat: "nature", cost: "$$", dur: "2h", why: "Navajo-guided tours only; book ahead." },
    { id: "page-kayak", place: "page", title: "Kayak the Colorado up to Horseshoe Bend", cat: "adventure", cost: "$$", dur: "full day", why: "From Lees Ferry: a boat takes you and the kayak upstream, then you paddle back down through Glen Canyon and under Horseshoe Bend. Calm water." },
    { id: "gc-sunrise", place: "grandcanyon", title: "Sunrise at Mather Point, sunset at Hopi Point", cat: "nature", cost: "$", dur: "2h", why: "Stay inside the park to make both easy." },
    { id: "gc-brightangel", place: "grandcanyon", title: "Bright Angel Trail to 1.5-mile resthouse", cat: "nature", cost: "free", dur: "3h", why: "Taste of the inner canyon; the climb back is the hard part." },
    { id: "gc-scenic", place: "grandcanyon", title: "Scenic drive from Vegas via Zion and Page (2 days)", cat: "nature", cost: "$", dur: "2 days", link: "https://www.google.com/maps/dir/?api=1&origin=Las+Vegas,+NV&destination=Grand+Canyon+Village,+AZ&waypoints=Springdale,+UT%7CHorseshoe+Bend,+Page,+AZ%7CDesert+View+Watchtower,+AZ&travelmode=driving", why: "About 7.5 h of driving over 2 days: Zion, the Zion-Mount Carmel Highway, Horseshoe Bend, then into the park from the east along the rim. The direct route (4.5 h, I-40) is mostly dull desert motorway." },
    { id: "gc-desertview", place: "grandcanyon", title: "Desert View Drive along the rim", cat: "nature", cost: "$", dur: "2-3h", why: "25 miles of viewpoints between the east entrance and Grand Canyon Village, ending at the Desert View Watchtower." },
    { id: "gc-kaibab", place: "grandcanyon", title: "South Kaibab Trail to Ooh Aah Point or Cedar Ridge", cat: "nature", cost: "free", dur: "1.5-3h", why: "Ridge-top trail with open views the whole way down. Ooh Aah Point ~1.5 h round trip, Cedar Ridge ~2-3 h. Never try river-and-back in a day." },
    { id: "gc-route66", place: "grandcanyon", title: "Old Route 66: Seligman to Kingman", cat: "culture", cost: "free", dur: "2h", why: "Swap the I-40 motorway for the old road on the drive back to Vegas: quirky diners and the Hackberry General Store. ~30 min extra." },
    { id: "gc-rafting", place: "grandcanyon", title: "One-day white-water rafting (Hualapai River Runners)", cat: "adventure", cost: "$$$", dur: "full day", why: "The only one-day Grand Canyon white-water trip. It usually runs spring to October, so early November is probably too late - check the season." },

    // New York
    { id: "nyc-central", place: "nyc", title: "Central Park in late fall", cat: "nature", cost: "free", dur: "half day", why: "Foliage often peaks early-mid November." },
    { id: "nyc-met", place: "nyc", title: "The Met", cat: "culture", cost: "$$", dur: "half day", why: "Pick 3 wings, don't try to see it all." },
    { id: "nyc-highline", place: "nyc", title: "High Line + Little Island + Chelsea Market", cat: "city", cost: "free", dur: "half day", why: "Great first-day walk." },
    { id: "nyc-broadway", place: "nyc", title: "Broadway show", cat: "night", cost: "$$$", dur: "evening", why: "Pick one of the shows below. TKTS in Times Square sells same-day tickets 20-50% off; many shows run daily digital lotteries." },
    { id: "nyc-brooklyn", place: "nyc", title: "Walk Brooklyn Bridge to DUMBO", cat: "city", cost: "free", dur: "2h", why: "Go early morning or at dusk." },
    { id: "nyc-rock", place: "nyc", title: "Rock show (Beacon Theatre / Irving Plaza / Brooklyn Steel)", cat: "music", cost: "$$", dur: "evening", why: "New York's classic rock rooms - check who is playing that week." },
    { id: "nyc-halloween", place: "nyc", title: "Village Halloween Parade (Sat 31 Oct)", cat: "night", cost: "free", dur: "evening", why: "The huge costume parade up Sixth Avenue from 19:00 - anyone in costume can march in it." },
    { id: "nyc-marathon", place: "nyc", title: "Cheer the New York City Marathon (Sun 1 Nov)", cat: "city", cost: "free", dur: "2-3h", why: "Usually the first Sunday of November (check the date): 50,000 runners through all five boroughs - First Avenue or Fifth Avenue by Central Park are great spots." },
    { id: "nyc-veselka", place: "nyc", title: "Veselka + the East Village's Ukrainian corner", cat: "food", cost: "$", dur: "2h", why: "Legendary Ukrainian diner (varenyky, borscht) at the heart of Little Ukraine; the Ukrainian Museum is a few blocks away." },
    { id: "nyc-jazz", place: "nyc", title: "Village Vanguard jazz", cat: "music", cost: "$$", dur: "evening", link: "https://villagevanguard.com/", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Village_Vanguard_daytime_jeh.jpg?width=640", imgCredit: "https://commons.wikimedia.org/wiki/File:Village_Vanguard_daytime_jeh.jpg", why: "Legendary basement club, open since 1935. ~$40-50 a set including one drink; 8pm and 10pm sets - book online." },
    { id: "nyc-summit", place: "nyc", title: "Top of the Rock or SUMMIT at sunset", cat: "city", cost: "$$", dur: "2h", why: "Top of the Rock has the Empire State in view." },
    { id: "nyc-911memorial", place: "nyc", link: "https://www.911memorial.org/visit/visit-museum-1", title: "9/11 Memorial & Museum", cat: "culture", cost: "$$", dur: "half day", why: "Outdoor Memorial is free, daily 8am-8pm. Museum (~$33pp estimate) is open Wed-Mon 9am-7pm, last entry 5:30pm (closed Tuesdays) - but closed on Thanksgiving Day itself. Book timed tickets online up to 6 months ahead; first-come first-served tickets release Mondays 7am ET." },

    // New York: cocktail bars (prices are rough estimates for late 2026)
    { id: "nyc-bemelmans", place: "nyc", title: "Bemelmans Bar at The Carlyle", cat: "night", cost: "$$$", dur: "evening", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Bemelmans_Bar.jpg?width=640", imgCredit: "https://commons.wikimedia.org/wiki/File:Bemelmans_Bar.jpg", why: "The classic: live jazz piano under Ludwig Bemelmans' murals. Cocktails ~$28-32; a per-person music charge (~$20-35) kicks in once the pianist starts in the evening. Smart-casual; queue or go early." },
    { id: "nyc-kingcole", place: "nyc", title: "King Cole Bar at the St. Regis", cat: "night", cost: "$$$", dur: "1-2h", img: "https://commons.wikimedia.org/wiki/Special:FilePath/King_Cole_Bar_HDR_2021_jeh.jpg?width=640", imgCredit: "https://commons.wikimedia.org/wiki/File:King_Cole_Bar_HDR_2021_jeh.jpg", why: "Birthplace of the Bloody Mary (the 'Red Snapper'), under Maxfield Parrish's King Cole mural. Cocktails ~$30." },
    { id: "nyc-deathco", place: "nyc", title: "Death & Co (East Village)", cat: "night", cost: "$$", dur: "1-2h", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Death_and_Company_HDR_2022_jeh.jpg?width=640", imgCredit: "https://commons.wikimedia.org/wiki/File:Death_and_Company_HDR_2022_jeh.jpg", why: "Dark, candlelit and one of the bars that started the craft-cocktail revival. Cocktails ~$22. No bookings for small groups - put your name down and wait nearby." },
    { id: "nyc-pdt", place: "nyc", title: "PDT - Please Don't Tell", cat: "night", cost: "$$", dur: "1-2h", img: "https://commons.wikimedia.org/wiki/Special:FilePath/PDT_bar_01.jpg?width=640", imgCredit: "https://commons.wikimedia.org/wiki/File:PDT_bar_01.jpg", why: "Speakeasy entered through a phone booth inside Crif Dogs hot-dog shop. Cocktails ~$22, and you can order a hot dog to your seat. Reservations open the same day." },
    { id: "nyc-doublechicken", place: "nyc", title: "Double Chicken Please (Lower East Side)", cat: "night", cost: "$$", dur: "1-2h", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Double_Chicken_Please-_Cold_Pizza_Cocktail%2C_NYC%2C_2-24-2024.jpg?width=640", imgCredit: "https://commons.wikimedia.org/wiki/File:Double_Chicken_Please-_Cold_Pizza_Cocktail%2C_NYC%2C_2-24-2024.jpg", why: "Ranked the world's best bar in 2023: cocktails that taste like dishes (the 'Cold Pizza'!). Cocktails ~$20-24; the back room takes bookings, the front is walk-in." },
    { id: "nyc-deadrabbit", place: "nyc", title: "The Dead Rabbit (Financial District)", cat: "night", cost: "$$", dur: "1-2h", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Dead_Rabbit_-_24395363161.jpg?width=640", imgCredit: "https://commons.wikimedia.org/wiki/File:Dead_Rabbit_-_24395363161.jpg", why: "Award-winning Irish bar: the best Irish coffee in town downstairs, a storybook cocktail menu upstairs in the Parlor. Cocktails ~$20-22." },
    { id: "nyc-attaboy", place: "nyc", title: "Attaboy (Lower East Side)", cat: "night", cost: "$$", dur: "1-2h", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Attaboy_NYC.jpg?width=640", imgCredit: "https://commons.wikimedia.org/wiki/File:Attaboy_NYC.jpg", why: "No menu - tell the bartender what you like and they make it for you. Cocktails ~$20. Small, walk-in only; ring the buzzer." },
    { id: "nyc-katana", place: "nyc", title: "Katana Kitten (West Village)", cat: "night", cost: "$$", dur: "1-2h", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Katana_Kitten_NYC.jpg?width=640", imgCredit: "https://commons.wikimedia.org/wiki/File:Katana_Kitten_NYC.jpg", why: "Fun Japanese-American highball bar - cheaper than the rest (highballs ~$16-18) and great bar snacks." },

    // New York: jazz clubs
    { id: "nyc-bluenote", place: "nyc", title: "Blue Note Jazz Club", cat: "music", cost: "$$$", dur: "evening", link: "https://www.bluenotejazz.com/nyc/", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Blue_Note_Jazz_Club%2C_New_York_City.jpg?width=640", imgCredit: "https://commons.wikimedia.org/wiki/File:Blue_Note_Jazz_Club%2C_New_York_City.jpg", why: "Famous Greenwich Village club with big-name acts. Tickets ~$35-75 plus a ~$20 food/drink minimum; 8pm and 10:30pm sets - book ahead." },
    { id: "nyc-smalls", place: "nyc", title: "Smalls Jazz Club", cat: "music", cost: "$$", dur: "evening", link: "https://www.smallslive.com/", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Max-leven-performance-smalls-jazz-club-greenwich-village-nyc-july-2025.jpg?width=640", imgCredit: "https://commons.wikimedia.org/wiki/File:Max-leven-performance-smalls-jazz-club-greenwich-village-nyc-july-2025.jpg", why: "Tiny basement club with a proper local-musician vibe; ~$35-40 a set, and the late-night jam sessions run past midnight." },
    { id: "nyc-birdland", place: "nyc", title: "Birdland (Midtown)", cat: "music", cost: "$$$", dur: "evening", link: "https://www.birdlandjazz.com/", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Birdland_New_York.jpg?width=640", imgCredit: "https://commons.wikimedia.org/wiki/File:Birdland_New_York.jpg", why: "The legendary name (after Charlie 'Bird' Parker), near the Broadway theatres - good before or after a show. Tickets ~$40-60 plus a ~$20 minimum." },

    // New York: Broadway (check it is still running that week; TKTS in Times Square sells same-day tickets 20-50% off)
    { id: "nyc-lionking", place: "nyc", title: "The Lion King (Minskoff Theatre)", cat: "night", cost: "$$$", dur: "evening", img: "https://commons.wikimedia.org/wiki/Special:FilePath/The_Lion_King_at_Minskoff_Theatre_in_Broadway.jpg?width=640", imgCredit: "https://commons.wikimedia.org/wiki/File:The_Lion_King_at_Minskoff_Theatre_in_Broadway.jpg", why: "The spectacular puppetry is worth it even if you know the film. Tickets from ~$100; good seats ~$150-250." },
    { id: "nyc-wicked", place: "nyc", title: "Wicked (Gershwin Theatre)", cat: "night", cost: "$$$", dur: "evening", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Gershwin_Theatre_-_Wicked_%2854077363135%29.jpg?width=640", imgCredit: "https://commons.wikimedia.org/wiki/File:Gershwin_Theatre_-_Wicked_%2854077363135%29.jpg", why: "Big, funny and a huge production - extra popular since the films. Tickets from ~$100; good seats ~$150-250." },
    { id: "nyc-hamilton", place: "nyc", title: "Hamilton (Richard Rodgers Theatre)", cat: "night", cost: "$$$", dur: "evening", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Rodgers_Theater_-_Hamilton_%2848193460677%29.jpg?width=640", imgCredit: "https://commons.wikimedia.org/wiki/File:Rodgers_Theater_-_Hamilton_%2848193460677%29.jpg", why: "Still the hottest ticket. From ~$150, good seats ~$250-400 - or try the $10 digital lottery (Hamilton app) every day." },
    { id: "nyc-chicago", place: "nyc", title: "Chicago (Ambassador Theatre)", cat: "night", cost: "$$", dur: "evening", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Ambassador_Theatre_-_Chicago_%2848296059772%29.jpg?width=640", imgCredit: "https://commons.wikimedia.org/wiki/File:Ambassador_Theatre_-_Chicago_%2848296059772%29.jpg", why: "Slick, sexy and the cheapest of the classics - often on the TKTS board. Tickets from ~$70-80." },
    { id: "nyc-mormon", place: "nyc", title: "The Book of Mormon (Eugene O'Neill Theatre)", cat: "night", cost: "$$$", dur: "evening", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Eugene_O%27Neill_Theatre_-_Book_of_Mormon_%2848295951286%29.jpg?width=640", imgCredit: "https://commons.wikimedia.org/wiki/File:Eugene_O%27Neill_Theatre_-_Book_of_Mormon_%2848295951286%29.jpg", why: "Very rude, very funny (from the South Park creators). Tickets from ~$90; daily lottery for cheap front-row seats." },
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
    "stop:austin-matija": { href: "#austin" },
    "stay:austin-matija": { href: "#austin" },
  },

  // THE PLANS: alternative versions of the trip, picked with the plan menu at the top of the site. Each has its own legs,
  // costs, flights home and optional details (merged over TRIP.details). Comments carry the plan id they were made on.
  plans: [
    {
      id: "vegas",
      label: "🎰 Vegas plan",
      home: "London",
      // Hotels come from each leg's stay; "events" are estimated from the cost level ($/$$/$$$) of ideas in the plan.
      // A cost has a date, or from/to (spread evenly per day, to exclusive). Estimates only - update as things get booked.
      costs: [
        { type: "flights", label: "Maryna: return London ⇄ Las Vegas, economy nonstop (from ~$624, Google Flights 25 Sep - estimate). Matija's flights are paid by work.", amount: 624, date: "2026-10-30" },
        { type: "car", label: "Car hire for the Zion + Grand Canyon loop, 3 days (estimate)", amount: 200, from: "2026-11-02", to: "2026-11-05" },
      ],
      name: "Vegas, Zion & the Grand Canyon, then CoRL",
      summary: "Together: from Fri 30 Oct, a week around Las Vegas - Halloween on the Strip, Valley of Fire, a hire-car loop through Zion, Horseshoe Bend and the Grand Canyon, then back to Vegas. On Sat 7 Nov Maryna flies home to London and Matija flies to Austin for CoRL and the team summit, home Sat 14 Nov.",
      budgetPerNight: 200,
      legs: [
        { place: "lasvegas", arrive: "2026-10-30", leave: "2026-11-02",
          travel: "✈️ Fly London → Las Vegas together (nonstop, ~10h40)",
          stay: { name: "Mid-Strip hotel", price: 170, notes: "Estimate. Halloween Saturday is pricier, and most Strip hotels add a ~$45/night resort fee." },
          days: [
            ["Land in the evening (~20:00-21:30), check in", "Short late walk: lv-fountains"],
            ["Halloween! Early start (jet lag helps): lv-calico", "Pool afternoon and a nap", "Halloween night: lv-fremont - costumes everywhere", "Clocks go back tonight (an extra hour of sleep)"],
            ["Early start: lv-valleyfire", "Evening: lv-sphere-oz or lv-sphere-metallica (check dates)"],
          ] },
        { place: "zion", arrive: "2026-11-02", leave: "2026-11-03",
          travel: "🚗 Pick up a hire car at the airport · 2.5 h drive to Springdale",
          stay: { name: "Hotel in Springdale, at the park gate", price: 200, notes: "Estimate." },
          days: [["Afternoon: zion-narrows", "Evening in Springdale"]] },
        { place: "grandcanyon", arrive: "2026-11-03", leave: "2026-11-05",
          travel: "🚗 gc-scenic, day 2: zion-drive with zion-overlook, page-horseshoe, then gc-desertview (~5 h driving)",
          stay: { name: "Lodge inside the park (El Tovar / Bright Angel / Maswik)", price: 250, notes: "Estimate - in-park lodges book up early." },
          days: [
            ["Arrive along the rim", "Sunset: gc-sunrise"],
            ["Sunrise at Mather Point", "gc-kaibab", "Afternoon: rim walk and rest"],
          ] },
        { id: "lasvegas-2", place: "lasvegas", arrive: "2026-11-05", leave: "2026-11-07",
          travel: "🚗 Drive back to Vegas via gc-route66 (~5 h), drop the car",
          stay: { name: "Hotel in Vegas", price: 150, notes: "Estimate - weeknights are cheaper." },
          days: [
            ["Drive back", "Easy evening on the Strip"],
            ["lv-blackcanyon (full day)", "Evening: lv-cirque"],
            ["Morning: lv-redrock or lv-atv", "Evening: Maryna flies Vegas → London; Matija flies to Austin"],
          ] },
        { id: "austin-matija", who: "Matija", place: "austin", arrive: "2026-11-07", leave: "2026-11-14", daysFrom: "2026-11-08",
          travel: "✈️ Matija: Las Vegas → Austin (Southwest nonstop, ~3 h)",
          stay: { name: "Downtown hotel near the venues", covered: true, notes: "Paid by work from Sat 7 Nov. Matija checks out Sat 14 Nov." },
          days: [
            ["Breakfast: atx-tacos", "atx-barton", "atx-soco", "Dinner: atx-bbq"],
            ["Evening: atx-music"],
            ["Evening: atx-stubbs"],
            ["Free evening"],
            ["Evening: team social"],
            ["Evening: celebrate the end of CoRL"],
            ["Check out", "Fly Austin → London"],
          ] },
      ],
      // Flights home: one per person when they leave on different days (`who`); a single entry without `who` if together.
      ends: [
        { who: "Maryna", date: "2026-11-07", text: "✈️ Maryna: Las Vegas → London, overnight (lands Sun 8 Nov)" },
        { who: "Matija", date: "2026-11-14", text: "✈️ Matija: Austin → London" },
      ],
      // 📜 Details pages for this plan (same keys as TRIP.details, which are shared by all plans)
      details: {
        "travel:lasvegas": {
          title: "✈️ Flights London → Las Vegas (Fri 30 Oct)",
          intro: "British Airways and Virgin Atlantic fly nonstop Heathrow → Las Vegas, about 10h45, landing the same evening.",
          sections: [
            { title: "Maryna's ticket: a return, out Fri 30 or Sat 31 Oct, back Sat 7 Nov (economy, estimates from Google Flights, 25 Sep)", items: [
              { name: "Out Fri 30 Oct", text: "Virgin Atlantic nonstop from ~$624 return (17:40 → 21:25); British Airways nonstop ~$793 (16:05 → 19:50).", link: "https://www.google.com/travel/flights?q=Flights%20to%20LAS%20from%20LON%20on%202026-10-30%20returning%202026-11-07" },
              { name: "Out Sat 31 Oct", text: "Virgin Atlantic nonstop from ~$624 return - the same price, so Friday costs nothing extra and gives a whole Halloween day.", link: "https://www.google.com/travel/flights?q=Flights%20to%20LAS%20from%20LON%20on%202026-10-31%20returning%202026-11-07" },
              { name: "Book a return, not one-ways", text: "One-ways are far pricier (~$967+ nonstop just to get there). Maryna's trip is a simple round trip, so a return is the cheapest way." },
              { name: "Matija", text: "Paid by work - ideally booked on the same outbound flight (the Virgin 17:40 is the cheapest one for Maryna)." },
              { name: "Live prices", text: "Tap a date above for today's return fares on Google Flights; use Track prices for alerts. Google says the cheapest time to book this route is now, until about 9 Oct." },
            ] },
            { title: "Nonstop options", items: [
              { name: "British Airways (LHR → LAS)", text: "Economy, World Traveller Plus (premium economy) or Club Suite business.", link: "https://www.britishairways.com/" },
              { name: "Virgin Atlantic (LHR → LAS)", text: "Economy, Premium or Upper Class - daily.", link: "https://flights.virginatlantic.com/en/flights-from-london-to-las-vegas" },
            ] },
            { title: "Business for Matija, Maryna too?", items: [
              { name: "Options", text: "Both economy; both premium economy; or Matija in business and Maryna in economy or premium on the same flight. If Matija's ticket is booked through work, check which cabin the travel policy allows." },
            ] },
            { title: "Before you fly", items: [
              { name: "Entry to the US", text: "UK passports need an approved ESTA; other passports may need a US visa, which can take months - check each passport early.", link: "https://esta.cbp.dhs.gov/" },
            ] },
          ],
        },
        "travel:zion": {
          title: "🚗 Car hire for the Zion + Grand Canyon loop",
          intro: "Pick up at Las Vegas airport (Harry Reid, LAS) on Mon 2 Nov and drop it back there on Thu 5 Nov - a round trip, so no one-way fee. You don't need a car on the Strip.",
          sections: [
            { title: "The route", items: [
              { name: "Scenic route map", text: "Vegas → Springdale (Zion) → Zion-Mount Carmel Highway → Horseshoe Bend → Desert View → Grand Canyon Village.", link: "https://www.google.com/maps/dir/?api=1&origin=Las+Vegas,+NV&destination=Grand+Canyon+Village,+AZ&waypoints=Springdale,+UT%7CHorseshoe+Bend,+Page,+AZ%7CDesert+View+Watchtower,+AZ&travelmode=driving" },
              { name: "Back to Vegas", text: "About 4.5-5 h direct; swap I-40 for old Route 66 between Seligman and Kingman." },
            ] },
            { title: "Rough cost (estimate)", items: [
              { name: "3 days, mid-size, round trip", text: "Roughly $150-250 all-in - check live prices and book a free-cancellation rate. Park entry: an America the Beautiful annual pass covers Zion and the Grand Canyon." },
            ] },
            { title: "For UK drivers", items: [
              { name: "What to bring", text: "Full UK photocard licence (usually held 12+ months), passport, and a credit card in the main driver's name. An International Driving Permit is normally not needed. A UK car-hire excess policy is usually cheaper than the desk's waiver." },
            ] },
          ],
        },
        "travel:home": {
          title: "✈️ Flights home to London",
          intro: "Maryna flies home from Vegas; Matija flies on to Austin for CoRL and the team summit, then home.",
          sections: [
            { title: "Maryna - Sat 7 Nov", items: [
              { name: "Las Vegas → London (nonstop), the return half of her ticket", text: "Evening departure, about 10 h overnight, landing at Heathrow on Sun 8 Nov. See the London → Las Vegas card for prices." },
            ] },
            { title: "Matija - Sat 14 Nov", items: [
              { name: "British Airways Austin → London (nonstop)", text: "Paid by work. After checking out of the work hotel; lands Sun 15 Nov. Or add a weekend in New York first - see the open questions.", link: "https://www.britishairways.com/content/flights/usa/texas/austin" },
            ] },
          ],
        },
        "travel:austin-matija": {
          title: "✈️ Matija: Las Vegas → Austin (Sat 7 Nov)",
          intro: "Southwest flies nonstop several times a day, about 3 h. Austin is 2 hours ahead of Vegas.",
          sections: [
            { title: "Book", items: [
              { name: "Southwest - Las Vegas → Austin", text: "Two free checked bags. Fares often around $100-150 one-way (estimate).", link: "https://www.southwest.com/" },
            ] },
          ],
        },
      },
    },
    {
      id: "nyc",
      label: "🗽 NYC plan",
      home: "London",
      costs: [
        { type: "flights", label: "Maryna: return London ⇄ New York, economy nonstop (from ~$534, Google Flights 25 Sep - estimate). Matija's flights are paid by work.", amount: 534, date: "2026-10-30" },
      ],
      name: "A week in New York, then CoRL",
      summary: "Together: from Fri 30 Oct, a week in New York - Halloween parade, the Marathon, museums, Broadway, jazz, and time with Maja & Amit in Brooklyn. On Sat 7 Nov Maryna flies home to London and Matija flies to Austin for CoRL and the team summit, home Sat 14 Nov.",
      budgetPerNight: 200,
      legs: [
        { place: "nyc", arrive: "2026-10-30", leave: "2026-11-07",
          travel: "✈️ Fly London → New York together (nonstop, ~8 h)",
          stay: { name: "Hotel in Manhattan or Brooklyn", price: 280, notes: "Estimate - New York hotels are pricey; Brooklyn (near Maja & Amit in Cobble Hill) is a bit cheaper than Manhattan." },
          days: [
            ["Land around lunchtime, check in", "Easy evening: nyc-veselka"],
            ["Halloween! nyc-highline", "Evening: nyc-halloween", "Clocks go back tonight (an extra hour of sleep)"],
            ["Morning: nyc-marathon", "nyc-central", "Evening: nyc-jazz"],
            ["nyc-met", "Evening: nyc-broadway"],
            ["nyc-911memorial", "Sunset: nyc-summit"],
            ["Dusk: nyc-brooklyn", "Dinner in Brooklyn with Maja & Amit?"],
            ["Free day", "Evening: nyc-rock"],
            ["Free day"],
            ["Last morning together", "Evening: Maryna flies New York → London; Matija flies to Austin"],
          ] },
        { id: "austin-matija", who: "Matija", place: "austin", arrive: "2026-11-07", leave: "2026-11-14", daysFrom: "2026-11-08",
          travel: "✈️ Matija: New York → Austin (nonstop, ~4 h)",
          stay: { name: "Downtown hotel near the venues", covered: true, notes: "Paid by work from Sat 7 Nov. Matija checks out Sat 14 Nov." },
          days: [
            ["Breakfast: atx-tacos", "atx-barton", "atx-soco", "Dinner: atx-bbq"],
            ["Evening: atx-music"],
            ["Evening: atx-stubbs"],
            ["Free evening"],
            ["Evening: team social"],
            ["Evening: celebrate the end of CoRL"],
            ["Check out", "Fly Austin → London"],
          ] },
      ],
      ends: [
        { who: "Maryna", date: "2026-11-07", text: "✈️ Maryna: New York → London, overnight (lands Sun 8 Nov)" },
        { who: "Matija", date: "2026-11-14", text: "✈️ Matija: Austin → London" },
      ],
      details: {
        "travel:nyc": {
          title: "✈️ Flights London → New York (Fri 30 Oct)",
          intro: "The busiest route across the Atlantic: British Airways, Virgin Atlantic, American, Delta, United and JetBlue all fly nonstop Heathrow → JFK or Newark many times a day, about 8 h.",
          sections: [
            { title: "Maryna's ticket: a return, out Fri 30 or Sat 31 Oct, back Sat 7 Nov (economy, estimates from Google Flights, 25 Sep)", items: [
              { name: "Out Fri 30 Oct", text: "Nonstop from ~$534 return on United (to Newark), American, Delta or Virgin Atlantic (to JFK) - lots of times to choose from.", link: "https://www.google.com/travel/flights?q=Flights%20to%20NYC%20from%20LON%20on%202026-10-30%20returning%202026-11-07" },
              { name: "Out Sat 31 Oct", text: "Also from ~$534 return nonstop (United, JetBlue, Virgin, Delta) - Friday costs nothing extra and gives a whole Halloween day.", link: "https://www.google.com/travel/flights?q=Flights%20to%20NYC%20from%20LON%20on%202026-10-31%20returning%202026-11-07" },
              { name: "Book a return, not one-ways", text: "One-ways are pricier (~$687+ nonstop just to get there). Maryna's trip is a simple round trip, so a return is the cheapest way." },
              { name: "Matija", text: "Paid by work - ideally booked on the same outbound flight." },
              { name: "Live prices", text: "Tap a date above for today's return fares on Google Flights; use Track prices for alerts." },
            ] },
            { title: "Nonstop options", items: [
              { name: "British Airways / American (LHR → JFK)", text: "Many flights a day; morning departures land early afternoon.", link: "https://www.britishairways.com/" },
              { name: "Virgin Atlantic / Delta (LHR → JFK)", text: "Several a day.", link: "https://www.virginatlantic.com/" },
            ] },
            { title: "Before you fly", items: [
              { name: "Entry to the US", text: "UK passports need an approved ESTA; other passports may need a US visa, which can take months - check each passport early.", link: "https://esta.cbp.dhs.gov/" },
            ] },
          ],
        },
        "travel:home": {
          title: "✈️ Flights home to London",
          intro: "Maryna flies home from New York; Matija flies on to Austin for CoRL and the team summit, then home.",
          sections: [
            { title: "Maryna - Sat 7 Nov", items: [
              { name: "New York → London (nonstop, overnight), the return half of her ticket", text: "Evening departures from JFK or Newark land at Heathrow on Sun 8 Nov morning (~7 h). See the London → New York card for prices." },
            ] },
            { title: "Matija - Sat 14 Nov", items: [
              { name: "British Airways Austin → London (nonstop)", text: "Paid by work. After checking out of the work hotel; lands Sun 15 Nov.", link: "https://www.britishairways.com/content/flights/usa/texas/austin" },
            ] },
          ],
        },
        "travel:austin-matija": {
          title: "✈️ Matija: New York → Austin (Sat 7 Nov)",
          intro: "Nonstops from JFK, LaGuardia and Newark (American, Delta, United, JetBlue), about 4 h. Austin is an hour behind New York.",
          sections: [],
        },
      },
    },
    {
      id: "nyc-austin",
      label: "🗽🤠 NYC + Austin plan",
      home: "London",
      costs: [
        { type: "flights", label: "Maryna: one multi-city ticket London → New York (30 Oct) + Austin → London (10 Nov), nonstop both ways (from ~$701, Google Flights 25 Sep - estimate). Matija's flights are paid by work.", amount: 701, date: "2026-10-30" },
        { type: "flights", label: "Maryna: New York → Austin, nonstop (~$269, estimate)", amount: 269, date: "2026-11-07" },
      ],
      name: "A week in New York, then a long weekend in Austin together",
      summary: "Together: a week in New York from Fri 30 Oct, then on Sat 7 Nov we both fly to Austin - a weekend together, and Maryna explores while Matija starts CoRL. Maryna flies home on Tue 10 Nov; Matija stays for CoRL and the team summit, home Sat 14 Nov.",
      budgetPerNight: 200,
      legs: [
        { place: "nyc", arrive: "2026-10-30", leave: "2026-11-07",
          travel: "✈️ Fly London → New York together (nonstop, ~8 h)",
          stay: { name: "Hotel in Manhattan or Brooklyn", price: 280, notes: "Estimate - New York hotels are pricey; Brooklyn (near Maja & Amit in Cobble Hill) is a bit cheaper than Manhattan." },
          days: [
            ["Land around lunchtime, check in", "Easy evening: nyc-veselka"],
            ["Halloween! nyc-highline", "Evening: nyc-halloween", "Clocks go back tonight (an extra hour of sleep)"],
            ["Morning: nyc-marathon", "nyc-central", "Evening: nyc-jazz"],
            ["nyc-met", "Evening: nyc-broadway"],
            ["nyc-911memorial", "Sunset: nyc-summit"],
            ["Dusk: nyc-brooklyn", "Dinner in Brooklyn with Maja & Amit?"],
            ["Free day", "Evening: nyc-rock"],
            ["Free day"],
          ] },
        { place: "austin", arrive: "2026-11-07", leave: "2026-11-10",
          travel: "✈️ Fly New York → Austin together (nonstop, ~4 h)",
          stay: { name: "Downtown hotel near the venues", covered: true, notes: "Matija's work hotel from Sat 7 Nov - check Maryna can share it." },
          days: [
            ["Last morning in New York, afternoon flight", "Dinner: atx-bbq (Terry Black's is walk-in)"],
            ["Breakfast: atx-tacos", "atx-barton", "atx-soco", "Sunset: atx-bonnell"],
            ["Maryna: atx-wildflower", "Evening together: atx-music"],
            ["Maryna: atx-kayak, then atx-blanton", "Evening: Maryna flies Austin → London (lands Wed 11 Nov)"],
          ] },
        { id: "austin-matija", who: "Matija", place: "austin", arrive: "2026-11-10", leave: "2026-11-14", daysFrom: "2026-11-11",
          stay: { name: "Downtown hotel near the venues", covered: true, notes: "Paid by work. Matija checks out Sat 14 Nov." },
          days: [
            ["Evening: atx-stubbs"],
            ["Evening: team social"],
            ["Evening: celebrate the end of CoRL"],
            ["Check out", "Fly Austin → London"],
          ] },
      ],
      ends: [
        { who: "Maryna", date: "2026-11-10", text: "✈️ Maryna: Austin → London, BA nonstop, evening (lands Wed 11 Nov)" },
        { who: "Matija", date: "2026-11-14", text: "✈️ Matija: Austin → London" },
      ],
      details: {
        "travel:nyc": {
          title: "✈️ Flights London → New York (Fri 30 Oct)",
          intro: "The busiest route across the Atlantic: British Airways, Virgin Atlantic, American, Delta, United and JetBlue all fly nonstop Heathrow → JFK or Newark many times a day, about 8 h.",
          sections: [
            { title: "Maryna's ticket: one multi-city ticket, London → New York + Austin → London (economy, estimates from Google Flights, 25 Sep)", items: [
              { name: "Out Fri 30 Oct, home Tue 10 Nov", text: "Multi-city, nonstop both ways: from ~$701 for the whole trip (Delta / Virgin Atlantic out; BA home from Austin), American ~$735, BA ~$814. Separate one-ways would be ~$1,245.", link: "https://www.google.com/travel/flights/search?tfs=GhwSCjIwMjYtMTAtMzAoAGoFEgNMSFJyBRIDSkZLGhwSCjIwMjYtMTEtMTAoAGoFEgNBVVNyBRIDTEhSQgEBSAGYAQM=&hl=en" },
              { name: "One-ways instead", text: "Out Sat 31 Oct JetBlue is ~$450 one-way, but Austin → London alone is ~$558 - the multi-city ticket is cheaper.", link: "https://www.google.com/travel/flights?q=Flights%20to%20NYC%20from%20LON%20on%202026-10-31%20one%20way" },
              { name: "Plus New York → Austin", text: "A separate short flight on Sat 7 Nov, ~$269 nonstop - see the New York → Austin card." },
              { name: "Matija", text: "Paid by work - ideally booked on the same outbound flight." },
              { name: "Live prices", text: "Tap a date above for today's return fares on Google Flights; use Track prices for alerts." },
            ] },
            { title: "Nonstop options", items: [
              { name: "British Airways / American (LHR → JFK)", text: "Many flights a day; morning departures land early afternoon.", link: "https://www.britishairways.com/" },
              { name: "Virgin Atlantic / Delta (LHR → JFK)", text: "Several a day.", link: "https://www.virginatlantic.com/" },
            ] },
            { title: "Before you fly", items: [
              { name: "Entry to the US", text: "UK passports need an approved ESTA; other passports may need a US visa, which can take months - check each passport early.", link: "https://esta.cbp.dhs.gov/" },
            ] },
          ],
        },
        "travel:austin": {
          title: "✈️ New York → Austin (Sat 7 Nov)",
          intro: "American, Delta, United and JetBlue fly nonstop from JFK, LaGuardia and Newark, about 4 h. Nonstops were from ~$269 one-way on Google Flights (25 Sep, estimate). Matija's is paid by work - book the same flight.",
          sections: [],
        },
        "stop:austin": { href: "#austin" },
        "stay:austin": { href: "#austin" },
        "travel:home": {
          title: "✈️ Flights home to London",
          intro: "Maryna flies home from Austin on Tue 10 Nov; Matija after the team summit.",
          sections: [
            { title: "Maryna - Tue 10 Nov", items: [
              { name: "British Airways Austin → London (nonstop), the second half of her multi-city ticket", text: "The only nonstop: 18:55 → 10:05 next day. See the London → New York card for prices." },
            ] },
            { title: "Matija - Sat 14 Nov", items: [
              { name: "British Airways Austin → London (nonstop)", text: "Paid by work. After checking out of the work hotel; lands Sun 15 Nov.", link: "https://www.britishairways.com/content/flights/usa/texas/austin" },
            ] },
          ],
        },
      },
    },
  ],
};
