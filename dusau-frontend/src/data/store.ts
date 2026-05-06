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
const email = 'Contact the DUSAU committee'
const phone = 'Available through official committee communication'

export const localizedContent = {
  en: {
    siteConfig: {
      name: 'DUSAU',
      fullName: 'Dhaka University Students Association of Uttara',
      tagline: 'Connecting students from Uttara at the University of Dhaka.',
      shortDescription:
        'A student-led organization dedicated to connection, welfare, leadership, alumni engagement, and community service.',
      description:
        'DUSAU brings together University of Dhaka students from Uttara through student support, social initiatives, leadership development, alumni connection, and community-focused programs.',
      location: 'Uttara, Dhaka • University of Dhaka, Bangladesh',
      email,
      phone,
      heroImage,
    },

    common: {
      adminDemoLabel: 'Admin Access',
      goToTop: '↑ Go to top',
    },

    footer: {
      description:
        'Dhaka University Students Association of Uttara connects students, alumni, and well-wishers through service, leadership, mentorship, and community engagement.',
      exploreHeading: 'Explore',
      contactHeading: 'Contact',
      copyrightNote: 'All rights reserved.',
    },

    hero: {
      eyebrow: 'Student-led • Community-focused • Uttara to DU',
      titleLead: 'A digital home for',
      description:
        'DUSAU is the community platform for University of Dhaka students from Uttara — built to share activities, preserve leadership history, connect alumni, and support meaningful student-led initiatives.',
      primaryCta: 'Explore Events',
      secondaryCta: 'Contact DUSAU',
      annualCycleLabel: 'Annual leadership cycle',
      annualCycleText:
        'New students join, new leaders take responsibility, alumni stay connected, and the organization grows stronger every year.',
      platformVisionLabel: 'Community platform',
      platformVisionText:
        'A reliable public space for DUSAU activities, people, memories, and institutional continuity.',
    },

    homePage: {
      introEyebrow: 'Why DUSAU matters',
      introTitle:
        'A student community built on belonging, leadership, and service.',
      introPara1:
        'Every year, students from Uttara begin a new chapter at the University of Dhaka. DUSAU helps them feel connected from the beginning by creating a space for guidance, friendship, senior-junior bonding, and shared responsibility.',
      introPara2:
        'Through welcome programs, welfare initiatives, events, alumni engagement, and community service, DUSAU continues to build a strong identity that extends beyond campus life.',
      recentEventsEyebrow: 'Recent highlights',
      recentEventsTitle: 'Activities that reflect the spirit of DUSAU',
      recentEventsDescription:
        'Explore programs, gatherings, welfare initiatives, social service activities, and moments that bring the DUSAU community together.',
      exploreAllEvents: 'Explore all events',
      leadershipEyebrow: 'Current leadership',
      leadershipTitlePrefix: 'Meet the ',
      leadershipTitleSuffix: ' committee',
      leadershipDescription:
        'Each committee carries the responsibility of serving students, organizing activities, and preserving the values of DUSAU for the next generation.',
      emergencyEyebrow: 'Community support',
      emergencyTitle: 'Standing beside students and the community when support matters',
      emergencyPara:
        'DUSAU aims to support students and community members through organized communication, welfare initiatives, and responsible coordination during urgent needs.',
      emergencyPrimaryCta: 'Blood support page',
      emergencySecondaryCta: 'Contact DUSAU',
      emergencyCards: [
        { label: 'Student welfare', value: 'Support and coordination' },
        { label: 'Community care', value: 'Service-driven initiatives' },
        { label: 'Responsible action', value: 'Organized communication' },
        { label: 'Shared trust', value: 'Led by students and alumni' },
      ],
      alumniEyebrow: 'Alumni strength',
      alumniTitle: 'A growing network beyond campus life',
      alumniDescription:
        'DUSAU values its alumni as mentors, supporters, and long-term contributors to the organization’s identity and continuity.',
      closingEyebrow: 'Our commitment',
      closingTitle: 'Preserving community, leadership, and legacy in one place',
      closingPara1:
        'This platform presents DUSAU’s activities, leadership, alumni, gallery, and communication channels in a structured public space. It helps visitors understand who we are, what we do, and how the community continues to grow.',
      closingPara2:
        'As new committees take responsibility each year, this website can preserve the organization’s journey while keeping students, alumni, and well-wishers connected.',
      closingPrimaryCta: 'Read the story',
      closingSecondaryCta: 'Go to dashboard',
      demoNote:
        'DUSAU is maintained by its student leadership with the support, memory, and encouragement of its wider alumni community.',
    },

    aboutPage: {
      eyebrow: 'About DUSAU',
      title: 'Built by students, strengthened by community, carried forward by alumni',
      description:
        'Dhaka University Students Association of Uttara exists to connect University of Dhaka students from Uttara through belonging, support, leadership, and service.',
      ideaTitle: 'The idea behind the organization',
      ideaPara1:
        'DUSAU was formed around a simple belief: students from Uttara studying at the University of Dhaka should have a reliable community where they feel welcomed, supported, and connected.',
      ideaPara2:
        'The organization creates opportunities for leadership, friendship, social responsibility, and alumni connection — turning student life into a shared journey of growth and service.',
      websiteTitle: 'What this website represents',
      websitePara1:
        'This website presents DUSAU’s identity, activities, leadership, alumni network, gallery, and communication channels in one official public platform.',
      websitePara2:
        'It is designed to help current students, alumni, guardians, well-wishers, and partners understand the organization and stay connected with its ongoing work.',
      howEyebrow: 'How the journey continues',
      howTitle: 'A yearly cycle of welcome, leadership, service, and legacy',
      howDescription:
        'Every year adds a new chapter to DUSAU’s story as new students join, leaders take responsibility, and alumni remain part of the wider community.',
      coreEyebrow: 'What DUSAU stands for',
      coreTitle: 'Core areas of activity',
      coreDescription:
        'DUSAU focuses on student connection, community support, leadership development, alumni engagement, and meaningful social contribution.',
    },

    eventsPage: {
      eyebrow: 'Events & programs',
      title: 'Programs that bring students, alumni, and community together',
      description:
        'Explore DUSAU events, welcome programs, social initiatives, sports, cultural activities, welfare work, and alumni engagement programs.',
    },

    committeePage: {
      eyebrow: 'Committee',
      titlePrefix: 'Current leadership: ',
      titleSuffix: '',
      description:
        'The DUSAU committee leads yearly activities, coordinates student support, manages programs, and carries the organization’s mission forward.',
      archiveEyebrow: 'Archive',
      archiveTitle: 'Past committees remain part of DUSAU’s history',
      archiveDescription:
        'Each committee contributes to the organization’s continuity. Preserving past leadership helps recognize service and maintain institutional memory.',
      archiveCardTitle: 'Committee archive',
      archiveMembersPrefix: '',
      archiveMembersSuffix: ' members listed',
    },

    alumniPage: {
      eyebrow: 'Alumni network',
      title: 'A lasting network of support, mentorship, and connection',
      description:
        'DUSAU alumni remain an important part of the organization by supporting students, sharing experience, and strengthening the community beyond university life.',
      reasons: [
        {
          title: 'Credibility',
          description:
            'A connected alumni network reflects the organization’s history, maturity, and long-term impact.',
        },
        {
          title: 'Mentorship',
          description:
            'Alumni can guide current students through academic advice, career direction, and real-world experience.',
        },
        {
          title: 'Continuity',
          description:
            'As committees change each year, alumni help preserve values, identity, and institutional memory.',
        },
      ],
    },

    galleryPage: {
      eyebrow: 'Gallery',
      title: 'Moments that preserve the DUSAU journey',
      description:
        'Browse photos from programs, gatherings, service activities, and community moments that reflect the people and spirit of DUSAU.',
    },

    bloodSupportPage: {
      eyebrow: 'Blood support',
      title: 'Responsible coordination for urgent community needs',
      description:
        'DUSAU supports emergency communication and responsible coordination when students or community members need urgent blood-related assistance.',
      heroEyebrow: 'Community response',
      heroTitle: 'Organized support during urgent needs',
      heroPara:
        'Through trusted coordination, DUSAU can help connect requests with available support while keeping sensitive donor information protected and responsibly managed.',
      heroPrimaryCta: 'Request support',
      heroSecondaryCta: 'Contact DUSAU',
      availableSuffix: ' donors listed',
      workflowEyebrow: 'How it works',
      workflowTitle: 'A responsible support workflow',
      workflowDescription:
        'The goal is to make urgent communication clearer, safer, and more organized.',
      steps: [
        {
          title: 'Request is received',
          description:
            'A student, guardian, or community member contacts DUSAU with an urgent need.',
        },
        {
          title: 'Information is verified',
          description:
            'Authorized coordinators review the request and confirm necessary details.',
        },
        {
          title: 'Support is coordinated',
          description:
            'The team communicates with relevant people while protecting personal information.',
        },
        {
          title: 'Follow-up is maintained',
          description:
            'The committee can continue communication until the request is resolved or redirected.',
        },
      ],
    },

    contactPage: {
      eyebrow: 'Contact',
      title: 'Connect with DUSAU',
      description:
        'Reach out for organizational information, collaboration, student support, alumni communication, or general inquiries.',
      form: {
        nameLabel: 'Full name',
        namePlaceholder: 'Your name',
        emailLabel: 'Email',
        emailPlaceholder: 'you@example.com',
        subjectLabel: 'Subject',
        subjectPlaceholder: 'Reason for contacting DUSAU',
        messageLabel: 'Message',
        messagePlaceholder: 'Write your message here...',
        buttonLabel: 'Send message',
        note:
          'For urgent matters, please contact the responsible DUSAU committee representatives through official communication channels.',
      },
    },

    adminDemoPage: {
      eyebrow: 'Admin dashboard',
      title: 'Manage DUSAU content from one protected dashboard',
      description:
        'Authorized administrators can manage organization information, events, committees, alumni, advisors, gallery content, and public updates.',
      committeeEyebrow: 'Committee control',
      committeeTitle: 'Manage yearly leadership with clarity',
      committeePara:
        'Each committee can be added, updated, pinned, archived, and presented publicly so that DUSAU’s leadership history remains organized.',
      currentYearLabel: 'Current year',
      currentMembersLabel: 'Current members',
      currentMembersSuffix: ' listed',
      publishedEventsLabel: 'Published events',
      publishedEventsSuffix: ' items',
      futureAccessLabel: 'Access',
      futureAccessValue: 'Protected admin system',
    },

    navLinks: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Events', href: '/events' },
      { label: 'Committee', href: '/committee' },
      { label: 'Alumni', href: '/alumni' },
      { label: 'Advisors', href: '/advisors' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'Contact', href: '/contact' },
      { label: 'Login', href: '/login' },
      { label: 'Dashboard', href: '/dashboard' },
    ] as NavLink[],

    homeStats: [
      { value: 'Students', label: 'Connected through DUSAU' },
      { value: 'Alumni', label: 'Part of the wider network' },
      { value: 'Programs', label: 'Organized by yearly committees' },
      { value: 'Service', label: 'Focused on community welfare' },
    ] as StatItem[],

    impactAreas: [
      {
        title: 'Student welcome and connection',
        description:
          'DUSAU helps new University of Dhaka students from Uttara connect with seniors, peers, and the wider community.',
      },
      {
        title: 'Social service and welfare',
        description:
          'The organization encourages student-led initiatives that support people, respond to needs, and promote responsibility.',
      },
      {
        title: 'Leadership and teamwork',
        description:
          'Yearly committees give students the opportunity to lead, organize, communicate, and serve with accountability.',
      },
      {
        title: 'Alumni and long-term network',
        description:
          'DUSAU connects current students with alumni who can offer guidance, encouragement, and institutional continuity.',
      },
    ],

    journeySteps: [
      {
        step: '01',
        title: 'Students arrive at the University of Dhaka',
        description:
          'New students from Uttara begin their university journey and look for connection, guidance, and belonging.',
      },
      {
        step: '02',
        title: 'DUSAU welcomes and connects them',
        description:
          'Through programs, communication, and senior-junior bonding, students become part of a supportive network.',
      },
      {
        step: '03',
        title: 'A committee takes responsibility',
        description:
          'Student leaders organize activities, coordinate members, and continue the organization’s yearly work.',
      },
      {
        step: '04',
        title: 'Alumni continue the legacy',
        description:
          'After graduation, members remain connected as alumni and continue supporting the community in different ways.',
      },
    ],

    events: [] as EventItem[],
    committeeYears: [] as CommitteeYear[],
    alumni: [] as AlumniMember[],
    galleryItems: [] as GalleryItem[],
    bloodGroupStats: [] as BloodGroupItem[],

    contactCards: [
      {
        title: 'General contact',
        value: email,
        description:
          'For organizational information, student communication, partnerships, and general inquiries.',
      },
      {
        title: 'Location',
        value: 'Uttara, Dhaka • University of Dhaka, Bangladesh',
        description:
          'Rooted in Uttara and connected through the University of Dhaka community.',
      },
      {
        title: 'Committee communication',
        value: phone,
        description:
          'For urgent or official matters, please contact the responsible DUSAU committee representatives.',
      },
    ] as ContactCard[],

    adminModules: [
      {
        title: 'Organization profile',
        description:
          'Update the public identity, cover information, contact details, and organization description.',
        count: 'Editable',
      },
      {
        title: 'Committee management',
        description:
          'Create, update, pin, archive, and organize yearly committees and committee members.',
        count: 'Dashboard managed',
      },
      {
        title: 'Event publishing',
        description:
          'Publish events with dates, descriptions, images, videos, tags, and homepage highlights.',
        count: 'Dashboard managed',
      },
      {
        title: 'Gallery and media',
        description:
          'Upload and manage visual memories from DUSAU programs, gatherings, and initiatives.',
        count: 'Dashboard managed',
      },
      {
        title: 'Alumni and advisors',
        description:
          'Present alumni and advisor profiles with professional details and organizational relevance.',
        count: 'Dashboard managed',
      },
      {
        title: 'Public communication',
        description:
          'Keep the website useful, updated, trustworthy, and ready for visitors.',
        count: 'Ongoing',
      },
    ] as AdminModule[],
  },

  bn: {
    siteConfig: {
      name: 'DUSAU',
      fullName: 'উত্তরা ভিত্তিক ঢাকা বিশ্ববিদ্যালয় শিক্ষার্থী সমিতি',
      tagline: 'ঢাকা বিশ্ববিদ্যালয়ে উত্তরার শিক্ষার্থীদের সংযোগের জায়গা।',
      shortDescription:
        'সংযোগ, কল্যাণ, নেতৃত্ব, অ্যালামনাই সম্পৃক্ততা এবং কমিউনিটি সেবার জন্য একটি শিক্ষার্থী-নেতৃত্বাধীন সংগঠন।',
      description:
        'ডুসাউ উত্তরার ঢাকা বিশ্ববিদ্যালয় শিক্ষার্থীদের শিক্ষার্থী সহায়তা, সামাজিক উদ্যোগ, নেতৃত্ব বিকাশ, অ্যালামনাই সংযোগ এবং কমিউনিটি-কেন্দ্রিক কার্যক্রমের মাধ্যমে যুক্ত করে।',
      location: 'উত্তরা, ঢাকা • ঢাকা বিশ্ববিদ্যালয়, বাংলাদেশ',
      email,
      phone,
      heroImage,
    },

    common: {
      adminDemoLabel: 'অ্যাডমিন অ্যাক্সেস',
      goToTop: '↑ উপরে যান',
    },

    footer: {
      description:
        'উত্তরা ভিত্তিক ঢাকা বিশ্ববিদ্যালয় শিক্ষার্থী সমিতি সেবা, নেতৃত্ব, মেন্টরশিপ এবং কমিউনিটি সম্পৃক্ততার মাধ্যমে শিক্ষার্থী, অ্যালামনাই এবং শুভাকাঙ্ক্ষীদের যুক্ত করে।',
      exploreHeading: 'এক্সপ্লোর করুন',
      contactHeading: 'যোগাযোগ',
      copyrightNote: 'সর্বস্বত্ব সংরক্ষিত।',
    },

    hero: {
      eyebrow: 'শিক্ষার্থী-নেতৃত্বাধীন • কমিউনিটি-কেন্দ্রিক • উত্তরা থেকে ঢাবি',
      titleLead: 'এর জন্য একটি ডিজিটাল ঠিকানা',
      description:
        'ডুসাউ উত্তরার ঢাকা বিশ্ববিদ্যালয় শিক্ষার্থীদের কমিউনিটি প্ল্যাটফর্ম — যেখানে কার্যক্রম, নেতৃত্বের ইতিহাস, অ্যালামনাই সংযোগ এবং শিক্ষার্থী-নেতৃত্বাধীন উদ্যোগগুলো একসাথে তুলে ধরা হয়।',
      primaryCta: 'আয়োজন দেখুন',
      secondaryCta: 'যোগাযোগ করুন',
      annualCycleLabel: 'বার্ষিক নেতৃত্ব চক্র',
      annualCycleText:
        'নতুন শিক্ষার্থীরা যুক্ত হয়, নতুন নেতৃত্ব দায়িত্ব নেয়, অ্যালামনাই সংযুক্ত থাকে, আর সংগঠন প্রতি বছর আরও শক্তিশালী হয়।',
      platformVisionLabel: 'কমিউনিটি প্ল্যাটফর্ম',
      platformVisionText:
        'ডুসাউয়ের কার্যক্রম, মানুষ, স্মৃতি এবং প্রাতিষ্ঠানিক ধারাবাহিকতার একটি নির্ভরযোগ্য পাবলিক জায়গা।',
    },

    homePage: {
      introEyebrow: 'কেন ডুসাউ গুরুত্বপূর্ণ',
      introTitle: 'আপনত্ব, নেতৃত্ব এবং সেবার ওপর দাঁড়ানো একটি শিক্ষার্থী কমিউনিটি।',
      introPara1:
        'প্রতি বছর উত্তরার শিক্ষার্থীরা ঢাকা বিশ্ববিদ্যালয়ে নতুন অধ্যায় শুরু করে। ডুসাউ তাদের শুরু থেকেই সংযুক্ত থাকতে সাহায্য করে — সিনিয়র-জুনিয়র বন্ধন, দিকনির্দেশনা, বন্ধুত্ব এবং দায়িত্ববোধের মাধ্যমে।',
      introPara2:
        'নবীনবরণ, কল্যাণমূলক উদ্যোগ, আয়োজন, অ্যালামনাই সম্পৃক্ততা এবং কমিউনিটি সেবার মাধ্যমে ডুসাউ ক্যাম্পাস জীবনের বাইরেও একটি শক্তিশালী পরিচয় গড়ে তোলে।',
      recentEventsEyebrow: 'সাম্প্রতিক হাইলাইট',
      recentEventsTitle: 'ডুসাউয়ের প্রাণকে তুলে ধরে এমন কার্যক্রম',
      recentEventsDescription:
        'ডুসাউ কমিউনিটিকে একসাথে আনে এমন আয়োজন, সামাজিক উদ্যোগ, কল্যাণমূলক কাজ, ক্রীড়া, সাংস্কৃতিক কার্যক্রম এবং অ্যালামনাই সম্পৃক্ততা দেখুন।',
      exploreAllEvents: 'সব আয়োজন দেখুন',
      leadershipEyebrow: 'বর্তমান নেতৃত্ব',
      leadershipTitlePrefix: '',
      leadershipTitleSuffix: ' সালের কমিটি',
      leadershipDescription:
        'প্রতি কমিটি শিক্ষার্থী সেবা, আয়োজন, সমন্বয় এবং ডুসাউয়ের মূল্যবোধকে পরবর্তী প্রজন্মের কাছে পৌঁছে দেওয়ার দায়িত্ব বহন করে।',
      emergencyEyebrow: 'কমিউনিটি সহায়তা',
      emergencyTitle: 'যখন সহায়তা জরুরি, ডুসাউ পাশে দাঁড়ানোর চেষ্টা করে',
      emergencyPara:
        'সংগঠিত যোগাযোগ, কল্যাণমূলক উদ্যোগ এবং দায়িত্বশীল সমন্বয়ের মাধ্যমে ডুসাউ শিক্ষার্থী ও কমিউনিটির পাশে থাকতে চায়।',
      emergencyPrimaryCta: 'ব্লাড সাপোর্ট পেজ',
      emergencySecondaryCta: 'ডুসাউয়ের সাথে যোগাযোগ',
      emergencyCards: [
        { label: 'শিক্ষার্থী কল্যাণ', value: 'সহায়তা ও সমন্বয়' },
        { label: 'কমিউনিটি কেয়ার', value: 'সেবামুখী উদ্যোগ' },
        { label: 'দায়িত্বশীল কাজ', value: 'সুশৃঙ্খল যোগাযোগ' },
        { label: 'আস্থা', value: 'শিক্ষার্থী ও অ্যালামনাই নেতৃত্বাধীন' },
      ],
      alumniEyebrow: 'অ্যালামনাই শক্তি',
      alumniTitle: 'ক্যাম্পাস জীবনের বাইরেও একটি বিস্তৃত নেটওয়ার্ক',
      alumniDescription:
        'ডুসাউ অ্যালামনাইদের মেন্টর, সহায়ক এবং সংগঠনের পরিচয় ও ধারাবাহিকতার দীর্ঘমেয়াদি অংশ হিসেবে মূল্যায়ন করে।',
      closingEyebrow: 'আমাদের অঙ্গীকার',
      closingTitle: 'কমিউনিটি, নেতৃত্ব এবং উত্তরাধিকারকে এক জায়গায় সংরক্ষণ',
      closingPara1:
        'এই প্ল্যাটফর্ম ডুসাউয়ের কার্যক্রম, নেতৃত্ব, অ্যালামনাই, গ্যালারি এবং যোগাযোগের জায়গাগুলোকে একটি সংগঠিত পাবলিক স্পেসে উপস্থাপন করে।',
      closingPara2:
        'প্রতি বছর নতুন কমিটি দায়িত্ব নেওয়ার সাথে সাথে এই ওয়েবসাইট সংগঠনের যাত্রা সংরক্ষণ করবে এবং শিক্ষার্থী, অ্যালামনাই ও শুভাকাঙ্ক্ষীদের সংযুক্ত রাখবে।',
      closingPrimaryCta: 'গল্পটি পড়ুন',
      closingSecondaryCta: 'ড্যাশবোর্ডে যান',
      demoNote:
        'ডুসাউ তার শিক্ষার্থী নেতৃত্ব, অ্যালামনাই কমিউনিটি এবং শুভাকাঙ্ক্ষীদের সহায়তায় এগিয়ে চলে।',
    },

    aboutPage: {
      eyebrow: 'ডুসাউ সম্পর্কে',
      title: 'শিক্ষার্থীদের হাতে গড়া, কমিউনিটিতে শক্তিশালী, অ্যালামনাইদের মাধ্যমে বহমান',
      description:
        'উত্তরা ভিত্তিক ঢাকা বিশ্ববিদ্যালয় শিক্ষার্থী সমিতি আপনত্ব, সহায়তা, নেতৃত্ব এবং সেবার মাধ্যমে উত্তরার ঢাকা বিশ্ববিদ্যালয় শিক্ষার্থীদের যুক্ত করে।',
      ideaTitle: 'সংগঠনটির মূল ভাবনা',
      ideaPara1:
        'ডুসাউ একটি সহজ বিশ্বাস থেকে গড়ে উঠেছে: ঢাকা বিশ্ববিদ্যালয়ে পড়া উত্তরার শিক্ষার্থীদের এমন একটি নির্ভরযোগ্য কমিউনিটি থাকা দরকার যেখানে তারা স্বাগত, সহায়তা এবং সংযোগ পায়।',
      ideaPara2:
        'সংগঠনটি নেতৃত্ব, বন্ধুত্ব, সামাজিক দায়িত্ব এবং অ্যালামনাই সংযোগের সুযোগ তৈরি করে — শিক্ষার্থী জীবনকে একটি যৌথ যাত্রায় পরিণত করে।',
      websiteTitle: 'এই ওয়েবসাইট কী প্রতিনিধিত্ব করে',
      websitePara1:
        'এই ওয়েবসাইট ডুসাউয়ের পরিচয়, কার্যক্রম, নেতৃত্ব, অ্যালামনাই নেটওয়ার্ক, গ্যালারি এবং যোগাযোগের মাধ্যমগুলোকে একটি অফিসিয়াল পাবলিক প্ল্যাটফর্মে উপস্থাপন করে।',
      websitePara2:
        'এটি বর্তমান শিক্ষার্থী, অ্যালামনাই, অভিভাবক, শুভাকাঙ্ক্ষী এবং সহযোগীদের সংগঠন সম্পর্কে জানতে ও যুক্ত থাকতে সাহায্য করে।',
      howEyebrow: 'যাত্রা যেভাবে চলতে থাকে',
      howTitle: 'স্বাগত, নেতৃত্ব, সেবা এবং উত্তরাধিকারের বার্ষিক চক্র',
      howDescription:
        'নতুন শিক্ষার্থী যুক্ত হয়, নেতৃত্ব দায়িত্ব নেয়, এবং অ্যালামনাই কমিউনিটির অংশ হয়ে থাকে — এভাবেই প্রতি বছর ডুসাউয়ের গল্পে নতুন অধ্যায় যোগ হয়।',
      coreEyebrow: 'ডুসাউ কী প্রতিনিধিত্ব করে',
      coreTitle: 'মূল কার্যক্রমের ক্ষেত্র',
      coreDescription:
        'ডুসাউ শিক্ষার্থী সংযোগ, কমিউনিটি সহায়তা, নেতৃত্ব বিকাশ, অ্যালামনাই সম্পৃক্ততা এবং অর্থবহ সামাজিক অবদানে কাজ করে।',
    },

    eventsPage: {
      eyebrow: 'আয়োজন ও কার্যক্রম',
      title: 'শিক্ষার্থী, অ্যালামনাই এবং কমিউনিটিকে একত্র করে এমন আয়োজন',
      description:
        'ডুসাউয়ের ইভেন্ট, নবীনবরণ, সামাজিক উদ্যোগ, ক্রীড়া, সাংস্কৃতিক কার্যক্রম, কল্যাণমূলক কাজ এবং অ্যালামনাই প্রোগ্রামগুলো দেখুন।',
    },

    committeePage: {
      eyebrow: 'কমিটি',
      titlePrefix: 'বর্তমান নেতৃত্ব: ',
      titleSuffix: '',
      description:
        'ডুসাউ কমিটি বার্ষিক কার্যক্রম পরিচালনা করে, শিক্ষার্থী সহায়তা সমন্বয় করে, আয়োজন ম্যানেজ করে এবং সংগঠনের লক্ষ্যকে এগিয়ে নেয়।',
      archiveEyebrow: 'আর্কাইভ',
      archiveTitle: 'আগের কমিটিগুলো ডুসাউয়ের ইতিহাসের অংশ',
      archiveDescription:
        'প্রতি কমিটি সংগঠনের ধারাবাহিকতায় অবদান রাখে। পূর্বের নেতৃত্ব সংরক্ষণ করা সেবা ও প্রাতিষ্ঠানিক স্মৃতিকে সম্মান জানায়।',
      archiveCardTitle: 'কমিটি আর্কাইভ',
      archiveMembersPrefix: 'মোট ',
      archiveMembersSuffix: ' জন তালিকাভুক্ত',
    },

    alumniPage: {
      eyebrow: 'অ্যালামনাই নেটওয়ার্ক',
      title: 'সহায়তা, মেন্টরশিপ এবং সংযোগের দীর্ঘস্থায়ী নেটওয়ার্ক',
      description:
        'ডুসাউ অ্যালামনাই বর্তমান শিক্ষার্থীদের সহায়তা, অভিজ্ঞতা শেয়ার এবং বিশ্ববিদ্যালয় জীবনের পরও কমিউনিটিকে শক্তিশালী রাখার গুরুত্বপূর্ণ অংশ।',
      reasons: [
        {
          title: 'বিশ্বাসযোগ্যতা',
          description:
            'সংযুক্ত অ্যালামনাই নেটওয়ার্ক সংগঠনের ইতিহাস, পরিণততা এবং দীর্ঘমেয়াদি প্রভাবকে তুলে ধরে।',
        },
        {
          title: 'মেন্টরশিপ',
          description:
            'অ্যালামনাই বর্তমান শিক্ষার্থীদের একাডেমিক পরামর্শ, ক্যারিয়ার দিকনির্দেশনা এবং বাস্তব অভিজ্ঞতা দিতে পারেন।',
        },
        {
          title: 'ধারাবাহিকতা',
          description:
            'প্রতি বছর কমিটি পরিবর্তন হলেও অ্যালামনাই মূল্যবোধ, পরিচয় এবং প্রাতিষ্ঠানিক স্মৃতি ধরে রাখতে সাহায্য করেন।',
        },
      ],
    },

    galleryPage: {
      eyebrow: 'গ্যালারি',
      title: 'ডুসাউয়ের যাত্রাকে সংরক্ষণ করে এমন মুহূর্ত',
      description:
        'ডুসাউয়ের প্রোগ্রাম, মিলনমেলা, সেবামূলক কার্যক্রম এবং কমিউনিটি মুহূর্তের ছবি দেখুন।',
    },

    bloodSupportPage: {
      eyebrow: 'ব্লাড সাপোর্ট',
      title: 'জরুরি কমিউনিটি প্রয়োজনে দায়িত্বশীল সমন্বয়',
      description:
        'কোনো শিক্ষার্থী বা কমিউনিটি সদস্যের জরুরি রক্ত-সংক্রান্ত সহায়তার প্রয়োজন হলে ডুসাউ দায়িত্বশীল যোগাযোগ ও সমন্বয়ে সহায়তা করতে চায়।',
      heroEyebrow: 'কমিউনিটি রেসপন্স',
      heroTitle: 'জরুরি প্রয়োজনের সময় সংগঠিত সহায়তা',
      heroPara:
        'বিশ্বস্ত সমন্বয়ের মাধ্যমে ডুসাউ অনুরোধকে সম্ভাব্য সহায়তার সাথে যুক্ত করতে পারে, একই সঙ্গে ব্যক্তিগত তথ্য নিরাপদ ও দায়িত্বশীলভাবে পরিচালিত থাকে।',
      heroPrimaryCta: 'সহায়তা চাইুন',
      heroSecondaryCta: 'যোগাযোগ করুন',
      availableSuffix: ' জন ডোনার তালিকাভুক্ত',
      workflowEyebrow: 'যেভাবে কাজ করে',
      workflowTitle: 'একটি দায়িত্বশীল সহায়তা প্রক্রিয়া',
      workflowDescription:
        'লক্ষ্য হলো জরুরি যোগাযোগকে আরও স্পষ্ট, নিরাপদ এবং সংগঠিত করা।',
      steps: [
        {
          title: 'অনুরোধ পাওয়া হয়',
          description:
            'কোনো শিক্ষার্থী, অভিভাবক বা কমিউনিটি সদস্য জরুরি প্রয়োজন নিয়ে ডুসাউয়ের সাথে যোগাযোগ করেন।',
        },
        {
          title: 'তথ্য যাচাই করা হয়',
          description:
            'দায়িত্বপ্রাপ্ত সমন্বয়কারীরা অনুরোধটি পর্যালোচনা করে প্রয়োজনীয় তথ্য নিশ্চিত করেন।',
        },
        {
          title: 'সহায়তা সমন্বয় করা হয়',
          description:
            'দলটি ব্যক্তিগত তথ্য সুরক্ষিত রেখে সংশ্লিষ্ট মানুষের সাথে যোগাযোগ করে।',
        },
        {
          title: 'ফলো-আপ রাখা হয়',
          description:
            'অনুরোধ সমাধান বা প্রয়োজনীয় জায়গায় রিডাইরেক্ট না হওয়া পর্যন্ত কমিটি যোগাযোগ রাখে।',
        },
      ],
    },

    contactPage: {
      eyebrow: 'যোগাযোগ',
      title: 'ডুসাউয়ের সাথে যুক্ত হন',
      description:
        'সংগঠন-সংক্রান্ত তথ্য, সহযোগিতা, শিক্ষার্থী সহায়তা, অ্যালামনাই যোগাযোগ বা সাধারণ প্রশ্নের জন্য যোগাযোগ করুন।',
      form: {
        nameLabel: 'পূর্ণ নাম',
        namePlaceholder: 'আপনার নাম',
        emailLabel: 'ইমেইল',
        emailPlaceholder: 'you@example.com',
        subjectLabel: 'বিষয়',
        subjectPlaceholder: 'কেন ডুসাউয়ের সাথে যোগাযোগ করছেন',
        messageLabel: 'বার্তা',
        messagePlaceholder: 'এখানে আপনার বার্তা লিখুন...',
        buttonLabel: 'বার্তা পাঠান',
        note:
          'জরুরি বিষয়ের জন্য দায়িত্বপ্রাপ্ত ডুসাউ কমিটি প্রতিনিধিদের অফিসিয়াল যোগাযোগ মাধ্যমে যোগাযোগ করুন।',
      },
    },

    adminDemoPage: {
      eyebrow: 'অ্যাডমিন ড্যাশবোর্ড',
      title: 'একটি সুরক্ষিত ড্যাশবোর্ড থেকে ডুসাউয়ের কনটেন্ট পরিচালনা',
      description:
        'অনুমোদিত অ্যাডমিনরা সংগঠনের তথ্য, ইভেন্ট, কমিটি, অ্যালামনাই, অ্যাডভাইজর, গ্যালারি এবং পাবলিক আপডেট পরিচালনা করতে পারবেন।',
      committeeEyebrow: 'কমিটি নিয়ন্ত্রণ',
      committeeTitle: 'বার্ষিক নেতৃত্ব পরিষ্কারভাবে পরিচালনা করুন',
      committeePara:
        'প্রতিটি কমিটি যোগ, আপডেট, পিন, আর্কাইভ এবং পাবলিকভাবে উপস্থাপন করা যাবে, যাতে ডুসাউয়ের নেতৃত্বের ইতিহাস সংগঠিত থাকে।',
      currentYearLabel: 'বর্তমান বছর',
      currentMembersLabel: 'বর্তমান সদস্য',
      currentMembersSuffix: ' জন তালিকাভুক্ত',
      publishedEventsLabel: 'প্রকাশিত আয়োজন',
      publishedEventsSuffix: ' টি আইটেম',
      futureAccessLabel: 'অ্যাক্সেস',
      futureAccessValue: 'সুরক্ষিত অ্যাডমিন সিস্টেম',
    },

    navLinks: [
      { label: 'হোম', href: '/' },
      { label: 'পরিচিতি', href: '/about' },
      { label: 'আয়োজন', href: '/events' },
      { label: 'কমিটি', href: '/committee' },
      { label: 'অ্যালামনাই', href: '/alumni' },
      { label: 'অ্যাডভাইজর', href: '/advisors' },
      { label: 'গ্যালারি', href: '/gallery' },
      { label: 'যোগাযোগ', href: '/contact' },
      { label: 'লগইন', href: '/login' },
      { label: 'ড্যাশবোর্ড', href: '/dashboard' },
    ] as NavLink[],

    homeStats: [
      { value: 'শিক্ষার্থী', label: 'ডুসাউয়ের মাধ্যমে সংযুক্ত' },
      { value: 'অ্যালামনাই', label: 'বিস্তৃত নেটওয়ার্কের অংশ' },
      { value: 'আয়োজন', label: 'বার্ষিক কমিটির পরিচালনায়' },
      { value: 'সেবা', label: 'কমিউনিটি কল্যাণে নিবেদিত' },
    ] as StatItem[],

    impactAreas: [
      {
        title: 'শিক্ষার্থী স্বাগত ও সংযোগ',
        description:
          'ডুসাউ উত্তরার নতুন ঢাকা বিশ্ববিদ্যালয় শিক্ষার্থীদের সিনিয়র, সহপাঠী এবং বৃহত্তর কমিউনিটির সাথে যুক্ত হতে সাহায্য করে।',
      },
      {
        title: 'সামাজিক সেবা ও কল্যাণ',
        description:
          'সংগঠনটি শিক্ষার্থী-নেতৃত্বাধীন উদ্যোগকে উৎসাহিত করে, যা মানুষের পাশে দাঁড়ায় এবং দায়িত্ববোধ তৈরি করে।',
      },
      {
        title: 'নেতৃত্ব ও দলগত কাজ',
        description:
          'বার্ষিক কমিটি শিক্ষার্থীদের নেতৃত্ব, আয়োজন, যোগাযোগ এবং জবাবদিহিতার সাথে সেবা করার সুযোগ দেয়।',
      },
      {
        title: 'অ্যালামনাই ও দীর্ঘমেয়াদি নেটওয়ার্ক',
        description:
          'ডুসাউ বর্তমান শিক্ষার্থীদের এমন অ্যালামনাইদের সাথে যুক্ত করে যারা দিকনির্দেশনা, উৎসাহ এবং প্রাতিষ্ঠানিক ধারাবাহিকতা দিতে পারেন।',
      },
    ],

    journeySteps: [
      {
        step: '01',
        title: 'শিক্ষার্থীরা ঢাকা বিশ্ববিদ্যালয়ে আসে',
        description:
          'উত্তরার নতুন শিক্ষার্থীরা বিশ্ববিদ্যালয় জীবন শুরু করে এবং সংযোগ, দিকনির্দেশনা ও আপনত্ব খোঁজে।',
      },
      {
        step: '02',
        title: 'ডুসাউ তাদের স্বাগত জানায় ও যুক্ত করে',
        description:
          'প্রোগ্রাম, যোগাযোগ এবং সিনিয়র-জুনিয়র বন্ধনের মাধ্যমে তারা একটি সহায়ক নেটওয়ার্কের অংশ হয়।',
      },
      {
        step: '03',
        title: 'কমিটি দায়িত্ব নেয়',
        description:
          'শিক্ষার্থী নেতারা কার্যক্রম আয়োজন করে, সদস্যদের সমন্বয় করে এবং সংগঠনের কাজ চালিয়ে যায়।',
      },
      {
        step: '04',
        title: 'অ্যালামনাই উত্তরাধিকার এগিয়ে নেয়',
        description:
          'স্নাতক হওয়ার পর সদস্যরা অ্যালামনাই হিসেবে সংযুক্ত থাকে এবং বিভিন্নভাবে কমিউনিটিকে সহায়তা করে।',
      },
    ],

    events: [] as EventItem[],
    committeeYears: [] as CommitteeYear[],
    alumni: [] as AlumniMember[],
    galleryItems: [] as GalleryItem[],
    bloodGroupStats: [] as BloodGroupItem[],

    contactCards: [
      {
        title: 'সাধারণ যোগাযোগ',
        value: email,
        description:
          'সংগঠন-সংক্রান্ত তথ্য, শিক্ষার্থী যোগাযোগ, সহযোগিতা এবং সাধারণ প্রশ্নের জন্য।',
      },
      {
        title: 'অবস্থান',
        value: 'উত্তরা, ঢাকা • ঢাকা বিশ্ববিদ্যালয়, বাংলাদেশ',
        description:
          'উত্তরাকে কেন্দ্র করে গড়ে ওঠা এবং ঢাকা বিশ্ববিদ্যালয় কমিউনিটির সাথে সংযুক্ত।',
      },
      {
        title: 'কমিটি যোগাযোগ',
        value: phone,
        description:
          'জরুরি বা অফিসিয়াল বিষয়ের জন্য দায়িত্বপ্রাপ্ত ডুসাউ কমিটি প্রতিনিধিদের সাথে যোগাযোগ করুন।',
      },
    ] as ContactCard[],

    adminModules: [
      {
        title: 'সংগঠনের প্রোফাইল',
        description:
          'পাবলিক পরিচয়, কভার তথ্য, যোগাযোগ এবং সংগঠনের বিবরণ আপডেট করুন।',
        count: 'সম্পাদনাযোগ্য',
      },
      {
        title: 'কমিটি ম্যানেজমেন্ট',
        description:
          'বার্ষিক কমিটি ও কমিটি সদস্য তৈরি, আপডেট, পিন, আর্কাইভ এবং সংগঠিত করুন।',
        count: 'ড্যাশবোর্ড ম্যানেজড',
      },
      {
        title: 'ইভেন্ট প্রকাশনা',
        description:
          'তারিখ, বিবরণ, ছবি, ভিডিও, ট্যাগ এবং হোমপেজ হাইলাইটসহ ইভেন্ট প্রকাশ করুন।',
        count: 'ড্যাশবোর্ড ম্যানেজড',
      },
      {
        title: 'গ্যালারি ও মিডিয়া',
        description:
          'ডুসাউ প্রোগ্রাম, মিলনমেলা এবং উদ্যোগের ভিজ্যুয়াল স্মৃতি আপলোড ও পরিচালনা করুন।',
        count: 'ড্যাশবোর্ড ম্যানেজড',
      },
      {
        title: 'অ্যালামনাই ও অ্যাডভাইজর',
        description:
          'অ্যালামনাই ও অ্যাডভাইজর প্রোফাইল পেশাগত তথ্য এবং সাংগঠনিক প্রাসঙ্গিকতাসহ উপস্থাপন করুন।',
        count: 'ড্যাশবোর্ড ম্যানেজড',
      },
      {
        title: 'পাবলিক যোগাযোগ',
        description:
          'ওয়েবসাইটকে প্রয়োজনীয়, আপডেটেড, বিশ্বাসযোগ্য এবং দর্শকদের জন্য প্রস্তুত রাখুন।',
        count: 'চলমান',
      },
    ] as AdminModule[],
  },
} as const

export type LocalizedContent = (typeof localizedContent)['en']
