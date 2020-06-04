// Based on material-ui TextField
// https://github.com/mui-org/material-ui/tree/master/packages/material-ui/src/TextField

import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { refType } from '@material-ui/utils';
import Input from '@material-ui/core/Input';
import FilledInput from '@material-ui/core/FilledInput';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl, { useFormControl } from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import withStyles from '@material-ui/core/styles/withStyles';

import MediumEditor from './MediumEditor';

const variantComponent = {
  standard: Input,
  filled: FilledInput,
  outlined: OutlinedInput,
};

export const styles = {
  /* Styles applied to the root element. */
  root: {},
};

// Okay, this logic is way crazy... was needed to set the label appropriately
// when already filled.  For some reason it detects as filled, then not filled
// at load
const FilledHandler = React.memo(({ value }) => {
  const { onFilled, filled } = useFormControl();

  React.useEffect(() => {
    if (!filled && onFilled && value && value.trim()) {
      //setTimeout(onFilled, 10);
      onFilled();
    }
  }, [filled]);
  return null;
});

/**
 * The `MediumEditorField` is a convenience wrapper for the most common cases (80%).
 * It cannot be all things to all people, otherwise the API would grow out of control.
 *
 * ## Advanced Configuration
 *
 * It's important to understand that the text field is a simple abstraction
 * on top of the following components:
 *
 * - [FormControl](/api/form-control/)
 * - [InputLabel](/api/input-label/)
 * - [FilledInput](/api/filled-input/)
 * - [OutlinedInput](/api/outlined-input/)
 * - [Input](/api/input/)
 * - [FormHelperText](/api/form-helper-text/)
 *
 * If you wish to alter the props applied to the `input` element, you can do so as follows:
 *
 * ```jsx
 * const inputProps = {
 *   step: 300,
 * };
 *
 * return <MediumEditorField id="time" type="time" inputProps={inputProps} />;
 * ```
 *
 * For advanced cases, please look at the source of MediumEditorField by clicking on the
 * "Edit this page" button above. Consider either:
 *
 * - using the upper case props for passing values directly to the components
 * - using the underlying components directly as shown in the demos
 */
