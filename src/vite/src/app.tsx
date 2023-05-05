import React from 'react';
import * as PIXI from 'pixi.js';
import './app.less';
import { Modal } from 'antd-mobile';
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
  id: number;
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
  stageTicker: PIXI.Ticker | undefined;
  rainInterval = 500;
  tempRainInterval = 0;
  survivalTime = 15;
  endTag = true;
  cb: any;
  lastTime: number | undefined;
  startCountdown: PIXI.Text | undefined = undefined;
  startCountDownTimer: NodeJS.Timer | undefined = undefined;
  result = new Map();
  constructor(container: HTMLElement, opts?: IOpts) {
    this.app = new PIXI.Application({
      width: container.offsetWidth,
      height: container.offsetHeight,
      background: '#1099bb',
    });
    container.appendChild(this.app.view as unknown as Node);
    // this.init();
  }

  public start(cb: any) {
    this.cb = cb;
    // 去加载 红包图片
    // this.start();
    const text = new PIXI.Text(`3`, {
      fontSize: 216,
      fill: '#FFD442',
    });

    text.x = this.app.renderer.width / 2 - 54;
    text.y = this.app.renderer.height / 2 - 108;
    this.app.stage.addChild(text);
    this.startCountdown = text;
    let count = 3;
    this.startCountDownTimer = setInterval(() => {
      count -= 1;
      this.startCountdown!.text = count;
      if (count === 0 && this.startCountDownTimer) {
        clearInterval(this.startCountDownTimer);
        setTimeout(() => {
          this.app.stage.removeChild(this.startCountdown!);
          this.startCountdown!.destroy();
          this.startCountDownTimer = undefined;
          this._start();
        }, 500);
      }
    }, 1000);
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
      id: PIXI.utils.uid(),
    };
    const app = this.app;
    const self = this;
    // 点击事件处理程序
    function onSpriteClicked(event: any) {
      const text = new PIXI.Text(`+1 ${rainDrap.name}`, {
        fontSize: 12,
        fill: '#FFD442',
      });
      if (self.result.get(rainDrap.name)) {
        self.result.set(rainDrap.name, self.result.get(rainDrap.name) + 1);
      } else {
        self.result.set(rainDrap.name, 1);
      }
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
    if (this.endTag) return;
    // jian;
    if (this.tempRainInterval === 0) {
      const count = getRandomInt(1, 4);
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
  end() {
    // if (this.stageTicker) {
    //   this.TipTextList.forEach((s) => this.app.stage.removeChild(s.text));
    //   this.rainDrapList.forEach((s) => this.app.stage.removeChild(s.sprite));
    //   this.rainDrapList = [];
    //   this.TipTextList = [];
    //   this.app.ticker.remove(this.tickerCallback);

    //   this.cb();
    // }
    this.endTag = true;
  }
  countdownTimer() {
    let time = this.survivalTime;
    const text = new PIXI.Text(`${time} s`, {
      fontSize: 36,
      fill: '#FFD442',
    });

    text.x = 20;
    text.y = 20;
    this.app.stage.addChild(text);
    const timer = setInterval(() => {
      time = time - 1;
      text.text = `${time} s`;
      if (time < 0) {
        clearInterval(timer);
        this.end();
        text.destroy();
        this.app.stage.removeChild(text);
      }
    }, 1000);
  }

  tickerCallback = (delta: number) => {
    if (!this.lastTime) return;
    const now = performance.now();
    const deltaTime = now - this.lastTime; // 计算自上一帧以来的时间差
    this.lastTime = now;

    // just for fun, let's rotate mr rabbit a little
    // delta is 1 if running at 100% performance
    // creates frame-independent transformation
    this.rain(deltaTime);
    for (let i = 0; i < this.rainDrapList.length; i++) {
      const rainDrap = this.rainDrapList[i];
      const sprite = rainDrap.sprite;
      if (!sprite._destroyed) {
        sprite.y += delta * rainDrap.speed;

        if (sprite.y > this.app.renderer.height + 20) {
          this.app.stage.removeChild(sprite);
          sprite.destroy();
        }
      }
    }

    if (
      this.endTag &&
      this.rainDrapList.every((item) => item.sprite._destroyed)
    ) {
      this.cb();
      this.rainDrapList = [];
      this.TipTextList.forEach((s) => this.app.stage.removeChild(s.text));
      this.rainDrapList.forEach((s) => this.app.stage.removeChild(s.sprite));
      this.rainDrapList = [];
      this.TipTextList = [];
      this.app.ticker.remove(this.tickerCallback);
      // const
      let resStr = '获得';
      this.result.forEach((v, k) => {
        resStr = resStr + `/\n${k}${v}个`;
      });
      //   this.cb();
      Modal.alert({
        title: '游戏结束',
        content: resStr,
      });
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
  };
  private _start() {
    this.endTag = false;
    this.result = new Map();
    this.lastTime = performance.now();
    this.countdownTimer();
    this.app.ticker.minFPS = 30;
    this.stageTicker = this.app.ticker.add(this.tickerCallback);
    // console.log(this.app);
  }
  createRaindrop() {}
}

export default function App() {
  const app = React.useRef<LuckyRain>();
  const [showStartBtn, setShowStartBtn] = React.useState(true);
  React.useEffect(() => {
    if (!app.current) {
      const container = document.getElementById('app')!;
      app.current = new LuckyRain(container);
    }
  }, []);

  const start = () => {
    app.current?.start(() => {
      setShowStartBtn(true);
    });
    setShowStartBtn(false);
  };
  return (
    <div id='app'>
      {showStartBtn && (
        <button
          className='start-btn'
          onClick={() => {
            start();
          }}
        >
          开始
        </button>
      )}
    </div>
  );
}
