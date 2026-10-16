/* Site settings. Add contact details below and they appear automatically; leave blank to hide. */
const CONFIG = {
  /* Backend (Supabase): paste your project URL and anon key to switch on admin events, photo swapping and activity log. See README. */
  supabaseUrl: "",   // e.g. "https://abcdxyz.supabase.co"
  supabaseKey: "",   // the public "anon" key
  name: "ROKI Resort",
  location: "Kaewa, Masinga, Kenya",
  plusCode: "3MFH+Q6 Kaewa",
  phone: "",       // e.g. "+254 7XX XXX XXX"
  whatsapp: "",    // e.g. "2547XXXXXXXX" (no + or spaces)
  email: "",       // e.g. "info@rokiresort.co.ke"
  facebook: "https://www.facebook.com/p/ROKI-Resort-KAEWA-Masinga-61590518453833/",
  about: "ROKI Resort is a welcoming destination in Kaewa, Masinga, where a landscaped fountain courtyard, good food and open skies set the scene for weekend breaks, family outings, celebrations and business gatherings.",
  features: ["Fountain courtyard","Swimming pool","Conference rooms","On-site supermarket","Restaurant & refreshments","Event & group space"],
  rooms: [
    {name:"Standard Room", sleeps:2, desc:"A comfortable, well-kept room for a restful night away."},
    {name:"Deluxe Room", sleeps:2, desc:"Extra space and comfort for couples and weekend guests."},
    {name:"Family Suite", sleeps:4, desc:"Generous room for families and small groups travelling together."}
  ],
  dining: [
    {name:"Restaurant", desc:"Freshly prepared meals served in a relaxed, open setting."},
    {name:"Refreshments & Bar", desc:"Cold drinks and light bites, perfect for unwinding outdoors."}
  ],
  events: [
    {name:"Weddings & Celebrations", desc:"A striking fountain courtyard for ceremonies, receptions and parties."},
    {name:"Conferences & Retreats", desc:"Conference rooms for meetings, workshops and corporate days out, in a quiet setting."},
    {name:"Family & Group Days", desc:"Space to gather, picnic and enjoy the day together."}
  ],
  leisure: ["Swimming pool","Fountain courtyard","Garden strolls","Open-air relaxation","Family outings","Nearby Masinga countryside"],
  faqs: [
    {k:["pool","swim"], a:"Yes, ROKI has a swimming pool for guests to enjoy. Message us for opening times."},
    {k:["conference","meeting room","boardroom","seminar","workshop"], a:"Yes, conference rooms are available for meetings, workshops and corporate events. Tell us your date and group size and we will prepare a quote."},
    {k:["pet","dog"], a:"Please contact our team to confirm our pet policy."},
    {k:["pay","mpesa","m-pesa","card","cash"], a:"Our team will confirm accepted payment methods when you book."},
    {k:["cancel","refund"], a:"Cancellation terms depend on the booking. Please contact us and we will share them."},
    {k:["kids","child","family"], a:"Families are very welcome. Our Family Suite is ideal for groups of up to four."},
    {k:["supermarket","shop","groceries"], a:"Yes, the ROKI Supermarket is located on the grounds for guests' convenience."}
  ]
};
