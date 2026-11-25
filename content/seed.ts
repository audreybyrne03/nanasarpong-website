/**
 * Starter content, drawn from Dr. Sarpong's CV (November 19, 2026).
 *
 * Two jobs:
 *  1. The site renders from this until a Sanity project is connected, so a
 *     Vercel preview works on day one.
 *  2. `npm run seed` copies all of it into Sanity, after which everything is
 *     edited in the Studio at /studio and this file is no longer read.
 *
 * Deliberately left out of the public site: home address, personal mobile and
 * e-mail, NPI/DEA/licence numbers, birthplace and other personal details.
 */
import type {
  Grant,
  IndustryRole,
  InnovationProject,
  Location,
  MediaItem,
  Procedure,
  Profile,
  PublicationEntry,
  SiteSettings,
  SpeakingItem,
  Testimonial,
} from "@/sanity/lib/types";

import cvSpeaking from "./cv-speaking.json";

export const seedSettings: SiteSettings = {
  title: "Nana O. Sarpong, MD, MBA",
  tagline: "Hip & Knee Replacement Surgeon · New York City",
  description:
    "Dr. Nana O. Sarpong is a fellowship-trained hip and knee replacement surgeon in New York City, joining Hospital for Special Surgery in December 2026. Robotic and mixed-reality knee replacement, anterior hip replacement, and complex revision surgery.",
  announcement: {
    enabled: true,
    text: "Dr. Sarpong is joining Hospital for Special Surgery (HSS) on December 14, 2026.",
    link: { label: "Appointment information", url: "/appointments" },
    showUntil: "2027-03-31",
  },
  hero: {
    eyebrow: "Hip & Knee Replacement · Hospital for Special Surgery",
    headline: "Joint replacement, engineered around you.",
    emphasis: "around you.",
    intro:
      "Fellowship-trained in adult reconstruction, Dr. Sarpong combines robotic and mixed-reality technology with a surgeon-scientist’s attention to outcomes, helping patients return to the lives they want to live.",
    primaryCta: { label: "Request an appointment", url: "/appointments" },
    secondaryCta: { label: "Meet Dr. Sarpong", url: "/about" },
  },
  stats: [
    { auto: "publications", label: "Peer-reviewed publications" },
    { value: "25+", label: "National course & symposium faculty roles" },
    { value: "ABOS", label: "Board certified, American Board of Orthopaedic Surgery" },
  ],
  sectionTitles: {
    approach: "Precision, evidence and care.",
    innovation: "Building the next generation of joint replacement.",
    closing: "Ready to move | without pain?",
  },
  pillars: [
    {
      title: "Technology with a purpose",
      text: "Robotic-assisted and mixed-reality guidance are used where the evidence supports them, to plan each implant to the patient’s own anatomy.",
    },
    {
      title: "Evidence, measured",
      text: "An active research program studies outcomes, recovery and value, so the care offered today is informed by what is learned from every patient.",
    },
    {
      title: "Care for every patient",
      text: "Research and advocacy on the social factors that shape arthritis and recovery, so that excellent joint replacement reaches every community.",
    },
  ],
  appointments: {
    bookingUrl: "",
    bookingLabel: "Request an appointment",
    phone: "",
    note: "Dr. Sarpong sees patients at Hospital for Special Surgery beginning December 14, 2026.",
    comingSoonNote:
      "Online scheduling details for Dr. Sarpong’s HSS practice will be posted here. In the meantime, HSS’s main line can direct you to his office.",
    insuranceNote:
      "Insurance participation is managed by Hospital for Special Surgery. Please confirm coverage with the office when scheduling.",
  },
  contact: { officeEmail: "", mediaEmail: "", industryEmail: "" },
  orcid: { orcidId: "0000-0002-4574-8966", includeCvArchive: true, hiddenIds: [] },
  disclosure: {
    text: "Dr. Sarpong collaborates with industry on surgeon education, product advisory boards and research. These relationships are listed here for transparency and are reported as required by federal law and professional society policies.",
    links: [{ label: "CMS Open Payments", url: "https://openpaymentsdata.cms.gov/" }],
  },
  socialLinks: [
    { platform: "orcid", url: "https://orcid.org/0000-0002-4574-8966" },
    { platform: "pubmed", url: "https://pubmed.ncbi.nlm.nih.gov/?term=Sarpong+NO%5BAuthor%5D" },
  ],
  footerNote: "Hip & knee replacement surgeon, Hospital for Special Surgery, New York City.",
  medicalDisclaimer:
    "Information on this site is educational and is not medical advice. Please consult a physician about your own condition. Do not send personal health information through this website.",
  aboutPage: {
    title: "About Dr. Sarpong",
    intro: "Surgeon, researcher, educator and health-system leader, trained at Columbia and HSS.",
  },
  carePage: {
    title: "Hip & Knee Care",
    intro:
      "From a first consultation for arthritis to complex revision surgery, care is tailored to your anatomy, goals and activity.",
  },
  researchPage: {
    title: "Research & Publications",
    intro:
      "Clinical research on enabling technology, outcomes, value and equity in hip and knee replacement. The publication list updates automatically from Dr. Sarpong’s ORCID record.",
  },
  innovationPage: {
    title: "Innovation & Industry",
    intro:
      "Robotics, mixed reality and artificial intelligence are changing joint replacement. Dr. Sarpong studies them, teaches them, and advises the companies that build them.",
  },
  speakingPage: {
    title: "Speaking & Education",
    intro: "Course faculty, invited lectures and surgeon training across the country.",
  },
  mediaPage: {
    title: "Media",
    intro: "Videos, features and recognition. For interview requests, see contact details below.",
  },
  appointmentsPage: {
    title: "Appointments",
    intro: "Request a consultation for hip or knee pain, joint replacement, or a second opinion.",
  },
  shareCard: {
    byline: "Nana O. Sarpong, MD, MBA",
    homeTitle: "Nana O. Sarpong, MD, MBA",
    homeSubtitle: "Hip & Knee Replacement Surgeon · Hospital for Special Surgery",
  },
};

