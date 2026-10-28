export interface TestimonialItem {
  id: string;
  clientName: string;
  role: string;
  companyOrHandle?: string;
  avatarUrl?: string;
  quote: string;
  projectType: string;
  verified: boolean;
}

export interface TestimonialsConfig {
  showSection: boolean; // Set to true to show honest feedback / testimonials
  hasVerifiedFeedback: boolean; // Set to true once real testimonials are populated
  headline: string;
  subheadline: string;
  placeholderNotice: string;
  items: TestimonialItem[];
}

export const testimonialsConfig: TestimonialsConfig = {
  showSection: true,
  // We keep this false until the owner supplies real verified client quotes:
  hasVerifiedFeedback: false,
  headline: "TRUST IS BUILT THROUGH THE WORK.",
  subheadline:
    "We believe in letting editing craft speak for itself before accumulating marketing endorsements.",
  placeholderNotice:
    "Client feedback and case studies will be featured here as verified client permissions are finalized. In the meantime, evaluate our craftsmanship directly through the selected work gallery above.",
  items: [
    // Future verified testimonials can be added here following this schema:
    /*
    {
      id: "feedback-01",
      clientName: "Verified Creator",
      role: "Host",
      companyOrHandle: "@creatorhandle",
      quote: "Zenith elevated our watch time on every single reel.",
      projectType: "Talking Head Series",
      verified: true,
    }
    */
  ],
};
