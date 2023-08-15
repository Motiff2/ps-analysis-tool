/*
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies.
 */
import React, { useEffect, useRef, useState } from 'react';
import type { Column, Table } from '@tanstack/react-table';
import classNames from 'classnames';

/**
 * Internal dependencies.
 */
import type { TableData } from '..';
import { createPortal } from 'react-dom';
import ColumnList from './columnList';

interface ColumnMenuProps {
  table: Table<TableData>;
  columns: Column<TableData, unknown>[];
  position: { x: number; y: number };
  open: boolean;
  onClose: (value: boolean) => void;
}

const ColumnMenu = ({
  table,
  columns,
  position,
  open,
  onClose,
}: ColumnMenuProps) => {
  const [startAnimation, setStartAnimation] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDarkMode = chrome.devtools.panels.themeName === 'dark';

  const handleClose = () => {
    document.body.style.overflow = open ? 'auto' : 'hidden';
    setStartAnimation(true);

    timeoutRef.current = setTimeout(() => {
      onClose(!open);
      setStartAnimation(false);
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {open &&
        createPortal(
          <div
            className={classNames(
              'transition duration-100',
              startAnimation ? 'opacity-0' : 'opacity-100',
              { dark: isDarkMode }
            )}
            data-testid="column-menu"
          >
            <div
              className="absolute z-50 text-raisin-black dark:text-bright-gray rounded-md backdrop-blur-2xl w-screen max-w-[13rem] p-1.5 mr-2 divide-y divide-neutral-300 dark:divide-neutral-500 max-h-[80vh] overflow-auto bg-stone-200 dark:bg-neutral-700 shadow-3xl"
              style={{
                left: 'min( calc( 100vw - 15rem),' + position.x + 'px )',
                top: position.y + 'px',
                border: '0.5px solid rgba(0, 0, 0, 0.20)',
              }}
            >
              <button
                className="block w-full text-xs rounded px-1 py-[3px] mb-1.5 flex items-center hover:bg-royal-blue hover:text-white cursor-default"
                onClick={(e) => {
                  table.getToggleAllColumnsVisibilityHandler()(e);
                  handleClose();
                }}
              >
                <span
                  className={classNames(
                    'mr-2 font-semibold',
                    table.getIsAllColumnsVisible() ? 'opacity-100' : 'opacity-0'
                  )}
                >
                  ✓
                </span>
                <span>Toggle All</span>
              </button>
              <div>
                <ColumnList columns={columns} handleClose={handleClose} />
              </div>
            </div>

            <div
              data-testid="column-menu-overlay"
              onClick={handleClose}
              className="absolute w-screen h-screen z-10 top-0 left-0"
            />
          </div>,
          document.body
        )}
    </>
  );
};

export default ColumnMenu;