export const seedProfile: Profile = {
  name: "Nana O. Sarpong",
  credentials: "MD, MBA",
  role: "Hip & Knee Replacement Surgeon",
  affiliation: "Hospital for Special Surgery, New York City",
  portrait: { localSrc: "/portrait.jpg", alt: "Portrait of Dr. Nana O. Sarpong", dimensions: { width: 1544, height: 1600, aspectRatio: 0.965 } },
  shortBio:
    "Nana O. Sarpong, MD, MBA, is a fellowship-trained orthopaedic surgeon specializing in hip and knee replacement. He joins Hospital for Special Surgery in New York City in December 2026.",
  bio: [
    "Nana O. Sarpong, MD, MBA, is a fellowship-trained orthopaedic surgeon specializing in hip and knee replacement. On December 14, 2026, he joins Hospital for Special Surgery (HSS) in New York City.",
    "Dr. Sarpong performs primary hip replacement through direct anterior and mini-posterior approaches, total and partial knee replacement, hip resurfacing, and complex primary and revision hip and knee surgery. His practice and research focus on enabling technology, including robotic-assisted and mixed-reality-guided knee replacement.",
    "He earned his Bachelor of Science in Biology, magna cum laude, at Brandeis University as a Posse Foundation Scholar, then completed a combined MD/MBA at Tufts University School of Medicine and the Brandeis Heller School, where he was elected to Alpha Omega Alpha. He completed orthopaedic surgery residency at Columbia University Irving Medical Center/NewYork-Presbyterian, serving as Executive Chief Resident, and a fellowship in Adult Reconstruction and Joint Replacement at Hospital for Special Surgery/Weill Cornell Medical Center. He is board certified by the American Board of Orthopaedic Surgery.",
    "From 2022 to 2026, Dr. Sarpong was Assistant Professor of Orthopedic Surgery at Columbia University, where he also served as Medical Director of the Inpatient Orthopedic Unit and chaired the Orthopedic Surgery Perioperative Care Value Analysis Committee. He has authored more than 80 peer-reviewed publications, leads funded research on technology in knee replacement and on the social determinants of arthritis outcomes, and serves as an Associate Editor of Medicine Orthopaedics.",
    "Dr. Sarpong is a committed educator. He received the Charles S. Neer Faculty Teacher of the Year Award, teaches at national courses including the HSS Annual Knee and Hip Course, and has mentored students, residents and fellows into careers in joint replacement. He serves on the National Board of Directors of The Posse Foundation and as Vice Chair of the American Association of Hip and Knee Surgeons Diversity Advisory Board.",
  ].join("\n\n"),
  specialties: [
    "Direct anterior & mini-posterior hip replacement",
    "Robotic-assisted knee replacement",
    "Mixed-reality-guided knee replacement",
    "Partial knee replacement",
    "Hip resurfacing",
    "Revision hip & knee replacement",
    "Conversion hip replacement after prior fracture surgery",
  ],
  boardCertification: "American Board of Orthopaedic Surgery (2024)",
  training: [
    { years: "2008–2012", title: "BS, Biology, magna cum laude", organization: "Brandeis University", detail: "Posse Foundation Full-Tuition Leadership Scholar" },
    { years: "2012–2016", title: "MD/MBA", organization: "Tufts University School of Medicine · Brandeis Heller School", detail: "Alpha Omega Alpha; MBA in Health Management and Policy" },
    { years: "2016–2021", title: "Orthopaedic Surgery Residency", organization: "Columbia University Irving Medical Center / NewYork-Presbyterian", detail: "Executive Chief Resident, 2020–2021" },
    { years: "2021–2022", title: "Fellowship, Adult Reconstruction & Joint Replacement", organization: "Hospital for Special Surgery / Weill Cornell Medical Center" },
    { years: "2022–2026", title: "Attending Surgeon & Assistant Professor", organization: "Columbia University Irving Medical Center / NewYork-Presbyterian" },
    { years: "2026–", title: "Hip & Knee Replacement Surgeon", organization: "Hospital for Special Surgery" },
  ],
  appointments: [
    { years: "2022–2026", title: "Assistant Professor of Orthopedic Surgery", organization: "Columbia University College of Physicians and Surgeons" },
    { years: "2023–2026", title: "Medical Director, Inpatient Orthopedic Unit", organization: "Columbia University Irving Medical Center / NewYork-Presbyterian" },
    { years: "2024–2026", title: "Chair, Orthopedic Surgery Perioperative Care Value Analysis Committee", organization: "Columbia University Irving Medical Center / NewYork-Presbyterian" },
  ],
  leadership: [
    { years: "2020–", title: "National Board of Directors; Governance Committee", organization: "The Posse Foundation" },
    { years: "2026–", title: "Vice Chair, Diversity Advisory Board", organization: "American Association of Hip and Knee Surgeons" },
    { years: "2024–", title: "Member, Young Arthroplasty Group", organization: "American Association of Hip and Knee Surgeons" },
    { years: "2025–", title: "Technical Exhibits Committee", organization: "Eastern Orthopaedic Association" },
    { years: "2020", title: "Emerging Leader", organization: "American Orthopaedic Association" },
    { years: "2016–", title: "Co-Chair, NYC Alumni Association", organization: "Tufts University School of Medicine" },
  ],
  honors: [
    { year: "2026", title: "Best Doctors", organization: "New York Magazine", featured: true },
    { year: "2026", title: "Top Doctors", organization: "Castle Connolly", featured: true },
    { year: "2023–", title: "Rising Stars", organization: "New York Super Doctors", featured: true },
    { year: "2024", title: "Healthcare Research All-Stars", organization: "Avant-garde Health", featured: true },
    { year: "2024", title: "Charles S. Neer Faculty Teacher of the Year Award", organization: "New York Orthopaedic Hospital / Columbia University", featured: true },
    { year: "2021", title: "Nas S. Eftekhar, MD Award for Excellence in Adult Reconstruction", organization: "New York Orthopaedic Hospital / Columbia University" },
    { year: "2021", title: "Senior Resident Teacher of the Year Award", organization: "New York Orthopaedic Hospital / Columbia University" },
    { year: "2020", title: "Top Poster in Adult Reconstruction Knee", organization: "American Orthopaedic Association 133rd Annual Leadership Meeting" },
    { year: "2019", title: "Ranawat Award, Best Resident/Fellow Research Paper", organization: "Eastern Orthopaedic Association" },
    { year: "2017", title: "Resident and Fellow Research Award", organization: "Stryker Orthopedics" },
    { year: "2017", title: "Posse Star Honor", organization: "The Posse Foundation" },
    { year: "2016", title: "Norman S. Stearns MD/MBA Excellence in Leadership and Academic Achievement Award", organization: "Tufts University School of Medicine" },
    { year: "2016", title: "Dr. Ruth Marguerite Easterling Award for Outstanding Academic Achievement and Humaneness in Medicine", organization: "Tufts University School of Medicine" },
    { year: "2015", title: "Alpha Omega Alpha Medical Honor Society", organization: "Tufts University School of Medicine" },
  ],
  memberships: [
    { title: "American Academy of Orthopaedic Surgeons", detail: "Fellow" },
    { title: "American Association of Hip and Knee Surgeons", detail: "Fellow" },
    { title: "J. Robert Gladden Orthopaedic Society", detail: "Fellow" },
    { title: "New York State Society of Orthopaedic Surgeons", detail: "Fellow" },
    { title: "Eastern Orthopaedic Association", detail: "Member" },
    { title: "American Orthopaedic Association", detail: "Emerging Leader" },
    { title: "American Medical Association", detail: "Member" },
  ],
  editorial: [
    { years: "2026–", title: "Associate Editor", organization: "Medicine Orthopaedics (Wolters Kluwer)" },
    { years: "2021–", title: "Peer Reviewer", organization: "Journal of Arthroplasty" },
    { years: "2023–", title: "Peer Reviewer", organization: "Bone & Joint Journal" },
    { years: "2024–", title: "Peer Reviewer", organization: "Journal of the American Academy of Orthopaedic Surgeons" },
    { years: "2022–", title: "Peer Reviewer", organization: "The Knee" },
  ],
  mentorship:
    "Dr. Sarpong has mentored research fellows, medical students, residents and clinical fellows at Columbia, including residents who have gone on to fellowships in adult reconstruction and joint replacement.",
  cvUrl: "",
};

