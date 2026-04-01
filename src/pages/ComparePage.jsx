import { useState } from 'react'
import { compareWebsites } from '../api/carbonApi'

export default function ComparePage() {
  const [url1, setUrl1] = useState('')
  const [url2, setUrl2] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCompare = async () => {
    if (!url1 || !url2) {
      setError('Please enter both URLs')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await compareWebsites(url1, url2)
      setResult(res.data)
    } catch (err) {
      setError('Comparison failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const gradeColor = (g) => {
    const colors = {
      A:'#16a34a',B:'#65a30d',
      C:'#d97706',D:'#ea580c',F:'#dc2626'
    }
    return colors[g] || '#6b7280'
  }

  return (
    <div style={{
      maxWidth:'1000px',
      margin:'0 auto',
      padding:'30px 20px'
    }}>
      <h1 style={{
        color:'#14532d',
        fontSize:'28px',
        fontWeight:'bold',
        marginBottom:'8px'
      }}>
        ⚖️ Compare Websites
      </h1>
      <p style={{color:'#6b7280',marginBottom:'24px'}}>
        Compare carbon footprint of 2 websites side by side
      </p>

      {/* Input Section */}
      <div style={{
        background:'white',
        borderRadius:'16px',
        padding:'30px',
        marginBottom:'24px',
        boxShadow:'0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <div style={{
          display:'grid',
          gridTemplateColumns:'1fr auto 1fr',
          gap:'16px',
          alignItems:'end',
          marginBottom:'16px'
        }}>
          <div>
            <label style={{
              display:'block',
              fontSize:'13px',
              color:'#6b7280',
              marginBottom:'6px',
              fontWeight:'bold'
            }}>
              WEBSITE 1
            </label>
            <input
              type="text"
              placeholder="https://amazon.com"
              value={url1}
              onChange={e => setUrl1(e.target.value)}
              style={{
                width:'100%',
                padding:'14px',
                border:'2px solid #e5e7eb',
                borderRadius:'8px',
                fontSize:'15px',
                outline:'none'
              }}
            />
          </div>

          <div style={{
            textAlign:'center',
            fontSize:'24px',
            paddingBottom:'8px'
          }}>
            VS
          </div>

          <div>
            <label style={{
              display:'block',
              fontSize:'13px',
              color:'#6b7280',
              marginBottom:'6px',
              fontWeight:'bold'
            }}>
              WEBSITE 2
            </label>
            <input
              type="text"
              placeholder="https://flipkart.com"
              value={url2}
              onChange={e => setUrl2(e.target.value)}
              style={{
                width:'100%',
                padding:'14px',
                border:'2px solid #e5e7eb',
                borderRadius:'8px',
                fontSize:'15px',
                outline:'none'
              }}
            />
          </div>
        </div>

        {error && (
          <p style={{
            color:'#dc2626',
            marginBottom:'12px',
            fontSize:'14px'
          }}>
            ⚠️ {error}
          </p>
        )}

        <button
          onClick={handleCompare}
          disabled={loading}
          style={{
            width:'100%',
            padding:'16px',
            background: loading ? '#86efac' : '#16a34a',
            color:'white',
            border:'none',
            borderRadius:'8px',
            fontSize:'16px',
            fontWeight:'bold',
            cursor: loading ? 'wait' : 'pointer'
          }}>
          {loading
            ? '🔄 Comparing Websites...'
            : '⚖️ Compare Now'}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div>
          {/* Winner Banner */}
          <div style={{
            background:'linear-gradient(135deg,#052e16,#14532d)',
            borderRadius:'16px',
            padding:'24px',
            textAlign:'center',
            marginBottom:'20px',
            color:'white'
          }}>
            <p style={{
              color:'#86efac',
              fontSize:'14px',
              marginBottom:'8px'
            }}>
              🏆 WINNER
            </p>
            <h2 style={{
              fontSize:'22px',
              fontWeight:'bold',
              marginBottom:'8px'
            }}>
              {result.winner === 'tie'
                ? "🤝 It's a Tie!"
                : result.winner}
            </h2>
            <p style={{color:'#86efac',fontSize:'14px'}}>
              {result.verdict}
            </p>
          </div>

          {/* Side by Side */}
          <div style={{
            display:'grid',
            gridTemplateColumns:'1fr 1fr',
            gap:'16px'
          }}>
            {[result.site1, result.site2].map((site, i) => (
              <div key={i} style={{
                background:'white',
                borderRadius:'12px',
                padding:'24px',
                boxShadow:'0 2px 8px rgba(0,0,0,0.06)',
                border: result.winner === site?.websiteUrl
                  ? '3px solid #16a34a'
                  : '1px solid #e5e7eb'
              }}>
                {result.winner === site?.websiteUrl && (
                  <div style={{
                    background:'#16a34a',
                    color:'white',
                    padding:'4px 12px',
                    borderRadius:'20px',
                    fontSize:'12px',
                    display:'inline-block',
                    marginBottom:'12px'
                  }}>
                    🏆 WINNER
                  </div>
                )}

                <h3 style={{
                  fontWeight:'bold',
                  marginBottom:'16px',
                  wordBreak:'break-all',
                  fontSize:'15px',
                  color:'#1f2937'
                }}>
                  {site?.websiteUrl}
                </h3>

                {/* Grade */}
                <div style={{
                  textAlign:'center',
                  marginBottom:'16px'
                }}>
                  <div style={{
                    width:'60px',
                    height:'60px',
                    borderRadius:'50%',
                    background: gradeColor(site?.grade),
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    fontSize:'28px',
                    fontWeight:'bold',
                    color:'white',
                    margin:'0 auto 8px'
                  }}>
                    {site?.grade || '?'}
                  </div>
                  <p style={{
                    fontSize:'12px',
                    color:'#6b7280'
                  }}>
                    Carbon Grade
                  </p>
                </div>

                {/* Stats */}
                {[
                  {
                    label:'CO₂/visit',
                    value: site?.carbonMetrics
                      ?.co2PerVisitGrams + 'g'
                  },
                  {
                    label:'Annual CO₂',
                    value: site?.carbonMetrics
                      ?.co2YearlyKg + ' kg'
                  },
                  {
                    label:'Page Size',
                    value: site?.resourceSummary
                      ?.totalTransferFormatted
                  },
                  {
                    label:'Resources',
                    value: site?.resourceSummary
                      ?.totalResourceCount
                  }
                ].map((s, j) => (
                  <div key={j} style={{
                    display:'flex',
                    justifyContent:'space-between',
                    padding:'8px 0',
                    borderBottom:'1px solid #f3f4f6'
                  }}>
                    <span style={{
                      fontSize:'13px',
                      color:'#6b7280'
                    }}>
                      {s.label}
                    </span>
                    <span style={{
                      fontSize:'13px',
                      fontWeight:'bold',
                      color:'#1f2937'
                    }}>
                      {s.value || 'N/A'}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Difference */}
          {result.difference && (
            <div style={{
              background:'#eff6ff',
              borderRadius:'12px',
              padding:'20px',
              marginTop:'16px'
            }}>
              <h3 style={{
                fontWeight:'bold',
                color:'#1e40af',
                marginBottom:'12px'
              }}>
                📊 Difference Summary
              </h3>
              <div style={{
                display:'grid',
                gridTemplateColumns:'repeat(3,1fr)',
                gap:'12px'
              }}>
                <div style={{textAlign:'center'}}>
                  <p style={{
                    fontSize:'20px',
                    fontWeight:'bold',
                    color:'#1e40af'
                  }}>
                    {result.difference.percentageDifference}%
                  </p>
                  <p style={{
                    fontSize:'12px',
                    color:'#6b7280'
                  }}>
                    CO₂ Difference
                  </p>
                </div>
                <div style={{textAlign:'center'}}>
                  <p style={{
                    fontSize:'14px',
                    fontWeight:'bold',
                    color:'#16a34a',
                    wordBreak:'break-all'
                  }}>
                    {result.difference.cleanerSite}
                  </p>
                  <p style={{
                    fontSize:'12px',
                    color:'#6b7280'
                  }}>
                    Cleaner Site
                  </p>
                </div>
                <div style={{textAlign:'center'}}>
                  <p style={{
                    fontSize:'14px',
                    fontWeight:'bold',
                    color:'#1e40af',
                    wordBreak:'break-all'
                  }}>
                    {result.difference.lighterSite}
                  </p>
                  <p style={{
                    fontSize:'12px',
                    color:'#6b7280'
                  }}>
                    Lighter Site
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}