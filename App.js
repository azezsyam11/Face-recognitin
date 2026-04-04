import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, StatusBar, Animated, FlatList, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  bg: '#0a0a0f',
  card: '#13131f',
  border: '#1e1e30',
  purple: '#9146FF',
  green: '#00ff88',
  yellow: '#FFD700',
  red: '#FF4444',
  text: '#e0e0e0',
  muted: '#666',
  twitch: '#9146FF',
  youtube: '#FF0000',
  tiktok: '#00F2EA',
};

const PLATFORMS = [
  { id: 'twitch', name: 'Twitch', color: '#9146FF', emoji: '🟣' },
  { id: 'youtube', name: 'YouTube', color: '#FF0000', emoji: '🔴' },
  { id: 'tiktok', name: 'TikTok', color: '#00F2EA', emoji: '⚫' },
];

const INITIAL_STREAMERS = [
  { id: 1, name: 'xQcOW', platform: 'twitch', viewers: 45230, live: true, game: 'GTA V' },
  { id: 2, name: 'Ninja', platform: 'twitch', viewers: 12800, live: false, game: 'Fortnite' },
  { id: 3, name: 'MrBeast', platform: 'youtube', viewers: 98000, live: true, game: 'IRL' },
  { id: 4, name: 'Pokimane', platform: 'twitch', viewers: 22000, live: true, game: 'Valorant' },
  { id: 5, name: 'Khaby', platform: 'tiktok', viewers: 55000, live: true, game: 'IRL' },
  { id: 6, name: 'Ludwig', platform: 'youtube', viewers: 8400, live: false, game: 'Chess' },
];

function formatViewers(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
}

function PlatformBadge({ platform }) {
  const p = PLATFORMS.find(x => x.id === platform);
  return (
    <View style={[styles.badge, { backgroundColor: (p?.color || '#888') + '33' }]}>
      <Text style={[styles.badgeText, { color: p?.color || '#888' }]}>{p?.name}</Text>
    </View>
  );
}

