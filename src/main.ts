import * as Phaser from 'phaser';
import { BootScene, HomeScene, WardrobeScene } from './scenes/HomeScene';
import { StudyScene } from './scenes/StudyScene';
import { GAME_WIDTH, GAME_HEIGHT } from './config';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  render: {
    antialias: true,
    roundPixels: true,
    pixelArt: false,
    antialiasGL: true,
  },
  backgroundColor: '#D6EAFA',
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
