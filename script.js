let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15; // Rastgele bir dönüş açısı
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    const moveHandler = (x, y) => {
      if (!this.rotating) {
        this.mouseX = x;
        this.mouseY = y;

        // Hız hesaplama
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      // Döndürme için açı hesaplama
      const dirX = x - this.mouseTouchX;
      const dirY = y - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);

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
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        // Transform uygulama
        paper.style.transform = `translate(${this.currentPaperX}px, ${this.currentPaperY}px) rotate(${this.rotation}deg)`;
      }
    };

    // Mouse ve touch hareketi dinleyicisi
    document.addEventListener('mousemove', (e) => moveHandler(e.clientX, e.clientY));
    document.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      moveHandler(touch.clientX, touch.clientY);
    });

    // Kağıt basıldığında
    const downHandler = (x, y) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      this.mouseTouchX = x;
      this.mouseTouchY = y;
      this.prevMouseX = x;
      this.prevMouseY = y;

      // Kağıdı en üste getir
      paper.style.zIndex = highestZ;
      highestZ += 1;
    };

    paper.addEventListener('mousedown', (e) => downHandler(e.clientX, e.clientY));
    paper.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      downHandler(touch.clientX, touch.clientY);
    });

    // Bırakma eventleri
    const upHandler = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    window.addEventListener('mouseup', upHandler);
    window.addEventListener('touchend', upHandler);

    // Sağ tıklama menüsünü engelle
    paper.addEventListener('contextmenu', (e) => e.preventDefault());
  }
}

// Tüm .paper elementlerini başlat
document.querySelectorAll('.paper').forEach((paper) => {
  new Paper().init(paper);
});
