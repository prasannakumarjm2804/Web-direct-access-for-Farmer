import React, { useState } from 'react';
import { FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';
import './FloatingLabelInput.css';

const FloatingLabelInput = ({
    type = 'text',
    label,
    placeholder,
    value,
    onChange,
    onFocus,
    onBlur,
    error,
    success,
    icon,
    disabled = false,
    required = false,
    name,
    id
}) => {
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [hasValue, setHasValue] = useState(!!value);

    const handleFocus = (e) => {
        setFocused(true);
        if (onFocus) onFocus(e);
    };

    const handleBlur = (e) => {
        setFocused(false);
        setHasValue(!!e.target.value);
        if (onBlur) onBlur(e);
    };

    const handleChange = (e) => {
        setHasValue(!!e.target.value);
        if (onChange) onChange(e);
    };

    const inputType = type === 'password' && showPassword ? 'text' : type;

    return (
        <div className={`floating-label-group ${focused ? 'focused' : ''} ${hasValue ? 'has-value' : ''} ${error ? 'error' : ''} ${success ? 'success' : ''}`}>
            <div className="input-wrapper">
                {icon && <div className="input-icon">{icon}</div>}
                <input
                    type={inputType}
                    id={id}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder=" "
                    disabled={disabled}
                    className="floating-input"
                />
                <label htmlFor={id} className="floating-label">
                    {label} {required && <span className="required">*</span>}
                </label>
                {type === 'password' && (
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                    >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                )}
                {success && !error && (
                    <div className="input-status success">
                        <FiCheck />
                    </div>
                )}
                {error && (
                    <div className="input-status error">
                        <FiX />
                    </div>
                )}
            </div>
            {error && <span className="error-message">{error}</span>}
            {success && !error && <span className="success-message">{success}</span>}
        </div>
    );
};

const FloatingLabelSelect = ({
    label,
    value,
    onChange,
    options,
    error,
    success,
    disabled = false,
    required = false,
    name,
    id,
    placeholder = 'Select an option'
}) => {
    const [focused, setFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!value);

    const handleFocus = () => setFocused(true);
    const handleBlur = () => {
        setFocused(false);
        setHasValue(!!value);
    };

    const handleChange = (e) => {
        setHasValue(!!e.target.value);
        if (onChange) onChange(e);
    };

    return (
        <div className={`floating-label-group ${focused ? 'focused' : ''} ${hasValue ? 'has-value' : ''} ${error ? 'error' : ''} ${success ? 'success' : ''}`}>
            <div className="input-wrapper">
                <select
                    id={id}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={disabled}
                    className="floating-input floating-select"
                >
                    <option value="">{placeholder}</option>
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <label htmlFor={id} className="floating-label">
                    {label} {required && <span className="required">*</span>}
                </label>
                {success && !error && (
                    <div className="input-status success">
                        <FiCheck />
                    </div>
                )}
                {error && (
                    <div className="input-status error">
                        <FiX />
                    </div>
                )}
            </div>
            {error && <span className="error-message">{error}</span>}
            {success && !error && <span className="success-message">{success}</span>}
        </div>
    );
};

const FloatingLabelTextarea = ({
    label,
    placeholder,
    value,
    onChange,
    onFocus,
    onBlur,
    error,
    success,
    disabled = false,
    required = false,
    name,
    id,
    rows = 4
}) => {
    const [focused, setFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!value);

    const handleFocus = (e) => {
        setFocused(true);
        if (onFocus) onFocus(e);
    };

    const handleBlur = (e) => {
        setFocused(false);
        setHasValue(!!e.target.value);
        if (onBlur) onBlur(e);
    };

    const handleChange = (e) => {
        setHasValue(!!e.target.value);
        if (onChange) onChange(e);
    };

    return (
        <div className={`floating-label-group ${focused ? 'focused' : ''} ${hasValue ? 'has-value' : ''} ${error ? 'error' : ''} ${success ? 'success' : ''}`}>
            <div className="input-wrapper textarea-wrapper">
                <textarea
                    id={id}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder=" "
                    disabled={disabled}
                    rows={rows}
                    className="floating-input floating-textarea"
                />
                <label htmlFor={id} className="floating-label">
                    {label} {required && <span className="required">*</span>}
                </label>
                {success && !error && (
                    <div className="input-status success">
                        <FiCheck />
                    </div>
                )}
                {error && (
                    <div className="input-status error">
                        <FiX />
                    </div>
                )}
            </div>
            {error && <span className="error-message">{error}</span>}
            {success && !error && <span className="success-message">{success}</span>}
        </div>
    );
};

export { FloatingLabelInput, FloatingLabelSelect, FloatingLabelTextarea };
