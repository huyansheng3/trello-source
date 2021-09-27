import React, {
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  useMemo,
} from 'react';
import cx from 'classnames';
import { TestId, TestClass } from '@trello/test-ids';
import { useFocusRing } from '@react-aria/focus';
import { ComponentStateIndeterminate } from '../../../tokens';
import { makeComponentClasses } from '../makeComponentClasses';
import { CheckmarkGlyph, CheckmarkIndeterminateGlyph } from './CheckmarkGlyph';
import styles from './Checkbox.less';

// https://www.w3.org/TR/wai-aria-practices/#checkbox
type _CheckboxState =
  | boolean
  | typeof ComponentStateIndeterminate
  | Array<number | string>;

interface CheckboxState {
  checkboxState: _CheckboxState;
  setCheckboxState: React.Dispatch<React.SetStateAction<_CheckboxState>>;
}

export interface CheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'checked' | 'required' | 'disabled'
  > {
  /**
   * A string of classnames to be applied
   */
  className?: string;
  /**
   * Whether the checkbox should begin checked or not. Providing this prop implies that this is an uncontrolled component and should be mutually exclusive of the `checked` prop.
   * @default undefined
   */
  defaultChecked?: boolean;
  /**
   * The string or React element to render next to the checkbox
   */
  label?: string | React.ReactNode;
  /**
   * Optional classname for the rendered label prop.
   */
  labelClassName?: string;
  /**
   * Whether the checkbox is checked or not. Providing this prop explicitly will make this a controlled component. Corresponds to the `checked` HTML attribute.
   * @default undefined
   */
  isChecked?: boolean;
  /**
   * If `true`, the checkbox is disabled and can't be interacted with. Corresponds to the `disabled` HTML attribute.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * If `true`, the checkbox will display the indeterminate icon and sets the aria-checked value to "mixed". This is another way of doing `setCheckboxState('indeterminate')` but the two should not be used together, and it is preferred to use `setCheckboxState`
   * @default false
   */
  isIndeterminate?: boolean;
  /**
   * If `true`, the checkbox will change the appearence to display the failed validation.
   * @default false
   */
  isInvalid?: boolean;
  /**
   * If `true`, the checkbox must be checked to proceed. Correponds to the `required` HTML attribute.
   * @default false
   */
  isRequired?: boolean;
  /**
   * A string to help identify the component during integration tests.
   */
  testId?: TestId;
  testClass?: TestClass;
  /**
   * The value that is assigned to the specific checkbox. This is the value that will be sent to a form, if applicable. If multiple checkboxes are sharing the same state, the checkboxes value will be added to an array.
   */
  value?: string | number;
  /**
   * Used with `useCheckboxState`. The internal state of the checkbox. If there are multiple checkboxes, this will be an array of the checkbox values that are checked.
   */
  checkboxState?: CheckboxState['checkboxState'];
  /**
   * Used with `useCheckboxState`. Sets the checkbox state.
   */
  setCheckboxState?: CheckboxState['setCheckboxState'];
}

type UseCheckboxArgs = Pick<
  CheckboxProps,
  | 'isChecked'
  | 'isDisabled'
  | 'isRequired'
  | 'isInvalid'
  | 'defaultChecked'
  | 'onChange'
  | 'isIndeterminate'
  | 'value'
> & {
  checkboxState: _CheckboxState;
  setCheckboxState: React.Dispatch<React.SetStateAction<_CheckboxState>>;
};

const getChecked = (
  options: Pick<UseCheckboxArgs, 'isChecked' | 'value' | 'defaultChecked'> & {
    checkboxState: _CheckboxState;
  },
) => {
  if (options.isChecked !== undefined) {
    return options.isChecked;
  }

  if (options.defaultChecked) {
    return undefined;
  }

  if (!options.value) {
    return !!options.checkboxState;
  }

  const state = Array.isArray(options.checkboxState)
    ? options.checkboxState
    : [];

  return state.indexOf(options.value) !== -1;
};

// https://github.com/reach/reach-ui/blob/main/packages/checkbox/src/mixed.tsx#L421
const useControlledSwitchWarning = (
  controlPropValue: boolean | undefined,
  controlPropName: string,
  componentName: string,
) => {
  /*
   * Determine whether or not the component is controlled and warn the developer
   * if this changes unexpectedly.
   */
  const isControlled = useMemo(() => controlPropValue !== undefined, [
    controlPropValue,
  ]);
  const wasControlled = useRef(isControlled);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!isControlled && wasControlled.current) {
        console.warn(
          `${componentName} is changing from controlled to uncontrolled. Decide between using a controlled or uncontrolled ${componentName} for the lifetime of the component. Check the \`${controlPropName}\` prop being passed in.`,
        );
      }
      if (isControlled && !wasControlled.current) {
        console.warn(
          `${componentName} is changing from uncontrolled to controlled. Decide between using a controlled or uncontrolled ${componentName} for the lifetime of the component. Check the \`${controlPropName}\` prop being passed in.`,
        );
      }
    }
  }, [componentName, controlPropName, isControlled]);
};

