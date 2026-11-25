/**
 * Entry of the CodeMirror bundle (vendor/codemirror/). Defines window.NullpunktCM:
 *
 *   NullpunktCM.create(parent, { doc, readOnly, label, onChange, onRun })
 *     → { view, getValue(), setValue(text), setDiagnostics([{ line, message, severity }]), focus() }
 *   NullpunktCM.highlight(code) → HTML of read-only code, with the same colors as the editor
 *
 * Colors are not set here: every token gets an np-tok-* class and site/lesson.css maps the classes to the
 * VS Code Light+ / Dark+ tokens of docs/rules/S00-assets.md. Tab indents; Esc then Tab leaves the editor.
 */
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection, placeholder } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { syntaxHighlighting, indentOnInput, bracketMatching, indentUnit } from '@codemirror/language';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { setDiagnostics, lintGutter } from '@codemirror/lint';
import { cpp, cppLanguage } from '@codemirror/lang-cpp';
import { tagHighlighter, tags as t, highlightTree } from '@lezer/highlight';

const highlighter = tagHighlighter([
    { tag: [t.controlKeyword, t.processingInstruction, t.moduleKeyword], class: 'np-tok-control' },
    { tag: [t.keyword, t.modifier, t.operatorKeyword, t.definitionKeyword, t.bool, t.null], class: 'np-tok-keyword' },
    { tag: [t.typeName, t.standard(t.typeName), t.className], class: 'np-tok-type' },
    { tag: [t.string, t.character, t.special(t.string)], class: 'np-tok-string' },
    { tag: t.escape, class: 'np-tok-escape' },
    { tag: [t.number, t.integer, t.float], class: 'np-tok-number' },
    { tag: [t.lineComment, t.blockComment, t.comment], class: 'np-tok-comment' },
    { tag: [t.function(t.variableName), t.function(t.definition(t.variableName))], class: 'np-tok-function' },
    { tag: [t.macroName, t.meta], class: 'np-tok-control' },
    { tag: [t.variableName, t.definition(t.variableName), t.propertyName], class: 'np-tok-variable' },
    { tag: t.invalid, class: 'np-tok-invalid' },
]);

function create(parent, opts) {
    opts = opts || {};
    const ext = [
        lineNumbers(), highlightActiveLineGutter(), history(), drawSelection(), indentOnInput(), bracketMatching(),
        closeBrackets(), highlightActiveLine(), lintGutter(), cpp(), syntaxHighlighting(highlighter),
        indentUnit.of('    '), EditorState.tabSize.of(4),
        keymap.of([
            { key: 'Mod-Enter', run: () => { if (opts.onRun) opts.onRun(); return true; } },
            ...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap, indentWithTab,
        ]),
        EditorView.contentAttributes.of({ 'aria-label': opts.label || 'C source code', dir: 'ltr' }),
        EditorView.editorAttributes.of({ dir: 'ltr', class: 'np-cm' }),
        EditorView.updateListener.of(u => { if (u.docChanged && opts.onChange) opts.onChange(u.state.doc.toString()); }),
    ];
    if (opts.readOnly) ext.push(EditorState.readOnly.of(true), EditorView.editable.of(false));
    if (opts.placeholder) ext.push(placeholder(opts.placeholder));
    const view = new EditorView({ parent, state: EditorState.create({ doc: opts.doc || '', extensions: ext }) });
    return {
        view,
        getValue: () => view.state.doc.toString(),
        setValue: text => view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text } }),
        setDiagnostics: list => {
            const doc = view.state.doc;
            const diags = (list || []).filter(d => d.line >= 1 && d.line <= doc.lines).map(d => {
                const line = doc.line(d.line);
                return { from: line.from, to: Math.max(line.to, line.from), severity: d.severity === 'warning' ? 'warning' : 'error', message: d.message };
            });
            view.dispatch(setDiagnostics(view.state, diags));
        },
        focus: () => view.focus(),
    };
}

const escapeHtml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function highlight(code) {
    const tree = cppLanguage.parser.parse(code);
    let out = '', pos = 0;
    highlightTree(tree, highlighter, (from, to, classes) => {
        if (from > pos) out += escapeHtml(code.slice(pos, from));
        out += '<span class="' + classes + '">' + escapeHtml(code.slice(from, to)) + '</span>';
        pos = to;
    });
    return out + escapeHtml(code.slice(pos));
}

window.NullpunktCM = { create, highlight, version: __CM_VERSIONS__ };
