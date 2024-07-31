/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCollaborationContext } from '@lexical/react/LexicalCollaborationContext';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import * as React from 'react';
import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { mergeRegister } from '@lexical/utils';
import { createBinding, initLocalState, syncLexicalUpdateToYjs, TOGGLE_CONNECT_COMMAND, setLocalStateFocus, createUndoManager, CONNECTED_COMMAND, syncCursorPositions, syncYjsChangesToLexical } from '@lexical/yjs';
import { COMMAND_PRIORITY_EDITOR, FOCUS_COMMAND, BLUR_COMMAND, UNDO_COMMAND, REDO_COMMAND, CAN_UNDO_COMMAND, CAN_REDO_COMMAND, $getRoot, $createParagraphNode, $getSelection } from 'lexical';
import { createPortal } from 'react-dom';
import { UndoManager } from 'yjs';

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function useYjsCollaboration(editor, id, provider, docMap, name, color, shouldBootstrap, cursorsContainerRef, initialEditorState, excludedProperties, awarenessData) {
  const isReloadingDoc = useRef(false);
  const [doc, setDoc] = useState(docMap.get(id));
  const binding = useMemo(() => createBinding(editor, provider, id, doc, docMap, excludedProperties), [editor, provider, id, docMap, doc, excludedProperties]);
  const connect = useCallback(() => {
    provider.connect();
  }, [provider]);
  const disconnect = useCallback(() => {
    try {
      provider.disconnect();
    } catch (e) {
      // Do nothing
    }
  }, [provider]);
  useEffect(() => {
    const {
      root
    } = binding;
    const {
      awareness
    } = provider;
    const onStatus = ({
      status
    }) => {
      editor.dispatchCommand(CONNECTED_COMMAND, status === 'connected');
    };
    const onSync = isSynced => {
      if (shouldBootstrap && isSynced && root.isEmpty() && root._xmlText._length === 0 && isReloadingDoc.current === false) {
        initializeEditor(editor, initialEditorState);
      }
      isReloadingDoc.current = false;
    };
    const onAwarenessUpdate = () => {
      syncCursorPositions(binding, provider);
    };
    const onYjsTreeChanges = (events, transaction) => {
      const origin = transaction.origin;
      if (origin !== binding) {
        const isFromUndoManger = origin instanceof UndoManager;
        syncYjsChangesToLexical(binding, provider, events, isFromUndoManger);
      }
    };
    initLocalState(provider, name, color, document.activeElement === editor.getRootElement(), awarenessData || {});
    const onProviderDocReload = ydoc => {
      clearEditorSkipCollab(editor, binding);
      setDoc(ydoc);
      docMap.set(id, ydoc);
      isReloadingDoc.current = true;
    };
    provider.on('reload', onProviderDocReload);
    provider.on('status', onStatus);
    provider.on('sync', onSync);
    awareness.on('update', onAwarenessUpdate);
    // This updates the local editor state when we recieve updates from other clients
    root.getSharedType().observeDeep(onYjsTreeChanges);
    const removeListener = editor.registerUpdateListener(({
      prevEditorState,
      editorState,
      dirtyLeaves,
      dirtyElements,
      normalizedNodes,
      tags
    }) => {
      if (tags.has('skip-collab') === false) {
        syncLexicalUpdateToYjs(binding, provider, prevEditorState, editorState, dirtyElements, dirtyLeaves, normalizedNodes, tags);
      }
    });
    connect();
    return () => {
      if (isReloadingDoc.current === false) {
        disconnect();
      }
      provider.off('sync', onSync);
      provider.off('status', onStatus);
      provider.off('reload', onProviderDocReload);
      awareness.off('update', onAwarenessUpdate);
      root.getSharedType().unobserveDeep(onYjsTreeChanges);
      docMap.delete(id);
      removeListener();
    };
  }, [binding, color, connect, disconnect, docMap, editor, id, initialEditorState, name, provider, shouldBootstrap, awarenessData]);
  const cursorsContainer = useMemo(() => {
    const ref = element => {
      binding.cursorsContainer = element;
    };
    return /*#__PURE__*/createPortal( /*#__PURE__*/React.createElement("div", {
      ref: ref
    }), cursorsContainerRef && cursorsContainerRef.current || document.body);
  }, [binding, cursorsContainerRef]);
  useEffect(() => {
    return editor.registerCommand(TOGGLE_CONNECT_COMMAND, payload => {
      if (connect !== undefined && disconnect !== undefined) {
        const shouldConnect = payload;
        if (shouldConnect) {
          // eslint-disable-next-line no-console
          console.log('Collaboration connected!');
          connect();
        } else {
          // eslint-disable-next-line no-console
          console.log('Collaboration disconnected!');
          disconnect();
        }
      }
      return true;
    }, COMMAND_PRIORITY_EDITOR);
  }, [connect, disconnect, editor]);
  return [cursorsContainer, binding];
}
function useYjsFocusTracking(editor, provider, name, color, awarenessData) {
  useEffect(() => {
    return mergeRegister(editor.registerCommand(FOCUS_COMMAND, () => {
      setLocalStateFocus(provider, name, color, true, awarenessData || {});
      return false;
    }, COMMAND_PRIORITY_EDITOR), editor.registerCommand(BLUR_COMMAND, () => {
      setLocalStateFocus(provider, name, color, false, awarenessData || {});
      return false;
    }, COMMAND_PRIORITY_EDITOR));
  }, [color, editor, name, provider, awarenessData]);
}
function useYjsHistory(editor, binding) {
  const undoManager = useMemo(() => createUndoManager(binding, binding.root.getSharedType()), [binding]);
  useEffect(() => {
    const undo = () => {
      undoManager.undo();
    };
    const redo = () => {
      undoManager.redo();
    };
    return mergeRegister(editor.registerCommand(UNDO_COMMAND, () => {
      undo();
      return true;
    }, COMMAND_PRIORITY_EDITOR), editor.registerCommand(REDO_COMMAND, () => {
      redo();
      return true;
    }, COMMAND_PRIORITY_EDITOR));
  });
  const clearHistory = useCallback(() => {
    undoManager.clear();
  }, [undoManager]);

  // Exposing undo and redo states
  React.useEffect(() => {
    const updateUndoRedoStates = () => {
      editor.dispatchCommand(CAN_UNDO_COMMAND, undoManager.undoStack.length > 0);
      editor.dispatchCommand(CAN_REDO_COMMAND, undoManager.redoStack.length > 0);
    };
    undoManager.on('stack-item-added', updateUndoRedoStates);
    undoManager.on('stack-item-popped', updateUndoRedoStates);
    undoManager.on('stack-cleared', updateUndoRedoStates);
    return () => {
      undoManager.off('stack-item-added', updateUndoRedoStates);
      undoManager.off('stack-item-popped', updateUndoRedoStates);
      undoManager.off('stack-cleared', updateUndoRedoStates);
    };
  }, [editor, undoManager]);
  return clearHistory;
}
function initializeEditor(editor, initialEditorState) {
  editor.update(() => {
    const root = $getRoot();
    if (root.isEmpty()) {
      if (initialEditorState) {
        switch (typeof initialEditorState) {
          case 'string':
            {
              const parsedEditorState = editor.parseEditorState(initialEditorState);
              editor.setEditorState(parsedEditorState, {
                tag: 'history-merge'
              });
              break;
            }
          case 'object':
            {
              editor.setEditorState(initialEditorState, {
                tag: 'history-merge'
              });
              break;
            }
          case 'function':
            {
              editor.update(() => {
                const root1 = $getRoot();
                if (root1.isEmpty()) {
                  initialEditorState(editor);
                }
              }, {
                tag: 'history-merge'
              });
              break;
            }
        }
      } else {
        const paragraph = $createParagraphNode();
        root.append(paragraph);
        const {
          activeElement
        } = document;
        if ($getSelection() !== null || activeElement !== null && activeElement === editor.getRootElement()) {
          paragraph.select();
        }
      }
    }
  }, {
    tag: 'history-merge'
  });
}
function clearEditorSkipCollab(editor, binding) {
  // reset editor state
  editor.update(() => {
    const root = $getRoot();
    root.clear();
    root.select();
  }, {
    tag: 'skip-collab'
  });
  if (binding.cursors == null) {
    return;
  }
  const cursors = binding.cursors;
  if (cursors == null) {
    return;
  }
  const cursorsContainer = binding.cursorsContainer;
  if (cursorsContainer == null) {
    return;
  }

  // reset cursors in dom
  const cursorsArr = Array.from(cursors.values());
  for (let i = 0; i < cursorsArr.length; i++) {
    const cursor = cursorsArr[i];
    const selection = cursor.selection;
    if (selection && selection.selections != null) {
      const selections = selection.selections;
      for (let j = 0; j < selections.length; j++) {
        cursorsContainer.removeChild(selections[i]);
      }
    }
  }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function CollaborationPlugin({
  id,
  providerFactory,
  shouldBootstrap,
  username,
  cursorColor,
  cursorsContainerRef,
  initialEditorState,
  excludedProperties,
  awarenessData
}) {
  const collabContext = useCollaborationContext(username, cursorColor);
  const {
    yjsDocMap,
    name,
    color
  } = collabContext;
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    collabContext.isCollabActive = true;
    return () => {
      // Reseting flag only when unmount top level editor collab plugin. Nested
      // editors (e.g. image caption) should unmount without affecting it
      if (editor._parentEditor == null) {
        collabContext.isCollabActive = false;
      }
    };
  }, [collabContext, editor]);
  const provider = useMemo(() => providerFactory(id, yjsDocMap), [id, providerFactory, yjsDocMap]);
  const [cursors, binding] = useYjsCollaboration(editor, id, provider, yjsDocMap, name, color, shouldBootstrap, cursorsContainerRef, initialEditorState, excludedProperties, awarenessData);
  collabContext.clientID = binding.clientID;
  useYjsHistory(editor, binding);
  useYjsFocusTracking(editor, provider, name, color, awarenessData);
  return cursors;
}

export { CollaborationPlugin };
