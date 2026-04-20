let capture;
let pg;
let span = 20; // 以 20*20 為一個單位

function setup() {
  // 1. 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 2. 初始化攝影機
  capture = createCapture(VIDEO);
  capture.size(320, 240); // 依照要求設定為 320x240
  capture.hide(); // 隱藏原生影片元件
  
  // 針對行動裝置優化：確保影片在網頁內嵌入播放，不會跳出全螢幕
  capture.elt.setAttribute('playsinline', '');

  // 產生一個與 video 視訊畫面寬高一樣的內容元件 (Graphics)
  pg = createGraphics(320, 240);
}

function draw() {
  // 3. 設定背景為老師要求的粉紫色
  background('#e7c6ff');

  // 4. 計算 60% 畫面的邊界與置中座標
  let displayW = width * 0.6;
  let displayH = height * 0.6;
  let startX = (width - displayW) / 2;
  let startY = (height - displayH) / 2;

  // 將攝影機影像畫入 Graphics，並處理像素資料
  pg.image(capture, 0, 0, pg.width, pg.height);
  pg.loadPixels();

  // 6. 取得該圖片以 20*20 為一個單位，並在視訊區域上方顯示亮度數值
  textAlign(CENTER, CENTER);
  textSize(span * 0.6);

  for (let x = 0; x < pg.width; x += span) {
    for (let y = 0; y < pg.height; y += span) {
      let index = (x + y * pg.width) * 4;
      if (index < pg.pixels.length) {
        // 取得該點的 RGB 值
        let r = pg.pixels[index];
        let g = pg.pixels[index + 1];
        let b = pg.pixels[index + 2];
        // 計算亮度 (pixel[0] + pixel[1] + pixel[2])/3
        let bk = int((r + g + b) / 3);

        // 計算映射座標，並處理鏡像，確保文字不反轉 (對準 20x20 區塊中心)
        let mirX = map(pg.width - (x + span / 2), 0, pg.width, startX, startX + displayW);
        let drawY = map(y + span / 2, 0, pg.height, startY, startY + displayH);

        fill(bk); // 數字顏色隨亮度變化
        noStroke();
        
        text(bk, mirX, drawY);
      }
    }
  }
}

// 當視窗縮放時自動調整畫布 (QR Code 展示必備)
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}