const useCheckbox = (
  ref: React.RefObject<HTMLInputElement>,
  args: UseCheckboxArgs,
) => {
  const {
    isChecked,
    defaultChecked,
    isDisabled,
    isIndeterminate,
    isInvalid,
    onChange: htmlOnChange,
    isRequired,
    value,
    checkboxState,
    setCheckboxState,
  } = args || {};

  const onChangeRef = useRef(htmlOnChange);
  const getCheckedVal = getChecked({
    isChecked,
    value,
    checkboxState,
    defaultChecked,
  });

  useControlledSwitchWarning(isChecked, 'checked', 'NachosCheckbox');

  useLayoutEffect(() => {
    onChangeRef.current = htmlOnChange;
  });

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) {
      if (isIndeterminate || checkboxState === ComponentStateIndeterminate) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            "Can't set indeterminate state because `ref` wasn't passed to component",
          );
        }
      }
      return;
    }
    if (isIndeterminate || checkboxState === ComponentStateIndeterminate) {
      element.indeterminate = true;
    } else {
      element.indeterminate = false;
    }
  }, [isIndeterminate, checkboxState, ref]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isDisabled) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }

    if (onChangeRef.current) {
      onChangeRef.current(event);
    }

    // value is usually used to differentiate multiple checkboxes
    if (!value) {
      setCheckboxState(!getCheckedVal);
    } else {
      const multiCheckStates = Array.isArray(checkboxState)
        ? checkboxState
        : [];
      const idx = multiCheckStates.indexOf(value);
      if (idx === -1) {
        setCheckboxState([...multiCheckStates, value]);
      } else {
        const filtered = multiCheckStates.filter((_, i) => i !== idx);
        setCheckboxState(filtered);
      }
    }
  };

  return {
    'aria-checked':
      checkboxState === ComponentStateIndeterminate
        ? ('mixed' as const)
        : getCheckedVal,
    'aria-disabled': isDisabled,
    'aria-invalid': isInvalid || (isRequired === true && !getCheckedVal),
    checked: getCheckedVal,
    defaultChecked,
    disabled: isDisabled,
    onChange,
    ref,
    required: isRequired,
    value,
  };
};

export const useCheckboxState = (
  initialCheckboxState: Partial<Pick<CheckboxState, 'checkboxState'>>,
): CheckboxState => {
  const [initialState] = useState(initialCheckboxState);
  const { checkboxState: initialValue = false } = initialState;

  const [checkboxState, setCheckboxState] = useState(initialValue);
  return { checkboxState, setCheckboxState };
};

export const Checkbox: React.FC<CheckboxProps> = (props: CheckboxProps) => {
  const {
    className,
    defaultChecked,
    label,
    labelClassName,
    isChecked,
    isDisabled = false,
    isIndeterminate = false,
    isInvalid = false,
    isRequired = false,
    onChange,
    value,
    checkboxState: providedState,
    setCheckboxState: providedSetState,
    testId,
    testClass,
    ...htmlProps
  } = props;
  const checkRef = React.useRef(null);

  const { isFocusVisible, focusProps } = useFocusRing();
  const {
    checkboxState: defaultState,
    setCheckboxState: defaultSetState,
  } = useCheckboxState({
    checkboxState: isIndeterminate
      ? ComponentStateIndeterminate
      : defaultChecked
      ? defaultChecked
      : isChecked
      ? isChecked
      : false,
  });

  const inputProps = useCheckbox(checkRef, {
    defaultChecked,
    isChecked,
    isDisabled,
    isIndeterminate,
    isInvalid,
    isRequired,
    onChange,
    value,
    checkboxState: providedState ? providedState : defaultState,
    setCheckboxState: providedSetState ? providedSetState : defaultSetState,
  });

  const showIndeterminate =
    isIndeterminate || providedState === ComponentStateIndeterminate;

  const { componentCx: checkboxCx } = makeComponentClasses(
    Checkbox.displayName!,
  );

  return (
    <label
      className={cx(
        styles[checkboxCx()],
        styles[checkboxCx('label')],
        {
          [styles[checkboxCx('', 'disabled')]]: isDisabled,
          [styles[
            checkboxCx('', ComponentStateIndeterminate)
          ]]: showIndeterminate,
        },
        className,
      )}
    >
      <input
        className={styles[checkboxCx('input')]}
        type="checkbox"
        data-test-id={testId}
        data-test-class={testClass}
        {...htmlProps}
        {...inputProps}
        {...focusProps}
      />
      <span
        className={cx(styles[checkboxCx('box')], {
          [styles[checkboxCx('checkedBox')]]: isChecked,
          [styles[checkboxCx('box', 'focusVisible')]]: isFocusVisible,
          [styles[checkboxCx('box', 'invalid')]]: inputProps['aria-invalid'],
        })}
      >
        <span className={styles[checkboxCx('checkIcon')]}>
          {showIndeterminate ? (
            <CheckmarkIndeterminateGlyph />
          ) : (
            <CheckmarkGlyph />
          )}
        </span>
      </span>
      <span className={cx(styles[checkboxCx('labelContent')], labelClassName)}>
        {label}
      </span>
    </label>
  );
};
Checkbox.displayName = 'Checkbox';
