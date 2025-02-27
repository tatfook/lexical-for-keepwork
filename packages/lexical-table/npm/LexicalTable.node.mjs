/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const mod = await (['development', 'test'].includes(process.env.NODE_ENV) ? import('./LexicalTable.dev.mjs') : import('./LexicalTable.prod.mjs'));
export const $computeTableMap = mod.$computeTableMap;
export const $computeTableMapSkipCellCheck = mod.$computeTableMapSkipCellCheck;
export const $createTableCellNode = mod.$createTableCellNode;
export const $createTableNode = mod.$createTableNode;
export const $createTableNodeWithDimensions = mod.$createTableNodeWithDimensions;
export const $createTableRowNode = mod.$createTableRowNode;
export const $createTableSelection = mod.$createTableSelection;
export const $deleteTableColumn = mod.$deleteTableColumn;
export const $deleteTableColumn__EXPERIMENTAL = mod.$deleteTableColumn__EXPERIMENTAL;
export const $deleteTableRow__EXPERIMENTAL = mod.$deleteTableRow__EXPERIMENTAL;
export const $getElementForTableNode = mod.$getElementForTableNode;
export const $getNodeTriplet = mod.$getNodeTriplet;
export const $getTableCellNodeFromLexicalNode = mod.$getTableCellNodeFromLexicalNode;
export const $getTableCellNodeRect = mod.$getTableCellNodeRect;
export const $getTableColumnIndexFromTableCellNode = mod.$getTableColumnIndexFromTableCellNode;
export const $getTableNodeFromLexicalNodeOrThrow = mod.$getTableNodeFromLexicalNodeOrThrow;
export const $getTableRowIndexFromTableCellNode = mod.$getTableRowIndexFromTableCellNode;
export const $getTableRowNodeFromTableCellNodeOrThrow = mod.$getTableRowNodeFromTableCellNodeOrThrow;
export const $insertTableColumn = mod.$insertTableColumn;
export const $insertTableColumn__EXPERIMENTAL = mod.$insertTableColumn__EXPERIMENTAL;
export const $insertTableRow = mod.$insertTableRow;
export const $insertTableRow__EXPERIMENTAL = mod.$insertTableRow__EXPERIMENTAL;
export const $isTableCellNode = mod.$isTableCellNode;
export const $isTableNode = mod.$isTableNode;
export const $isTableRowNode = mod.$isTableRowNode;
export const $isTableSelection = mod.$isTableSelection;
export const $removeTableRowAtIndex = mod.$removeTableRowAtIndex;
export const $unmergeCell = mod.$unmergeCell;
export const INSERT_TABLE_COMMAND = mod.INSERT_TABLE_COMMAND;
export const TableCellHeaderStates = mod.TableCellHeaderStates;
export const TableCellNode = mod.TableCellNode;
export const TableNode = mod.TableNode;
export const TableObserver = mod.TableObserver;
export const TableRowNode = mod.TableRowNode;
export const applyTableHandlers = mod.applyTableHandlers;
export const getDOMCellFromTarget = mod.getDOMCellFromTarget;
export const getTableObserverFromTableElement = mod.getTableObserverFromTableElement;