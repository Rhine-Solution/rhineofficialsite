'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Save, Copy, Check } from 'lucide-react';
import { BLOG_TEMPLATES, generateSlug, generateMetaDescription } from '../../../../lib/blog-templates';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://crqjedivobupxbbathux.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM'

export default function GenerateBlogPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(BLOG_TEMPLATES[0].id);
  const [title, setTitle] = useState('');
  const [placeholders, setPlaceholders] = useState({});
  const [generatedContent, setGeneratedContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const currentTemplate = BLOG_TEMPLATES.find(t => t.id === selectedTemplate);

  const updatePlaceholder = (key, value) => {
    setPlaceholders(prev => ({ ...prev, [key]: value }));
  };

  const generateContent = () => {
    let content = currentTemplate.structure;
    Object.entries(placeholders).forEach(([key, value]) => {
      content = content.replace(new RegExp(`\\[${key}\\]`, 'g'), value || `[${key}]`);
    });
    setGeneratedContent(content);
  };

  const handleSave = async () => {
    if (!title || !generatedContent) return;
    setSaving(true);
    
    // Get current user from localStorage (simplified) or use auth
    const slug = generateSlug(title);
    const excerpt = generateMetaDescription(generatedContent);
    
    const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        title,
        slug,
        content: generatedContent,
        excerpt,
        published: false,
        created_at: new Date().toISOString()
      })
    });
    
    setSaving(false);
    router.push('/admin/blog');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Blog Post Generator</h1>
      <p className="text-gray-500 dark:text-zinc-400 mb-6">Use templates to quickly create professional blog posts - no API required.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Template</label>
            <select value={selectedTemplate} onChange={e => { setSelectedTemplate(e.target.value); setPlaceholders({}); setGeneratedContent(''); }} className="w-full p-3 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700">
              {BLOG_TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Post Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter post title" className="w-full p-3 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700" />
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto p-1">
            <label className="block text-sm font-medium">Fill in Placeholders</label>
            {currentTemplate.placeholders.map(placeholder => (
              <input
                key={placeholder}
                type="text"
                placeholder={placeholder}
                value={placeholders[placeholder] || ''}
                onChange={e => updatePlaceholder(placeholder, e.target.value)}
                className="w-full p-3 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
              />
            ))}
          </div>
          
          <button onClick={generateContent} disabled={!title} className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
            <FileText size={18} />
            Generate Preview
          </button>
        </div>

        <div>
          {generatedContent ? (
            <div className="border rounded-lg p-4 dark:border-zinc-700">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">Preview</h3>
                <button onClick={copyToClipboard} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                  {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              </div>
              <div className="prose dark:prose-invert max-w-none max-h-96 overflow-y-auto p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg">
                <h1 className="text-xl font-bold mb-4">{title}</h1>
                <div style={{ whiteSpace: 'pre-wrap' }}>{generatedContent}</div>
              </div>
              <button onClick={handleSave} disabled={saving} className="mt-4 w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2">
                <Save size={18} />
                {saving ? 'Saving...' : 'Save as Draft'}
              </button>
            </div>
          ) : (
            <div className="border rounded-lg p-8 text-center text-gray-500 dark:text-zinc-400 dark:border-zinc-700">
              <FileText size={48} className="mx-auto mb-3 opacity-50" />
              <p>Fill in the form and click "Generate Preview" to see your post</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}