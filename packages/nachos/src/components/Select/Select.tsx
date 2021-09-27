import React, { PropsWithChildren, useMemo, useRef } from 'react';
import ReactSelect, {
  components,
  OptionProps,
  OptionTypeBase,
  Props,
  StylesConfig,
} from 'react-select';
import cx from 'classnames';
import { getKey, Key } from '@trello/keybindings';
import {
  ELEVATION_ATTR,
  useCurrentElevation,
  useCallbackRef,
} from '@trello/layer-manager';
import { TEST_ID_ATTR, TestId } from '@trello/test-ids';

import {
  GLOBAL_NAMESPACE_PREFIX,
  ComponentStateActive,
  ComponentAppearanceCompact,
  ComponentStateDisabled,
  ComponentStateFocus,
  SelectClassnameLabel,
  ComponentStateSelected,
  ComponentAppearanceStatic,
  ComponentAppearanceSubtle,
  SelectClassnameBase,
  SelectClassnameContainer,
  SelectClassnameControl,
  SelectClassnameMenu,
  SelectClassnameOption,
  SelectClassnameVal,
  SelectControlCompactHeight,
  SelectControlCompactPaddingX,
  SelectControlCompactPaddingY,
  SelectControlDefaultBorder,
  SelectControlDefaultBorderRadius,
  SelectControlDefaultHeight,
  SelectControlDefaultPaddingX,
  SelectControlDefaultPaddingY,
  SelectGroupHeadingDefaultColor,
  SelectGroupHeadingDefaultFontSize,
  SelectGroupHeadingDefaultFontWeight,
  SelectGroupHeadingDefaultLineHeight,
  SelectGroupHeadingDefaultMarginBottom,
  SelectIndicatorsContainerDefaultPaddingRight,
  SelectInputCompactLeft,
  SelectInputCompactTop,
  SelectInputDefaultLeft,
  SelectInputDefaultMaxWidth,
  SelectInputDefaultTop,
  SelectSingleValueDefaultMarginLeft,
  SelectValueContainerDefaultMaxWidth,
  SelectValueContainerDefaultPadding,
  SelectValueContainerDefaultLoadingMaxWidth,
  SelectOptionDefaultSelectedBackgroundColor,
  SelectControlDefaultHoverBackgroundColor,
} from '../../../tokens';
import { ListCell, ListItem } from '../List';
import { truncateText } from '../Presentational';
import styles from './Select.less';

/**
 * NOTE: References https://github.com/JedWatson/react-select/blob/master/packages/react-select/src/Select.js
 * This select is effectively a wrapper around react-select.
 * There are some properties that we've omitted based on likelihood of
 * usage, but if there are missing props, we can definitely add more.
 * Other props are considered optional for our purposes, but provided
 * default prop values by react-select.
 */

export const SelectClasses = {
  SELECT: `${GLOBAL_NAMESPACE_PREFIX}${SelectClassnameBase}`,
  CONTAINER: `${GLOBAL_NAMESPACE_PREFIX}${SelectClassnameBase}-${SelectClassnameContainer}`,
  CONTROL: {
    BASE: `${GLOBAL_NAMESPACE_PREFIX}${SelectClassnameBase}__${SelectClassnameControl}`,
    FOCUS: `${GLOBAL_NAMESPACE_PREFIX}${SelectClassnameBase}__${SelectClassnameControl}--${ComponentStateFocus}`,
    COMPACT: `${GLOBAL_NAMESPACE_PREFIX}${SelectClassnameBase}__${SelectClassnameControl}--${ComponentAppearanceCompact}`,
    SUBTLE: `${GLOBAL_NAMESPACE_PREFIX}${SelectClassnameBase}__${SelectClassnameControl}--${ComponentAppearanceSubtle}`,
    DISABLED: `${GLOBAL_NAMESPACE_PREFIX}${SelectClassnameBase}__${SelectClassnameControl}--${ComponentStateDisabled}`,
  },
  MENU: `${GLOBAL_NAMESPACE_PREFIX}${SelectClassnameBase}__${SelectClassnameMenu}`,
  OPTION: {
    BASE: `${GLOBAL_NAMESPACE_PREFIX}${SelectClassnameBase}__${SelectClassnameOption}`,
    ACTIVE: `${GLOBAL_NAMESPACE_PREFIX}${SelectClassnameBase}__${SelectClassnameOption}--${ComponentStateActive}`,
    DISABLED: `${GLOBAL_NAMESPACE_PREFIX}${SelectClassnameBase}__${SelectClassnameOption}--${ComponentStateDisabled}`,
    SELECTED: `${GLOBAL_NAMESPACE_PREFIX}${SelectClassnameBase}__${SelectClassnameOption}--${ComponentStateSelected}`,
  },
  VALUE: `${GLOBAL_NAMESPACE_PREFIX}${SelectClassnameBase}__${SelectClassnameVal}`,
  LABEL: `${GLOBAL_NAMESPACE_PREFIX}${SelectClassnameBase}__${SelectClassnameLabel}`,
  // For usage with static selects
  // includes styles for indicator
  STATIC: `${GLOBAL_NAMESPACE_PREFIX}${SelectClassnameBase}--${ComponentAppearanceStatic}`,
};

