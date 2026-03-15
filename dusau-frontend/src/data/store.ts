export type NavLink = {
  label: string
  href: string
}

export type StatItem = {
  value: string
  label: string
  detail?: string
}

export type EventItem = {
  id: string
  title: string
  category: string
  date: string
  location: string
  description: string
  image: string
  featured?: boolean
}

export type CommitteeMember = {
  name: string
  role: string
  department: string
  session: string
  bio: string
  image: string
}

export type CommitteeYear = {
  year: string
  summary: string
  members: CommitteeMember[]
}

export type AlumniMember = {
  name: string
  batch: string
  department: string
  currentRole: string
  company: string
  note: string
  image: string
}

export type GalleryItem = {
  id: string
  title: string
  caption: string
  image: string
}

export type BloodGroupItem = {
  group: string
  available: number
}

export type ContactCard = {
  title: string
  value: string
  description: string
}

export type AdminModule = {
  title: string
  description: string
  count: string
}

export const siteConfig = {
  name: 'DUSAU',
  fullName: 'Dhaka University Students Association of Uttara',
  tagline: 'Students from Uttara, united at Dhaka University.',
  shortDescription:
    'A student-led community for welcome, welfare, service, leadership, and lifelong connection.',
  description:
    'DUSAU is a student-run organization that connects Dhaka University students from Uttara through social work, yearly committee leadership, alumni connection, student support, and community-driven events.',
  location: 'Uttara, Dhaka • Dhaka University, Bangladesh',
  email: 'hello@dusau.org',
  phone: '+880 1XXX-XXXXXX',
  heroImage: '/dusau-cover.jpg',
}

export const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Events', href: '/events' },
  { label: 'Committee', href: '/committee' },
  { label: 'Alumni', href: '/alumni' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Blood Support', href: '/blood-support' },
  { label: 'Contact', href: '/contact' },
]

export const homeStats: StatItem[] = [
  { value: '10+', label: 'Years of student legacy' },
  { value: '50+', label: 'Programs and campaigns' },
  { value: '300+', label: 'Students and alumni connected' },
  { value: '24/7', label: 'Emergency support mindset' },
]

export const impactAreas = [
  {
    title: 'Nobinboron & student welcome',
    description:
      'Every year new Dhaka University students from Uttara are welcomed, guided, introduced, and connected with seniors.',
  },
  {
    title: 'Relief & social service',
    description:
      'From flood relief to food support, DUSAU stands beside people in difficult moments through student-driven action.',
  },
  {
    title: 'Winter clothing & welfare',
    description:
      'Seasonal campaigns are organized to support underprivileged people through clothing distribution and community service.',
  },
  {
    title: 'Sports, bonding, and culture',
    description:
      'Football, cricket, hangouts, and cultural moments help build friendships, identity, and unity across batches.',
  },
]

export const journeySteps = [
  {
    step: '01',
    title: 'Students arrive at Dhaka University',
    description:
      'New students from different colleges and backgrounds enter DU and begin a new chapter.',
  },
  {
    step: '02',
    title: 'DUSAU welcomes and connects them',
    description:
      'Through nobinboron, mentorship, community support, and events, they quickly become part of a shared network.',
  },
  {
    step: '03',
    title: 'A new committee takes responsibility',
    description:
      'Each year new student leaders take over and continue the work of service, organization, and growth.',
  },
  {
    step: '04',
    title: 'They become alumni and give back',
    description:
      'Past committee members and seniors move into alumni roles and continue strengthening the DUSAU community.',
  },
]

export const events: EventItem[] = [
  {
    id: 'evt-1',
    title: 'Nobinboron 2026',
    category: 'Welcome Program',
    date: '12 January 2026',
    location: 'TSC, Dhaka University',
    description:
      'A warm welcome event for newly admitted students from Uttara, with introductions, mentoring, photos, speeches, and a shared meal.',
    image: siteConfig.heroImage,
    featured: true,
  },
  {
    id: 'evt-2',
    title: 'Street Food Distribution Drive',
    category: 'Social Work',
    date: '08 February 2026',
    location: 'Dhaka City',
    description:
      'Committee members coordinated a community food support drive and distributed meal packs with dignity and care.',
    image: siteConfig.heroImage,
    featured: true,
  },
  {
    id: 'evt-3',
    title: 'Winter Clothing Support Campaign',
    category: 'Welfare',
    date: '19 December 2025',
    location: 'Uttara & Nearby Areas',
    description:
      'A seasonal welfare initiative focused on collecting and distributing warm clothes to people in need during winter.',
    image: siteConfig.heroImage,
    featured: true,
  },
  {
    id: 'evt-4',
    title: 'Flood Relief Response',
    category: 'Emergency Response',
    date: '21 August 2025',
    location: 'Flood-affected region',
    description:
      'Students organized emergency supply support including dry food, medicine essentials, and shelter assistance.',
    image: siteConfig.heroImage,
  },
  {
    id: 'evt-5',
    title: 'DUSAU Cricket Day',
    category: 'Sports',
    date: '15 November 2025',
    location: 'University Ground',
    description:
      'A friendly tournament that strengthened bonding between batches, seniors, current committee members, and alumni.',
    image: siteConfig.heroImage,
  },
  {
    id: 'evt-6',
    title: 'Career Adda with Alumni',
    category: 'Networking',
    date: '04 October 2025',
    location: 'Uttara Community Hall',
    description:
      'An alumni-focused session where seniors shared stories, career advice, and practical guidance with current students.',
    image: siteConfig.heroImage,
  },
]

