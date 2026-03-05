import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { blogPosts } from "@/data/blogPosts";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock3, Facebook, Link2, Share2, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formatDate = (value: string) =>
  new Date(`${value}T00:00:00Z`).toLocaleDateString("en-KE", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "long",
    day: "2-digit",
  });

const BlogArticle = () => {
  const { toast } = useToast();
  const { slug } = useParams();
  const post = blogPosts.find((x) => x.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="pt-24 container">
          <h1 className="text-3xl font-black">Article not found</h1>
          <Link to="/blog" className="text-orange-600 mt-4 inline-block">Back to blog</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const related = blogPosts.filter((x) => x.slug !== post.slug && x.category === post.category).slice(0, 3);

  const onShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied", description: "Article link copied to clipboard." });
    } catch {
      toast({ title: "Share link", description: url });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-16">
        <header className="relative">
          <img src={post.heroImage} alt={post.title} className="h-[320px] md:h-[460px] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/65 to-transparent" />
          <div className="container absolute bottom-0 left-0 right-0 pb-8">
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-orange-600 mb-3">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
            <h1 className="text-3xl md:text-5xl font-black max-w-4xl">{post.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>{post.author}</span>
              <span>•</span>
              <span>{formatDate(post.date)}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1"><Clock3 className="w-4 h-4" /> {post.readTime}</span>
            </div>
          </div>
        </header>

        <article className="container py-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-8">
              <Button onClick={onShare} variant="outline" className="border-border bg-background text-foreground">
                <Share2 className="w-4 h-4 mr-1" /> Share
              </Button>
              <Button onClick={onShare} variant="outline" className="border-border bg-background text-foreground">
                <Link2 className="w-4 h-4 mr-1" /> Copy Link
              </Button>
              <Button variant="outline" className="border-border bg-background text-foreground">
                <Facebook className="w-4 h-4 mr-1" /> Facebook
              </Button>
            </div>

            <div className="space-y-8">
              {post.sections.map((section) => (
                <section key={section.heading} className="rounded-2xl border border-border bg-card p-5 md:p-6">
                  <h2 className="text-2xl font-black mb-3">{section.heading}</h2>
                  <div className="space-y-3 text-muted-foreground leading-relaxed">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  {section.image && (
                    <img src={section.image} alt={section.heading} className="mt-5 rounded-xl w-full h-64 object-cover" loading="lazy" />
                  )}
                </section>
              ))}
            </div>
          </div>
        </article>

        <section className="container pb-14">
          <div className="rounded-2xl border border-orange-400/50 bg-gradient-to-r from-orange-50 to-amber-50 p-6">
            <p className="text-sm text-orange-600 uppercase tracking-wide font-semibold">Roadside Help</p>
            <h3 className="text-2xl font-black mt-1">Stuck on the road? Fix On Call is here to help.</h3>
            <Link to="/service-request" className="inline-block mt-4">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <ShieldCheck className="w-4 h-4 mr-2" />
                Request Roadside Assistance
              </Button>
            </Link>
          </div>
        </section>

        <section className="container pb-16">
          <h3 className="text-2xl font-black mb-4">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {related.map((item) => (
              <article key={item.slug} className="rounded-2xl overflow-hidden border border-border bg-card">
                <img src={item.heroImage} alt={item.title} className="h-40 w-full object-cover" loading="lazy" />
                <div className="p-4">
                  <p className="text-xs text-orange-600">{item.category}</p>
                  <h4 className="font-bold mt-1 line-clamp-2">{item.title}</h4>
                  <Link to={`/blog/${item.slug}`} className="inline-block mt-3 text-sm text-orange-600 hover:text-orange-500">
                    Read article
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogArticle;