interface OptionObject<Value = string, Label = string> {
  value: Value;
  label: Label;
  testId?: TestId;
  image?: string | React.ReactNode;
  meta?: string | React.ReactNode;
  isDisabled?: boolean;
}
type LabelType = string | React.ReactNode | null;

interface NachosSelectProps {
  /**
   * The visible appearance of a Select.
   * @default default
   */
  appearance?: 'default' | 'subtle';
  /**
   * By default, passing in the `styles` object negates that of the Nachos
   * component; if this prop is true, the styles objects will instead merge.
   * @default false
   */
  combineStyles?: boolean;
  /**
   * Adds class name to container wrapping the Select component.
   * @default undefined
   */
  containerClassName?: string;
  /**
   * Adds styles to the container wrapping the Select component.
   * @default undefined
   */
  containerStyle?: React.CSSProperties;
  /**
   * Select the currently focused option when the user
   * presses tab
   * @default true
   */
  isFocused?: boolean;
  /**
   * Provides a label for the select above the select button
   * @default null
   */
  label?: LabelType;
  /**
   * When opening the menu, scrolls the selected option into menu view
   * @default true
   */
  scrollIntoViewSelectedOption?: boolean;
  /**
   * Affects the height of the select control. This prop is intended to mirror
   * a prop with the same name in AKSelect: https://atlassian.design/components/select/code
   * @default default
   */
  spacing?: 'default' | 'compact';
  // value?: readonly OptionType[] | OptionType;

  /**
   * TRELLO INTERNAL
   * String to target select control element for automated test
   * @default null
   */
  testId?: TestId | string;
}

export type SelectProps<
  Custom extends OptionObject<Custom['value'], Custom['label']> = {
    label: string;
    value: string;
  },
  IsMulti extends boolean = false
> = Props<Custom, IsMulti> & NachosSelectProps;

const getSelectStyles = ({ isCompact = false, isLoading = false }) => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: (base: any) => {
    const {
      backgroundColor,
      border,
      borderColor,
      borderWidth,
      borderStyle,
      boxShadow,
      ...rest
    } = base;
    const compactStyles = isCompact
      ? {
          height: SelectControlCompactHeight,
          minHeight: SelectControlCompactHeight,
          padding: `${SelectControlCompactPaddingY} ${SelectControlCompactPaddingX}`,
        }
      : {};
    return {
      ...rest,
      borderRadius: SelectControlDefaultBorderRadius,
      border: SelectControlDefaultBorder,
      height: SelectControlDefaultHeight,
      minHeight: SelectControlDefaultHeight,
      position: 'relative',
      padding: `${SelectControlDefaultPaddingY} ${SelectControlDefaultPaddingX}`,
      ...compactStyles,
    };
  },
  valueContainer: () => ({
    padding: SelectValueContainerDefaultPadding,
    position: 'initial',
    display: 'inherit',
    width: '100%',
    maxWidth: isLoading
      ? SelectValueContainerDefaultLoadingMaxWidth
      : SelectValueContainerDefaultMaxWidth,
    maxHeight: '100%',
  }),
  input: (base: object, { isMulti = false }) => ({
    position: isMulti ? 'static' : 'absolute',
    top: isCompact ? SelectInputCompactTop : SelectInputDefaultTop,
    left: isCompact ? SelectInputCompactLeft : SelectInputDefaultLeft,
    maxWidth: SelectInputDefaultMaxWidth,
    // here we want to truncate the text, but not add on the ellipsis,
    // as people tend to continue to type in inputs and an ellipsis
    // at the end may be unexpected
    ...truncateText(false),
  }),
  option: (
    _base: object,
    { isDisabled, isSelected, isFocused }: OptionProps<OptionTypeBase, false>,
  ) => ({
    cursor: isDisabled ? 'initial' : 'pointer',
    backgroundColor: isDisabled
      ? null
      : isSelected
      ? SelectOptionDefaultSelectedBackgroundColor
      : isFocused
      ? SelectControlDefaultHoverBackgroundColor
      : null,
  }),
  singleValue: () => ({
    marginLeft: SelectSingleValueDefaultMarginLeft,
    width: '100%',
    ...truncateText(),
  }),
  multiValue: (provided: object) => ({
    ...provided,
    alignItems: 'center',
    margin: '0 2px',
  }),
  groupHeading: (base: object) => ({
    ...base,
    color: SelectGroupHeadingDefaultColor,
    fontSize: SelectGroupHeadingDefaultFontSize,
    fontWeight: SelectGroupHeadingDefaultFontWeight,
    lineHeight: SelectGroupHeadingDefaultLineHeight,
    marginBottom: SelectGroupHeadingDefaultMarginBottom,
  }),
  indicatorsContainer: (base: object) => ({
    ...base,
    paddingRight: SelectIndicatorsContainerDefaultPaddingRight,
  }),
});

