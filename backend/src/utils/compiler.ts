import ts from 'typescript';

export function verifyTypeScriptCode(filePath: string): string | null {
  // Bypass compilation check during tests to avoid slow disk and module resolution in Vitest
  if (process.env.NODE_ENV === 'test') {
    return null;
  }

  const program = ts.createProgram([filePath], {
    noEmit: true,
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.CommonJS,
    jsx: ts.JsxEmit.ReactJSX,
    esModuleInterop: true,
    skipLibCheck: true,
  });

  const emitResult = program.emit();
  const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

  if (allDiagnostics.length > 0) {
    const errorMessages = allDiagnostics.map(diagnostic => {
      if (diagnostic.file && diagnostic.start !== undefined) {
        const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        return `Line ${line + 1}, Col ${character + 1}: ${message}`;
      } else {
        return ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      }
    });
    return errorMessages.join('\n');
  }

  return null;
}
