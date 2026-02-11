'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import ExcelJS from 'exceljs';
import {
  Search,
  Settings,
  Play,
  Pause,
  RefreshCw,
  Users,
  Mail,
  Globe,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  ExternalLink,
  Trash2,
  Eye,
  AlertCircle,
  Sparkles,
  Target,
  MessageSquare,
  Upload,
  ChevronDown,
  ChevronUp,
  Copy,
  Send,
  Building2,
  TrendingUp,
} from 'lucide-react';

// Prospect from new model
interface Prospect {
  _id: string;
  instituteName: string;
  website: string;
  slug: string;
  businessType: string;
  location: string;
  services: string;
  estimatedSize: string;
  techAssessment: string;
  potentialSolutions: string;
  status: string;
  priority: string;
  scrapedData?: {
    businessName?: string;
    email?: string;
    phone?: string;
    scrapeQuality?: string;
    pagesScraped?: number;
    images?: Array<{ url: string; alt: string; context: string }>;
    team?: Array<{ name: string; role?: string; imageUrl?: string }>;
    programs?: Array<{ name: string; description?: string; price?: string }>;
    testimonials?: Array<{ quote: string; author: string }>;
    primaryColor?: string;
    youtube?: string;
  };
  showcaseSlug?: string;
  showcaseAccessCode?: string;
  outreachLogs?: Array<{ type: string; sentAt: string; status: string }>;
  lastOutreachAt?: string;
  createdAt: string;
}

// Legacy candidate from ProspectingConfig
interface ProspectCandidate {
  businessName: string;
  websiteUrl: string;
  location?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactFormUrl?: string;
  discoveredAt: string;
  status: 'discovered' | 'processing' | 'demo_created' | 'failed';
  errorMessage?: string;
  showcaseSlug?: string;
}

interface ProspectingConfig {
  _id: string;
  seedConcept: string;
  maxDrafts: number;
  isActive: boolean;
  businessTypes: string[];
  outreachEmailTemplate: string;
  outreachContactFormTemplate: string;
  autoOutreachOnActivate: boolean;
  candidates: ProspectCandidate[];
  totalDiscovered: number;
  totalDemosCreated: number;
  totalOutreachSent: number;
  lastProspectingRun?: string;
}

interface OutreachPreview {
  emailSubject: string;
  emailBody: string;
  contactFormMessage: string;
  showcaseUrl: string;
  accessCode: string;
  contactFormUrl: string;
  recipientEmail?: string;
}