export const committeeYears: CommitteeYear[] = [
  {
    year: '2026',
    summary:
      'Current working committee focused on student welcome, community relief, coordination, and digital growth.',
    members: [
      {
        name: 'Ahsan Karim',
        role: 'President',
        department: 'Economics',
        session: '2022-23',
        bio: 'Leads the overall direction of the organization and coordinates large initiatives.',
        image: siteConfig.heroImage,
      },
      {
        name: 'Mahin Chowdhury',
        role: 'General Secretary',
        department: 'Political Science',
        session: '2022-23',
        bio: 'Manages internal coordination, documentation, and execution across committee work.',
        image: siteConfig.heroImage,
      },
      {
        name: 'Nafisa Rahman',
        role: 'Organizing Secretary',
        department: 'Sociology',
        session: '2023-24',
        bio: 'Oversees event logistics, planning, volunteer flow, and organizational discipline.',
        image: siteConfig.heroImage,
      },
      {
        name: 'Tanvir Hasan',
        role: 'Treasurer',
        department: 'Accounting',
        session: '2023-24',
        bio: 'Supports budgeting, donation tracking, and transparent financial coordination.',
        image: siteConfig.heroImage,
      },
      {
        name: 'Sadia Islam',
        role: 'Social Welfare Secretary',
        department: 'English',
        session: '2023-24',
        bio: 'Helps design social campaigns and coordinate community-focused support programs.',
        image: siteConfig.heroImage,
      },
      {
        name: 'Rahat Ahmed',
        role: 'Cultural & Sports Secretary',
        department: 'History',
        session: '2023-24',
        bio: 'Runs bonding events, sports activities, and experience-building programs for members.',
        image: siteConfig.heroImage,
      },
    ],
  },
  {
    year: '2025',
    summary:
      'Focused on relief initiatives, alumni engagement, and building continuity across batches.',
    members: [
      {
        name: 'Sabbir Hossain',
        role: 'President',
        department: 'Management',
        session: '2021-22',
        bio: 'Led welfare campaigns and yearly event direction.',
        image: siteConfig.heroImage,
      },
      {
        name: 'Nusrat Jahan',
        role: 'General Secretary',
        department: 'Law',
        session: '2021-22',
        bio: 'Managed execution, communication, and committee handover.',
        image: siteConfig.heroImage,
      },
      {
        name: 'Fahim Islam',
        role: 'Organizing Secretary',
        department: 'Geography',
        session: '2022-23',
        bio: 'Worked on logistics and member coordination.',
        image: siteConfig.heroImage,
      },
      {
        name: 'Tania Noor',
        role: 'Welfare Secretary',
        department: 'Islamic Studies',
        session: '2022-23',
        bio: 'Helped organize student support and charity work.',
        image: siteConfig.heroImage,
      },
    ],
  },
  {
    year: '2024',
    summary:
      'Worked on strengthening the identity of DUSAU through bonding, welcome events, and service.',
    members: [
      {
        name: 'Imran Kabir',
        role: 'President',
        department: 'Mathematics',
        session: '2020-21',
        bio: 'Led committee structure and major annual programs.',
        image: siteConfig.heroImage,
      },
      {
        name: 'Samira Tasnim',
        role: 'General Secretary',
        department: 'Philosophy',
        session: '2020-21',
        bio: 'Supported planning and internal operations.',
        image: siteConfig.heroImage,
      },
      {
        name: 'Nayeem Rahman',
        role: 'Treasurer',
        department: 'Finance',
        session: '2021-22',
        bio: 'Maintained financial records and budgeting.',
        image: siteConfig.heroImage,
      },
      {
        name: 'Farzana Islam',
        role: 'Cultural Secretary',
        department: 'Bangla',
        session: '2021-22',
        bio: 'Organized events, bonding activities, and participation.',
        image: siteConfig.heroImage,
      },
    ],
  },
]

