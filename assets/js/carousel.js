export default class Carousel {
  constructor(p) {
    const settings = {
      ...{
        containerId: '#carousel',
        slideId: '.slide',
        interval: 2000,
        isPlaying: true,
      },
      ...p,
    };

    this.container = document.querySelector(settings.containerId);
    this.slideItems = this.container.querySelectorAll(settings.slideId);
    this.interval = settings.interval;
    this.isPlaying = settings.isPlaying;
  }

  _initProps() {
    this.SLIDES_COUNT = this.slideItems.length;
    this.CODE_ARROW_LEFT = 'ArrowLeft';
    this.CODE_ARROW_RIGHT = 'ArrowRight';
    this.CODE_SPACE = 'Space';
    this.FA_PAUSE = '<i class="fa-regular fa-circle-pause"></i>';
    this.FA_PLAY = '<i class="fa-regular fa-circle-play"></i>';
    this.FA_PREV = '<i class="fa-solid fa-angle-left"></i>';
    this.FA_NEXT = '<i class="fa-solid fa-angle-right"></i>';

    this.currentSlide = 0;
    this.timerId = null;
  }

  _initControls() {
    const controls = document.createElement('div');
    const PAUSE = `<span id="pause-btn" class="control control-pause">
                     <span id="fa-pause-icon">${this.FA_PAUSE}</span>
                     <span id="fa-play-icon">${this.FA_PLAY}</span>
                   </span>`;
    const PREV = `<span id="prev-btn" class="control control-prev">${this.FA_PREV}</span>`;
    const NEXT = `<span id="next-btn" class="control control-next">${this.FA_NEXT}</span>`;

    controls.setAttribute('id', 'controls-container');
    controls.classList.add('controls');

    controls.innerHTML = PAUSE + PREV + NEXT;

    this.container.append(controls);

    this.pauseBtn = this.container.querySelector('#pause-btn');
    this.prevBtn = this.container.querySelector('#prev-btn');
    this.nextBtn = this.container.querySelector('#next-btn');

    this.pauseIcon = this.container.querySelector('#fa-pause-icon');
    this.playIcon = this.container.querySelector('#fa-play-icon');

    this.isPlaying ? this._pauseVisible() : this._playVisible();
  }

  _initIndicators() {
    const indicators = document.createElement('div');
    indicators.setAttribute('id', 'indicators-container');
    indicators.setAttribute('class', 'indicators');

    for (let i = 0; i < this.SLIDES_COUNT; i++) {
      const indicator = document.createElement('div');
      indicator.setAttribute('class', i ? 'indicator' : 'indicator active');
      indicator.dataset.slideTo = `${i}`;
      indicators.append(indicator);
    }

    this.container.append(indicators);

    this.indicatorsContainer = this.container.querySelector(
      '#indicators-container'
    );
    this.indicatorItems = this.indicatorsContainer.querySelectorAll(
      '.indicator'
    );
  }

  _initListeners() {
    this.pauseBtn.addEventListener('click', this.pausePlay.bind(this));
    this.prevBtn.addEventListener('click', this.prev.bind(this));
    this.nextBtn.addEventListener('click', this.next.bind(this));
    this.indicatorsContainer.addEventListener(
      'click',
      this._indicateHandler.bind(this)
    );
    document.addEventListener('keydown', this._pressKey.bind(this));
    this.container.addEventListener('mouseenter', this.pause.bind(this));
    this.container.addEventListener('mouseleave', this.play.bind(this));
  }

  _gotoNth(n) {
    this.slideItems[this.currentSlide].classList.toggle('active');
    this.indicatorItems[this.currentSlide].classList.toggle('active');
    this.currentSlide = (n + this.SLIDES_COUNT) % this.SLIDES_COUNT;
    this.slideItems[this.currentSlide].classList.toggle('active');
    this.indicatorItems[this.currentSlide].classList.toggle('active');
  }

  _gotoPrev() {
    this._gotoNth(this.currentSlide - 1);
  }

  _gotoNext() {
    this._gotoNth(this.currentSlide + 1);
  }

  _tick() {
    if (!this.isPlaying) return;
    this.timerId = setInterval(() => this._gotoNext(), this.interval);
  }

  _indicateHandler(e) {
    const { target } = e;
    if (target && target.classList.contains('indicator')) {
      this.pause();
      this._gotoNth(+target.dataset.slideTo);
    }
  }

  _pressKey(e) {
    const { code } = e;
    e.preventDefault();
    if (code === this.CODE_SPACE) this.pausePlay();
    if (code === this.CODE_ARROW_LEFT) this.prev();
    if (code === this.CODE_ARROW_RIGHT) this.next();
  }

  _pauseVisible(isVisible = true) {
    this.pauseIcon.style.opacity = isVisible ? 1 : 0;
    this.playIcon.style.opacity = isVisible ? 0 : 1;
  }

  _playVisible() {
    this._pauseVisible(false);
  }

  pause() {
    if (!this.isPlaying) return;
    clearInterval(this.timerId);
    this._playVisible();
    this.isPlaying = false;
  }

  play() {
    if (this.isPlaying) return;
    this._pauseVisible();
    this.isPlaying = true;
    this._tick();
    console.log('play, isPlaying:', this.isPlaying);
  }

  pausePlay() {
    console.log(this.isPlaying);
    this.isPlaying ? this.pause() : this.play();
  }

  prev() {
    this.pause();
    this._gotoPrev();
  }

  next() {
    this.pause();
    this._gotoNext();
  }

  init() {
    this._initProps();
    this._initControls();
    this._initIndicators();
    this._initListeners();
    this._tick();
  }
}
