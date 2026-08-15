'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  Search,
  MoreVertical,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { SiteContext } from '../../ShowcaseLayoutClient';

interface StaffSession {
  site: {
    slug: string;
    businessName: string;
    enabledTools: string[];
  };
  timestamp: number;
  authenticated: boolean;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  status: 'draft' | 'published';
  createdAt: Date;
  publishedAt?: Date;
  author: string;
}

// Mock blog posts
const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: '5 Tips to Improve Your SAT Math Score',
    excerpt:
      'Discover proven strategies to boost your SAT math performance and achieve your target score.',
    content: 'Full content here...',
    status: 'published',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    author: 'Dr. Victor Lisyanoy',
  },
  {
    id: '2',
    title: 'Why Early Math Education Matters',
    excerpt:
      'Research shows that strong math foundations in elementary school lead to better outcomes later.',
    content: 'Full content here...',
    status: 'published',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    author: 'FSM Team',
  },
  {
    id: '3',
    title: 'Summer Program Registration Now Open',
    excerpt:
      'Enroll your child in our summer math enrichment program for grades 1-12.',
    content: 'Full content here...',
    status: 'draft',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    author: 'FSM Team',
  },
];

export default function StaffBlogPage() {
  const site = useContext(SiteContext);
  const router = useRouter();
  const [session, setSession] = useState<StaffSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>(mockPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Editor state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');

  useEffect(() => {
    if (!site) return;

    const stored = sessionStorage.getItem(`showcase_staff_${site.slug}`);
    if (stored) {
      const parsed = JSON.parse(stored) as StaffSession;
      if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000 && parsed.authenticated) {
        setSession(parsed);
        setIsLoading(false);
        return;
      }
    }
    router.push(`/showcase/${site.slug}/staff`);
  }, [site, router]);

  if (!site || isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!session) return null;

  const baseUrl = `/showcase/${site.slug}`;

  const filteredPosts = posts.filter((post) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) || post.excerpt.toLowerCase().includes(query)
    );
  });

  const handleNewPost = () => {
    setEditingPost(null);
    setTitle('');
    setContent('');
    setShowEditor(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
    setShowEditor(true);
  };

  const handleDeletePost = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleSavePost = (status: 'draft' | 'published') => {
    const newPost: BlogPost = {
      id: editingPost?.id || Date.now().toString(),
      title,
      excerpt: content.slice(0, 150) + '...',
      content,
      status,
      createdAt: editingPost?.createdAt || new Date(),
      publishedAt: status === 'published' ? new Date() : undefined,
      author: 'Staff',
    };

    if (editingPost) {
      setPosts((prev) => prev.map((p) => (p.id === editingPost.id ? newPost : p)));
    } else {
      setPosts((prev) => [newPost, ...prev]);
    }

    setShowEditor(false);
    setTitle('');
    setContent('');
    setEditingPost(null);
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const generatedContent = `# ${aiPrompt}

## Introduction

As educators committed to excellence in mathematics instruction, we understand the importance of ${aiPrompt.toLowerCase()}. In this article, we'll explore key strategies and insights that can make a significant difference in student outcomes.

## Why This Matters

Mathematics education forms the foundation for critical thinking, problem-solving, and analytical skills that students will use throughout their lives. By focusing on ${aiPrompt.toLowerCase()}, we can help students build confidence and achieve their full potential.

## Key Strategies

### 1. Build Strong Foundations
Every advanced concept relies on mastery of fundamental principles. Ensure students have a solid understanding of prerequisite material before moving forward.

### 2. Practice Deliberately
Quality practice matters more than quantity. Focus on targeted exercises that address specific skill gaps.

### 3. Embrace Mistakes as Learning Opportunities
Errors provide valuable feedback. Encourage students to analyze their mistakes and understand where their reasoning went wrong.

### 4. Connect to Real-World Applications
Help students see how mathematical concepts apply to everyday situations and future careers.

## Conclusion

Success in mathematics comes from consistent effort, the right guidance, and a supportive learning environment. At ${site.businessName}, we're committed to providing all three.

---

*Contact us today to learn how we can help your child excel in mathematics.*
`;

    setContent(generatedContent);
    setTitle(aiPrompt);
    setAiPrompt('');
    setIsGenerating(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href={`${baseUrl}/staff/dashboard`}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!showEditor ? (
          <>
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <FileText className="w-7 h-7" style={{ color: site.branding.primaryColor }} />
                  Blog Manager
                </h1>
                <p className="text-gray-600 mt-1">Create and manage blog posts for your website</p>
              </div>
              <button
                onClick={handleNewPost}
                className="inline-flex items-center gap-2 px-4 py-2 text-white font-medium rounded-lg transition"
                style={{ backgroundColor: site.branding.primaryColor }}
              >
                <Plus className="w-4 h-4" />
                New Post
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': site.branding.primaryColor } as React.CSSProperties}
                />
              </div>
            </div>

            {/* Posts List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {filteredPosts.length === 0 ? (
                <div className="p-12 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="font-semibold text-gray-900 mb-1">No posts yet</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Create your first blog post to engage with your audience
                  </p>
                  <button
                    onClick={handleNewPost}
                    className="inline-flex items-center gap-2 px-4 py-2 text-white font-medium rounded-lg transition"
                    style={{ backgroundColor: site.branding.primaryColor }}
                  >
                    <Plus className="w-4 h-4" />
                    Create Post
                  </button>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                        Title
                      </th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                        Status
                      </th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                        Date
                      </th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                        Author
                      </th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{post.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-md">
                            {post.excerpt}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              post.status === 'published'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {post.status === 'published' ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">
                            {formatDate(post.publishedAt || post.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">{post.author}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => handleEditPost(post)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4 text-gray-500" />
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="p-2 hover:bg-red-50 rounded-lg transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        ) : (
          /* Editor View */
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {editingPost ? 'Edit Post' : 'New Post'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {editingPost ? 'Update your blog post' : 'Create a new blog post'}
                </p>
              </div>
              <button
                onClick={() => setShowEditor(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>

            {/* AI Writing Assistant */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-6 border border-purple-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Writing Assistant</h3>
                  <p className="text-sm text-gray-500">Generate a blog post draft with AI</p>
                </div>
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Enter a topic, e.g., 'How to prepare for AP Calculus'"
                  className="flex-1 px-4 py-2 border border-purple-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
                <button
                  onClick={handleAIGenerate}
                  disabled={isGenerating || !aiPrompt}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg transition disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Editor */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter post title..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-lg font-medium focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': site.branding.primaryColor } as React.CSSProperties}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post content here... (Markdown supported)"
                  rows={15}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg font-mono text-sm focus:ring-2 focus:border-transparent resize-none"
                  style={{ '--tw-ring-color': site.branding.primaryColor } as React.CSSProperties}
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  {content.split(/\s+/).filter(Boolean).length} words
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleSavePost('draft')}
                    disabled={!title || !content}
                    className="px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    Save as Draft
                  </button>
                  <button
                    onClick={() => handleSavePost('published')}
                    disabled={!title || !content}
                    className="px-4 py-2 text-white font-medium rounded-lg transition disabled:opacity-50"
                    style={{ backgroundColor: site.branding.primaryColor }}
                  >
                    Publish
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
