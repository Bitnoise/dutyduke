import { type ReactNode, type Key, type ReactElement } from 'react';
import { type ComboBoxProps as RAComboBoxProps, type InputProps } from 'react-aria-components';

export type Item = { key: string | number } & (
  | { label: string }
  | { label: ReactElement; textValue: string }
);

export type ComboBoxProps<T extends object> = Omit<RAComboBoxProps<T>, 'items' | 'defaultItems'> & {
  /**
   * items to show inside the popover for user to select from
   * when label provided other than string textValue is required for accessibility
   */
  items: Item[];
  defaultItems?: Item[];
  label?: string | ReactNode;
  inputProps?: InputProps;
  errorMessage?: string;
};

export type TagFieldProps<T extends object> = Omit<ComboBoxProps<T>, 'onSelectionChange' | 'onKeyDown'> & {
  defaultSelectedTags?: Key[];
  onTagSelection?: (tags: Key[]) => void;
};
