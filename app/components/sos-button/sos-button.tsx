import styles from './sos-button.module.css';
import classNames from 'classnames';

interface SosButtonProps {
  phase: 'idle' | 'countdown' | 'active' | 'cancelling';
  countdown: number;
  onTrigger: () => void;
}

export function SosButton({ phase, countdown, onTrigger }: SosButtonProps) {
  const isActive = phase === 'active';
  const isCountdown = phase === 'countdown';
  const isPulsing = isActive || isCountdown;

  return (
    <div className={styles.container}>
      {isActive && (
        <div className={classNames(styles.statusBadge, styles.active)}>
          <span className={styles.statusDot} />
          EMERGENCY ACTIVE
        </div>
      )}
      {isCountdown && (
        <div className={classNames(styles.statusBadge, styles.countdown)}>
          <span className={styles.statusDot} />
          SENDING IN {countdown}s...
        </div>
      )}

      <div className={classNames(styles.rings, { [styles.pulsing]: isPulsing })}>
        <div className={styles.ring} />
        <div className={classNames(styles.ring, styles.ring1)} />
        <div className={classNames(styles.ring, styles.ring2)} />
        <div className={classNames(styles.ring, styles.ring3)} />

        <button
          className={classNames(styles.button, { [styles.beating]: isPulsing })}
          onClick={phase === 'idle' ? onTrigger : undefined}
          aria-label="Emergency SOS"
          type="button"
        >
          {isCountdown && (
            <div className={styles.countdownOverlay}>
              <span className={styles.countdownNumber}>{countdown}</span>
            </div>
          )}
          <span className={styles.buttonLabel}>SOS</span>
          <span className={styles.buttonSub}>Emergency</span>
        </button>
      </div>

      {phase === 'idle' && (
        <p className={styles.hintText}>Tap the button to trigger an emergency alert</p>
      )}
    </div>
  );
}
