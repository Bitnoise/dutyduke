import { type TagFieldProps, type ComboBoxProps } from './types';
import { ComboBox } from './combo-box';
import { TagField } from './tag-field';

type Props<T extends object> =
  | ({
      selectionMode?: 'multiple';
    } & TagFieldProps<T>)
  | ({ selectionMode?: 'single' } & ComboBoxProps<T>);

function ComboBoxBuilder<T extends object>({ selectionMode = 'single', ...other }: Props<T>) {
  switch (selectionMode) {
    case 'single':
      return <ComboBox {...other} />;
    case 'multiple':
      return <TagField {...other} />;
    default:
      return <ComboBox {...other} />;
  }
}

export { ComboBoxBuilder as ComboBox };
export { TagField } from './tag-field';
