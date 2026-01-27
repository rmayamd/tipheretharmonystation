/**
 * MAYA-VISION V3.1 - MOTOR DE RENDERIZADO VOLUMÉTRICO
 * Optimizado para despliegue en Netlify (2026)
 */

export interface VolumetricChanges {
  nasolabialFolds: number;
  infraorbitalHollows: number;
  malarProjection: number;
  jawlineDefinition: number;
  cervicomentalAngle: number;
}

export function calculateVolumetricChanges(analysis: { 
  age: number; 
  laxityScore: number; 
  skinQuality: number; 
  gender: 'M' | 'F' 
}): VolumetricChanges {
  const { age, laxityScore, gender } = analysis;
  return {
    nasolabialFolds: Math.min(100, (age / 80 * 50) + (laxityScore / 100 * 50)),
    infraorbitalHollows: Math.min(100, age / 60 * 100),
    malarProjection: gender === 'F' ? Math.min(70, age / 50 * 100) : Math.min(50, age / 60 * 100),
    jawlineDefinition: laxityScore,
    cervicomentalAngle: Math.min(80, laxityScore * 0.8)
  };
}

export async function applyVolumetricSimulation(imageData: string, changes: VolumetricChanges): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Context 2D Fail'));
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      if (changes.nasolabialFolds > 20) reduceNasolabialFolds(ctx, canvas.width, canvas.height, changes.nasolabialFolds);
      if (changes.infraorbitalHollows > 20) fillInfraorbitalHollows(ctx, canvas.width, canvas.height, changes.infraorbitalHollows);
      if (changes.malarProjection > 20) enhanceMalarProjection(ctx, canvas.width, canvas.height, changes.malarProjection);
      if (changes.jawlineDefinition > 30) defineJawline(ctx, canvas.width, canvas.height, changes.jawlineDefinition);
      if (changes.cervicomentalAngle > 30) improveCervicomentalAngle(ctx, canvas.width, canvas.height, changes.cervicomentalAngle);

      resolve(canvas.toDataURL('image/jpeg', 0.95));
    };
    img.onerror = reject;
    img.src = imageData;
  });
}

function reduceNasolabialFolds(ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) {
  const imgData = ctx.getImageData(0, 0, width, height);
  for (let y = Math.floor(height * 0.45); y < Math.floor(height * 0.70); y++) {
    for (let x = Math.floor(width * 0.25); x < Math.floor(width * 0.48); x++) {
      lightenShadowArea(imgData.data, x, y, width, intensity * 0.6);
    }
    for (let x = Math.floor(width * 0.52); x < Math.floor(width * 0.75); x++) {
      lightenShadowArea(imgData.data, x, y, width, intensity * 0.6);
    }
  }
  ctx.putImageData(imgData, 0, 0);
  ctx.filter = 'blur(1px)';
  ctx.drawImage(ctx.canvas, 0, 0);
  ctx.filter = 'none';
}

function fillInfraorbitalHollows(ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) {
  const imgData = ctx.getImageData(0, 0, width, height);
  for (let y = Math.floor(height * 0.35); y < Math.floor(height * 0.45); y++) {
    for (let x = Math.floor(width * 0.30); x < Math.floor(width * 0.45); x++) {
      lightenDarkArea(imgData.data, x, y, width, intensity * 0.7);
    }
    for (let x = Math.floor(width * 0.55); x < Math.floor(width * 0.70); x++) {
      lightenDarkArea(imgData.data, x, y, width, intensity * 0.7);
    }
  }
  ctx.putImageData(imgData, 0, 0);
  drawVolumetricHighlight(ctx, width * 0.375, height * 0.40, width, intensity);
  drawVolumetricHighlight(ctx, width * 0.625, height * 0.40, width, intensity);
}

function enhanceMalarProjection(ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) {
  drawMalarHighlight(ctx, width * 0.35, height * 0.45, width, intensity);
  drawMalarHighlight(ctx, width * 0.65, height * 0.45, width, intensity);
  ctx.fillStyle = `rgba(0, 0, 0, ${intensity / 1000})`;
  ctx.fillRect(width * 0.28, height * 0.50, width * 0.15, height * 0.03);
  ctx.fillRect(width * 0.57, height * 0.50, width * 0.15, height * 0.03);
}

function defineJawline(ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) {
  ctx.strokeStyle = `rgba(0, 0, 0, ${intensity / 300})`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(width * 0.25, height * 0.65);
  ctx.quadraticCurveTo(width * 0.35, height * 0.75, width * 0.45, height * 0.78);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(width * 0.75, height * 0.65);
  ctx.quadraticCurveTo(width * 0.65, height * 0.75, width * 0.55, height * 0.78);
  ctx.stroke();
}

function improveCervicomentalAngle(ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const factor = 1 - (intensity / 500);
  for (let y = Math.floor(height * 0.75); y < Math.floor(height * 0.90); y++) {
    for (let x = Math.floor(width * 0.40); x < Math.floor(width * 0.60); x++) {
      const i = (y * width + x) * 4;
      imgData.data[i] *= factor;
      imgData.data[i + 1] *= factor;
      imgData.data[i + 2] *= factor;
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

function drawVolumetricHighlight(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, i: number) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, w * 0.08);
  g.addColorStop(0, `rgba(255, 255, 255, ${i / 500})`);
  g.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(x - w * 0.075, y - w * 0.05, w * 0.15, w * 0.10);
}

function drawMalarHighlight(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, i: number) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, w * 0.10);
  g.addColorStop(0, `rgba(255, 255, 255, ${i / 400})`);
  g.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(x - w * 0.1, y - w * 0.05, w * 0.20, w * 0.10);
}

function lightenShadowArea(data: Uint8ClampedArray, x: number, y: number, w: number, i: number) {
  const idx = (y * w + x) * 4;
  if ((data[idx] + data[idx+1] + data[idx+2]) / 3 < 130) {
    data[idx] = Math.min(255, data[idx] + i/4);
    data[idx+1] = Math.min(255, data[idx+1] + i/4);
    data[idx+2] = Math.min(255, data[idx+2] + i/4);
  }
}

function lightenDarkArea(data: Uint8ClampedArray, x: number, y: number, w: number, i: number) {
  const idx = (y * w + x) * 4;
  const avg = (data[idx] + data[idx+1] + data[idx+2]) / 3;
  const boost = avg < 100 ? i/2 : i/4;
  data[idx] = Math.min(255, data[idx] + boost);
  data[idx+1] = Math.min(255, data[idx+1] + boost);
  data[idx+2] = Math.min(255, data[idx+2] + boost);
}