const Option = <CustomOptionProps, IsMulti extends boolean>(
  props: OptionProps<CustomOptionProps & OptionTypeBase, IsMulti>,
) => {
  const {
    isSelected,
    selectProps: { isDisabled, isFocused },
    data: { label, meta, image, testId },
  } = props;

  const optionClassname = cx({
    [styles[SelectClasses.OPTION.BASE]]: true,
    [styles[SelectClasses.OPTION.SELECTED]]: isSelected,
    [styles[SelectClasses.OPTION.DISABLED]]: isDisabled,
    [styles[SelectClasses.OPTION.ACTIVE]]: isFocused,
  });

  return (
    <div {...{ [TEST_ID_ATTR]: testId }}>
      <components.Option className={optionClassname} {...props}>
        {!meta && !image ? (
          <ListItem>{label}</ListItem>
        ) : (
          <ListCell
            label={label}
            meta={meta}
            image={image}
            isSelected={isSelected}
          />
        )}
      </components.Option>
    </div>
  );
};

const Menu: typeof components.Menu = (props) => {
  // @ts-ignore
  // Here we pluck the menuElevation off the selectProps, so we can increment
  // the elevation of the menu relative to the select control
  const menuElevation = props?.selectProps?.menuElevation ?? 0;
  return (
    <div {...{ [ELEVATION_ATTR]: menuElevation }}>
      <components.Menu className={styles[SelectClasses.MENU]} {...props} />
    </div>
  );
};

const Control: typeof components.Control = (props) => {
  const controlClassname = cx({
    [styles[SelectClasses.CONTROL.BASE]]: true,
    [styles[SelectClasses.CONTROL.FOCUS]]: props.isFocused,
    [styles[SelectClasses.CONTROL.COMPACT]]:
      props.selectProps.spacing === 'compact',
    [styles[SelectClasses.CONTROL.SUBTLE]]:
      props.selectProps.appearance === 'subtle',
  });
  // in order to make the data-test-id attribute available for testing,
  // we pass the value to <Select /> then pass the value from selectProps (from
  // react-select)
  const testId = props?.selectProps?.testId ?? null;

  return (
    <div {...{ [TEST_ID_ATTR]: testId }}>
      <components.Control className={controlClassname} {...props} />
    </div>
  );
};

const DoNotRender: React.FunctionComponent<OptionTypeBase> = () => null;

/** Don't allow escape key presses to bubble up, to prevent closing Popovers. */
const stopPropagationOfEscapePress = (e: React.KeyboardEvent<HTMLElement>) => {
  if (getKey(e) === Key.Escape) {
    e.stopPropagation();
  }
};

export function Select<
  IsMulti extends boolean = false,
  CustomSelectProps extends OptionObject<
    CustomSelectProps['value'],
    CustomSelectProps['label']
  > = { label: string; value: string }