function StatCard({ icon, value, label, color }) {
  return (
    <View style={[styles.statCard]}>
      <Text style={{ fontSize: 22 }}>{icon}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────
function Dashboard({ streamers, tracked, alerts, keywords, setKeywords }) {
  const [newKw, setNewKw] = useState('');
  const liveTracked = streamers.filter(s => s.live && tracked.includes(s.id));
  const trackedCount = tracked.length;
  const liveCount = streamers.filter(s => s.live).length;

  const addKw = () => {
    const kw = newKw.trim();
    if (kw && !keywords.includes(kw)) {
      setKeywords(prev => [...prev, kw]);
      setNewKw('');
    }
  };

  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Stats Row */}
      <View style={styles.statsRow}>
        <StatCard icon="👥" value={streamers.length} label="الستريمرز" color={COLORS.purple} />
        <StatCard icon="🔴" value={liveCount} label="مباشر" color={COLORS.green} />
        <StatCard icon="👁" value={trackedCount} label="مراقَب" color={COLORS.yellow} />
        <StatCard icon="🔔" value={alerts.length} label="تنبيه" color={COLORS.red} />
      </View>

      {/* Live Tracked */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🟢 مباشرون الآن</Text>
        {liveTracked.length === 0 ? (
          <Text style={styles.emptyText}>لا أحد مباشر من قائمتك</Text>
        ) : (
          liveTracked.map(s => (
            <View key={s.id} style={styles.streamerRow}>
              <View style={[styles.liveDot, { backgroundColor: COLORS.green }]} />
              <Text style={styles.streamerName}>{s.name}</Text>
              <PlatformBadge platform={s.platform} />
              <Text style={styles.viewerCount}>👁 {formatViewers(s.viewers)}</Text>
            </View>
          ))
        )}
      </View>

      {/* Keywords */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 كلمات السنايب</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={newKw}
            onChangeText={setNewKw}
            placeholder="أضف كلمة..."
            placeholderTextColor={COLORS.muted}
            onSubmitEditing={addKw}
          />
          <TouchableOpacity style={styles.addBtn} onPress={addKw}>
            <Text style={{ color: '#fff', fontSize: 18 }}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.kwWrap}>
          {keywords.map(kw => (
            <TouchableOpacity key={kw} style={styles.kwChip}
              onLongPress={() => setKeywords(prev => prev.filter(k => k !== kw))}>
              <Text style={styles.kwText}>{kw}</Text>
              <Text style={{ color: COLORS.red, marginLeft: 4 }}>×</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Alerts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ آخر التنبيهات</Text>
        {alerts.length === 0 ? (
          <Text style={styles.emptyText}>لا توجد تنبيهات بعد</Text>
        ) : (
          alerts.slice(0, 5).map(a => (
            <View key={a.id} style={styles.alertRow}>
              <Text style={{ fontSize: 16 }}>🎯</Text>
              <View style={{ flex: 1, marginHorizontal: 8 }}>
                <Text style={styles.alertText}>
                  <Text style={{ fontWeight: '700' }}>{a.streamer}</Text>
                  {' — "'}
                  <Text style={{ color: COLORS.yellow }}>{a.keyword}</Text>
                  {'"'}
                </Text>
              </View>
              <Text style={styles.timeText}>{a.time}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

// ─── STREAMERS ────────────────────────────────────────────────
function Streamers({ streamers, setStreamers, tracked, setTracked }) {
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState('twitch');
  const [filter, setFilter] = useState('all');

  const add = () => {
    if (!name.trim()) return;
    setStreamers(prev => [...prev, {
      id: Date.now(), name: name.trim(), platform,
      viewers: 0, live: false, game: '—'
    }]);
    setName('');
  };

  const toggleTrack = (id) => {
    setTracked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const filtered = filter === 'all' ? streamers : streamers.filter(s => s.platform === filter);

  return (
    <View style={styles.tabContent}>
      {/* Add streamer */}
      <View style={styles.section}>
        <View style={styles.inputRow}>
          <TextInput style={[styles.input, { flex: 1 }]} value={name}
            onChangeText={setName} placeholder="اسم الستريمر..."
            placeholderTextColor={COLORS.muted} onSubmitEditing={add} />
          <TouchableOpacity style={styles.addBtn} onPress={add}>
            <Text style={{ color: '#fff', fontSize: 16 }}>+ إضافة</Text>
          </TouchableOpacity>
        </View>
        {/* Platform picker */}
        <View style={styles.inputRow}>
          {PLATFORMS.map(p => (
            <TouchableOpacity key={p.id}
              style={[styles.platBtn, platform === p.id && { borderColor: p.color, backgroundColor: p.color + '22' }]}
              onPress={() => setPlatform(p.id)}>
              <Text style={{ color: p.color, fontSize: 13 }}>{p.emoji} {p.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Filter */}
      <View style={[styles.inputRow, { marginBottom: 10, paddingHorizontal: 16 }]}>
        {['all', ...PLATFORMS.map(p => p.id)].map(f => (
          <TouchableOpacity key={f} onPress={() => setFilter(f)}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}>
            <Text style={{ color: filter === f ? '#fff' : COLORS.muted, fontSize: 12 }}>
              {f === 'all' ? 'الكل' : PLATFORMS.find(p => p.id === f)?.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={s => String(s.id)}
        renderItem={({ item: s }) => (
          <View style={styles.streamerCard}>
            <View style={[styles.platIcon, { backgroundColor: (PLATFORMS.find(p => p.id === s.platform)?.color || '#888') + '33' }]}>
              <Text style={{ fontSize: 18 }}>{PLATFORMS.find(p => p.id === s.platform)?.emoji}</Text>
            </View>
            <View style={{ flex: 1, marginHorizontal: 10 }}>
              <Text style={styles.streamerName}>{s.name}</Text>
              <Text style={{ color: COLORS.muted, fontSize: 12 }}>{s.platform} • {s.game}</Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 4 }}>
              <Text style={{ color: s.live ? COLORS.green : COLORS.muted, fontSize: 12 }}>
                {s.live ? `🔴 ${formatViewers(s.viewers)}` : '⚫ غير مباشر'}
              </Text>
              <TouchableOpacity
                style={[styles.trackBtn, tracked.includes(s.id) && styles.trackBtnActive]}
                onPress={() => toggleTrack(s.id)}>
                <Text style={{ color: tracked.includes(s.id) ? '#fff' : COLORS.muted, fontSize: 12 }}>
                  {tracked.includes(s.id) ? '✓ متابَع' : 'تابع'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

// ─── ALERTS ───────────────────────────────────────────────────
function Alerts({ alerts, setAlerts }) {
  return (
    <View style={styles.tabContent}>
      <View style={[styles.inputRow, { justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 12 }]}>
        <Text style={styles.sectionTitle}>🔔 التنبيهات ({alerts.length})</Text>
        <TouchableOpacity onPress={() => setAlerts([])} style={styles.clearBtn}>
          <Text style={{ color: COLORS.red, fontSize: 13 }}>مسح الكل</Text>
        </TouchableOpacity>
      </View>
      {alerts.length === 0 ? (
        <Text style={[styles.emptyText, { marginTop: 60 }]}>لا توجد تنبيهات بعد</Text>
      ) : (
        <FlatList
          data={alerts}
          keyExtractor={a => String(a.id)}
          renderItem={({ item: a }) => (
            <View style={styles.alertCard}>
              <Text style={{ fontSize: 20 }}>🎯</Text>
              <View style={{ flex: 1, marginHorizontal: 10 }}>
                <Text style={styles.alertText}>
                  كلمة "<Text style={{ color: COLORS.yellow, fontWeight: '700' }}>{a.keyword}</Text>"
                  {' في بث '}<Text style={{ fontWeight: '700' }}>{a.streamer}</Text>
                </Text>
                <Text style={{ color: COLORS.muted, fontSize: 12 }}>المنصة: {a.platform}</Text>
              </View>
              <Text style={styles.timeText}>{a.time}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

// ─── LOGS ─────────────────────────────────────────────────────
function Logs({ logs, setLogs }) {
  return (
    <View style={styles.tabContent}>
      <View style={[styles.inputRow, { justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 12 }]}>
        <Text style={styles.sectionTitle}>📋 سجل الأحداث</Text>
        <TouchableOpacity onPress={() => setLogs([])} style={styles.clearBtn}>
          <Text style={{ color: COLORS.muted, fontSize: 13 }}>مسح</Text>
        </TouchableOpacity>
      </View>
      {logs.length === 0 ? (
        <Text style={[styles.emptyText, { marginTop: 60 }]}>السجل فارغ</Text>
      ) : (
        <FlatList
          data={logs}
          keyExtractor={l => String(l.id)}
          renderItem={({ item: l, index }) => (
            <View style={[styles.logRow, { opacity: Math.max(0.4, 1 - index * 0.015) }]}>
              <Text style={{ color: l.type === 'live' ? COLORS.green : COLORS.text, flex: 1, fontSize: 13 }}>{l.msg}</Text>
              <Text style={styles.timeText}>{l.time}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [streamers, setStreamers] = useState(INITIAL_STREAMERS);
  const [tracked, setTracked] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [keywords, setKeywords] = useState(['snipe', 'clip', 'GG', 'سنايب']);
  const alertId = useRef(0);
  const logId = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStreamers(prev => prev.map(s => ({
        ...s,
        viewers: s.live ? Math.max(0, s.viewers + Math.floor((Math.random() - 0.4) * 400)) : s.viewers
      })));

      setStreamers(prev => {
        if (Math.random() < 0.3 && keywords.length > 0) {
          const live = prev.filter(s => s.live && tracked.includes(s.id));
          if (live.length > 0) {
            const s = live[Math.floor(Math.random() * live.length)];
            const kw = keywords[Math.floor(Math.random() * keywords.length)];
            const newAlert = {
              id: alertId.current++,
              streamer: s.name,
              platform: s.platform,
              keyword: kw,
              time: new Date().toLocaleTimeString('ar-SA'),
            };
            setAlerts(a => [newAlert, ...a].slice(0, 30));
            setLogs(l => [{
              id: logId.current++,
              msg: `🎯 كلمة "${kw}" رُصدت في بث ${s.name}`,
              time: new Date().toLocaleTimeString('ar-SA'),
              type: 'keyword'
            }, ...l].slice(0, 60));
          }
        }
        if (Math.random() < 0.07) {
          const off = prev.filter(s => !s.live && tracked.includes(s.id));
          if (off.length > 0) {
            const s = off[Math.floor(Math.random() * off.length)];
            setLogs(l => [{
              id: logId.current++,
              msg: `🟢 ${s.name} بدأ البث الآن على ${s.platform}!`,
              time: new Date().toLocaleTimeString('ar-SA'),
              type: 'live'
            }, ...l].slice(0, 60));
            return prev.map(x => x.id === s.id ? { ...x, live: true } : x);
          }
        }
        return prev;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [tracked, keywords]);

  const TABS = [
    { id: 'dashboard', label: 'لوحة', icon: '📊' },
    { id: 'streamers', label: 'ستريمرز', icon: '🎮' },
    { id: 'alerts', label: 'تنبيهات', icon: '🔔' },
    { id: 'logs', label: 'سجل', icon: '📋' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>🎯 Stream<Text style={{ color: COLORS.purple }}>Snipe</Text></Text>
        <View style={styles.headerStats}>
          <Text style={{ color: COLORS.purple, fontSize: 12 }}>📡 {tracked.length}</Text>
          <Text style={{ color: COLORS.green, fontSize: 12, marginHorizontal: 8 }}>
            🟢 {streamers.filter(s => s.live && tracked.includes(s.id)).length}
          </Text>
          <Text style={{ color: COLORS.yellow, fontSize: 12 }}>🔔 {alerts.length}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        {tab === 'dashboard' && <Dashboard streamers={streamers} tracked={tracked} alerts={alerts} keywords={keywords} setKeywords={setKeywords} />}
        {tab === 'streamers' && <Streamers streamers={streamers} setStreamers={setStreamers} tracked={tracked} setTracked={setTracked} />}
        {tab === 'alerts' && <Alerts alerts={alerts} setAlerts={setAlerts} />}
        {tab === 'logs' && <Logs logs={logs} setLogs={setLogs} />}
      </View>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        {TABS.map(t => (
          <TouchableOpacity key={t.id} style={styles.navItem} onPress={() => setTab(t.id)}>
            <Text style={{ fontSize: 20 }}>{t.icon}</Text>
            <Text style={[styles.navLabel, tab === t.id && { color: COLORS.purple }]}>{t.label}</Text>
            {tab === t.id && <View style={styles.navDot} />}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, backgroundColor: '#0d0d1a', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  logo: { fontSize: 18, fontWeight: '700', color: '#fff' },
  headerStats: { flexDirection: 'row', alignItems: 'center' },
  tabContent: { flex: 1 },
  statsRow: { flexDirection: 'row', padding: 14, gap: 10 },
  statCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  statValue: { fontSize: 20, fontWeight: '700', marginVertical: 2 },
  statLabel: { fontSize: 10, color: COLORS.muted },
  section: { backgroundColor: COLORS.card, marginHorizontal: 14, marginBottom: 14, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: COLORS.border },
  sectionTitle: { color: '#fff', fontWeight: '700', fontSize: 14, marginBottom: 10 },
  emptyText: { color: COLORS.muted, textAlign: 'center', padding: 20, fontSize: 13 },
  streamerRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#1a1a2e' },
  liveDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  streamerName: { flex: 1, color: '#fff', fontWeight: '600', fontSize: 14 },
  viewerCount: { color: COLORS.green, fontSize: 13 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20, marginHorizontal: 6 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  input: { backgroundColor: '#1a1a2e', borderWidth: 1, borderColor: '#2a2a40', borderRadius: 8, padding: 10, color: COLORS.text, fontSize: 14 },
  addBtn: { backgroundColor: COLORS.purple, borderRadius: 8, padding: 10, paddingHorizontal: 14 },
  kwWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  kwChip: { backgroundColor: '#1e1e30', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, flexDirection: 'row', alignItems: 'center' },
  kwText: { color: COLORS.text, fontSize: 13 },
  alertRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: '#1a1a2e' },
  alertText: { color: COLORS.text, fontSize: 13 },
  timeText: { color: COLORS.muted, fontSize: 11 },
  streamerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, marginHorizontal: 14, marginBottom: 8, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: COLORS.border },
  platIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  platBtn: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 8, alignItems: 'center' },
  filterBtn: { flex: 1, borderRadius: 8, padding: 7, alignItems: 'center', backgroundColor: COLORS.card },
  filterBtnActive: { backgroundColor: COLORS.purple + '33', borderWidth: 1, borderColor: COLORS.purple },
  trackBtn: { backgroundColor: '#1e1e30', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 5 },
  trackBtnActive: { backgroundColor: COLORS.purple },
  alertCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, marginHorizontal: 14, marginBottom: 8, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: COLORS.border },
  clearBtn: { backgroundColor: '#1a1a1a', borderRadius: 8, padding: 6, paddingHorizontal: 12 },
  logRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#1a1a2e' },
  bottomNav: { flexDirection: 'row', backgroundColor: '#0d0d1a', borderTopWidth: 1, borderTopColor: COLORS.border, paddingBottom: 4 },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  navLabel: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  navDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: COLORS.purple, marginTop: 2 },
});
