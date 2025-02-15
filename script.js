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
    // Fare ve dokunma olaylarını yönet
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
        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
        paper.style.webkitTransform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    // Fare ve dokunma olaylarını dinle
    const onMouseMove = (e) => moveHandler(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      e.preventDefault(); // Sayfa kaymasını engelle
      moveHandler(e.touches[0].clientX, e.touches[0].clientY);
    };

    // Dokunma veya fare ile tıklama
    const startHandler = (x, y, isTouch = false) => {
      if (this.holdingPaper) return; // Zaten tutuluyorsa işlem yapma
      this.holdingPaper = true;
      paper.style.zIndex = highestZ;
      highestZ += 1;

      this.mouseTouchX = x;
      this.mouseTouchY = y;
      this.prevMouseX = x;
      this.prevMouseY = y;
      
      if (isTouch) {
        document.addEventListener("touchmove", onTouchMove, { passive: false });
        document.addEventListener("touchend", endHandler);
      } else {
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", endHandler);
      }
    };

    // Bırakma olayları
    const endHandler = () => {
      this.holdingPaper = false;
      this.rotating = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", endHandler);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", endHandler);
    };

    // Olayları ata
    paper.addEventListener("mousedown", (e) => startHandler(e.clientX, e.clientY));
    paper.addEventListener("touchstart", (e) => startHandler(e.touches[0].clientX, e.touches[0].clientY, true), { passive: false });

    // Sağ tıklama engelle
    paper.addEventListener("contextmenu", (e) => e.preventDefault());
  }
}

// Tüm .paper elementlerini seç ve başlat
document.querySelectorAll(".paper").forEach((paper) => {
  new Paper().init(paper);
});

