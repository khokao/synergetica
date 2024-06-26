import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/dialog';

interface FileEntry {
  path: string;
  is_dir: boolean;
  children?: FileEntry[];
}

const DirectoryTree: React.FC<{ entry: FileEntry }> = ({ entry }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getBasename = (path: string) => {
    return path.split('/').pop();
  };

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <li className="h-full hover:bg-gray-300">
      {entry.is_dir ? (
        <span onClick={toggle} style={{ cursor: 'pointer' }}>
          {isOpen ? '📂' : '📁'} {getBasename(entry.path)}
        </span>
      ) : (
        <span>📄 {getBasename(entry.path)}</span>
      )}
      {isOpen && entry.children && (
        <ul className="pl-4">
          {entry.children.map((child, index) => (
            <DirectoryTree key={index} entry={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

export const DispDirTree: React.FC = () => {
  const [directory, setDirectory] = useState<FileEntry | null>(null);
  const [path, setPath] = useState<string | null>(null);

  const readDir = async (dirPath: string) => {
    try {
      const entry: FileEntry = await invoke('read_dir', { path: dirPath });
      console.log("entry", entry);
      setDirectory(entry);
    } catch (err) {
      console.error(err);
    }
  };

  const selectDirectory = async () => {
    try {
      const selectedPath = await open({
        directory: true,
        multiple: false,
        title: 'Select a Directory',
      }) as string;

      if (selectedPath) {
        setPath(selectedPath);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (path) {
      readDir(path);
    }
  }, [path]);

  return (
    <div className="bg-gray-100  min-h-screen">
      <div className="text-black">
      <div className="bg-gray-300 flex-grow flex justify-between items-center">
        <h1>File Explorer</h1>
        </div>
        <div className='px-2 py-4'>
        <button
          onClick={selectDirectory}
          className="bg-green-500 hover:bg-green-700 justify-center text-white font-bold py-2 px-2 rounded flex-shrink flex-grow-0 flex-auto"
        >
          Open Folder
          </button>
          </div>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-56px)] mt-2">
      {directory && (
        <ul className="list-none p-0">
          <DirectoryTree entry={directory} />
        </ul>
        )}
        </div>
    </div>
  );
};
