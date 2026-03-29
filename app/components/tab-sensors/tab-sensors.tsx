import { Smartphone, Mic, Radio, WifiOff, BatteryLow, Camera, Shield, AlertTriangle, Bluetooth } from 'lucide-react';
import classNames from 'classnames';
import type { SensorsReturn } from '~/hooks/use-sensors';
import type { BatteryStatus } from '~/hooks/use-battery';
import type { OfflineStatus } from '~/hooks/use-offline';
import type { SafeZone } from '~/hooks/use-safe-zones';
import type { EvidenceEntry } from '~/hooks/use-evidence';
import type { Location } from '~/hooks/use-sos';
import styles from './tab-sensors.module.css';

interface TabSensorsProps {
  sensors: SensorsReturn;
  battery: BatteryStatus;
  offline: OfflineStatus;
  zones: SafeZone[];
  currentZone: SafeZone | null;
  nearestSafe: SafeZone | null;
  location: Location | null;
  evidence: EvidenceEntry[];
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onCapturePhoto: () => void;
  onClearEvidence: () => void;
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      className={classNames(styles.toggle, { [styles.on]: on })}
      onClick={onToggle}
      type="button"
      aria-pressed={on}
    >
      <span className={styles.toggleThumb} />
    </button>
  );
}

function BatteryLevel({ level }: { level: number }) {
  const cls = level > 0.5 ? 'high' : level > 0.15 ? 'medium' : 'low';
  return (
    <div className={styles.batteryMeter}>
      <div
        className={classNames(styles.batteryFill, styles[cls])}
        style={{ width: `${Math.round(level * 100)}%` }}
      />
    </div>
  );
}

