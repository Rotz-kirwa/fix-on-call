import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Brian Mwangi",
    location: "Nairobi",
    rating: 5,
    text: "My battery died at night and a mechanic arrived in under 15 minutes. Super professional service.",
  },
  {
    name: "Wanjiku Njeri",
    location: "Kiambu",
    rating: 4,
    text: "I had a flat tire on Thika Road and they sorted it quickly. The updates were clear and helpful.",
  },
  {
    name: "Kevin Otieno",
    location: "Kisumu",
    rating: 5,
    text: "Very reliable platform. The mechanic explained the issue and pricing before starting the repair.",
  },
  {
    name: "Faith Achieng",
    location: "Mombasa",
    rating: 4,
    text: "Fast response and friendly support team. I felt safe the whole time while waiting for help.",
  },
  {
    name: "James Kiptoo",
    location: "Eldoret",
    rating: 5,
    text: "The towing service was smooth and affordable. Exactly what I needed during an emergency.",
  },
  {
    name: "Mercy Wambui",
    location: "Nakuru",
    rating: 4,
    text: "Great experience from request to completion. I’d definitely use Fix On Call again.",
  },
];

const reviewItems = [...testimonials, ...testimonials];

const ReviewsSection = () => {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 mb-10">
        <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2 text-center">Our Reviews</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center">What drivers say about us</h2>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="flex w-max animate-[scroll-reviews_38s_linear_infinite] gap-5 px-4">
          {reviewItems.map((review, index) => (
            <article
              key={`${review.name}-${index}`}
              className="w-[320px] md:w-[380px] rounded-2xl border border-border bg-card p-6 shadow-card"
            >
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{review.text}</p>
              <div className="text-sm font-semibold text-foreground">{review.name}</div>
              <div className="text-xs text-muted-foreground">{review.location}, Kenya</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
