import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getNews } from '../api.js';

export default function BlogPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNews({ limit: 30 })
      .then((res) => setArticles(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet><title>Intel Feed — WarScope</title></Helmet>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="label text-war-red mb-2">Intelligence Feed</div>
        <h1 className="font-display text-5xl text-war-text mb-10">LATEST INTEL</h1>

        {loading ? (
          <div className="font-mono text-xs text-war-muted animate-pulse tracking-widest">LOADING...</div>
        ) : (
          <div className="grid gap-6">
            {articles.length === 0 && (
              <div className="font-mono text-xs text-war-muted">No articles found.</div>
            )}
            {articles.map((a) => (
              <Link
                key={a.id}
                to={`/blog/${a.slug}`}
                className="panel p-6 hover:border-war-red/30 transition-colors group"
              >
                {a.conflict_name && (
                  <div className="label text-war-red mb-2">{a.conflict_name}</div>
                )}
                <h2 className="font-display text-2xl text-war-text group-hover:text-war-red transition-colors mb-2">
                  {a.title}
                </h2>
                {a.summary && (
                  <p className="text-war-muted text-sm leading-relaxed line-clamp-2 mb-3">{a.summary}</p>
                )}
                <div className="font-mono text-xs text-war-muted">
                  {a.source_name && <span>{a.source_name} · </span>}
                  {a.published_at && (
                    <span>{new Date(a.published_at).toLocaleDateString()}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
