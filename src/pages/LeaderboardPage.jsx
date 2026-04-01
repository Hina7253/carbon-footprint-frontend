import { useState, useEffect } from 'react'
import { getLeaderboard } from '../api/carbonApi'

export default function LeaderboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('cleanest')

  useEffect(() => {
    getLeaderboard()
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const gradeColor = (g) => {
    const colors = {
      A:'#16a34a',B:'#65a30d',
      C:'#d97706',D:'#ea580c',F:'#dc2626'
    }
    return colors[g] || '#6b7280'
  }

  const items = data
    ? (tab === 'cleanest'
        ? data.cleanest
        : data.dirtiest)
    : []

  return (
    <div style={{
      maxWidth:'900px',
      margin:'0 auto',
      padding:'30px 20px'
    }}>
      <h1 style={{
        color:'#14532d',
        fontSize:'28px',
        fontWeight:'bold',
        marginBottom:'8px'
      }}>
        🏆 Leaderboard
      </h1>
      <p style={{color:'#6b7280',marginBottom:'24px'}}>
        Top analyzed websites by carbon footprint
      </p>

      {/* Stats */}
      {data && (
        <div style={{
          display:'grid',
          gridTemplateColumns:'1fr 1fr',
          gap:'16px',
          marginBottom:'24px'
        }}>
          <div style={{
            background:'white',
            borderRadius:'12px',
            padding:'20px',
            textAlign:'center',
            boxShadow:'0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <p style={{
              fontSize:'28px',
              fontWeight:'bold',
              color:'#14532d'
            }}>
              {data.totalAnalyzed}
            </p>
            <p style={{color:'#6b7280',fontSize:'14px'}}>
              Total Websites Analyzed
            </p>
          </div>
          <div style={{
            background:'white',
            borderRadius:'12px',
            padding:'20px',
            textAlign:'center',
            boxShadow:'0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <p style={{
              fontSize:'28px',
              fontWeight:'bold',
              color:'#14532d'
            }}>
              {data.averageCo2Grams
                ? data.averageCo2Grams.toFixed(4) + 'g'
                : 'N/A'}
            </p>
            <p style={{color:'#6b7280',fontSize:'14px'}}>
              Average CO₂ Per Visit
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{
        display:'flex',
        gap:'8px',
        marginBottom:'20px'
      }}>
        {[
          {id:'cleanest',label:'🌿 Cleanest Sites'},
          {id:'dirtiest',label:'🔥 Dirtiest Sites'}
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding:'10px 24px',
              borderRadius:'8px',
              border:'none',
              cursor:'pointer',
              fontWeight: tab===t.id ? 'bold' : 'normal',
              background: tab===t.id ? '#16a34a' : 'white',
              color: tab===t.id ? 'white' : '#374151',
              boxShadow:'0 2px 4px rgba(0,0,0,0.1)'
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div style={{textAlign:'center',padding:'40px'}}>
          <p style={{color:'#14532d',fontSize:'18px'}}>
            🌿 Loading...
          </p>
        </div>
      ) : items && items.length > 0 ? (
        items.map((site, i) => (
          <div key={i} style={{
            background:'white',
            borderRadius:'12px',
            padding:'20px',
            marginBottom:'12px',
            display:'flex',
            justifyContent:'space-between',
            alignItems:'center',
            boxShadow:'0 2px 8px rgba(0,0,0,0.06)',
            flexWrap:'wrap',
            gap:'12px'
          }}>
            <div style={{
              display:'flex',
              alignItems:'center',
              gap:'16px',
              flex:1
            }}>
              {/* Rank */}
              <div style={{
                width:'40px',
                height:'40px',
                background: i===0
                  ? '#fbbf24'
                  : i===1
                  ? '#9ca3af'
                  : i===2
                  ? '#d97706'
                  : '#f3f4f6',
                borderRadius:'50%',
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                fontWeight:'bold',
                fontSize:'16px',
                color: i < 3 ? 'white' : '#374151',
                flexShrink:0
              }}>
                {i===0 ? '🥇' : i===1 ? '🥈' : i===2
                  ? '🥉' : i+1}
              </div>

              <div>
                <p style={{
                  fontWeight:'bold',
                  color:'#1f2937',
                  marginBottom:'4px',
                  wordBreak:'break-all'
                }}>
                  {site.websiteUrl}
                </p>
                <div style={{
                  display:'flex',
                  gap:'12px',
                  flexWrap:'wrap'
                }}>
                  <span style={{
                    fontSize:'12px',
                    color:'#6b7280'
                  }}>
                    🌱 {site.co2PerVisitGrams
                      ? site.co2PerVisitGrams.toFixed(4)+'g'
                      : 'N/A'} CO₂/visit
                  </span>
                  <span style={{
                    fontSize:'12px',
                    color:'#6b7280'
                  }}>
                    📅 {site.co2YearlyKg
                      ? site.co2YearlyKg.toFixed(2)+'kg'
                      : 'N/A'}/year
                  </span>
                  <span style={{
                    fontSize:'12px',
                    background: tab==='cleanest'
                      ? '#dcfce7' : '#fee2e2',
                    color: tab==='cleanest'
                      ? '#16a34a' : '#dc2626',
                    padding:'2px 8px',
                    borderRadius:'4px'
                  }}>
                    {site.performanceCategory}
                  </span>
                </div>
              </div>
            </div>

            {/* Grade */}
            <div style={{
              width:'50px',
              height:'50px',
              borderRadius:'50%',
              background: gradeColor(site.grade),
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              fontSize:'22px',
              fontWeight:'bold',
              color:'white'
            }}>
              {site.grade || '?'}
            </div>
          </div>
        ))
      ) : (
        <div style={{
          textAlign:'center',
          padding:'60px',
          background:'white',
          borderRadius:'16px'
        }}>
          <p style={{fontSize:'40px'}}>🌱</p>
          <p style={{color:'#374151',marginTop:'12px'}}>
            No data yet — analyze some websites first!
          </p>
        </div>
      )}
    </div>
  )
}
