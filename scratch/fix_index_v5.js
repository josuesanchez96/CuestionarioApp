const fs = require('fs');
const path = 'index.html';
let content = fs.readFileSync(path, 'utf8');

const regex = /\{gameStarted && gameMode === 'module8' && \([\s\S]*?(?=\{gameStarted && !gameOver && gameMode === 'module7')/;

const correctModule8 = `{gameStarted && gameMode === 'module8' && (
                <div 
                  className="module8-container" 
                  tabIndex={0}
                  ref={el => { if (el) el.focus(); }}
                  onTouchStart={e => { 
                    touchStartX.current = e.changedTouches[0].screenX; 
                    isSwipeRef.current = false;
                  }}
                  onTouchEnd={e => {
                    touchEndX.current = e.changedTouches[0].screenX;
                    const delta = touchEndX.current - touchStartX.current;
                    if (Math.abs(delta) > 50) {
                      isSwipeRef.current = true;
                      skipAudio(delta < 0 ? 1 : -1);
                    }
                  }}
                  onKeyDown={e => {
                    if (e.key === 'ArrowRight') { skipAudio(1); }
                    if (e.key === 'ArrowLeft') { skipAudio(-1); }
                    if (e.key === ' ') { e.preventDefault(); toggleAudio(!audioPlaying); }
                  }}
                  onClick={() => {
                    if (!isSwipeRef.current) toggleAudio(!audioPlaying);
                  }}
                  style={{ 
                  padding: '15px', 
                  minHeight: '100dvh', 
                  background: '#000', 
                  margin: '0', 
                  textAlign: 'center', 
                  color: '#fff', 
                  position: 'fixed', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  bottom: 0, 
                  zIndex: 9999,
                  overflowY: 'auto',
                  display: 'grid',
                  placeItems: 'center',
                  alignContent: 'center',
                  WebkitOverflowScrolling: 'touch'
                }}>
                   {showBigHeart && (
                      <div className="m6-heart-animation" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10000 }}>❤️</div>
                   )}
                   <div style={{ position: 'absolute', top: 0, right: 0, padding: '15px', zIndex: 100 }}>
                    <button 
                      className="m5-close-btn" 
                      onClick={(e) => { e.stopPropagation(); toggleAudio(false); handleChangeModule(); }}
                      style={{ color: 'rgba(255,255,255,0.15)', border: 'none', background: 'transparent', WebkitTapHighlightColor: 'transparent', outline: 'none' }}
                    >Salir ⛌</button>
                  </div>

                  <div className="audio-card" 
                       style={{ background: 'transparent', border: 'none', width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px', boxSizing: 'border-box', userSelect: 'none' }}>
                     <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                          <div 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              toggleKnown(questions[currentIndex]);
                              setShowBigHeart(true);
                              setTimeout(() => setShowBigHeart(false), 800);
                            }}
                            style={{ 
                              width: '80px', height: '80px', borderRadius: '20px', 
                              background: 'rgba(255, 255, 255, 0.05)', 
                              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px',
                              backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)',
                              color: likedQuestions.includes(questions[currentIndex]?.question + questions[currentIndex]?.answer) ? '#ff3040' : 'rgba(255,255,255,0.4)',
                              boxShadow: likedQuestions.includes(questions[currentIndex]?.question + questions[currentIndex]?.answer) ? '0 8px 20px rgba(255,48,64,0.2)' : '0 8px 20px rgba(0,0,0,0.2)',
                              transition: 'all 0.3s ease', cursor: 'pointer'
                            }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill={likedQuestions.includes(questions[currentIndex]?.question + questions[currentIndex]?.answer) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                          </div>
                          
                          <div style={{ 
                              width: '80px', height: '80px', borderRadius: '20px', 
                              background: 'rgba(255, 255, 255, 0.05)', 
                              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px',
                              backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)',
                              color: 'rgba(255,255,255,0.7)',
                              boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                            }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>
                            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{currentIndex + 1}/{questions.length}</span>
                          </div>

                          <div 
                            onClick={(e) => { e.stopPropagation(); toggleAudio(!audioPlaying); }}
                            style={{ 
                              width: '80px', height: '80px', borderRadius: '20px', 
                              background: audioPlaying ? 'rgba(46, 213, 115, 0.1)' : 'rgba(255, 255, 255, 0.05)', 
                              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px',
                              backdropFilter: 'blur(10px)', border: \`1px solid \${audioPlaying ? 'rgba(46, 213, 115, 0.3)' : 'rgba(255,255,255,0.08)'}\`,
                              color: audioPlaying ? '#2ed573' : 'rgba(255,255,255,0.4)',
                              boxShadow: audioPlaying ? '0 8px 20px rgba(46, 213, 115, 0.2)' : '0 8px 20px rgba(0,0,0,0.2)',
                              transition: 'all 0.3s ease', cursor: 'pointer'
                            }}>
                            {audioPlaying ? (
                              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="6" y="4" width="4" height="16"></rect>
                                <rect x="14" y="4" width="4" height="16"></rect>
                              </svg>
                            ) : (
                              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}>
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                              </svg>
                            )}
                          </div>
                        </div>
                        
                        <div style={{ fontSize: '1.4rem', fontWeight: '400', color: 'rgba(255,255,255,0.35)', minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5px 10px', lineHeight: '1.3', border: 'none', background: 'transparent' }}>
                          <p style={{ margin: 0, whiteSpace: 'pre-line' }}>
                            {audioStep < 2 ? questions[currentIndex]?.question 
                             : questions[currentIndex]?.answer}
                          </p>
                        </div>
                     </div>

                     <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '300px', margin: '0 auto', width: '100%' }}>
                        <div onClick={e => e.stopPropagation()} style={{ textAlign: 'left', background: 'transparent', padding: '10px', borderRadius: '12px', border: 'none' }}>
                          <label style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.1)', display: 'block', marginBottom: '4px' }}>Velocidad: {audioSpeed}x</label>
                          <input type="range" min="0.5" max="1.5" step="0.1" value={audioSpeed} onChange={e => setAudioSpeed(parseFloat(e.target.value))} style={{ width: '100%', height: '4px', opacity: 0.2 }} />
                        </div>
                     </div>
                  </div>
                </div>
              )}

              `;

if (regex.test(content)) {
    content = content.replace(regex, correctModule8);
    fs.writeFileSync(path, content, 'utf8');
    console.log('Successfully replaced module8 with a clean version.');
} else {
    console.log('Could not find the module8 block to replace.');
}
