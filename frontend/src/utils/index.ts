export const getImagePreview = (fileData: ArrayBufferLike | number[], fileType: string) => {
  if (fileData && fileType) {
    const uint8Array = new Uint8Array(fileData);
    const byteArray = Array.from(uint8Array);
    const base64String = btoa(String.fromCharCode(...byteArray));
    return `data:${fileType};base64,${base64String}`;
  }
  return '';
};
