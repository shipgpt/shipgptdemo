import React from "react";

export function Input(props) {
  const {
    type,
    placeholder,
    id,
    onChange,
    onKeyDown,
    defaultValue,
    value,
    disabled,
    name,
    ariaLabel,
    ariaDescribedby,
    onFocus,
    onBlur,
    style,
    className,
    checked,
    onClick,
    maxLength,
    refs,
    max,
    MainClass,
    minLength,
    required,
    autoComplete,
    readOnly,
    tabIndex,
    autoFocus,
    mainMargin,
  } = props;

  return (
    <>
      <div
        onFocus={onFocus}
        onBlur={onBlur}
        className={`my-${
          !mainMargin ? "1" : mainMargin
        } w-100 ${MainClass} position-relative`}
      >
        <input
          onWheel={(e) => e.target.blur()}
          id={id}
          minLength={minLength}
          placeholder={placeholder}
          onChange={onChange}
          type={type}
          required={required}
          className={`form-control inputMian ${className}`}
          value={value}
          disabled={disabled}
          onKeyDown={onKeyDown}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedby}
          defaultValue={defaultValue}
          name={name}
          onClick={onClick}
          maxLength={maxLength}
          max={max}
          style={style}
          checked={checked}
          ref={refs}
          autoComplete={autoComplete}
          readOnly={readOnly}
          tabIndex={tabIndex}
          autoFocus={autoFocus}
        />
      </div>
    </>
  );
}