const P = (title: string, slug: string, category: string, summary: string, body: string, highlights: string[], featured = true): Procedure => ({
  _id: `procedure-${slug}`,
  title,
  slug,
  category,
  summary,
  body,
  highlights,
  featured,
});

export const seedProcedures: Procedure[] = [
  P(
    "Total Hip Replacement",
    "hip-replacement",
    "hip",
    "Direct anterior and mini-posterior approaches, chosen for your anatomy and activity goals.",
    "Total hip replacement relieves pain from arthritis and other conditions by replacing the worn ball and socket of the hip with implants.\n\nDr. Sarpong performs hip replacement through both the direct anterior and mini-posterior approaches. The approach is selected for each patient based on anatomy, bone quality, prior surgery and goals, rather than a one-size-fits-all choice. Careful planning of implant size and position aims to restore leg length and hip mechanics.\n\nMany patients walk the day of surgery, and some are able to go home the same day when it is safe to do so.",
    ["Direct anterior & mini-posterior approaches", "Patients with spinal stiffness or deformity", "Same-day discharge when appropriate"],
  ),
  P(
    "Robotic & Mixed-Reality Knee Replacement",
    "knee-replacement",
    "knee",
    "Total knee replacement planned to your anatomy with robotic or mixed-reality guidance.",
    "Total knee replacement resurfaces the damaged ends of the thigh bone, shin bone and, when needed, kneecap, to relieve pain and restore function in advanced arthritis.\n\nDr. Sarpong uses enabling technology, including robotic-assisted systems and mixed-reality (augmented reality) guidance, to plan implant position and balance the knee’s soft tissues to the individual patient. He has published research on the accuracy of these systems and on how they affect recovery.\n\nThe right technique is chosen with each patient after a careful discussion of the options.",
    ["Robotic-assisted total knee replacement", "Mixed-reality surgical guidance", "Funded research on enabling technology"],
  ),
  P(
    "Partial Knee Replacement",
    "partial-knee-replacement",
    "knee",
    "For arthritis limited to one part of the knee, preserving healthy bone and ligaments.",
    "When arthritis is limited to one compartment of the knee, a partial (unicompartmental) knee replacement can replace only the damaged surface and preserve the healthy cartilage and ligaments.\n\nNot every patient is a candidate. Dr. Sarpong uses examination and imaging to determine whether partial or total knee replacement is the better option for you.",
    ["Bone- and ligament-preserving", "Careful patient selection", "Often a faster recovery"],
  ),
  P(
    "Hip Resurfacing",
    "hip-resurfacing",
    "hip",
    "A bone-preserving alternative to total hip replacement for selected active patients.",
    "Hip resurfacing caps the femoral head rather than removing it, preserving more of the patient’s own bone. It may be an option for selected younger, active patients with good bone quality.\n\nDr. Sarpong will review whether resurfacing or total hip replacement is better suited to your anatomy and goals.",
    ["Preserves femoral bone", "For selected active patients"],
    false,
  ),
  P(
    "Revision Hip & Knee Replacement",
    "revision-surgery",
    "revision",
    "Expert care when a prior hip or knee replacement is painful, loose, unstable or infected.",
    "Revision surgery replaces some or all of a previous joint replacement that has worn, loosened, become unstable or infected, or has been affected by a fracture around the implant.\n\nRevision procedures are more complex than first-time joint replacement and require careful evaluation, planning and specialized implants. Dr. Sarpong teaches revision techniques at national courses and has published on outcomes after revision hip replacement, including through the anterior approach.",
    ["Loosening, wear & instability", "Periprosthetic joint infection", "Fractures around implants"],
  ),
  P(
    "Complex & Conversion Hip Replacement",
    "conversion-hip-replacement",
    "revision",
    "Hip replacement after prior fracture surgery, failed fixation or a partial hip replacement.",
    "Some patients develop arthritis or pain after a hip fracture repair, or after a partial (hemi) hip replacement. Converting to a total hip replacement in these settings requires removing hardware and managing altered anatomy.\n\nDr. Sarpong’s research includes several studies of conversion total hip replacement, including through the direct anterior approach.",
    ["After prior fracture fixation", "Conversion of hemiarthroplasty", "Post-traumatic arthritis"],
  ),
];

