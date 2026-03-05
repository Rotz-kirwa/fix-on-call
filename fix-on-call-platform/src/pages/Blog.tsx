import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { blogCategories, blogPosts } from "@/data/blogPosts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Wrench, ShieldCheck, CarFront, Fuel } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formatDate = (value: string) =>
  new Date(`${value}T00:00:00Z`).toLocaleDateString("en-KE", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

const Blog = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [visibleCount, setVisibleCount] = useState(6);
  const [email, setEmail] = useState("");
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});

  const featured = blogPosts.filter((x) => x.featured).slice(0, 3);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return blogPosts.filter((post) => {
      const categoryOk = activeCategory === "All" || post.category === activeCategory;
      const queryOk =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.preview.toLowerCase().includes(q) ||
        post.author.toLowerCase().includes(q);
      return categoryOk && queryOk;
    });
  }, [activeCategory, query]);

  const visiblePosts = filtered.slice(0, visibleCount);

  const popular = [...blogPosts].sort((a, b) => b.popularScore - a.popularScore).slice(0, 5);
  const recent = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  const onSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast({
      title: "Subscribed",
      description: "You will receive Fix On Call blog updates.",
    });
    setEmail("");
  };

  const toggleExpanded = (slug: string) => {
    setExpandedPosts((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-16">
        <section className="relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&w=1800&q=80"
            alt="Roadside mechanic helping a driver"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/70" />
          <div className="container relative z-10 py-16 md:py-24">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.24em] text-orange-300 mb-3">Knowledge Hub</p>
              <h1 className="text-4xl md:text-6xl font-black leading-tight">Fix On Call Blog</h1>
              <p className="mt-4 text-base md:text-lg text-muted-foreground">
                Tips, guides, and expert advice for drivers and roadside emergencies.
              </p>

              <div className="mt-6 flex items-center gap-2 rounded-xl border border-border bg-background p-2">
                <Search className="w-4 h-4 text-muted-foreground ml-2" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search blog articles..."
                  className="border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategory("All")}
                  className={`rounded-full px-3 py-1.5 text-xs border ${activeCategory === "All" ? "bg-orange-500 text-white border-orange-500" : "bg-card border-border text-muted-foreground"}`}
                >
                  All
                </button>
                {blogCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full px-3 py-1.5 text-xs border ${
                      activeCategory === category ? "bg-orange-500 text-white border-orange-500" : "bg-card border-border text-muted-foreground"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="container py-12 md:py-16">
          <div className="flex items-center gap-2 mb-6">
            <Wrench className="w-5 h-5 text-orange-400" />
            <h2 className="text-2xl md:text-3xl font-black">Featured Articles</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featured.map((post, idx) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl overflow-hidden border border-border bg-card shadow-lg"
              >
                <img src={post.heroImage} alt={post.title} className="h-52 w-full object-cover" loading="lazy" />
                <div className="p-4">
                  <p className="text-[11px] uppercase tracking-wide text-orange-300">{post.category}</p>
                  <h3 className="font-bold text-lg mt-1">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.preview}</p>
                  <p className="text-xs text-muted-foreground mt-3">
                    {post.author} • {formatDate(post.date)}
                  </p>
                  <Button
                    size="sm"
                    className="mt-3 bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => toggleExpanded(post.slug)}
                  >
                    {expandedPosts[post.slug] ? "Show less" : "Read article"}
                  </Button>
                  {expandedPosts[post.slug] && (
                    <div className="mt-4 rounded-xl border border-border bg-background p-3 space-y-3">
                      {post.sections.map((section) => (
                        <div key={section.heading}>
                          <h4 className="font-semibold text-sm">{section.heading}</h4>
                          {section.paragraphs.map((paragraph) => (
                            <p key={paragraph} className="text-sm text-muted-foreground mt-1">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="container pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-2 mb-4">
                <CarFront className="w-5 h-5 text-orange-400" />
                <h2 className="text-2xl font-black">Latest Articles</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {visiblePosts.map((post) => (
                  <article key={post.slug} className="rounded-2xl overflow-hidden border border-border bg-card">
                    <img src={post.heroImage} alt={post.title} className="h-40 w-full object-cover" loading="lazy" />
                    <div className="p-4">
                      <span className="inline-flex rounded-full bg-orange-500/20 border border-orange-400/40 px-2 py-0.5 text-[10px] text-orange-200">
                        {post.category}
                      </span>
                      <h3 className="font-bold mt-2 line-clamp-2">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{post.preview}</p>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatDate(post.date)}</span>
                        <span>{post.readTime}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleExpanded(post.slug)}
                        className="inline-block mt-3 text-sm text-orange-600 hover:text-orange-500"
                      >
                        {expandedPosts[post.slug] ? "Show less" : "Read article"}
                      </button>
                      {expandedPosts[post.slug] && (
                        <div className="mt-3 rounded-xl border border-border bg-background p-3 space-y-3">
                          {post.sections.map((section) => (
                            <div key={section.heading}>
                              <h4 className="font-semibold text-sm">{section.heading}</h4>
                              {section.paragraphs.map((paragraph) => (
                                <p key={paragraph} className="text-sm text-muted-foreground mt-1">
                                  {paragraph}
                                </p>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>

              {visibleCount < filtered.length && (
                <div className="mt-6">
                  <Button variant="outline" className="border-border bg-background text-foreground" onClick={() => setVisibleCount((v) => v + 3)}>
                    Load more articles
                  </Button>
                </div>
              )}
            </div>

            <aside className="lg:col-span-4 space-y-4">
              <div className="rounded-2xl border border-border bg-card p-4">
                <h3 className="font-bold text-lg mb-3">Popular Posts</h3>
                <div className="space-y-2">
                  {popular.map((post) => (
                    <Link key={post.slug} to={`/blog/${post.slug}`} className="block text-sm text-foreground hover:text-orange-600">
                      • {post.title}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <h3 className="font-bold text-lg mb-3">Categories</h3>
                <div className="space-y-2 text-sm">
                  {blogCategories.map((category) => (
                    <button key={category} onClick={() => setActiveCategory(category)} className="block text-left text-foreground hover:text-orange-600">
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <h3 className="font-bold text-lg mb-3">Recent Articles</h3>
                <div className="space-y-2">
                  {recent.map((post) => (
                    <Link key={post.slug} to={`/blog/${post.slug}`} className="block text-sm text-foreground hover:text-orange-600">
                      {post.title}
                    </Link>
                  ))}
                </div>
              </div>

              <form onSubmit={onSubscribe} className="rounded-2xl border border-border bg-card p-4">
                <h3 className="font-bold text-lg mb-2">Newsletter</h3>
                <p className="text-sm text-muted-foreground mb-3">Get weekly roadside safety tips.</p>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="bg-background border-border text-foreground"
                />
                <Button className="w-full mt-3 bg-orange-500 hover:bg-orange-600 text-white">Subscribe</Button>
              </form>
            </aside>
          </div>
        </section>

        <section className="container pb-16">
          <div className="rounded-2xl border border-orange-400/50 bg-gradient-to-r from-orange-50 to-amber-50 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-orange-300 font-semibold text-sm uppercase tracking-wide">Need Immediate Help?</p>
                <h3 className="text-2xl md:text-3xl font-black mt-1">Stuck on the road? Fix On Call is here to help.</h3>
              </div>
              <Link to="/service-request">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Fuel className="w-4 h-4 mr-2" />
                  Request Roadside Assistance
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
