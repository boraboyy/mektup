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
    // Fare hareketi dinleyicisi
    document.addEventListener('mousemove', (e) => {
      if (!this.rotating) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        // Hız hesaplama
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      // Döndürme için açı hesaplama
      const dirX = e.clientX - this.mouseTouchX;
      const dirY = e.clientY - this.mouseTouchY;
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
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        // Transform uygulama (tarayıcı uyumluluğu ile)
        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
        paper.style.webkitTransform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    });

    // Fare tıklaması dinleyicisi
    paper.addEventListener('mousedown', (e) => {
      if (this.holdingPaper) return; // Zaten tutuluyorsa işlem yapma
      this.holdingPaper = true;

      // Kağıdı en üste getirme
      paper.style.zIndex = highestZ;
      highestZ += 1;

      if (e.button === 0) { // Sol tıklama
        this.mouseTouchX = this.mouseX;
        this.mouseTouchY = this.mouseY;
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
      }
      if (e.button === 2) { // Sağ tıklama
        this.rotating = true;
      }
    });

    // Fare bırakma dinleyicisi
    window.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    // Sağ tıklama menüsünü engelleme
    paper.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }
}

// Tüm .paper elementlerini seç ve Paper sınıfı ile başlat
const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
