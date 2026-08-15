"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  RefreshCw,
  Save,
  Send,
  Clock,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Trash2,
  Play,
  AlertCircle,
  CheckCircle,
  Calendar,
  Zap,
  Power,
  Settings,
} from "lucide-react";
import {
  GeneratedBlogPost,
  TopicSuggestion,
  BlogCategory,
  BlogTone,
  BlogLength,
  AIProvider,
  TargetMarket,
  ImageStyle,
  BLOG_CATEGORIES,
  ScheduledPost,
} from "@/types/blog-generator";

// Auto-blog settings interface
interface AutoBlogSettings {
  enabled: boolean;
  intervalType: string;
  autoPublish: boolean;
  preferredCategories?: string[];
  preferredMarkets?: string[];
  preferredTones?: string[];
  preferredLength?: string;
  preferredImageStyle?: string;
}

interface AutoBlogStats {
  totalGenerated: number;
  lastGeneratedAt?: string;
  lastError?: string;
  recentGenerations: Array<{
    category: string;
    targetMarket: string;
    topic: string;
    tone: string;
    generatedAt: string;
  }>;
}

// Interval options for auto-blog
const INTERVAL_OPTIONS = [
  { value: "hourly", label: "Every Hour" },
  { value: "daily", label: "Daily (9 AM)" },
  { value: "every2days", label: "Every 2 Days" },
  { value: "every3days", label: "Every 3 Days" },
  { value: "weekly", label: "Weekly (Monday)" },
];

// Target markets for dropdown
const TARGET_MARKETS: { value: TargetMarket; label: string }[] = [
  { value: "k12", label: "K-12 Education" },
  { value: "higher-ed", label: "Higher Education" },
  { value: "corporate", label: "Corporate Training" },
  { value: "publishers", label: "Publishers" },
  { value: "general", label: "General" },
];

// Tones for dropdown
const TONES: { value: BlogTone; label: string }[] = [
  { value: "professional", label: "Professional" },
  { value: "educational", label: "Educational" },
  { value: "engaging", label: "Engaging" },
  { value: "thought-leadership", label: "Thought Leadership" },
];

// Lengths for dropdown
const LENGTHS: { value: BlogLength; label: string; description: string }[] = [
  { value: "short", label: "Short", description: "~800 words" },
  { value: "medium", label: "Medium", description: "~1500 words" },
  { value: "long", label: "Long", description: "~2500 words" },
];

// Sanitize image URL to prevent XSS via javascript: or data: URLs
function sanitizeImageUrl(url: string): string {
  if (!url) return "";
  const trimmed = url.trim().toLowerCase();
  // Only allow http, https, and relative paths (starting with /)
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
    return url;
  }
  return "";
}

