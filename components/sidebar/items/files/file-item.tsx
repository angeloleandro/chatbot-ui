import { FileIcon } from "@/components/ui/file-icon"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FILE_DESCRIPTION_MAX, FILE_NAME_MAX } from "@/db/limits"
import { getFileFromStorage } from "@/db/storage/files"
import { Tables } from "@/supabase/types"
import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import { SidebarItem } from "../all/sidebar-display-item"

interface FileItemProps {
  file: Tables<"files">
}

export const FileItem: FC<FileItemProps> = ({ file }) => {
  const { t } = useTranslation()
  const [name, setName] = useState(file.name)
  const [isTyping, setIsTyping] = useState(false)
  const [description, setDescription] = useState(file.description)

  const getLinkAndView = async () => {
    const link = await getFileFromStorage(file.file_path)
    window.open(link, "_blank")
  }

  return (
    <SidebarItem
      item={file}
      isTyping={isTyping}
      contentType="files"
      icon={<FileIcon type={file.type} size={30} />}
      updateState={{ name, description }}
      renderInputs={() => (
        <>
          <div
            className="cursor-pointer underline hover:opacity-50"
            onClick={getLinkAndView}
          >
            {t("view")} {file.name}
          </div>

          <div className="flex flex-col justify-between">
            <div>{file.type}</div>

            <div>{formatFileSize(file.size)}</div>

            <div>
              {file.tokens.toLocaleString()} {t("tokens")}
            </div>
          </div>

          <div className="space-y-1">
            <Label>{t("name")}</Label>

            <Input
              placeholder={t("fileNamePlaceholder")}
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={FILE_NAME_MAX}
            />
          </div>

          <div className="space-y-1">
            <Label>{t("description")}</Label>

            <Input
              placeholder={t("fileDescriptionPlaceholder")}
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={FILE_DESCRIPTION_MAX}
            />
          </div>
        </>
      )}
    />
  )
}

export const formatFileSize = (sizeInBytes: number): string => {
  let size = sizeInBytes
  let unit = "bytes"

  if (size >= 1024) {
    size /= 1024
    unit = "KB"
  }

  if (size >= 1024) {
    size /= 1024
    unit = "MB"
  }

  if (size >= 1024) {
    size /= 1024
    unit = "GB"
  }

  return `${size.toFixed(2)} ${unit}`
}
