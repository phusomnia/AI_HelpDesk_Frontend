import { FileTextOutlined } from "@ant-design/icons";
import { ChatConstant } from "../../constants/chatConstants";

export function renderPreviewAttachment(file: File) {
  if (file.type.startsWith("image/")) {
    return (
      <img
        src={URL.createObjectURL(file)}
        alt={file.name}
        style={ChatConstant.STYLES.filePreview.image}
      />
    );
  } else {
    return (
      <div style={ChatConstant.STYLES.filePreview.fileWrapper}>
        <div style={ChatConstant.STYLES.filePreview.fileIcon}>
          <FileTextOutlined style={ChatConstant.STYLES.filePreview.fileIconSvg} />
        </div>
        <div style={ChatConstant.STYLES.filePreview.fileName}>
          {file.name}
        </div>
      </div>
    );
  }
}