export const seedLocations: Location[] = [
  {
    _id: "location-hss-main",
    name: "Hospital for Special Surgery",
    institution: "Main Campus, Upper East Side",
    address: "535 East 70th Street\nNew York, NY 10021",
    phone: "",
    bookingUrl: "",
    mapUrl: "https://maps.google.com/?q=Hospital+for+Special+Surgery+535+East+70th+Street+New+York",
    note: "Beginning December 14, 2026.",
    startDate: "2026-12-01",
  },
];

export const seedIndustryRoles: IndustryRole[] = [
  {
    _id: "industry-smith-nephew",
    organization: "Smith+Nephew",
    role: "US Advisory Board, Member",
    type: "advisory",
    years: "2026–",
    current: true,
  },
  {
    _id: "industry-zimmer-c3",
    organization: "Zimmer Biomet",
    role: "Community Centered Care (C3) Advisory Board, Member",
    type: "advisory",
    years: "2024–",
    current: true,
    description: "Advisory work on health equity in joint replacement, including an invited talk on social determinants of health and arthroplasty outcomes.",
  },
  {
    _id: "industry-zimmer-education",
    organization: "Zimmer Biomet",
    role: "Course Co-Chair & Faculty, BioSkills courses",
    type: "education",
    years: "2024–",
    current: true,
    description: "Faculty and course leadership for primary and revision hip and knee arthroplasty BioSkills training for surgeons.",
  },
  {
    _id: "industry-polarisar",
    organization: "PolarisAR",
    role: "Surgeon Advisory Board",
    type: "advisory",
    years: "2023–",
    current: true,
    description: "Surgeon input on mixed-reality technology for knee replacement.",
  },
  {
    _id: "industry-arpah",
    organization: "ARPA-H NOVAJoint",
    role: "Equity Advisory Board",
    type: "advisory",
    years: "2024–",
    current: true,
    description: "Advanced Research Projects Agency for Health program.",
  },
  {
    _id: "industry-columbia-tech",
    organization: "Columbia Orthopedics",
    role: "Technology & Innovation Committee",
    type: "committee",
    years: "2025–2026",
    current: false,
  },
];

