import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Camera, Mic, MessageSquare, Calendar, Upload, CheckCircle,
  X, Plus, Loader2, Video, Music
} from 'lucide-react';
import { STORY_TEMPLATES } from './GalleryHomeScreen';

type TabType = 'photo' | 'video' | 'voice' | 'message' | 'date';

const TABS: { id: TabType; label: string; emoji: string }[] = [
  { id: 'photo',   label: 'Photos',       emoji: '📷' },
  { id: 'video',   label: 'Videos',       emoji: '🎬' },
  { id: 'voice',   label: 'Voice Note',   emoji: '🎙️' },
  { id: 'message', label: 'Message',      emoji: '💬' },
  { id: 'date',    label: 'Memory Date',  emoji: '📅' },
];

// Accept string per tab
const ACCEPT: Record<TabType, string> = {
  photo:   'image/*',
  video:   'video/*',
  voice:   'audio/*',
  message: '',
  date:    '',
};

// ─── File preview card ────────────────────────────────────────────────────────
function FilePreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  const url = URL.createObjectURL(file);
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#fafafa] border border-black/6 shadow-sm">
      {isImage && <img src={url} alt="preview" className="w-full h-40 object-cover" />}
      {isVideo && (
        <div className="w-full h-40 bg-black/5 flex flex-col items-center justify-center gap-2 p-4">
          <Video className="w-8 h-8 text-[#8a7968]" />
          <span className="text-xs text-[#8a7968] font-medium text-center truncate w-full">{file.name}</span>
        </div>
      )}
      {!isImage && !isVideo && (
        <div className="w-full h-24 flex items-center justify-center gap-3 p-4">
          <Music className="w-6 h-6 text-[#d4a574]" />
          <span className="text-sm font-medium text-[#2d2520] truncate">{file.name}</span>
        </div>
      )}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
      >
        <X className="w-3.5 h-3.5 text-white" />
      </button>
    </div>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export function StoryUploadScreen() {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();

  // ✅ Single persistent ref — always in DOM, never inside a conditional
  const fileInputRef = useRef<HTMLInputElement>(null);

  const template = STORY_TEMPLATES.find((t) => t.id === templateId) ?? STORY_TEMPLATES[0];

  const [activeTab, setActiveTab] = useState<TabType>('photo');
  const [author, setAuthor]       = useState('');
  const [message, setMessage]     = useState('');
  const [memoryDate, setMemoryDate] = useState('');
  const [caption, setCaption]     = useState('');
  const [files, setFiles]         = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]     = useState(false);

  // ✅ Called from any click-to-upload area
  const openFilePicker = () => {
    if (fileInputRef.current) {
      // Update accept dynamically before opening
      fileInputRef.current.accept   = ACCEPT[activeTab];
      fileInputRef.current.multiple = activeTab === 'photo';
      // Reset so same file can be re-selected
      fileInputRef.current.value    = '';
      fileInputRef.current.click();
    }
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setFiles([]);  // clear files when switching tab type
  };

  const handleSubmit = async () => {
    if (!author.trim()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1800));
    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => navigate(`/gallery/${templateId}`), 2500);
  };

  // ─── Success state ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: template.bg }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <div
            className="w-24 h-24 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl"
            style={{ background: `linear-gradient(135deg, ${template.accent}, ${template.accent}aa)` }}
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-medium text-[#2d2520] mb-3">Memory Added! {template.emoji}</h2>
          <p className="text-[#8a7968] font-medium leading-relaxed">
            Your memory has been woven into the story.<br />Returning to your timeline…
          </p>
        </motion.div>
      </div>
    );
  }

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen font-light pb-24" style={{ background: template.bg }}>

      {/* ✅ Single hidden file input — always mounted, never inside a conditional */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFiles}
      />

      {/* Header */}
      <div
        className="sticky top-0 z-50 backdrop-blur-md border-b border-black/5"
        style={{ background: `${template.bg}ee` }}
      >
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(`/gallery/${templateId}`)}
            className="flex items-center gap-2 font-medium transition-colors"
            style={{ color: template.textAccent }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Story
          </button>
          <div className="flex items-center gap-2 text-sm font-semibold text-[#2d2520]">
            <span>{template.emoji}</span>
            <span>{template.label}</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-8">

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-light text-[#2d2520] mb-2">Add a Memory</h1>
          <p className="text-[#8a7968] font-medium">
            Share a photo, voice note, video, or heartfelt message to this story.
          </p>
        </motion.div>

        {/* Tab selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap text-sm font-semibold transition-all flex-shrink-0"
              style={
                activeTab === tab.id
                  ? { background: template.accent, color: '#ffffff', boxShadow: `0 4px 14px ${template.accent}30` }
                  : { background: '#ffffff', color: '#8a7968', border: '1px solid rgba(0,0,0,0.06)' }
              }
            >
              <span>{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Card */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="rounded-3xl p-7 mb-6"
          style={{
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          }}
        >
          {/* Author — always visible */}
          <div className="mb-6">
            <label
              className="text-xs font-bold uppercase tracking-wider mb-2 block"
              style={{ color: template.textAccent }}
            >
              Your Name
            </label>
            <input
              type="text"
              placeholder="How should they remember you by?"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl text-sm font-medium outline-none placeholder:text-[#8a7968]/50"
              style={{
                background: '#fafafa',
                border: `1.5px solid ${author ? template.accent : 'rgba(0,0,0,0.08)'}`,
                color: '#2d2520',
                transition: 'border-color 0.2s',
              }}
            />
          </div>

          {/* ── PHOTO ── */}
          {activeTab === 'photo' && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider mb-3 block" style={{ color: template.textAccent }}>
                Upload Photos
              </label>

              {files.length === 0 ? (
                /* Drop zone */
                <button
                  type="button"
                  onClick={openFilePicker}
                  className="w-full border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all hover:opacity-80 focus:outline-none"
                  style={{ borderColor: `${template.accent}60`, background: template.accentLight }}
                >
                  <Upload className="w-10 h-10 mx-auto mb-3" style={{ color: template.accent }} />
                  <p className="font-semibold text-[#2d2520] mb-1">Tap to choose photos</p>
                  <p className="text-xs text-[#8a7968] font-medium">JPG, PNG, HEIC — multiple allowed</p>
                </button>
              ) : (
                /* Preview grid */
                <div className="grid grid-cols-2 gap-3">
                  {files.map((f, i) => (
                    <FilePreview key={i} file={f} onRemove={() => removeFile(i)} />
                  ))}
                  {/* Add more */}
                  <button
                    type="button"
                    onClick={openFilePicker}
                    className="h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:opacity-80"
                    style={{ borderColor: `${template.accent}60`, background: template.accentLight }}
                  >
                    <Plus className="w-8 h-8" style={{ color: template.accent }} />
                    <span className="text-xs font-semibold" style={{ color: template.textAccent }}>Add more</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── VIDEO ── */}
          {activeTab === 'video' && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider mb-3 block" style={{ color: template.textAccent }}>
                Upload Video
              </label>

              {files.length === 0 ? (
                <button
                  type="button"
                  onClick={openFilePicker}
                  className="w-full border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all hover:opacity-80 focus:outline-none"
                  style={{ borderColor: `${template.accent}60`, background: template.accentLight }}
                >
                  <Video className="w-10 h-10 mx-auto mb-3" style={{ color: template.accent }} />
                  <p className="font-semibold text-[#2d2520] mb-1">Tap to choose a video</p>
                  <p className="text-xs text-[#8a7968] font-medium">MP4, MOV — up to 100 MB</p>
                </button>
              ) : (
                <div className="space-y-3">
                  {files.map((f, i) => (
                    <FilePreview key={i} file={f} onRemove={() => removeFile(i)} />
                  ))}
                  <button
                    type="button"
                    onClick={openFilePicker}
                    className="w-full py-3 rounded-2xl border border-dashed text-sm font-semibold transition-all hover:opacity-80"
                    style={{ borderColor: `${template.accent}60`, color: template.textAccent, background: template.accentLight }}
                  >
                    + Replace video
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── VOICE NOTE ── */}
          {activeTab === 'voice' && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider mb-3 block" style={{ color: template.textAccent }}>
                Voice Recording
              </label>

              {files.length === 0 ? (
                <button
                  type="button"
                  onClick={openFilePicker}
                  className="w-full border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all hover:opacity-80 focus:outline-none"
                  style={{ borderColor: `${template.accent}60`, background: template.accentLight }}
                >
                  <Mic className="w-12 h-12 mx-auto mb-3" style={{ color: template.accent }} />
                  <p className="font-semibold text-[#2d2520] mb-1">Tap to upload your voice note</p>
                  <p className="text-xs text-[#8a7968] font-medium">MP3, WAV, M4A — up to 5 minutes</p>
                </button>
              ) : (
                <div className="space-y-3">
                  {files.map((f, i) => (
                    <FilePreview key={i} file={f} onRemove={() => removeFile(i)} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── EMOTIONAL MESSAGE ── */}
          {activeTab === 'message' && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider mb-3 block" style={{ color: template.textAccent }}>
                Your Emotional Message
              </label>
              <textarea
                rows={6}
                placeholder="Write from your heart — this message will be preserved forever in this story..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl text-sm font-medium outline-none resize-none placeholder:text-[#8a7968]/50 leading-relaxed"
                style={{
                  background: '#fafafa',
                  border: `1.5px solid ${message ? template.accent : 'rgba(0,0,0,0.08)'}`,
                  color: '#2d2520',
                  transition: 'border-color 0.2s',
                }}
              />
              <p className="text-right text-xs text-[#8a7968] font-medium mt-1">{message.length} characters</p>
            </div>
          )}

          {/* ── MEMORY DATE ── */}
          {activeTab === 'date' && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider mb-3 block" style={{ color: template.textAccent }}>
                When did this moment happen?
              </label>
              <input
                type="date"
                value={memoryDate}
                onChange={(e) => setMemoryDate(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl text-sm font-medium outline-none"
                style={{
                  background: '#fafafa',
                  border: `1.5px solid ${memoryDate ? template.accent : 'rgba(0,0,0,0.08)'}`,
                  color: '#2d2520',
                  transition: 'border-color 0.2s',
                }}
              />
              <p className="text-xs text-[#8a7968] font-medium mt-2">
                This date will appear on the story timeline.
              </p>
            </div>
          )}

          {/* Caption (media tabs only) */}
          {(activeTab === 'photo' || activeTab === 'video' || activeTab === 'voice') && (
            <div className="mt-5">
              <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: template.textAccent }}>
                Caption / Note
              </label>
              <input
                type="text"
                placeholder="Add an emotional caption or note..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl text-sm font-medium outline-none placeholder:text-[#8a7968]/50"
                style={{
                  background: '#fafafa',
                  border: '1.5px solid rgba(0,0,0,0.08)',
                  color: '#2d2520',
                }}
              />
            </div>
          )}
        </motion.div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting || !author.trim()}
          className="w-full py-5 rounded-2xl text-white font-semibold text-base flex items-center justify-center gap-3 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 mb-4"
          style={{
            background: `linear-gradient(135deg, ${template.accent}, ${template.accent}bb)`,
            boxShadow: `0 8px 24px ${template.accent}30`,
          }}
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving to story…
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Add to {template.label} Story
            </>
          )}
        </button>
        <p className="text-center text-xs text-[#8a7968] font-medium pb-8">
          This memory will appear in the story timeline
        </p>
      </div>
    </div>
  );
}
