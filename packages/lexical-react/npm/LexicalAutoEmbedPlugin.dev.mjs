/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { $isLinkNode, LinkNode, AutoLinkNode } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { MenuOption, LexicalNodeMenuPlugin } from '@lexical/react/LexicalNodeMenuPlugin';
import { mergeRegister } from '@lexical/utils';
import { createCommand, $getNodeByKey, COMMAND_PRIORITY_EDITOR, $getSelection, COMMAND_PRIORITY_LOW } from 'lexical';
import * as React from 'react';
import { useState, useCallback, useEffect, useMemo } from 'react';

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const URL_MATCHER = /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
const INSERT_EMBED_COMMAND = createCommand('INSERT_EMBED_COMMAND');
class AutoEmbedOption extends MenuOption {
  constructor(title, options) {
    super(title);
    this.title = title;
    this.onSelect = options.onSelect.bind(this);
  }
}
function LexicalAutoEmbedPlugin({
  embedConfigs,
  onOpenEmbedModalForConfig,
  getMenuOptions,
  menuRenderFn,
  menuCommandPriority = COMMAND_PRIORITY_LOW
}) {
  const [editor] = useLexicalComposerContext();
  const [nodeKey, setNodeKey] = useState(null);
  const [activeEmbedConfig, setActiveEmbedConfig] = useState(null);
  const reset = useCallback(() => {
    setNodeKey(null);
    setActiveEmbedConfig(null);
  }, []);
  const checkIfLinkNodeIsEmbeddable = useCallback(key => {
    editor.getEditorState().read(async function () {
      const linkNode = $getNodeByKey(key);
      if ($isLinkNode(linkNode)) {
        for (let i = 0; i < embedConfigs.length; i++) {
          const embedConfig = embedConfigs[i];
          const urlMatch = await Promise.resolve(embedConfig.parseUrl(linkNode.__url));
          if (urlMatch != null) {
            setActiveEmbedConfig(embedConfig);
            setNodeKey(linkNode.getKey());
          }
        }
      }
    });
  }, [editor, embedConfigs]);
  useEffect(() => {
    const listener = (nodeMutations, {
      updateTags,
      dirtyLeaves
    }) => {
      for (const [key, mutation] of nodeMutations) {
        if (mutation === 'created' && updateTags.has('paste') && dirtyLeaves.size <= 3) {
          checkIfLinkNodeIsEmbeddable(key);
        } else if (key === nodeKey) {
          reset();
        }
      }
    };
    return mergeRegister(...[LinkNode, AutoLinkNode].map(Klass => editor.registerMutationListener(Klass, (...args) => listener(...args))));
  }, [checkIfLinkNodeIsEmbeddable, editor, embedConfigs, nodeKey, reset]);
  useEffect(() => {
    return editor.registerCommand(INSERT_EMBED_COMMAND, embedConfigType => {
      const embedConfig = embedConfigs.find(({
        type
      }) => type === embedConfigType);
      if (embedConfig) {
        onOpenEmbedModalForConfig(embedConfig);
        return true;
      }
      return false;
    }, COMMAND_PRIORITY_EDITOR);
  }, [editor, embedConfigs, onOpenEmbedModalForConfig]);
  const embedLinkViaActiveEmbedConfig = useCallback(async function () {
    if (activeEmbedConfig != null && nodeKey != null) {
      const linkNode = editor.getEditorState().read(() => {
        const node = $getNodeByKey(nodeKey);
        if ($isLinkNode(node)) {
          return node;
        }
        return null;
      });
      if ($isLinkNode(linkNode)) {
        const result = await Promise.resolve(activeEmbedConfig.parseUrl(linkNode.__url));
        if (result != null) {
          editor.update(() => {
            if (!$getSelection()) {
              linkNode.selectEnd();
            }
            activeEmbedConfig.insertNode(editor, result);
            if (linkNode.isAttached()) {
              linkNode.remove();
            }
          });
        }
      }
    }
  }, [activeEmbedConfig, editor, nodeKey]);
  const options = useMemo(() => {
    return activeEmbedConfig != null && nodeKey != null ? getMenuOptions(activeEmbedConfig, embedLinkViaActiveEmbedConfig, reset) : [];
  }, [activeEmbedConfig, embedLinkViaActiveEmbedConfig, getMenuOptions, nodeKey, reset]);
  const onSelectOption = useCallback((selectedOption, targetNode, closeMenu) => {
    editor.update(() => {
      selectedOption.onSelect(targetNode);
      closeMenu();
    });
  }, [editor]);
  return nodeKey != null ? /*#__PURE__*/React.createElement(LexicalNodeMenuPlugin, {
    nodeKey: nodeKey,
    onClose: reset,
    onSelectOption: onSelectOption,
    options: options,
    menuRenderFn: menuRenderFn,
    commandPriority: menuCommandPriority
  }) : null;
}

export { AutoEmbedOption, INSERT_EMBED_COMMAND, LexicalAutoEmbedPlugin, URL_MATCHER };