export const seedInnovationProjects: InnovationProject[] = [
  {
    _id: "innovation-mixed-reality",
    title: "Mixed reality in knee replacement",
    summary:
      "Clinical studies of a mixed-reality guidance system for total knee replacement, comparing its accuracy and operative time with robotic assistance. Supported by William J. Matheson Foundation grants (2024, 2025).",
    technologies: ["Mixed reality", "Augmented reality", "Knee"],
    status: "Active",
    featured: true,
  },
  {
    _id: "innovation-robotics",
    title: "Robotic-assisted arthroplasty",
    summary:
      "Research on robotic knee replacement: soft-tissue balancing, reproducibility of registration, radiographic accuracy, cementless fixation and early recovery of motion.",
    technologies: ["Robotics", "Knee"],
    status: "Active",
    featured: true,
  },
  {
    _id: "innovation-ai",
    title: "Artificial intelligence in orthopaedics",
    summary:
      "Frameworks for the clinical readiness of AI tools in orthopaedic surgery, a primer on AI in hip and knee arthroplasty, and study of patient perspectives on ambient AI documentation.",
    technologies: ["Artificial intelligence", "Clinical documentation"],
    status: "Active",
    featured: true,
  },
  {
    _id: "innovation-value",
    title: "Value & perioperative efficiency",
    summary:
      "Applying an MBA lens to the operating room: value analysis of implants and supplies, turnover efficiency, and same-day discharge pathways.",
    technologies: ["Health-system value", "Operations"],
    status: "Ongoing",
  },
  {
    _id: "innovation-equity",
    title: "Social determinants of arthritis outcomes",
    summary:
      "Funded studies of how social and demographic factors shape arthritis presentation and knee replacement outcomes, supported by OSRF, JRGOS/Zimmer Biomet and the NYP Dalio Center for Health Justice.",
    technologies: ["Health equity", "Outcomes research"],
    status: "Active",
  },
];

