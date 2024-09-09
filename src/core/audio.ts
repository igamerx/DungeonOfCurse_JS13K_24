import { audioFX } from "./SFX";

class AudioFx {
    constructor() {
    }

    playSound() {
    }

    playDashFx() {
        const dash = (i: number) => 
            Math.sin(i * 0.02 + 9 * Math.sin(i * 0.002)) * Math.exp(-i / 5000);
        
        audioFX.playSound(dash);

    }

    playKeyPickupFx() {
        const key = (i: number) => (i%10 < 5 ? 1 : -1) * Math.exp(-i/4000);
        
        audioFX.playSound(key);
    }

    playSwordAttackFx() {
        const sward = (i: number) => 
            (Math.random() * 2 - 1) * Math.exp(-i/1000) + Math.sin(i/50) * Math.exp(-i/2000);
        audioFX.playSound(sward);
    }

    playHealthPickupFx() {
        const pickup = (i: number) => 
            Math.sin(i / 50) * Math.sin(i * 0.03) * Math.pow(1 - i/100000, 8);
        audioFX.playSound(pickup);
    }

    playPlayerGetHitFx() {
        const playerGotHit = (i: number) =>  Math.sin(i / 50 + 5 * Math.sin(i/1000)) * Math.exp(-i/6000);        
        audioFX.playSound(playerGotHit);
    }

    playPlayerDieFx() {
    }

    playBatEnemyHitFx() {
        const sward = (i: number) => 
            Math.sin(i/100 + Math.random()*50) * Math.exp(-i/8000);

        
        audioFX.playSound(sward);
    }

    playSkullEnemyHitFx() {
        const sward = (i: number) => 
            (Math.random() * 2 - 1) * Math.sin(i/50) * Math.exp(-i/5000);
        audioFX.playSound(sward);
    }

    playDoorOpenFx() {
        const doorOpenSample = (i: number) => Math.sin(i/40) * Math.sin(i*0.003 + 1.5*Math.sin(i/700)) * Math.exp(-i/10000);        
        audioFX.playSound(doorOpenSample);
    }

    playGameWinFx() {
        const winsound = (i: number): number => {
            const n = 11e4;
            if (i > n) return 0;
            const q = (n - i) / n; 
            return Math.sin(i * 0.0001 * Math.sin(0.009 * i + Math.sin(i / 200)) + Math.sin(i / 100)) * q * q;
        };
        audioFX.playSound(winsound);
    }
}

export const audio = new AudioFx();