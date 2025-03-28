// Mock data for JobSwipe
const mockJobs = [
    {
        id: 1,
        title: "Senior Frontend Developer",
        company: "TechCorp",
        companyLogo: "https://logo.clearbit.com/techcorp.com",
        location: "San Francisco, CA",
        salary: "$120,000 - $160,000",
        description: "Join our dynamic team building cutting-edge web applications using React and TypeScript.",
        skills: ["React", "TypeScript", "CSS3", "GraphQL"],
        experience: "5+ years",
        remote: true
    },
    {
        id: 2,
        title: "Full Stack Engineer",
        company: "StartupX",
        companyLogo: "https://logo.clearbit.com/startupx.com",
        location: "New York, NY",
        salary: "$100,000 - $140,000",
        description: "Looking for a versatile developer to help scale our SaaS platform.",
        skills: ["Node.js", "React", "MongoDB", "AWS"],
        experience: "3+ years",
        remote: true
    },
    {
        id: 3,
        title: "DevOps Engineer",
        company: "CloudTech",
        companyLogo: "https://logo.clearbit.com/cloudtech.com",
        location: "Austin, TX",
        salary: "$130,000 - $170,000",
        description: "Help us build and maintain our cloud infrastructure.",
        skills: ["AWS", "Kubernetes", "Docker", "CI/CD"],
        experience: "4+ years",
        remote: false
    },
    {
        id: 4,
        title: "UI/UX Designer",
        company: "DesignLabs",
        companyLogo: "https://logo.clearbit.com/designlabs.com",
        location: "Seattle, WA",
        salary: "$90,000 - $120,000",
        description: "Create beautiful and intuitive user experiences for our products.",
        skills: ["Figma", "Adobe XD", "User Research", "Prototyping"],
        experience: "2+ years",
        remote: true
    },
    {
        id: 5,
        title: "Backend Developer",
        company: "DataFlow",
        companyLogo: "https://logo.clearbit.com/dataflow.com",
        location: "Chicago, IL",
        salary: "$110,000 - $150,000",
        description: "Build scalable backend services for our data processing platform.",
        skills: ["Python", "Django", "PostgreSQL", "Redis"],
        experience: "4+ years",
        remote: true
    }
];

// Mock user profile data
const mockUser = {
    id: "user1",
    name: "Alex Johnson",
    title: "Full Stack Developer",
    skills: ["JavaScript", "React", "Node.js", "MongoDB"],
    experience: 3,
    location: "San Francisco, CA",
    preferences: {
        salary: {
            min: 100000,
            max: 160000
        },
        remote: true,
        locations: ["San Francisco, CA", "Remote"]
    }
};

// Storage keys
const STORAGE_KEYS = {
    USER_PROFILE: 'jobswipe_user',
    MATCHES: 'jobswipe_matches',
    SAVED_JOBS: 'jobswipe_saved',
    SEEN_JOBS: 'jobswipe_seen'
};

// Initialize local storage with mock data if empty
function initializeStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.USER_PROFILE)) {
        localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(mockUser));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MATCHES)) {
        localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SAVED_JOBS)) {
        localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SEEN_JOBS)) {
        localStorage.setItem(STORAGE_KEYS.SEEN_JOBS, JSON.stringify([]));
    }
}

// Initialize storage when the file loads
initializeStorage();