const MediumEditorField = React.forwardRef(function MediumEditorField(props: any, ref) {
  const containerEl = React.useRef();

  const {
    autoComplete,
    autoFocus = false,
    children,
    classes,
    className,
    color = 'primary',
    defaultValue,
    disabled = false,
    error = false,
    FormHelperTextProps,
    fullWidth = false,
    helperText,
    hiddenLabel,
    id,
    InputLabelProps,
    inputProps,
    InputProps,
    inputRef,
    label,
    multiline = false,
    name,
    onBlur,
    onChange,
    onFocus,
    placeholder,
    required = false,
    rows,
    rowsMax,
    type,
    value,
    variant = 'standard',
    ...other
  } = props;

  React.useEffect(() => {
    containerEl.current.addEventListener('click', () => {
      setTimeout(() => containerEl.current.querySelector('[contenteditable]').focus(), 10);
    });
  }, []);

  const InputMore = {};

  if (variant === 'outlined') {
    if (InputLabelProps && typeof InputLabelProps.shrink !== 'undefined') {
      InputMore.notched = InputLabelProps.shrink;
    }
    if (label) {
      const displayRequired = (InputLabelProps && InputLabelProps.required) || required;
      InputMore.label = (
        <React.Fragment>
          {label}
          {displayRequired && '\u00a0*'}
        </React.Fragment>
      );
    }
  }

  const helperTextId = helperText && id ? `${id}-helper-text` : undefined;
  const inputLabelId = label && id ? `${id}-label` : undefined;
  const InputComponent = variantComponent[variant];
  const InputElement = (
    <InputComponent
      aria-describedby={helperTextId}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      defaultValue={defaultValue}
      fullWidth={fullWidth}
      multiline={multiline}
      name={name}
      rows={rows}
      rowsMax={rowsMax}
      type={type}
      value={(value || '').trim()}
      id={id}
      inputRef={inputRef}
      onBlur={onBlur}
      onChange={onChange}
      onFocus={onFocus}
      placeholder={placeholder}
      inputProps={{
        ...inputProps,
        options: {
          placeholder: false,
          toolbar: {
            buttons: ['bold', 'italic', 'h1', 'h2', 'h3', 'anchor', 'orderedlist', 'unorderedlist'],
          },
        },
        style: {
          width: 'calc(100% + 28px)',
          outline: '0px solid transparent',
          margin: '-18.5px -14px',
          padding: '18.5px 14px',
          ...(inputProps && inputProps.style),
        },
        height: rows ? `calc(${rows * 1.25}em + 37px)` : null,
        minHeight: '1em',
      }}
      {...InputMore}
      {...InputProps}
      inputComponent={MediumEditor}
    />
  );

  return (
    <FormControl
      className={clsx(classes.root, className)}
      disabled={disabled}
      error={error}
      fullWidth={fullWidth}
      hiddenLabel={hiddenLabel}
      ref={containerEl}
      required={required}
      color={color}
      variant={variant}
      {...other}>
      <FilledHandler value={value} />

      {label && (
        <InputLabel htmlFor={id} id={inputLabelId} {...InputLabelProps}>
          {label}
        </InputLabel>
      )}
      {InputElement}

      {helperText && (
        <FormHelperText id={helperTextId} {...FormHelperTextProps}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
});

MediumEditorField.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * This prop helps users to fill forms faster, especially on mobile devices.
   * The name can be confusing, as it's more like an autofill.
   * You can learn more about it [following the specification](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill).
   */
  autoComplete: PropTypes.string,
  /**
   * If `true`, the `input` element will be focused during the first mount.
   */
  autoFocus: PropTypes.bool,
  /**
   * @ignore
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   * See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * The color of the component. It supports those theme colors that make sense for this component.
   */
  color: PropTypes.oneOf(['primary', 'secondary']),
  /**
   * The default value of the `input` element.
   */
  defaultValue: PropTypes.any,
  /**
   * If `true`, the `input` element will be disabled.
   */
  disabled: PropTypes.bool,
  /**
   * If `true`, the label will be displayed in an error state.
   */
  error: PropTypes.bool,
  /**
   * Props applied to the [`FormHelperText`](/api/form-helper-text/) element.
   */
  FormHelperTextProps: PropTypes.object,
  /**
   * If `true`, the input will take up the full width of its container.
   */
  fullWidth: PropTypes.bool,
  /**
   * The helper text content.
   */
  helperText: PropTypes.node,
  /**
   * @ignore
   */
  hiddenLabel: PropTypes.bool,
  /**
   * The id of the `input` element.
   * Use this prop to make `label` and `helperText` accessible for screen readers.
   */
  id: PropTypes.string,
  /**
   * Props applied to the [`InputLabel`](/api/input-label/) element.
   */
  InputLabelProps: PropTypes.object,
  /**
   * [Attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Attributes) applied to the `input` element.
   */
  inputProps: PropTypes.object,
  /**
   * Props applied to the Input element.
   * It will be a [`FilledInput`](/api/filled-input/),
   * [`OutlinedInput`](/api/outlined-input/) or [`Input`](/api/input/)
   * component depending on the `variant` prop value.
   */
  InputProps: PropTypes.object,
  /**
   * Pass a ref to the `input` element.
   */
  inputRef: refType,
  /**
   * The label content.
   */
  label: PropTypes.node,
  /**
   * If `dense` or `normal`, will adjust vertical spacing of this and contained components.
   */
  margin: PropTypes.oneOf(['dense', 'none', 'normal']),
  /**
   * If `true`, a textarea element will be rendered instead of an input.
   */
  multiline: PropTypes.bool,
  /**
   * Name attribute of the `input` element.
   */
  name: PropTypes.string,
  /**
   * @ignore
   */
  onBlur: PropTypes.func,
  /**
   * Callback fired when the value is changed.
   *
   * @param {object} event The event source of the callback.
   * You can pull out the new value by accessing `event.target.value` (string).
   */
  onChange: PropTypes.func,
  /**
   * @ignore
   */
  onFocus: PropTypes.func,
  /**
   * The short hint displayed in the input before the user enters a value.
   */
  placeholder: PropTypes.string,
  /**
   * If `true`, the label is displayed as required and the `input` element` will be required.
   */
  required: PropTypes.bool,
  /**
   * Number of rows to display when multiline option is set to true.
   */
  rows: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * Maximum number of rows to display when multiline option is set to true.
   */
  rowsMax: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * Render a [`Select`](/api/select/) element while passing the Input element to `Select` as `input` parameter.
   * If this option is set you must pass the options of the select as children.
   */
  select: PropTypes.bool,
  /**
   * Props applied to the [`Select`](/api/select/) element.
   */
  SelectProps: PropTypes.object,
  /**
   * The size of the text field.
   */
  size: PropTypes.oneOf(['medium', 'small']),
  /**
   * Type of the `input` element. It should be [a valid HTML5 input type](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types).
   */
  type: PropTypes.string,
  /**
   * The value of the `input` element, required for a controlled component.
   */
  value: PropTypes.any,
  /**
   * The variant to use.
   */
  variant: PropTypes.oneOf(['filled', 'outlined', 'standard']),
};

export default React.memo(withStyles(styles, { name: 'MuiMediumEditorField' })(MediumEditorField));
