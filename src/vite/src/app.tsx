import React from 'react';
import * as PIXI from 'pixi.js';
import './app.less';

import rainDrapUrl from './image/rainDrap.png';
function getRandomInt(min: number, max: number) {
  // Math.floor向下取整，Math.random()返回一个[0, 1)的随机数
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandom(min: number, max: number) {
  // Math.floor向下取整，Math.random()返回一个[0, 1)的随机数
  return Math.random() * (max - min + 1) + min;
}

const names = ['迪迦', '赛文', '艾斯', '泰罗', '雷欧', '高斯'];

interface IRainDrap {
  sprite: PIXI.Sprite;
  speed: number;
  name: string;
}

interface IText {
  text: PIXI.Text;
  originPoint: { x: number; y: number };
}

interface IOpts {}
class LuckyRain {
  private app: PIXI.Application<PIXI.ICanvas>;
  private rainDrapList: IRainDrap[] = [];
  private TipTextList: IText[] = [];
  rainInterval = 300;
  tempRainInterval = 0;
  constructor(container: HTMLElement, opts?: IOpts) {
    this.app = new PIXI.Application({
      width: container.offsetWidth,
      height: container.offsetHeight,
      background: '#1099bb',
    });
    container.appendChild(this.app.view as unknown as Node);
    this.init();
  }

  private init() {
    // 去加载 红包图片
    this.start();
  }

  crateRainDrap() {
    const sprite = PIXI.Sprite.from(rainDrapUrl);
    sprite.anchor.set(0.5);
    sprite.width = 50;
    sprite.height = 50;
    // move the sprite to the center of the screen
    sprite.x = getRandomInt(25, this.app.screen.width - 25);
    sprite.y = -25;
    sprite.interactive = true;
    // sprite.eventMode = PIXI.InteractionEventMode.AUTO;
    // sprite.on('mousedown', onSpriteClicked);
    sprite.on('touchstart', onSpriteClicked);
    const rainDrap: IRainDrap = {
      sprite,
      name: names[getRandomInt(0, names.length - 1)],
      speed: getRandom(2, 5),
    };
    const app = this.app;
    const self = this;
    // 点击事件处理程序
    function onSpriteClicked(event: any) {
      const text = new PIXI.Text(`+1 ${rainDrap.name}`, {
        fontSize: 12,
        fill: '#FFD442',
      });
      const { x, y } = event.data.getLocalPosition(sprite.parent);
      text.x = x;
      text.y = y;

      self.TipTextList.push({
        text,
        originPoint: { x, y },
      });
      // text.x =
      app.stage.addChild(text);

      // // 在两秒钟后销毁文字对象
      // setTimeout(() => {
      //   // 从舞台上移除文字对象
      //   app.stage.removeChild(text);
      //   // 销毁文字对象
      //   text.destroy();
      // }, 2000);
      // 从舞台上移除Sprite对象
      app.stage.removeChild(sprite);
      // 销毁Sprite对象
      sprite.destroy();
    }

    return rainDrap;
  }
  rain(deltaTime: number) {
    // jian;
    if (this.tempRainInterval === 0) {
      const count = getRandomInt(1, 5);
      for (let index = 0; index < count; index++) {
        const rainDrap = this.crateRainDrap();
        this.rainDrapList.push(rainDrap);
        this.app.stage.addChild(rainDrap.sprite);
      }
    }
    this.tempRainInterval += deltaTime;
    if (this.tempRainInterval > this.rainInterval) {
      this.tempRainInterval = 0;
    }
  }

  start() {
    let lastTime = performance.now();
    this.app.ticker.add((delta) => {
      const now = performance.now();
      const deltaTime = now - lastTime; // 计算自上一帧以来的时间差
      lastTime = now;

      // just for fun, let's rotate mr rabbit a little
      // delta is 1 if running at 100% performance
      // creates frame-independent transformation
      this.rain(deltaTime);
      for (let i = 0; i < this.rainDrapList.length; i++) {
        const rainDrap = this.rainDrapList[i];
        const sprite = rainDrap.sprite;
        if (!sprite._destroyed) {
          sprite.y += delta * rainDrap.speed;
          if (sprite.y > this.app.renderer.height) {
            this.app.stage.removeChild(sprite);
            sprite.destroy();
            this.rainDrapList.splice(i, 1);
          }
        }
      }

      for (let i = 0; i < this.TipTextList.length; i++) {
        const tipText = this.TipTextList[i];

        const { text } = tipText;
        if (!text._destroyed) {
          text.y = text.y - 2;

          let alpha = 1 - (tipText.originPoint.y - text.y) / 200;
          alpha = alpha < 0.5 ? 0.5 : alpha;

          text.alpha = alpha;

          if (text.y < tipText.originPoint.y - 100) {
            this.app.stage.removeChild(text);
            text.destroy();
            this.TipTextList.splice(i, 1);
          }
        }
      }
    });
    // console.log(this.app);
  }
  createRaindrop() {}
}

export default function App() {
  const app = React.useRef<LuckyRain>();
  React.useEffect(() => {
    if (!app.current) {
      const container = document.getElementById('app')!;
      new LuckyRain(container);
    }
  }, []);
  return <div id='app' />;
}
