function Carousel() {
  this.container = document.querySelector('#carousel');
  this.slides = this.container.querySelectorAll('.slide');
  this.pauseBtn = this.container.querySelector('#pause-btn');
  this.prevBtn = this.container.querySelector('#prev-btn');
  this.nextBtn = this.container.querySelector('#next-btn');
  this.indicatorItems = this.container.querySelectorAll('.indicator');
  this.indicatorsContainer = this.container.querySelector('#indicators-container'
  );

  this.SLIDES_COUNT = this.slides.length;
  this.CODE_ARROW_LEFT = 'ArrowLeft';
  this.CODE_ARROW_RIGHT = 'ArrowRight';
  this.CODE_SPACE = 'Space';

  this.currentSlide = 0;
  this.timerId = null;
  this.isPlaying = true;
  this.startPosX = null;
  this.endPosX = null;
  this.interval = 2000;

  this.initListeners();
  this.tick();
}

Carousel.prototype = {
  gotoNth(n) {
    this.slides[this.currentSlide].classList.toggle('active');
    this.indicatorItems[this.currentSlide].classList.toggle('active');
    this.currentSlide = (n + this.SLIDES_COUNT) % this.SLIDES_COUNT;
    this.slides[this.currentSlide].classList.toggle('active');
    this.indicatorItems[this.currentSlide].classList.toggle('active');
  },

  gotoNext: function () {
    this.gotoNth(this.currentSlide + 1);
  },

  gotoPrev: function () {
    this.gotoNth(this.currentSlide - 1);
  },

  tick: function () {
    this.timerId = setInterval(this.gotoNext.bind(this), this.interval);
  },

  pauseHandler: function () {
    if (!this.isPlaying) return;
    clearInterval(this.timerId);
    this.pauseBtn.innerHTML = 'Play';
    this.isPlaying = false;
  },

  playHandler: function () {
    this.tick();
    this.pauseBtn.innerHTML = 'Pause';
    this.isPlaying = true;
  },

  pausePlayHandler: function () {
    if (this.isPlaying) {
      this.pauseHandler();
    } else {
      this.playHandler();
    }
  },

  nextHandler: function () {
    this.pauseHandler();
    this.gotoNext();
  },

  prevHandler: function () {
    this.pauseHandler();
    this.gotoPrev();
  },

  indicateHandler: function (e) {
    const target = e.target;
    if (target && target.classList.contains('indicator')) {
      this.pauseHandler();
      this.gotoNth(+target.dataset.slideTo);
    }
  },

  pressKey: function (e) {
    const code = e.code;
    e.preventDefault();

    switch (code) {
      case this.CODE_SPACE:
        this.pausePlayHandler();
        break;
      case this.CODE_ARROW_LEFT:
        this.prevHandler();
        break;
      case this.CODE_ARROW_RIGHT:
        this.nextHandler();
        break;
    }
  },

  swipeStart: function (e) {
    this.startPosX =
      e instanceof MouseEvent ? e.pageX : e.changedTouches[0].pageX;
  },

  swipeEnd: function (e) {
    this.endPosX =
      e instanceof MouseEvent ? e.pageX : e.changedTouches[0].pageX;

    if (this.endPosX - this.startPosX > 100) this.prevHandler();
    if (this.endPosX - this.startPosX < -100) this.nextHandler();
  },
  
  initListeners: function () {
    this.pauseBtn.addEventListener('click', this.pausePlayHandler.bind(this));
    this.prevBtn.addEventListener('click', this.prevHandler.bind(this));
    this.nextBtn.addEventListener('click', this.nextHandler.bind(this));
    this.indicatorsContainer.addEventListener(
      'click',
      this.indicateHandler.bind(this)
    );
    this.container.addEventListener('touchstart', this.swipeStart.bind(this));
    this.container.addEventListener('mousedown', this.swipeStart.bind(this));
    this.container.addEventListener('touchend', this.swipeEnd.bind(this));
    this.container.addEventListener('mouseup', this.swipeEnd.bind(this));
    document.addEventListener('keydown', this.pressKey.bind(this));
  },
};

const carousel = new Carousel();
