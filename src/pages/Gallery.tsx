import { useState, useEffect } from 'react';
import {
  fetchArtworks,
  fetchArtCategories,
  createArtwork,
  likeArtwork,
  fetchComments,
  addComment,
  fetchRanking,
} from '@/services/galleryApi';
import type { Artwork, Comment, ArtCategory } from '@/types/fan';
import {
  Heart,
  MessageCircle,
  Upload,
  X,
  Loader2,
  Image as ImageIcon,
  Send,
  Trophy,
  Crown,
  Medal,
  Flame,
  Palette,
  Filter,
} from 'lucide-react';

type TabKey = 'gallery' | 'ranking';

export default function Gallery() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [ranking, setRanking] = useState<Artwork[]>([]);
  const [categories, setCategories] = useState<{ value: ArtCategory; label: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ArtCategory | 'all'>('all');
  const [activeTab, setActiveTab] = useState<TabKey>('gallery');
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [expandedArt, setExpandedArt] = useState<string | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({});
  const [likedSet, setLikedSet] = useState<Set<string>>(new Set());
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadAuthor, setUploadAuthor] = useState('');
  const [uploadCategory, setUploadCategory] = useState<ArtCategory>('calligraphy');
  const [uploadImage, setUploadImage] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadArtworks();
  }, [selectedCategory]);

  async function loadData() {
    setLoading(true);
    try {
      const [cats, arts, rank] = await Promise.all([
        fetchArtCategories(),
        fetchArtworks(),
        fetchRanking(10),
      ]);
      setCategories(cats);
      setArtworks(arts);
      setRanking(rank);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadArtworks() {
    try {
      const arts = await fetchArtworks(selectedCategory === 'all' ? undefined : selectedCategory);
      setArtworks(arts);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleLike(id: string) {
    if (likedSet.has(id)) return;
    try {
      const updated = await likeArtwork(id);
      setLikedSet((prev) => new Set(prev).add(id));
      setArtworks((prev) => prev.map((a) => (a.id === id ? { ...a, likes: updated.likes } : a)));
      setRanking((prev) => prev.map((a) => (a.id === id ? { ...a, likes: updated.likes } : a)).sort((a, b) => b.likes - a.likes));
    } catch (err) {
      console.error(err);
    }
  }

  async function handleExpandComments(artworkId: string) {
    if (expandedArt === artworkId) {
      setExpandedArt(null);
      return;
    }
    setExpandedArt(artworkId);
    if (!commentsMap[artworkId]) {
      try {
        const cmts = await fetchComments(artworkId);
        setCommentsMap((prev) => ({ ...prev, [artworkId]: cmts }));
      } catch (err) {
        console.error(err);
      }
    }
  }

  async function handleSubmitComment(artworkId: string) {
    if (!commentAuthor.trim() || !commentContent.trim()) return;
    setSubmittingComment(true);
    try {
      const newComment = await addComment(artworkId, commentAuthor.trim(), commentContent.trim());
      setCommentsMap((prev) => ({
        ...prev,
        [artworkId]: [newComment, ...(prev[artworkId] || [])],
      }));
      setArtworks((prev) =>
        prev.map((a) => (a.id === artworkId ? { ...a, commentCount: a.commentCount + 1 } : a))
      );
      setCommentContent('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingComment(false);
    }
  }

  async function handleUpload() {
    if (!uploadTitle.trim() || !uploadAuthor.trim() || !uploadImage.trim() || !uploadDesc.trim()) return;
    setUploading(true);
    try {
      const newArt = await createArtwork({
        title: uploadTitle.trim(),
        author: uploadAuthor.trim(),
        category: uploadCategory,
        image: uploadImage.trim(),
        description: uploadDesc.trim(),
      });
      setArtworks((prev) => [newArt, ...prev]);
      setShowUpload(false);
      setUploadTitle('');
      setUploadAuthor('');
      setUploadCategory('calligraphy');
      setUploadImage('');
      setUploadDesc('');
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-paper-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-vermilion-500 animate-spin mx-auto mb-4" />
          <p className="text-ink-500 font-serif-sc">扇面画廊加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-50">
      <section className="pt-28 pb-12 md:pt-36 md:pb-16 bg-gradient-to-b from-vermilion-500/5 to-transparent">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-12 h-px bg-gold-400" />
            <span className="text-gold-500 font-serif-sc text-sm tracking-widest">扇面丹青</span>
            <span className="w-12 h-px bg-gold-400" />
          </div>
          <h1 className="font-serif-sc text-4xl md:text-6xl font-bold text-ink-800 mb-4">
            扇面艺术展示
          </h1>
          <p className="text-ink-500 max-w-2xl mx-auto mb-8">
            书法扇面、山水扇面、花鸟扇面……方寸之间，尽显笔墨之美。上传您的扇面设计，与同好共赏交流。
          </p>
          <button
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-vermilion-500 text-white font-serif-sc rounded-xl hover:bg-vermilion-600 transition-colors shadow-lg shadow-vermilion-500/20"
          >
            <Upload size={18} />
            上传扇面作品
          </button>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-serif-sc text-sm transition-all ${
                  activeTab === 'gallery'
                    ? 'bg-vermilion-500 text-white shadow-md'
                    : 'bg-white text-ink-600 border border-paper-200 hover:border-vermilion-300'
                }`}
              >
                <Palette size={16} />
                作品展厅
              </button>
              <button
                onClick={() => setActiveTab('ranking')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-serif-sc text-sm transition-all ${
                  activeTab === 'ranking'
                    ? 'bg-vermilion-500 text-white shadow-md'
                    : 'bg-white text-ink-600 border border-paper-200 hover:border-vermilion-300'
                }`}
              >
                <Trophy size={16} />
                热度排行
              </button>
            </div>

            {activeTab === 'gallery' && (
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-ink-400" />
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      selectedCategory === 'all'
                        ? 'bg-vermilion-100 text-vermilion-600 border border-vermilion-200'
                        : 'bg-paper-100 text-ink-500 border border-paper-200 hover:border-vermilion-200'
                    }`}
                  >
                    全部
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        selectedCategory === cat.value
                          ? 'bg-vermilion-100 text-vermilion-600 border border-vermilion-200'
                          : 'bg-paper-100 text-ink-500 border border-paper-200 hover:border-vermilion-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {activeTab === 'gallery' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {artworks.map((art, index) => (
                <ArtworkCard
                  key={art.id}
                  artwork={art}
                  index={index}
                  isLiked={likedSet.has(art.id)}
                  isExpanded={expandedArt === art.id}
                  comments={commentsMap[art.id] || []}
                  commentAuthor={commentAuthor}
                  commentContent={commentContent}
                  submittingComment={submittingComment}
                  onLike={() => handleLike(art.id)}
                  onExpand={() => handleExpandComments(art.id)}
                  onAuthorChange={setCommentAuthor}
                  onContentChange={setCommentContent}
                  onSubmitComment={() => handleSubmitComment(art.id)}
                />
              ))}
              {artworks.length === 0 && (
                <div className="col-span-full text-center py-20">
                  <ImageIcon className="w-16 h-16 text-paper-400 mx-auto mb-4" />
                  <p className="text-ink-500 font-serif-sc text-lg">暂无此分类的扇面作品</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ranking' && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl shadow-elegant overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-gold-400 to-gold-500">
                  <div className="flex items-center gap-3">
                    <Crown className="w-8 h-8 text-white" />
                    <div>
                      <h3 className="font-serif-sc text-2xl font-bold text-white">扇面热度排行榜</h3>
                      <p className="text-gold-100 text-sm">根据点赞数实时排序</p>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-paper-100">
                  {ranking.map((art, index) => (
                    <div
                      key={art.id}
                      className="flex items-center gap-4 p-5 hover:bg-paper-50 transition-colors"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-serif-sc font-bold text-lg shrink-0 ${
                          index === 0
                            ? 'bg-gradient-to-br from-gold-300 to-gold-500 text-white'
                            : index === 1
                            ? 'bg-gradient-to-br from-ink-200 to-ink-400 text-white'
                            : index === 2
                            ? 'bg-gradient-to-br from-vermilion-300 to-vermilion-500 text-white'
                            : 'bg-paper-100 text-ink-400'
                        }`}
                      >
                        {index < 3 ? (
                          index === 0 ? <Crown size={18} /> : index === 1 ? <Medal size={18} /> : <Medal size={18} />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <img
                        src={art.image}
                        alt={art.title}
                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif-sc font-bold text-ink-800 truncate">{art.title}</h4>
                        <p className="text-sm text-ink-400">
                          {art.author} · {art.categoryName}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-vermilion-500 shrink-0">
                        <Flame size={16} />
                        <span className="font-bold">{art.likes}</span>
                      </div>
                    </div>
                  ))}
                  {ranking.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-ink-400 font-serif-sc">暂无排行数据</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-800/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-elegant-hover w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-paper-200">
              <h3 className="font-serif-sc text-xl font-bold text-ink-800">上传扇面作品</h3>
              <button
                onClick={() => setShowUpload(false)}
                className="p-2 text-ink-400 hover:text-ink-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-1.5">作品标题</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="请输入作品标题"
                  className="w-full px-4 py-2.5 bg-paper-50 border border-paper-200 rounded-xl text-ink-800 placeholder-ink-300 outline-none focus:border-vermilion-400 focus:ring-2 focus:ring-vermilion-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-1.5">作者</label>
                <input
                  type="text"
                  value={uploadAuthor}
                  onChange={(e) => setUploadAuthor(e.target.value)}
                  placeholder="请输入您的名称"
                  className="w-full px-4 py-2.5 bg-paper-50 border border-paper-200 rounded-xl text-ink-800 placeholder-ink-300 outline-none focus:border-vermilion-400 focus:ring-2 focus:ring-vermilion-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-1.5">作品分类</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as ArtCategory)}
                  className="w-full px-4 py-2.5 bg-paper-50 border border-paper-200 rounded-xl text-ink-800 outline-none focus:border-vermilion-400 focus:ring-2 focus:ring-vermilion-100 transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-1.5">作品图片链接</label>
                <input
                  type="text"
                  value={uploadImage}
                  onChange={(e) => setUploadImage(e.target.value)}
                  placeholder="请输入图片URL地址"
                  className="w-full px-4 py-2.5 bg-paper-50 border border-paper-200 rounded-xl text-ink-800 placeholder-ink-300 outline-none focus:border-vermilion-400 focus:ring-2 focus:ring-vermilion-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-1.5">作品介绍</label>
                <textarea
                  value={uploadDesc}
                  onChange={(e) => setUploadDesc(e.target.value)}
                  placeholder="请输入作品介绍"
                  rows={4}
                  className="w-full px-4 py-2.5 bg-paper-50 border border-paper-200 rounded-xl text-ink-800 placeholder-ink-300 outline-none focus:border-vermilion-400 focus:ring-2 focus:ring-vermilion-100 transition-all resize-none"
                />
              </div>
              <button
                onClick={handleUpload}
                disabled={uploading || !uploadTitle.trim() || !uploadAuthor.trim() || !uploadImage.trim() || !uploadDesc.trim()}
                className="w-full py-3 bg-vermilion-500 text-white font-serif-sc rounded-xl hover:bg-vermilion-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    上传中...
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    发布作品
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ArtworkCard({
  artwork,
  index,
  isLiked,
  isExpanded,
  comments,
  commentAuthor,
  commentContent,
  submittingComment,
  onLike,
  onExpand,
  onAuthorChange,
  onContentChange,
  onSubmitComment,
}: {
  artwork: Artwork;
  index: number;
  isLiked: boolean;
  isExpanded: boolean;
  comments: Comment[];
  commentAuthor: string;
  commentContent: string;
  submittingComment: boolean;
  onLike: () => void;
  onExpand: () => void;
  onAuthorChange: (v: string) => void;
  onContentChange: (v: string) => void;
  onSubmitComment: () => void;
}) {
  const animDelay = `${index * 0.08}s`;

  return (
    <div
      className="bg-white rounded-2xl shadow-elegant overflow-hidden transition-all duration-500 hover:shadow-elegant-hover hover:-translate-y-1 opacity-0 animate-fade-in-up"
      style={{ animationDelay: animDelay, animationFillMode: 'forwards' }}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={artwork.image}
          alt={artwork.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-vermilion-500/90 backdrop-blur-sm text-white text-sm font-serif-sc rounded-full">
            {artwork.categoryName}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-serif-sc text-lg font-bold text-ink-800 mb-1.5">{artwork.title}</h3>
        <p className="text-sm text-ink-400 mb-3">
          {artwork.author} · {formatDate(artwork.createdAt)}
        </p>
        <p className="text-sm text-ink-500 leading-relaxed mb-4 line-clamp-2">{artwork.description}</p>

        <div className="flex items-center gap-4">
          <button
            onClick={onLike}
            className={`flex items-center gap-1.5 text-sm transition-all ${
              isLiked ? 'text-vermilion-500' : 'text-ink-400 hover:text-vermilion-500'
            }`}
          >
            <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
            <span>{artwork.likes}</span>
          </button>
          <button
            onClick={onExpand}
            className={`flex items-center gap-1.5 text-sm transition-all ${
              isExpanded ? 'text-vermilion-500' : 'text-ink-400 hover:text-vermilion-500'
            }`}
          >
            <MessageCircle size={18} />
            <span>{artwork.commentCount}</span>
          </button>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-paper-200 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {comments.length === 0 && (
                <p className="text-sm text-ink-400 text-center py-2">暂无评论，快来抢沙发~</p>
              )}
              {comments.map((cmt) => (
                <div key={cmt.id} className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-vermilion-100 text-vermilion-600 flex items-center justify-center text-xs font-bold shrink-0">
                    {cmt.author.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-ink-700">{cmt.author}</span>
                      <span className="text-xs text-ink-300">{formatDate(cmt.createdAt)}</span>
                    </div>
                    <p className="text-sm text-ink-500">{cmt.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2.5">
              <input
                type="text"
                value={commentAuthor}
                onChange={(e) => onAuthorChange(e.target.value)}
                placeholder="您的名称"
                className="w-full px-3 py-2 bg-paper-50 border border-paper-200 rounded-lg text-sm text-ink-800 placeholder-ink-300 outline-none focus:border-vermilion-300 transition-colors"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentContent}
                  onChange={(e) => onContentChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && commentAuthor.trim() && commentContent.trim()) {
                      onSubmitComment();
                    }
                  }}
                  placeholder="写评论..."
                  className="flex-1 px-3 py-2 bg-paper-50 border border-paper-200 rounded-lg text-sm text-ink-800 placeholder-ink-300 outline-none focus:border-vermilion-300 transition-colors"
                />
                <button
                  onClick={onSubmitComment}
                  disabled={submittingComment || !commentAuthor.trim() || !commentContent.trim()}
                  className="p-2 bg-vermilion-500 text-white rounded-lg hover:bg-vermilion-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {submittingComment ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}
