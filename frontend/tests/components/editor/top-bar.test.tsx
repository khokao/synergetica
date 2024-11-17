import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { EditorProvider, useEditorContext } from '@/components/editor/editor-context';
import { EditorTopBar } from '@/components/editor/top-bar';
import userEvent from '@testing-library/user-event';
import * as clipboardManager from '@tauri-apps/plugin-clipboard-manager';
import * as dialog from '@tauri-apps/plugin-dialog';
import * as fs from '@tauri-apps/plugin-fs';
import { toast } from 'sonner';

vi.mock('@tauri-apps/plugin-clipboard-manager', () => ({
  writeText: vi.fn(),
}));

vi.mock('@tauri-apps/plugin-dialog', () => ({
  open: vi.fn(),
  save: vi.fn(),
}));

vi.mock('@tauri-apps/plugin-fs', () => ({
  readTextFile: vi.fn(),
  writeTextFile: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('EditorTopBar', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const TestComponent = () => {
    const { setEditorContent, editorContent, editMode } = useEditorContext();

    React.useEffect(() => {
      setEditorContent('Test content');
    }, [setEditorContent]);

    return (
      <div>
        <EditorTopBar />
        <div data-testid="editorContentDisplay">{editorContent}</div>
        <div data-testid="editModeDisplay">{editMode}</div>
      </div>
    );
  };

  it('should copy editor content to clipboard when copy button is clicked', async () => {
    // Arrange
    const writeTextMock = vi.spyOn(clipboardManager, 'writeText').mockResolvedValue();

    render(
      <EditorProvider>
        <TestComponent />
      </EditorProvider>
    );

    const copyButton = screen.getByTestId('editor-copy-button');

    // Act
    await userEvent.click(copyButton);

    // Assert
    expect(writeTextMock).toHaveBeenCalledWith('Test content');
    expect(toast.success).toHaveBeenCalledWith('Copied to clipboard');
  });

  it('should show error toast when copy to clipboard fails', async () => {
    // Arrange
    const writeTextMock = vi.spyOn(clipboardManager, 'writeText').mockRejectedValue(new Error('Copy failed'));

    render(
      <EditorProvider>
        <TestComponent />
      </EditorProvider>
    );

    const copyButton = screen.getByTestId('editor-copy-button');

    // Act
    await userEvent.click(copyButton);

    // Assert
    expect(writeTextMock).toHaveBeenCalledWith('Test content');
    expect(toast.error).toHaveBeenCalledWith('Failed to copy to clipboard');
  });

  it('should import content when import button is clicked', async () => {
    // Arrange
    const openMock = vi.spyOn(dialog, 'open').mockResolvedValue('path/to/file.yaml');
    const readTextFileMock = vi.spyOn(fs, 'readTextFile').mockResolvedValue('Imported content');

    render(
      <EditorProvider>
        <TestComponent />
      </EditorProvider>
    );

    const importButton = screen.getByTestId('editor-import-button');

    // Act
    await userEvent.click(importButton);

    // Assert
    expect(openMock).toHaveBeenCalledWith({
      multiple: false,
      directory: false,
      filters: [
        {
          name: 'YAML',
          extensions: ['yaml', 'yml'],
        },
      ],
    });
    expect(readTextFileMock).toHaveBeenCalledWith('path/to/file.yaml');
    expect(toast.success).toHaveBeenCalledWith('Imported config YAML file');

    expect(screen.getByTestId('editorContentDisplay').textContent).toBe('Imported content');
    expect(screen.getByTestId('editModeDisplay').textContent).toBe('monaco-editor');
  });

  it('should show error toast when import fails', async () => {
    // Arrange
    const openMock = vi.spyOn(dialog, 'open').mockRejectedValue(new Error('Import failed'));

    render(
      <EditorProvider>
        <EditorTopBar />
      </EditorProvider>
    );

    const importButton = screen.getByTestId('editor-import-button');

    // Act
    await userEvent.click(importButton);

    // Assert
    expect(openMock).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('Failed to import config YAML file');
  });

  it('should export content when export button is clicked', async () => {
    // Arrange
    const saveMock = vi.spyOn(dialog, 'save').mockResolvedValue('path/to/save.yaml');
    const writeTextFileMock = vi.spyOn(fs, 'writeTextFile').mockResolvedValue();

    const TestExportComponent = () => {
      const { setEditorContent, editorContent } = useEditorContext();

      React.useEffect(() => {
        setEditorContent('Test export content');
      }, [setEditorContent]);

      return (
        <div>
          <EditorTopBar />
          <div data-testid="editorContentDisplay">{editorContent}</div>
        </div>
      );
    };

    render(
      <EditorProvider>
        <TestExportComponent />
      </EditorProvider>
    );

    const exportButton = screen.getByTestId('editor-export-button');

    // Act
    await userEvent.click(exportButton);

    // Assert
    expect(saveMock).toHaveBeenCalledWith({
      filters: [{ name: 'YAML', extensions: ['yaml', 'yml'] }],
      defaultPath: 'config.yaml',
    });
    expect(writeTextFileMock).toHaveBeenCalledWith('path/to/save.yaml', 'Test export content');
    expect(toast.success).toHaveBeenCalledWith('Exported config YAML file');
  });

  it('should show error toast when export fails', async () => {
    // Arrange
    const saveMock = vi.spyOn(dialog, 'save').mockRejectedValue(new Error('Export failed'));

    const TestExportErrorComponent = () => {
      const { setEditorContent } = useEditorContext();

      React.useEffect(() => {
        setEditorContent('Test export content');
      }, [setEditorContent]);

      return <EditorTopBar />;
    };

    render(
      <EditorProvider>
        <TestExportErrorComponent />
      </EditorProvider>
    );

    const exportButton = screen.getByTestId('editor-export-button');

    // Act
    await userEvent.click(exportButton);

    // Assert
    expect(saveMock).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('Failed to export config YAML file');
  });
});