interface PendingForm {
  slug: string;
  businessName: string;
  contactFormUrl: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  // New Prospect statuses
  new: { label: 'New', color: 'bg-gray-100 text-gray-700', icon: Clock },
  scraped: { label: 'Scraped', color: 'bg-blue-100 text-blue-700', icon: Globe },
  showcase_created: { label: 'Demo Ready', color: 'bg-purple-100 text-purple-700', icon: Sparkles },
  outreach_pending: { label: 'Outreach Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  email_sent: { label: 'Email Sent', color: 'bg-amber-100 text-amber-700', icon: Mail },
  contacted: { label: 'Contacted', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  responded: { label: 'Responded', color: 'bg-green-100 text-green-700', icon: MessageSquare },
  demo_viewed: { label: 'Demo Viewed', color: 'bg-indigo-100 text-indigo-700', icon: Eye },
  interested: { label: 'Interested', color: 'bg-green-200 text-green-800', icon: TrendingUp },
  meeting_scheduled: { label: 'Meeting Set', color: 'bg-teal-100 text-teal-700', icon: Users },
  converted: { label: 'Converted', color: 'bg-green-500 text-white', icon: CheckCircle2 },
  declined: { label: 'Declined', color: 'bg-red-100 text-red-700', icon: XCircle },
  unresponsive: { label: 'No Response', color: 'bg-gray-200 text-gray-600', icon: Clock },
  // Legacy statuses
  discovered: { label: 'Discovered', color: 'bg-blue-100 text-blue-700', icon: Search },
  processing: { label: 'Processing', color: 'bg-yellow-100 text-yellow-700', icon: Loader2 },
  demo_created: { label: 'Demo Created', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export default function ProspectingPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Config state (legacy)
  const [config, setConfig] = useState<ProspectingConfig | null>(null);
  const [pendingForms, setPendingForms] = useState<PendingForm[]>([]);

  // Prospects state (new model)
  const [prospects, setProspects] = useState<Prospect[]>([]);

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [expandedProspect, setExpandedProspect] = useState<string | null>(null);
  const [processingSlug, setProcessingSlug] = useState<string | null>(null);
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const [isAutomating, setIsAutomating] = useState(false);

  // Outreach modal
  const [showOutreachModal, setShowOutreachModal] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [outreachPreview, setOutreachPreview] = useState<OutreachPreview | null>(null);

  // Editable config fields
  const [seedConcept, setSeedConcept] = useState('');
  const [maxDrafts, setMaxDrafts] = useState(15);
  const [emailTemplate, setEmailTemplate] = useState('');
  const [contactFormTemplate, setContactFormTemplate] = useState('');

  const fetchData = async () => {
    try {
      const [configRes, prospectsRes, formsRes] = await Promise.all([
        fetch('/api/admin/prospecting'),
        fetch('/api/admin/prospects'),
        fetch('/api/admin/prospecting/pending-forms'),
      ]);

      if (configRes.ok) {
        const configData = await configRes.json();
        setConfig(configData.config);
        setSeedConcept(configData.config?.seedConcept || '');
        setMaxDrafts(configData.config?.maxDrafts || 15);
        setEmailTemplate(configData.config?.outreachEmailTemplate || '');
        setContactFormTemplate(configData.config?.outreachContactFormTemplate || '');
      }

      if (prospectsRes.ok) {
        const prospectsData = await prospectsRes.json();
        setProspects(prospectsData.prospects || []);
      }

      if (formsRes.ok) {
        const formsData = await formsRes.json();
        setPendingForms(formsData.sites || []);
      }
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const saveConfig = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/prospecting', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seedConcept,
          maxDrafts,
          outreachEmailTemplate: emailTemplate,
          outreachContactFormTemplate: contactFormTemplate,
        }),
      });
      if (!res.ok) throw new Error('Failed to save');
      const data = await res.json();
      setConfig(data.config);
      setShowSettings(false);
      setMessage({ type: 'success', text: 'Configuration saved!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save configuration' });
      console.error(err);
    }
    setIsSaving(false);
  };

  const toggleProspecting = async () => {
    if (!config) return;
    try {
      const res = await fetch('/api/admin/prospecting', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !config.isActive }),
      });
      if (!res.ok) throw new Error('Failed to toggle');
      const data = await res.json();
      setConfig(data.config);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to toggle prospecting' });
      console.error(err);
    }
  };

  // Excel import
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(data);
      const sheet = workbook.worksheets[0];
      const headers = (sheet.getRow(1).values as string[]).slice(1);
      const jsonData: Record<string, unknown>[] = [];
      sheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const obj: Record<string, unknown> = {};
        (row.values as unknown[]).slice(1).forEach((val, i) => {
          obj[headers[i]] = val;
        });
        jsonData.push(obj);
      });

      const res = await fetch('/api/admin/prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prospects: jsonData }),
      });

      if (res.ok) {
        const result = await res.json();
        setMessage({ type: 'success', text: result.message });
        fetchData();
      } else {
        const result = await res.json();
        setMessage({ type: 'error', text: result.error });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to import file' });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Scrape prospect website
  const handleScrape = async (slug: string) => {
    setProcessingSlug(slug);
    setProcessingAction('scrape');

    try {
      const res = await fetch('/api/admin/prospects/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Website scraped successfully!' });
        fetchData();
      } else {
        const result = await res.json();
        setMessage({ type: 'error', text: result.error });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to scrape website' });
    }

    setProcessingSlug(null);
    setProcessingAction(null);
  };

  // Generate showcase
  const handleGenerateShowcase = async (slug: string) => {
    setProcessingSlug(slug);
    setProcessingAction('showcase');

    try {
      const res = await fetch('/api/admin/prospects/generate-showcase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });

      if (res.ok) {
        const result = await res.json();
        setMessage({
          type: 'success',
          text: result.isExisting
            ? 'Showcase already exists'
            : `Showcase created! Access code: ${result.accessCode}`,
        });
        fetchData();
      } else {
        const result = await res.json();
        setMessage({ type: 'error', text: result.error });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to generate showcase' });
    }

    setProcessingSlug(null);
    setProcessingAction(null);
  };

  // Preview outreach
  const handlePreviewOutreach = async (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setProcessingSlug(prospect.slug);
    setProcessingAction('outreach');

    try {
      const res = await fetch(`/api/admin/prospects/outreach?slug=${prospect.slug}`);
      if (res.ok) {
        const data = await res.json();
        setOutreachPreview(data.outreach ? data : { ...data, outreach: data });
        setShowOutreachModal(true);
      } else {
        const result = await res.json();
        setMessage({ type: 'error', text: result.error });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to generate outreach' });
    }

    setProcessingSlug(null);
    setProcessingAction(null);
  };

  // Send email
  const handleSendEmail = async () => {
    if (!selectedProspect) return;
    setProcessingAction('sending');

    try {
      const res = await fetch('/api/admin/prospects/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: selectedProspect.slug, action: 'send_email' }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Email sent successfully!' });
        fetchData();
      } else {
        const result = await res.json();
        setMessage({ type: 'error', text: result.error });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to send email' });
    }

    setProcessingAction(null);
  };

  // Log contact form
  const handleLogContactForm = async () => {
    if (!selectedProspect) return;

    try {
      const res = await fetch('/api/admin/prospects/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: selectedProspect.slug, action: 'log_contact_form' }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Contact form logged!' });
        setShowOutreachModal(false);
        fetchData();
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to log contact form' });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setMessage({ type: 'success', text: 'Copied to clipboard!' });
  };

  // Automate all new prospects
  const handleAutomateAll = async () => {
    setIsAutomating(true);
    const newProspects = prospects.filter((p) => p.status === 'new');

    for (const prospect of newProspects) {
      await handleScrape(prospect.slug);
      await new Promise((r) => setTimeout(r, 2000));

      // Refetch to get updated prospect
      const res = await fetch('/api/admin/prospects');
      if (res.ok) {
        const data = await res.json();
        const updated = data.prospects?.find((p: Prospect) => p.slug === prospect.slug);
        if (updated?.scrapedData) {
          await handleGenerateShowcase(prospect.slug);
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
    }

    setIsAutomating(false);
    setMessage({ type: 'success', text: `Processed ${newProspects.length} prospects` });
    fetchData();
  };

  // Re-scrape all existing prospects with improved scraper
  const [isRescraping, setIsRescraping] = useState(false);
  const handleRescrapeAll = async () => {
    setIsRescraping(true);
    const scrapedProspects = prospects.filter((p) => p.scrapedData);

    let processed = 0;
    for (const prospect of scrapedProspects) {
      setProcessingSlug(prospect.slug);
      setProcessingAction('scrape');

      try {
        const res = await fetch('/api/admin/prospects/scrape', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: prospect.slug }),
        });

        if (res.ok) {
          const result = await res.json();
          console.log(`[RESCRAPE] ${prospect.instituteName}:`, result.stats);
          processed++;
        }
      } catch (err) {
        console.error(`Failed to rescrape ${prospect.instituteName}:`, err);
      }

      // Delay between scrapes to be respectful
      await new Promise((r) => setTimeout(r, 3000));
    }

    setProcessingSlug(null);
    setProcessingAction(null);
    setIsRescraping(false);
    setMessage({ type: 'success', text: `Re-scraped ${processed} prospects with improved scraper` });
    fetchData();
  };

  // Re-scrape and regenerate showcase for a single prospect
  const handleRescrapeAndRegenerate = async (slug: string) => {
    setProcessingSlug(slug);
    setProcessingAction('rescrape');

    try {
      // Step 1: Delete existing showcase
      const deleteRes = await fetch(`/api/admin/showcase/${slug}`, { method: 'DELETE' });
      if (!deleteRes.ok) {
        console.log('No existing showcase to delete or delete failed');
      }

      // Step 2: Re-scrape with improved scraper
      setProcessingAction('scrape');
      const scrapeRes = await fetch('/api/admin/prospects/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });

      if (!scrapeRes.ok) {
        const result = await scrapeRes.json();
        throw new Error(result.error || 'Scrape failed');
      }

      const scrapeResult = await scrapeRes.json();
      console.log('[RESCRAPE] Stats:', scrapeResult.stats);

      // Step 3: Generate new showcase
      setProcessingAction('showcase');
      const showcaseRes = await fetch('/api/admin/prospects/generate-showcase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });

      if (!showcaseRes.ok) {
        const result = await showcaseRes.json();
        throw new Error(result.error || 'Showcase generation failed');
      }

      const showcaseResult = await showcaseRes.json();
      setMessage({
        type: 'success',
        text: `Re-scraped and regenerated showcase! Quality: ${scrapeResult.scrapedData?.scrapeQuality}, Images: ${scrapeResult.stats?.imagesFound || 0}, Team: ${scrapeResult.stats?.teamMembersFound || 0}`,
      });
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: `Failed: ${(err as Error).message}` });
    }

    setProcessingSlug(null);
    setProcessingAction(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  // Combined stats
  const stats = {
    totalProspects: prospects.length,
    new: prospects.filter((p) => p.status === 'new').length,
    scraped: prospects.filter((p) => p.status === 'scraped').length,
    demoReady: prospects.filter((p) => ['showcase_created', 'outreach_pending'].includes(p.status)).length,
    contacted: prospects.filter((p) => ['email_sent', 'contacted'].includes(p.status)).length,
    responded: prospects.filter((p) => ['responded', 'demo_viewed', 'interested', 'meeting_scheduled'].includes(p.status)).length,
    pendingForms: pendingForms.length,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Link href="/admin" className="hover:text-gray-700">Admin</Link>
                <span>/</span>
                <span className="text-gray-900">Prospecting</span>
              </nav>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Target className="w-7 h-7 text-emerald-600" />
                Prospect Pipeline
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                <Upload className="w-4 h-4" />
                Import Excel
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Settings className="w-5 h-5" />
                Settings
              </button>
              <Link
                href="/admin/showcase"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
              >
                <Eye className="w-5 h-5" />
                Showcase Manager
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Messages */}
        {(error || message) && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
              (message?.type === 'success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}
          >
            {(message?.type === 'success') ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {error || message?.text}
            <button onClick={() => { setError(null); setMessage(null); }} className="ml-auto">×</button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{stats.totalProspects}</div>
            <div className="text-xs text-gray-500">Total Prospects</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-gray-600">{stats.new}</div>
            <div className="text-xs text-gray-500">New</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{stats.scraped}</div>
            <div className="text-xs text-gray-500">Scraped</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-purple-600">{stats.demoReady}</div>
            <div className="text-xs text-gray-500">Demo Ready</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-amber-600">{stats.contacted}</div>
            <div className="text-xs text-gray-500">Contacted</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-green-600">{stats.responded}</div>
            <div className="text-xs text-gray-500">Responded</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-orange-600">{stats.pendingForms}</div>
            <div className="text-xs text-gray-500">Pending Forms</div>
          </div>
        </div>

        {/* Pending Contact Forms */}
        {pendingForms.length > 0 && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-800">
                  {pendingForms.length} Contact Form{pendingForms.length > 1 ? 's' : ''} Pending
                </h3>
                <p className="text-sm text-orange-700 mt-1">
                  These prospects have received outreach emails. Fill out their contact forms.
                </p>
                <div className="mt-3 space-y-2">
                  {pendingForms.slice(0, 5).map((form) => (
                    <div key={form.slug} className="flex items-center justify-between bg-white rounded-lg p-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-900">{form.businessName}</span>
                        <a
                          href={form.contactFormUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-orange-600 hover:underline inline-flex items-center gap-1"
                        >
                          <Globe className="w-3 h-3" /> Contact page
                        </a>
                      </div>
                      <Link href={`/showcase/${form.slug}`} target="_blank" className="text-xs text-emerald-600 hover:underline">
                        View Demo →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Prospecting Control Panel */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                Automation Engine
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {config?.isActive
                  ? 'Auto-discovery is active'
                  : 'Configure seed concept to enable auto-discovery'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {stats.new > 0 && (
                <button
                  onClick={handleAutomateAll}
                  disabled={isAutomating || isRescraping}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
                >
                  {isAutomating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Process All New ({stats.new})
                    </>
                  )}
                </button>
              )}
              {prospects.filter(p => p.scrapedData).length > 0 && (
                <button
                  onClick={handleRescrapeAll}
                  disabled={isAutomating || isRescraping}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  title="Re-scrape all prospects with improved scraper"
                >
                  {isRescraping ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Re-scraping...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Re-scrape All ({prospects.filter(p => p.scrapedData).length})
                    </>
                  )}
                </button>
              )}
              <button
                onClick={toggleProspecting}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                  config?.isActive
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600'
                }`}
              >
                {config?.isActive ? (
                  <><Pause className="w-5 h-5" /> Pause Auto-Discovery</>
                ) : (
                  <><Play className="w-5 h-5" /> Start Auto-Discovery</>
                )}
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Seed Concept</div>
                <div className="text-gray-900 font-medium">
                  {config?.seedConcept || <span className="text-gray-400 italic">Click Settings to configure</span>}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Draft Limit</div>
                <div className="text-gray-900 font-medium">{config?.maxDrafts || 15}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuration</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seed Concept</label>
                <textarea
                  value={seedConcept}
                  onChange={(e) => setSeedConcept(e.target.value)}
                  placeholder="e.g., Test prep centers and SAT tutoring companies in the Boston area"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Drafts in Queue</label>
                <input
                  type="number"
                  value={maxDrafts}
                  onChange={(e) => setMaxDrafts(parseInt(e.target.value) || 15)}
                  className="w-32 px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Template</label>
                <textarea
                  value={emailTemplate}
                  onChange={(e) => setEmailTemplate(e.target.value)}
                  rows={10}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Variables: {'{{businessName}}'}, {'{{demoUrl}}'}, {'{{accessCode}}'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Form Template</label>
                <textarea
                  value={contactFormTemplate}
                  onChange={(e) => setContactFormTemplate(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg font-mono text-sm"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowSettings(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button
                  onClick={saveConfig}
                  disabled={isSaving}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Configuration'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Prospects List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gray-400" />
              Prospect Pipeline
            </h2>
          </div>

          {prospects.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No prospects yet</h3>
              <p className="text-gray-500 mb-4">Import an Excel file to add prospects to your pipeline.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {prospects.map((prospect) => {
                const statusConfig = STATUS_CONFIG[prospect.status] || STATUS_CONFIG.new;
                const StatusIcon = statusConfig.icon;
                const isExpanded = expandedProspect === prospect.slug;
                const isProcessing = processingSlug === prospect.slug;

                return (
                  <div key={prospect._id} className="hover:bg-gray-50">
                    <div className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900 truncate">{prospect.instituteName}</h3>
                            <span className={`px-2 py-0.5 text-xs rounded-full flex items-center gap-1 ${statusConfig.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig.label}
                            </span>
                            {prospect.scrapedData?.scrapeQuality && (
                              <span className={`px-2 py-0.5 text-xs rounded-full ${
                                prospect.scrapedData.scrapeQuality === 'high' ? 'bg-green-100 text-green-700' :
                                prospect.scrapedData.scrapeQuality === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {prospect.scrapedData.scrapeQuality}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                            <span>{prospect.location}</span>
                            <span>•</span>
                            <span>{prospect.businessType}</span>
                            <span>•</span>
                            <a href={prospect.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline inline-flex items-center gap-1">
                              Website <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleScrape(prospect.slug)}
                            disabled={isProcessing}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50"
                            title="Scrape website"
                          >
                            {isProcessing && processingAction === 'scrape' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                          </button>

                          {prospect.scrapedData && (
                            <button
                              onClick={() => handleRescrapeAndRegenerate(prospect.slug)}
                              disabled={isProcessing}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50"
                              title="Re-scrape & regenerate showcase"
                            >
                              {isProcessing && processingAction === 'rescrape' ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                            </button>
                          )}

                          <button
                            onClick={() => handleGenerateShowcase(prospect.slug)}
                            disabled={isProcessing || !prospect.scrapedData}
                            className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg disabled:opacity-50"
                            title={prospect.scrapedData ? 'Generate showcase' : 'Scrape first'}
                          >
                            {isProcessing && processingAction === 'showcase' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => handlePreviewOutreach(prospect)}
                            disabled={isProcessing || !prospect.showcaseSlug}
                            className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg disabled:opacity-50"
                            title={prospect.showcaseSlug ? 'Preview outreach' : 'Create showcase first'}
                          >
                            {isProcessing && processingAction === 'outreach' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                          </button>

                          {prospect.showcaseSlug && (
                            <Link
                              href={`/showcase/${prospect.showcaseSlug}`}
                              target="_blank"
                              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"
                              title="View showcase"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          )}

                          <button
                            onClick={() => setExpandedProspect(isExpanded ? null : prospect.slug)}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Assessment</h4>
                              <div className="text-sm space-y-1">
                                <p><span className="text-gray-500">Services:</span> {prospect.services}</p>
                                <p><span className="text-gray-500">Size:</span> {prospect.estimatedSize}</p>
                                <p><span className="text-gray-500">Tech:</span> {prospect.techAssessment}</p>
                                <p><span className="text-gray-500">Solutions:</span> {prospect.potentialSolutions}</p>
                              </div>
                            </div>
                            {prospect.scrapedData && (
                              <>
                                <div>
                                  <h4 className="text-sm font-medium text-gray-700 mb-2">Contact Info</h4>
                                  <div className="text-sm space-y-1">
                                    <p><span className="text-gray-500">Email:</span> {prospect.scrapedData.email || 'Not found'}</p>
                                    <p><span className="text-gray-500">Phone:</span> {prospect.scrapedData.phone || 'Not found'}</p>
                                    {prospect.showcaseAccessCode && (
                                      <p><span className="text-gray-500">Access Code:</span> <code className="bg-gray-100 px-2 py-0.5 rounded">{prospect.showcaseAccessCode}</code></p>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-gray-700 mb-2">Scrape Stats</h4>
                                  <div className="text-sm space-y-1">
                                    <p><span className="text-gray-500">Pages:</span> {prospect.scrapedData.pagesScraped || 1}</p>
                                    <p><span className="text-gray-500">Images:</span> {prospect.scrapedData.images?.length || 0}</p>
                                    <p><span className="text-gray-500">Team:</span> {prospect.scrapedData.team?.length || 0}</p>
                                    <p><span className="text-gray-500">Programs:</span> {prospect.scrapedData.programs?.length || 0}</p>
                                    <p><span className="text-gray-500">Testimonials:</span> {prospect.scrapedData.testimonials?.length || 0}</p>
                                    <p><span className="text-gray-500">Video:</span> {prospect.scrapedData.youtube ? '✓' : '✗'}</p>
                                    {prospect.scrapedData.primaryColor && (
                                      <p className="flex items-center gap-2">
                                        <span className="text-gray-500">Color:</span>
                                        <span
                                          className="w-4 h-4 rounded border border-gray-200"
                                          style={{ backgroundColor: prospect.scrapedData.primaryColor }}
                                        />
                                        <code className="text-xs">{prospect.scrapedData.primaryColor}</code>
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                          {prospect.scrapedData?.team && prospect.scrapedData.team.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Team Members Found</h4>
                              <div className="flex flex-wrap gap-2">
                                {prospect.scrapedData.team.map((member, i) => (
                                  <div key={i} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full text-sm">
                                    {member.imageUrl && (
                                      <img src={member.imageUrl} alt={member.name} className="w-6 h-6 rounded-full object-cover" />
                                    )}
                                    <span>{member.name}</span>
                                    {member.role && <span className="text-gray-400 text-xs">({member.role})</span>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {prospect.scrapedData?.images && prospect.scrapedData.images.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Images Found ({prospect.scrapedData.images.length})</h4>
                              <div className="flex gap-2 overflow-x-auto pb-2">
                                {prospect.scrapedData.images.slice(0, 8).map((img, i) => (
                                  <div key={i} className="flex-shrink-0">
                                    <img
                                      src={img.url}
                                      alt={img.alt || `Image ${i+1}`}
                                      className="w-16 h-16 object-cover rounded border border-gray-200"
                                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                    />
                                    <div className="text-xs text-gray-400 text-center mt-1">{img.context}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Outreach Modal */}
      {showOutreachModal && outreachPreview && selectedProspect && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Outreach for {selectedProspect.instituteName}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Demo: {outreachPreview.showcaseUrl} • Code: {outreachPreview.accessCode}
                </p>
              </div>
              <button onClick={() => setShowOutreachModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email
                  </h3>
                  <button
                    onClick={() => copyToClipboard(`Subject: ${outreachPreview.emailSubject}\n\n${outreachPreview.emailBody}`)}
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 max-h-80 overflow-y-auto">
                  <p className="text-sm font-medium text-gray-700 mb-2">Subject: {outreachPreview.emailSubject}</p>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{outreachPreview.emailBody}</p>
                </div>
                {outreachPreview.recipientEmail && (
                  <p className="text-sm text-gray-500 mt-2">To: {outreachPreview.recipientEmail}</p>
                )}
                <button
                  onClick={handleSendEmail}
                  disabled={processingAction === 'sending'}
                  className="mt-3 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processingAction === 'sending' ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> Send Email</>}
                </button>
              </div>

              {/* Contact Form */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Contact Form Message
                  </h3>
                  <button
                    onClick={() => copyToClipboard(outreachPreview.contactFormMessage)}
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 max-h-80 overflow-y-auto">
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{outreachPreview.contactFormMessage}</p>
                </div>
                <div className="mt-3 flex gap-2">
                  <a
                    href={outreachPreview.contactFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" /> Open Contact Page
                  </a>
                  <button
                    onClick={handleLogContactForm}
                    className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark as Filled
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
