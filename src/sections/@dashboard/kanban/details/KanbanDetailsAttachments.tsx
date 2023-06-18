import { useState, useCallback } from 'react';
// @mui
import { Stack } from '@mui/material';
// components
import { MultiFilePreview, UploadBox } from '../../../../components/upload';

// ----------------------------------------------------------------------

type Props = {
  attachments: string[];
  setAttachments: (attachments: (File | string)[]) => void;
};

export default function KanbanDetailsAttachments({ attachments, setAttachments }: Props) {
  const [files, setFiles] = useState<(File | string)[]>(attachments);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file: File) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setFiles([...files, ...newFiles]);
      setAttachments([...files, ...newFiles]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [files]
  );

  const handleRemoveFile = (inputFile: File | string) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
		setAttachments(filtered);
  };

  return (
    <Stack direction="row" flexWrap="wrap">
      <MultiFilePreview
        thumbnail
        files={files}
        onRemove={(file) => handleRemoveFile(file)}
        sx={{ width: 64, height: 64 }}
      />

      <UploadBox onDrop={handleDrop} />
    </Stack>
  );
}