>({
  className,
  combineStyles,
  containerClassName,
  containerStyle,
  defaultValue,
  value,
  label,
  options,
  styles: selectStyles,
  testId,
  isSearchable = false,
  scrollIntoViewSelectedOption = true,
  // since we have some complex layer management with the react select
  // and popovers, setting this to the default prop prevents the select
  // menu from automatically pushing down the viewport
  // when the window is too small
  menuPosition = 'fixed',
  components: componentsFromProps,
  ...props
}: PropsWithChildren<SelectProps<CustomSelectProps, IsMulti>>) {
  const selectRef = useRef<ReactSelect<CustomSelectProps, IsMulti>>(null);

  // Calculate the elevation of the menu, based on the elevation of the select
  // control
  const [selectWrapper, selectWrapperRef] = useCallbackRef<HTMLDivElement>();
  const currentElevation = useCurrentElevation(selectWrapper);
  const menuElevation = currentElevation + 1;

  const selectClassName = cx(
    {
      [SelectClasses.SELECT]: true,
      [styles[SelectClasses.SELECT]]: true,
      [styles[SelectClasses.CONTROL.DISABLED]]: props.isDisabled,
    },
    className,
  );

  let labelEl = label;
  if (typeof label === 'string') {
    labelEl = <label className={styles[SelectClasses.LABEL]}>{label}</label>;
  }

  // if options are an array of strings,
  // map strings to objects
  options?.forEach((val, idx, arr) => {
    if (typeof val === 'string') {
      // @ts-expect-error
      arr[idx] = {
        value: val,
        label: val,
      };
    }
  });

  let selectVal = value;
  // if value is a string, map string to object
  if (typeof value === 'string') {
    selectVal = {
      // @ts-expect-error
      value: value,
      label: value,
    };
  }

  let selectDefaultVal = defaultValue;
  // if value is a string, map string to object
  if (typeof defaultValue === 'string') {
    selectDefaultVal = {
      // @ts-expect-error
      value: defaultValue,
      label: defaultValue,
    };
  }

  // teh haxxors - hijacking react-selects `openMenu` behavior
  // we are keeping everything the same except how we are finding the index of
  // the `selectValue`
  // Should keep up to date with original "openMenu" method
  // https://github.com/JedWatson/react-select/blob/master/packages/react-select/src/Select.tsx#L756
  const openMenuHandler = (focusOption: 'first' | 'last') => {
    if (!selectRef.current) {
      return;
    }

    const { select } = selectRef.current;
    const { selectValue, isFocused } = select.state;
    const { isMulti } = props;
    // @ts-expect-error
    const focusableOptions = select.buildFocusableOptions();
    let openAtIndex = focusOption === 'first' ? 0 : focusableOptions.length - 1;

    if (!isMulti && !!selectValue[0] && scrollIntoViewSelectedOption) {
      // previously this was looking up the object and was always returning -1
      const selectedIndex = focusableOptions.findIndex(
        (i: OptionObject) => i.value === selectValue[0].value,
      );

      if (selectedIndex > -1) {
        openAtIndex = selectedIndex;
      }
    }

    // only scroll if the menu isn't already open
    select.scrollToFocusedOptionOnUpdate = !(isFocused && select.menuListRef);

    select.setState(
      {
        // @ts-expect-error
        inputIsHiddenAfterUpdate: false,
        focusedValue: null,
        focusedOption: focusableOptions[openAtIndex],
      },
      () => select.onMenuOpen(),
    );
  };

  if (selectRef && selectRef.current) {
    selectRef.current!.select.openMenu = openMenuHandler;
  }

  const stylesResult = useMemo(() => {
    if (!combineStyles && selectStyles) {
      return selectStyles;
    }
    return {
      ...getSelectStyles({
        isCompact: props.spacing === 'compact',
        isLoading: props.isLoading,
      }),
      ...(selectStyles ?? {}),
    } as StylesConfig<OptionTypeBase, IsMulti>;
  }, [combineStyles, selectStyles, props.spacing, props.isLoading]);

  return (
    <div
      ref={selectWrapperRef}
      className={containerClassName}
      style={containerStyle}
    >
      {labelEl}
      <ReactSelect<CustomSelectProps, IsMulti>
        ref={selectRef}
        onKeyDown={stopPropagationOfEscapePress}
        className={selectClassName}
        styles={stylesResult}
        value={selectVal}
        defaultValue={selectDefaultVal}
        options={options}
        // eslint-disable-next-line react/jsx-no-bind
        isOptionDisabled={(option) => !!option.isDisabled}
        menuPortalTarget={document.body}
        menuPosition={menuPosition}
        isSearchable={isSearchable}
        components={{
          Menu,
          Option,
          Control,
          IndicatorSeparator: DoNotRender,
          DropdownIndicator: DoNotRender,
          ClearIndicator: DoNotRender,
          ...componentsFromProps,
        }}
        testId={testId}
        // Forward the menuElevation on as a prop, this will be accessed
        // by the Menu component in order to set the data-elevation attribute
        menuElevation={menuElevation}
        {...props}
      />
    </div>
  );
}

// expose react-select components API
// https://react-select.com/components
export const SelectComponents = components;
