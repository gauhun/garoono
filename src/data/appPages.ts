// Landing pages at garoono.in/apps/<slug>/ for apps that used to point at Linktree.
// Copy follows the store-copy rules: no em or en dashes, no full stop at the end of a line,
// plain words, and no other companies' app names.

export type AppPage = {
  slug: string;
  productId: number; // id in products.ts (name, icon, colour, user count come from there)
  tagline: string;
  problem: string[]; // "Before" card, one line each
  result: string[]; // "After" card, one line each
  steps: { title: string; text: string }[]; // exactly 3
  benefits: { icon: string; title: string; text: string }[]; // 4 to 6
  playUrl: string;
  appStoreUrl?: string; // omitted for Android-only apps
  websiteUrl?: string; // the app's own site, when it has one
  screenshots: string[]; // paths under /public, saved by scripts/fetch-app-shots.mjs
  category: string; // schema.org applicationCategory
  seoTitle: string;
  seoDescription: string;
};

const shots = (slug: string, count: number) => Array.from({ length: count }, (_, i) => `/apps/${slug}/shot-${i + 1}.jpg`);

export const appPages: AppPage[] = [
  {
    slug: "dress-mirror",
    productId: 12,
    tagline: "See any outfit on you before you buy it",
    problem: [
      "The outfit looked great on the model",
      "It arrives, it doesn't suit you, and the return takes a week",
      "Trial rooms mean queues, and online you are just guessing",
    ],
    result: [
      "Try any outfit on your own photo in seconds",
      "Your real face, skin tone and body stay yours",
      "Buy what suits you and skip the returns",
    ],
    steps: [
      { title: "Add your photo", text: "One clear photo of you is all it needs" },
      { title: "Pick an outfit", text: "Share a product image from any shopping app, or pick a style" },
      { title: "See it on you", text: "The outfit is fitted on your photo, with the drape and colour" },
    ],
    benefits: [
      { icon: "🥻", title: "Made for Indian fashion", text: "Sarees, lehengas, kurtis, salwar suits and anarkalis, not just t-shirts and jeans" },
      { icon: "🪞", title: "Still looks like you", text: "Keeps your real face, skin tone and body shape, never a random model" },
      { icon: "🛍️", title: "Try from anywhere", text: "Found something online? Share the image and try it on right away" },
      { icon: "🎉", title: "Every occasion", text: "Wedding looks, festive outfits, party dresses and office wear" },
      { icon: "✏️", title: "Edit with words", text: "Type a halter top or wavy hair and see the change on your photo" },
      { icon: "💸", title: "Fewer returns", text: "Know the fit and colour before you spend a rupee" },
    ],
    playUrl: "https://play.google.com/store/apps/details?id=in.garoono.dressmirror",
    appStoreUrl: "https://apps.apple.com/us/app/dressmirror-ai-shoot-try-on/id6781407057",
    screenshots: shots("dress-mirror", 6),
    category: "LifestyleApplication",
    seoTitle: "Dress Mirror: AI Virtual Try On for Sarees, Lehengas and More",
    seoDescription:
      "Try sarees, lehengas, kurtis and western outfits on your own photo before you buy, on Android and iPhone",
  },
  {
    slug: "pushpass",
    productId: 13,
    tagline: "Earn your scroll time with a quick workout",
    problem: [
      "You open your phone for one thing and lose an hour to reels",
      "App timers are easy to dismiss, so they never stick",
      "You want to move more, but the couch keeps winning",
    ],
    result: [
      "Distracting apps stay locked until you earn them back",
      "Every rep buys you minutes, so scrolling has a real cost",
      "You end the day with less wasted time and more reps done",
    ],
    steps: [
      { title: "Pick apps to block", text: "Choose the apps and feeds that eat your time" },
      { title: "Move to unlock", text: "Pushups, squats, planks or jumping jacks, counted by your camera" },
      { title: "Get your minutes", text: "Each rep or plank second adds screen time, at a rate you set" },
    ],
    benefits: [
      { icon: "🏋️", title: "Pick your exercise", text: "Pushups, squats, planks and jumping jacks, so it never gets boring" },
      { icon: "💪", title: "Real reps only", text: "Pose detection checks your form and ignores half reps" },
      { icon: "📵", title: "Breaks the scroll habit", text: "A small cost on every open turns autopilot into a choice" },
      { icon: "⚙️", title: "Your rules", text: "Decide how much exercise buys how many minutes, per app" },
      { icon: "🔒", title: "Private by design", text: "Rep counting runs on your phone, no video leaves it" },
      { icon: "📈", title: "See your progress", text: "Track reps done and screen time saved over the weeks" },
    ],
    playUrl: "https://play.google.com/store/apps/details?id=in.garoono.pushpass",
    appStoreUrl: "https://apps.apple.com/in/app/pushpass-screen-time-blocker/id6780573210",
    websiteUrl: "https://pushpass.in",
    screenshots: shots("pushpass", 6),
    category: "HealthApplication",
    seoTitle: "PushPass: App Blocker That Makes You Exercise to Unlock",
    seoDescription: "Block distracting apps and unlock them with pushups, squats, planks or jumping jacks your camera counts",
  },
  {
    slug: "xlsheet-ai",
    productId: 2,
    tagline: "Spreadsheet formulas, SQL and macros from plain words",
    problem: [
      "You know what you want from the sheet but not the formula",
      "A table arrives as a photo and you have to retype it",
      "Macros and scripts feel like a different language",
    ],
    result: [
      "Describe it in plain words and get a working formula",
      "Snap a table and get an editable spreadsheet file",
      "Get macros, SQL and regex ready to paste",
    ],
    steps: [
      { title: "Say what you need", text: "Type it like you would ask a colleague" },
      { title: "Get the answer", text: "A formula, script or query with a short explanation" },
      { title: "Use it", text: "Copy it into your sheet or edit the file right in the app" },
    ],
    benefits: [
      { icon: "🧮", title: "Formula generator", text: "Sum only weekends, count unique names, handle blanks, in seconds" },
      { icon: "📷", title: "Photo to spreadsheet", text: "Turn a picture of a table into a real XLSX file, no retyping" },
      { icon: "📂", title: "Edit real files", text: "Open, edit and save XLSX, or export as CSV and PDF on your phone" },
      { icon: "🤖", title: "Macros and scripts", text: "Turn plain instructions into working automation" },
      { icon: "🗄️", title: "SQL and regex", text: "Write queries and patterns without memorising the syntax" },
      { icon: "🚪", title: "No login", text: "Open the app and start, nothing to sign up for" },
    ],
    playUrl: "https://play.google.com/store/apps/details?id=in.garoono.xlsheetai",
    appStoreUrl: "https://apps.apple.com/in/app/xlsheetai-excel-formula-sql/id6755627033",
    websiteUrl: "https://xlsheetai.com",
    screenshots: shots("xlsheet-ai", 6),
    category: "BusinessApplication",
    seoTitle: "XLSheet AI: AI Formula Generator, SQL and Spreadsheet Editor",
    seoDescription: "Turn plain words into spreadsheet formulas, macros, SQL and regex, and photos of tables into XLSX files",
  },
  {
    slug: "japmala",
    productId: 14,
    tagline: "Your 108 bead mala, always in your pocket",
    problem: [
      "You lose count halfway through a mala",
      "Carrying a physical mala everywhere is not always possible",
      "It is hard to keep a daily jaap habit going",
    ],
    result: [
      "Every bead is counted, with sound and a gentle vibration",
      "Chant anywhere, on the metro or in the office break",
      "Streaks and charts keep your sadhana steady",
    ],
    steps: [
      { title: "Choose your naam", text: "Radhe Radhe, Hare Krishna, Om Namah Shivaya, Shree Ram or your own" },
      { title: "Tap to chant", text: "Each tap moves one bead on a 108 bead digital mala" },
      { title: "Watch it grow", text: "Daily, monthly and yearly totals with your streak" },
    ],
    benefits: [
      { icon: "📿", title: "Feels like a real mala", text: "Bead sounds, vibration and a chime when a mala completes" },
      { icon: "🎯", title: "Set your targets", text: "108, 216, 1008 or any count you want for each mantra" },
      { icon: "✍️", title: "Log past jaap", text: "Add counts from your physical counter for any date" },
      { icon: "🧘", title: "Meditation timer", text: "Calm focus sessions with background music" },
      { icon: "📖", title: "Kathayein offline", text: "Devotional stories from the Ramayan, Mahabharat and more" },
      { icon: "📴", title: "Works offline", text: "Free, no login, and no internet needed" },
    ],
    playUrl: "https://play.google.com/store/apps/details?id=in.garoono.japmala",
    appStoreUrl: "https://apps.apple.com/in/app/japmala-naam-jaap-counter/id6782950756",
    websiteUrl: "https://japmala.pro",
    screenshots: shots("japmala", 6),
    category: "LifestyleApplication",
    seoTitle: "JapMala: Naam Jaap Counter and 108 Bead Digital Mala",
    seoDescription: "Count mantras on a 108 bead digital mala, track your daily jaap streak and read devotional kathas offline",
  },
  {
    slug: "habitide",
    productId: 3,
    tagline: "Build habits you can actually see",
    problem: [
      "Habit apps turn into a list of checkboxes you stop opening",
      "You can't tell if you are really improving",
      "Doing it alone makes it easy to quit",
    ],
    result: [
      "A growth radar shows how you are changing week by week",
      "Photo proof check-ins make every day count",
      "Share streaks with friends and keep each other going",
    ],
    steps: [
      { title: "Set your habits", text: "Daily, weekly or any schedule that fits your life" },
      { title: "Check in with proof", text: "Snap a photo or tick it off, then rate your day" },
      { title: "See yourself grow", text: "Your radar and streaks show the real pattern" },
    ],
    benefits: [
      { icon: "🕸️", title: "Growth radar", text: "Productivity, discipline, effort and mood in one picture" },
      { icon: "📸", title: "Snap proof", text: "Photo check-ins that turn into shareable story cards" },
      { icon: "🔥", title: "Streaks that motivate", text: "Celebrate milestones with friends or keep them private" },
      { icon: "🙂", title: "Daily mood check-in", text: "Rate your day and spot what helps and what drains you" },
      { icon: "⏰", title: "Smart reminders", text: "Nudges at the right time for morning or evening routines" },
    ],
    playUrl: "https://play.google.com/store/apps/details?id=in.garoono.habitide",
    appStoreUrl: "https://apps.apple.com/in/app/habitide-daily-habit-tracker/id6745226793",
    websiteUrl: "https://habitide.in",
    screenshots: shots("habitide", 6),
    category: "HealthApplication",
    seoTitle: "Habitide: Daily Habit Tracker with Photo Proof and Streaks",
    seoDescription: "Track habits with photo proof, streaks with friends and a growth radar that shows how you are changing",
  },
  {
    slug: "snappdf-pro",
    productId: 11,
    tagline: "Scan, edit and sign PDFs, all on your phone",
    problem: [
      "You need to send a document and there is no scanner nearby",
      "PDFs are too big to email, or in the wrong order",
      "Most PDF apps want an account or a subscription for basics",
    ],
    result: [
      "Clean scans with the edges cropped for you",
      "Merge, split, compress and sign in a few taps",
      "Core features are free and everything stays on your phone",
    ],
    steps: [
      { title: "Scan or import", text: "Use the camera or pick photos and files" },
      { title: "Fix it up", text: "Crop, filter, reorder, merge or compress" },
      { title: "Share it", text: "Sign, add a password and send the PDF" },
    ],
    benefits: [
      { icon: "📄", title: "Sharp scans", text: "Auto edge detection with black and white or high contrast filters" },
      { icon: "🧩", title: "Merge and split", text: "Combine PDFs or break them into smaller files" },
      { icon: "🗜️", title: "Compress", text: "Shrink big PDFs so they fit in an email" },
      { icon: "✍️", title: "Sign and protect", text: "Add your signature, a watermark or a password" },
      { icon: "📴", title: "Works offline", text: "Your documents never leave your device" },
      { icon: "🆓", title: "No watermark on the free plan", text: "Core features without an account or subscription" },
    ],
    playUrl: "https://play.google.com/store/apps/details?id=in.garoono.snappdf",
    appStoreUrl: "https://apps.apple.com/in/app/pdf-scanner-editor-snappdf/id6772768385",
    screenshots: shots("snappdf-pro", 6),
    category: "BusinessApplication",
    seoTitle: "SnapPDF: PDF Scanner, Editor, Compressor and Signer",
    seoDescription: "Scan documents, convert photos to PDF, merge, split, compress, sign and lock PDFs offline on Android and iPhone",
  },
  {
    slug: "focuson",
    productId: 6,
    tagline: "A flip clock focus timer that shows if your focus is working",
    problem: [
      "You sit down to work and the first ten minutes go to planning",
      "Timers track time but not whether you actually focused",
      "Productivity apps get so busy you stop using them",
    ],
    result: [
      "Start a session in two taps with tasks ready to go",
      "Tag how focused you felt and see your real deep work",
      "A calm full screen flip clock keeps you in the work",
    ],
    steps: [
      { title: "Pick a session", text: "25, 50 or 75 minutes, with a name and tasks" },
      { title: "Work with the flip clock", text: "Your time and current task, full screen" },
      { title: "Review the session", text: "Tasks done, breaks taken and how focused you felt" },
    ],
    benefits: [
      { icon: "⏱️", title: "Beautiful flip clock", text: "A minimal full screen timer that is easy on the eyes" },
      { icon: "🤖", title: "AI task ideas", text: "Get session tasks in seconds when you don't know where to start" },
      { icon: "🎯", title: "Focus tagging", text: "Log focused, neutral or distracted to measure quality, not just time" },
      { icon: "📊", title: "Session insights", text: "Deep work hours, daily averages and your best days" },
      { icon: "☕", title: "Break analytics", text: "See how you rest, because breaks matter too" },
    ],
    playUrl: "https://play.google.com/store/apps/details?id=in.garoono.focuson",
    appStoreUrl: "https://apps.apple.com/in/app/focuson-flip-clock-pomodoro/id6751473488",
    screenshots: shots("focuson", 6),
    category: "ProductivityApplication",
    seoTitle: "FocusOn: Flip Clock Pomodoro Timer for Deep Work",
    seoDescription: "A minimal flip clock Pomodoro timer that tracks how focused you felt and shows your deep work hours",
  },
  {
    slug: "shots",
    productId: 4,
    tagline: "Turn plain screenshots into posts people stop for",
    problem: [
      "Raw screenshots look flat when you share them",
      "Making a clean mockup means opening a heavy design tool",
      "Every platform wants a different image size",
    ],
    result: [
      "Backgrounds, shadows and rounded corners in one tap",
      "Drop screenshots into phone, tablet or laptop frames",
      "Export the right size for every platform",
    ],
    steps: [
      { title: "Import a screenshot", text: "From your gallery or a fresh capture" },
      { title: "Style it", text: "Pick a background, frame, padding and shadow" },
      { title: "Export", text: "Choose the size and save or share in seconds" },
    ],
    benefits: [
      { icon: "🎨", title: "Backgrounds", text: "Solid colours, gradients, blur or your own image" },
      { icon: "📱", title: "Device mockups", text: "Phone, tablet, laptop and browser frames" },
      { icon: "📐", title: "Every size ready", text: "Posts, stories, reels, thumbnails and custom sizes" },
      { icon: "✨", title: "Polish in a tap", text: "Padding, corner radius, shadow and glow" },
      { icon: "💾", title: "High quality export", text: "PNG or JPG, with transparent export supported" },
    ],
    playUrl: "https://play.google.com/store/apps/details?id=in.garoono.shots",
    appStoreUrl: "https://apps.apple.com/in/app/shots-screenshot-beautifier/id6763390178",
    screenshots: shots("shots", 5),
    category: "DesignApplication",
    seoTitle: "Shots: Screenshot Beautifier and Device Mockup Maker",
    seoDescription: "Add backgrounds, frames and shadows to screenshots and export them at the right size for every platform",
  },
  {
    slug: "sparkmate",
    productId: 15,
    tagline: "An AI companion who remembers you",
    problem: [
      "Most chatbots forget you the moment you close them",
      "Typing everything out feels stiff when you just want to talk",
      "Sometimes you want company without the pressure",
    ],
    result: [
      "Your companion remembers what you share and picks up where you left off",
      "Talk out loud with voice and video calls",
      "Chat about anything, any time, at your own pace",
    ],
    steps: [
      { title: "Choose a companion", text: "Each character has her own look, voice and personality" },
      { title: "Chat or call", text: "Type, talk hands free or start a video call" },
      { title: "Build a bond", text: "The longer you talk, the better she knows you" },
    ],
    benefits: [
      { icon: "🧠", title: "Long term memory", text: "Pin what matters and it never fades" },
      { icon: "📞", title: "Voice calls", text: "Natural speech with no button to hold" },
      { icon: "🎥", title: "Video calls", text: "She reacts to what your camera shows" },
      { icon: "🎭", title: "Real personalities", text: "Sweet, bold or thoughtful, every character is different" },
    ],
    playUrl: "https://play.google.com/store/apps/details?id=in.garoono.sparkmate",
    screenshots: shots("sparkmate", 6),
    category: "EntertainmentApplication",
    seoTitle: "SparkMate: AI Companion Chat with Voice and Video Calls",
    seoDescription: "Chat, call and video call with an AI companion who has her own personality and remembers you",
  },
  {
    slug: "apna-rss",
    productId: 1,
    tagline: "Know the Sangh, its history, songs and service work",
    problem: [
      "Reliable information about the Sangh is scattered across many places",
      "Shakha geet and prayers are hard to find in one place",
      "New swayamsevaks don't know where to start",
    ],
    result: [
      "History, ideas and service work explained simply in Hindi",
      "Geet, prarthana and more in one organised app",
      "A clear place to learn and share with others",
    ],
    steps: [
      { title: "Open a section", text: "Sangh parichay, geet, service work and more" },
      { title: "Read and listen", text: "Simple Hindi content made for everyday reading" },
      { title: "Share", text: "Pass on what inspires you to friends and family" },
    ],
    benefits: [
      { icon: "📜", title: "Sangh parichay", text: "History, founders and core ideas in one place" },
      { icon: "🎵", title: "Geet collection", text: "Inspiring songs and prayers, organised for easy use" },
      { icon: "🤝", title: "Service work", text: "Learn about the Sangh's seva activities across the country" },
      { icon: "🇮🇳", title: "In Hindi", text: "Written simply so everyone can read it" },
    ],
    playUrl: "https://play.google.com/store/apps/details?id=com.garoono.apnarss",
    screenshots: shots("apna-rss", 6),
    category: "ReferenceApplication",
    seoTitle: "Apna RSS: Learn About the Rashtriya Swayamsevak Sangh",
    seoDescription: "History, ideas, geet and service work of the Rashtriya Swayamsevak Sangh, explained simply in Hindi",
  },
  {
    slug: "xml-viewer",
    productId: 8,
    tagline: "Open, edit and convert XML files on your phone",
    problem: [
      "Someone sends an XML file and your phone shows a wall of text",
      "Finding one broken tag in a big file takes forever",
      "You need the data as PDF or JSON, not XML",
    ],
    result: [
      "Readable XML with colours, line numbers and a tree view",
      "The validator points straight to the error",
      "Convert to PDF or JSON and share in seconds",
    ],
    steps: [
      { title: "Open the file", text: "From downloads, email attachments or cloud storage" },
      { title: "Read or edit", text: "Switch between the code view and the tree view" },
      { title: "Validate or convert", text: "Check for errors, then export as PDF or JSON" },
    ],
    benefits: [
      { icon: "🌳", title: "Tree view", text: "Expand and collapse nodes and tap to see attributes" },
      { icon: "🖍️", title: "Syntax highlighting", text: "Line numbers, auto indent and find and replace" },
      { icon: "✅", title: "Validator", text: "Finds missing closing tags and broken attributes" },
      { icon: "🔄", title: "Convert", text: "XML to PDF for sharing or JSON for data work" },
      { icon: "📦", title: "Handles big files", text: "Smooth scrolling through large documents" },
    ],
    playUrl: "https://play.google.com/store/apps/details?id=in.garoono.xmlviewer",
    screenshots: shots("xml-viewer", 5),
    category: "DeveloperApplication",
    seoTitle: "XML Viewer: Open, Edit, Validate and Convert XML on Android",
    seoDescription: "View XML with a tree view and syntax highlighting, fix errors with the validator and convert to PDF or JSON",
  },
  {
    slug: "json-view",
    productId: 7,
    tagline: "Read, edit and format JSON in seconds",
    problem: [
      "A JSON file on your phone is one unreadable line",
      "Deeply nested data is impossible to follow",
      "Most JSON apps are full of ads or need an account",
    ],
    result: [
      "A clean tree view shows the structure at a glance",
      "Edit, format and validate without a laptop",
      "Offline, no account and no ads",
    ],
    steps: [
      { title: "Open a .json file", text: "From downloads, email or any file app" },
      { title: "Explore", text: "Switch between the tree view and highlighted text" },
      { title: "Fix and save", text: "Edit values, format and validate, then share" },
    ],
    benefits: [
      { icon: "🌳", title: "Tree view", text: "Key names, types and child counts at a glance" },
      { icon: "🖍️", title: "Syntax highlighting", text: "Colour coded text view with line numbers" },
      { icon: "✏️", title: "Edit in place", text: "Fix typos, update values and restructure data" },
      { icon: "✅", title: "Format and validate", text: "Pretty print and catch errors before they bite" },
      { icon: "🛡️", title: "Private and clean", text: "Works offline, no account, no ads" },
    ],
    playUrl: "https://play.google.com/store/apps/details?id=in.garoono.jsonviewer",
    appStoreUrl: "https://apps.apple.com/in/app/json-view-editor-formatter/id6762811010",
    screenshots: shots("json-view", 5),
    category: "DeveloperApplication",
    seoTitle: "JSON View: JSON Viewer, Editor and Formatter",
    seoDescription: "Open JSON files in a tree view, edit with syntax highlighting, format and validate, offline with no ads",
  },
  {
    slug: "nailmirror",
    productId: 16,
    tagline: "Try nail art on your own hand before the salon",
    problem: [
      "Nail designs look great online and different on your hands",
      "Explaining the look you want to your nail tech is hard",
      "A manicure you don't love lasts for weeks",
    ],
    result: [
      "See any design on your real hand, skin tone and nail shape",
      "Show your nail tech the exact look and the reference together",
      "Walk in sure the manicure will suit you",
    ],
    steps: [
      { title: "Photograph your hand", text: "One clear photo of your nails" },
      { title: "Pick or describe a design", text: "Choose a trend, upload inspo or type what you want" },
      { title: "See it on you", text: "The design appears on your nails in seconds" },
    ],
    benefits: [
      { icon: "💅", title: "Trending designs", text: "Chrome, glazed, aura, cat eye, micro french and more" },
      { icon: "🖼️", title: "Upload any inspo", text: "Recreate a saved design on your own nails" },
      { icon: "⌨️", title: "Describe it", text: "Type the look you want and watch it appear" },
      { icon: "✋", title: "Your real hand", text: "Your skin tone and nail shape, never a model's hand" },
      { icon: "📤", title: "Share with your nail tech", text: "Send the result and the reference together" },
    ],
    playUrl: "https://play.google.com/store/apps/details?id=in.garoono.nailmirror",
    appStoreUrl: "https://apps.apple.com/in/app/nailmirror-ai-nail-try-on-art/id6788501057",
    screenshots: shots("nailmirror", 6),
    category: "LifestyleApplication",
    seoTitle: "NailMirror: AI Nail Art Try On on Your Own Hand",
    seoDescription: "See chrome, french, gel and trending nail designs on your own hand before your salon appointment",
  },
  {
    slug: "bhaktidhun",
    productId: 5,
    tagline: "Bhajans, aartis and chalisas for every devotee",
    problem: [
      "Finding the right aarti at puja time means searching everywhere",
      "Devotional songs are scattered across many places",
      "Kathas and leelas are hard to read on the go",
    ],
    result: [
      "Bhajans, aartis and chalisas sorted by deity",
      "A simple player that is easy for every age",
      "Kathas and leelas to read like a book",
    ],
    steps: [
      { title: "Pick your deity", text: "Each bhagwan has their own collection" },
      { title: "Choose a bhajan or aarti", text: "Play, pause and move between songs easily" },
      { title: "Read kathas", text: "Stories and leelas laid out like a book" },
    ],
    benefits: [
      { icon: "🪔", title: "Aartis and chalisas", text: "The prayers you need at puja time, ready to play" },
      { icon: "🎶", title: "Bhajan collection", text: "Devotional songs for every deity in one place" },
      { icon: "📖", title: "Katha and leela", text: "Read devotional stories like a book" },
      { icon: "👵", title: "Easy for everyone", text: "A simple player made for elders and children too" },
    ],
    playUrl: "https://play.google.com/store/apps/details?id=com.garoono.bhaktidhunsanatan",
    screenshots: shots("bhaktidhun", 5),
    category: "MultimediaApplication",
    seoTitle: "BhaktiDhun: Bhajans, Aartis, Chalisas and Kathas",
    seoDescription: "Bhajans, aartis and chalisas sorted by deity, with kathas and leelas to read, in one simple devotional app",
  },
];

export const appPageBySlug = (slug: string) => appPages.find((p) => p.slug === slug);
export const appPageByProduct = (productId: number) => appPages.find((p) => p.productId === productId);
