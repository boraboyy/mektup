let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  touchMoveX = 0;
  touchMoveY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15; // Rastgele bir dönüş açısı
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Dokunmatik hareketi dinleyicisi
    paper.addEventListener('touchmove', (e) => {
      e.preventDefault(); // Sayfanın kaymasını engelle
      if (!this.rotating) {
        this.touchMoveX = e.touches[0].clientX;
        this.touchMoveY = e.touches[0].clientY;

        // Hız hesaplama
        this.velX = this.touchMoveX - this.prevTouchX;
        this.velY = this.touchMoveY - this.prevTouchY;
      }

      // Döndürme için açı hesaplama
      const dirX = e.touches[0].clientX - this.touchStartX;
      const dirY = e.touches[0].clientY - this.touchStartY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);

      // Sıfıra bölme hatasını önleme
      if (dirLength !== 0) {
        const dirNormalizedX = dirX / dirLength;
        const dirNormalizedY = dirY / dirLength;

        const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
        let degrees = (180 * angle) / Math.PI;
        degrees = (360 + Math.round(degrees)) % 360;

        if (this.rotating) {
          this.rotation = degrees;
        }
      }

      // Kağıdı taşıma
      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevTouchX = this.touchMoveX;
        this.prevTouchY = this.touchMoveY;

        // Transform uygulama (tarayıcı uyumluluğu ile)
        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
        paper.style.webkitTransform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    });

    // Dokunmatik başlangıç dinleyicisi
    paper.addEventListener('touchstart', (e) => {
      if (this.holdingPaper) return; // Zaten tutuluyorsa işlem yapma
      this.holdingPaper = true;

      // Kağıdı en üste getirme
      paper.style.zIndex = highestZ;
      highestZ += 1;

      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.prevTouchX = this.touchStartX;
      this.prevTouchY = this.touchStartY;
    });

    // Dokunmatik bitiş dinleyicisi
    paper.addEventListener('touchend', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    // İki parmakla döndürme için dinleyiciler
    paper.addEventListener('gesturestart', (e) => {
      e.preventDefault();
      this.rotating = true;
    });

    paper.addEventListener('gestureend', () => {
      this.rotating = false;
    });
  }
}

// Tüm .paper elementlerini seç ve Paper sınıfı ile başlat
const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
