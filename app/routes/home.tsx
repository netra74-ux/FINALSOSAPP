import type { Route } from './+types/home';
import { useState, useEffect } from 'react';
import { useAuth } from '~/hooks/use-auth';
import { useSos } from '~/hooks/use-sos';
import { useContacts } from '~/hooks/use-contacts';
import { useSensors } from '~/hooks/use-sensors';
import { useBattery } from '~/hooks/use-battery';
import { useOffline } from '~/hooks/use-offline';
import { useSafeZones } from '~/hooks/use-safe-zones';
import { useEvidence } from '~/hooks/use-evidence';
import { AuthScreen } from '~/components/auth-screen/auth-screen';
import { TopBar } from '~/components/top-bar/top-bar';
import { BottomNav } from '~/components/bottom-nav/bottom-nav';
import type { NavTab } from '~/components/bottom-nav/bottom-nav';
import { TabHome } from '~/components/tab-home/tab-home';
import { TabContacts } from '~/components/tab-contacts/tab-contacts';
import { TabLocation } from '~/components/tab-location/tab-location';
import { TabLogs } from '~/components/tab-logs/tab-logs';
import { TabProfile } from '~/components/tab-profile/tab-profile';
import { TabSensors } from '~/components/tab-sensors/tab-sensors';
import styles from './home.module.css';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Emergency SOS — One-Tap Safety System' },
    { name: 'description', content: 'Emergency SOS App: one-tap emergency alerts with live location sharing and instant contact notifications.' },
    { name: 'theme-color', content: '#dc2626' },
  ];
}

export default function Home() {
  const { isAuthenticated, user, authError, authMode, setAuthMode, login, signup, logout } = useAuth();
  const { phase, countdown, location, alertsSent, elapsedSeconds, logs, triggerSos, cancelCountdown, cancelSos, resolveSos } = useSos();
  const { contacts, addContact, removeContact } = useContacts();
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  const battery = useBattery();
  const offline = useOffline();
  const { zones, evaluateLocation, getCurrentZone, getNearestSafeZone } = useSafeZones();
  const { entries: evidence, isRecording, startRecording, stopRecording, capturePhoto, clearEvidence } = useEvidence();

  // Wire sensors to auto-trigger SOS
  const sensors = useSensors(() => {
    if (phase === 'idle') triggerSos();
  });

  const { status: offlineStatus, queueSms } = offline;

  // Evaluate safe/danger zone whenever location updates
  useEffect(() => {
    if (!location) return;
    evaluateLocation(location, (zone) => {
      if (!offlineStatus.isOnline) {
        contacts.forEach((c) => {
          queueSms(
            c.phone,
            `DANGER ALERT: ${user?.name ?? 'User'} has entered a danger zone: ${zone.name}. Location: ${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`
          );
        });
      }
    });
  }, [location, offlineStatus.isOnline, contacts, user, evaluateLocation, queueSms]);

  if (!isAuthenticated || !user) {
    return (
      <AuthScreen
        authMode={authMode}
        authError={authError}
        onLogin={login}
        onSignup={signup}
        onModeChange={setAuthMode}
      />
    );
  }

  const isEmergencyActive = phase === 'active' || phase === 'countdown';
  const isTracking = phase === 'active';
  const currentZone = getCurrentZone(location);
  const nearestSafe = getNearestSafeZone(location);

  return (
    <div className={styles.appShell}>
      <TopBar isEmergencyActive={isEmergencyActive} battery={battery} onLogout={logout} />

      <main className={styles.main}>
        {activeTab === 'home' && (
          <TabHome
            user={user}
            phase={phase}
            countdown={countdown}
            location={location}
            alertsSent={alertsSent}
            elapsedSeconds={elapsedSeconds}
            contactCount={contacts.length}
            totalLogs={logs.length}
            currentZone={currentZone}
            sensorsActive={sensors.config.shakeEnabled || sensors.config.voiceEnabled}
            battery={battery}
            onTrigger={triggerSos}
            onCancelCountdown={cancelCountdown}
            onCancelSos={cancelSos}
            onResolveSos={resolveSos}
          />
        )}
        {activeTab === 'contacts' && (
          <TabContacts contacts={contacts} onAdd={addContact} onRemove={removeContact} />
        )}
        {activeTab === 'location' && (
          <TabLocation location={location} isTracking={isTracking} />
        )}
        {activeTab === 'sensors' && (
          <TabSensors
            sensors={sensors}
            battery={battery}
            offline={offlineStatus}
            zones={zones}
            currentZone={currentZone}
            nearestSafe={nearestSafe}
            location={location}
            evidence={evidence}
            isRecording={isRecording}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            onCapturePhoto={capturePhoto}
            onClearEvidence={clearEvidence}
          />
        )}
        {activeTab === 'logs' && <TabLogs logs={logs} />}
        {activeTab === 'profile' && <TabProfile user={user} onLogout={logout} />}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} contactCount={contacts.length} />
    </div>
  );
}
