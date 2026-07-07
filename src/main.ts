import * as Phaser from 'phaser';
import { BootScene, HomeScene, WardrobeScene } from './scenes/HomeScene';
import { StudyScene } from './scenes/StudyScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 390,
    height: 844,
  },
  backgroundColor: '#E8F0FF',
  parent: 'game',
  scene: [BootScene, HomeScene, StudyScene, WardrobeScene],
};

const game = new Phaser.Game(config);

game.events.once('ready', () => {
  const loader = document.getElementById('loading');
  if (loader) {
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 600);
  }
});

export default game;
