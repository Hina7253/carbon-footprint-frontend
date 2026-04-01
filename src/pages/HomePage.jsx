import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { analyzeWebsite } from '../api/carbonApi'

export default function HomePage() {
  const navigate = useNavigate()
  const [url, setUrl] = useState('')
  const [monthlyVisits, setMonthlyVisits] = useState(10000)
  const [crawlPages, setCrawlPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError('Please enter a website URL')
      return
    }
    setError('')
    setLoading(true)
    try {
      const response = await analyzeWebsite(
        url, monthlyVisits, crawlPages)
      navigate(`/result/${response.data.id}`)
    } catch (err) {
      setError('Analysis failed. Check URL and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <div style={{
        background:'linear-gradient(135deg,#052e16,#14532d)',
        minHeight:'500px',
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        padding:'60px 20px',
        textAlign:'center'
      }}>
        <div style={{
          background:'rgba(255,255,255,0.1)',
          padding:'6px 16px',
          borderRadius:'20px',
          marginBottom:'20px',
          display:'inline-block'
        }}>
          <span style={{color:'#86efac',fontSize:'14px'}}>
            🤖 ECO-TECH ANALYZER
          </span>
        </div>

        <h1 style={{
          color:'white',
          fontSize:'52px',
          fontWeight:'bold',
          lineHeight:'1.2',
          maxWidth:'700px',
          marginBottom:'20px'
        }}>
          Measure the Carbon Cost of Every Web Experience
        </h1>

        <p style={{
          color:'#86efac',
          fontSize:'18px',
          maxWidth:'600px',
          marginBottom:'40px',
          lineHeight:'1.6'
        }}>
          Enter any URL to estimate electricity usage,
          per-visit emissions, and yearly footprint.
          Identify the heaviest assets and get
          AI-powered optimization guidance.
        </p>

        {/* Input Box */}
        <div style={{
          background:'rgba(0,0,0,0.3)',
          borderRadius:'16px',
          padding:'30px',
          width:'100%',
          maxWidth:'800px'
        }}>
          {/* URL + Visits + Pages */}
          <div style={{
            display:'grid',
            gridTemplateColumns:'1fr auto auto',
            gap:'12px',
            marginBottom:'16px'
          }}>
            <div>
              <label style={{
                color:'#86efac',
                fontSize:'12px',
                display:'block',
                marginBottom:'6px',
                textTransform:'uppercase'
              }}>
                WEBSITE URL
              </label>
              <input
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyPress={e =>
                  e.key === 'Enter' && handleAnalyze()}
                style={{
                  width:'100%',
                  padding:'14px 16px',
                  borderRadius:'8px',
                  border:'none',
                  fontSize:'16px',
                  outline:'none',
                  background:'#1a2e1a',
                  color:'white'
                }}
              />
            </div>

            <div>
              <label style={{
                color:'#86efac',
                fontSize:'12px',
                display:'block',
                marginBottom:'6px',
                textTransform:'uppercase'
              }}>
                MONTHLY VISITS
              </label>
              <input
                type="number"
                value={monthlyVisits}
                onChange={e =>
                  setMonthlyVisits(Number(e.target.value))}
                style={{
                  width:'140px',
                  padding:'14px 16px',
                  borderRadius:'8px',
                  border:'none',
                  fontSize:'16px',
                  outline:'none',
                  background:'#1a2e1a',
                  color:'white'
                }}
              />
            </div>

            <div>
              <label style={{
                color:'#86efac',
                fontSize:'12px',
                display:'block',
                marginBottom:'6px',
                textTransform:'uppercase'
              }}>
                CRAWL PAGES
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={crawlPages}
                onChange={e =>
                  setCrawlPages(Number(e.target.value))}
                style={{
                  width:'120px',
                  padding:'14px 16px',
                  borderRadius:'8px',
                  border:'none',
                  fontSize:'16px',
                  outline:'none',
                  background:'#1a2e1a',
                  color:'white'
                }}
              />
            </div>
          </div>

          {error && (
            <p style={{
              color:'#fca5a5',
              marginBottom:'12px',
              fontSize:'14px'
            }}>
              ⚠️ {error}
            </p>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading}
            style={{
              width:'100%',
              padding:'16px',
              background: loading ? '#4ade80' : '#16a34a',
              color:'white',
              border:'none',
              borderRadius:'8px',
              fontSize:'18px',
              fontWeight:'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition:'all 0.2s'
            }}
          >
            {loading
              ? '🔄 Analyzing Website...'
              : '🌿 Run Carbon Analysis'}
          </button>
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div style={{
          position:'fixed',
          top:0, left:0, right:0, bottom:0,
          background:'rgba(5,46,22,0.85)',
          display:'flex',
          flexDirection:'column',
          alignItems:'center',
          justifyContent:'center',
          zIndex:1000
        }}>
          <div style={{
            fontSize:'60px',
            marginBottom:'20px',
            animation:'spin 2s linear infinite'
          }}>🌿</div>
          <h2 style={{
            color:'white',
            fontSize:'24px',
            marginBottom:'12px'
          }}>
            Analyzing Carbon Footprint...
          </h2>
          <p style={{color:'#86efac'}}>
            Crawling resources, calculating emissions...
          </p>
          <p style={{color:'#6b7280',marginTop:'8px',
                     fontSize:'14px'}}>
            This may take 15-30 seconds
          </p>
        </div>
      )}

      {/* Features Section */}
      <div style={{
        padding:'60px 20px',
        backgroundColor:'#f0fdf4'
      }}>
        <div style={{
          maxWidth:'1100px',
          margin:'0 auto',
          display:'grid',
          gridTemplateColumns:'repeat(4,1fr)',
          gap:'20px'
        }}>
          {[
            {
              icon:'🌐',
              title:'Website Resource Mapping',
              desc:'Images, scripts, fonts, APIs, and videos'
            },
            {
              icon:'📊',
              title:'CO₂ Estimation Engine',
              desc:'Per visit + annual impact based on traffic'
            },
            {
              icon:'🔥',
              title:'Hotspot Detection',
              desc:'Pinpoints elements driving carbon emissions'
            },
            {
              icon:'🤖',
              title:'AI Recommendations',
              desc:'Optimization steps with estimated savings'
            }
          ].map((f, i) => (
            <div key={i} style={{
              background:'white',
              borderRadius:'12px',
              padding:'24px',
              boxShadow:'0 2px 8px rgba(0,0,0,0.06)'
            }}>
              <div style={{fontSize:'32px',marginBottom:'12px'}}>
                {f.icon}
              </div>
              <h3 style={{
                color:'#14532d',
                fontWeight:'bold',
                marginBottom:'8px'
              }}>
                {f.title}
              </h3>
              <p style={{color:'#6b7280',fontSize:'14px'}}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}