export function TabSensors({
  sensors,
  battery,
  offline,
  zones,
  currentZone,
  nearestSafe,
  location,
  evidence,
  isRecording,
  onStartRecording,
  onStopRecording,
  onCapturePhoto,
  onClearEvidence,
}: TabSensorsProps) {
  const SHAKE_MAX = 3;

  return (
    <div className={styles.page}>
      <div className={styles.title}>Smart Detection</div>

      <div className={styles.sectionTitle}>Active Sensors</div>
      <div className={styles.sensorGrid}>
        <div
          className={classNames(
            styles.sensorCard,
            sensors.config.shakeEnabled && styles.active,
            sensors.shakeDetected && styles.triggered
          )}
        >
          <div className={styles.sensorLeft}>
            <div className={styles.sensorIcon}><Smartphone size={18} /></div>
            <div className={styles.sensorInfo}>
              <div className={styles.sensorName}>Shake Detection</div>
              <div className={styles.sensorStatus}>
                {sensors.shakeDetected
                  ? `Shake detected! (${sensors.shakeCount}/${SHAKE_MAX})`
                  : sensors.config.shakeEnabled
                  ? 'Listening — shake 3x to trigger SOS'
                  : 'Disabled'}
              </div>
              {sensors.config.shakeEnabled && (
                <div className={styles.shakeBar}>
                  {Array.from({ length: SHAKE_MAX }).map((_, i) => (
                    <div
                      key={i}
                      className={classNames(styles.shakeSegment, { [styles.filled]: i < sensors.shakeCount })}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          <Toggle on={sensors.config.shakeEnabled} onToggle={() => sensors.toggleConfig('shakeEnabled')} />
        </div>

        <div
          className={classNames(
            styles.sensorCard,
            sensors.config.voiceEnabled && styles.active,
            sensors.voiceDetected && styles.triggered
          )}
        >
          <div className={styles.sensorLeft}>
            <div className={styles.sensorIcon}><Mic size={18} /></div>
            <div className={styles.sensorInfo}>
              <div className={styles.sensorName}>Voice Activation</div>
              <div className={styles.sensorStatus}>
                {sensors.voiceDetected
                  ? 'Emergency keyword detected!'
                  : sensors.config.voiceEnabled
                  ? 'Listening for Help, SOS, Emergency'
                  : 'Disabled — say Help me to trigger SOS'}
              </div>
            </div>
          </div>
          <Toggle on={sensors.config.voiceEnabled} onToggle={() => sensors.toggleConfig('voiceEnabled')} />
        </div>

        <div
          className={classNames(
            styles.sensorCard,
            sensors.config.motionEnabled && styles.active
          )}
        >
          <div className={styles.sensorLeft}>
            <div className={styles.sensorIcon}><Radio size={18} /></div>
            <div className={styles.sensorInfo}>
              <div className={styles.sensorName}>Motion Monitoring</div>
              <div className={styles.sensorStatus}>
                {sensors.config.motionEnabled
                  ? 'Monitoring accelerometer for danger patterns'
                  : 'Disabled'}
              </div>
            </div>
          </div>
          <Toggle on={sensors.config.motionEnabled} onToggle={() => sensors.toggleConfig('motionEnabled')} />
        </div>
      </div>

      <div className={styles.sectionTitle}>Safe Zone Map</div>
      <div className={styles.zonesCard}>
        <div className={styles.zoneMap}>
          <div className={styles.mapGrid} />
          <div className={classNames(styles.mapDot, styles.danger)} style={{ width: 56, height: 56, top: '55%', left: '20%', transform: 'translate(-50%,-50%)' }} />
          <div className={classNames(styles.mapDot, styles.danger)} style={{ width: 44, height: 44, top: '30%', left: '72%', transform: 'translate(-50%,-50%)' }} />
          <div className={classNames(styles.mapDot, styles.safe)} style={{ width: 44, height: 44, top: '25%', left: '30%', transform: 'translate(-50%,-50%)' }} />
          <div className={classNames(styles.mapDot, styles.safe)} style={{ width: 34, height: 34, top: '65%', left: '60%', transform: 'translate(-50%,-50%)' }} />
          <div className={classNames(styles.mapDot, styles.safe)} style={{ width: 28, height: 28, top: '50%', left: '82%', transform: 'translate(-50%,-50%)' }} />
          <div style={{ position: 'absolute', top: '45%', left: '48%', transform: 'translate(-50%,-50%)' }}>
            <div className={styles.mapUserPulse} />
            <div className={styles.mapUser} />
          </div>
          <div className={styles.mapLegend}>
            <div className={styles.legendItem}><div className={classNames(styles.legendDot, styles.safe)} /> Safe</div>
            <div className={styles.legendItem}><div className={classNames(styles.legendDot, styles.danger)} /> Danger</div>
            <div className={styles.legendItem}><div className={classNames(styles.legendDot, styles.user)} /> You</div>
          </div>
        </div>

        <div className={styles.zonesBody}>
          <div className={classNames(styles.currentZone, currentZone ? styles[currentZone.type] : '')}>
            <div style={{ flex: 1 }}>
              <div className={styles.zoneLabel}>Current Zone</div>
              <div className={styles.zoneName}>{currentZone ? currentZone.name : 'Unknown / Safe Area'}</div>
              {currentZone && <div className={styles.zoneDesc}>{currentZone.description}</div>}
            </div>
            <div className={classNames(styles.zoneTypeTag, currentZone ? styles[currentZone.type] : styles.neutral)}>
              {currentZone ? currentZone.type.toUpperCase() : 'OK'}
            </div>
          </div>

          {nearestSafe && !location && (
            <div className={styles.currentZone}>
              <Shield size={16} style={{ color: 'var(--color-safe)', flexShrink: 0 }} />
              <div>
                <div className={styles.zoneLabel}>Nearest Safe Zone</div>
                <div className={styles.zoneName}>{nearestSafe.name}</div>
              </div>
            </div>
          )}

          <div className={styles.sectionTitle} style={{ marginBottom: 0 }}>Known Zones</div>
          <div className={styles.zonesList}>
            {zones.map((z) => (
              <div key={z.id} className={styles.zoneRow}>
                {z.type === 'safe'
                  ? <Shield size={13} style={{ color: 'var(--color-safe)', flexShrink: 0 }} />
                  : <AlertTriangle size={13} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />}
                <div className={styles.zoneRowName}>{z.name}</div>
                <div className={classNames(styles.zoneTypeTag, styles[z.type])}>{z.type}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.sectionTitle}>Offline &amp; Connectivity</div>
      <div className={styles.offlineCard}>
        <div className={styles.offlineStatus}>
          <span className={classNames(styles.statusChip, offline.isOnline ? styles.online : styles.offline)}>
            <span className={styles.chipDot} />
            {offline.isOnline ? 'Online' : 'Offline'}
          </span>
          {offline.bluetoothAvailable && (
            <span className={classNames(styles.statusChip, styles.online)}>
              <Bluetooth size={11} />
              BT Relay Ready
            </span>
          )}
          {!offline.isOnline && (
            <span className={classNames(styles.statusChip, styles.offline)}>
              <WifiOff size={11} />
              No Network
            </span>
          )}
        </div>

        <div className={styles.offlineStats}>
          <div className={styles.offlineStat}>
            <div className={styles.offlineStatNum}>{offline.offlineSmsQueued}</div>
            <div className={styles.offlineStatLabel}>SMS Queued</div>
          </div>
          <div className={styles.offlineStat}>
            <div className={styles.offlineStatNum}>{offline.offlineSmsDelivered}</div>
            <div className={styles.offlineStatLabel}>Delivered</div>
          </div>
          <div className={styles.offlineStat}>
            <div className={styles.offlineStatNum}>
              {offline.lastSyncTime
                ? new Date(offline.lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '--'}
            </div>
            <div className={styles.offlineStatLabel}>Last Sync</div>
          </div>
        </div>

        {offline.relayActive && (
          <div className={styles.relayRow}>
            <Bluetooth size={13} />
            Routing SMS via Bluetooth relay to nearby device with signal...
          </div>
        )}

        <div className={styles.ultraLow}>
          When offline, SMS alerts are queued and routed via Bluetooth to nearby devices with signal.
          Messages deliver as soon as connectivity is restored.
        </div>
      </div>

      <div className={styles.sectionTitle}>Battery &amp; Power</div>
      <div className={styles.batteryCard}>
        <div className={styles.batteryRow}>
          <BatteryLow size={18} style={{ color: battery.isLow ? 'var(--color-primary)' : 'var(--color-text-muted)', flexShrink: 0 }} />
          <BatteryLevel level={battery.level} />
          <div className={styles.batteryPct}>
            {Math.round(battery.level * 100)}%
            {battery.charging ? ' ⚡' : ''}
          </div>
        </div>

        {battery.isLow && !battery.isCritical && (
          <div className={styles.batteryWarning}>
            <AlertTriangle size={13} />
            Low battery — minimal resources active. SOS stays fully operational.
          </div>
        )}

        {battery.isCritical && (
          <div className={styles.batteryWarning}>
            <AlertTriangle size={13} />
            Critical battery (1%) — Ultra-low power mode. Only SOS core is running.
          </div>
        )}

        <div className={styles.ultraLow}>
          {battery.ultraLowPower
            ? 'Screen refresh and animations paused. Emergency alerts and sensors remain active.'
            : 'App operates normally. Battery saver activates automatically below 15%.'}
        </div>
      </div>

      <div className={styles.sectionTitle}>Evidence Recorder</div>
      <div className={styles.evidenceCard}>
        <div className={styles.evidenceHeader}>
          <div className={styles.evidenceTitle}>
            {isRecording && <span className={styles.recBadge} />}
            {isRecording ? 'Recording...' : 'Auto Evidence'}
          </div>
          <div className={styles.evidenceBtns}>
            <button
              className={classNames(styles.evidenceBtn, isRecording && styles.danger)}
              onClick={isRecording ? onStopRecording : onStartRecording}
              type="button"
            >
              <Mic size={11} />
              {isRecording ? 'Stop' : 'Record'}
            </button>
            <button className={styles.evidenceBtn} onClick={onCapturePhoto} type="button">
              <Camera size={11} /> Photo
            </button>
            {evidence.length > 0 && (
              <button className={styles.evidenceBtn} onClick={onClearEvidence} type="button">
                Clear
              </button>
            )}
          </div>
        </div>

        {evidence.length === 0 ? (
          <div className={styles.evidenceEmpty}>
            No evidence captured yet. Start recording or take a photo during an emergency.
          </div>
        ) : (
          <div className={styles.evidenceList}>
            {evidence.map((e) => (
              <div key={e.id} className={styles.evidenceItem}>
                {e.type === 'photo' && e.dataUrl ? (
                  <img src={e.dataUrl} alt={e.label} className={styles.evidenceImg} />
                ) : (
                  <div className={styles.evidenceThumb}>
                    {e.type === 'audio' ? <Mic size={16} /> : <Camera size={16} />}
                  </div>
                )}
                <div style={{ minWidth: 0 }}>
                  <div className={styles.evidenceItemLabel}>{e.label}</div>
                  <div className={styles.evidenceItemTime}>{e.timestamp.toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
