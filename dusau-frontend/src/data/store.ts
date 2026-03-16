export type Language = 'en' | 'bn'

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

const heroImage = '/dusau-cover.jpg'
const email = 'hello@dusau.org'
const phone = '+880 1XXX-XXXXXX'

export const localizedContent = {
  en: {
    siteConfig: {
      name: 'DUSAU',
      fullName: 'Dhaka University Students Association of Uttara',
      tagline: 'Students from Uttara, united at Dhaka University.',
      shortDescription:
        'A student-led community for welcome, welfare, service, leadership, and lifelong connection.',
      description:
        'DUSAU is a student-run organization that connects Dhaka University students from Uttara through social work, yearly committee leadership, alumni connection, student support, and community-driven events.',
      location: 'Uttara, Dhaka • Dhaka University, Bangladesh',
      email,
      phone,
      heroImage,
    },

    common: {
      adminDemoLabel: 'Admin Demo',
      goToTop: '↑ Go to top',
    },

    footer: {
      description:
        'Dhaka University Students Association of Uttara is a student-led platform connecting Dhaka University students from Uttara through service, welcome, community, and legacy.',
      exploreHeading: 'Explore',
      contactHeading: 'Contact',
      copyrightNote:
        'Frontend demo crafted for presentation and future backend integration.',
    },

    hero: {
      eyebrow: 'Student-led • Service-driven • Uttara to DU',
      titleLead: 'A modern digital home for',
      description:
        'Dhaka University Students Association of Uttara is a student-run platform built around welcome, welfare, events, alumni connection, and meaningful social work. This frontend is designed as a premium showcase that can later connect to a real admin dashboard and backend.',
      primaryCta: 'See recent events',
      secondaryCta: 'View admin demo',
      annualCycleLabel: 'Annual committee cycle',
      annualCycleText:
        'New students join. A new committee leads. Alumni stay connected. The story continues every year.',
      platformVisionLabel: 'Platform vision',
      platformVisionText:
        'Public-facing impact website now, dynamic backend-powered system next.',
    },

    homePage: {
      introEyebrow: 'Why this platform matters',
      introTitle:
        'DUSAU is not just an organization. It is a living student legacy.',
      introPara1:
        'Every year a new group of students joins Dhaka University from Uttara. They need connection, belonging, guidance, and community. DUSAU becomes that bridge. It welcomes them, serves people through social work, organizes events, and turns one year’s committee into the next year’s alumni foundation.',
      introPara2:
        'This frontend is built to showcase that energy in a modern way: premium visuals outside, dynamic admin-ready structure inside.',
      recentEventsEyebrow: 'Recent highlights',
      recentEventsTitle:
        'The homepage can immediately show what DUSAU is doing now',
      recentEventsDescription:
        'From welcome programs to social work, relief, winter support, sports, and alumni sessions — this is where your organization starts to look active, trusted, and alive.',
      exploreAllEvents: 'Explore all events',
      leadershipEyebrow: 'Current leadership',
      leadershipTitlePrefix: 'Meet the ',
      leadershipTitleSuffix: ' committee',
      leadershipDescription:
        'This section is designed so that every year a new committee can be displayed beautifully, while past committees remain archived.',
      emergencyEyebrow: 'Emergency support',
      emergencyTitle:
        'DUSAU can also become a serious blood-support and emergency help platform',
      emergencyPara:
        'The public website can collect urgent requests, while the donor list remains private and admin-controlled for safety. That means the site looks responsible, useful, and well organized.',
      emergencyPrimaryCta: 'Blood support page',
      emergencySecondaryCta: 'Contact DUSAU',
      emergencyCards: [
        { label: 'Public facing', value: 'Urgent request form' },
        { label: 'Private system', value: 'Donor directory for admins' },
        { label: 'Fast response', value: 'Blood group filtering later' },
        { label: 'Trust', value: 'Useful social impact feature' },
      ],
      alumniEyebrow: 'Alumni strength',
      alumniTitle:
        'A strong alumni section gives DUSAU prestige and continuity',
      alumniDescription:
        'When visitors see former members now working in good places, the organization instantly feels established, real, and respected.',
      closingEyebrow: 'Closing thought',
      closingTitle:
        'A website like this can make DUSAU feel bigger than just a Facebook page',
      closingPara1:
        'It can communicate identity, trust, activity, leadership, service, and long-term legacy. For DUSAU, the best direction is not an open social network at first. It is a premium public website plus a future admin dashboard where each new yearly committee can manage events, members, alumni, media, and support initiatives.',
      closingPara2:
        'That is the sweet spot: beautiful on the outside, dynamic on the inside, and built to grow into a real platform later.',
      closingPrimaryCta: 'Read the story',
      closingSecondaryCta: 'See future admin vision',
      demoNote:
        'Demo note: All content here is placeholder frontend content using one shared image and centralized dummy data from store.ts.',
    },

    aboutPage: {
      eyebrow: 'About DUSAU',
      title:
        'Built by students, carried by students, remembered by alumni',
      description:
        'Dhaka University Students Association of Uttara began from a simple but powerful idea: students from Uttara studying at Dhaka University should not feel disconnected. They should have a community.',
      ideaTitle: 'The idea behind the organization',
      ideaPara1:
        'DUSAU exists to create belonging. It welcomes new students, builds friendships across batches, organizes events, and channels student energy into meaningful social work. It is both a support network and a leadership platform.',
      ideaPara2:
        'Over time, what starts as a student community becomes something larger: a legacy of service, memory, responsibility, and alumni connection.',
      websiteTitle: 'What this website should do',
      websitePara1:
        'This website should make DUSAU look organized, active, and future-ready. It should show current activities publicly while quietly preparing for a dynamic admin panel where each new yearly committee can manage events, content, and people.',
      websitePara2:
        'It is not just a design project. It is a digital foundation for continuity.',
      howEyebrow: 'How it works',
      howTitle:
        'The DUSAU journey repeats every year — and that is its power',
      howDescription:
        'A strong website should reflect the yearly rhythm of welcome, leadership, service, and alumni transition.',
      coreEyebrow: 'What DUSAU stands for',
      coreTitle: 'Core areas of activity',
      coreDescription:
        'These are the kinds of work and programs the public-facing website should repeatedly highlight.',
    },

    eventsPage: {
      eyebrow: 'Events & programs',
      title:
        'One platform for social work, welcome programs, bonding, and response',
      description:
        'This page is built so future admins can keep adding events with titles, descriptions, images, videos, dates, and categories.',
    },

    committeePage: {
      eyebrow: 'Committee structure',
      titlePrefix: 'Current leadership: ',
      titleSuffix: '',
      description:
        'Every year a new committee can take over, manage the organization, publish events, and later move into the alumni archive.',
      archiveEyebrow: 'Archive',
      archiveTitle: 'Past committees should remain part of the story',
      archiveDescription:
        'Instead of deleting old leadership, this design keeps every year discoverable so DUSAU feels continuous and established.',
      archiveCardTitle: 'Yearly archive',
      archiveMembersPrefix: '',
      archiveMembersSuffix: ' members shown',
    },

    alumniPage: {
      eyebrow: 'Alumni network',
      title:
        'Former members become the long-term strength of DUSAU',
      description:
        'This page is designed to show that the organization does not end with one year’s committee. It grows into a network.',
      reasons: [
        {
          title: 'Credibility',
          description:
            'A visible alumni network immediately shows that DUSAU has history, maturity, and long-term impact.',
        },
        {
          title: 'Mentorship',
          description:
            'Alumni can support current students with career advice, emotional support, and real-world perspective.',
        },
        {
          title: 'Continuity',
          description:
            'When committees change yearly, alumni become the bridge that keeps identity and values alive.',
        },
      ],
    },

    galleryPage: {
      eyebrow: 'Gallery',
      title:
        'A visual story of service, people, memory, and movement',
      description:
        'For now this uses the same dummy image everywhere. Later each item can be tied to real events, albums, and media uploads.',
    },

    bloodSupportPage: {
      eyebrow: 'Blood support',
      title:
        'A useful and responsible feature for DUSAU’s community role',
      description:
        'This page shows how the organization can publicly support urgent needs without exposing the full donor directory to everyone.',
      heroEyebrow: 'Emergency-ready concept',
      heroTitle: 'Public requests. Private donor management.',
      heroPara:
        'This is the best model for a student organization website. The public can request help, but detailed donor information stays under trusted admin control. That keeps things safer and more professional.',
      heroPrimaryCta: 'Request support',
      heroSecondaryCta: 'See admin side',
      availableSuffix: ' demo donors available',
      workflowEyebrow: 'Suggested workflow',
      workflowTitle: 'How this feature should work later',
      workflowDescription:
        'This is one of the most practical future modules for the backend phase.',
      steps: [
        {
          title: 'Request comes in',
          description:
            'An urgent request is submitted through the public-facing form or contact channel.',
        },
        {
          title: 'Admin checks private donor list',
          description:
            'Authorized coordinators filter by blood group and availability inside the admin dashboard.',
        },
        {
          title: 'Potential donors are contacted',
          description:
            'The system keeps donor information private while allowing quick coordination.',
        },
        {
          title: 'Response is tracked',
          description:
            'Later the backend can store response status, donor availability, and emergency notes.',
        },
      ],
    },

    contactPage: {
      eyebrow: 'Contact',
      title:
        'A simple contact page now, a real submission system later',
      description:
        'For this frontend demo, the form is only visual. In the backend phase we can connect this to real storage, admin review, and email workflows.',
      form: {
        nameLabel: 'Full name',
        namePlaceholder: 'Your name',
        emailLabel: 'Email',
        emailPlaceholder: 'you@example.com',
        subjectLabel: 'Subject',
        subjectPlaceholder: 'Reason for contacting DUSAU',
        messageLabel: 'Message',
        messagePlaceholder: 'Write your message here...',
        buttonLabel: 'Demo submit button',
        note:
          'This is a frontend-only form for presentation. Real submission, validation, and dashboard review will come with the backend.',
      },
    },

    adminDemoPage: {
      eyebrow: 'Admin demo',
      title:
        'This is how the future dynamic side of DUSAU can look',
      description:
        'This page is still frontend-only, but it helps you show the organization how each new committee could manage content, people, and community data.',
      committeeEyebrow: 'Committee control',
      committeeTitle: 'Create a new committee year with one action',
      committeePara:
        'This is one of the most important features for DUSAU. Every year, a new committee should be able to take ownership, add roles, assign members, and keep older years archived automatically.',
      currentYearLabel: 'Current year',
      currentMembersLabel: 'Current members',
      currentMembersSuffix: ' shown in demo',
      publishedEventsLabel: 'Published events',
      publishedEventsSuffix: ' demo items',
      futureAccessLabel: 'Future access',
      futureAccessValue: 'Role-based admin system',
    },

    navLinks: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Events', href: '/events' },
      { label: 'Committee', href: '/committee' },
      { label: 'Alumni', href: '/alumni' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'Blood Support', href: '/blood-support' },
      { label: 'Contact', href: '/contact' },
    ] as NavLink[],

    homeStats: [
      { value: '10+', label: 'Years of student legacy' },
      { value: '50+', label: 'Programs and campaigns' },
      { value: '300+', label: 'Students and alumni connected' },
      { value: '24/7', label: 'Emergency support mindset' },
    ] as StatItem[],

    impactAreas: [
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
    ],

    journeySteps: [
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
    ],

    events: [
      {
        id: 'evt-1',
        title: 'Nobinboron 2026',
        category: 'Welcome Program',
        date: '12 January 2026',
        location: 'TSC, Dhaka University',
        description:
          'A warm welcome event for newly admitted students from Uttara, with introductions, mentoring, photos, speeches, and a shared meal.',
        image: heroImage,
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
        image: heroImage,
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
        image: heroImage,
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
        image: heroImage,
      },
      {
        id: 'evt-5',
        title: 'DUSAU Cricket Day',
        category: 'Sports',
        date: '15 November 2025',
        location: 'University Ground',
        description:
          'A friendly tournament that strengthened bonding between batches, seniors, current committee members, and alumni.',
        image: heroImage,
      },
      {
        id: 'evt-6',
        title: 'Career Adda with Alumni',
        category: 'Networking',
        date: '04 October 2025',
        location: 'Uttara Community Hall',
        description:
          'An alumni-focused session where seniors shared stories, career advice, and practical guidance with current students.',
        image: heroImage,
      },
    ] as EventItem[],

    committeeYears: [
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
            image: heroImage,
          },
          {
            name: 'Mahin Chowdhury',
            role: 'General Secretary',
            department: 'Political Science',
            session: '2022-23',
            bio: 'Manages internal coordination, documentation, and execution across committee work.',
            image: heroImage,
          },
          {
            name: 'Nafisa Rahman',
            role: 'Organizing Secretary',
            department: 'Sociology',
            session: '2023-24',
            bio: 'Oversees event logistics, planning, volunteer flow, and organizational discipline.',
            image: heroImage,
          },
          {
            name: 'Tanvir Hasan',
            role: 'Treasurer',
            department: 'Accounting',
            session: '2023-24',
            bio: 'Supports budgeting, donation tracking, and transparent financial coordination.',
            image: heroImage,
          },
          {
            name: 'Sadia Islam',
            role: 'Social Welfare Secretary',
            department: 'English',
            session: '2023-24',
            bio: 'Helps design social campaigns and coordinate community-focused support programs.',
            image: heroImage,
          },
          {
            name: 'Rahat Ahmed',
            role: 'Cultural & Sports Secretary',
            department: 'History',
            session: '2023-24',
            bio: 'Runs bonding events, sports activities, and experience-building programs for members.',
            image: heroImage,
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
            image: heroImage,
          },
          {
            name: 'Nusrat Jahan',
            role: 'General Secretary',
            department: 'Law',
            session: '2021-22',
            bio: 'Managed execution, communication, and committee handover.',
            image: heroImage,
          },
          {
            name: 'Fahim Islam',
            role: 'Organizing Secretary',
            department: 'Geography',
            session: '2022-23',
            bio: 'Worked on logistics and member coordination.',
            image: heroImage,
          },
          {
            name: 'Tania Noor',
            role: 'Welfare Secretary',
            department: 'Islamic Studies',
            session: '2022-23',
            bio: 'Helped organize student support and charity work.',
            image: heroImage,
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
            image: heroImage,
          },
          {
            name: 'Samira Tasnim',
            role: 'General Secretary',
            department: 'Philosophy',
            session: '2020-21',
            bio: 'Supported planning and internal operations.',
            image: heroImage,
          },
          {
            name: 'Nayeem Rahman',
            role: 'Treasurer',
            department: 'Finance',
            session: '2021-22',
            bio: 'Maintained financial records and budgeting.',
            image: heroImage,
          },
          {
            name: 'Farzana Islam',
            role: 'Cultural Secretary',
            department: 'Bangla',
            session: '2021-22',
            bio: 'Organized events, bonding activities, and participation.',
            image: heroImage,
          },
        ],
      },
    ] as CommitteeYear[],

    alumni: [
      {
        name: 'Adnan Rahim',
        batch: '2018',
        department: 'CSE',
        currentRole: 'Software Engineer',
        company: 'Leading Tech Company',
        note: 'Supports juniors with career guidance and digital strategy ideas.',
        image: heroImage,
      },
      {
        name: 'Mariam Sultana',
        batch: '2017',
        department: 'IBA',
        currentRole: 'Brand Strategist',
        company: 'National Brand',
        note: 'Encourages leadership, confidence, and communication growth.',
        image: heroImage,
      },
      {
        name: 'Shahriar Kabir',
        batch: '2016',
        department: 'Law',
        currentRole: 'Legal Associate',
        company: 'Dhaka-based Chamber',
        note: 'Contributes to alumni network building and advisory support.',
        image: heroImage,
      },
      {
        name: 'Tasnia Chowdhury',
        batch: '2019',
        department: 'Economics',
        currentRole: 'Research Analyst',
        company: 'Policy Think Tank',
        note: 'Helps students think bigger about impact and public service.',
        image: heroImage,
      },
      {
        name: 'Rafi Ahmed',
        batch: '2015',
        department: 'Marketing',
        currentRole: 'Growth Manager',
        company: 'Regional Startup',
        note: 'Strong believer in alumni mentorship and visibility for DUSAU.',
        image: heroImage,
      },
      {
        name: 'Nabila Islam',
        batch: '2018',
        department: 'English',
        currentRole: 'Communications Specialist',
        company: 'Development Organization',
        note: 'Supports storytelling and meaningful public communication.',
        image: heroImage,
      },
    ] as AlumniMember[],

    galleryItems: [
      {
        id: 'gal-1',
        title: 'Welcome energy',
        caption:
          'Frames from a student welcome experience full of warmth and identity.',
        image: heroImage,
      },
      {
        id: 'gal-2',
        title: 'Community first',
        caption:
          'Moments from social support activities and local service campaigns.',
        image: heroImage,
      },
      {
        id: 'gal-3',
        title: 'Committee in action',
        caption:
          'Planning, volunteering, executing, and building trust together.',
        image: heroImage,
      },
      {
        id: 'gal-4',
        title: 'Shared joy',
        caption:
          'Smiles, group photos, and the kind of bonding that lasts beyond campus life.',
        image: heroImage,
      },
      {
        id: 'gal-5',
        title: 'Relief response',
        caption:
          'DUSAU standing beside people when support matters the most.',
        image: heroImage,
      },
      {
        id: 'gal-6',
        title: 'Sports and spirit',
        caption:
          'Cricket, football, and friendly competition between batches.',
        image: heroImage,
      },
      {
        id: 'gal-7',
        title: 'Alumni connection',
        caption:
          'Seniors returning with guidance, encouragement, and support.',
        image: heroImage,
      },
      {
        id: 'gal-8',
        title: 'A living legacy',
        caption:
          'Every year adds another layer to the story of DUSAU.',
        image: heroImage,
      },
      {
        id: 'gal-9',
        title: 'Service with sincerity',
        caption:
          'Organized social work driven by students and community values.',
        image: heroImage,
      },
    ] as GalleryItem[],

    bloodGroupStats: [
      { group: 'A+', available: 18 },
      { group: 'A-', available: 4 },
      { group: 'B+', available: 22 },
      { group: 'B-', available: 5 },
      { group: 'AB+', available: 7 },
      { group: 'AB-', available: 2 },
      { group: 'O+', available: 20 },
      { group: 'O-', available: 3 },
    ] as BloodGroupItem[],

    contactCards: [
      {
        title: 'General contact',
        value: email,
        description:
          'For organization information, partnerships, or general communication.',
      },
      {
        title: 'Location',
        value: 'Uttara, Dhaka • Dhaka University, Bangladesh',
        description:
          'Community-rooted in Uttara, connected to Dhaka University.',
      },
      {
        title: 'Phone',
        value: phone,
        description:
          'Emergency and coordination contact placeholder for the demo frontend.',
      },
    ] as ContactCard[],

    adminModules: [
      {
        title: 'Committee management',
        description:
          'Create a new yearly committee, assign roles, and archive older committees.',
        count: '03 active archives',
      },
      {
        title: 'Event publishing',
        description:
          'Add event title, date, category, gallery, summary, and highlight items.',
        count: '06 demo events',
      },
      {
        title: 'Gallery and media',
        description:
          'Upload photos, assign them to events, and feature them on the homepage.',
        count: '09 gallery items',
      },
      {
        title: 'Blood support coordination',
        description:
          'Manage donor data privately and respond to emergency blood requests.',
        count: '81 demo donors',
      },
      {
        title: 'Alumni directory',
        description:
          'Add alumni profiles, workplace info, and mentorship opportunities.',
        count: '06 featured alumni',
      },
      {
        title: 'Homepage content',
        description:
          'Update hero sections, statistics, call-to-actions, and featured campaigns.',
        count: 'Fully editable',
      },
    ] as AdminModule[],
  },

  bn: {
    siteConfig: {
      name: 'DUSAU',
      fullName: 'উত্তরা ভিত্তিক ঢাকা বিশ্ববিদ্যালয় শিক্ষার্থী সমিতি',
      tagline: 'উত্তরা থেকে আসা শিক্ষার্থীরা, ঢাকা বিশ্ববিদ্যালয়ে একসাথে।',
      shortDescription:
        'স্বাগত, কল্যাণ, সেবা, নেতৃত্ব এবং আজীবন সংযোগের জন্য একটি শিক্ষার্থী-নেতৃত্বাধীন কমিউনিটি।',
      description:
        'ডুসাউ একটি শিক্ষার্থী-পরিচালিত সংগঠন, যা উত্তরার ঢাকা বিশ্ববিদ্যালয়ের শিক্ষার্থীদের সামাজিক কাজ, বার্ষিক কমিটি, অ্যালামনাই সংযোগ, শিক্ষার্থী সহায়তা এবং কমিউনিটি-ভিত্তিক আয়োজনের মাধ্যমে যুক্ত করে।',
      location: 'উত্তরা, ঢাকা • ঢাকা বিশ্ববিদ্যালয়, বাংলাদেশ',
      email,
      phone,
      heroImage,
    },

    common: {
      adminDemoLabel: 'অ্যাডমিন ডেমো',
      goToTop: '↑ উপরে যান',
    },

    footer: {
      description:
        'উত্তরা ভিত্তিক ঢাকা বিশ্ববিদ্যালয় শিক্ষার্থী সমিতি একটি শিক্ষার্থী-নেতৃত্বাধীন প্ল্যাটফর্ম, যা সেবা, স্বাগত, কমিউনিটি এবং উত্তরাধিকারের মাধ্যমে উত্তরার শিক্ষার্থীদের যুক্ত করে।',
      exploreHeading: 'এক্সপ্লোর করুন',
      contactHeading: 'যোগাযোগ',
      copyrightNote:
        'উপস্থাপনা এবং ভবিষ্যৎ ব্যাকএন্ড ইন্টিগ্রেশনের জন্য তৈরি ফ্রন্টএন্ড ডেমো।',
    },

    hero: {
      eyebrow: 'শিক্ষার্থী-নেতৃত্বাধীন • সেবামুখী • উত্তরা থেকে ঢাবি',
      titleLead: 'এর জন্য একটি আধুনিক ডিজিটাল ঠিকানা',
      description:
        'উত্তরা ভিত্তিক ঢাকা বিশ্ববিদ্যালয় শিক্ষার্থী সমিতি এমন একটি শিক্ষার্থী-পরিচালিত প্ল্যাটফর্ম, যার কেন্দ্রে আছে স্বাগত, কল্যাণ, অনুষ্ঠান, অ্যালামনাই সংযোগ এবং অর্থবহ সামাজিক কাজ। এই ফ্রন্টএন্ড এমনভাবে তৈরি করা হয়েছে যাতে পরে এটি বাস্তব অ্যাডমিন ড্যাশবোর্ড এবং ব্যাকএন্ডের সাথে যুক্ত করা যায়।',
      primaryCta: 'সাম্প্রতিক আয়োজন দেখুন',
      secondaryCta: 'অ্যাডমিন ডেমো দেখুন',
      annualCycleLabel: 'বার্ষিক কমিটি চক্র',
      annualCycleText:
        'নতুন শিক্ষার্থীরা আসে। নতুন কমিটি দায়িত্ব নেয়। অ্যালামনাই সংযুক্ত থাকে। এভাবেই গল্প চলতে থাকে প্রতি বছর।',
      platformVisionLabel: 'প্ল্যাটফর্ম ভিশন',
      platformVisionText:
        'এখন জনসম্মুখে ইমপ্যাক্ট ওয়েবসাইট, পরে ডাইনামিক ব্যাকএন্ড-চালিত সিস্টেম।',
    },

    homePage: {
      introEyebrow: 'কেন এই প্ল্যাটফর্ম গুরুত্বপূর্ণ',
      introTitle:
        'ডুসাউ শুধু একটি সংগঠন নয়। এটি একটি চলমান শিক্ষার্থী উত্তরাধিকার।',
      introPara1:
        'প্রতি বছর উত্তরার নতুন একদল শিক্ষার্থী ঢাকা বিশ্ববিদ্যালয়ে আসে। তাদের প্রয়োজন সংযোগ, আপনত্ব, দিকনির্দেশনা এবং কমিউনিটি। ডুসাউ সেই সেতু হয়ে ওঠে। এটি তাদের স্বাগত জানায়, সামাজিক কাজের মাধ্যমে মানুষের পাশে দাঁড়ায়, আয়োজন করে, এবং এক বছরের কমিটিকে পরের বছরের অ্যালামনাই ভিত্তিতে রূপ দেয়।',
      introPara2:
        'এই ফ্রন্টএন্ড সেই শক্তিকে আধুনিকভাবে উপস্থাপন করার জন্য তৈরি: বাইরে প্রিমিয়াম ভিজ্যুয়াল, ভেতরে ভবিষ্যৎ অ্যাডমিন-রেডি কাঠামো।',
      recentEventsEyebrow: 'সাম্প্রতিক হাইলাইট',
      recentEventsTitle:
        'হোমপেজ থেকেই দেখা যাবে ডুসাউ এখন কী করছে',
      recentEventsDescription:
        'নবীনবরণ, সামাজিক কাজ, ত্রাণ, শীতবস্ত্র, খেলাধুলা এবং অ্যালামনাই সেশন — এই অংশ থেকেই সংগঠনটিকে সক্রিয়, বিশ্বাসযোগ্য এবং জীবন্ত মনে হবে।',
      exploreAllEvents: 'সব আয়োজন দেখুন',
      leadershipEyebrow: 'বর্তমান নেতৃত্ব',
      leadershipTitlePrefix: '',
      leadershipTitleSuffix: ' সালের কমিটি',
      leadershipDescription:
        'এই অংশ এমনভাবে বানানো হয়েছে যাতে প্রতি বছরের নতুন কমিটিকে সুন্দরভাবে দেখানো যায়, আবার আগের কমিটিগুলোকেও আর্কাইভে রাখা যায়।',
      emergencyEyebrow: 'জরুরি সহায়তা',
      emergencyTitle:
        'ডুসাউ একটি কার্যকর ব্লাড-সাপোর্ট ও জরুরি সহায়তা প্ল্যাটফর্মও হতে পারে',
      emergencyPara:
        'পাবলিক ওয়েবসাইট জরুরি অনুরোধ নিতে পারবে, আর ডোনার তালিকা নিরাপত্তার জন্য অ্যাডমিন-নিয়ন্ত্রিত ব্যক্তিগত অংশে থাকবে। এতে সাইটটি দায়িত্বশীল, উপকারী এবং সুসংগঠিত দেখাবে।',
      emergencyPrimaryCta: 'ব্লাড সাপোর্ট পেজ',
      emergencySecondaryCta: 'ডুসাউয়ের সাথে যোগাযোগ',
      emergencyCards: [
        { label: 'পাবলিক অংশ', value: 'জরুরি অনুরোধ ফর্ম' },
        { label: 'প্রাইভেট সিস্টেম', value: 'অ্যাডমিনের জন্য ডোনার ডিরেক্টরি' },
        { label: 'দ্রুত সাড়া', value: 'পরে ব্লাড গ্রুপ ফিল্টারিং' },
        { label: 'বিশ্বাসযোগ্যতা', value: 'অর্থবহ সামাজিক প্রভাবের ফিচার' },
      ],
      alumniEyebrow: 'অ্যালামনাই শক্তি',
      alumniTitle:
        'একটি শক্তিশালী অ্যালামনাই সেকশন ডুসাউকে মর্যাদা ও ধারাবাহিকতা দেবে',
      alumniDescription:
        'যখন দর্শনার্থীরা দেখবে আগের সদস্যরা এখন ভালো জায়গায় কাজ করছেন, তখন সংগঠনটিকে আরও প্রতিষ্ঠিত, বাস্তব এবং সম্মানজনক মনে হবে।',
      closingEyebrow: 'শেষ কথা',
      closingTitle:
        'এমন একটি ওয়েবসাইট ডুসাউকে শুধু ফেসবুক পেজের চেয়ে অনেক বড় করে তুলতে পারে',
      closingPara1:
        'এটি পরিচয়, বিশ্বাস, কাজের গতি, নেতৃত্ব, সেবা এবং দীর্ঘমেয়াদি উত্তরাধিকার তুলে ধরতে পারে। ডুসাউয়ের জন্য শুরুতেই ওপেন সোশ্যাল নেটওয়ার্ক দরকার নেই। দরকার একটি প্রিমিয়াম পাবলিক ওয়েবসাইট এবং ভবিষ্যতের অ্যাডমিন ড্যাশবোর্ড, যেখানে প্রতি বছরের নতুন কমিটি আয়োজন, সদস্য, অ্যালামনাই, মিডিয়া এবং সাপোর্ট কার্যক্রম ম্যানেজ করতে পারবে।',
      closingPara2:
        'এটাই সবচেয়ে ভালো জায়গা: বাইরে সুন্দর, ভেতরে ডাইনামিক, এবং পরে বাস্তব প্ল্যাটফর্মে পরিণত হওয়ার উপযোগী।',
      closingPrimaryCta: 'গল্পটি পড়ুন',
      closingSecondaryCta: 'ভবিষ্যৎ অ্যাডমিন ভিশন দেখুন',
      demoNote:
        'ডেমো নোট: এখানে সব কনটেন্ট প্লেসহোল্ডার, একটি শেয়ার করা ছবি এবং store.ts-এর কেন্দ্রীভূত ডামি ডেটা ব্যবহার করা হয়েছে।',
    },

    aboutPage: {
      eyebrow: 'ডুসাউ সম্পর্কে',
      title:
        'শিক্ষার্থীদের হাতে শুরু, শিক্ষার্থীদের হাতে বহমান, অ্যালামনাইদের মনে সংরক্ষিত',
      description:
        'উত্তরা ভিত্তিক ঢাকা বিশ্ববিদ্যালয় শিক্ষার্থী সমিতি একটি সহজ কিন্তু শক্তিশালী ধারণা থেকে শুরু হয়েছিল: উত্তরার যে শিক্ষার্থীরা ঢাকা বিশ্ববিদ্যালয়ে পড়তে আসে, তারা যেন বিচ্ছিন্ন না থাকে। তাদেরও একটি কমিউনিটি থাকা উচিত।',
      ideaTitle: 'সংগঠনটির মূল ভাবনা',
      ideaPara1:
        'ডুসাউয়ের উদ্দেশ্য হলো আপনত্ব তৈরি করা। এটি নতুন শিক্ষার্থীদের স্বাগত জানায়, ব্যাচের মধ্যে বন্ধুত্ব গড়ে তোলে, আয়োজন করে, এবং শিক্ষার্থীদের শক্তিকে অর্থবহ সামাজিক কাজে ব্যবহার করে। এটি একই সঙ্গে সাপোর্ট নেটওয়ার্ক এবং নেতৃত্বের প্ল্যাটফর্ম।',
      ideaPara2:
        'সময়ের সঙ্গে সঙ্গে যা একটি শিক্ষার্থী কমিউনিটি হিসেবে শুরু হয়, তা সেবা, স্মৃতি, দায়িত্ব এবং অ্যালামনাই সংযোগের বড় এক উত্তরাধিকারে পরিণত হয়।',
      websiteTitle: 'এই ওয়েবসাইটের কাজ কী হওয়া উচিত',
      websitePara1:
        'এই ওয়েবসাইট ডুসাউকে সুসংগঠিত, সক্রিয় এবং ভবিষ্যৎ-প্রস্তুত হিসেবে তুলে ধরবে। এটি বর্তমান কার্যক্রমকে পাবলিকভাবে দেখাবে, আর একই সঙ্গে এমন একটি ডাইনামিক অ্যাডমিন প্যানেলের ভিত্তি তৈরি করবে যেখানে প্রতি বছরের কমিটি আয়োজন, কনটেন্ট এবং মানুষ ম্যানেজ করতে পারবে।',
      websitePara2:
        'এটি শুধু ডিজাইন প্রজেক্ট নয়। এটি ধারাবাহিকতার একটি ডিজিটাল ভিত্তি।',
      howEyebrow: 'যেভাবে কাজ করে',
      howTitle:
        'ডুসাউয়ের যাত্রা প্রতি বছর পুনরাবৃত্ত হয় — আর এটাই এর শক্তি',
      howDescription:
        'একটি শক্তিশালী ওয়েবসাইটে স্বাগত, নেতৃত্ব, সেবা এবং অ্যালামনাই রূপান্তরের এই বার্ষিক ছন্দটি ফুটে উঠতে হবে।',
      coreEyebrow: 'ডুসাউ কী প্রতিনিধিত্ব করে',
      coreTitle: 'মূল কার্যক্রমের ক্ষেত্র',
      coreDescription:
        'এগুলো সেই ধরনের কাজ এবং আয়োজন, যেগুলো পাবলিক ওয়েবসাইটে বারবার তুলে ধরা উচিত।',
    },

    eventsPage: {
      eyebrow: 'আয়োজন ও কার্যক্রম',
      title:
        'সামাজিক কাজ, স্বাগত অনুষ্ঠান, বন্ধন এবং সাড়াদানের জন্য এক প্ল্যাটফর্ম',
      description:
        'এই পেজটি এমনভাবে ভাবা হয়েছে যাতে ভবিষ্যতে অ্যাডমিনরা সহজে শিরোনাম, বিবরণ, ছবি, ভিডিও, তারিখ এবং ক্যাটাগরিসহ নতুন আয়োজন যোগ করতে পারে।',
    },

    committeePage: {
      eyebrow: 'কমিটি কাঠামো',
      titlePrefix: 'বর্তমান নেতৃত্ব: ',
      titleSuffix: '',
      description:
        'প্রতি বছর একটি নতুন কমিটি দায়িত্ব নিতে পারবে, সংগঠন পরিচালনা করবে, আয়োজন প্রকাশ করবে, এবং পরে অ্যালামনাই আর্কাইভে চলে যাবে।',
      archiveEyebrow: 'আর্কাইভ',
      archiveTitle: 'আগের কমিটিগুলোও গল্পের অংশ হয়ে থাকবে',
      archiveDescription:
        'পুরোনো নেতৃত্বকে মুছে ফেলার বদলে, এই ডিজাইন প্রতিটি বছরকে খুঁজে পাওয়ার মতো করে রাখে, যাতে ডুসাউকে ধারাবাহিক এবং প্রতিষ্ঠিত মনে হয়।',
      archiveCardTitle: 'বার্ষিক আর্কাইভ',
      archiveMembersPrefix: 'মোট ',
      archiveMembersSuffix: ' জন দেখানো হয়েছে',
    },

    alumniPage: {
      eyebrow: 'অ্যালামনাই নেটওয়ার্ক',
      title:
        'সাবেক সদস্যরাই ডুসাউয়ের দীর্ঘমেয়াদি শক্তি হয়ে ওঠেন',
      description:
        'এই পেজটি এমনভাবে ডিজাইন করা হয়েছে যাতে বোঝা যায় সংগঠনটি এক বছরের কমিটিতে শেষ হয়ে যায় না; বরং এটি একটি নেটওয়ার্কে পরিণত হয়।',
      reasons: [
        {
          title: 'বিশ্বাসযোগ্যতা',
          description:
            'দৃশ্যমান অ্যালামনাই নেটওয়ার্ক দেখলেই বোঝা যায় ডুসাউয়ের ইতিহাস, পরিণততা এবং দীর্ঘমেয়াদি প্রভাব আছে।',
        },
        {
          title: 'মেন্টরশিপ',
          description:
            'অ্যালামনাই বর্তমান শিক্ষার্থীদের ক্যারিয়ার পরামর্শ, মানসিক সহায়তা এবং বাস্তব অভিজ্ঞতা দিতে পারে।',
        },
        {
          title: 'ধারাবাহিকতা',
          description:
            'প্রতি বছর কমিটি বদলালেও অ্যালামনাই সেই সেতু, যারা পরিচয় ও মূল্যবোধকে বাঁচিয়ে রাখে।',
        },
      ],
    },

    galleryPage: {
      eyebrow: 'গ্যালারি',
      title:
        'সেবা, মানুষ, স্মৃতি এবং চলমানতার এক ভিজ্যুয়াল গল্প',
      description:
        'এখনের জন্য এখানে একই ডামি ছবি ব্যবহার করা হয়েছে। পরে প্রতিটি আইটেমকে বাস্তব ইভেন্ট, অ্যালবাম এবং মিডিয়া আপলোডের সাথে যুক্ত করা যাবে।',
    },

    bloodSupportPage: {
      eyebrow: 'ব্লাড সাপোর্ট',
      title:
        'ডুসাউয়ের কমিউনিটি ভূমিকার জন্য একটি কার্যকর ও দায়িত্বশীল ফিচার',
      description:
        'এই পেজটি দেখায় কীভাবে সংগঠনটি জরুরি প্রয়োজনে পাবলিকভাবে সহায়তা দিতে পারে, কিন্তু পুরো ডোনার তালিকাটি সবার সামনে উন্মুক্ত না করেও।',
      heroEyebrow: 'জরুরি-প্রস্তুত ধারণা',
      heroTitle: 'পাবলিক অনুরোধ। ব্যক্তিগত ডোনার ম্যানেজমেন্ট।',
      heroPara:
        'একটি শিক্ষার্থী সংগঠনের ওয়েবসাইটের জন্য এটাই সবচেয়ে ভালো মডেল। সাধারণ মানুষ সহায়তা চাইতে পারবে, কিন্তু বিস্তারিত ডোনার তথ্য বিশ্বস্ত অ্যাডমিন নিয়ন্ত্রণে থাকবে। এতে সবকিছু আরও নিরাপদ ও পেশাদার থাকে।',
      heroPrimaryCta: 'সহায়তা চাইুন',
      heroSecondaryCta: 'অ্যাডমিন অংশ দেখুন',
      availableSuffix: ' জন ডেমো ডোনার উপলব্ধ',
      workflowEyebrow: 'প্রস্তাবিত কার্যপ্রবাহ',
      workflowTitle: 'ভবিষ্যতে এই ফিচার যেভাবে কাজ করতে পারে',
      workflowDescription:
        'ব্যাকএন্ড পর্যায়ে এটি সবচেয়ে কার্যকর মডিউলগুলোর একটি হতে পারে।',
      steps: [
        {
          title: 'অনুরোধ আসে',
          description:
            'জরুরি অনুরোধ পাবলিক ফর্ম বা যোগাযোগ মাধ্যম দিয়ে জমা পড়ে।',
        },
        {
          title: 'অ্যাডমিন ব্যক্তিগত ডোনার তালিকা দেখে',
          description:
            'অনুমোদিত সমন্বয়কারীরা অ্যাডমিন ড্যাশবোর্ডে ব্লাড গ্রুপ ও প্রাপ্যতা অনুযায়ী ফিল্টার করে।',
        },
        {
          title: 'সম্ভাব্য ডোনারদের সাথে যোগাযোগ করা হয়',
          description:
            'সিস্টেম ডোনারের তথ্য ব্যক্তিগত রাখে, আবার দ্রুত সমন্বয়ের সুযোগও দেয়।',
        },
        {
          title: 'সাড়া ট্র্যাক করা হয়',
          description:
            'পরে ব্যাকএন্ডে রেসপন্স স্ট্যাটাস, ডোনারের প্রাপ্যতা এবং জরুরি নোট সংরক্ষণ করা যাবে।',
        },
      ],
    },

    contactPage: {
      eyebrow: 'যোগাযোগ',
      title:
        'এখন একটি সাধারণ যোগাযোগ পেজ, পরে বাস্তব সাবমিশন সিস্টেম',
      description:
        'এই ফ্রন্টএন্ড ডেমোর জন্য ফর্মটি শুধু ভিজ্যুয়াল। পরে ব্যাকএন্ড পর্যায়ে এটিকে বাস্তব স্টোরেজ, অ্যাডমিন রিভিউ এবং ইমেইল ওয়ার্কফ্লোর সাথে যুক্ত করা যাবে।',
      form: {
        nameLabel: 'পূর্ণ নাম',
        namePlaceholder: 'আপনার নাম',
        emailLabel: 'ইমেইল',
        emailPlaceholder: 'you@example.com',
        subjectLabel: 'বিষয়',
        subjectPlaceholder: 'কেন ডুসাউয়ের সাথে যোগাযোগ করছেন',
        messageLabel: 'বার্তা',
        messagePlaceholder: 'এখানে আপনার বার্তা লিখুন...',
        buttonLabel: 'ডেমো সাবমিট বাটন',
        note:
          'এটি উপস্থাপনার জন্য শুধু ফ্রন্টএন্ড ফর্ম। বাস্তব সাবমিশন, ভ্যালিডেশন এবং ড্যাশবোর্ড রিভিউ পরে ব্যাকএন্ডে আসবে।',
      },
    },

    adminDemoPage: {
      eyebrow: 'অ্যাডমিন ডেমো',
      title:
        'ভবিষ্যতে ডুসাউয়ের ডাইনামিক অংশ এমন দেখতে হতে পারে',
      description:
        'এই পেজটি এখনও শুধু ফ্রন্টএন্ড, তবে এটি দেখাতে সাহায্য করে কীভাবে প্রতি বছরের নতুন কমিটি কনটেন্ট, মানুষ এবং কমিউনিটি ডেটা ম্যানেজ করতে পারবে।',
      committeeEyebrow: 'কমিটি নিয়ন্ত্রণ',
      committeeTitle: 'একটি অ্যাকশনে নতুন কমিটি বছর তৈরি করুন',
      committeePara:
        'এটি ডুসাউয়ের জন্য সবচেয়ে গুরুত্বপূর্ণ ফিচারগুলোর একটি। প্রতি বছর নতুন কমিটি যেন দায়িত্ব নিতে পারে, নতুন পদ যোগ করতে পারে, সদস্য নির্ধারণ করতে পারে, এবং আগের বছরগুলোকে স্বয়ংক্রিয়ভাবে আর্কাইভে রাখতে পারে।',
      currentYearLabel: 'বর্তমান বছর',
      currentMembersLabel: 'বর্তমান সদস্য',
      currentMembersSuffix: ' জন ডেমোতে দেখানো হয়েছে',
      publishedEventsLabel: 'প্রকাশিত আয়োজন',
      publishedEventsSuffix: ' টি ডেমো আইটেম',
      futureAccessLabel: 'ভবিষ্যৎ অ্যাক্সেস',
      futureAccessValue: 'রোল-ভিত্তিক অ্যাডমিন সিস্টেম',
    },

    navLinks: [
      { label: 'হোম', href: '/' },
      { label: 'পরিচিতি', href: '/about' },
      { label: 'আয়োজন', href: '/events' },
      { label: 'কমিটি', href: '/committee' },
      { label: 'অ্যালামনাই', href: '/alumni' },
      { label: 'গ্যালারি', href: '/gallery' },
      { label: 'ব্লাড সাপোর্ট', href: '/blood-support' },
      { label: 'যোগাযোগ', href: '/contact' },
    ] as NavLink[],

    homeStats: [
      { value: '10+', label: 'বছরের শিক্ষার্থী উত্তরাধিকার' },
      { value: '50+', label: 'প্রোগ্রাম ও ক্যাম্পেইন' },
      { value: '300+', label: 'সংযুক্ত শিক্ষার্থী ও অ্যালামনাই' },
      { value: '24/7', label: 'জরুরি সহায়তার মানসিকতা' },
    ] as StatItem[],

    impactAreas: [
      {
        title: 'নবীনবরণ ও শিক্ষার্থী স্বাগত',
        description:
          'প্রতি বছর উত্তরার নতুন ঢাকা বিশ্ববিদ্যালয় শিক্ষার্থীদের স্বাগত জানানো হয়, দিকনির্দেশনা দেওয়া হয়, পরিচিত করা হয় এবং সিনিয়রদের সাথে যুক্ত করা হয়।',
      },
      {
        title: 'ত্রাণ ও সামাজিক সেবা',
        description:
          'বন্যা ত্রাণ থেকে খাদ্য সহায়তা পর্যন্ত, ডুসাউ কঠিন সময়ে শিক্ষার্থীদের উদ্যোগে মানুষের পাশে দাঁড়ায়।',
      },
      {
        title: 'শীতবস্ত্র ও কল্যাণ',
        description:
          'শীতকালে বস্ত্র সংগ্রহ ও বিতরণের মাধ্যমে সুবিধাবঞ্চিত মানুষের পাশে দাঁড়ানোর উদ্যোগ নেওয়া হয়।',
      },
      {
        title: 'খেলাধুলা, বন্ধন ও সংস্কৃতি',
        description:
          'ফুটবল, ক্রিকেট, আড্ডা এবং সাংস্কৃতিক মুহূর্ত বিভিন্ন ব্যাচের মধ্যে বন্ধন, পরিচয় এবং একতা তৈরি করে।',
      },
    ],

    journeySteps: [
      {
        step: '01',
        title: 'শিক্ষার্থীরা ঢাকা বিশ্ববিদ্যালয়ে আসে',
        description:
          'ভিন্ন ভিন্ন কলেজ এবং পটভূমি থেকে আসা নতুন শিক্ষার্থীরা ঢাকা বিশ্ববিদ্যালয়ে নতুন অধ্যায় শুরু করে।',
      },
      {
        step: '02',
        title: 'ডুসাউ তাদের স্বাগত জানায় ও যুক্ত করে',
        description:
          'নবীনবরণ, মেন্টরশিপ, কমিউনিটি সাপোর্ট এবং আয়োজনের মাধ্যমে তারা দ্রুত একটি নেটওয়ার্কের অংশ হয়ে ওঠে।',
      },
      {
        step: '03',
        title: 'নতুন কমিটি দায়িত্ব নেয়',
        description:
          'প্রতি বছর নতুন শিক্ষার্থী নেতারা দায়িত্ব নেয় এবং সেবা, সংগঠন ও বিকাশের কাজ চালিয়ে যায়।',
      },
      {
        step: '04',
        title: 'তারা অ্যালামনাই হয়ে আবার ফিরিয়ে দেয়',
        description:
          'সাবেক কমিটি সদস্য এবং সিনিয়ররা অ্যালামনাই ভূমিকায় গিয়ে ডুসাউ কমিউনিটিকে আরও শক্তিশালী করে।',
      },
    ],

    events: [
      {
        id: 'evt-1',
        title: 'নবীনবরণ ২০২৬',
        category: 'স্বাগত অনুষ্ঠান',
        date: '১২ জানুয়ারি ২০২৬',
        location: 'টিএসসি, ঢাকা বিশ্ববিদ্যালয়',
        description:
          'উত্তরা থেকে নতুন ভর্তি হওয়া শিক্ষার্থীদের জন্য উষ্ণ স্বাগত অনুষ্ঠান, যেখানে পরিচিতি, মেন্টরিং, ছবি, বক্তব্য এবং একসাথে খাবারের আয়োজন ছিল।',
        image: heroImage,
        featured: true,
      },
      {
        id: 'evt-2',
        title: 'পথে খাদ্য বিতরণ কার্যক্রম',
        category: 'সামাজিক কাজ',
        date: '০৮ ফেব্রুয়ারি ২০২৬',
        location: 'ঢাকা শহর',
        description:
          'কমিটি সদস্যরা কমিউনিটি ফুড সাপোর্ট কার্যক্রম পরিচালনা করেন এবং মর্যাদা ও যত্নের সঙ্গে খাবার বিতরণ করেন।',
        image: heroImage,
        featured: true,
      },
      {
        id: 'evt-3',
        title: 'শীতবস্ত্র সহায়তা ক্যাম্পেইন',
        category: 'কল্যাণ',
        date: '১৯ ডিসেম্বর ২০২৫',
        location: 'উত্তরা ও আশেপাশের এলাকা',
        description:
          'শীতকালে প্রয়োজনীয় মানুষের কাছে গরম কাপড় সংগ্রহ ও বিতরণের একটি মৌসুমি কল্যাণমূলক উদ্যোগ।',
        image: heroImage,
        featured: true,
      },
      {
        id: 'evt-4',
        title: 'বন্যা ত্রাণ সাড়া',
        category: 'জরুরি সাড়া',
        date: '২১ আগস্ট ২০২৫',
        location: 'বন্যাকবলিত এলাকা',
        description:
          'শিক্ষার্থীরা শুকনো খাবার, ওষুধ এবং আশ্রয়-সহায়তাসহ জরুরি ত্রাণ কার্যক্রম সংগঠিত করে।',
        image: heroImage,
      },
      {
        id: 'evt-5',
        title: 'ডুসাউ ক্রিকেট ডে',
        category: 'খেলাধুলা',
        date: '১৫ নভেম্বর ২০২৫',
        location: 'বিশ্ববিদ্যালয় মাঠ',
        description:
          'একটি বন্ধুত্বপূর্ণ টুর্নামেন্ট, যা বিভিন্ন ব্যাচ, সিনিয়র, বর্তমান কমিটি সদস্য এবং অ্যালামনাইদের মধ্যে বন্ধন আরও মজবুত করেছে।',
        image: heroImage,
      },
      {
        id: 'evt-6',
        title: 'অ্যালামনাইদের সঙ্গে ক্যারিয়ার আড্ডা',
        category: 'নেটওয়ার্কিং',
        date: '০৪ অক্টোবর ২০২৫',
        location: 'উত্তরা কমিউনিটি হল',
        description:
          'অ্যালামনাই-কেন্দ্রিক একটি সেশন, যেখানে সিনিয়ররা বর্তমান শিক্ষার্থীদের সঙ্গে গল্প, ক্যারিয়ার পরামর্শ এবং বাস্তব অভিজ্ঞতা শেয়ার করেন।',
        image: heroImage,
      },
    ] as EventItem[],

    committeeYears: [
      {
        year: '2026',
        summary:
          'বর্তমান কর্মরত কমিটি শিক্ষার্থী স্বাগত, কমিউনিটি ত্রাণ, সমন্বয় এবং ডিজিটাল প্রবৃদ্ধির ওপর কাজ করছে।',
        members: [
          {
            name: 'Ahsan Karim',
            role: 'সভাপতি',
            department: 'অর্থনীতি',
            session: '2022-23',
            bio: 'সংগঠনের সামগ্রিক দিকনির্দেশনা দেন এবং বড় উদ্যোগগুলোর সমন্বয় করেন।',
            image: heroImage,
          },
          {
            name: 'Mahin Chowdhury',
            role: 'সাধারণ সম্পাদক',
            department: 'রাষ্ট্রবিজ্ঞান',
            session: '2022-23',
            bio: 'অভ্যন্তরীণ সমন্বয়, ডকুমেন্টেশন এবং কমিটির কাজ বাস্তবায়ন তদারকি করেন।',
            image: heroImage,
          },
          {
            name: 'Nafisa Rahman',
            role: 'সাংগঠনিক সম্পাদক',
            department: 'সমাজবিজ্ঞান',
            session: '2023-24',
            bio: 'ইভেন্ট লজিস্টিকস, পরিকল্পনা, স্বেচ্ছাসেবক ব্যবস্থাপনা এবং সাংগঠনিক শৃঙ্খলা তদারকি করেন।',
            image: heroImage,
          },
          {
            name: 'Tanvir Hasan',
            role: 'কোষাধ্যক্ষ',
            department: 'হিসাববিজ্ঞান',
            session: '2023-24',
            bio: 'বাজেট, অনুদান ট্র্যাকিং এবং স্বচ্ছ আর্থিক সমন্বয়ে সহায়তা করেন।',
            image: heroImage,
          },
          {
            name: 'Sadia Islam',
            role: 'সমাজকল্যাণ সম্পাদক',
            department: 'ইংরেজি',
            session: '2023-24',
            bio: 'সামাজিক ক্যাম্পেইন ডিজাইন এবং কমিউনিটি-কেন্দ্রিক সহায়তা কার্যক্রম সমন্বয়ে সহায়তা করেন।',
            image: heroImage,
          },
          {
            name: 'Rahat Ahmed',
            role: 'সাংস্কৃতিক ও ক্রীড়া সম্পাদক',
            department: 'ইতিহাস',
            session: '2023-24',
            bio: 'বন্ধন, খেলাধুলা এবং অভিজ্ঞতা-গঠনের কার্যক্রম পরিচালনা করেন।',
            image: heroImage,
          },
        ],
      },
      {
        year: '2025',
        summary:
          'ত্রাণ উদ্যোগ, অ্যালামনাই সম্পৃক্ততা এবং ব্যাচগুলোর মধ্যে ধারাবাহিকতা তৈরিতে কাজ করেছে।',
        members: [
          {
            name: 'Sabbir Hossain',
            role: 'সভাপতি',
            department: 'ম্যানেজমেন্ট',
            session: '2021-22',
            bio: 'কল্যাণমূলক কার্যক্রম এবং বার্ষিক আয়োজনের দিকনির্দেশনা দিয়েছেন।',
            image: heroImage,
          },
          {
            name: 'Nusrat Jahan',
            role: 'সাধারণ সম্পাদক',
            department: 'আইন',
            session: '2021-22',
            bio: 'কার্যসম্পাদন, যোগাযোগ এবং কমিটি হস্তান্তর পরিচালনা করেছেন।',
            image: heroImage,
          },
          {
            name: 'Fahim Islam',
            role: 'সাংগঠনিক সম্পাদক',
            department: 'ভূগোল',
            session: '2022-23',
            bio: 'লজিস্টিকস এবং সদস্য সমন্বয়ে কাজ করেছেন।',
            image: heroImage,
          },
          {
            name: 'Tania Noor',
            role: 'কল্যাণ সম্পাদক',
            department: 'ইসলামিক স্টাডিজ',
            session: '2022-23',
            bio: 'শিক্ষার্থী সহায়তা এবং দাতব্য কার্যক্রম সংগঠনে ভূমিকা রেখেছেন।',
            image: heroImage,
          },
        ],
      },
      {
        year: '2024',
        summary:
          'ডুসাউয়ের পরিচয়কে আরও শক্তিশালী করতে বন্ধন, স্বাগত আয়োজন এবং সেবামূলক কার্যক্রমে কাজ করেছে।',
        members: [
          {
            name: 'Imran Kabir',
            role: 'সভাপতি',
            department: 'গণিত',
            session: '2020-21',
            bio: 'কমিটি কাঠামো এবং প্রধান বার্ষিক প্রোগ্রামগুলোতে নেতৃত্ব দিয়েছেন।',
            image: heroImage,
          },
          {
            name: 'Samira Tasnim',
            role: 'সাধারণ সম্পাদক',
            department: 'দর্শন',
            session: '2020-21',
            bio: 'পরিকল্পনা ও অভ্যন্তরীণ কার্যক্রমে সহায়তা করেছেন।',
            image: heroImage,
          },
          {
            name: 'Nayeem Rahman',
            role: 'কোষাধ্যক্ষ',
            department: 'ফিন্যান্স',
            session: '2021-22',
            bio: 'আর্থিক রেকর্ড এবং বাজেট সংরক্ষণ করেছেন।',
            image: heroImage,
          },
          {
            name: 'Farzana Islam',
            role: 'সাংস্কৃতিক সম্পাদক',
            department: 'বাংলা',
            session: '2021-22',
            bio: 'আয়োজন, বন্ধনমূলক কার্যক্রম এবং অংশগ্রহণ সংগঠিত করেছেন।',
            image: heroImage,
          },
        ],
      },
    ] as CommitteeYear[],

    alumni: [
      {
        name: 'Adnan Rahim',
        batch: '2018',
        department: 'CSE',
        currentRole: 'সফটওয়্যার ইঞ্জিনিয়ার',
        company: 'শীর্ষ প্রযুক্তি প্রতিষ্ঠান',
        note: 'জুনিয়রদের ক্যারিয়ার গাইডেন্স ও ডিজিটাল কৌশল নিয়ে সহায়তা করেন।',
        image: heroImage,
      },
      {
        name: 'Mariam Sultana',
        batch: '2017',
        department: 'IBA',
        currentRole: 'ব্র্যান্ড স্ট্র্যাটেজিস্ট',
        company: 'জাতীয় ব্র্যান্ড',
        note: 'নেতৃত্ব, আত্মবিশ্বাস এবং যোগাযোগ দক্ষতা বৃদ্ধিতে উৎসাহ দেন।',
        image: heroImage,
      },
      {
        name: 'Shahriar Kabir',
        batch: '2016',
        department: 'আইন',
        currentRole: 'লিগ্যাল অ্যাসোসিয়েট',
        company: 'ঢাকাভিত্তিক চেম্বার',
        note: 'অ্যালামনাই নেটওয়ার্ক গঠন ও পরামর্শমূলক সহায়তায় অবদান রাখেন।',
        image: heroImage,
      },
      {
        name: 'Tasnia Chowdhury',
        batch: '2019',
        department: 'অর্থনীতি',
        currentRole: 'রিসার্চ অ্যানালিস্ট',
        company: 'পলিসি থিংক ট্যাঙ্ক',
        note: 'শিক্ষার্থীদের প্রভাব ও জনসেবার বিষয়ে বড় করে ভাবতে উৎসাহ দেন।',
        image: heroImage,
      },
      {
        name: 'Rafi Ahmed',
        batch: '2015',
        department: 'মার্কেটিং',
        currentRole: 'গ্রোথ ম্যানেজার',
        company: 'আঞ্চলিক স্টার্টআপ',
        note: 'ডুসাউয়ের জন্য অ্যালামনাই মেন্টরশিপ এবং দৃশ্যমানতার জোরালো সমর্থক।',
        image: heroImage,
      },
      {
        name: 'Nabila Islam',
        batch: '2018',
        department: 'ইংরেজি',
        currentRole: 'কমিউনিকেশনস স্পেশালিস্ট',
        company: 'উন্নয়ন সংস্থা',
        note: 'গল্প বলার শক্তি এবং অর্থবহ জনসংযোগে সহায়তা করেন।',
        image: heroImage,
      },
    ] as AlumniMember[],

    galleryItems: [
      {
        id: 'gal-1',
        title: 'স্বাগতময় উদ্দীপনা',
        caption:
          'শিক্ষার্থীদের স্বাগত মুহূর্তের কিছু ফ্রেম, যা উষ্ণতা ও পরিচয়ের অনুভূতি বহন করে।',
        image: heroImage,
      },
      {
        id: 'gal-2',
        title: 'কমিউনিটি সবার আগে',
        caption:
          'সামাজিক সহায়তা কার্যক্রম এবং স্থানীয় সেবা ক্যাম্পেইনের মুহূর্ত।',
        image: heroImage,
      },
      {
        id: 'gal-3',
        title: 'কমিটি কাজের মাঝে',
        caption:
          'পরিকল্পনা, স্বেচ্ছাসেবা, বাস্তবায়ন এবং একসাথে বিশ্বাস তৈরি করার চিত্র।',
        image: heroImage,
      },
      {
        id: 'gal-4',
        title: 'একসাথে আনন্দ',
        caption:
          'হাসি, গ্রুপ ছবি এবং এমন বন্ধন, যা ক্যাম্পাসজীবনের পরও থাকে।',
        image: heroImage,
      },
      {
        id: 'gal-5',
        title: 'ত্রাণে সাড়া',
        caption:
          'যখন সহায়তা সবচেয়ে জরুরি, তখন ডুসাউ মানুষের পাশে দাঁড়ায়।',
        image: heroImage,
      },
      {
        id: 'gal-6',
        title: 'খেলাধুলা ও উদ্দীপনা',
        caption:
          'ব্যাচগুলোর মধ্যে ক্রিকেট, ফুটবল এবং বন্ধুত্বপূর্ণ প্রতিযোগিতা।',
        image: heroImage,
      },
      {
        id: 'gal-7',
        title: 'অ্যালামনাই সংযোগ',
        caption:
          'সিনিয়ররা ফিরে আসে দিকনির্দেশনা, উৎসাহ এবং সহায়তা নিয়ে।',
        image: heroImage,
      },
      {
        id: 'gal-8',
        title: 'এক জীবন্ত উত্তরাধিকার',
        caption:
          'প্রতি বছর ডুসাউয়ের গল্পে নতুন একটি স্তর যোগ হয়।',
        image: heroImage,
      },
      {
        id: 'gal-9',
        title: 'আন্তরিক সেবা',
        caption:
          'শিক্ষার্থী ও কমিউনিটির মূল্যবোধে চালিত সুসংগঠিত সামাজিক কাজ।',
        image: heroImage,
      },
    ] as GalleryItem[],

    bloodGroupStats: [
      { group: 'A+', available: 18 },
      { group: 'A-', available: 4 },
      { group: 'B+', available: 22 },
      { group: 'B-', available: 5 },
      { group: 'AB+', available: 7 },
      { group: 'AB-', available: 2 },
      { group: 'O+', available: 20 },
      { group: 'O-', available: 3 },
    ] as BloodGroupItem[],

    contactCards: [
      {
        title: 'সাধারণ যোগাযোগ',
        value: email,
        description:
          'সংগঠন, অংশীদারিত্ব বা সাধারণ যোগাযোগের জন্য।',
      },
      {
        title: 'অবস্থান',
        value: 'উত্তরা, ঢাকা • ঢাকা বিশ্ববিদ্যালয়, বাংলাদেশ',
        description:
          'উত্তরাকে কেন্দ্র করে গড়ে ওঠা, ঢাকা বিশ্ববিদ্যালয়ের সাথে সংযুক্ত।',
      },
      {
        title: 'ফোন',
        value: phone,
        description:
          'ডেমো ফ্রন্টএন্ডের জন্য জরুরি ও সমন্বয় যোগাযোগের প্লেসহোল্ডার।',
      },
    ] as ContactCard[],

    adminModules: [
      {
        title: 'কমিটি ম্যানেজমেন্ট',
        description:
          'নতুন বার্ষিক কমিটি তৈরি করুন, পদ নির্ধারণ করুন এবং আগের কমিটিগুলো আর্কাইভে রাখুন।',
        count: '০৩ সক্রিয় আর্কাইভ',
      },
      {
        title: 'ইভেন্ট প্রকাশনা',
        description:
          'ইভেন্টের শিরোনাম, তারিখ, ক্যাটাগরি, গ্যালারি, সারসংক্ষেপ এবং হাইলাইট যোগ করুন।',
        count: '০৬ ডেমো আয়োজন',
      },
      {
        title: 'গ্যালারি ও মিডিয়া',
        description:
          'ছবি আপলোড করুন, ইভেন্টের সাথে যুক্ত করুন এবং হোমপেজে ফিচার করুন।',
        count: '০৯ গ্যালারি আইটেম',
      },
      {
        title: 'ব্লাড সাপোর্ট সমন্বয়',
        description:
          'ডোনার ডেটা ব্যক্তিগতভাবে ম্যানেজ করুন এবং জরুরি ব্লাড রিকোয়েস্টে সাড়া দিন।',
        count: '৮১ ডেমো ডোনার',
      },
      {
        title: 'অ্যালামনাই ডিরেক্টরি',
        description:
          'অ্যালামনাই প্রোফাইল, কর্মস্থলের তথ্য এবং মেন্টরশিপ সুযোগ যোগ করুন।',
        count: '০৬ ফিচার্ড অ্যালামনাই',
      },
      {
        title: 'হোমপেজ কনটেন্ট',
        description:
          'হিরো সেকশন, পরিসংখ্যান, কল-টু-অ্যাকশন এবং ফিচার্ড ক্যাম্পেইন আপডেট করুন।',
        count: 'পুরোপুরি সম্পাদনাযোগ্য',
      },
    ] as AdminModule[],
  },
} as const

export type LocalizedContent = (typeof localizedContent)['en']