export interface Project {
  slug: string;
  title: string;
  location: string;
  status: "active" | "completed" | "paused";
  description: string;
  beneficiaries: number;
  goal: number;
  raised: number;
}

export const projects: Project[] = [
  { slug: "widow-support", title: "Widow Support Program", location: "Bamenda", status: "active", description: "Financial aid, food packages, and skills training for widows rebuilding their lives after loss. Our program provides monthly food supplies, vocational training in tailoring and hairdressing, and a supportive community network.", beneficiaries: 15, goal: 3000, raised: 2400 },
  { slug: "education-orphans", title: "Education for Orphans", location: "Douala", status: "completed", description: "Comprehensive education support for orphaned children including school supplies, uniforms, tuition fees, and mentorship programs. We believe every child deserves access to quality education regardless of their circumstances.", beneficiaries: 20, goal: 2500, raised: 2500 },
  { slug: "women-empowerment", title: "Young Women Empowerment", location: "Yaoundé", status: "active", description: "Vocational training and microfinance opportunities for young women seeking financial independence. Programs include tailoring, hairdressing, computer skills, and small business management.", beneficiaries: 10, goal: 2000, raised: 1200 },
  { slug: "emergency-relief", title: "Emergency Relief Fund", location: "Multiple Regions", status: "active", description: "Rapid response fund for urgent community needs including emergency food distribution, medical assistance, and temporary shelter during crises.", beneficiaries: 50, goal: 3500, raised: 1800 },
  { slug: "education-drive", title: "Annual Education Drive", location: "Rural Areas", status: "active", description: "Annual back-to-school campaign providing supplies, uniforms, and school fees for children in rural communities who would otherwise miss out on education.", beneficiaries: 20, goal: 3000, raised: 800 },
  { slug: "christmas-giving", title: "Christmas Giving Campaign", location: "Bamenda & surrounding villages", status: "paused", description: "Holiday season campaign bringing food packages, clothing, and gifts to families in need. A time to share love and joy with those who need it most.", beneficiaries: 50, goal: 1500, raised: 400 },
];
