function Input({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder = "",
    required = false,
    disabled = false
}) {
    return (
        <div className="form-group">

            {label && (
                <label htmlFor={name}>
                    {label}
                    {required && <span className="required">*</span>}
                </label>
            )}

            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
            />

        </div>
    );
}

export default Input;