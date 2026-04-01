export const generateAvatar = (text: string, foregroundColor: `#${string}`, backgroundColor: `#${string}`) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = 512;
  canvas.height = 512;

  if (!context) return null;

  // Draw background
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw text
  context.font = '600 250px Arial';
  context.fillStyle = foregroundColor;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, canvas.width / 2, canvas.height / 2 + 20);

  return canvas.toDataURL('image/png');
};

export const generateInitials = (name: string) => {
  const uppercase = name?.toUpperCase();
  const splited = uppercase?.split(' ') || [''];

  if (splited[0] === '') return '?';

  if (splited.length === 1) {
    return `${splited[0].charAt(0) || ''}${splited[0].charAt(1) || ''}`;
  } else if (splited.length > 1) {
    return `${splited[0].charAt(0) || ''}${splited[1].charAt(0) || ''}`;
  }

  return '?';
};