export default function BlogGeneratorPage() {
  // Session gate: redirects to /admin/login (authOptions.pages.signIn) when unauthenticated
  useSession({ required: true });
  const router = useRouter();

  // Form state
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState<BlogCategory>("AI in Education");
  const [targetMarket, setTargetMarket] = useState<TargetMarket>("general");
  const [tone, setTone] = useState<BlogTone>("professional");
  const [length, setLength] = useState<BlogLength>("medium");
  const [aiProvider, setAiProvider] = useState<AIProvider>("claude");
  const [keywords, setKeywords] = useState("");
  const [includeProductMention, setIncludeProductMention] = useState(true);

  // Generated content state
  const [generatedPost, setGeneratedPost] = useState<GeneratedBlogPost | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // Topic suggestions state
  const [topicSuggestions, setTopicSuggestions] = useState<TopicSuggestion[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Image generation state
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageStyle, setImageStyle] = useState<"professional" | "illustrative" | "abstract">(
    "professional"
  );

  // Publishing state
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  // Scheduling state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [isScheduling, setIsScheduling] = useState(false);

  // Queue state
  const [showQueue, setShowQueue] = useState(false);
  const [queueItems, setQueueItems] = useState<ScheduledPost[]>([]);
  const [queueStats, setQueueStats] = useState<{
    pending: number;
    published: number;
    failed: number;
  } | null>(null);
  const [isLoadingQueue, setIsLoadingQueue] = useState(false);

  // Auto-blog state
  const [showAutoBlog, setShowAutoBlog] = useState(false);
  const [autoSettings, setAutoSettings] = useState<AutoBlogSettings | null>(null);
  const [autoStats, setAutoStats] = useState<AutoBlogStats | null>(null);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [isLoadingAuto, setIsLoadingAuto] = useState(false);
  const [isTogglingAuto, setIsTogglingAuto] = useState(false);
  const [isGeneratingAuto, setIsGeneratingAuto] = useState(false);
  const [autoIntervalType, setAutoIntervalType] = useState("daily");
  const [autoPublish, setAutoPublish] = useState(false);
  const [showAutoSettings, setShowAutoSettings] = useState(false);

  // Editable fields for preview
  const [editedTitle, setEditedTitle] = useState("");
  const [editedExcerpt, setEditedExcerpt] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedTags, setEditedTags] = useState("");
  const [editedMetaTitle, setEditedMetaTitle] = useState("");
  const [editedMetaDescription, setEditedMetaDescription] = useState("");
  const [editedFeaturedImage, setEditedFeaturedImage] = useState("");

  // Sync edited fields when generated post changes
  useEffect(() => {
    if (generatedPost) {
      setEditedTitle(generatedPost.title);
      setEditedExcerpt(generatedPost.excerpt);
      setEditedContent(generatedPost.content);
      setEditedTags(generatedPost.tags.join(", "));
      setEditedMetaTitle(generatedPost.metaTitle);
      setEditedMetaDescription(generatedPost.metaDescription);
      setEditedFeaturedImage(generatedPost.featuredImage || "");
    }
  }, [generatedPost]);

  // Fetch queue on mount
  useEffect(() => {
    fetchQueue();
    fetchAutoSettings();
  }, []);

  // Fetch auto-blog settings
  const fetchAutoSettings = async () => {
    setIsLoadingAuto(true);
    try {
      const res = await fetch("/api/ai/blog/auto");
      const data = await res.json();

      if (data.success) {
        setAutoSettings(data.settings);
        setAutoStats(data.stats);
        setIsAutoRunning(data.scheduler?.isRunning || false);
        setAutoIntervalType(data.settings?.intervalType || "daily");
        setAutoPublish(data.settings?.autoPublish || false);
      }
    } catch (error) {
      console.error("Failed to fetch auto settings:", error);
    } finally {
      setIsLoadingAuto(false);
    }
  };

  // Toggle auto-blog generator
  const handleToggleAuto = async () => {
    setIsTogglingAuto(true);
    try {
      const action = isAutoRunning ? "stop" : "start";

      // First update settings if starting
      if (!isAutoRunning) {
        await fetch("/api/ai/blog/auto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            intervalType: autoIntervalType,
            autoPublish,
          }),
        });
      }

      const res = await fetch("/api/ai/blog/auto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();

      if (data.success) {
        setIsAutoRunning(!isAutoRunning);
        fetchAutoSettings();
      } else {
        alert(data.message || "Failed to toggle auto-blog");
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Toggle failed");
    } finally {
      setIsTogglingAuto(false);
    }
  };

  // Trigger immediate auto generation
  const handleTriggerAutoGenerate = async () => {
    if (!confirm("Generate a blog post now with AI-decided parameters?")) return;

    setIsGeneratingAuto(true);
    try {
      const res = await fetch("/api/ai/blog/auto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate" }),
      });

      const data = await res.json();

      if (data.success) {
        alert(
          `Blog post generated: "${data.post.title}"\n\nCategory: ${data.post.category}\nMarket: ${data.post.targetMarket}\nStatus: ${data.published ? "Published" : "Draft"}`
        );
        fetchAutoSettings();
      } else {
        alert(data.error || "Generation failed");
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Generation failed");
    } finally {
      setIsGeneratingAuto(false);
    }
  };

  // Update auto settings
  const handleUpdateAutoSettings = async () => {
    try {
      const res = await fetch("/api/ai/blog/auto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intervalType: autoIntervalType,
          autoPublish,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setAutoSettings(data.settings);
        setShowAutoSettings(false);

        // Restart scheduler if running
        if (isAutoRunning) {
          await fetch("/api/ai/blog/auto", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "restart" }),
          });
        }
      } else {
        alert(data.error || "Failed to update settings");
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Update failed");
    }
  };

  // Fetch topic suggestions
  const fetchTopicSuggestions = async () => {
    setIsLoadingTopics(true);
    try {
      const params = new URLSearchParams({
        category,
        targetMarket,
        aiProvider,
      });
      const res = await fetch(`/api/ai/blog/topics?${params}`);
      const data = await res.json();

      if (data.success && data.topics) {
        setTopicSuggestions(data.topics);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Failed to fetch topic suggestions:", error);
    } finally {
      setIsLoadingTopics(false);
    }
  };

  // Generate blog post
  const handleGenerate = async () => {
    if (!topic.trim()) {
      setGenerateError("Please enter a topic");
      return;
    }

    setIsGenerating(true);
    setGenerateError(null);
    setGeneratedPost(null);

    try {
      const res = await fetch("/api/ai/blog/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          category,
          targetMarket,
          tone,
          length,
          aiProvider,
          keywords: keywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean),
          includeProductMention,
        }),
      });

      const data = await res.json();

      if (data.success && data.post) {
        setGeneratedPost(data.post);
      } else {
        setGenerateError(data.error || "Failed to generate blog post");
      }
    } catch (error) {
      setGenerateError(error instanceof Error ? error.message : "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate image
  const handleGenerateImage = async () => {
    if (!generatedPost) return;

    setIsGeneratingImage(true);
    try {
      const res = await fetch("/api/ai/blog/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editedTitle,
          content: editedContent,
          style: imageStyle,
          saveLocally: true,
        }),
      });

      const data = await res.json();

      if (data.success && data.image) {
        setEditedFeaturedImage(data.image.imageUrl);
      } else {
        alert(data.error || "Failed to generate image");
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Image generation failed");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Get current edited post data
  const getEditedPost = (): GeneratedBlogPost => ({
    ...generatedPost!,
    title: editedTitle,
    excerpt: editedExcerpt,
    content: editedContent,
    tags: editedTags.split(",").map((t) => t.trim()).filter(Boolean),
    metaTitle: editedMetaTitle,
    metaDescription: editedMetaDescription,
    featuredImage: editedFeaturedImage,
    slug: editedTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
  });

  // Save as draft
  const handleSaveAsDraft = async () => {
    if (!generatedPost) return;

    setIsPublishing(true);
    setPublishError(null);

    try {
      const res = await fetch("/api/ai/blog/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generatedPost: getEditedPost(),
          status: "draft",
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/admin/blog/${data.postId}/edit`);
      } else {
        setPublishError(data.error || "Failed to save draft");
      }
    } catch (error) {
      setPublishError(error instanceof Error ? error.message : "Save failed");
    } finally {
      setIsPublishing(false);
    }
  };

  // Publish now
  const handlePublishNow = async () => {
    if (!generatedPost) return;

    if (!confirm("Publish this post immediately?")) return;

    setIsPublishing(true);
    setPublishError(null);

    try {
      const res = await fetch("/api/ai/blog/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generatedPost: getEditedPost(),
          status: "published",
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/blog/${data.slug}`);
      } else {
        setPublishError(data.error || "Failed to publish");
      }
    } catch (error) {
      setPublishError(error instanceof Error ? error.message : "Publish failed");
    } finally {
      setIsPublishing(false);
    }
  };

  // Schedule post
  const handleSchedule = async () => {
    if (!generatedPost || !scheduleDate || !scheduleTime) return;

    setIsScheduling(true);

    try {
      const scheduledFor = new Date(`${scheduleDate}T${scheduleTime}`);

      const res = await fetch("/api/ai/blog/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generatedPost: getEditedPost(),
          scheduledFor: scheduledFor.toISOString(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setShowScheduleModal(false);
        setScheduleDate("");
        setScheduleTime("");
        fetchQueue();
        alert("Post scheduled successfully!");
      } else {
        alert(data.error || "Failed to schedule post");
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Scheduling failed");
    } finally {
      setIsScheduling(false);
    }
  };

  // Fetch queue
  const fetchQueue = async () => {
    setIsLoadingQueue(true);
    try {
      const res = await fetch("/api/ai/blog/schedule");
      const data = await res.json();

      if (data.success) {
        setQueueItems(data.queue || []);
        setQueueStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch queue:", error);
    } finally {
      setIsLoadingQueue(false);
    }
  };

  // Delete from queue
  const handleDeleteFromQueue = async (id: string) => {
    if (!confirm("Remove this scheduled post?")) return;

    try {
      const res = await fetch(`/api/ai/blog/schedule/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        fetchQueue();
      } else {
        alert(data.error || "Failed to remove from queue");
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Delete failed");
    }
  };

  // Retry failed post
  const handleRetryFailed = async (id: string) => {
    try {
      const res = await fetch(`/api/ai/blog/schedule/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "retry" }),
      });

      const data = await res.json();

      if (data.success) {
        fetchQueue();
      } else {
        alert(data.error || "Failed to retry");
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Retry failed");
    }
  };

  // Trigger manual queue processing
  const handleProcessQueue = async () => {
    try {
      const res = await fetch("/api/ai/blog/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "process" }),
      });

      const data = await res.json();

      if (data.success) {
        fetchQueue();
        alert(
          `Queue processed: ${data.result.published} published, ${data.result.failed} failed`
        );
      } else {
        alert(data.error || "Processing failed");
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Processing failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/blog" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Blog Generator</h1>
                <p className="text-sm text-gray-500">Generate SEO-optimized blog posts with AI</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAutoBlog(!showAutoBlog)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
                  isAutoRunning
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Zap className="h-4 w-4" />
                Auto Generator
                {isAutoRunning && (
                  <span className="ml-1 flex h-2 w-2">
                    <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowQueue(!showQueue)}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Clock className="h-4 w-4" />
                Scheduled Queue
                {queueStats && queueStats.pending > 0 && (
                  <span className="ml-1 rounded-full bg-primary-500 px-2 py-0.5 text-xs text-white">
                    {queueStats.pending}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Configuration */}
          <div className="space-y-6">
            {/* Topic Selection */}
            <div className="rounded-xl bg-white p-6 shadow">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Topic</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    What should the blog post be about?
                  </label>
                  <div className="mt-1 flex gap-2">
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., How AI is transforming K-12 assessment"
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    <button
                      onClick={fetchTopicSuggestions}
                      disabled={isLoadingTopics}
                      className="flex items-center gap-2 whitespace-nowrap rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      {isLoadingTopics ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                      Suggest
                    </button>
                  </div>
                </div>

                {/* Topic Suggestions */}
                {showSuggestions && topicSuggestions.length > 0 && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        AI-Generated Topics
                      </span>
                      <button
                        onClick={() => setShowSuggestions(false)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Hide
                      </button>
                    </div>
                    <div className="space-y-2">
                      {topicSuggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setTopic(suggestion.title);
                            setShowSuggestions(false);
                          }}
                          className="w-full rounded-lg border border-gray-200 bg-white p-3 text-left hover:border-primary-300 hover:bg-primary-50"
                        >
                          <div className="font-medium text-gray-900">{suggestion.title}</div>
                          <div className="mt-1 text-sm text-gray-500">{suggestion.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as BlogCategory)}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      {BLOG_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Target Market</label>
                    <select
                      value={targetMarket}
                      onChange={(e) => setTargetMarket(e.target.value as TargetMarket)}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      {TARGET_MARKETS.map((market) => (
                        <option key={market.value} value={market.value}>
                          {market.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Configuration */}
            <div className="rounded-xl bg-white p-6 shadow">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Configuration</h2>

              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tone</label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value as BlogTone)}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      {TONES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Length</label>
                    <select
                      value={length}
                      onChange={(e) => setLength(e.target.value as BlogLength)}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      {LENGTHS.map((l) => (
                        <option key={l.value} value={l.value}>
                          {l.label} ({l.description})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">AI Provider</label>
                    <select
                      value={aiProvider}
                      onChange={(e) => setAiProvider(e.target.value as AIProvider)}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      <option value="claude">Claude (Recommended)</option>
                      <option value="gpt4">GPT-4</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    SEO Keywords (optional, comma-separated)
                  </label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g., AI tutoring, education technology, personalized learning"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="productMention"
                    type="checkbox"
                    checked={includeProductMention}
                    onChange={(e) => setIncludeProductMention(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="productMention" className="ml-2 block text-sm text-gray-700">
                    Include natural product mentions
                  </label>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !topic.trim()}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-500 px-4 py-3 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Generate Blog Post
                    </>
                  )}
                </button>

                {generateError && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {generateError}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            {generatedPost ? (
              <>
                {/* Preview Header */}
                <div className="rounded-xl bg-white p-6 shadow">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Generated Content</h2>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        SEO Score: {generatedPost.seoScore}/100
                      </span>
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        {generatedPost.readingTime} min read
                      </span>
                    </div>
                  </div>

                  {/* Editable Title */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-lg font-semibold shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>

                  {/* Editable Excerpt */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Excerpt</label>
                    <textarea
                      rows={2}
                      value={editedExcerpt}
                      onChange={(e) => setEditedExcerpt(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>

                  {/* Featured Image */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Featured Image</label>
                    <div className="mt-1 flex gap-2">
                      <input
                        type="text"
                        value={editedFeaturedImage}
                        onChange={(e) => setEditedFeaturedImage(e.target.value)}
                        placeholder="Image URL"
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                      <select
                        value={imageStyle}
                        onChange={(e) =>
                          setImageStyle(e.target.value as typeof imageStyle)
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2"
                      >
                        <option value="professional">Professional</option>
                        <option value="illustrative">Illustrative</option>
                        <option value="abstract">Abstract</option>
                      </select>
                      <button
                        onClick={handleGenerateImage}
                        disabled={isGeneratingImage}
                        className="flex items-center gap-2 whitespace-nowrap rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        {isGeneratingImage ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ImageIcon className="h-4 w-4" />
                        )}
                        Generate
                      </button>
                    </div>
                    {editedFeaturedImage && sanitizeImageUrl(editedFeaturedImage) && (
                      <div className="mt-2">
                        <img
                          src={sanitizeImageUrl(editedFeaturedImage)}
                          alt="Featured"
                          className="h-32 w-full rounded-lg object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* SEO Fields */}
                  <div className="mb-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Meta Title ({editedMetaTitle.length}/60)
                      </label>
                      <input
                        type="text"
                        value={editedMetaTitle}
                        onChange={(e) => setEditedMetaTitle(e.target.value)}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Meta Description ({editedMetaDescription.length}/160)
                      </label>
                      <input
                        type="text"
                        value={editedMetaDescription}
                        onChange={(e) => setEditedMetaDescription(e.target.value)}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={editedTags}
                      onChange={(e) => setEditedTags(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Content Preview */}
                <div className="rounded-xl bg-white p-6 shadow">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">Content (Markdown)</h2>
                  <textarea
                    rows={20}
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Regenerate
                  </button>

                  <button
                    onClick={handleSaveAsDraft}
                    disabled={isPublishing}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Save className="h-4 w-4" />
                    Save as Draft
                  </button>

                  <button
                    onClick={() => setShowScheduleModal(true)}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Clock className="h-4 w-4" />
                    Schedule
                  </button>

                  <button
                    onClick={handlePublishNow}
                    disabled={isPublishing}
                    className="flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
                  >
                    {isPublishing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    Publish Now
                  </button>
                </div>

                {publishError && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{publishError}</div>
                )}
              </>
            ) : (
              <div className="flex h-96 items-center justify-center rounded-xl bg-white shadow">
                <div className="text-center text-gray-500">
                  <Sparkles className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-4 text-lg font-medium">No content generated yet</p>
                  <p className="mt-1 text-sm">Enter a topic and click Generate to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Auto Blog Generator */}
        {showAutoBlog && (
          <div className="mt-8 rounded-xl bg-gradient-to-br from-purple-50 to-primary-50 p-6 shadow border border-purple-100">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-primary-500 text-white">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Automatic Blog Generator</h2>
                  <p className="text-sm text-gray-600">
                    AI decides everything: topic, category, market, tone, and generates posts on schedule
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isAutoRunning && (
                  <span className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                    <span className="flex h-2 w-2">
                      <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                    </span>
                    Running
                  </span>
                )}
                <button
                  onClick={() => setShowAutoSettings(!showAutoSettings)}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
              </div>
            </div>

            {/* Settings Panel */}
            {showAutoSettings && (
              <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
                <h3 className="mb-4 font-medium text-gray-900">Auto Generation Settings</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Generation Interval</label>
                    <select
                      value={autoIntervalType}
                      onChange={(e) => setAutoIntervalType(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      {INTERVAL_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="autoPublish"
                      type="checkbox"
                      checked={autoPublish}
                      onChange={(e) => setAutoPublish(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor="autoPublish" className="ml-2 block text-sm text-gray-700">
                      Auto-publish posts (otherwise saved as drafts)
                    </label>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleUpdateAutoSettings}
                    className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            )}

            {/* Main Controls */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Start/Stop Button */}
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <h3 className="mb-2 font-medium text-gray-900">Scheduled Generation</h3>
                <p className="mb-4 text-sm text-gray-600">
                  {isAutoRunning
                    ? `Running ${INTERVAL_OPTIONS.find((o) => o.value === autoSettings?.intervalType)?.label.toLowerCase() || "on schedule"}. AI will automatically generate varied blog posts.`
                    : "Start the scheduler to automatically generate blog posts at your chosen interval."}
                </p>
                <button
                  onClick={handleToggleAuto}
                  disabled={isTogglingAuto}
                  className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                    isAutoRunning
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-gradient-to-r from-purple-500 to-primary-500 text-white hover:from-purple-600 hover:to-primary-600"
                  }`}
                >
                  {isTogglingAuto ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : isAutoRunning ? (
                    <>
                      <Power className="h-5 w-5" />
                      Stop Auto Generator
                    </>
                  ) : (
                    <>
                      <Power className="h-5 w-5" />
                      Start Auto Generator
                    </>
                  )}
                </button>
              </div>

              {/* Generate Now Button */}
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <h3 className="mb-2 font-medium text-gray-900">Generate Now</h3>
                <p className="mb-4 text-sm text-gray-600">
                  Trigger immediate generation. AI will decide all parameters to ensure variety from recent posts.
                </p>
                <button
                  onClick={handleTriggerAutoGenerate}
                  disabled={isGeneratingAuto}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-purple-300 bg-purple-50 px-4 py-3 text-sm font-medium text-purple-700 hover:bg-purple-100"
                >
                  {isGeneratingAuto ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Generate Blog Now
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Stats */}
            {autoStats && (
              <div className="mt-6">
                <h3 className="mb-3 font-medium text-gray-900">Generation History</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg bg-white p-4 text-center">
                    <div className="text-2xl font-bold text-primary-600">{autoStats.totalGenerated}</div>
                    <div className="text-sm text-gray-500">Total Generated</div>
                  </div>
                  <div className="rounded-lg bg-white p-4 text-center">
                    <div className="text-sm font-medium text-gray-900">
                      {autoStats.lastGeneratedAt
                        ? new Date(autoStats.lastGeneratedAt).toLocaleString()
                        : "Never"}
                    </div>
                    <div className="text-sm text-gray-500">Last Generated</div>
                  </div>
                  <div className="rounded-lg bg-white p-4 text-center">
                    {autoStats.lastError ? (
                      <>
                        <div className="text-sm font-medium text-red-600 truncate">{autoStats.lastError}</div>
                        <div className="text-sm text-gray-500">Last Error</div>
                      </>
                    ) : (
                      <>
                        <div className="text-sm font-medium text-green-600">No errors</div>
                        <div className="text-sm text-gray-500">Status</div>
                      </>
                    )}
                  </div>
                </div>

                {/* Recent Generations */}
                {autoStats.recentGenerations.length > 0 && (
                  <div className="mt-4">
                    <h4 className="mb-2 text-sm font-medium text-gray-700">Recent Auto-Generated Posts</h4>
                    <div className="space-y-2">
                      {autoStats.recentGenerations.slice(0, 5).map((gen, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg bg-white p-3 text-sm">
                          <div className="flex-1 truncate font-medium text-gray-900">{gen.topic}</div>
                          <div className="ml-4 flex gap-2">
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                              {gen.category}
                            </span>
                            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700">
                              {gen.targetMarket}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Schedule Queue */}
        {showQueue && (
          <div className="mt-8 rounded-xl bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-900">Scheduled Posts Queue</h2>
                {queueStats && (
                  <div className="flex gap-2">
                    <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
                      {queueStats.pending} pending
                    </span>
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                      {queueStats.published} published
                    </span>
                    {queueStats.failed > 0 && (
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                        {queueStats.failed} failed
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={fetchQueue}
                  disabled={isLoadingQueue}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {isLoadingQueue ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Refresh
                </button>
                <button
                  onClick={handleProcessQueue}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Play className="h-4 w-4" />
                  Process Now
                </button>
              </div>
            </div>

            {queueItems.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No scheduled posts</p>
            ) : (
              <div className="divide-y divide-gray-200">
                {queueItems.map((item) => (
                  <div key={item._id} className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      {item.status === "pending" && (
                        <Clock className="h-5 w-5 text-yellow-500" />
                      )}
                      {item.status === "published" && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {item.status === "failed" && (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-500">
                          {item.status === "pending" && (
                            <>Scheduled for {new Date(item.scheduledFor).toLocaleString()}</>
                          )}
                          {item.status === "published" && (
                            <>Published {new Date(item.publishedAt!).toLocaleString()}</>
                          )}
                          {item.status === "failed" && (
                            <span className="text-red-600">{item.error}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {item.status === "failed" && (
                        <button
                          onClick={() => handleRetryFailed(item._id)}
                          className="rounded-lg border border-gray-300 p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                      )}
                      {item.status === "pending" && (
                        <button
                          onClick={() => handleDeleteFromQueue(item._id)}
                          className="rounded-lg border border-gray-300 p-2 text-gray-500 hover:bg-gray-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Schedule Post</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSchedule}
                  disabled={isScheduling || !scheduleDate || !scheduleTime}
                  className="flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-50"
                >
                  {isScheduling ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Calendar className="h-4 w-4" />
                  )}
                  Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
