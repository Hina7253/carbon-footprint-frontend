import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getAnalysis, getSavings,
         getCodeFixes, chatWithAi,
         sendEmailReport, getPdfUrl } from '../api/carbonApi'

export default function ResultPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [analysis, setAnalysis] = useState(null)
  const [savings, setSavings] = useState(null)
  const [codeFixes, setCodeFixes] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [chatQuestion, setChatQuestion] = useState('')
  const [chatAnswer, setChatAnswer] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      const res = await getAnalysis(id)
      setAnalysis(res.data)
      const savRes = await getSavings(id)
      setSavings(savRes.data)
      const codeRes = await getCodeFixes(id)
      setCodeFixes(codeRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChat = async () => {
    if (!chatQuestion.trim()) return
    setChatLoading(true)
    try {
      const res = await chatWithAi(id, chatQuestion)
      setChatAnswer(res.data.answer)
    } catch (err) {
      setChatAnswer('Error getting response')
    } finally {
      setChatLoading(false)
    }
  }

  const handleEmail = async () => {
    if (!email.trim()) return
    try {
      await sendEmailReport(id, email)
      setEmailSent(true)
    } catch (err) {
      alert('Email failed: ' + err.message)
    }
  }

  const gradeColor = (g) => {
    const colors = {
      A:'#16a34a', B:'#65a30d',
      C:'#d97706', D:'#ea580c',
      E:'#dc2626', F:'#9d0208'
    }
    return colors[g] || '#6b7280'
  }

  if (loading) return (
    <div style={{
      display:'flex',
      flexDirection:'column',
      alignItems:'center',
      justifyContent:'center',
      minHeight:'60vh'
    }}>
      <div style={{fontSize:'50px'}}>🌿</div>
      <p style={{
        color:'#14532d',
        fontSize:'20px',
        marginTop:'16px'
      }}>
        Loading Analysis...
      </p>
    </div>
  )

  if (!analysis) return (
    <div style={{textAlign:'center',padding:'60px'}}>
      <p style={{color:'#dc2626',fontSize:'20px'}}>
        Analysis not found!
      </p>
      <Link to="/" style={{color:'#16a34a'}}>
        ← Go Home
      </Link>
    </div>
  )

  const cm = analysis.carbonMetrics || {}
  const rs = analysis.resourceSummary || {}
  const eq = cm.equivalents || {}

  const tabs = [
    {id:'overview',  label:'📊 Overview'},
    {id:'resources', label:'📦 Resources'},
    {id:'savings',   label:'💰 Savings'},
    {id:'codefixes', label:'💻 Code Fixes'},
    {id:'chat',      label:'🤖 AI Chat'},
    {id:'share',     label:'📤 Share'},
  ]

  return (
    <div style={{
      maxWidth:'1100px',
      margin:'0 auto',
      padding:'30px 20px'
    }}>

      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        style={{
          background:'none',
          border:'1px solid #16a34a',
          color:'#16a34a',
          padding:'8px 16px',
          borderRadius:'8px',
          cursor:'pointer',
          marginBottom:'20px',
          fontSize:'14px'
        }}>
        ← New Analysis
      </button>

      {/* Header Card */}
      <div style={{
        background:'linear-gradient(135deg,#052e16,#14532d)',
        borderRadius:'16px',
        padding:'30px',
        marginBottom:'24px',
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center',
        flexWrap:'wrap',
        gap:'20px'
      }}>
        <div>
          <h1 style={{
            color:'white',
            fontSize:'24px',
            fontWeight:'bold',
            marginBottom:'8px'
          }}>
            {analysis.websiteUrl}
          </h1>
          <p style={{color:'#86efac',fontSize:'14px'}}>
            Analysis ID: #{analysis.id} •
            Status: {analysis.status}
          </p>
        </div>

        {/* Grade Circle */}
        <div style={{textAlign:'center'}}>
          <div style={{
            width:'80px',
            height:'80px',
            borderRadius:'50%',
            background: gradeColor(analysis.grade),
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            fontSize:'36px',
            fontWeight:'bold',
            color:'white',
            margin:'0 auto 8px'
          }}>
            {analysis.grade || '?'}
          </div>
          <p style={{color:'#86efac',fontSize:'12px'}}>
            Carbon Grade
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(4,1fr)',
        gap:'16px',
        marginBottom:'24px'
      }}>
        {[
          {
            label:'CO₂ Per Visit',
            value: cm.co2PerVisitGrams
              ? `${cm.co2PerVisitGrams}g`
              : 'N/A',
            icon:'🌱',
            bg:'#f0fdf4'
          },
          {
            label:'Annual CO₂',
            value: cm.co2YearlyKg
              ? `${cm.co2YearlyKg} kg`
              : 'N/A',
            icon:'📅',
            bg:'#fef9c3'
          },
          {
            label:'Page Size',
            value: rs.totalTransferFormatted || 'N/A',
            icon:'📦',
            bg:'#eff6ff'
          },
          {
            label:'Resources Found',
            value: rs.totalResourceCount || 0,
            icon:'🔗',
            bg:'#fdf4ff'
          }
        ].map((stat, i) => (
          <div key={i} style={{
            background: stat.bg,
            borderRadius:'12px',
            padding:'20px',
            textAlign:'center',
            boxShadow:'0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <div style={{fontSize:'28px',marginBottom:'8px'}}>
              {stat.icon}
            </div>
            <p style={{
              fontSize:'22px',
              fontWeight:'bold',
              color:'#1f2937',
              marginBottom:'4px'
            }}>
              {stat.value}
            </p>
            <p style={{
              fontSize:'12px',
              color:'#6b7280',
              textTransform:'uppercase'
            }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{
        display:'flex',
        gap:'8px',
        marginBottom:'24px',
        flexWrap:'wrap'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding:'10px 20px',
              borderRadius:'8px',
              border:'none',
              cursor:'pointer',
              fontWeight: activeTab===tab.id
                ? 'bold' : 'normal',
              background: activeTab===tab.id
                ? '#16a34a' : 'white',
              color: activeTab===tab.id
                ? 'white' : '#374151',
              boxShadow:'0 2px 4px rgba(0,0,0,0.1)',
              fontSize:'14px'
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{
        background:'white',
        borderRadius:'16px',
        padding:'30px',
        boxShadow:'0 2px 8px rgba(0,0,0,0.06)'
      }}>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            <h2 style={{
              color:'#14532d',
              fontSize:'20px',
              fontWeight:'bold',
              marginBottom:'20px'
            }}>
              📊 Carbon Overview
            </h2>

            {/* Real World Equivalents */}
            {eq && (
              <div style={{marginBottom:'24px'}}>
                <h3 style={{
                  color:'#374151',
                  marginBottom:'16px',
                  fontWeight:'bold'
                }}>
                  🌍 Real World Equivalents (Per Year)
                </h3>
                <div style={{
                  display:'grid',
                  gridTemplateColumns:'repeat(4,1fr)',
                  gap:'12px'
                }}>
                  {[
                    {
                      label:'Trees Needed',
                      value: eq.treesNeeded
                        ? eq.treesNeeded.toFixed(2)
                        : '0',
                      icon:'🌳'
                    },
                    {
                      label:'KM Driven',
                      value: eq.kmDriven
                        ? eq.kmDriven.toFixed(0)
                        : '0',
                      icon:'🚗'
                    },
                    {
                      label:'Phone Charges',
                      value: eq.smartphoneCharges
                        ? eq.smartphoneCharges.toFixed(0)
                        : '0',
                      icon:'📱'
                    },
                    {
                      label:'Google Searches',
                      value: eq.googleSearches
                        ? eq.googleSearches.toFixed(0)
                        : '0',
                      icon:'🔍'
                    }
                  ].map((e, i) => (
                    <div key={i} style={{
                      background:'#f0fdf4',
                      borderRadius:'10px',
                      padding:'16px',
                      textAlign:'center'
                    }}>
                      <div style={{
                        fontSize:'28px',
                        marginBottom:'8px'
                      }}>
                        {e.icon}
                      </div>
                      <p style={{
                        fontSize:'20px',
                        fontWeight:'bold',
                        color:'#14532d'
                      }}>
                        {e.value}
                      </p>
                      <p style={{
                        fontSize:'11px',
                        color:'#6b7280'
                      }}>
                        {e.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Suggestions */}
            {analysis.aiSuggestions && (
              <div>
                <h3 style={{
                  color:'#374151',
                  marginBottom:'12px',
                  fontWeight:'bold'
                }}>
                  🤖 AI Optimization Suggestions
                </h3>
                <div style={{
                  background:'#f0fdf4',
                  borderLeft:'4px solid #16a34a',
                  padding:'20px',
                  borderRadius:'0 8px 8px 0',
                  whiteSpace:'pre-line',
                  color:'#374151',
                  lineHeight:'1.7',
                  fontSize:'14px'
                }}>
                  {analysis.aiSuggestions}
                </div>
              </div>
            )}

            {/* Comparison */}
            {analysis.comparison && (
              <div style={{marginTop:'24px'}}>
                <h3 style={{
                  color:'#374151',
                  marginBottom:'12px',
                  fontWeight:'bold'
                }}>
                  📈 Industry Comparison
                </h3>
                <div style={{
                  background:'#eff6ff',
                  borderRadius:'10px',
                  padding:'20px'
                }}>
                  <p style={{
                    fontSize:'18px',
                    fontWeight:'bold',
                    color:'#1e40af',
                    marginBottom:'8px'
                  }}>
                    Better than{' '}
                    {analysis.comparison.percentileBetter}%
                    of websites
                  </p>
                  <p style={{color:'#374151'}}>
                    Category:{' '}
                    {analysis.comparison.performanceCategory}
                  </p>
                  <p style={{
                    color:'#6b7280',
                    fontSize:'14px',
                    marginTop:'4px'
                  }}>
                    Industry average:{' '}
                    {analysis.comparison.averageWebsiteCo2Grams}g
                    CO₂/visit
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* RESOURCES TAB */}
        {activeTab === 'resources' && (
          <div>
            <h2 style={{
              color:'#14532d',
              fontSize:'20px',
              fontWeight:'bold',
              marginBottom:'20px'
            }}>
              📦 Resource Hotspots
            </h2>
            <p style={{color:'#6b7280',marginBottom:'20px'}}>
              Top heaviest resources found on the page
            </p>

            {analysis.hotspots && analysis.hotspots.length > 0
              ? analysis.hotspots.map((r, i) => (
                <div key={i} style={{
                  border:'1px solid #e5e7eb',
                  borderRadius:'10px',
                  padding:'16px',
                  marginBottom:'12px',
                  display:'flex',
                  justifyContent:'space-between',
                  alignItems:'center',
                  flexWrap:'wrap',
                  gap:'12px'
                }}>
                  <div style={{flex:1}}>
                    <div style={{
                      display:'flex',
                      alignItems:'center',
                      gap:'8px',
                      marginBottom:'6px'
                    }}>
                      <span style={{
                        background:'#dcfce7',
                        color:'#16a34a',
                        padding:'2px 8px',
                        borderRadius:'4px',
                        fontSize:'11px',
                        fontWeight:'bold'
                      }}>
                        {r.type}
                      </span>
                      {r.isThirdParty && (
                        <span style={{
                          background:'#fef9c3',
                          color:'#854d0e',
                          padding:'2px 8px',
                          borderRadius:'4px',
                          fontSize:'11px'
                        }}>
                          3rd Party
                        </span>
                      )}
                      {r.isCached && (
                        <span style={{
                          background:'#eff6ff',
                          color:'#1d4ed8',
                          padding:'2px 8px',
                          borderRadius:'4px',
                          fontSize:'11px'
                        }}>
                          Cached
                        </span>
                      )}
                    </div>
                    <p style={{
                      fontSize:'13px',
                      color:'#374151',
                      wordBreak:'break-all'
                    }}>
                      {r.url}
                    </p>
                    <p style={{
                      fontSize:'12px',
                      color:'#16a34a',
                      marginTop:'4px'
                    }}>
                      💡 {r.optimizationTip}
                    </p>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <p style={{
                      fontWeight:'bold',
                      color:'#1f2937',
                      fontSize:'16px'
                    }}>
                      {r.sizeFormatted}
                    </p>
                    <p style={{
                      fontSize:'12px',
                      color:'#6b7280'
                    }}>
                      {r.co2Grams
                        ? `${r.co2Grams}g CO₂` : ''}
                    </p>
                    {r.optimizationPotential && (
                      <div style={{marginTop:'6px'}}>
                        <div style={{
                          background:'#e5e7eb',
                          borderRadius:'4px',
                          height:'6px',
                          width:'80px'
                        }}>
                          <div style={{
                            background:'#16a34a',
                            borderRadius:'4px',
                            height:'6px',
                            width:`${r.optimizationPotential*100}%`
                          }}/>
                        </div>
                        <p style={{
                          fontSize:'10px',
                          color:'#6b7280',
                          marginTop:'2px'
                        }}>
                          {Math.round(
                            r.optimizationPotential*100)}%
                          reducible
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))
              : (
                <p style={{color:'#6b7280'}}>
                  No resource data available
                </p>
              )
            }
          </div>
        )}

        {/* SAVINGS TAB */}
        {activeTab === 'savings' && savings && (
          <div>
            <h2 style={{
              color:'#14532d',
              fontSize:'20px',
              fontWeight:'bold',
              marginBottom:'20px'
            }}>
              💰 Carbon Savings Potential
            </h2>

            {/* Before / After */}
            <div style={{
              display:'grid',
              gridTemplateColumns:'1fr 1fr',
              gap:'16px',
              marginBottom:'24px'
            }}>
              <div style={{
                background:'#fee2e2',
                borderRadius:'12px',
                padding:'20px',
                textAlign:'center'
              }}>
                <h3 style={{
                  color:'#991b1b',
                  marginBottom:'12px'
                }}>
                  ❌ Current State
                </h3>
                <p style={{
                  fontSize:'24px',
                  fontWeight:'bold',
                  color:'#dc2626'
                }}>
                  {savings.current?.bytesFormatted}
                </p>
                <p style={{color:'#6b7280',fontSize:'14px'}}>
                  {savings.current?.co2PerVisitGrams}g CO₂/visit
                </p>
                <p style={{
                  fontSize:'28px',
                  fontWeight:'bold',
                  marginTop:'8px'
                }}>
                  Grade {savings.current?.grade}
                </p>
              </div>

              <div style={{
                background:'#dcfce7',
                borderRadius:'12px',
                padding:'20px',
                textAlign:'center'
              }}>
                <h3 style={{
                  color:'#14532d',
                  marginBottom:'12px'
                }}>
                  ✅ After Optimization
                </h3>
                <p style={{
                  fontSize:'24px',
                  fontWeight:'bold',
                  color:'#16a34a'
                }}>
                  {savings.optimized?.bytesFormatted}
                </p>
                <p style={{color:'#6b7280',fontSize:'14px'}}>
                  {savings.optimized?.co2PerVisitGrams}g
                  CO₂/visit
                </p>
                <p style={{
                  fontSize:'28px',
                  fontWeight:'bold',
                  marginTop:'8px'
                }}>
                  Grade {savings.optimized?.grade}
                </p>
              </div>
            </div>

            {/* Savings Summary */}
            <div style={{
              background:'#f0fdf4',
              borderRadius:'12px',
              padding:'20px',
              marginBottom:'24px'
            }}>
              <h3 style={{
                color:'#14532d',
                marginBottom:'16px',
                fontWeight:'bold'
              }}>
                🎯 You Could Save
              </h3>
              <div style={{
                display:'grid',
                gridTemplateColumns:'repeat(3,1fr)',
                gap:'12px'
              }}>
                <div style={{textAlign:'center'}}>
                  <p style={{
                    fontSize:'22px',
                    fontWeight:'bold',
                    color:'#16a34a'
                  }}>
                    {savings.savings?.percentageSaved}%
                  </p>
                  <p style={{
                    fontSize:'12px',
                    color:'#6b7280'
                  }}>
                    Size Reduction
                  </p>
                </div>
                <div style={{textAlign:'center'}}>
                  <p style={{
                    fontSize:'22px',
                    fontWeight:'bold',
                    color:'#16a34a'
                  }}>
                    {savings.savings?.co2SavedYearlyKg} kg
                  </p>
                  <p style={{
                    fontSize:'12px',
                    color:'#6b7280'
                  }}>
                    CO₂ Saved/Year
                  </p>
                </div>
                <div style={{textAlign:'center'}}>
                  <p style={{
                    fontSize:'22px',
                    fontWeight:'bold',
                    color:'#16a34a'
                  }}>
                    {savings.savings?.gradeImprovement}
                  </p>
                  <p style={{
                    fontSize:'12px',
                    color:'#6b7280'
                  }}>
                    Grade Improvement
                  </p>
                </div>
              </div>
            </div>

            {/* Real World */}
            {savings.realWorldEquivalents && (
              <div style={{
                background:'#eff6ff',
                borderRadius:'12px',
                padding:'20px'
              }}>
                <h3 style={{
                  color:'#1e40af',
                  marginBottom:'12px',
                  fontWeight:'bold'
                }}>
                  🌍 Real World Impact of Savings
                </h3>
                <div style={{
                  display:'grid',
                  gridTemplateColumns:'repeat(3,1fr)',
                  gap:'12px'
                }}>
                  <div style={{textAlign:'center'}}>
                    <p style={{fontSize:'24px'}}>🌳</p>
                    <p style={{
                      fontWeight:'bold',
                      color:'#1e40af'
                    }}>
                      {savings.realWorldEquivalents
                        .treesPlanted?.toFixed(2)}
                    </p>
                    <p style={{
                      fontSize:'12px',
                      color:'#6b7280'
                    }}>
                      Trees Planted
                    </p>
                  </div>
                  <div style={{textAlign:'center'}}>
                    <p style={{fontSize:'24px'}}>🚗</p>
                    <p style={{
                      fontWeight:'bold',
                      color:'#1e40af'
                    }}>
                      {savings.realWorldEquivalents
                        .kmNotDriven?.toFixed(0)} km
                    </p>
                    <p style={{
                      fontSize:'12px',
                      color:'#6b7280'
                    }}>
                      Not Driven
                    </p>
                  </div>
                  <div style={{textAlign:'center'}}>
                    <p style={{fontSize:'24px'}}>📱</p>
                    <p style={{
                      fontWeight:'bold',
                      color:'#1e40af'
                    }}>
                      {savings.realWorldEquivalents
                        .smartphonesCharged?.toFixed(0)}
                    </p>
                    <p style={{
                      fontSize:'12px',
                      color:'#6b7280'
                    }}>
                      Phones Charged
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CODE FIXES TAB */}
        {activeTab === 'codefixes' && codeFixes && (
          <div>
            <h2 style={{
              color:'#14532d',
              fontSize:'20px',
              fontWeight:'bold',
              marginBottom:'8px'
            }}>
              💻 Code Optimization Fixes
            </h2>
            <p style={{
              color:'#6b7280',
              marginBottom:'20px',
              fontSize:'14px'
            }}>
              Copy-paste ready code fixes to reduce
              carbon footprint
            </p>

            {codeFixes.codeFixes?.map((fix, i) => (
              <div key={i} style={{
                border:'1px solid #e5e7eb',
                borderRadius:'12px',
                marginBottom:'16px',
                overflow:'hidden'
              }}>
                <div style={{
                  background:'#f9fafb',
                  padding:'16px',
                  display:'flex',
                  justifyContent:'space-between',
                  alignItems:'center'
                }}>
                  <div>
                    <h3 style={{
                      fontWeight:'bold',
                      color:'#1f2937',
                      marginBottom:'4px'
                    }}>
                      {fix.category}
                    </h3>
                    <div style={{
                      display:'flex',
                      gap:'8px'
                    }}>
                      <span style={{
                        background:'#fef9c3',
                        color:'#854d0e',
                        padding:'2px 8px',
                        borderRadius:'4px',
                        fontSize:'11px'
                      }}>
                        {fix.impact}
                      </span>
                      <span style={{
                        background:'#dcfce7',
                        color:'#166534',
                        padding:'2px 8px',
                        borderRadius:'4px',
                        fontSize:'11px'
                      }}>
                        {fix.difficulty}
                      </span>
                    </div>
                  </div>
                  <span style={{
                    fontSize:'13px',
                    color:'#6b7280'
                  }}>
                    {fix.affectedCount}
                  </span>
                </div>

                {fix.before && (
                  <div style={{padding:'16px'}}>
                    <p style={{
                      fontSize:'12px',
                      color:'#dc2626',
                      fontWeight:'bold',
                      marginBottom:'6px'
                    }}>
                      ❌ BEFORE
                    </p>
                    <pre style={{
                      background:'#1f2937',
                      color:'#f9fafb',
                      padding:'12px',
                      borderRadius:'6px',
                      fontSize:'12px',
                      overflowX:'auto',
                      whiteSpace:'pre-wrap'
                    }}>
                      {fix.before}
                    </pre>

                    <p style={{
                      fontSize:'12px',
                      color:'#16a34a',
                      fontWeight:'bold',
                      margin:'12px 0 6px'
                    }}>
                      ✅ AFTER
                    </p>
                    <pre style={{
                      background:'#1f2937',
                      color:'#86efac',
                      padding:'12px',
                      borderRadius:'6px',
                      fontSize:'12px',
                      overflowX:'auto',
                      whiteSpace:'pre-wrap'
                    }}>
                      {fix.after}
                    </pre>
                  </div>
                )}

                {fix.howTo && (
                  <div style={{
                    padding:'12px 16px',
                    background:'#f0fdf4',
                    fontSize:'13px',
                    color:'#374151',
                    whiteSpace:'pre-line'
                  }}>
                    📋 {fix.howTo}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* AI CHAT TAB */}
        {activeTab === 'chat' && (
          <div>
            <h2 style={{
              color:'#14532d',
              fontSize:'20px',
              fontWeight:'bold',
              marginBottom:'8px'
            }}>
              🤖 AI Chat Assistant
            </h2>
            <p style={{
              color:'#6b7280',
              marginBottom:'20px',
              fontSize:'14px'
            }}>
              Ask anything about this website's
              carbon footprint
            </p>

            {/* Suggested Questions */}
            <div style={{
              display:'flex',
              gap:'8px',
              flexWrap:'wrap',
              marginBottom:'20px'
            }}>
              {[
                'How can I improve my grade?',
                'Which image causes most carbon?',
                'What is my CO2 per year?',
                'How do third-party scripts affect me?'
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => setChatQuestion(q)}
                  style={{
                    padding:'8px 14px',
                    background:'#f0fdf4',
                    border:'1px solid #86efac',
                    borderRadius:'20px',
                    cursor:'pointer',
                    fontSize:'13px',
                    color:'#14532d'
                  }}>
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div style={{
              display:'flex',
              gap:'12px',
              marginBottom:'20px'
            }}>
              <input
                type="text"
                placeholder="Ask about carbon footprint..."
                value={chatQuestion}
                onChange={e => setChatQuestion(e.target.value)}
                onKeyPress={e =>
                  e.key === 'Enter' && handleChat()}
                style={{
                  flex:1,
                  padding:'12px 16px',
                  border:'1px solid #d1d5db',
                  borderRadius:'8px',
                  fontSize:'15px',
                  outline:'none'
                }}
              />
              <button
                onClick={handleChat}
                disabled={chatLoading}
                style={{
                  padding:'12px 24px',
                  background:'#16a34a',
                  color:'white',
                  border:'none',
                  borderRadius:'8px',
                  cursor:'pointer',
                  fontWeight:'bold',
                  fontSize:'15px'
                }}>
                {chatLoading ? '...' : 'Ask 🤖'}
              </button>
            </div>

            {/* Answer */}
            {chatAnswer && (
              <div style={{
                background:'#f0fdf4',
                borderLeft:'4px solid #16a34a',
                padding:'20px',
                borderRadius:'0 8px 8px 0',
                lineHeight:'1.7',
                color:'#374151'
              }}>
                <p style={{
                  fontWeight:'bold',
                  color:'#14532d',
                  marginBottom:'8px'
                }}>
                  🤖 AI Response:
                </p>
                <p>{chatAnswer}</p>
              </div>
            )}
          </div>
        )}

        {/* SHARE TAB */}
        {activeTab === 'share' && (
          <div>
            <h2 style={{
              color:'#14532d',
              fontSize:'20px',
              fontWeight:'bold',
              marginBottom:'20px'
            }}>
              📤 Share & Export
            </h2>

            {/* PDF Download */}
            <div style={{
              border:'1px solid #e5e7eb',
              borderRadius:'12px',
              padding:'20px',
              marginBottom:'16px'
            }}>
              <h3 style={{
                fontWeight:'bold',
                marginBottom:'8px'
              }}>
                📄 Download PDF Report
              </h3>
              <p style={{
                color:'#6b7280',
                fontSize:'14px',
                marginBottom:'12px'
              }}>
                Get a complete analysis report as PDF
              </p>
              <a
                href={getPdfUrl(id)}
                target="_blank"
                rel="noreferrer"
                style={{
                  display:'inline-block',
                  padding:'12px 24px',
                  background:'#16a34a',
                  color:'white',
                  borderRadius:'8px',
                  textDecoration:'none',
                  fontWeight:'bold'
                }}>
                📥 Download PDF
              </a>
            </div>

            {/* Email Report */}
            <div style={{
              border:'1px solid #e5e7eb',
              borderRadius:'12px',
              padding:'20px',
              marginBottom:'16px'
            }}>
              <h3 style={{
                fontWeight:'bold',
                marginBottom:'8px'
              }}>
                📧 Email Report
              </h3>
              <p style={{
                color:'#6b7280',
                fontSize:'14px',
                marginBottom:'12px'
              }}>
                Send analysis report to your email
              </p>
              {emailSent ? (
                <p style={{color:'#16a34a',fontWeight:'bold'}}>
                  ✅ Email sent successfully!
                </p>
              ) : (
                <div style={{display:'flex',gap:'12px'}}>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{
                      flex:1,
                      padding:'12px',
                      border:'1px solid #d1d5db',
                      borderRadius:'8px',
                      outline:'none',
                      fontSize:'14px'
                    }}
                  />
                  <button
                    onClick={handleEmail}
                    style={{
                      padding:'12px 20px',
                      background:'#16a34a',
                      color:'white',
                      border:'none',
                      borderRadius:'8px',
                      cursor:'pointer',
                      fontWeight:'bold'
                    }}>
                    Send 📧
                  </button>
                </div>
              )}
            </div>

            {/* Carbon Badge */}
            <div style={{
              border:'1px solid #e5e7eb',
              borderRadius:'12px',
              padding:'20px'
            }}>
              <h3 style={{
                fontWeight:'bold',
                marginBottom:'8px'
              }}>
                🏷️ Carbon Badge
              </h3>
              <p style={{
                color:'#6b7280',
                fontSize:'14px',
                marginBottom:'12px'
              }}>
                Embed this badge on your website!
              </p>
              <img
                src={`http://localhost:8080/api/analyses/badge/${analysis.websiteUrl}`}
                alt="Carbon Badge"
                style={{marginBottom:'12px',display:'block'}}
              />
              <p style={{
                fontSize:'12px',
                color:'#6b7280'
              }}>
                Embed code:
              </p>
              <code style={{
                background:'#1f2937',
                color:'#86efac',
                padding:'8px 12px',
                borderRadius:'6px',
                fontSize:'12px',
                display:'block',
                marginTop:'6px'
              }}>
                {`<img src="http://localhost:8080/api/analyses/badge/${analysis.websiteUrl}">`}
              </code>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}