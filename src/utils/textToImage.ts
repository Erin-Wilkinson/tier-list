export interface TextImageOptions {
  text: string;
  fontSize?: number;
  backgroundColor?: string;
  textColor?: string;
  width?: number;
  height?: number;
  fontFamily?: string;
}

/**
 * Converts text into an image using HTML canvas
 * Returns a data URL that can be used as an image source
 */
export const textToImage = (options: TextImageOptions): string => {
  const {
    text,
    fontSize = 24,
    backgroundColor = '#ffffff',
    textColor = '#000000',
    width = 150,
    height = 150,
    fontFamily = "'Crimson Text', serif"
  } = options;

  // Create canvas element
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Fill background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  // Configure text
  ctx.fillStyle = textColor;
  ctx.font = `600 ${fontSize}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Handle text wrapping
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const testLine = currentLine + ' ' + words[i];
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > width - 20) { // 20px padding
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);

  // Draw each line
  const lineHeight = fontSize * 1.2;
  const totalHeight = lines.length * lineHeight;
  const startY = (height - totalHeight) / 2 + lineHeight / 2;

  lines.forEach((line, index) => {
    ctx.fillText(line, width / 2, startY + index * lineHeight);
  });

  // Convert canvas to data URL
  return canvas.toDataURL('image/png');
};