export const alumni: AlumniMember[] = [
  {
    name: 'Adnan Rahim',
    batch: '2018',
    department: 'CSE',
    currentRole: 'Software Engineer',
    company: 'Leading Tech Company',
    note: 'Supports juniors with career guidance and digital strategy ideas.',
    image: siteConfig.heroImage,
  },
  {
    name: 'Mariam Sultana',
    batch: '2017',
    department: 'IBA',
    currentRole: 'Brand Strategist',
    company: 'National Brand',
    note: 'Encourages leadership, confidence, and communication growth.',
    image: siteConfig.heroImage,
  },
  {
    name: 'Shahriar Kabir',
    batch: '2016',
    department: 'Law',
    currentRole: 'Legal Associate',
    company: 'Dhaka-based Chamber',
    note: 'Contributes to alumni network building and advisory support.',
    image: siteConfig.heroImage,
  },
  {
    name: 'Tasnia Chowdhury',
    batch: '2019',
    department: 'Economics',
    currentRole: 'Research Analyst',
    company: 'Policy Think Tank',
    note: 'Helps students think bigger about impact and public service.',
    image: siteConfig.heroImage,
  },
  {
    name: 'Rafi Ahmed',
    batch: '2015',
    department: 'Marketing',
    currentRole: 'Growth Manager',
    company: 'Regional Startup',
    note: 'Strong believer in alumni mentorship and visibility for DUSAU.',
    image: siteConfig.heroImage,
  },
  {
    name: 'Nabila Islam',
    batch: '2018',
    department: 'English',
    currentRole: 'Communications Specialist',
    company: 'Development Organization',
    note: 'Supports storytelling and meaningful public communication.',
    image: siteConfig.heroImage,
  },
]

export const galleryItems: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Welcome energy',
    caption: 'Frames from a student welcome experience full of warmth and identity.',
    image: siteConfig.heroImage,
  },
  {
    id: 'gal-2',
    title: 'Community first',
    caption: 'Moments from social support activities and local service campaigns.',
    image: siteConfig.heroImage,
  },
  {
    id: 'gal-3',
    title: 'Committee in action',
    caption: 'Planning, volunteering, executing, and building trust together.',
    image: siteConfig.heroImage,
  },
  {
    id: 'gal-4',
    title: 'Shared joy',
    caption: 'Smiles, group photos, and the kind of bonding that lasts beyond campus life.',
    image: siteConfig.heroImage,
  },
  {
    id: 'gal-5',
    title: 'Relief response',
    caption: 'DUSAU standing beside people when support matters the most.',
    image: siteConfig.heroImage,
  },
  {
    id: 'gal-6',
    title: 'Sports and spirit',
    caption: 'Cricket, football, and friendly competition between batches.',
    image: siteConfig.heroImage,
  },
  {
    id: 'gal-7',
    title: 'Alumni connection',
    caption: 'Seniors returning with guidance, encouragement, and support.',
    image: siteConfig.heroImage,
  },
  {
    id: 'gal-8',
    title: 'A living legacy',
    caption: 'Every year adds another layer to the story of DUSAU.',
    image: siteConfig.heroImage,
  },
  {
    id: 'gal-9',
    title: 'Service with sincerity',
    caption: 'Organized social work driven by students and community values.',
    image: siteConfig.heroImage,
  },
]

export const bloodGroupStats: BloodGroupItem[] = [
  { group: 'A+', available: 18 },
  { group: 'A-', available: 4 },
  { group: 'B+', available: 22 },
  { group: 'B-', available: 5 },
  { group: 'AB+', available: 7 },
  { group: 'AB-', available: 2 },
  { group: 'O+', available: 20 },
  { group: 'O-', available: 3 },
]

export const contactCards: ContactCard[] = [
  {
    title: 'General contact',
    value: siteConfig.email,
    description: 'For organization information, partnerships, or general communication.',
  },
  {
    title: 'Location',
    value: siteConfig.location,
    description: 'Community-rooted in Uttara, connected to Dhaka University.',
  },
  {
    title: 'Phone',
    value: siteConfig.phone,
    description: 'Emergency and coordination contact placeholder for the demo frontend.',
  },
]

export const adminModules: AdminModule[] = [
  {
    title: 'Committee management',
    description: 'Create a new yearly committee, assign roles, and archive older committees.',
    count: '03 active archives',
  },
  {
    title: 'Event publishing',
    description: 'Add event title, date, category, gallery, summary, and highlight items.',
    count: '06 demo events',
  },
  {
    title: 'Gallery and media',
    description: 'Upload photos, assign them to events, and feature them on the homepage.',
    count: '09 gallery items',
  },
  {
    title: 'Blood support coordination',
    description: 'Manage donor data privately and respond to emergency blood requests.',
    count: '81 demo donors',
  },
  {
    title: 'Alumni directory',
    description: 'Add alumni profiles, workplace info, and mentorship opportunities.',
    count: '06 featured alumni',
  },
  {
    title: 'Homepage content',
    description: 'Update hero sections, statistics, call-to-actions, and featured campaigns.',
    count: 'Fully editable',
  },
]