export const seedGrants: Grant[] = [
  { _id: "grant-2026-nyp-innovation", title: "NewYork-Presbyterian Innovation Grant", funder: "NewYork-Presbyterian", year: "2026", role: "Principal Investigator", amount: "$16,500" },
  { _id: "grant-2026-dalio", title: "Evaluating the Impact of Social Determinants of Health on Arthritis Presentation and TKA Outcomes", funder: "NYP Dalio Center for Health Justice", year: "2026", role: "Principal Investigator", amount: "$50,000" },
  { _id: "grant-2025-matheson", title: "Enabling Technology in Total Knee Arthroplasty", funder: "William J. Matheson Foundation", year: "2025", role: "Principal Investigator", amount: "$50,000" },
  { _id: "grant-2025-jrgos", title: "Evaluating the Impact of Social Determinants of Health on Arthritis Presentation and TKA Outcomes", funder: "JRGOS / Zimmer Biomet Research Grant", year: "2025", amount: "$20,000" },
  { _id: "grant-2025-osrf", title: "Evaluating the Impact of Social Determinants of Health on Total Knee Arthroplasty Outcomes", funder: "OSRF Grant", year: "2025", amount: "$20,000" },
  { _id: "grant-2024-matheson", title: "Clinical Outcomes of Mixed Reality and Robotic Total Knee Arthroplasty", funder: "William J. Matheson Foundation", year: "2024", role: "Principal Investigator", amount: "$50,000" },
  { _id: "grant-2017-stryker", title: "Development of a Virtual PCL Model Using Cadaver Knees", funder: "Stryker Orthopedics Resident/Fellow Research Grant", year: "2017", role: "Resident Researcher" },
];

export const seedSpeaking: SpeakingItem[] = (cvSpeaking as Omit<SpeakingItem, "_id">[]).map((item, i) => ({
  _id: `speaking-cv-${i + 1}`,
  ...item,
}));

export const seedMedia: MediaItem[] = [
  {
    _id: "media-avant-garde-2024",
    title: "Orthopedic surgeons honored as 2024 Orthopedic Research All-Stars",
    outlet: "NewYork-Presbyterian Advances",
    type: "award",
    date: "2024",
    url: "https://www.nyp.org/advances/article/orthopedics/orthopedic-surgeons-honored-by-avant-garde-health-as-2024-orthopedic-research-all-stars",
    summary: "Recognized by Avant-garde Health for research using advanced technologies in knee and hip arthroplasty.",
    featured: true,
  },
  {
    _id: "media-vumedi-tto",
    title: "Tibial Tubercle Osteotomy for Revision Total Knee Arthroplasty",
    outlet: "VuMedi",
    type: "video",
    date: "2018-10",
    url: "https://www.vumedi.com/video/tibial-tubercle-osteotomy-for-revision-total-knee-arthroplasty/",
  },
  {
    _id: "media-vumedi-achilles",
    title: "Achilles Tendon Debridement and Repair for Insertional Achilles Tendinopathy",
    outlet: "VuMedi",
    type: "video",
    date: "2019-08",
    url: "https://www.vumedi.com/video/achilles-tendon-debridement-and-repair-for-insertional-achilles-tendinopathy/",
  },
];

/** Testimonials need written patient consent on file; none are pre-filled. */
export const seedTestimonials: Testimonial[] = [];

/** Manual entries and ORCID overrides. ORCID + the CV archive cover the rest. */
export const seedPublicationEntries: PublicationEntry[] = [
  { _id: "pub-featured-mixed-reality", title: "A Novel Mixed-Reality System has Comparable Accuracy to a Robotic System in Total Knee Arthroplasty", featured: true },
  { _id: "pub-featured-oscar", title: "From Accuracy to Adoption: A Clinical Readiness Framework for Artificial Intelligence in Orthopaedic Surgery (OSCAR)", featured: true },
  { _id: "pub-featured-sensor-rct", title: "No benefit to sensor-guided balancing compared with freehand balancing in TKA: a randomized controlled trial", featured: true },
];
