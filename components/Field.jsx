export default function Field({
  name,
  label,
  type,
  autoComplete,
  required,
  error = null,
  value,
  onChange,
}) {
  return (
    <div>
      <label id={[name, 'label'].join('-')} htmlFor={[name, 'input'].join('-')}>
        {label} {required ? <span title="Required">*</span> : undefined}
      </label>
      <br />
      <input
        autoComplete={autoComplete}
        id={[name, 'input'].join('-')}
        name={name}
        required={required}
        type={type}
        value={value}
        onChange={onChange}
      />
      {error && <small className="error-helper-text">{error}</small>}
    </div>
  );
}
