'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, FileCheck } from 'lucide-react';
import styles from './FileUploader.module.css';

interface FileUploaderProps {
  label: string;
  accept: string;
  onFileSelect: (file: File) => void;
  selectedFileName?: string;
}

// Carga de archivos con drag & drop
export default function FileUploader({ label, accept, onFileSelect, selectedFileName }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const dropzoneClass = `${styles.dropzone} ${isDragActive ? styles.dragActive : (selectedFileName ? styles.hasFile : '')
    }`;

  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={dropzoneClass}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className={styles.hiddenInput}
        />

        {selectedFileName ? (
          <div className={styles.fileInfo}>
            <div className={styles.iconCircle}>
              <FileCheck className={styles.fileCheckIcon} />
            </div>
            <p className={styles.fileName}>{selectedFileName}</p>
            <p className={styles.replaceHint}>Click anywhere to replace dataset</p>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <UploadCloud className={styles.uploadIcon} />
            <p className={styles.primaryText}>
              Drag & drop your CSV or <span className={styles.browseLink}>browse</span>
            </p>
            <p className={styles.subText}>
              Supports native Mappa standard compliance logs
            </p>
          </div>
        )}
      </div>
    </div>
  );
}