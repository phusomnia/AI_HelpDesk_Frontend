export const renderPreviewAttachment = (file: File) => {
  if (file.type.startsWith('image/')) {
    return {
      type: 'image',
      url: URL.createObjectURL(file),
      name: file.name,
    };
  } else {
    return {
      type: 'file',
      name: file.name,
    };
  }
};
