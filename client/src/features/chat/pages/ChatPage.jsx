// features/chat/pages/ChatPage.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import DashboardNav from '../../../core/components/DashboardNav.jsx';
import { useAuth } from '../../../core/context/AuthContext.jsx';
import { useLang } from '../../../core/context/LanguageContext.jsx';
import client from '../../../core/api/client.js';

const SERVER_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

let socket = null;

function getAccessToken() {
  // Access token is stored in sessionStorage by AuthContext/client.js
  return sessionStorage.getItem('accessToken') || '';
}

export default function ChatPage() {
  const { user } = useAuth();
  const { t } = useLang();
  const location = useLocation();

  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [connected, setConnected] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimerRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // ── Connect to Socket.io ──────────────────────────────────
  useEffect(() => {
    const token = getAccessToken();
    socket = io(SERVER_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      setConnected(true);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('message:receive', (msg) => {
      setMessages(prev => {
        // Avoid duplicates
        if (prev.find(m => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    socket.on('message:sent', (msg) => {
      setMessages(prev => {
        if (prev.find(m => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    socket.on('typing:start', ({ senderId }) => {
      if (senderId === activeContact?.id) setIsTyping(true);
    });

    socket.on('typing:stop', ({ senderId }) => {
      if (senderId === activeContact?.id) setIsTyping(false);
    });

    socket.on('user:online', ({ userId }) => {
      setOnlineUsers(prev => new Set([...prev, userId]));
    });

    socket.on('user:offline', ({ userId }) => {
      setOnlineUsers(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, []); // eslint-disable-line

  // Re-subscribe to typing events when activeContact changes
  useEffect(() => {
    setIsTyping(false);
  }, [activeContact]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ── Fetch contacts ────────────────────────────────────────
  useEffect(() => {
    client.get('/chat/contacts')
      .then(res => {
        setContacts(res.data.contacts);
        // If navigated with a contact preselected (e.g. from find-doctor)
        const preselect = location.state?.contactId;
        if (preselect) {
          const c = res.data.contacts.find(c => c.id === preselect);
          if (c) setActiveContact(c);
        }
      })
      .catch(console.error);
  }, [location.state]);

  // ── Fetch messages when contact selected ──────────────────
  const loadMessages = useCallback(async (contact) => {
    setLoadingMsgs(true);
    setMessages([]);
    setActiveContact(contact);
    try {
      const res = await client.get(`/chat/${contact.id}`);
      setMessages(res.data.messages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMsgs(false);
    }
  }, []);

  // ── Send message ──────────────────────────────────────────
  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !activeContact || !socket) return;

    socket.emit('message:send', {
      receiverId: activeContact.id,
      content: input.trim(),
    });

    // Stop typing indicator
    socket.emit('typing:stop', { receiverId: activeContact.id });

    setInput('');
  };

  // ── Typing indicator ──────────────────────────────────────
  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!activeContact || !socket) return;

    socket.emit('typing:start', { receiverId: activeContact.id });

    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      socket.emit('typing:stop', { receiverId: activeContact.id });
    }, 1500);
  };

  const isOnline = (id) => onlineUsers.has(id);

  return (
    <div className="dashboard" style={{ minHeight: '100vh' }}>
      <DashboardNav />
      <main style={{ maxWidth: 1100, margin: '32px auto', padding: '0 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          gap: 20,
          height: 'calc(100vh - 120px)',
          minHeight: 500,
        }}>

          {/* ── Sidebar: Contacts ─────────────────────────────── */}
          <div style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '18px 20px',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{t('chat.title')}</h2>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: connected ? 'var(--color-success)' : 'var(--color-danger)',
                display: 'inline-block',
              }} title={connected ? t('chat.online') : t('chat.offline')} />
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {contacts.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>👥</div>
                  <p>{t('chat.no_contacts')}</p>
                  <p style={{ fontSize: 12, marginTop: 6 }}>{t('chat.book_to_chat')}</p>
                </div>
              ) : (
                contacts.map(contact => (
                  <div
                    key={contact.id}
                    onClick={() => loadMessages(contact)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '14px 20px',
                      cursor: 'pointer',
                      background: activeContact?.id === contact.id
                        ? 'var(--color-primary-light)'
                        : 'transparent',
                      borderBottom: '1px solid var(--color-border-muted)',
                      transition: 'background 150ms',
                    }}
                    onMouseEnter={e => {
                      if (activeContact?.id !== contact.id)
                        e.currentTarget.style.background = 'var(--color-surface-2)';
                    }}
                    onMouseLeave={e => {
                      if (activeContact?.id !== contact.id)
                        e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {/* Avatar */}
                    <div style={{
                      position: 'relative',
                      width: 40, height: 40,
                      borderRadius: '50%',
                      background: 'var(--color-primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: 700, fontSize: 16,
                      flexShrink: 0,
                    }}>
                      {contact.fullName[0]}
                      {/* Online dot */}
                      {isOnline(contact.id) && (
                        <span style={{
                          position: 'absolute', bottom: 1, right: 1,
                          width: 10, height: 10,
                          borderRadius: '50%',
                          background: 'var(--color-success)',
                          border: '2px solid var(--color-surface)',
                        }} />
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {['DOCTOR', 'SPECIALIST'].includes(contact.accountType) ? 'د. ' : ''}
                        {contact.fullName}
                      </div>
                      {contact.doctorVerification?.specialty && (
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                          {contact.doctorVerification.specialty}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── Chat Window ───────────────────────────────────── */}
          <div style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}>
            {activeContact ? (
              <>
                {/* Header */}
                <div style={{
                  padding: '16px 24px',
                  borderBottom: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}>
                  <div style={{
                    width: 40, height: 40,
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 700, fontSize: 16,
                  }}>
                    {activeContact.fullName[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>
                      {['DOCTOR', 'SPECIALIST'].includes(activeContact.accountType) ? 'د. ' : ''}
                      {activeContact.fullName}
                    </div>
                    <div style={{ fontSize: 12, color: isOnline(activeContact.id) ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                      {isTyping ? t('chat.typing') : isOnline(activeContact.id) ? t('chat.online') : t('chat.offline')}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {loadingMsgs ? (
                    <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: 40 }}>
                      <span className="spinner" style={{ width: 24, height: 24, margin: '0 auto', borderColor: 'rgba(13,148,136,.3)', borderTopColor: '#0d9488' }} />
                    </div>
                  ) : messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: 60, fontSize: 14 }}>
                      <div style={{ fontSize: 40, marginBottom: 10 }}>💬</div>
                      {t('chat.start_chat')} {['DOCTOR', 'SPECIALIST'].includes(activeContact.accountType) ? 'د. ' : ''}{activeContact.fullName}
                    </div>
                  ) : (
                    messages.map(msg => {
                      const isMine = msg.senderId === user?.id || msg.sender?.id === user?.id;
                      return (
                        <div key={msg.id} style={{
                          display: 'flex',
                          justifyContent: isMine ? 'flex-start' : 'flex-end',
                          width: '100%',
                        }}>
                          <div style={{
                            maxWidth: '70%',
                            padding: '10px 14px',
                            borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                            background: isMine ? 'var(--color-primary)' : 'var(--color-surface-2)',
                            color: isMine ? '#fff' : 'var(--color-text)',
                            fontSize: 14,
                            lineHeight: 1.6,
                            border: isMine ? 'none' : '1px solid var(--color-border)',
                            boxShadow: 'var(--shadow-input)',
                          }}>
                            {msg.content}
                            <div style={{
                              fontSize: 10,
                              marginTop: 4,
                              color: isMine ? 'rgba(255,255,255,0.65)' : 'var(--color-text-subtle)',
                              textAlign: 'left',
                            }}>
                              {new Date(msg.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Typing indicator */}
                  {isTyping && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <div style={{
                        padding: '10px 14px',
                        borderRadius: '18px 18px 18px 4px',
                        background: 'var(--color-surface-2)',
                        border: '1px solid var(--color-border)',
                        fontSize: 20,
                        letterSpacing: 2,
                        color: 'var(--color-text-muted)',
                      }}>
                        ···
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form
                  onSubmit={sendMessage}
                  style={{
                    padding: '16px 24px',
                    borderTop: '1px solid var(--color-border)',
                    display: 'flex',
                    gap: 10,
                  }}
                >
                  <input
                    id="chat-input"
                    type="text"
                    className="form-input"
                    placeholder={t('chat.placeholder')}
                    value={input}
                    onChange={handleInputChange}
                    style={{ flex: 1, margin: 0 }}
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!input.trim() || !connected}
                    style={{ padding: '10px 20px', flexShrink: 0 }}
                  >
                    {t('chat.send')}
                  </button>
                </form>
              </>
            ) : (
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-muted)',
              }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>💬</div>
                <h3 style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>{t('chat.select_to_start')}</h3>
                <p style={{ fontSize: 14 }}>{t('chat.select_from_list')}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
